"use client";

import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface Filter {
  priceMin?: number;
  priceMax?: number;
  bhk?: number[];
  furnished?: string[];
  amenities?: string[];
  verified?: boolean;
  propertyType?: string[]; // new, resale
  listingType?: string[]; // dealer, individual, builder
  possessionStatus?: string[]; // ready, under-construction
  propertyAge?: string[]; // 0-1, 1-5, 5-10, 10+
  areaMin?: number;
  areaMax?: number;
}

interface EnhancedFilterPanelProps {
  filters: Filter;
  onFilterChange: (filters: Filter) => void;
  onReset: () => void;
}

const bhkOptions = [1, 2, 3, 4, 5, "5+"];
const furnishedOptions = ["furnished", "semi-furnished", "unfurnished"];
const propertyTypeOptions = ["new", "resale"];
const listingTypeOptions = ["dealer", "individual", "builder"];
const possessionOptions = ["ready", "under-construction"];
const propertyAgeOptions = [
  { label: "0-1 years", value: "0-1" },
  { label: "1-5 years", value: "1-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
];
const amenityOptions = [
  "wifi",
  "parking",
  "laundry",
  "security",
  "elevator",
  "gym",
  "swimming-pool",
  "garden",
  "power-backup",
  "water-supply",
];

export function EnhancedFilterPanel({
  filters,
  onFilterChange,
  onReset,
}: EnhancedFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filter>(filters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    property: true,
    amenities: false,
  });

  const updateFilter = (key: keyof Filter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof Filter, value: string) => {
    const current = (localFilters[key] as string[]) || [];
    const newArray = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateFilter(key, newArray);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
    (localFilters.propertyType && localFilters.propertyType.length > 0) ||
    (localFilters.listingType && localFilters.listingType.length > 0) ||
    (localFilters.possessionStatus && localFilters.possessionStatus.length > 0) ||
    (localFilters.propertyAge && localFilters.propertyAge.length > 0) ||
    localFilters.verified ||
    localFilters.areaMin ||
    localFilters.areaMax;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light">
      {/* Mobile Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-zh-pink" />
          <span className="font-semibold text-zh-navy">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-zh-pink text-white text-xs rounded-full">
              {Object.values(localFilters).filter((v) => 
                v !== undefined && v !== false && (Array.isArray(v) ? v.length > 0 : true)
              ).length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Filter Content */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:block p-4 md:p-6 space-y-4`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zh-gray-light">
          <h3 className="font-semibold text-zh-navy text-lg">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-zh-pink hover:underline font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-zh-gray-light pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between mb-3"
          >
            <label className="block text-sm font-semibold text-zh-navy">
              Price Range
            </label>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-zh-gray" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zh-gray" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={localFilters.priceMin || ""}
                  onChange={(e) =>
                    updateFilter("priceMin", e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="flex-1 px-3 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                />
                <span className="text-zh-gray">to</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={localFilters.priceMax || ""}
                  onChange={(e) =>
                    updateFilter("priceMax", e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="flex-1 px-3 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                />
              </div>
              {/* Quick Price Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Under ₹5K", min: 0, max: 5000 },
                  { label: "₹5K-₹10K", min: 5000, max: 10000 },
                  { label: "₹10K-₹20K", min: 10000, max: 20000 },
                  { label: "₹20K+", min: 20000, max: undefined },
                ].map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => {
                      updateFilter("priceMin", range.min);
                      if (range.max) updateFilter("priceMax", range.max);
                    }}
                    className="px-3 py-1.5 text-xs border border-zh-gray-light rounded-lg hover:border-zh-pink hover:bg-zh-pink/10 transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="border-b border-zh-gray-light pb-4">
          <label className="block text-sm font-semibold text-zh-navy mb-3">
            Property Type
          </label>
          <div className="flex flex-wrap gap-2">
            {propertyTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleArrayFilter("propertyType", type)}
                className={`px-4 py-2 rounded-lg border transition-colors capitalize text-sm ${
                  localFilters.propertyType?.includes(type)
                    ? "bg-zh-pink text-zh-navy border-zh-pink font-semibold"
                    : "bg-white text-zh-navy border-zh-gray-light hover:border-zh-pink"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Listing Type */}
        <div className="border-b border-zh-gray-light pb-4">
          <label className="block text-sm font-semibold text-zh-navy mb-3">
            Listed By
          </label>
          <div className="space-y-2">
            {listingTypeOptions.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.listingType?.includes(type) || false}
                  onChange={() => toggleArrayFilter("listingType", type)}
                  className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink"
                />
                <span className="text-sm text-zh-navy capitalize">
                  {type === "dealer" ? "Dealers" : type === "individual" ? "Owners" : "Builders"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* BHK */}
        <div className="border-b border-zh-gray-light pb-4">
          <label className="block text-sm font-semibold text-zh-navy mb-3">
            Bedrooms (BHK)
          </label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() => toggleArrayFilter("bhk", String(bhk))}
                className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                  localFilters.bhk?.includes(String(bhk))
                    ? "bg-zh-pink text-zh-navy border-zh-pink font-semibold"
                    : "bg-white text-zh-navy border-zh-gray-light hover:border-zh-pink"
                }`}
              >
                {bhk} {typeof bhk === "number" ? "BHK" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Area Range */}
        <div className="border-b border-zh-gray-light pb-4">
          <label className="block text-sm font-semibold text-zh-navy mb-3">
            Area (sq. ft.)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.areaMin || ""}
              onChange={(e) =>
                updateFilter("areaMin", e.target.value ? Number(e.target.value) : undefined)
              }
              className="flex-1 px-3 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
            />
            <span className="text-zh-gray">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.areaMax || ""}
              onChange={(e) =>
                updateFilter("areaMax", e.target.value ? Number(e.target.value) : undefined)
              }
              className="flex-1 px-3 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
            />
          </div>
        </div>

        {/* Furnishing */}
        <div className="border-b border-zh-gray-light pb-4">
          <label className="block text-sm font-semibold text-zh-navy mb-3">
            Furnishing
          </label>
          <div className="flex flex-wrap gap-2">
            {furnishedOptions.map((furnished) => (
              <button
                key={furnished}
                type="button"
                onClick={() => toggleArrayFilter("furnished", furnished)}
                className={`px-4 py-2 rounded-lg border transition-colors capitalize text-sm ${
                  localFilters.furnished?.includes(furnished)
                    ? "bg-zh-pink text-zh-navy border-zh-pink font-semibold"
                    : "bg-white text-zh-navy border-zh-gray-light hover:border-zh-pink"
                }`}
              >
                {furnished.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Possession Status */}
        <div className="border-b border-zh-gray-light pb-4">
          <label className="block text-sm font-semibold text-zh-navy mb-3">
            Possession Status
          </label>
          <div className="flex flex-wrap gap-2">
            {possessionOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleArrayFilter("possessionStatus", status)}
                className={`px-4 py-2 rounded-lg border transition-colors capitalize text-sm ${
                  localFilters.possessionStatus?.includes(status)
                    ? "bg-zh-pink text-zh-navy border-zh-pink font-semibold"
                    : "bg-white text-zh-navy border-zh-gray-light hover:border-zh-pink"
                }`}
              >
                {status.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Property Age */}
        <div className="border-b border-zh-gray-light pb-4">
          <label className="block text-sm font-semibold text-zh-navy mb-3">
            Property Age
          </label>
          <div className="space-y-2">
            {propertyAgeOptions.map((age) => (
              <label
                key={age.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.propertyAge?.includes(age.value) || false}
                  onChange={() => toggleArrayFilter("propertyAge", age.value)}
                  className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink"
                />
                <span className="text-sm text-zh-navy">{age.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="border-b border-zh-gray-light pb-4">
          <button
            onClick={() => toggleSection("amenities")}
            className="w-full flex items-center justify-between mb-3"
          >
            <label className="block text-sm font-semibold text-zh-navy">
              Amenities
            </label>
            {expandedSections.amenities ? (
              <ChevronUp className="w-4 h-4 text-zh-gray" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zh-gray" />
            )}
          </button>
          {expandedSections.amenities && (
            <div className="space-y-2">
              {amenityOptions.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.amenities?.includes(amenity) || false}
                    onChange={() => toggleArrayFilter("amenities", amenity)}
                    className="w-4 h-4 text-zh-pink border-zh-gray-light rounded focus:ring-zh-pink"
                  />
                  <span className="text-sm text-zh-navy capitalize">
                    {amenity.replace("-", " ")}
                  </span>
                </label>
              ))}
            </div>
          )}
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

