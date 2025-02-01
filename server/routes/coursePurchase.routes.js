import express from "express";
import isAuthenticated from "../middlewares/user.middleware.js";
import {
  createCheckoutSession,
  getCourseDetailsWithPurchaseStatus,
  getPurchasedCourses,
  stripeWebhook,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(express.raw({ type: "application/json" }), stripeWebhook);
router.route("/courses/:courseId/details-with-status").get(isAuthenticated, getCourseDetailsWithPurchaseStatus);
router.route("/getPurchasedCourses").get(isAuthenticated, getPurchasedCourses);

export default router;