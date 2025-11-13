"use client";

import { X, MapPin, Home, Bed, Bath, Square, CheckCircle, XCircle } from "lucide-react";

interface PropertyDetailModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PropertyDetailModal({
  property,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: PropertyDetailModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-zh-gray-light p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-zh-navy pr-2">{property.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zh-soft rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Images */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {property.images.slice(0, 4).map((img: string, idx: number) => (
                <div key={idx} className="relative h-40 sm:h-48 bg-zh-gray-light rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`${property.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-zh-gray" />
              <div>
                <div className="text-sm text-zh-gray-dark">Location</div>
                <div className="font-semibold text-zh-navy">
                  {property.location?.address || property.city || "N/A"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-zh-gray" />
              <div>
                <div className="text-sm text-zh-gray-dark">Type</div>
                <div className="font-semibold text-zh-navy capitalize">
                  {property.propertyType || "N/A"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bed className="w-5 h-5 text-zh-gray" />
              <div>
                <div className="text-sm text-zh-gray-dark">Bedrooms</div>
                <div className="font-semibold text-zh-navy">{property.bedrooms || "N/A"}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bath className="w-5 h-5 text-zh-gray" />
              <div>
                <div className="text-sm text-zh-gray-dark">Bathrooms</div>
                <div className="font-semibold text-zh-navy">{property.bathrooms || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Price and Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zh-soft rounded-lg gap-3">
            <div>
              <div className="text-sm text-zh-gray-dark">Price</div>
              <div className="text-xl sm:text-2xl font-bold text-zh-pink">
                ₹{property.price?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-sm text-zh-gray-dark">Status</div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {property.isApproved ? (
                  <span className="px-3 py-1 bg-zh-success/20 text-zh-success rounded-full text-sm font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Approved</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-zh-pink/20 text-zh-pink rounded-full text-sm font-semibold flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>Pending</span>
                  </span>
                )}
                <span className="px-3 py-1 bg-zh-blue/20 text-zh-blue rounded-full text-sm font-semibold capitalize">
                  {property.status || "available"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h3 className="font-semibold text-zh-navy mb-2">Description</h3>
              <p className="text-zh-gray-dark">{property.description}</p>
            </div>
          )}

          {/* Posted By */}
          {property.postedBy && (
            <div className="p-4 bg-zh-soft rounded-lg">
              <h3 className="font-semibold text-zh-navy mb-2">Posted By</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {property.postedBy?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-zh-navy">
                    {property.postedBy?.name || "Unknown"}
                  </div>
                  <div className="text-sm text-zh-gray-dark">
                    {property.postedBy?.email || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-zh-gray-light">
            {!property.isApproved && (
              <>
                {onApprove && (
                  <button
                    onClick={() => {
                      onApprove(property._id || property.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-zh-success text-white rounded-lg hover:bg-zh-success/90 flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => {
                      onReject(property._id || property.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-zh-danger text-white rounded-lg hover:bg-zh-danger/90 flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                )}
              </>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this property?")) {
                    onDelete(property._id || property.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-zh-gray text-white rounded-lg hover:bg-zh-gray-dark w-full sm:w-auto"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

