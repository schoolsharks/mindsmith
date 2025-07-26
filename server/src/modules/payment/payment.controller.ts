import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import { PaymentDetails } from "./payment.model";
import razorpay from "../../config/razorpay";
import mongoose from "mongoose";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    // const fixedAmount = 2500 * 100; // ₹2500 in paise
    const fixedAmount = 1 * 100; // ₹1 in paise

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const options = {
      amount: fixedAmount,
      currency: "INR",
      receipt: `msm_${userId}`, // msm = Mind Smith
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    // console.log(order);

    res.status(httpStatus.CREATED).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      userId,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error creating payment order",
      error: error.message || "Unknown error",
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
    } = req.body;

    // Verify signature first
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Payment verification failed",
      });
    }

    // Check if payment was already processed by another request
    const existingPayment = await PaymentDetails.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });
    if (existingPayment) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Payment was already processed",
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Get user with lock to prevent race conditions
    const user = await User.findOneAndUpdate(
      { _id: userId, paymentStatus: { $ne: "completed" } },
      { $set: { paymentStatus: "processing" } },
      { new: true }
    );

    if (!user) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Payment already completed or user not found",
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
      tax: payment.tax,
    });

    // Finalize user update
    user.paymentStatus = "completed";
    user.paymentId = razorpay_payment_id;
    user.payments = user.payments || [];
    user.payments.push(paymentRecord._id);
    await user.save();

    // Generate access token after successful payment verification
    const accessToken = jwt.sign(
      { id: user._id, role: "USER" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set cookie with token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(httpStatus.OK).json({
      message: "Payment verified and recorded successfully",
      paymentId: razorpay_payment_id,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        paymentStatus: user.paymentStatus,
      },
      paymentDetails: {
        id: paymentRecord._id,
        amount: paymentRecord.amount / 100,
        currency: paymentRecord.currency,
        method: paymentRecord.method,
        status: paymentRecord.status,
        createdAt: paymentRecord.createdAt,
      },
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

export const getRazorpayConfig = (req: Request, res: Response) => {
  res.status(200).json({
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  });
};
