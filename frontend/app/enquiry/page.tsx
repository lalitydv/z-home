"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { mockProperties } from "@/lib/mock-data";
import { useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface Enquiry {
  id: string;
  propertyId: string;
  property: typeof mockProperties[0];
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "pending" | "responded" | "closed";
  source: "web" | "mobile";
}

const mockEnquiries: Enquiry[] = [
  {
    id: "enq_1",
    propertyId: mockProperties[0].id,
    property: mockProperties[0],
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    message: "Hi, I'm interested in this property. Is it still available?",
    date: "2025-01-15T10:30:00Z",
    status: "pending",
    source: "mobile",
  },
  {
    id: "enq_2",
    propertyId: mockProperties[1].id,
    property: mockProperties[1],
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 9876543211",
    message: "Can I schedule a visit this weekend?",
    date: "2025-01-14T14:20:00Z",
    status: "responded",
    source: "web",
  },
  {
    id: "enq_3",
    propertyId: mockProperties[2].id,
    property: mockProperties[2],
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 9876543212",
    message: "What is the rent negotiation scope?",
    date: "2025-01-13T09:15:00Z",
    status: "closed",
    source: "mobile",
  },
];

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [filter, setFilter] = useState<"all" | "pending" | "responded" | "closed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesFilter = filter === "all" || enq.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      enq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: Enquiry["status"]) => {
    setEnquiries(
      enquiries.map((enq) => (enq.id === id ? { ...enq, status: newStatus } : enq))
    );
    toast.success("Status updated successfully!");
  };

  const getStatusColor = (status: Enquiry["status"]) => {
    switch (status) {
      case "pending":
        return "bg-zh-pink/20 text-zh-pink";
      case "responded":
        return "bg-zh-blue/20 text-zh-blue";
      case "closed":
        return "bg-zh-gray/20 text-zh-gray-dark";
      default:
        return "bg-zh-gray/20 text-zh-gray-dark";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
              Property Enquiries
            </h1>
            <p className="text-zh-gray-dark">
              Manage all enquiries from web and mobile app
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, property, or message..."
                  className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                />
              </div>
              <div className="flex items-center space-x-2">
                {(["all", "pending", "responded", "closed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filter === status
                        ? "bg-zh-pink text-zh-navy"
                        : "bg-zh-soft text-zh-gray-dark hover:bg-zh-gray-light"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enquiries List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className={`bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedEnquiry?.id === enquiry.id ? "border-zh-pink" : ""
                    }`}
                    onClick={() => setSelectedEnquiry(enquiry)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl font-bold">
                          {enquiry.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-zh-navy">{enquiry.name}</h3>
                            <p className="text-sm text-zh-gray-dark truncate">
                              {enquiry.property.title}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                enquiry.status
                              )}`}
                            >
                              {enquiry.status}
                            </span>
                            {enquiry.source === "mobile" && (
                              <span className="px-2 py-1 bg-zh-blue/20 text-zh-blue text-xs font-semibold rounded">
                                Mobile
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-zh-gray-dark mb-3 line-clamp-2">
                          {enquiry.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-zh-gray">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{enquiry.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{enquiry.phone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(enquiry.date).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                  <p className="text-xl text-zh-gray-dark mb-2">No enquiries found</p>
                  <p className="text-zh-gray">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "You'll see enquiries here when people contact you"}
                  </p>
                </div>
              )}
            </div>

            {/* Enquiry Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedEnquiry ? (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 sticky top-24">
                  <div className="mb-6">
                    <Link
                      href={`/property/${selectedEnquiry.propertyId}`}
                      className="block mb-4"
                    >
                      <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3">
                        {selectedEnquiry.property.images[0] ? (
                          <Image
                            src={selectedEnquiry.property.images[0]}
                            alt={selectedEnquiry.property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">Z</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-zh-navy hover:text-zh-pink transition-colors">
                        {selectedEnquiry.property.title}
                      </h3>
                      <p className="text-sm text-zh-gray-dark">
                        {selectedEnquiry.property.location.address}
                      </p>
                    </Link>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-zh-navy mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="w-4 h-4 text-zh-gray" />
                          <span className="text-zh-gray-dark">{selectedEnquiry.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-zh-gray" />
                          <a
                            href={`mailto:${selectedEnquiry.email}`}
                            className="text-zh-pink hover:underline"
                          >
                            {selectedEnquiry.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-zh-gray" />
                          <a
                            href={`tel:${selectedEnquiry.phone}`}
                            className="text-zh-pink hover:underline"
                          >
                            {selectedEnquiry.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-zh-navy mb-2">Message</h4>
                      <p className="text-sm text-zh-gray-dark bg-zh-soft p-3 rounded-lg">
                        {selectedEnquiry.message}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-zh-navy mb-2">Enquiry Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-zh-gray-dark">Date:</span>
                          <span className="text-zh-navy">
                            {new Date(selectedEnquiry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zh-gray-dark">Time:</span>
                          <span className="text-zh-navy">
                            {new Date(selectedEnquiry.date).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zh-gray-dark">Source:</span>
                          <span className="text-zh-navy capitalize">{selectedEnquiry.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Update Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleStatusChange(selectedEnquiry.id, "pending")}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            selectedEnquiry.status === "pending"
                              ? "bg-zh-pink text-zh-navy"
                              : "bg-zh-soft text-zh-gray-dark hover:bg-zh-pink/20"
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedEnquiry.id, "responded")}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            selectedEnquiry.status === "responded"
                              ? "bg-zh-blue text-zh-navy"
                              : "bg-zh-soft text-zh-gray-dark hover:bg-zh-blue/20"
                          }`}
                        >
                          Responded
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedEnquiry.id, "closed")}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            selectedEnquiry.status === "closed"
                              ? "bg-zh-gray text-zh-navy"
                              : "bg-zh-soft text-zh-gray-dark hover:bg-zh-gray/20"
                          }`}
                        >
                          Closed
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/chat?thread=${selectedEnquiry.id}`}
                        className="w-full px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>Send Message</span>
                      </Link>
                      <a
                        href={`tel:${selectedEnquiry.phone}`}
                        className="w-full px-4 py-2 border border-zh-blue text-zh-blue font-semibold rounded-lg hover:bg-zh-blue/10 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className="w-full px-4 py-2 border border-zh-gray-light text-zh-navy font-semibold rounded-lg hover:bg-zh-soft transition-colors flex items-center justify-center space-x-2"
                      >
                        <Mail className="w-5 h-5" />
                        <span>Send Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-12 text-center">
                  <Eye className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                  <p className="text-zh-gray-dark">Select an enquiry to view details</p>
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

