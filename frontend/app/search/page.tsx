"use client";

import { RoleBasedHeader } from "@/components/role-based-header";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { EnhancedFilterPanel } from "@/components/enhanced-filter-panel";
import { SearchBar } from "@/components/search-bar";
import { mockProperties } from "@/lib/mock-data";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Map, List, SlidersHorizontal, ArrowUpDown, Home, Building2 } from "lucide-react";

interface Filter {
  priceMin?: number;
  priceMax?: number;
  bhk?: number[];
  furnished?: string[];
  amenities?: string[];
  verified?: boolean;
  propertyType?: string[];
  listingType?: string[];
  possessionStatus?: string[];
  propertyAge?: string[];
  areaMin?: number;
  areaMax?: number;
}

type SortOption = "relevance" | "price-low" | "price-high" | "newest" | "oldest";
type PropertyCategory = "buy" | "rent";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const categoryParam = searchParams.get("category") as PropertyCategory | null;

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filter>({});
  const [category, setCategory] = useState<PropertyCategory>(categoryParam || "rent");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...mockProperties];

    // Category filter (Buy/Rent)
    filtered = filtered.filter((p) => p.category === category);

    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.location.address.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }

    // City filter
    if (city) {
      filtered = filtered.filter((p) =>
        p.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter((p) => p.price >= filters.priceMin!);
    }
    if (filters.priceMax) {
      filtered = filtered.filter((p) => p.price <= filters.priceMax!);
    }

    // BHK filter
    if (filters.bhk && filters.bhk.length > 0) {
      filtered = filtered.filter((p) => 
        filters.bhk!.some(bhk => {
          const bhkNum = typeof bhk === "string" ? parseInt(bhk) : bhk;
          if (bhk === "5+") return p.bedrooms >= 5;
          return p.bedrooms === bhkNum;
        })
      );
    }

    // Furnishing filter
    if (filters.furnished && filters.furnished.length > 0) {
      filtered = filtered.filter((p) =>
        filters.furnished!.includes(p.furnished)
      );
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((p) =>
        filters.amenities!.every((a) => p.amenities.includes(a))
      );
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter((p) => p.verified);
    }

    // Area filter
    if (filters.areaMin) {
      filtered = filtered.filter((p) => p.area_sqm >= filters.areaMin!);
    }
    if (filters.areaMax) {
      filtered = filtered.filter((p) => p.area_sqm <= filters.areaMax!);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return sorted;
  }, [query, city, filters, category, sortBy]);

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <RoleBasedHeader />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar initialQuery={query} initialCity={city} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <EnhancedFilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={() => setFilters({})}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Category Toggle (Buy/Rent) */}
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 bg-white rounded-xl p-1 border border-zh-gray-light">
                  <button
                    onClick={() => setCategory("rent")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                      category === "rent"
                        ? "bg-zh-pink text-zh-navy shadow-sm"
                        : "text-zh-gray-dark hover:text-zh-navy"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Rent</span>
                  </button>
                  <button
                    onClick={() => setCategory("buy")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                      category === "buy"
                        ? "bg-zh-pink text-zh-navy shadow-sm"
                        : "text-zh-gray-dark hover:text-zh-navy"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>

          {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-zh-navy">
                    {filteredProperties.length} Properties Found
                  </h1>
                  {(query || city) && (
                    <p className="text-zh-gray-dark mt-1 text-sm">
                      {query && `Search: "${query}"`}
                      {query && city && " • "}
                      {city && `City: ${city}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <div className="relative flex-1 sm:flex-initial">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center space-x-2 px-4 py-2 border border-zh-gray-light rounded-lg hover:bg-zh-soft transition-colors w-full sm:w-auto justify-between sm:justify-start"
                    >
                      <div className="flex items-center space-x-2">
                        <ArrowUpDown className="w-4 h-4 text-zh-gray" />
                        <span className="text-sm font-medium text-zh-navy">
                          Sort: {
                            sortBy === "relevance" ? "Relevance" :
                            sortBy === "price-low" ? "Price: Low to High" :
                            sortBy === "price-high" ? "Price: High to Low" :
                            sortBy === "newest" ? "Newest First" :
                            "Oldest First"
                          }
                        </span>
                      </div>
                    </button>
                    {showSortMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowSortMenu(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-zh-gray-light z-20 w-56">
                          {[
                            { value: "relevance", label: "Relevance" },
                            { value: "price-low", label: "Price: Low to High" },
                            { value: "price-high", label: "Price: High to Low" },
                            { value: "newest", label: "Newest First" },
                            { value: "oldest", label: "Oldest First" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value as SortOption);
                                setShowSortMenu(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-zh-soft transition-colors text-sm ${
                                sortBy === option.value
                                  ? "bg-zh-pink/10 text-zh-pink font-semibold"
                                  : "text-zh-navy"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 border border-zh-gray-light rounded-lg hover:bg-zh-soft relative"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    {Object.values(filters).some((v) => 
                      v !== undefined && v !== false && (Array.isArray(v) ? v.length > 0 : true)
                    ) && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-zh-pink rounded-full"></span>
                    )}
                  </button>
                  
                  {/* View Mode Toggle */}
                  <div className="flex border border-zh-gray-light rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-zh-pink text-zh-navy"
                          : "bg-white text-zh-gray-dark hover:bg-zh-soft"
                      }`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("map")}
                      className={`p-2 ${
                        viewMode === "map"
                          ? "bg-zh-pink text-zh-navy"
                          : "bg-white text-zh-gray-dark hover:bg-zh-soft"
                      }`}
                      title="Map View"
                    >
                      <Map className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6">
                  <EnhancedFilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={() => setFilters({})}
                  />
                </div>
              )}

              {/* Results */}
              {viewMode === "list" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-xl text-zh-gray-dark mb-2">
                        No properties found
                      </p>
                      <p className="text-zh-gray">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-zh-gray-light rounded-xl h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                    <p className="text-zh-gray-dark">Map view coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

