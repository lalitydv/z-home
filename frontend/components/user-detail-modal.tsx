"use client";

import { X, Mail, Phone, User, CheckCircle, XCircle } from "lucide-react";

interface UserDetailModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onActivate,
  onDeactivate,
  onDelete,
}: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const isActive = user.status === "active" || user.isActive !== false;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-zh-gray-light p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-zh-navy pr-2">User Details</h2>
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
          {/* Profile */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-zh-navy">{user.name || "Unknown User"}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-3 py-1 bg-zh-blue/20 text-zh-blue rounded-full text-xs font-semibold capitalize">
                  {user.role || "buyer"}
                </span>
                {isActive ? (
                  <span className="px-3 py-1 bg-zh-success/20 text-zh-success rounded-full text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-zh-gray/20 text-zh-gray-dark rounded-full text-xs font-semibold flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>Inactive</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-zh-soft rounded-lg">
              <Mail className="w-5 h-5 text-zh-gray" />
              <div>
                <div className="text-sm text-zh-gray-dark">Email</div>
                <div className="font-semibold text-zh-navy">{user.email || "N/A"}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-zh-soft rounded-lg">
              <Phone className="w-5 h-5 text-zh-gray" />
              <div>
                <div className="text-sm text-zh-gray-dark">Phone</div>
                <div className="font-semibold text-zh-navy">{user.phone || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-zh-navy mb-2">Account Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zh-gray-dark">User ID:</span>
                  <span className="font-semibold text-zh-navy">{user._id || user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zh-gray-dark">Verified:</span>
                  <span className="font-semibold text-zh-navy">
                    {user.isVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zh-gray-dark">Status:</span>
                  <span className="font-semibold text-zh-navy capitalize">
                    {user.status || "active"}
                  </span>
                </div>
                {user.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-zh-gray-dark">Joined:</span>
                    <span className="font-semibold text-zh-navy">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {user.bio && (
              <div>
                <h4 className="font-semibold text-zh-navy mb-2">Bio</h4>
                <p className="text-zh-gray-dark">{user.bio}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-zh-gray-light">
            {isActive ? (
              onDeactivate && (
                <button
                  onClick={() => {
                    onDeactivate(user._id || user.id);
                    onClose();
                  }}
                    className="px-4 py-2 bg-zh-gray text-white rounded-lg hover:bg-zh-gray-dark flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Deactivate</span>
                  </button>
                )
              ) : (
                onActivate && (
                  <button
                    onClick={() => {
                      onActivate(user._id || user.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-zh-success text-white rounded-lg hover:bg-zh-success/90 flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Activate</span>
                  </button>
                )
              )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this user?")) {
                    onDelete(user._id || user.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-zh-danger text-white rounded-lg hover:bg-zh-danger/90 w-full sm:w-auto"
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

