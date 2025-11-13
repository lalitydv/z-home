// Mock data for frontend development

export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: "rent" | "sale";
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  verified: boolean;
  amenities: string[];
  description: string;
  furnished: "furnished" | "semi-furnished" | "unfurnished";
  availableFrom: string;
  createdAt: string;
  views: number;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "buyer" | "owner" | "broker" | "admin";
  verified: boolean;
}

export const mockProperties: Property[] = [
  {
    id: "prop_1",
    title: "Spacious 2BHK Flat near MR-9 Indore",
    price: 8500,
    currency: "INR",
    category: "rent",
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 75,
    location: {
      lat: 22.7196,
      lng: 75.8577,
      address: "Palasia, Indore",
      city: "Indore",
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    ownerId: "user_1",
    ownerName: "Rajesh Kumar",
    ownerAvatar: "https://i.pravatar.cc/150?img=12",
    ownerRating: 4.5,
    verified: true,
    amenities: ["wifi", "parking", "laundry", "security", "elevator"],
    description: "Beautiful 2BHK flat in prime location with all modern amenities. Close to schools, hospitals, and shopping malls.",
    furnished: "semi-furnished",
    availableFrom: "2025-01-01",
    createdAt: "2025-01-10T07:00:00Z",
    views: 234,
    likes: 12,
  },
  {
    id: "prop_2",
    title: "Modern 3BHK Apartment with Balcony",
    price: 15000,
    currency: "INR",
    category: "rent",
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 120,
    location: {
      lat: 22.7296,
      lng: 75.8677,
      address: "Vijay Nagar, Indore",
      city: "Indore",
    },
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    ownerId: "user_2",
    ownerName: "Priya Sharma",
    ownerAvatar: "https://i.pravatar.cc/150?img=47",
    ownerRating: 4.8,
    verified: true,
    amenities: ["wifi", "parking", "gym", "swimming-pool", "security"],
    description: "Luxurious 3BHK apartment with modern interiors and stunning city views.",
    furnished: "furnished",
    availableFrom: "2025-02-01",
    createdAt: "2025-01-08T07:00:00Z",
    views: 456,
    likes: 28,
  },
  {
    id: "prop_3",
    title: "Cozy 1BHK PG for Students",
    price: 4000,
    currency: "INR",
    category: "rent",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 30,
    location: {
      lat: 22.7096,
      lng: 75.8477,
      address: "New Palasia, Indore",
      city: "Indore",
    },
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    ],
    ownerId: "user_3",
    ownerName: "Amit Patel",
    ownerAvatar: "https://i.pravatar.cc/150?img=33",
    ownerRating: 4.2,
    verified: false,
    amenities: ["wifi", "laundry", "meals"],
    description: "Clean and safe PG accommodation for students and working professionals.",
    furnished: "furnished",
    availableFrom: "2025-01-15",
    createdAt: "2025-01-12T07:00:00Z",
    views: 123,
    likes: 5,
  },
  {
    id: "prop_4",
    title: "Premium 4BHK Villa with Garden",
    price: 35000,
    currency: "INR",
    category: "rent",
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 200,
    location: {
      lat: 22.7396,
      lng: 75.8777,
      address: "Scheme 54, Indore",
      city: "Indore",
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    ownerId: "user_4",
    ownerName: "Sunita Verma",
    ownerAvatar: "https://i.pravatar.cc/150?img=51",
    ownerRating: 4.9,
    verified: true,
    amenities: ["wifi", "parking", "garden", "security", "maid-room"],
    description: "Spacious villa with private garden, perfect for families.",
    furnished: "furnished",
    availableFrom: "2025-03-01",
    createdAt: "2025-01-05T07:00:00Z",
    views: 789,
    likes: 45,
  },
];

export const mockCities = [
  "Indore",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
];

export const mockLocalities = [
  { name: "Palasia", city: "Indore", properties: 234 },
  { name: "Vijay Nagar", city: "Indore", properties: 189 },
  { name: "New Palasia", city: "Indore", properties: 156 },
  { name: "Scheme 54", city: "Indore", properties: 98 },
];

export const mockUser: User = {
  id: "user_current",
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  avatar: "https://i.pravatar.cc/150?img=1",
  role: "buyer",
  verified: true,
};

export const mockOwner: User = {
  id: "user_owner",
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+91 9876543211",
  avatar: "https://i.pravatar.cc/150?img=12",
  role: "owner",
  verified: true,
};

