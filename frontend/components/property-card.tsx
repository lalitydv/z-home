"use client";

import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Square, Verified } from "lucide-react";
import { useState } from "react";
import { Property } from "@/lib/mock-data";
import toast from "react-hot-toast";

interface PropertyCardProps {
  property: Property;
  onLike?: (id: string) => void;
  isLiked?: boolean;
}

export function PropertyCard({ property, onLike, isLiked = false }: PropertyCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) {
      onLike(property.id);
    }
    toast.success(liked ? "Removed from saved" : "Saved to favorites");
  };

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-zh-gray-light hover-lift animate-fadeIn">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-zh-gray-light">
          {!imageError && property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zh-pink to-zh-blue flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Z</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            {property.verified && (
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                <Verified className="w-3 h-3 text-zh-blue" />
                <span className="text-xs font-semibold text-zh-navy">Verified</span>
              </div>
            )}
            <div className="bg-zh-pink/90 backdrop-blur-sm px-2 py-1 rounded-md">
              <span className="text-xs font-semibold text-zh-navy">
                {property.category === "rent" ? "For Rent" : "For Sale"}
              </span>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 ${liked ? "fill-zh-pink text-zh-pink" : "text-zh-navy"}`}
            />
          </button>

          {/* Image Count */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
              <span className="text-white text-xs">
                {property.images.length} photos
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-zh-navy line-clamp-1 flex-1">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center text-sm text-zh-gray-dark mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{property.location.address}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center space-x-4 text-sm text-zh-gray-dark mb-3">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} BHK</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="w-4 h-4" />
              <span>{property.area_sqm} sqm</span>
            </div>
          </div>

          {/* Price & Owner */}
          <div className="flex items-center justify-between pt-3 border-t border-zh-gray-light">
            <div>
              <div className="text-2xl font-bold text-zh-pink">
                ₹{property.price.toLocaleString()}
              </div>
              <div className="text-xs text-zh-gray">
                {property.category === "rent" ? "/month" : ""}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-zh-gray-dark font-medium">
                  {property.ownerName}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-zh-gray">⭐ {property.ownerRating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

