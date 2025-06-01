
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import config from '@/config';

// Use config.apiUrl instead of hardcoded URL
const API_URL = config.apiUrl;

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromWaitlist = searchParams.get('source') === 'waitlist';
  const [emailOtp, setEmailOtp] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);
  const [emailOtpSent, setEmailOtpSent] = useState<boolean>(false);
  
  useEffect(() => {
    // Retrieve form data from session storage
    const storedData = sessionStorage.getItem('claimFormData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);
      
      // Send OTP to email when component mounts (only if not already sent)
      if (parsedData.email && !fromWaitlist && !emailOtpSent) {
        sendEmailOTP(parsedData.email);
      }
    } else {
      // If no data is found, redirect back to the claim form
      navigate('/causes');
    }
    
    // For waitlist users, show appropriate message
    if (fromWaitlist) {
      toast({
        title: "Waitlist Member Detected",
        description: "Please verify your email to continue.",
      });
    }
  }, [navigate, fromWaitlist, emailOtpSent]);
  
  const sendEmailOTP = async (email: string) => {
    console.log('Sending OTP to email:', email);
    try {
      const response = await axios.post(`${API_URL}/otp/send`, { email });
      console.log('OTP send response:', response.data);
      setEmailOtpSent(true); // Mark email OTP as sent
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        toast({
          title: "Error",
          description: error.response.data.message || "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const verifyEmail = async () => {
    if (emailOtp.length !== 6 || !formData?.email) {
      toast({
        title: "Verification Failed",
        description: "Please enter a valid verification code.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Attempting to verify email OTP:', { 
      email: formData.email, 
      otp: emailOtp 
    });
    
    try {
      const response = await axios.post(`${API_URL}/otp/verify`, {
        email: formData.email,
        otp: emailOtp
      });
      
      console.log('OTP verification successful:', response.data);
      
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
      
      // Store verification status
      sessionStorage.setItem('verificationComplete', 'true');
      
      // Add fromWaitlist flag if applicable
      if (fromWaitlist) {
        const claimData = JSON.parse(sessionStorage.getItem('claimFormData') || '{}');
        sessionStorage.setItem('claimFormData', JSON.stringify({
          ...claimData,
          fromWaitlist: true
        }));
      }
      
      // Navigate to confirmation page
      navigate('/claim/confirmed');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        toast({
          title: "Verification Failed",
          description: error.response.data.message || "Invalid or expired verification code.",
          variant: "destructive",
        });
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast({
          title: "Verification Failed",
          description: "No response received from server. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };
  
  const resendCode = async () => {
    if (formData?.email) {
      await sendEmailOTP(formData.email);
    }
  };
  
  return (
    <Layout>
      <div className="bg-primary-50 py-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4"
          >
            &larr; Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-lg text-gray-700 mb-6">
            Enter the verification code sent to your email
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  We've sent a verification code to:
                </p>
                <p className="font-medium text-lg">
                  {formData?.email || 'your email'}
                </p>
              </div>
              
              <div className="flex justify-center mb-8">
                <InputOTP maxLength={6} value={emailOtp} onChange={setEmailOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button onClick={verifyEmail} disabled={emailOtp.length !== 6}>
                  Verify Email
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={resendCode} 
                    className="text-sm"
                  >
                    Didn't receive a code? Resend
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OtpVerificationPage;
