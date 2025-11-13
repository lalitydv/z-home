"use client";

import Link from "next/link";
import { Search, MapPin, User, Menu, X, Heart, MessageSquare, Calendar, Home, Settings, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

export function RoleBasedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("userRole");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
      setUserRole(storedRole);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    setUser(null);
    setUserRole(null);
    router.push("/");
    toast.success("Logged out successfully");
  };

  // Role-based navigation items
  const getRoleBasedNav = () => {
    if (!userRole) {
      return (
        <>
          <Link
            href="/search"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Explore</span>
          </Link>
          <Link
            href="/list-property"
            className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            List Property
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center space-x-2 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Login</span>
          </Link>
        </>
      );
    }

    // Buyer navigation
    if (userRole === "buyer") {
      return (
        <>
          <Link
            href="/search"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Explore</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Saved</span>
          </Link>
          <Link
            href="/bookings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zh-gray-dark hover:text-zh-navy transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </>
      );
    }

    // Seller navigation
    if (userRole === "seller") {
      return (
        <>
          <Link
            href="/list-property"
            className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            List Property
          </Link>
          <Link
            href="/owner/dashboard"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>My Properties</span>
          </Link>
          <Link
            href="/bookings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zh-gray-dark hover:text-zh-navy transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </>
      );
    }

    // Broker navigation
    if (userRole === "broker") {
      return (
        <>
          <Link
            href="/list-property"
            className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            List Property
          </Link>
          <Link
            href="/owner/dashboard"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>My Listings</span>
          </Link>
          <Link
            href="/search"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Browse</span>
          </Link>
          <Link
            href="/bookings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zh-gray-dark hover:text-zh-navy transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </>
      );
    }

    // Admin navigation (limited)
    if (userRole === "admin") {
      return (
        <>
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-1 px-3 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Shield className="w-4 h-4" />
            <span>Admin Panel</span>
          </Link>
          <Link
            href="/search"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Explore</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zh-gray-dark hover:text-zh-navy transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </>
      );
    }

    // Superadmin navigation (ALL features from all roles)
    if (userRole === "superadmin") {
      return (
        <>
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-1 px-3 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Shield className="w-4 h-4" />
            <span>Admin Panel</span>
          </Link>
          <Link
            href="/list-property"
            className="px-4 py-2 bg-zh-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            List Property
          </Link>
          <Link
            href="/search"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Explore</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Saved</span>
          </Link>
          <Link
            href="/owner/dashboard"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>My Properties</span>
          </Link>
          <Link
            href="/bookings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-1 px-3 py-2 text-zh-navy hover:text-zh-pink transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "S"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zh-gray-dark hover:text-zh-navy transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-zh-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className="font-poppins font-bold text-xl text-zh-navy hidden sm:block transition-colors group-hover:text-zh-pink">
              Z-Homes
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zh-gray w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, areas, cities..."
                className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink focus:border-transparent"
              />
            </div>
          </form>

          {/* Desktop Navigation - Role Based */}
          <nav className="hidden md:flex items-center space-x-2">
            {getRoleBasedNav()}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zh-navy"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zh-gray w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu - Role Based */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-zh-gray-light mt-2 pt-4">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
              {userRole === "buyer" && (
                <>
                  <Link
                    href="/search"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Explore</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Saved Properties</span>
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Bookings</span>
                  </Link>
                </>
              )}
              {(userRole === "seller" || userRole === "broker") && (
                <>
                  <Link
                    href="/list-property"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg text-center"
                  >
                    List Property
                  </Link>
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Home className="w-5 h-5" />
                    <span>My Properties</span>
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Bookings</span>
                  </Link>
                </>
              )}
              {userRole === "admin" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg text-center"
                >
                  Admin Panel
                </Link>
              )}
              {userRole === "superadmin" && (
                <>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg text-center"
                  >
                    Admin Panel
                  </Link>
                  <Link
                    href="/list-property"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 bg-zh-blue text-white font-semibold rounded-lg text-center"
                  >
                    List Property
                  </Link>
                  <Link
                    href="/search"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Explore</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Saved Properties</span>
                  </Link>
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Home className="w-5 h-5" />
                    <span>My Properties</span>
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Bookings</span>
                  </Link>
                </>
              )}
              {userRole && (
                <>
                  <Link
                    href="/chat"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-zh-navy hover:bg-zh-soft rounded-lg"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 border border-zh-gray text-zh-navy rounded-lg text-center mt-2"
                  >
                    Logout
                  </button>
                </>
              )}
              {!userRole && (
                <>
                  <Link
                    href="/list-property"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg text-center mt-2"
                  >
                    List Property
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 border border-zh-blue text-zh-navy rounded-lg text-center mt-2"
                  >
                    Login / Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

