"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MessageSquare,
  UserPlus,
  MoreVertical,
  Star,
  MapPin,
  Building,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "owner" | "buyer" | "broker";
  properties?: number;
  rating?: number;
  location?: string;
  lastContact?: string;
  notes?: string;
}

const mockContacts: Contact[] = [
  {
    id: "contact_1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    role: "buyer",
    rating: 4.5,
    location: "Indore, MP",
    lastContact: "2025-01-15T10:30:00Z",
    notes: "Interested in 2BHK properties",
  },
  {
    id: "contact_2",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 9876543211",
    role: "owner",
    properties: 3,
    rating: 4.8,
    location: "Mumbai, MH",
    lastContact: "2025-01-14T14:20:00Z",
  },
  {
    id: "contact_3",
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 9876543212",
    role: "broker",
    properties: 12,
    rating: 4.2,
    location: "Delhi, DL",
    lastContact: "2025-01-13T09:15:00Z",
  },
  {
    id: "contact_4",
    name: "Sneha Desai",
    email: "sneha@example.com",
    phone: "+91 9876543213",
    role: "buyer",
    rating: 4.7,
    location: "Pune, MH",
    lastContact: "2025-01-12T16:45:00Z",
    notes: "Looking for PG accommodation",
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "owner" | "buyer" | "broker">("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === "all" || contact.role === filter;
    const matchesSearch =
      searchQuery === "" ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getRoleColor = (role: Contact["role"]) => {
    switch (role) {
      case "owner":
        return "bg-zh-pink/20 text-zh-pink";
      case "buyer":
        return "bg-zh-blue/20 text-zh-blue";
      case "broker":
        return "bg-zh-success/20 text-zh-success";
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
            <Link
              href="/dashboard"
              className="text-zh-pink hover:underline mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
                  Contacts
                </h1>
                <p className="text-zh-gray-dark">
                  Manage your contacts from web and mobile app
                </p>
              </div>
              <button className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Add Contact</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contacts List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search contacts..."
                      className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    {(["all", "owner", "buyer", "broker"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setFilter(role)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                          filter === role
                            ? "bg-zh-pink text-zh-navy"
                            : "bg-zh-soft text-zh-gray-dark hover:bg-zh-gray-light"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contacts Grid */}
              {filteredContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedContact?.id === contact.id ? "border-zh-pink" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          {contact.avatar ? (
                            <Image
                              src={contact.avatar}
                              alt={contact.name}
                              width={64}
                              height={64}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-white text-xl font-bold">
                              {contact.name[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-zh-navy">{contact.name}</h3>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getRoleColor(
                                  contact.role
                                )}`}
                              >
                                {contact.role}
                              </span>
                            </div>
                            <button className="p-1 hover:bg-zh-soft rounded-lg">
                              <MoreVertical className="w-5 h-5 text-zh-gray" />
                            </button>
                          </div>
                          {contact.rating && (
                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="w-4 h-4 fill-zh-pink text-zh-pink" />
                              <span className="text-sm text-zh-gray-dark">
                                {contact.rating}
                              </span>
                            </div>
                          )}
                          {contact.location && (
                            <div className="flex items-center space-x-1 text-sm text-zh-gray-dark mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{contact.location}</span>
                            </div>
                          )}
                          {contact.properties && (
                            <div className="flex items-center space-x-1 text-sm text-zh-gray-dark">
                              <Building className="w-4 h-4" />
                              <span>{contact.properties} properties</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center">
                  <Users className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                  <p className="text-xl text-zh-gray-dark mb-2">No contacts found</p>
                  <p className="text-zh-gray">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Start adding contacts to see them here"}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedContact ? (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 sticky top-24">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      {selectedContact.avatar ? (
                        <Image
                          src={selectedContact.avatar}
                          alt={selectedContact.name}
                          width={96}
                          height={96}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-white text-3xl font-bold">
                          {selectedContact.name[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-zh-navy mb-1">
                      {selectedContact.name}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(
                        selectedContact.role
                      )}`}
                    >
                      {selectedContact.role}
                    </span>
                    {selectedContact.rating && (
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <Star className="w-4 h-4 fill-zh-pink text-zh-pink" />
                        <span className="text-sm text-zh-gray-dark">
                          {selectedContact.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-zh-navy mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <a
                          href={`tel:${selectedContact.phone}`}
                          className="flex items-center space-x-3 p-3 bg-zh-soft rounded-lg hover:bg-zh-gray-light transition-colors"
                        >
                          <Phone className="w-5 h-5 text-zh-pink" />
                          <span className="text-zh-navy">{selectedContact.phone}</span>
                        </a>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="flex items-center space-x-3 p-3 bg-zh-soft rounded-lg hover:bg-zh-gray-light transition-colors"
                        >
                          <Mail className="w-5 h-5 text-zh-pink" />
                          <span className="text-zh-navy">{selectedContact.email}</span>
                        </a>
                        {selectedContact.location && (
                          <div className="flex items-center space-x-3 p-3 bg-zh-soft rounded-lg">
                            <MapPin className="w-5 h-5 text-zh-pink" />
                            <span className="text-zh-navy">{selectedContact.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedContact.notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-zh-navy mb-2">Notes</h4>
                        <p className="text-sm text-zh-gray-dark bg-zh-soft p-3 rounded-lg">
                          {selectedContact.notes}
                        </p>
                      </div>
                    )}

                    {selectedContact.lastContact && (
                      <div>
                        <h4 className="text-sm font-semibold text-zh-navy mb-2">Last Contact</h4>
                        <p className="text-sm text-zh-gray-dark">
                          {new Date(selectedContact.lastContact).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/chat?contact=${selectedContact.id}`}
                      className="w-full px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Send Message</span>
                    </Link>
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="w-full px-4 py-2 border border-zh-blue text-zh-blue font-semibold rounded-lg hover:bg-zh-blue/10 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="w-full px-4 py-2 border border-zh-gray-light text-zh-navy font-semibold rounded-lg hover:bg-zh-soft transition-colors flex items-center justify-center space-x-2"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-12 text-center">
                  <Users className="w-16 h-16 text-zh-gray mx-auto mb-4" />
                  <p className="text-zh-gray-dark">Select a contact to view details</p>
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



