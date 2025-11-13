/**
 * Role-based access control middleware
 * Checks if user has required role(s) to access the route
 */

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions. You do not have access to this resource.',
      });
    }

    next();
  };
};

// Specific role checkers
export const isSellerOrBroker = authorize('seller', 'broker');
export const isBroker = authorize('broker');
export const isAdmin = authorize('admin', 'superadmin');
export const isSellerBrokerOrAdmin = authorize('seller', 'broker', 'admin', 'superadmin');
export const isSuperAdmin = authorize('superadmin');
export const isBuyer = authorize('buyer');

// Check if user owns the resource
export const isOwner = (Model, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParam];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
      }

      // Check if user is owner or admin/superadmin
      const ownerField = resource.postedBy ? 'postedBy' : 'user';
      if (resource[ownerField].toString() !== req.userId.toString() && 
          !['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to perform this action.',
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error checking ownership',
      });
    }
  };
};

export default authorize;

