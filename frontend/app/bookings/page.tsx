"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockProperties } from "@/lib/mock-data";
import { Calendar, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const bookings = [
  {
    id: "1",
    property: mockProperties[0],
    date: "2025-01-20",
    time: "10:00 AM",
    status: "confirmed",
    owner: { name: mockProperties[0].ownerName, phone: "+91 9876543210" },
  },
  {
    id: "2",
    property: mockProperties[1],
    date: "2025-01-22",
    time: "2:00 PM",
    status: "pending",
    owner: { name: mockProperties[1].ownerName, phone: "+91 9876543211" },
  },
  {
    id: "3",
    property: mockProperties[2],
    date: "2025-01-18",
    time: "11:00 AM",
    status: "cancelled",
    owner: { name: mockProperties[2].ownerName, phone: "+91 9876543212" },
  },
];

export default function BookingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
              My Bookings
            </h1>
            <p className="text-zh-gray-dark">Manage your property visits and appointments</p>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 bg-zh-gray-light rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <Link
                          href={`/property/${booking.property.id}`}
                          className="text-xl font-semibold text-zh-navy hover:text-zh-pink transition-colors mb-2"
                        >
                          {booking.property.title}
                        </Link>
                        <div className="flex items-center text-sm text-zh-gray-dark mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{booking.property.location.address}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-zh-gray-dark">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-zh-success/20 text-zh-success"
                          : booking.status === "pending"
                          ? "bg-zh-pink/20 text-zh-pink"
                          : "bg-zh-danger/20 text-zh-danger"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 border border-zh-gray-light rounded-lg hover:bg-zh-soft transition-colors">
                        <Phone className="w-5 h-5 text-zh-navy" />
                      </button>
                      <button className="p-2 border border-zh-gray-light rounded-lg hover:bg-zh-soft transition-colors">
                        <MessageSquare className="w-5 h-5 text-zh-navy" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {bookings.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center">
              <Calendar className="w-16 h-16 text-zh-gray mx-auto mb-4" />
              <p className="text-xl text-zh-gray-dark mb-2">No bookings yet</p>
              <p className="text-zh-gray mb-4">Schedule a visit to see it here!</p>
              <Link
                href="/search"
                className="inline-block px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90"
              >
                Browse Properties
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

