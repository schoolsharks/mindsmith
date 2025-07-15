import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateAccessToken = (id: string,role:"USER"|"ADMIN") => {
  return jwt.sign(
    { id ,role},
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY || '900', 10), 
    }
  );
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '604800', 10), 
    }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
  } catch (error) {
    throw new Error('Invalid token');
  }
};