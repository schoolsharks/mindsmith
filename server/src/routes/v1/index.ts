import express, { Router } from "express";
import { fetchUser, login, register, verifyOTP } from "../../modules/auth/auth.controller";
import {
  createOrder,
  verifyPayment,
  getRazorpayConfig,
} from "../../modules/payment/payment.controller";
import { checkPaymentStatus } from "../../middlewares/paymentStatus";
import assessmentRoutes from "../../modules/assessment/routes/assessment.routes";
import { authenticateUser } from "../../middlewares/authMiddleware";

const router: Router = express.Router(); // Explicitly type the router

// Auth routes
router.post(
  "/auth/register",
  checkPaymentStatus,
  register as express.RequestHandler
); // This should now work
router.post("/auth/login", login as express.RequestHandler);
router.post("/auth/verify-otp", verifyOTP as express.RequestHandler);
router.get(
  "/auth/fetch-user",
  authenticateUser,
  fetchUser as express.RequestHandler
);

// Assuming login uses the same controller for now
// Payment routes
router.post("/payment/create-order", createOrder);
router.post("/payment/verify", verifyPayment as express.RequestHandler);
router.get("/payment/config", getRazorpayConfig);

// Assessment (Q) routes
router.use("/assessment", assessmentRoutes);

export default router;
