import { Request, Response } from 'express';
import OTPVerification from '../models/OTPVerification';
import { generateOTP, hashOTP, generateExpiryTime } from '../utils/otpUtils';
import { sendVerificationEmail } from '../services/emailService';
import { sendVerificationSMS } from '../services/smsService';

// Send OTP for email verification
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log('Sending email OTP request received for:', email);

    if (!email) {
      console.log('Email is missing in request');
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if there's a recent OTP that's not expired yet (within the last 2 minutes)
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
    
    const recentOTP = await OTPVerification.findOne({
      email,
      type: 'email',
      expiresAt: { $gt: new Date() },
      createdAt: { $gt: twoMinutesAgo }
    });
    
    if (recentOTP) {
      console.log('Recent OTP already exists for this email. Returning existing OTP info.');
      return res.status(200).json({
        message: 'OTP already sent. Please check your email or wait before requesting a new code.',
        email,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('Generated OTP (not hashed):', otp);
    const hashedOTP = hashOTP(otp);
    console.log('Hashed OTP for storage:', hashedOTP);
    const expiryTime = generateExpiryTime();

    // Save OTP details
    const otpRecord = await OTPVerification.create({
      email,
      otp: hashedOTP,
      expiresAt: expiryTime,
      type: 'email',
    });
    console.log('OTP record created:', otpRecord);

    // Send email with OTP
    await sendVerificationEmail(email, otp);
    console.log('Verification email sent with OTP');

    res.status(200).json({
      message: 'OTP sent successfully',
      email,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Send OTP for phone verification - DEPRECATED (SMS functionality removed)
export const sendPhoneOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    console.log('Phone OTP functionality has been removed');

    // Return a message indicating this functionality is no longer available
    return res.status(400).json({ 
      message: 'SMS verification has been removed from this application', 
      phone 
    });
  } catch (error) {
    console.error('Error in deprecated phone OTP function:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
};

// Verify Email OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    console.log('Verifying email OTP:', { email, otp });

    if (!email || !otp) {
      console.log('Missing email or OTP');
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find all OTP records for this email to debug
    const allRecords = await OTPVerification.find({ email, type: 'email' });
    console.log(`Found ${allRecords.length} OTP records for email:`, email);
    
    if (allRecords.length === 0) {
      console.log('No OTP records found for this email');
      return res.status(400).json({ message: 'No verification code was sent to this email' });
    }
    
    // Check each record manually to debug the issue
    let matchFound = false;
    let expiredFound = false;
    let verifiedFound = false;
    
    // Calculate the hash of the provided OTP
    const hashedOTP = hashOTP(otp);
    console.log('Hashed OTP from request:', hashedOTP);
    
    for (const record of allRecords) {
      console.log('Checking record:', {
        id: record._id,
        storedHash: record.otp,
        expiresAt: record.expiresAt,
        verified: record.verified,
        now: new Date()
      });
      
      if (record.otp === hashedOTP) {
        matchFound = true;
        
        if (record.verified) {
          verifiedFound = true;
          console.log('OTP already verified');
        } else if (record.expiresAt < new Date()) {
          expiredFound = true;
          console.log('OTP expired');
        } else {
          // Valid OTP found
          console.log('Valid OTP found, marking as verified');
          record.verified = true;
          await record.save();
          
          return res.status(200).json({
            message: 'Email verified successfully',
            email,
          });
        }
      }
    }
    
    // Determine the appropriate error message
    if (!matchFound) {
      console.log('No matching OTP found');
      return res.status(400).json({ message: 'Invalid verification code' });
    } else if (expiredFound) {
      return res.status(400).json({ message: 'Verification code has expired' });
    } else if (verifiedFound) {
      return res.status(400).json({ message: 'Verification code has already been used' });
    }
    
    // This should not be reached, but just in case
    return res.status(400).json({ message: 'Invalid or expired verification code' });
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// Verify Phone OTP - DEPRECATED (SMS functionality removed)
export const verifyPhoneOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    console.log('Phone OTP verification functionality has been removed');

    // Return a message indicating this functionality is no longer available
    return res.status(400).json({ 
      message: 'SMS verification has been removed from this application', 
      phone 
    });
  } catch (error) {
    console.error('Error in deprecated phone OTP verification function:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
};