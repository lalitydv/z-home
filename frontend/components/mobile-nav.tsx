"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, MessageSquare, Calendar } from "lucide-react";

export function MobileNav() {
    const pathname = usePathname();

    // Hide navigation on auth pages
    const hideOnPaths = ["/auth/login", "/auth/signup"];
    const shouldHide = hideOnPaths.some((path) => pathname.startsWith(path));

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/search", icon: Search, label: "Search" },
        { href: "/dashboard", icon: Heart, label: "Saved" },
        { href: "/chat", icon: MessageSquare, label: "Messages" },
        { href: "/bookings", icon: Calendar, label: "Bookings" },
    ];

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    if (shouldHide) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-zh-gray-light md:hidden shadow-lg">
            <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${active
                                ? "text-zh-pink"
                                : "text-zh-gray-dark hover:text-zh-pink"
                                }`}
                        >
                            <div className="relative">
                                <Icon className={`w-6 h-6 ${active ? "scale-110" : ""} transition-transform duration-200`} />
                                {active && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-zh-pink rounded-full animate-pulse-slow" />
                                )}
                            </div>
                            <span className={`text-xs mt-1 transition-all duration-200 ${active ? "font-semibold" : "font-medium"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

