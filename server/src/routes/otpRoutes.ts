import express from 'express';
import { sendOTP, verifyOTP, sendPhoneOTP, verifyPhoneOTP } from '../controllers/otpController';

const router = express.Router();

// Email OTP routes
router.post('/send', sendOTP as express.RequestHandler);
router.post('/verify', verifyOTP as express.RequestHandler);

// Phone OTP routes
router.post('/send-phone', sendPhoneOTP as express.RequestHandler);
router.post('/verify-phone', verifyPhoneOTP as express.RequestHandler);

export default router;