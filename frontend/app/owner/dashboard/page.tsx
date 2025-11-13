"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { mockProperties, mockOwner } from "@/lib/mock-data";
import {
  Home,
  Eye,
  Heart,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const stats = [
  { label: "Active Listings", value: "12", icon: Home, color: "zh-pink" },
  { label: "Total Views", value: "2,456", icon: Eye, color: "zh-blue" },
  { label: "Leads", value: "34", icon: MessageSquare, color: "zh-pink" },
  { label: "Revenue", value: "₹1.2M", icon: DollarSign, color: "zh-blue" },
];

export default function OwnerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "leads">("overview");
  const myListings = mockProperties.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
              Owner Dashboard
            </h1>
            <p className="text-zh-gray-dark">Manage your properties and leads</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-zh-gray-light">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-zh-pink border-b-2 border-zh-pink"
                  : "text-zh-gray-dark hover:text-zh-navy"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "listings"
                  ? "text-zh-pink border-b-2 border-zh-pink"
                  : "text-zh-gray-dark hover:text-zh-navy"
              }`}
            >
              My Listings
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "leads"
                  ? "text-zh-pink border-b-2 border-zh-pink"
                  : "text-zh-gray-dark hover:text-zh-navy"
              }`}
            >
              Leads
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-zh-navy" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-zh-navy mb-1">{stat.value}</div>
                      <div className="text-sm text-zh-gray-dark">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6">
                <h2 className="text-xl font-semibold text-zh-navy mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/list-property"
                    className="flex items-center space-x-3 p-4 border border-zh-gray-light rounded-lg hover:border-zh-pink transition-colors"
                  >
                    <div className="w-12 h-12 bg-zh-pink rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-zh-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zh-navy">Add New Listing</h3>
                      <p className="text-sm text-zh-gray">List your property</p>
                    </div>
                  </Link>
                  <Link
                    href="/chat"
                    className="flex items-center space-x-3 p-4 border border-zh-gray-light rounded-lg hover:border-zh-blue transition-colors"
                  >
                    <div className="w-12 h-12 bg-zh-blue rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-zh-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zh-navy">View Messages</h3>
                      <p className="text-sm text-zh-gray">Respond to leads</p>
                    </div>
                  </Link>
                  <Link
                    href="/owner/dashboard?tab=leads"
                    className="flex items-center space-x-3 p-4 border border-zh-gray-light rounded-lg hover:border-zh-pink transition-colors"
                  >
                    <div className="w-12 h-12 bg-zh-pink rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-zh-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zh-navy">View Analytics</h3>
                      <p className="text-sm text-zh-gray">Track performance</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Listings */}
              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-zh-navy">Recent Listings</h2>
                  <Link
                    href="/owner/dashboard?tab=listings"
                    className="text-zh-pink hover:underline text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myListings.slice(0, 2).map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === "listings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zh-navy">My Listings</h2>
                <Link
                  href="/list-property"
                  className="flex items-center space-x-2 px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((property) => (
                  <div key={property.id} className="relative">
                    <PropertyCard property={property} />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6">
              <h2 className="text-xl font-semibold text-zh-navy mb-6">Leads</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-zh-gray-light rounded-lg hover:border-zh-pink transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full" />
                      <div>
                        <h3 className="font-semibold text-zh-navy">Lead {i}</h3>
                        <p className="text-sm text-zh-gray-dark">
                          Interested in 2BHK Flat near MR-9
                        </p>
                        <p className="text-xs text-zh-gray">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 border border-zh-blue text-zh-blue rounded-lg hover:bg-zh-blue/10 transition-colors">
                        Contact
                      </button>
                      <button className="p-2 border border-zh-gray-light rounded-lg hover:bg-zh-soft">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

