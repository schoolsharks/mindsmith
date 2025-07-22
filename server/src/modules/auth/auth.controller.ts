import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, contact } = req.body;

    // Check for existing user with COMPLETED payment
    const existingPaidUser = await User.findOne({ 
      email,
      paymentStatus: 'completed'
    });

    if (existingPaidUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: 'User with this email already exists and has completed payment'
      });
    }

    // Check for existing user with pending/failed payment
    const existingUnpaidUser = await User.findOne({ 
      email,
      paymentStatus: { $in: ['pending', 'failed'] }
    });

    // Either create new user or update existing unpaid user
    let user;
    if (existingUnpaidUser) {
      // Update existing record with new details
      existingUnpaidUser.name = name;
      existingUnpaidUser.contact = contact;
      existingUnpaidUser.paymentStatus = 'pending';
      user = await existingUnpaidUser.save();
    } else {
      // Create new user with pending payment status
      user = await User.create({
        name,
        email,
        contact,
        paymentStatus: 'pending'
      });
    }

    res.status(httpStatus.CREATED).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        paymentStatus: user.paymentStatus
      }
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};