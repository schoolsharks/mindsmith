import { User } from '../modules/user/user.model';
import httpStatus from 'http-status-codes';

export const checkPaymentStatus = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (user && user.paymentStatus === 'completed') {
      return res.status(httpStatus.CONFLICT).json({
        message: 'Payment already completed for this email'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};