import Property from '../models/propertyModel.js';
import { logger } from '../utils/logger.js';

export const addProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      propertyType,
      location,
      city,
      state,
      pincode,
      bedrooms,
      bathrooms,
      area,
      furnished,
      images,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      price,
      propertyType,
      location,
      city,
      state,
      pincode,
      bedrooms,
      bathrooms,
      area,
      furnished: furnished || false,
      images: images || [],
      postedBy: req.userId,
      status: 'available',
      isApproved: false, // Requires admin approval
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      amenities: req.body.amenities || [],
    });

    const populatedProperty = await Property.findById(property._id)
      .populate('postedBy', 'name email phone profileImage');

    res.status(201).json({
      success: true,
      data: { property: populatedProperty },
    });
  } catch (error) {
    logger.error('Add property error:', error);
    next(error);
  }
};

export const getAllProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only show approved properties to public, admin can see all
    const query = { status: 'available' };
    if (!req.user || !['admin', 'superadmin'].includes(req.user?.role)) {
      query.isApproved = true;
    }

    // Apply filters
    if (req.query.city) query.city = req.query.city;
    if (req.query.type) query.propertyType = req.query.type;
    if (req.query.furnished !== undefined) {
      query.furnished = req.query.furnished === 'true';
    }
    if (req.query.priceMin) {
      query.price = { ...query.price, $gte: parseInt(req.query.priceMin) };
    }
    if (req.query.priceMax) {
      query.price = { ...query.price, $lte: parseInt(req.query.priceMax) };
    }

    const properties = await Property.find(query)
      .populate('postedBy', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all properties error:', error);
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('postedBy', 'name email phone profileImage role');

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    res.json({
      success: true,
      data: { property },
    });
  } catch (error) {
    logger.error('Get property by ID error:', error);
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Check ownership
    if (property.postedBy.toString() !== req.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this property',
      });
    }

    const allowedUpdates = [
      'title', 'description', 'price', 'propertyType', 'location',
      'city', 'state', 'pincode', 'bedrooms', 'bathrooms', 'area',
      'furnished', 'images', 'status', 'isApproved', 'latitude', 'longitude', 'amenities',
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    await property.save();

    const updatedProperty = await Property.findById(property._id)
      .populate('postedBy', 'name email phone profileImage');

    res.json({
      success: true,
      data: { property: updatedProperty },
    });
  } catch (error) {
    logger.error('Update property error:', error);
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Check ownership or admin
    if (property.postedBy.toString() !== req.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this property',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    logger.error('Delete property error:', error);
    next(error);
  }
};

export const filterProperties = async (req, res, next) => {
  try {
    const {
      city,
      type,
      priceMin,
      priceMax,
      furnished,
      bedrooms,
      bathrooms,
      state,
    } = req.query;

    // Only show approved properties to public, admin can see all
    const query = { status: 'available' };
    if (!req.user || !['admin', 'superadmin'].includes(req.user?.role)) {
      query.isApproved = true;
    }

    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (type) query.propertyType = type;
    if (furnished !== undefined) {
      query.furnished = furnished === 'true';
    }
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (bathrooms) query.bathrooms = parseInt(bathrooms);
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseInt(priceMin);
      if (priceMax) query.price.$lte = parseInt(priceMax);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find(query)
      .populate('postedBy', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        filters: req.query,
      },
    });
  } catch (error) {
    logger.error('Filter properties error:', error);
    next(error);
  }
};

export default {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  filterProperties,
};

