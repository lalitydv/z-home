"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { mockProperties, mockUser } from "@/lib/mock-data";
import { 
  Heart, 
  MessageSquare, 
  Calendar, 
  Search, 
  Settings, 
  User, 
  Bell, 
  Users, 
  FileText 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"saved" | "bookings" | "searches" | "profile">("saved");
  const savedProperties = mockProperties.slice(0, 3);
  const recentSearches = [
    { query: "2BHK in Palasia", city: "Indore", date: "2 days ago" },
    { query: "PG near college", city: "Indore", date: "5 days ago" },
  ];
  const upcomingBookings = [
    {
      id: "1",
      property: mockProperties[0],
      date: "2025-01-20",
      time: "10:00 AM",
      status: "confirmed",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
              Welcome back, {mockUser.name}!
            </h1>
            <p className="text-zh-gray-dark">Manage your properties, bookings, and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-4 sticky top-24">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "saved"
                        ? "bg-zh-pink text-zh-navy font-semibold"
                        : "text-zh-gray-dark hover:bg-zh-soft"
                      }`}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Saved Properties</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "bookings"
                        ? "bg-zh-pink text-zh-navy font-semibold"
                        : "text-zh-gray-dark hover:bg-zh-soft"
                      }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Bookings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("searches")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "searches"
                        ? "bg-zh-pink text-zh-navy font-semibold"
                        : "text-zh-gray-dark hover:bg-zh-soft"
                      }`}
                  >
                    <Search className="w-5 h-5" />
                    <span>Recent Searches</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "profile"
                        ? "bg-zh-pink text-zh-navy font-semibold"
                        : "text-zh-gray-dark hover:bg-zh-soft"
                      }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <Link
                    href="/chat"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-zh-gray-dark hover:bg-zh-soft transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    href="/enquiry"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-zh-gray-dark hover:bg-zh-soft transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Enquiries</span>
                  </Link>
                  <Link
                    href="/dashboard/notifications"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-zh-gray-dark hover:bg-zh-soft transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    href="/dashboard/contacts"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-zh-gray-dark hover:bg-zh-soft transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    <span>Contacts</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-zh-gray-dark hover:bg-zh-soft transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Saved Properties */}
              {activeTab === "saved" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-zh-navy">Saved Properties</h2>
                    <Link
                      href="/search"
                      className="text-zh-pink hover:underline font-medium"
                    >
                      Browse More
                    </Link>
                  </div>
                  {savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} isLiked={true} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-12 text-center">
                      <Heart className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                      <p className="text-xl text-zh-gray-dark mb-2">No saved properties yet</p>
                      <p className="text-zh-gray mb-4">Start exploring and save your favorites!</p>
                      <Link
                        href="/search"
                        className="inline-block px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90"
                      >
                        Browse Properties
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings */}
              {activeTab === "bookings" && (
                <div>
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Upcoming Bookings</h2>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-zh-navy mb-2">
                                {booking.property.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-zh-gray-dark">
                                <span>📅 {new Date(booking.date).toLocaleDateString()}</span>
                                <span>🕐 {booking.time}</span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed"
                                      ? "bg-zh-success/20 text-zh-success"
                                      : "bg-zh-gray/20 text-zh-gray-dark"
                                    }`}
                                >
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                            <Link
                              href={`/property/${booking.property.id}`}
                              className="text-zh-pink hover:underline"
                            >
                              View Property
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-12 text-center">
                      <Calendar className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                      <p className="text-xl text-zh-gray-dark mb-2">No bookings yet</p>
                      <p className="text-zh-gray mb-4">Schedule a visit to see it here!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Searches */}
              {activeTab === "searches" && (
                <div>
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Recent Searches</h2>
                  {recentSearches.length > 0 ? (
                    <div className="space-y-3">
                      {recentSearches.map((search, index) => (
                        <Link
                          key={index}
                          href={`/search?q=${encodeURIComponent(search.query)}&city=${search.city}`}
                          className="block bg-white rounded-xl p-4 shadow-sm border border-zh-gray-light hover:border-zh-pink transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-zh-navy">{search.query}</p>
                              <p className="text-sm text-zh-gray">{search.city} • {search.date}</p>
                            </div>
                            <Search className="w-5 h-5 text-zh-gray" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-12 text-center">
                      <Search className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                      <p className="text-xl text-zh-gray-dark mb-2">No recent searches</p>
                    </div>
                  )}
                </div>
              )}

              {/* Profile */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Profile</h2>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {mockUser.name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-zh-navy">{mockUser.name}</h3>
                        <p className="text-zh-gray">{mockUser.email}</p>
                        <p className="text-zh-gray">{mockUser.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={mockUser.name}
                          className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={mockUser.email}
                          className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue={mockUser.phone}
                          className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                      </div>
                      <button className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90">
                        Save Changes
                      </button>
                    </div>
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

