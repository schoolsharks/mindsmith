import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  
  const token = req.cookies.accessToken;
  


  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    return; // Ensure function exits here
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: mongoose.Types.ObjectId; role: 'USER' | 'ADMIN' };
    req.user = decoded;
    next(); 
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    return; 
  }
};


export const authorizeRoles = (...roles: ('USER' | 'ADMIN')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      return; 
    }
    next();
  };
};



