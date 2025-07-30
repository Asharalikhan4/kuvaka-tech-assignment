import { useState } from "react";
import { toast } from "sonner";

export function useOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState<string>("");

  const sendOTP = async (phoneNumber: string, countryCode: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setOtpSent(true);
    setIsLoading(false);
    
    toast.success(`OTP sent to ${countryCode}${phoneNumber}`, {
      description: `Your OTP is: ${otp} (Development mode)`,
    });
    
    return otp;
  };

  const verifyOTP = async (enteredOTP: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = enteredOTP === generatedOTP;
    setIsLoading(false);
    
    if (isValid) {
      toast.success("OTP verified successfully!");
      setOtpSent(false);
      setGeneratedOTP("");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
    
    return isValid;
  };

  const resetOTP = () => {
    setOtpSent(false);
    setGeneratedOTP("");
  };

  return {
    isLoading,
    otpSent,
    sendOTP,
    verifyOTP,
    resetOTP,
  };
}