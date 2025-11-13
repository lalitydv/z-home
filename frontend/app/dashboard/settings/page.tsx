"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Save,
  Camera,
  Trash2,
  LogOut,
  CreditCard,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { mockUser } from "@/lib/mock-data";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "notifications" | "privacy" | "preferences"
  >("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    propertyUpdates: true,
    messages: true,
    bookings: true,
    promotions: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showPhone: true,
    showEmail: false,
    allowMessages: true,
  });
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    currency: "INR",
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log("Profile update:", data);
    toast.success("Profile updated successfully!");
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Password change:", data);
    toast.success("Password changed successfully!");
    resetPassword();
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.success("Account deletion requested");
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      toast.success("Logged out successfully");
      // Redirect to login
      window.location.href = "/auth/login";
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
            <h1 className="text-3xl font-bold text-zh-navy mb-2 font-poppins">
              Settings
            </h1>
            <p className="text-zh-gray-dark">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-4 sticky top-24">
                <nav className="space-y-2">
                  {[
                    { id: "profile", icon: User, label: "Profile" },
                    { id: "password", icon: Lock, label: "Password" },
                    { id: "notifications", icon: Bell, label: "Notifications" },
                    { id: "privacy", icon: Shield, label: "Privacy" },
                    { id: "preferences", icon: Globe, label: "Preferences" },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-zh-pink text-zh-navy font-semibold"
                            : "text-zh-gray-dark hover:bg-zh-soft"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Profile Settings</h2>
                  
                  {/* Avatar */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                          {mockUser.name[0]}
                        </span>
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-zh-pink rounded-full hover:opacity-90 transition-opacity">
                        <Camera className="w-4 h-4 text-zh-navy" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zh-navy">{mockUser.name}</h3>
                      <p className="text-zh-gray-dark">{mockUser.email}</p>
                      <button className="text-sm text-zh-pink hover:underline mt-2">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                          <input
                            {...registerProfile("name")}
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                          />
                        </div>
                        {profileErrors.name && (
                          <p className="text-zh-danger text-sm mt-1">{profileErrors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                          <input
                            {...registerProfile("email")}
                            type="email"
                            className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                          />
                        </div>
                        {profileErrors.email && (
                          <p className="text-zh-danger text-sm mt-1">{profileErrors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                          <input
                            {...registerProfile("phone")}
                            type="tel"
                            className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                          />
                        </div>
                        {profileErrors.phone && (
                          <p className="text-zh-danger text-sm mt-1">{profileErrors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          City
                        </label>
                        <input
                          {...registerProfile("city")}
                          type="text"
                          placeholder="e.g., Indore"
                          className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          State
                        </label>
                        <input
                          {...registerProfile("state")}
                          type="text"
                          placeholder="e.g., Madhya Pradesh"
                          className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zh-navy mb-2">
                          Pincode
                        </label>
                        <input
                          {...registerProfile("pincode")}
                          type="text"
                          placeholder="e.g., 452001"
                          className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-zh-gray" />
                        <textarea
                          {...registerProfile("address")}
                          rows={3}
                          placeholder="Enter your full address"
                          className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4 border-t border-zh-gray-light">
                      <button
                        type="button"
                        className="px-6 py-2 border border-zh-gray-light text-zh-navy rounded-lg hover:bg-zh-soft transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Change Password</h2>
                  
                  <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Current Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                        <input
                          {...registerPassword("currentPassword")}
                          type={showCurrentPassword ? "text" : "password"}
                          className="w-full pl-10 pr-10 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-zh-danger text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                        <input
                          {...registerPassword("newPassword")}
                          type={showNewPassword ? "text" : "password"}
                          className="w-full pl-10 pr-10 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-zh-danger text-sm mt-1">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                        <input
                          {...registerPassword("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full pl-10 pr-10 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-zh-danger text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4 border-t border-zh-gray-light">
                      <button
                        type="button"
                        onClick={() => resetPassword()}
                        className="px-6 py-2 border border-zh-gray-light text-zh-navy rounded-lg hover:bg-zh-soft transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 border border-zh-gray-light rounded-lg hover:border-zh-pink transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold text-zh-navy capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </h3>
                          <p className="text-sm text-zh-gray-dark">
                            {key === "email" && "Receive notifications via email"}
                            {key === "sms" && "Receive notifications via SMS"}
                            {key === "push" && "Receive push notifications"}
                            {key === "propertyUpdates" && "Get updates about saved properties"}
                            {key === "messages" && "Get notified about new messages"}
                            {key === "bookings" && "Get notified about booking updates"}
                            {key === "promotions" && "Receive promotional offers and deals"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setNotifications({ ...notifications, [key]: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zh-gray-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zh-pink rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zh-pink"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-zh-gray-light">
                    <button
                      onClick={() => toast.success("Notification preferences saved!")}
                      className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) =>
                          setPrivacy({ ...privacy, profileVisibility: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>

                    {[
                      { key: "showPhone", label: "Show Phone Number", desc: "Allow others to see your phone number" },
                      { key: "showEmail", label: "Show Email Address", desc: "Allow others to see your email" },
                      { key: "allowMessages", label: "Allow Messages", desc: "Allow others to message you" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 border border-zh-gray-light rounded-lg hover:border-zh-pink transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold text-zh-navy">{item.label}</h3>
                          <p className="text-sm text-zh-gray-dark">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacy[item.key as keyof typeof privacy] as boolean}
                            onChange={(e) =>
                              setPrivacy({ ...privacy, [item.key]: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zh-gray-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zh-pink rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zh-pink"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-zh-gray-light">
                    <button
                      onClick={() => toast.success("Privacy settings saved!")}
                      className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-zh-navy mb-6">Preferences</h2>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Theme
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setPreferences({ ...preferences, theme: "light" })}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            preferences.theme === "light"
                              ? "border-zh-pink bg-zh-pink/10"
                              : "border-zh-gray-light hover:border-zh-pink"
                          }`}
                        >
                          <Sun className="w-5 h-5" />
                          <span>Light</span>
                        </button>
                        <button
                          onClick={() => setPreferences({ ...preferences, theme: "dark" })}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            preferences.theme === "dark"
                              ? "border-zh-pink bg-zh-pink/10"
                              : "border-zh-gray-light hover:border-zh-pink"
                          }`}
                        >
                          <Moon className="w-5 h-5" />
                          <span>Dark</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) =>
                          setPreferences({ ...preferences, language: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                        <option value="gu">Gujarati</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zh-navy mb-2">
                        Currency
                      </label>
                      <select
                        value={preferences.currency}
                        onChange={(e) =>
                          setPreferences({ ...preferences, currency: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zh-gray-light">
                    <button
                      onClick={() => toast.success("Preferences saved!")}
                      className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-zh-danger/20 p-6 md:p-8">
            <h2 className="text-xl font-bold text-zh-danger mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zh-soft rounded-lg">
                <div>
                  <h3 className="font-semibold text-zh-navy">Delete Account</h3>
                  <p className="text-sm text-zh-gray-dark">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-zh-danger text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-zh-soft rounded-lg">
                <div>
                  <h3 className="font-semibold text-zh-navy">Logout</h3>
                  <p className="text-sm text-zh-gray-dark">Sign out from your account</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-zh-gray-light text-zh-navy font-semibold rounded-lg hover:bg-zh-soft transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



