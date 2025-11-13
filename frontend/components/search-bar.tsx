"use client";

import { Search, MapPin, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockCities } from "@/lib/mock-data";

interface SearchBarProps {
    initialQuery?: string;
    initialCity?: string;
    onSearch?: (query: string, city: string) => void;
    variant?: "default" | "hero";
}

export function SearchBar({
    initialQuery = "",
    initialCity = "",
    onSearch,
    variant = "default",
}: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);
    const [city, setCity] = useState(initialCity);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (query.trim()) searchParams.set("q", query.trim());
        if (city) searchParams.set("city", city);

        if (onSearch) {
            onSearch(query, city);
        } else {
            router.push(`/search?${searchParams.toString()}`);
        }
    };

    const isHero = variant === "hero";

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full ${isHero ? "max-w-4xl mx-auto" : ""}`}
        >
            <div
                className={`flex flex-col sm:flex-row gap-2 ${isHero
                    ? "bg-white rounded-2xl shadow-lg p-2"
                    : "bg-white rounded-xl shadow-sm border border-zh-gray-light p-2"
                    }`}
            >
                {/* City Selector */}
                <div className="relative shrink-0 sm:shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowCityDropdown(!showCityDropdown)}
                        className={`flex items-center space-x-2 px-4 py-3 ${isHero ? "rounded-xl" : "rounded-lg"
                            } border border-zh-gray-light hover:border-zh-pink transition-colors bg-white w-full sm:w-auto min-w-[140px]`}
                    >
                        <MapPin className="w-5 h-5 text-zh-pink shrink-0" />
                        <span className="text-zh-navy font-medium truncate">
                            {city || "Select City"}
                        </span>
                    </button>
                    {showCityDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowCityDropdown(false)}
                            />
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-zh-gray-light z-20 w-64 max-h-64 overflow-y-auto">
                                {mockCities.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            setCity(c);
                                            setShowCityDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-zh-soft transition-colors"
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Search Input */}
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zh-gray w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search properties, areas, localities..."
                        className={`w-full pl-12 pr-10 py-3 ${isHero ? "rounded-xl" : "rounded-lg"
                            } border border-zh-gray-light focus:outline-none focus:ring-2 focus:ring-zh-pink focus:border-transparent text-zh-navy placeholder:text-zh-gray`}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className={`px-6 py-3 bg-zh-pink text-zh-navy font-semibold ${isHero ? "rounded-xl" : "rounded-lg"
                        } hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 w-full sm:w-auto`}
                >
                    Search
                </button>
            </div>
        </form>
    );
}

