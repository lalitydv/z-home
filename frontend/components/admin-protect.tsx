"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userAPI } from "@/lib/api";

export function AdminProtect({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            if (typeof window === "undefined") return;

            const userRole = localStorage.getItem("userRole");
            const user = localStorage.getItem("user");
            const token = localStorage.getItem("accessToken");

            // Basic check - if no token or user, redirect immediately
            if (!token || !user) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                localStorage.removeItem("userRole");
                router.push("/admin/login");
                return;
            }

            // Check role
            if (userRole !== "superadmin" && userRole !== "admin") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                localStorage.removeItem("userRole");
                router.push("/admin/login");
                return;
            }

            // Verify token is valid by calling API
            try {
                const response = await userAPI.getProfile();
                const currentUser = response.data?.data?.user || response.data?.user;

                // Verify user still has admin role
                if (currentUser && (currentUser.role === "superadmin" || currentUser.role === "admin")) {
                    // Update stored user data
                    localStorage.setItem("user", JSON.stringify(currentUser));
                    localStorage.setItem("userRole", currentUser.role);
                    setIsAuthorized(true);
                } else {
                    // User role changed or invalid
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    localStorage.removeItem("userRole");
                    router.push("/admin/login");
                }
            } catch {
                // Token is invalid or expired
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                localStorage.removeItem("userRole");
                router.push("/admin/login");
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-zh-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zh-gray-dark">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}

