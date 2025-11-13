"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";

const adminLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in as admin
        if (typeof window !== "undefined") {
            const userRole = localStorage.getItem("userRole");
            const token = localStorage.getItem("accessToken");
            if (token && (userRole === "superadmin" || userRole === "admin")) {
                router.push("/admin/dashboard");
            }
        }
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginFormData>({
        resolver: zodResolver(adminLoginSchema),
    });

    const onSubmit = async (data: AdminLoginFormData) => {
        setIsLoading(true);

        // Clear any existing auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");

        try {
            // Call the login API
            const response = await authAPI.login({
                email: data.email.trim(),
                password: data.password,
            });

            // Check if response is successful
            if (!response || !response.data) {
                toast.error("Invalid response from server. Please try again.");
                setIsLoading(false);
                return;
            }

            // Extract user and token data based on different possible response structures
            const responseData = response.data;
            let user = null;
            let accessToken = null;
            let refreshToken = null;

            // Handle different response structures
            if (responseData.data) {
                // Structure: { success: true, data: { user: {...}, accessToken: "...", refreshToken: "..." } }
                user = responseData.data.user;
                accessToken = responseData.data.accessToken || responseData.data.token;
                refreshToken = responseData.data.refreshToken;
            } else if (responseData.user) {
                // Structure: { success: true, user: {...}, accessToken: "...", refreshToken: "..." }
                user = responseData.user;
                accessToken = responseData.accessToken || responseData.token;
                refreshToken = responseData.refreshToken;
            }

            // Validate that we got user data
            if (!user) {
                toast.error("Login failed: Invalid user data received");
                setIsLoading(false);
                return;
            }

            // Check if user has admin or superadmin role
            if (user.role !== "superadmin" && user.role !== "admin") {
                toast.error("Access denied. Only super admin or admin users can access this page.");
                setIsLoading(false);
                return;
            }

            // Validate token exists
            if (!accessToken) {
                toast.error("Login failed: No authentication token received");
                setIsLoading(false);
                return;
            }

            // Store tokens securely
            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // Store user info
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userRole", user.role);

            toast.success("Login successful! Redirecting to dashboard...");

            // Small delay to show success message
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 500);

        } catch (error: unknown) {
            // Handle different error types
            let errorMessage = "Login failed. Please check your credentials and try again.";

            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as { response?: { status?: number; data?: { error?: string; message?: string }; statusText?: string } };

                if (axiosError.response) {
                    // Server responded with error status
                    const status = axiosError.response.status;
                    const errorData = axiosError.response.data;

                    if (status === 401) {
                        errorMessage = "Invalid email or password. Please try again.";
                    } else if (status === 403) {
                        errorMessage = "Access denied. Your account may be inactive or suspended.";
                    } else if (status === 404) {
                        errorMessage = "User not found. Please check your email address.";
                    } else if (errorData?.error) {
                        errorMessage = errorData.error;
                    } else if (errorData?.message) {
                        errorMessage = errorData.message;
                    } else {
                        errorMessage = `Login failed: ${status} ${axiosError.response.statusText || "Unknown error"}`;
                    }
                }
            } else if (error && typeof error === "object" && "request" in error) {
                // Request was made but no response received
                errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
            } else if (error instanceof Error) {
                // Something else happened
                errorMessage = error.message || "An unexpected error occurred. Please try again.";
            }

            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zh-navy via-zh-navy to-zh-blue py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl border border-zh-gray-light p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-zh-pink rounded-full mb-4">
                            <Shield className="w-8 h-8 text-zh-navy" />
                        </div>
                        <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
                            Admin Login
                        </h1>
                        <p className="text-zh-gray-dark">Super Admin Access Only</p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        noValidate
                    >
                        <div>
                            <label className="block text-sm font-medium text-zh-navy mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        validate: (value) => {
                                            if (!value.trim()) {
                                                return "Email cannot be empty";
                                            }
                                            return true;
                                        }
                                    })}
                                    type="email"
                                    placeholder="admin@zhomes.com"
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-zh-danger text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zh-navy mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        },
                                        validate: (value) => {
                                            if (!value || value.trim().length === 0) {
                                                return "Password cannot be empty";
                                            }
                                            return true;
                                        }
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-10 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-zh-danger text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign In as Admin"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-zh-gray-dark">
                            <Link href="/" className="text-zh-pink hover:underline">
                                Back to Home
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

