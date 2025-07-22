import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import crypto from 'crypto';
import { User } from '../user/user.model';
import { PaymentDetails } from './payment.model';
import razorpay from '../../config/razorpay';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency, userId } = req.body;

    const options = {
      amount,
      currency,
      receipt: `receipt_${userId}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.status(httpStatus.CREATED).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      userId
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating payment order',
      // error: error.message
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Payment verification failed'
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'User not found'
      });
    }

    // Create payment record
    const paymentRecord = await PaymentDetails.create({
      user: userId,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      bank: payment.bank,
      wallet: payment.wallet,
      cardId: payment.card_id,
      vpa: payment.vpa,
      email: user.email,
      contact: user.contact,
      fee: payment.fee,
      tax: payment.tax
    });

    // Update user payment status
    user.paymentStatus = 'completed';
    user.paymentId = razorpay_payment_id;
    if (!user.payments) user.payments = []; // Initialize if using payments array
    user.payments.push(paymentRecord._id);
    await user.save();

    res.status(httpStatus.OK).json({
      message: 'Payment verified and recorded successfully',
      paymentId: razorpay_payment_id,
      paymentDetails: {
        id: paymentRecord._id,
        amount: paymentRecord.amount / 100, // Convert to rupees
        currency: paymentRecord.currency,
        method: paymentRecord.method,
        status: paymentRecord.status,
        createdAt: paymentRecord.createdAt
      }
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error verifying payment',
      error: error.message
    });
  }
};