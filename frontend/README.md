# Z-Homes Frontend

A beautiful, modern property listing platform built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

### 🏠 Pages Implemented

- **Home Page** (`/`) - Hero section, featured categories, popular localities, featured properties, testimonials
- **Search Page** (`/search`) - Advanced filtering, list/map view toggle, property search
- **Property Detail** (`/property/[id]`) - Full property details, image gallery, contact owner, schedule visit
- **List Property** (`/list-property`) - Multi-step form for property owners to list properties
- **User Dashboard** (`/dashboard`) - Saved properties, bookings, recent searches, profile
- **Owner Dashboard** (`/owner/dashboard`) - Manage listings, view leads, analytics
- **Chat** (`/chat`) - Real-time messaging interface
- **Bookings** (`/bookings`) - View and manage property visit bookings
- **Authentication** (`/auth/login`, `/auth/signup`) - Email/OTP login, signup with role selection
- **Admin Panel** (`/admin`) - Property moderation, user management, analytics

### 🎨 Design System

- **Theme Colors:**
  - Baby Pink: `#FFC0CB` (primary accent)
  - Light Blue: `#ADD8E6` (secondary accent)
  - Deep Navy: `#0B132B` (text)
  - Soft Gray: `#F7F9FC` (background)

- **Typography:**
  - Headings: Poppins (700, 600)
  - Body: Inter (400)

### 🧩 Components

- `Header` - Navigation with search, mobile menu
- `Footer` - Links, contact info, social media
- `PropertyCard` - Property listing card with image, price, details
- `SearchBar` - City selector and search input
- `FilterPanel` - Advanced filters (price, BHK, amenities, etc.)
- `Modal` - Reusable modal component

### 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 360px (mobile), 768px (tablet), 1024px (desktop)
- Touch-friendly interactions
- Mobile-optimized navigation

### 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand, React Query
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

### 📝 Notes

- All data is currently mocked (no API integration)
- Images use placeholder services (Unsplash, Pravatar)
- Forms submit to console (ready for API integration)
- All interactions and modals are fully functional

### 🎯 Next Steps

1. Connect to backend API endpoints
2. Add real-time chat with WebSocket
3. Implement map view with Google Maps/Mapbox
4. Add image upload functionality
5. Implement authentication with JWT
6. Add payment integration
7. Set up PWA for mobile app experience

### 📦 Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── search/            # Search page
│   ├── property/[id]/     # Property detail
│   ├── list-property/     # Listing form
│   ├── dashboard/         # User dashboard
│   ├── owner/dashboard/   # Owner dashboard
│   ├── chat/              # Chat page
│   ├── bookings/          # Bookings page
│   ├── auth/              # Auth pages
│   └── admin/             # Admin panel
├── components/            # Reusable components
├── lib/                   # Utilities and mock data
└── public/                # Static assets
```

---

Built with ❤️ by Zombies Coder Soft Solution
