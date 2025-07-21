import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import crypto from 'crypto';
import { User } from '../user/user.model';
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

    const generatedSignature = crypto
      .createHmac('sha256', "onyTK8C1TRmHnEAbtkDwqR94")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Payment verification failed'
      });
    }

    // Update user payment status
    await User.findByIdAndUpdate(userId, {
      paymentStatus: 'completed',
      paymentId: razorpay_payment_id
    });

    res.status(httpStatus.OK).json({
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error verifying payment',
      // error: error.message
    });
  }
};