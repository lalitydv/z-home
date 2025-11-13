import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data?.data?.accessToken || response.data?.accessToken;
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to appropriate login page
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const isAdminPage = currentPath.startsWith("/admin");
          
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
          
          // Redirect to admin login for admin pages, otherwise regular login
          if (isAdminPage) {
            window.location.href = "/admin/login";
          } else {
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(refreshError);
      }
      
      // No refresh token available, redirect to login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAdminPage = currentPath.startsWith("/admin");
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        
        if (isAdminPage) {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "buyer" | "owner" | "broker";
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  loginWithOTP: (data: { phone: string; otp: string }) =>
    api.post("/auth/login-otp", data),

  sendOTP: (data: { phone: string }) => api.post("/auth/send-otp", data),

  refreshToken: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),

  logout: () => api.post("/auth/logout"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/me"),

  updateProfile: (data: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
  }) => api.put("/users/me", data),

  deleteAccount: () => api.delete("/users/me"),
};

// Property API
export const propertyAPI = {
  getAll: (params?: {
    city?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number;
    furnished?: string;
    amenities?: string[];
    page?: number;
    limit?: number;
  }) => api.get("/properties", { params }),

  getById: (id: string) => api.get(`/properties/${id}`),

  create: (data: FormData) =>
    api.post("/properties", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  update: (id: string, data: FormData) =>
    api.put(`/properties/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  delete: (id: string) => api.delete(`/properties/${id}`),

  search: (
    query: string,
    filters?: Record<string, string | number | boolean | undefined>
  ) =>
    api.get("/properties/search", {
      params: { q: query, ...filters },
    }),
};

// Booking API
export const bookingAPI = {
  getAll: () => api.get("/bookings"),

  getById: (id: string) => api.get(`/bookings/${id}`),

  create: (data: {
    propertyId: string;
    date: string;
    time: string;
    message?: string;
  }) => api.post("/bookings", data),

  update: (
    id: string,
    data: { status?: string; date?: string; time?: string }
  ) => api.put(`/bookings/${id}`, data),

  cancel: (id: string) => api.delete(`/bookings/${id}`),
};

// Message API
export const messageAPI = {
  getThreads: () => api.get("/messages/threads"),

  getThread: (threadId: string) => api.get(`/messages/threads/${threadId}`),

  sendMessage: (data: {
    threadId: string;
    text: string;
    type?: "text" | "image";
  }) => api.post("/messages", data),

  markAsRead: (threadId: string) =>
    api.put(`/messages/threads/${threadId}/read`),
};

// Review API
export const reviewAPI = {
  getByProperty: (propertyId: string) =>
    api.get(`/reviews/property/${propertyId}`),

  create: (data: { propertyId: string; rating: number; comment: string }) =>
    api.post("/reviews", data),

  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.put(`/reviews/${id}`, data),

  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// Upload API
export const uploadAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (fileKey: string) => api.delete(`/upload/${fileKey}`),

  getSignedUrl: (fileKey: string) => api.get(`/upload/${fileKey}`),
};

// Payment API
export const paymentAPI = {
  createRazorpayOrder: (data: {
    amount: number;
    currency?: string;
    receipt?: string;
  }) => api.post("/payments/razorpay/create-order", data),

  verifyRazorpayPayment: (data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) => api.post("/payments/razorpay/verify", data),

  createStripePayment: (data: { amount: number; currency?: string }) =>
    api.post("/payments/stripe/create-payment", data),
};

// Admin API
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => api.get("/admin/dashboard/stats"),

  // Product/Property Management
  getAllProperties: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get("/admin/properties", { params }),

  getPropertyById: (id: string) => api.get(`/admin/properties/${id}`),

  approveProperty: (id: string) => api.put(`/admin/properties/${id}/approve`),

  rejectProperty: (id: string, reason?: string) =>
    api.put(`/admin/properties/${id}/reject`, { reason }),

  deleteProperty: (id: string) => api.delete(`/admin/properties/${id}`),

  updateProperty: (id: string, data: FormData | Record<string, unknown>) =>
    api.put(`/admin/properties/${id}`, data),

  // User Management
  getAllUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    status?: string;
  }) => api.get("/admin/users", { params }),

  getUserById: (id: string) => api.get(`/admin/users/${id}`),

  updateUser: (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      role?: string;
      isActive?: boolean;
      isVerified?: boolean;
    }
  ) => api.put(`/admin/users/${id}`, data),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  activateUser: (id: string) => api.put(`/admin/users/${id}/activate`),

  deactivateUser: (id: string) => api.put(`/admin/users/${id}/deactivate`),

  // Order Management
  getAllOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get("/admin/orders", { params }),

  getOrderById: (id: string) => api.get(`/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }),

  deleteOrder: (id: string) => api.delete(`/admin/orders/${id}`),
};

export default api;
