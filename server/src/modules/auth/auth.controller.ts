import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';


export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { name, email, contact } = req.body;
    

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: 'User already exists'
      });
    }
    console.log(req.body);

    // Create new user with pending payment status
    const user = await User.create({
      name,
      email,
      contact,
      paymentStatus: 'pending'
    });

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