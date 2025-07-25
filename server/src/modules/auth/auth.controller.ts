import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, contact } = req.body;

    // Check for existing user with COMPLETED payment using either email or contact
    const existingPaidUser = await User.findOne({
      $or: [
        { email, paymentStatus: "completed" },
        { contact, paymentStatus: "completed" },
      ],
    });

    if (existingPaidUser) {
      const conflictField =
        existingPaidUser.email === email ? "email" : "contact";
      return res.status(httpStatus.CONFLICT).json({
        message: `User with this ${conflictField} already exists and has completed payment`,
      });
    }

    // Check for existing user with pending/failed payment
    const existingUnpaidUser = await User.findOne({
      $or: [
        { email, paymentStatus: { $in: ["pending", "failed"] } },
        { contact, paymentStatus: { $in: ["pending", "failed"] } },
      ],
    });

    // Either create new user or update existing unpaid user
    let user;
    if (existingUnpaidUser) {
      // Prevent changing email/contact if another user has completed payment with them
      const paidUserWithSameDetails = await User.findOne({
        $or: [
          {
            email: existingUnpaidUser.email !== email ? email : null,
            paymentStatus: "completed",
          },
          {
            contact: existingUnpaidUser.contact !== contact ? contact : null,
            paymentStatus: "completed",
          },
        ],
        _id: { $ne: existingUnpaidUser._id },
      });

      if (paidUserWithSameDetails) {
        const conflictField =
          paidUserWithSameDetails.email === email ? "email" : "contact";
        return res.status(httpStatus.CONFLICT).json({
          message: `User with this ${conflictField} already exists and has completed payment`,
        });
      }

      // Update existing record with new details
      existingUnpaidUser.name = name;
      if (existingUnpaidUser.email !== email) existingUnpaidUser.email = email;
      if (existingUnpaidUser.contact !== contact)
        existingUnpaidUser.contact = contact;
      existingUnpaidUser.paymentStatus = "pending";
      user = await existingUnpaidUser.save();
    } else {
      // Create new user with pending payment status
      user = await User.create({
        name,
        email,
        contact,
        paymentStatus: "pending",
      });
    }

    // After creating/updating user, generate token
    const accessToken = jwt.sign(
      { id: user._id, role: "USER" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    // Set cookie with token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "developement",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(httpStatus.CREATED).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        paymentStatus: user.paymentStatus,
      },
      accessToken, // Also send token in response if needed
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({
      email,
      paymentStatus: "completed",
    });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid email or user not found",
      });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { id: user._id, role: "USER" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    // Set cookie with token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "developement",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(httpStatus.OK).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        paymentStatus: user.paymentStatus,
      },
      accessToken,
    });
  } catch (error: any) {

    console.error("Login error:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error logging in user",
      error: error.message,
    });
  }
};



export const fetchUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    res.status(httpStatus.OK).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        paymentStatus: user.paymentStatus,
      },
    });
  } catch (error: any) {
    console.error("Fetch user error:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
}