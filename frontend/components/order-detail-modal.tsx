"use client";

import { X, ShoppingCart, User, Home, Calendar } from "lucide-react";

interface OrderDetailModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const statusColors: Record<string, string> = {
    pending: "bg-zh-pink/20 text-zh-pink",
    approved: "bg-zh-success/20 text-zh-success",
    rejected: "bg-zh-danger/20 text-zh-danger",
    completed: "bg-zh-blue/20 text-zh-blue",
    cancelled: "bg-zh-gray/20 text-zh-gray-dark",
  };

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
          <h2 className="text-lg sm:text-2xl font-bold text-zh-navy pr-2">Order Details</h2>
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
          {/* Order ID and Status */}
          <div className="flex items-center justify-between p-4 bg-zh-soft rounded-lg">
            <div>
              <div className="text-sm text-zh-gray-dark">Order ID</div>
              <div className="text-xl font-bold text-zh-navy">#{order._id || order.id}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-zh-gray-dark">Status</div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                  statusColors[order.status] || statusColors.pending
                }`}
              >
                {order.status || "pending"}
              </span>
            </div>
          </div>

          {/* Property Info */}
          {order.property && (
            <div className="p-4 bg-zh-soft rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Home className="w-5 h-5 text-zh-gray" />
                <h3 className="font-semibold text-zh-navy">Property</h3>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-zh-navy">
                  {order.property.title || "N/A"}
                </div>
                <div className="text-sm text-zh-gray-dark">
                  {order.property.location || order.property.address || "N/A"}
                </div>
                <div className="text-zh-pink font-semibold">
                  ₹{order.property.price?.toLocaleString() || order.amount?.toLocaleString() || "0"}
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          {order.buyer && (
            <div className="p-4 bg-zh-soft rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-5 h-5 text-zh-gray" />
                <h3 className="font-semibold text-zh-navy">Customer</h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {order.buyer.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-zh-navy">
                    {order.buyer.name || "Unknown"}
                  </div>
                  <div className="text-sm text-zh-gray-dark">{order.buyer.email || "N/A"}</div>
                  {order.buyer.phone && (
                    <div className="text-sm text-zh-gray-dark">{order.buyer.phone}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-zh-navy">Order Information</h3>
            <div className="space-y-2">
              {order.createdAt && (
                <div className="flex justify-between">
                  <span className="text-zh-gray-dark flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Order Date:</span>
                  </span>
                  <span className="font-semibold text-zh-navy">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {order.amount && (
                <div className="flex justify-between">
                  <span className="text-zh-gray-dark">Amount:</span>
                  <span className="font-semibold text-zh-pink">
                    ₹{order.amount.toLocaleString()}
                  </span>
                </div>
              )}
              {order.message && (
                <div>
                  <span className="text-zh-gray-dark">Message:</span>
                  <p className="text-zh-navy mt-1">{order.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Update */}
          {onUpdateStatus && (
            <div className="p-4 bg-zh-soft rounded-lg">
              <label className="block text-sm font-semibold text-zh-navy mb-2">
                Update Status
              </label>
              <select
                value={order.status || "pending"}
                onChange={(e) => {
                  onUpdateStatus(order._id || order.id, e.target.value);
                  onClose();
                }}
                className="w-full px-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-zh-gray-light">
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this order?")) {
                    onDelete(order._id || order.id);
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

