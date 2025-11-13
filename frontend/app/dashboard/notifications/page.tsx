"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  Heart,
  Star,
  AlertCircle,
  Info,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: "message" | "booking" | "property" | "system" | "enquiry";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  icon: any;
}

const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    type: "message",
    title: "New Message",
    message: "Rahul Sharma sent you a message about 2BHK Flat",
    timestamp: "2025-01-15T10:30:00Z",
    read: false,
    link: "/chat",
    icon: MessageSquare,
  },
  {
    id: "notif_2",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your visit to Spacious 2BHK Flat is confirmed for Jan 20",
    timestamp: "2025-01-15T09:15:00Z",
    read: false,
    link: "/bookings",
    icon: Calendar,
  },
  {
    id: "notif_3",
    type: "enquiry",
    title: "New Enquiry",
    message: "Priya Patel enquired about your property",
    timestamp: "2025-01-14T14:20:00Z",
    read: true,
    link: "/enquiry",
    icon: AlertCircle,
  },
  {
    id: "notif_4",
    type: "property",
    title: "Property Saved",
    message: "Someone saved your property to favorites",
    timestamp: "2025-01-14T11:00:00Z",
    read: true,
    link: "/owner/dashboard",
    icon: Heart,
  },
  {
    id: "notif_5",
    type: "system",
    title: "System Update",
    message: "Your profile has been verified successfully",
    timestamp: "2025-01-13T16:45:00Z",
    read: true,
    icon: CheckCircle,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => !n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return "bg-zh-blue/20 text-zh-blue";
      case "booking":
        return "bg-zh-success/20 text-zh-success";
      case "enquiry":
        return "bg-zh-pink/20 text-zh-pink";
      case "property":
        return "bg-zh-pink/20 text-zh-pink";
      case "system":
        return "bg-zh-gray/20 text-zh-gray-dark";
      default:
        return "bg-zh-gray/20 text-zh-gray-dark";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zh-soft pb-16 md:pb-0">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
                  Notifications
                </h1>
                <p className="text-zh-gray-dark">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-zh-gray" />
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    filter === f
                      ? "bg-zh-pink text-zh-navy"
                      : "bg-zh-soft text-zh-gray-dark hover:bg-zh-gray-light"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 transition-all hover:shadow-lg ${
                      !notification.read ? "border-zh-pink" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-zh-navy mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-zh-gray-dark">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-zh-pink rounded-full flex-shrink-0 mt-2 ml-2" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-zh-gray">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-zh-pink hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                            {notification.link && (
                              <Link
                                href={notification.link}
                                className="text-xs text-zh-blue hover:underline"
                              >
                                View
                              </Link>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-zh-danger hover:underline flex items-center space-x-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <Bell className="w-16 h-16 text-zh-gray mx-auto mb-4" />
              <p className="text-xl text-zh-gray-dark mb-2">No notifications</p>
              <p className="text-zh-gray">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "You'll see notifications here"}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}



