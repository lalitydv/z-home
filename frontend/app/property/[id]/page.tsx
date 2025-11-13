"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Modal } from "@/components/modal";
import { mockProperties } from "@/lib/mock-data";
import { useState, useEffect, use } from "react";
import { propertyAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Verified,
  Star,
  Phone,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Wifi,
  Car,
  Shield,
  Building,
  Dumbbell,
  Waves,
} from "lucide-react";
import Link from "next/link";

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  security: Shield,
  elevator: Building,
  gym: Dumbbell,
  "swimming-pool": Waves,
};

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const response = await propertyAPI.getById(id);
        if (response.data?.data?.property) {
          setProperty(response.data.data.property);
        } else if (response.data?.property) {
          setProperty(response.data.property);
        } else {
          // Fallback to mock data if API fails
          const mockProperty = mockProperties.find((p) => p.id === id);
          if (mockProperty) {
            setProperty(mockProperty);
          }
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
        // Fallback to mock data
        const mockProperty = mockProperties.find((p) => p.id === id);
        if (mockProperty) {
          setProperty(mockProperty);
        } else {
          toast.error("Property not found");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zh-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zh-gray-dark">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-zh-gray-dark mb-4">Property not found</p>
          <Link
            href="/search"
            className="text-zh-pink hover:underline"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (!property.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* Image Gallery */}
        <div className="relative h-[400px] md:h-[500px] bg-zh-gray-light">
          {property.images && property.images.length > 0 && property.images[currentImageIndex] && (
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowImageModal(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          )}

          {/* Navigation */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images && property.images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                  }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                toast.success(isLiked ? "Removed from saved" : "Saved to favorites");
              }}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-zh-pink text-zh-pink" : "text-zh-navy"}`}
              />
            </button>
            <button
              onClick={() => {
                navigator.share?.({
                  title: property.title,
                  text: property.description,
                  url: window.location.href,
                }) || toast.success("Link copied to clipboard");
              }}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5 text-zh-navy" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Price */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-zh-navy font-poppins">
                    {property.title}
                  </h1>
                </div>
                <div className="flex items-center space-x-2 text-zh-gray-dark mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {property.location?.address || property.address || property.city || "Location not specified"}
                    {property.location?.city && property.location.city !== property.location?.address && `, ${property.location.city}`}
                    {!property.location?.city && property.city && `, ${property.city}`}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  {(property.isApproved || property.verified) && (
                    <div className="flex items-center space-x-1 bg-zh-blue/20 px-3 py-1 rounded-full">
                      <Verified className="w-4 h-4 text-zh-blue" />
                      <span className="text-sm font-semibold text-zh-blue">Verified</span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-zh-pink">
                    ₹{(property.price || 0).toLocaleString()}
                    <span className="text-lg text-zh-gray">
                      {property.status === "rented" || property.category === "rent" ? "/month" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                <h2 className="text-xl font-semibold text-zh-navy mb-4">Property Details</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-zh-soft rounded-lg">
                    <Bed className="w-6 h-6 text-zh-pink mx-auto mb-2" />
                    <div className="font-semibold text-zh-navy">{property.bedrooms || "N/A"}</div>
                    <div className="text-sm text-zh-gray">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-zh-soft rounded-lg">
                    <Bath className="w-6 h-6 text-zh-blue mx-auto mb-2" />
                    <div className="font-semibold text-zh-navy">{property.bathrooms || "N/A"}</div>
                    <div className="text-sm text-zh-gray">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-zh-soft rounded-lg">
                    <Square className="w-6 h-6 text-zh-pink mx-auto mb-2" />
                    <div className="font-semibold text-zh-navy">{property.area || property.area_sqm || "N/A"}</div>
                    <div className="text-sm text-zh-gray">Sq. Meters</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zh-gray-light">
                  {property.furnished !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-zh-gray-dark">Furnishing:</span>
                      <span className="font-semibold text-zh-navy capitalize">
                        {typeof property.furnished === "string" 
                          ? property.furnished.replace("-", " ") 
                          : property.furnished ? "Furnished" : "Unfurnished"}
                      </span>
                    </div>
                  )}
                  {property.status && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-zh-gray-dark">Status:</span>
                      <span className="font-semibold text-zh-navy capitalize">
                        {property.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <h2 className="text-xl font-semibold text-zh-navy mb-4">Description</h2>
                  <p className="text-zh-gray-dark leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                  <h2 className="text-xl font-semibold text-zh-navy mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity: string) => {
                      const Icon = amenityIcons[amenity] || Building;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2 p-3 bg-zh-soft rounded-lg"
                        >
                          <Icon className="w-5 h-5 text-zh-pink" />
                          <span className="text-zh-navy capitalize">
                            {amenity.replace("-", " ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location Map */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                <h2 className="text-xl font-semibold text-zh-navy mb-4">Location</h2>
                <div className="bg-zh-gray-light rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-zh-gray mx-auto mb-2" />
                    <p className="text-zh-gray-dark">Map view coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Owner Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light sticky top-24 space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {(property.postedBy?.name || property.ownerName || "U")[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zh-navy">
                      {property.postedBy?.name || property.ownerName || "Property Owner"}
                    </h3>
                    {property.postedBy?.email && (
                      <p className="text-sm text-zh-gray-dark">{property.postedBy.email}</p>
                    )}
                    {property.ownerRating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-zh-pink text-zh-pink" />
                        <span className="text-sm text-zh-gray-dark">
                          {property.ownerRating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full px-4 py-3 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Message Owner</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const phone = property.postedBy?.phone || property.ownerPhone || "+91 9876543210";
                        window.location.href = `tel:${phone}`;
                      }}
                      className="px-3 py-2 border border-zh-blue text-zh-blue font-semibold rounded-lg hover:bg-zh-blue/10 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-3 py-2 border border-zh-pink text-zh-pink font-semibold rounded-lg hover:bg-zh-pink/10 transition-colors flex items-center justify-center space-x-1 text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Visit</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      toast.success(isLiked ? "Removed from saved" : "Saved to favorites");
                    }}
                    className="w-full px-4 py-2 border border-zh-gray-light text-zh-navy font-semibold rounded-lg hover:bg-zh-soft transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-zh-pink text-zh-pink" : ""}`} />
                    <span>{isLiked ? "Saved" : "Save Property"}</span>
                  </button>
                </div>
              </div>

              {/* Similar Properties */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zh-gray-light">
                <h3 className="font-semibold text-zh-navy mb-4">Similar Properties</h3>
                <div className="space-y-4">
                  {mockProperties
                    .filter((p) => p.id !== id && p.bedrooms === property.bedrooms)
                    .slice(0, 2)
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/property/${p.id}`}
                        className="block p-3 border border-zh-gray-light rounded-lg hover:border-zh-pink transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-20 h-20 bg-zh-gray-light rounded-lg flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zh-navy text-sm line-clamp-1">
                              {p.title}
                            </p>
                            <p className="text-zh-pink font-bold text-sm">
                              ₹{p.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Owner"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zh-navy mb-2">
              Your Message
            </label>
            <textarea
              rows={4}
              placeholder="Hi, I'm interested in this property..."
              className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
            />
          </div>
          <button
            onClick={() => {
              toast.success("Message sent!");
              setShowContactModal(false);
            }}
            className="w-full px-4 py-3 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90"
          >
            Send Message
          </button>
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Schedule a Visit"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zh-navy mb-2">
              Select Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zh-navy mb-2">
              Select Time
            </label>
            <select className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink">
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
              <option>4:00 PM</option>
            </select>
          </div>
          <button
            onClick={() => {
              toast.success("Visit scheduled!");
              setShowBookingModal(false);
            }}
            className="w-full px-4 py-3 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90"
          >
            Confirm Booking
          </button>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="xl"
        showCloseButton={true}
      >
        <div className="relative h-[600px]">
          {property.images && property.images[currentImageIndex] && (
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          )}
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

