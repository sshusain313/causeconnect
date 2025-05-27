// This is a placeholder SMS service that doesn't use Twilio
// It simulates sending SMS messages for development purposes

/**
 * Simulates sending an SMS with an OTP code
 * @param phone Phone number to send to
 * @param otp OTP code to send
 * @returns Simulated response object
 */
export const sendSMS = async (phone: string, otp: string) => {
  console.log(`[SMS SIMULATION] Would send OTP ${otp} to phone number ${phone}`);
  return { 
    sid: 'SIMULATED_SID', 
    status: 'delivered' 
  };
};

/**
 * Simulates sending a verification SMS
 * @param phone Phone number to send to
 * @param otp OTP code to send
 * @returns Simulated response object
 */
export const sendVerificationSMS = async (phone: string, otp: string) => {
  console.log(`[SMS SIMULATION] Would send verification OTP ${otp} to phone number ${phone}`);
  return { 
    sid: 'SIMULATED_SID', 
    status: 'delivered' 
  };
};

/**
 * Simulates verifying a phone number with an OTP
 * @param phone Phone number to verify
 * @param otp OTP code to verify
 * @returns Boolean indicating success
 */
export const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
  // In a real implementation, this would check the OTP against what was sent
  console.log(`[SMS SIMULATION] Would verify OTP ${otp} for phone number ${phone}`);
  return true;
};
