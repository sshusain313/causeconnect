import nodemailer from 'nodemailer';
import { generateOTP } from '../utils/otpUtils';

// Track recently sent emails to prevent duplicates
const recentEmails = new Map<string, number>();

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    // Check if we've sent an email to this address recently (within 5 seconds)
    const now = Date.now();
    const lastSent = recentEmails.get(email);
    
    if (lastSent && now - lastSent < 5000) {
      console.log(`DUPLICATE PREVENTION: Email to ${email} was already sent in the last 5 seconds. Skipping.`);
      return true; // Pretend we sent it successfully
    }
    
    // Update the timestamp for this email
    recentEmails.set(email, now);
    
    // Clean up old entries every 100 emails to prevent memory leaks
    if (recentEmails.size > 100) {
      const fiveMinutesAgo = now - 300000;
      for (const [key, timestamp] of recentEmails.entries()) {
        if (timestamp < fiveMinutesAgo) {
          recentEmails.delete(key);
        }
      }
    }
    
    console.log(`SENDING EMAIL: Preparing to send email to ${email} with OTP ${otp}`);
    
    const mailOptions = {
      from: '"CauseBags" <noreply@causebags.com>',
      to: email,
      subject: 'Verify Your Tote Claim',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Thank you for claiming a tote! Please use the following verification code to complete your claim:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${otp}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`EMAIL SENT SUCCESSFULLY: MessageID ${info.messageId} to ${email}`);
    return true;
  } catch (error) {
    console.error(`ERROR SENDING EMAIL to ${email}:`, error);
    throw error;
  }
}; 