import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const checkPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user && user.paymentStatus === "completed") {
      res.status(httpStatus.CONFLICT).json({
        message: "Payment already completed for this email",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
