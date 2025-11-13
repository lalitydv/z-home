"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

const signupSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Invalid phone number"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
        role: z.enum(["buyer", "owner", "broker"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: "buyer",
        },
    });

    const onSubmit = (data: SignupFormData) => {
        console.log("Signup:", data);
        toast.success("Account created successfully!");
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
                                Create Account
                            </h1>
                            <p className="text-zh-gray-dark">Join Z-Homes and find your perfect home</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zh-navy mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                                    <input
                                        {...register("name")}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-zh-danger text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zh-navy mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                                    <input
                                        {...register("email")}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-zh-danger text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zh-navy mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                                    <input
                                        {...register("phone")}
                                        type="tel"
                                        placeholder="+91 9876543210"
                                        className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-zh-danger text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zh-navy mb-2">
                                    I am a
                                </label>
                                <select
                                    {...register("role")}
                                    className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                                >
                                    <option value="buyer">Buyer / Renter</option>
                                    <option value="owner">Property Owner</option>
                                    <option value="broker">Broker</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zh-navy mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                                    <input
                                        {...register("password")}
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
                                {errors.password && (
                                    <p className="text-zh-danger text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zh-navy mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                                    <input
                                        {...register("confirmPassword")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-zh-danger text-sm mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink mt-1"
                                />
                                <span className="text-sm text-zh-gray-dark">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-zh-pink hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-zh-pink hover:underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>

                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-zh-gray-dark">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-zh-pink font-semibold hover:underline">
                                    Sign In
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

