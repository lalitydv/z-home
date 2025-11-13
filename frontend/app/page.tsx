"use client";

import { RoleBasedHeader } from "@/components/role-based-header";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { PropertyCard } from "@/components/property-card";
import { mockProperties, mockLocalities } from "@/lib/mock-data";
import { Home, Star, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const featuredProperties = mockProperties.slice(0, 4);
  const categories = [
    { name: "Rooms", icon: Home, count: 1234, color: "zh-pink" },
    { name: "PG", icon: Home, count: 856, color: "zh-blue" },
    { name: "Flats", icon: Home, count: 2341, color: "zh-pink" },
    { name: "Commercial", icon: Home, count: 432, color: "zh-blue" },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <RoleBasedHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-primary py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-poppins">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover rooms, flats, PG, and commercial properties in your city.
              Trusted by thousands of users.
            </p>
            <SearchBar variant="hero" />
          </div>
        </section>

        {/* Quick Search Options */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-zh-navy mb-8 text-center font-poppins">
              What are you looking for?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                href="/search?category=rent"
                className="bg-gradient-to-br from-zh-pink to-zh-blue rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Rent a Property</h3>
                    <p className="text-white/90 mb-4">Find your perfect rental home</p>
                    <div className="flex items-center space-x-4 text-white">
                      <div>
                        <div className="text-2xl font-bold">{mockProperties.filter(p => p.category === "rent").length}+</div>
                        <div className="text-sm opacity-90">Properties</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">50+</div>
                        <div className="text-sm opacity-90">Cities</div>
                      </div>
                    </div>
                  </div>
                  <Home className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform" />
                </div>
              </Link>
              <Link
                href="/search?category=buy"
                className="bg-gradient-to-br from-zh-blue to-zh-pink rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Buy a Property</h3>
                    <p className="text-white/90 mb-4">Own your dream home</p>
                    <div className="flex items-center space-x-4 text-white">
                      <div>
                        <div className="text-2xl font-bold">{mockProperties.filter(p => p.category === "sale").length}+</div>
                        <div className="text-sm opacity-90">Properties</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">30+</div>
                        <div className="text-sm opacity-90">Projects</div>
                      </div>
                    </div>
                  </div>
                  <Building2 className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-12 px-4 bg-zh-soft">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-zh-navy mb-8 text-center font-poppins">
              Browse by Property Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={`/search?category=${category.name.toLowerCase()}`}
                    className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light hover:shadow-lg transition-all hover:border-zh-pink group"
                  >
                    <div className={`w-12 h-12 bg-${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-zh-navy" />
                    </div>
                    <h3 className="font-semibold text-zh-navy mb-1">{category.name}</h3>
                    <p className="text-sm text-zh-gray">{category.count} properties</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Localities */}
        <section className="py-12 px-4 bg-zh-soft">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-zh-navy font-poppins">
                Popular Localities
              </h2>
              <Link
                href="/search"
                className="flex items-center space-x-2 text-zh-pink hover:underline"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockLocalities.map((locality) => (
                <Link
                  key={locality.name}
                  href={`/search?locality=${locality.name}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light hover:shadow-lg transition-all hover:border-zh-blue"
                >
                  <h3 className="font-semibold text-zh-navy mb-2">{locality.name}</h3>
                  <p className="text-sm text-zh-gray mb-2">{locality.city}</p>
                  <p className="text-zh-pink font-semibold">
                    {locality.properties} properties
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties - Rent */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-zh-navy font-poppins">
                  Properties for Rent
                </h2>
                <p className="text-zh-gray-dark mt-1">Find your perfect rental home</p>
              </div>
              <Link
                href="/search?category=rent"
                className="flex items-center space-x-2 text-zh-pink hover:underline font-semibold"
              >
                <span>View All Rentals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProperties.filter(p => p.category === "rent").slice(0, 4).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties - Buy */}
        {mockProperties.filter(p => p.category === "sale").length > 0 && (
          <section className="py-12 px-4 bg-zh-soft">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-zh-navy font-poppins">
                    Properties for Sale
                  </h2>
                  <p className="text-zh-gray-dark mt-1">Own your dream home</p>
                </div>
                <Link
                  href="/search?category=buy"
                  className="flex items-center space-x-2 text-zh-pink hover:underline font-semibold"
                >
                  <span>View All Properties</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockProperties.filter(p => p.category === "sale").slice(0, 4).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="py-12 px-4 bg-zh-soft">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-zh-navy mb-12 text-center font-poppins">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-zh-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-zh-navy">1</span>
                </div>
                <h3 className="font-semibold text-zh-navy mb-2">Search Properties</h3>
                <p className="text-zh-gray-dark">
                  Browse through thousands of verified properties in your city
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-zh-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-zh-navy">2</span>
                </div>
                <h3 className="font-semibold text-zh-navy mb-2">Contact Owner</h3>
                <p className="text-zh-gray-dark">
                  Message or call property owners directly through our platform
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-zh-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-zh-navy">3</span>
                </div>
                <h3 className="font-semibold text-zh-navy mb-2">Book Visit</h3>
                <p className="text-zh-gray-dark">
                  Schedule a visit and finalize your perfect home
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-zh-navy mb-12 text-center font-poppins">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-zh-soft rounded-xl p-6 border border-zh-gray-light"
                >
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 fill-zh-pink text-zh-pink"
                      />
                    ))}
                  </div>
                  <p className="text-zh-gray-dark mb-4">
                    &quot;Found my dream apartment in just 2 days! The platform is so easy to use
                    and all properties are verified. Highly recommended!&quot;
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full" />
                    <div>
                      <p className="font-semibold text-zh-navy">Rahul Sharma</p>
                      <p className="text-sm text-zh-gray">Mumbai</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="gradient-primary py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-poppins">
              Ready to List Your Property?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of property owners and reach millions of potential tenants
            </p>
            <Link
              href="/list-property"
              className="inline-block px-8 py-3 bg-white text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              List Your Property Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
