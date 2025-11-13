"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

interface Filter {
  priceMin?: number;
  priceMax?: number;
  bhk?: number[];
  furnished?: string[];
  amenities?: string[];
  verified?: boolean;
}

interface FilterPanelProps {
  filters: Filter;
  onFilterChange: (filters: Filter) => void;
  onReset: () => void;
}

const bhkOptions = [1, 2, 3, 4, 5];
const furnishedOptions = ["furnished", "semi-furnished", "unfurnished"];
const amenityOptions = [
  "wifi",
  "parking",
  "laundry",
  "security",
  "elevator",
  "gym",
  "swimming-pool",
  "garden",
];

export function FilterPanel({
  filters,
  onFilterChange,
  onReset,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filter>(filters);

  const updateFilter = (key: keyof Filter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleBHK = (bhk: number) => {
    const current = localFilters.bhk || [];
    const newBHK = current.includes(bhk)
      ? current.filter((b) => b !== bhk)
      : [...current, bhk];
    updateFilter("bhk", newBHK);
  };

  const toggleFurnished = (furnished: string) => {
    const current = localFilters.furnished || [];
    const newFurnished = current.includes(furnished)
      ? current.filter((f) => f !== furnished)
      : [...current, furnished];
    updateFilter("furnished", newFurnished);
  };

  const toggleAmenity = (amenity: string) => {
    const current = localFilters.amenities || [];
    const newAmenities = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    updateFilter("amenities", newAmenities);
  };

  const handleReset = () => {
    const emptyFilters: Filter = {};
    setLocalFilters(emptyFilters);
    onReset();
  };

  const hasActiveFilters =
    localFilters.priceMin ||
    localFilters.priceMax ||
    (localFilters.bhk && localFilters.bhk.length > 0) ||
    (localFilters.furnished && localFilters.furnished.length > 0) ||
    (localFilters.amenities && localFilters.amenities.length > 0) ||
    localFilters.verified;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light">
      {/* Mobile Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between p-4"
      >
        <span className="font-semibold text-zh-navy">Filters</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Filter Content */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:block p-4 md:p-6 space-y-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zh-navy">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-zh-pink hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-zh-navy mb-2">
            Price Range (₹/month)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.priceMin || ""}
              onChange={(e) =>
                updateFilter("priceMin", e.target.value ? Number(e.target.value) : undefined)
              }
              className="flex-1 px-3 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
            />
            <span className="text-zh-gray">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.priceMax || ""}
              onChange={(e) =>
                updateFilter("priceMax", e.target.value ? Number(e.target.value) : undefined)
              }
              className="flex-1 px-3 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
            />
          </div>
        </div>

        {/* BHK */}
        <div>
          <label className="block text-sm font-medium text-zh-navy mb-2">
            Bedrooms (BHK)
          </label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() => toggleBHK(bhk)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  localFilters.bhk?.includes(bhk)
                    ? "bg-zh-pink text-zh-navy border-zh-pink"
                    : "bg-white text-zh-navy border-zh-gray-light hover:border-zh-pink"
                }`}
              >
                {bhk} BHK
              </button>
            ))}
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <label className="block text-sm font-medium text-zh-navy mb-2">
            Furnishing
          </label>
          <div className="flex flex-wrap gap-2">
            {furnishedOptions.map((furnished) => (
              <button
                key={furnished}
                type="button"
                onClick={() => toggleFurnished(furnished)}
                className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                  localFilters.furnished?.includes(furnished)
                    ? "bg-zh-pink text-zh-navy border-zh-pink"
                    : "bg-white text-zh-navy border-zh-gray-light hover:border-zh-pink"
                }`}
              >
                {furnished.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-zh-navy mb-2">
            Amenities
          </label>
          <div className="space-y-2">
            {amenityOptions.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.amenities?.includes(amenity) || false}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink"
                />
                <span className="text-sm text-zh-navy capitalize">
                  {amenity.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Verified Only */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.verified || false}
              onChange={(e) => updateFilter("verified", e.target.checked || undefined)}
              className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink"
            />
            <span className="text-sm font-medium text-zh-navy">
              Verified Properties Only
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

