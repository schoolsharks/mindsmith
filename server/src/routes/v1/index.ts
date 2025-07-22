import express, { Router } from 'express';
import { register } from '../../modules/auth/auth.controller';
import { createOrder, verifyPayment } from '../../modules/payment/payment.controller';
import { checkPaymentStatus } from '../../middlewares/paymentStatus';

const router: Router = express.Router(); // Explicitly type the router

// Auth routes
router.post('/auth/register', checkPaymentStatus, register as express.RequestHandler); // This should now work

// Payment routes
router.post('/payment/create-order', createOrder);
router.post('/payment/verify', verifyPayment as express.RequestHandler);

export default router;