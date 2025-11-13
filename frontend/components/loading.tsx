"use client";

import { Loader2 } from "lucide-react";

interface LoadingProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    fullScreen?: boolean;
}

export function Loading({ size = "md", text, fullScreen = false }: LoadingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    const content = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-zh-pink`} />
            {text && <p className="text-zh-gray-dark">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {content}
        </div>
    );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    return (
        <Loader2 className={`${sizeClasses[size]} animate-spin text-zh-pink`} />
    );
}

