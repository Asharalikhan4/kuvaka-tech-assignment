"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { CountrySelector } from "./CountrySelector";
import { useCountries } from "@/app/hooks/useContries";
import { useOTP } from "../../hooks/useOTP";
import { useAuthStore } from "../../store/authStore";
import { Country } from "../../types";
import { useThemeStore } from "../../store/themeStore";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number too long"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type PhoneForm = z.infer<typeof phoneSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export function AuthForm() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { countries, loading: countriesLoading } = useCountries();
  const { isLoading, otpSent, sendOTP, verifyOTP, resetOTP } = useOTP();
  const { login } = useAuthStore();
  const { isDark } = useThemeStore();

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const handlePhoneSubmit = async (data: PhoneForm) => {
    if (!selectedCountry) return;

    const dialCode = `${selectedCountry.idd.root}${
      selectedCountry.idd.suffixes?.[0] || ""
    }`;
    setPhoneNumber(data.phone);
    await sendOTP(data.phone, dialCode);
    phoneForm.reset();
  };

  const handleOTPSubmit = async (data: OTPForm) => {
    const isValid = await verifyOTP(data.otp);
    if (isValid && selectedCountry) {
      const dialCode = `${selectedCountry.idd.root}${
        selectedCountry.idd.suffixes?.[0] || ""
      }`;
      const user = {
        id: crypto.randomUUID(),
        phone: phoneNumber,
        countryCode: dialCode,
        createdAt: new Date(),
      };
      login(user);
    }
  };

  const handleBack = () => {
    resetOTP();
    phoneForm.reset();
    otpForm.reset();
  };

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-lg shadow-lg p-6 ${
        isDark ? "bg-slate-900" : "bg-white"
      }`}
    >
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {otpSent ? "Verify OTP" : "Welcome to Gemini Clone"}
        </h1>
        <p
          className={`mt-2 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {otpSent
            ? "Enter the 6-digit code sent to your phone"
            : "Enter your phone number to get started"}
        </p>
      </div>

      {!otpSent ? (
        <form
          onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
          className="space-y-4"
        >
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Country
            </label>
            <CountrySelector
              countries={countries}
              loading={countriesLoading}
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Phone Number
            </label>
            <Input
              {...phoneForm.register("phone")}
              type="tel"
              placeholder="Enter your phone number"
              className={`${
                phoneForm.formState.errors.phone ? "border-red-500" : ""
              }`}
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedCountry}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
          className="space-y-4"
        >
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-2 mb-4 ${
              isDark
                ? "text-slate-400 hover:text-slate-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to phone number
          </button>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Enter OTP
            </label>
            <Input
              {...otpForm.register("otp")}
              type="text"
              placeholder="000000"
              maxLength={6}
              className={`text-center text-lg tracking-widest ${
                otpForm.formState.errors.otp ? "border-red-500" : ""
              }`}
            />
            {otpForm.formState.errors.otp && (
              <p className="text-red-500 text-sm mt-1">
                {otpForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : "Verify OTP"}
          </Button>
        </form>
      )}
    </div>
  );
}
