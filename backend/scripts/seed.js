#!/usr/bin/env node

/**
 * Database Seeding Script
 * Populates the database with sample data for development/testing
 */

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { connectRedis, disconnectRedis } from '../src/config/redis.js';
import User from '../src/models/userModel.js';
import Property from '../src/models/propertyModel.js';
import Booking from '../src/models/bookingModel.js';
import Review from '../src/models/reviewModel.js';
import Message from '../src/models/messageModel.js';
import Notification from '../src/models/notificationModel.js';
import { logger } from '../src/utils/logger.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');

    // Connect to database
    await connectDB();
    await connectRedis();
    logger.info('Connected to database and Redis');

    // Clear existing data (optional - comment out if you want to keep existing data)
    logger.info('Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    logger.info('Existing data cleared');

    // Create Users
    logger.info('Creating users...');
    
    // Helper function to hash password
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(12);
      return await bcrypt.hash(password, salt);
    };

    // Hash all passwords before inserting (insertMany bypasses Mongoose hooks)
    const [superAdminPwd, adminPwd, rajeshPwd, priyaPwd, amitPwd, snehaPwd, vikramPwd, anjaliPwd] = await Promise.all([
      hashPassword('SuperAdmin123'),
      hashPassword('Admin123'),
      hashPassword('Broker123'),
      hashPassword('Seller123'),
      hashPassword('Buyer123'),
      hashPassword('Buyer123'),
      hashPassword('Seller123'),
      hashPassword('Broker123'),
    ]);

    const userData = [
      {
        name: 'Super Admin',
        email: 'superadmin@zhomes.com',
        password: superAdminPwd,
        phone: '+919876543210',
        role: 'superadmin',
        isVerified: true,
        status: 'active',
        bio: 'System Super Administrator',
      },
      {
        name: 'Admin User',
        email: 'admin@zhomes.com',
        password: adminPwd,
        phone: '+919876543211',
        role: 'admin',
        isVerified: true,
        status: 'active',
        bio: 'System Administrator',
      },
      {
        name: 'Rajesh Broker',
        email: 'rajesh@zhomes.com',
        password: rajeshPwd,
        phone: '+919876543212',
        role: 'broker',
        isVerified: true,
        status: 'active',
        bio: 'Professional real estate broker with 10+ years experience',
        socialLinks: {
          facebook: 'https://facebook.com/rajesh',
          linkedin: 'https://linkedin.com/in/rajesh',
        },
      },
      {
        name: 'Priya Seller',
        email: 'priya@zhomes.com',
        password: priyaPwd,
        phone: '+919876543213',
        role: 'seller',
        isVerified: true,
        status: 'active',
        bio: 'Property owner looking to rent/sell',
      },
      {
        name: 'Amit Buyer',
        email: 'amit@zhomes.com',
        password: amitPwd,
        phone: '+919876543214',
        role: 'buyer',
        isVerified: true,
        status: 'active',
        bio: 'Looking for a 2BHK apartment in Indore',
      },
      {
        name: 'Sneha Buyer',
        email: 'sneha@zhomes.com',
        password: snehaPwd,
        phone: '+919876543215',
        role: 'buyer',
        isVerified: true,
        status: 'active',
        bio: 'Searching for a furnished flat',
      },
      {
        name: 'Vikram Seller',
        email: 'vikram@zhomes.com',
        password: vikramPwd,
        phone: '+919876543216',
        role: 'seller',
        isVerified: false,
        status: 'active',
        bio: 'New property owner',
      },
      {
        name: 'Anjali Broker',
        email: 'anjali@zhomes.com',
        password: anjaliPwd,
        phone: '+919876543217',
        role: 'broker',
        isVerified: true,
        status: 'active',
        bio: 'Expert in commercial properties',
      },
    ];

    const users = await User.insertMany(userData);
    logger.info(`Created ${users.length} users`);

    // Create Properties
    logger.info('Creating properties...');
    const properties = await Property.insertMany([
      {
        title: 'Spacious 2BHK Apartment in Scheme 78',
        description: 'Beautiful 2BHK apartment with modern amenities, located in prime area of Indore. Fully furnished with AC, modular kitchen, and parking.',
        price: 12000,
        propertyType: 'apartment',
        location: 'Scheme 78, Near City Center',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452001',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        furnished: true,
        images: [
          'https://example.com/property1-1.jpg',
          'https://example.com/property1-2.jpg',
        ],
        postedBy: users[2]._id, // Rajesh Broker
        status: 'available',
        isApproved: true,
        latitude: 22.7196,
        longitude: 75.8577,
        amenities: ['AC', 'Parking', 'Lift', 'Security', 'Power Backup'],
      },
      {
        title: '3BHK Flat in Vijay Nagar',
        description: 'Well-maintained 3BHK flat in Vijay Nagar. Semi-furnished with all basic amenities. Close to schools and hospitals.',
        price: 18000,
        propertyType: 'flat',
        location: 'Vijay Nagar, Indore',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452010',
        bedrooms: 3,
        bathrooms: 2,
        area: 1500,
        furnished: false,
        images: [
          'https://example.com/property2-1.jpg',
        ],
        postedBy: users[3]._id, // Priya Seller
        status: 'available',
        isApproved: true,
        latitude: 22.7350,
        longitude: 75.8840,
        amenities: ['Parking', 'Lift', 'Security'],
      },
      {
        title: '1BHK Room for Rent',
        description: 'Single room with attached bathroom. Perfect for students or working professionals. Shared kitchen available.',
        price: 5000,
        propertyType: 'room',
        location: 'Palasia, Indore',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452001',
        bedrooms: 1,
        bathrooms: 1,
        area: 300,
        furnished: true,
        images: [
          'https://example.com/property3-1.jpg',
        ],
        postedBy: users[7]._id, // Anjali Broker
        status: 'available',
        isApproved: true,
        latitude: 22.7144,
        longitude: 75.8683,
        amenities: ['WiFi', 'Power Backup'],
      },
      {
        title: 'Luxury Villa in Bicholi Mardana',
        description: 'Premium 4BHK villa with garden, swimming pool, and modern architecture. Perfect for families.',
        price: 50000,
        propertyType: 'villa',
        location: 'Bicholi Mardana, Indore',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452016',
        bedrooms: 4,
        bathrooms: 3,
        area: 3500,
        furnished: true,
        images: [
          'https://example.com/property4-1.jpg',
          'https://example.com/property4-2.jpg',
          'https://example.com/property4-3.jpg',
        ],
        postedBy: users[2]._id, // Rajesh Broker
        status: 'available',
        isApproved: true,
        latitude: 22.7500,
        longitude: 75.9000,
        amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'AC', 'Power Backup'],
      },
      {
        title: '2BHK Apartment Near Airport',
        description: 'Modern 2BHK apartment close to airport. Fully furnished with all modern amenities.',
        price: 15000,
        propertyType: 'apartment',
        location: 'Airport Road, Indore',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452005',
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        furnished: true,
        images: [
          'https://example.com/property5-1.jpg',
        ],
        postedBy: users[3]._id, // Priya Seller
        status: 'available',
        isApproved: false, // Pending approval
        latitude: 22.7200,
        longitude: 75.8000,
        amenities: ['AC', 'Parking', 'Lift', 'Security'],
      },
      {
        title: 'Budget 1BHK Flat in Rau',
        description: 'Affordable 1BHK flat in Rau area. Basic amenities available. Good connectivity.',
        price: 7000,
        propertyType: 'flat',
        location: 'Rau, Indore',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '453331',
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        furnished: false,
        images: [
          'https://example.com/property6-1.jpg',
        ],
        postedBy: users[6]._id, // Vikram Seller (unverified)
        status: 'available',
        isApproved: false, // Pending approval
        latitude: 22.6500,
        longitude: 75.8500,
        amenities: ['Parking'],
      },
    ]);
    logger.info(`Created ${properties.length} properties`);

    // Create Bookings
    logger.info('Creating bookings...');
    const bookings = await Booking.insertMany([
      {
        property: properties[0]._id,
        buyer: users[4]._id, // Amit Buyer
        status: 'pending',
        message: 'I am interested in this apartment. Can we schedule a visit?',
        date: new Date(),
      },
      {
        property: properties[1]._id,
        buyer: users[5]._id, // Sneha Buyer
        status: 'approved',
        message: 'Looking for a long-term rental. Please contact me.',
        date: new Date(),
      },
      {
        property: properties[0]._id,
        buyer: users[5]._id, // Sneha Buyer
        status: 'rejected',
        message: 'Interested in viewing this property.',
        date: new Date(),
      },
      {
        property: properties[2]._id,
        buyer: users[4]._id, // Amit Buyer
        status: 'pending',
        message: 'Is this room still available?',
        date: new Date(),
      },
    ]);
    logger.info(`Created ${bookings.length} bookings`);

    // Update property status for approved booking
    if (bookings[1].status === 'approved') {
      await Property.findByIdAndUpdate(properties[1]._id, { status: 'booked' });
    }

    // Create Reviews
    logger.info('Creating reviews...');
    const reviews = await Review.insertMany([
      {
        property: properties[0]._id,
        user: users[4]._id, // Amit Buyer
        rating: 5,
        comment: 'Excellent apartment! Great location and well-maintained. Highly recommended.',
      },
      {
        property: properties[1]._id,
        user: users[5]._id, // Sneha Buyer
        rating: 4,
        comment: 'Good property with all basic amenities. The owner is very cooperative.',
      },
      {
        property: properties[0]._id,
        user: users[5]._id, // Sneha Buyer
        rating: 3,
        comment: 'Decent property but could use some improvements.',
      },
    ]);
    logger.info(`Created ${reviews.length} reviews`);

    // Create Messages
    logger.info('Creating messages...');
    const messages = await Message.insertMany([
      {
        sender: users[4]._id, // Amit Buyer
        receiver: users[2]._id, // Rajesh Broker
        message: 'Hello, is the 2BHK apartment in Scheme 78 still available?',
        isRead: true,
        readAt: new Date(),
      },
      {
        sender: users[2]._id, // Rajesh Broker
        receiver: users[4]._id, // Amit Buyer
        message: 'Yes, it is available. Would you like to schedule a visit?',
        isRead: false,
      },
      {
        sender: users[5]._id, // Sneha Buyer
        receiver: users[3]._id, // Priya Seller
        message: 'Hi, I am interested in the 3BHK flat. Can you share more details?',
        isRead: true,
        readAt: new Date(),
      },
      {
        sender: users[3]._id, // Priya Seller
        receiver: users[5]._id, // Sneha Buyer
        message: 'Sure! The flat is in excellent condition. When would you like to visit?',
        isRead: false,
      },
    ]);
    logger.info(`Created ${messages.length} messages`);

    // Create Notifications
    logger.info('Creating notifications...');
    const notifications = await Notification.insertMany([
      {
        user: users[4]._id, // Amit Buyer
        title: 'New Property Available',
        message: 'A new 2BHK apartment matching your preferences is now available.',
        type: 'property',
        relatedId: properties[0]._id,
        isRead: false,
      },
      {
        user: users[5]._id, // Sneha Buyer
        title: 'Booking Approved',
        message: 'Your booking for 3BHK Flat in Vijay Nagar has been approved.',
        type: 'booking',
        relatedId: bookings[1]._id,
        isRead: true,
        readAt: new Date(),
      },
      {
        user: users[2]._id, // Rajesh Broker
        title: 'New Message',
        message: 'You have a new message from Amit Buyer',
        type: 'message',
        relatedId: messages[0]._id,
        isRead: false,
      },
      {
        user: users[3]._id, // Priya Seller
        title: 'Property Approved',
        message: 'Your property "2BHK Apartment Near Airport" has been approved by admin.',
        type: 'system',
        isRead: false,
      },
    ]);
    logger.info(`Created ${notifications.length} notifications`);

    // Summary
    logger.info('\n=== Seeding Summary ===');
    logger.info(`Users: ${users.length}`);
    logger.info(`Properties: ${properties.length}`);
    logger.info(`Bookings: ${bookings.length}`);
    logger.info(`Reviews: ${reviews.length}`);
    logger.info(`Messages: ${messages.length}`);
    logger.info(`Notifications: ${notifications.length}`);
    logger.info('\n=== Test Credentials ===');
    logger.info('Super Admin: superadmin@zhomes.com / SuperAdmin123');
    logger.info('Admin: admin@zhomes.com / Admin123');
    logger.info('Broker: rajesh@zhomes.com / Broker123');
    logger.info('Seller: priya@zhomes.com / Seller123');
    logger.info('Buyer: amit@zhomes.com / Buyer123');
    logger.info('\n✅ Database seeding completed successfully!');

  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  } finally {
    await disconnectDB();
    await disconnectRedis();
    process.exit(0);
  }
};

// Run seeding
seedDatabase().catch((error) => {
  logger.error('Seeding failed:', error);
  process.exit(1);
});

