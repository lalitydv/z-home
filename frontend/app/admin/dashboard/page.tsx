"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminProtect } from "@/components/admin-protect";
import {
  Users,
  Home,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Search,
  Filter,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI, authAPI } from "@/lib/api";
import { mockProperties } from "@/lib/mock-data";
import { PropertyDetailModal } from "@/components/property-detail-modal";
import { UserDetailModal } from "@/components/user-detail-modal";
import { OrderDetailModal } from "@/components/order-detail-modal";

type TabType = "dashboard" | "properties" | "users" | "orders";

interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalOrders: number;
  pendingApprovals: number;
  revenue: number;
  activeUsers: number;
  verifiedProperties: number;
  totalSellers: number;
  totalBuyers: number;
  totalVendors: number;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingApprovals: 0,
    revenue: 0,
    activeUsers: 0,
    verifiedProperties: 0,
    totalSellers: 0,
    totalBuyers: 0,
    totalVendors: 0,
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [propertyFilter, setPropertyFilter] = useState({
    type: "all", // all, sell, rent
    status: "all", // all, available, booked, sold, rented
    approval: "all", // all, approved, pending
  });
  const [userFilter, setUserFilter] = useState({
    role: "all", // all, buyer, seller, broker, admin
    status: "all", // all, active, inactive
  });
  const [orderFilter, setOrderFilter] = useState({
    status: "all", // all, pending, approved, rejected, completed
  });

  // Modal states
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = () => {
    if (typeof window === "undefined") return;
    const userRole = localStorage.getItem("userRole");
    const user = localStorage.getItem("user");

    if (!user || (userRole !== "superadmin" && userRole !== "admin")) {
      router.push("/admin/login");
      return;
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load stats
      try {
        const statsResponse = await adminAPI.getDashboardStats();
        if (statsResponse.data?.data) {
          const backendStats = statsResponse.data.data;
          // Transform backend stats structure to match frontend expectations
          setStats({
            totalProperties: backendStats.properties?.total || 0,
            totalUsers: backendStats.users?.total || 0,
            totalOrders: backendStats.bookings?.total || 0,
            pendingApprovals: backendStats.properties?.pending || 0,
            revenue: 0, // Revenue not tracked in backend yet
            activeUsers: backendStats.users?.active || 0,
            verifiedProperties: backendStats.properties?.approved || 0,
            totalSellers: backendStats.users?.sellers || 0,
            totalBuyers: backendStats.users?.buyers || 0,
            totalVendors: backendStats.users?.brokers || 0,
          });
        }
      } catch (error: any) {
        console.error("Failed to load stats:", error);
        // If it's a 401 error, the interceptor will handle redirect
        if (error.response?.status === 401) {
          return;
        }
        // Use mock data if API fails
        setStats({
          totalProperties: 2342,
          totalUsers: 12456,
          totalOrders: 892,
          pendingApprovals: 23,
          revenue: 2400000,
          activeUsers: 8934,
          verifiedProperties: 1987,
          totalSellers: 3421,
          totalBuyers: 7892,
          totalVendors: 1143,
        });
      }

      // Load properties
      try {
        const propsResponse = await adminAPI.getAllProperties();
        if (propsResponse.data?.data?.properties) {
          setProperties(propsResponse.data.data.properties);
        } else if (propsResponse.data?.data) {
          // Handle case where data is directly an array
          setProperties(Array.isArray(propsResponse.data.data) ? propsResponse.data.data : []);
        } else {
          setProperties(mockProperties);
        }
      } catch (error: any) {
        console.error("Failed to load properties:", error);
        // If it's a 401 error, the interceptor will handle redirect
        if (error.response?.status === 401) {
          return;
        }
        setProperties(mockProperties);
      }

      // Load users
      try {
        const usersResponse = await adminAPI.getAllUsers();
        if (usersResponse.data?.data?.users) {
          setUsers(usersResponse.data.data.users);
        } else if (usersResponse.data?.data) {
          // Handle case where data is directly an array
          setUsers(Array.isArray(usersResponse.data.data) ? usersResponse.data.data : []);
        } else {
          setUsers([]);
        }
      } catch (error: any) {
        console.error("Failed to load users:", error);
        // If it's a 401 error, the interceptor will handle redirect
        if (error.response?.status === 401) {
          return;
        }
        setUsers([]);
      }

      // Load orders
      try {
        const ordersResponse = await adminAPI.getAllOrders();
        if (ordersResponse.data?.data?.orders) {
          setOrders(ordersResponse.data.data.orders);
        } else if (ordersResponse.data?.data?.bookings) {
          // Fallback to bookings if orders not available
          setOrders(ordersResponse.data.data.bookings);
        } else if (ordersResponse.data?.data) {
          // Handle case where data is directly an array
          setOrders(Array.isArray(ordersResponse.data.data) ? ordersResponse.data.data : []);
        } else {
          setOrders([]);
        }
      } catch (error: any) {
        console.error("Failed to load orders:", error);
        // If it's a 401 error, the interceptor will handle redirect
        if (error.response?.status === 401) {
          // Don't show error toast, redirect is handled by interceptor
          return;
        }
        // For other errors, just set empty array
        setOrders([]);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
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
    router.push("/admin/login");
    toast.success("Logged out successfully");
  };

  const handleApproveProperty = async (id: string) => {
    try {
      await adminAPI.approveProperty(id);
      toast.success("Property approved");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to approve property");
    }
  };

  const handleRejectProperty = async (id: string) => {
    try {
      await adminAPI.rejectProperty(id);
      toast.success("Property rejected");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reject property");
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await adminAPI.deleteProperty(id);
      toast.success("Property deleted");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete property");
    }
  };

  const handleToggleUserStatus = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await adminAPI.deactivateUser(id);
        toast.success("User deactivated");
      } else {
        await adminAPI.activateUser(id);
        toast.success("User activated");
      }
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success("User deleted");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete user");
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateOrderStatus(id, status);
      toast.success("Order status updated");
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update order status");
    }
  };

  // Enhanced filtering logic
  const filteredProperties = properties.filter((p) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter (sell = sold, rent = rented)
    const matchesType =
      propertyFilter.type === "all" ||
      (propertyFilter.type === "sell" && p.status === "sold") ||
      (propertyFilter.type === "rent" && p.status === "rented");

    // Status filter
    const matchesStatus =
      propertyFilter.status === "all" || p.status === propertyFilter.status;

    // Approval filter
    const matchesApproval =
      propertyFilter.approval === "all" ||
      (propertyFilter.approval === "approved" && p.isApproved) ||
      (propertyFilter.approval === "pending" && !p.isApproved);

    return matchesSearch && matchesType && matchesStatus && matchesApproval;
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = userFilter.role === "all" || u.role === userFilter.role;

    const matchesStatus =
      userFilter.status === "all" ||
      (userFilter.status === "active" && (u.status === "active" || u.isActive !== false)) ||
      (userFilter.status === "inactive" && (u.status === "inactive" || u.isActive === false));

    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.id?.toString().includes(searchQuery) ||
      o._id?.toString().includes(searchQuery) ||
      o.property?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      orderFilter.status === "all" || o.status === orderFilter.status;

    return matchesSearch && matchesStatus;
  });

  const pendingProperties = properties.filter((p) => !p.isApproved);

  // Property breakdown by type
  const propertyBreakdown = {
    total: properties.length,
    sell: properties.filter((p) => p.status === "sold").length,
    rent: properties.filter((p) => p.status === "rented").length,
    available: properties.filter((p) => p.status === "available").length,
    booked: properties.filter((p) => p.status === "booked").length,
  };

  return (
    <AdminProtect>
      <div className="min-h-screen bg-zh-soft">
        {/* Header */}
        <header className="bg-white border-b border-zh-gray-light sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <h1 className="text-xl font-bold text-zh-navy font-poppins">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-zh-gray-dark hover:text-zh-navy transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-zh-gray-light overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === "dashboard"
                  ? "text-zh-pink border-b-2 border-zh-pink"
                  : "text-zh-gray-dark hover:text-zh-navy"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === "properties"
                  ? "text-zh-pink border-b-2 border-zh-pink"
                  : "text-zh-gray-dark hover:text-zh-navy"
                }`}
            >
              Properties ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === "users"
                  ? "text-zh-pink border-b-2 border-zh-pink"
                  : "text-zh-gray-dark hover:text-zh-navy"
                }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === "orders"
                  ? "text-zh-pink border-b-2 border-zh-pink"
                  : "text-zh-gray-dark hover:text-zh-navy"
                }`}
            >
              Orders ({orders.length})
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-zh-pink rounded-lg flex items-center justify-center">
                      <Home className="w-6 h-6 text-zh-navy" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-zh-navy mb-1">
                    {(stats?.totalProperties || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-zh-gray-dark">Total Properties</div>
                  <div className="text-xs text-zh-success mt-1">
                    {stats?.verifiedProperties || 0} verified
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-zh-blue rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-zh-navy" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-zh-navy mb-1">
                    {(stats?.totalUsers || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-zh-gray-dark">Total Users</div>
                  <div className="text-xs text-zh-success mt-1">
                    {stats?.activeUsers || 0} active
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-zh-pink rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-zh-navy" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-zh-navy mb-1">
                    {(stats?.totalOrders || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-zh-gray-dark">Total Orders</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-zh-blue rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-zh-navy" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-zh-navy mb-1">
                    ₹{((stats?.revenue || 0) / 100000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-zh-gray-dark">Revenue</div>
                </div>
              </div>

              {/* Property Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6">
                <h2 className="text-xl font-semibold text-zh-navy mb-4">Property Breakdown</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-zh-soft rounded-lg">
                    <div className="text-2xl font-bold text-zh-navy">{propertyBreakdown.total}</div>
                    <div className="text-sm text-zh-gray-dark">Total</div>
                  </div>
                  <div className="text-center p-4 bg-zh-pink/10 rounded-lg">
                    <div className="text-2xl font-bold text-zh-pink">{propertyBreakdown.sell}</div>
                    <div className="text-sm text-zh-gray-dark">For Sale</div>
                  </div>
                  <div className="text-center p-4 bg-zh-blue/10 rounded-lg">
                    <div className="text-2xl font-bold text-zh-blue">{propertyBreakdown.rent}</div>
                    <div className="text-sm text-zh-gray-dark">For Rent</div>
                  </div>
                  <div className="text-center p-4 bg-zh-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-zh-success">{propertyBreakdown.available}</div>
                    <div className="text-sm text-zh-gray-dark">Available</div>
                  </div>
                  <div className="text-center p-4 bg-zh-gray/10 rounded-lg">
                    <div className="text-2xl font-bold text-zh-gray-dark">{propertyBreakdown.booked}</div>
                    <div className="text-sm text-zh-gray-dark">Booked</div>
                  </div>
                </div>
              </div>

              {/* User Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-zh-pink/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-zh-pink" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-zh-navy mb-1">
                    {(stats?.totalSellers || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-zh-gray-dark">Sellers</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-zh-blue/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-zh-blue" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-zh-navy mb-1">
                    {(stats?.totalBuyers || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-zh-gray-dark">Buyers</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-zh-success/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-zh-success" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-zh-navy mb-1">
                    {(stats?.totalVendors || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-zh-gray-dark">Vendors</div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-zh-navy">Pending Approvals</h2>
                  <span className="px-3 py-1 bg-zh-pink/20 text-zh-pink rounded-full text-sm font-semibold">
                    {pendingProperties.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingProperties.slice(0, 5).map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 border border-zh-gray-light rounded-lg hover:border-zh-pink transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-20 h-20 bg-zh-gray-light rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-zh-navy">{property.title}</h3>
                          <p className="text-sm text-zh-gray-dark">{property.location?.address}</p>
                          <p className="text-zh-pink font-semibold">
                            ₹{property.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveProperty(property._id || property.id)}
                          className="p-2 bg-zh-success/20 text-zh-success rounded-lg hover:bg-zh-success/30 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectProperty(property._id || property.id)}
                          className="p-2 bg-zh-danger/20 text-zh-danger rounded-lg hover:bg-zh-danger/30 transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyModal(true);
                          }}
                          className="p-2 bg-zh-soft text-zh-navy rounded-lg hover:bg-zh-gray-light transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingProperties.length === 0 && (
                    <p className="text-center text-zh-gray py-8">No pending approvals</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={propertyFilter.type}
                    onChange={(e) => setPropertyFilter({ ...propertyFilter, type: e.target.value })}
                    className="px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="sell">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>

                  <select
                    value={propertyFilter.status}
                    onChange={(e) => setPropertyFilter({ ...propertyFilter, status: e.target.value })}
                    className="px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>

                  <select
                    value={propertyFilter.approval}
                    onChange={(e) => setPropertyFilter({ ...propertyFilter, approval: e.target.value })}
                    className="px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                  >
                    <option value="all">All Approval</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-zh-gray-dark">
                Showing {filteredProperties.length} of {properties.length} properties
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zh-soft">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((property) => (
                        <tr key={property.id} className="border-b border-zh-gray-light hover:bg-zh-soft">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-zh-gray-light rounded-lg flex-shrink-0" />
                              <div>
                                <div className="font-medium text-zh-navy">{property.title}</div>
                                <div className="text-sm text-zh-gray-dark">
                                  {property.bedrooms}BHK • {property.area_sqm} sqm
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-zh-gray-dark">{property.location?.address}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-zh-navy">
                              ₹{property.price?.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {property.isApproved ? (
                              <span className="px-3 py-1 bg-zh-success/20 text-zh-success rounded-full text-xs font-semibold">
                                Approved
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-zh-pink/20 text-zh-pink rounded-full text-xs font-semibold">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {!property.isApproved && (
                                <>
                                  <button
                                    onClick={() => handleApproveProperty(property._id || property.id)}
                                    className="p-2 bg-zh-success/20 text-zh-success rounded-lg hover:bg-zh-success/30"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectProperty(property._id || property.id)}
                                    className="p-2 bg-zh-danger/20 text-zh-danger rounded-lg hover:bg-zh-danger/30"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setShowPropertyModal(true);
                                }}
                                className="p-2 bg-zh-soft text-zh-navy rounded-lg hover:bg-zh-gray-light"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this property?")) {
                                    handleDeleteProperty(property._id || property.id);
                                  }
                                }}
                                className="p-2 bg-zh-danger/20 text-zh-danger rounded-lg hover:bg-zh-danger/30"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={userFilter.role}
                    onChange={(e) => setUserFilter({ ...userFilter, role: e.target.value })}
                    className="px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="buyer">Buyers</option>
                    <option value="seller">Sellers</option>
                    <option value="broker">Brokers</option>
                    <option value="admin">Admins</option>
                  </select>

                  <select
                    value={userFilter.status}
                    onChange={(e) => setUserFilter({ ...userFilter, status: e.target.value })}
                    className="px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-zh-gray-dark">
                Showing {filteredUsers.length} of {users.length} users
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zh-soft">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-zh-gray-light hover:bg-zh-soft">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold">
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                  </span>
                                </div>
                                <span className="font-medium text-zh-navy">{user.name || "N/A"}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-zh-gray-dark">{user.email || "N/A"}</td>
                            <td className="py-3 px-4 text-zh-gray-dark">{user.phone || "N/A"}</td>
                            <td className="py-3 px-4">
                              <span className="px-3 py-1 bg-zh-blue/20 text-zh-blue rounded-full text-xs font-semibold capitalize">
                                {user.role || "buyer"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {user.isActive !== false ? (
                                <span className="px-3 py-1 bg-zh-success/20 text-zh-success rounded-full text-xs font-semibold">
                                  Active
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-zh-gray/20 text-zh-gray-dark rounded-full text-xs font-semibold">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserModal(true);
                                  }}
                                  className="p-2 bg-zh-soft text-zh-navy rounded-lg hover:bg-zh-gray-light"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleUserStatus(user._id || user.id, user.isActive !== false)
                                  }
                                  className={`p-2 rounded-lg ${user.isActive !== false
                                      ? "bg-zh-gray/20 text-zh-gray-dark hover:bg-zh-gray/30"
                                      : "bg-zh-success/20 text-zh-success hover:bg-zh-success/30"
                                    }`}
                                  title={user.isActive !== false ? "Deactivate" : "Activate"}
                                >
                                  {user.isActive !== false ? (
                                    <XCircle className="w-4 h-4" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user._id || user.id)}
                                  className="p-2 bg-zh-danger/20 text-zh-danger rounded-lg hover:bg-zh-danger/30"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-zh-gray">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zh-gray" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={orderFilter.status}
                    onChange={(e) => setOrderFilter({ ...orderFilter, status: e.target.value })}
                    className="px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-zh-gray-dark">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-zh-gray-light overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zh-soft">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-zh-navy">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b border-zh-gray-light hover:bg-zh-soft">
                            <td className="py-3 px-4 font-medium text-zh-navy">#{order.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-zh-navy">
                                {order.property?.title || "N/A"}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-zh-gray-dark">
                              {order.customer?.name || order.user?.name || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-zh-navy">
                                ₹{order.amount?.toLocaleString() || "0"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={order.status || "pending"}
                                onChange={(e) => handleUpdateOrderStatus(order._id || order.id, e.target.value)}
                                className="px-3 py-1 border border-zh-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zh-pink"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderModal(true);
                                  }}
                                  className="p-2 bg-zh-soft text-zh-navy rounded-lg hover:bg-zh-gray-light"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this order?")) {
                                      // Handle delete order
                                      toast.error("Delete order functionality needs to be implemented");
                                    }
                                  }}
                                  className="p-2 bg-zh-danger/20 text-zh-danger rounded-lg hover:bg-zh-danger/30"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-zh-gray">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false);
          setSelectedProperty(null);
        }}
        onApprove={handleApproveProperty}
        onReject={handleRejectProperty}
        onDelete={handleDeleteProperty}
      />

      <UserDetailModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        onActivate={(id) => {
          handleToggleUserStatus(id, false);
        }}
        onDeactivate={(id) => {
          handleToggleUserStatus(id, true);
        }}
        onDelete={handleDeleteUser}
      />

      <OrderDetailModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </AdminProtect>
  );
}

