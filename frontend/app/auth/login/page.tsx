"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<"email" | "otp">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors },
    watch,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onEmailSubmit = (data: LoginFormData) => {
    console.log("Login:", data);
    toast.success("Login successful!");
    router.push("/dashboard");
  };

  const onOTPRequest = (data: { phone: string }) => {
    console.log("OTP requested for:", data.phone);
    toast.success("OTP sent to your phone!");
    setOtpSent(true);
  };

  const onOTPSubmit = (data: OTPFormData) => {
    console.log("OTP verified:", data);
    toast.success("Login successful!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-zh-gray-light p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
                Welcome Back
              </h1>
              <p className="text-zh-gray-dark">Sign in to continue to Z-Homes</p>
            </div>

            {/* Auth Method Toggle */}
            <div className="flex bg-zh-soft rounded-lg p-1 mb-6">
              <button
                onClick={() => {
                  setAuthMethod("email");
                  setOtpSent(false);
                }}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  authMethod === "email"
                    ? "bg-white text-zh-navy shadow-sm"
                    : "text-zh-gray-dark"
                }`}
              >
                Email
              </button>
              <button
                onClick={() => {
                  setAuthMethod("otp");
                  setOtpSent(false);
                }}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  authMethod === "otp"
                    ? "bg-white text-zh-navy shadow-sm"
                    : "text-zh-gray-dark"
                }`}
              >
                OTP
              </button>
            </div>

            {/* Email Login Form */}
            {authMethod === "email" && (
              <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zh-navy mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                    <input
                      {...registerEmail("email")}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                  {emailErrors.email && (
                    <p className="text-zh-danger text-sm mt-1">{emailErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zh-navy mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                    <input
                      {...registerEmail("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {emailErrors.password && (
                    <p className="text-zh-danger text-sm mt-1">{emailErrors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink"
                    />
                    <span className="text-sm text-zh-gray-dark">Remember me</span>
                  </label>
                  <Link
                    href="/auth/forgot"
                    className="text-sm text-zh-pink hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign In
                </button>
              </form>
            )}

            {/* OTP Login Form */}
            {authMethod === "otp" && (
              <form
                onSubmit={
                  otpSent
                    ? handleSubmitOTP(onOTPSubmit)
                    : (e) => {
                        e.preventDefault();
                        const phone = watch("phone");
                        if (phone) onOTPRequest({ phone });
                      }
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-zh-navy mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                    <input
                      {...registerOTP("phone")}
                      type="tel"
                      placeholder="+91 9876543210"
                      disabled={otpSent}
                      className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink disabled:bg-zh-gray-light"
                    />
                  </div>
                  {otpErrors.phone && (
                    <p className="text-zh-danger text-sm mt-1">{otpErrors.phone.message}</p>
                  )}
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-sm font-medium text-zh-navy mb-2">
                      Enter OTP
                    </label>
                    <input
                      {...registerOTP("otp")}
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-center text-2xl tracking-widest"
                    />
                    {otpErrors.otp && (
                      <p className="text-zh-danger text-sm mt-1">{otpErrors.otp.message}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const phone = watch("phone");
                        if (phone) onOTPRequest({ phone });
                      }}
                      className="text-sm text-zh-pink hover:underline mt-2"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-zh-gray-light" />
              <span className="px-4 text-sm text-zh-gray">OR</span>
              <div className="flex-1 border-t border-zh-gray-light" />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button className="w-full px-4 py-2 border border-zh-gray-light rounded-lg hover:bg-zh-soft transition-colors flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-zh-gray-dark">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-zh-pink font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

