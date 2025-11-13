# Z-Home Backend API

A comprehensive backend API built with Node.js, Express.js, MongoDB, Redis, and modern cloud services.

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Message Queue**: BullMQ (Redis-based)
- **File Storage**: AWS S3 / DigitalOcean Spaces
- **Authentication**: JWT (Access + Refresh tokens)
- **Real-time**: Socket.io
- **Payments**: Razorpay (India) + Stripe (International)
- **Containerization**: Docker
- **Monitoring**: Prometheus + Grafana, Sentry
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB 7 or higher
- Redis 7 or higher
- Docker and Docker Compose (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd z-home
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in all required values.

4. **Start MongoDB and Redis**
   
   Using Docker Compose:
   ```bash
   docker-compose up -d mongo redis
   ```
   
   Or install and run them locally.

5. **Run the application**
   
   Development:
   ```bash
   npm run dev
   ```
   
   Production:
   ```bash
   npm start
   ```

## 🐳 Docker Setup

### Using Docker Compose

Start all services:
```bash
docker-compose up -d
```

Start with development tools (Mongo Express, Redis Commander):
```bash
docker-compose --profile tools up -d
```

Stop all services:
```bash
docker-compose down
```

### Build Docker Image

```bash
docker build -t z-home-backend .
docker run -p 3000:3000 --env-file .env z-home-backend
```

## 📁 Project Structure

```
z-home/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── redis.js      # Redis connection
│   │   ├── socket.js     # Socket.io setup
│   │   └── metrics.js    # Prometheus metrics
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── jobs/             # BullMQ job definitions
│   ├── workers/          # BullMQ workers
│   ├── utils/            # Utility functions
│   └── server.js         # Application entry point
├── logs/                 # Application logs
├── .github/              # GitHub Actions workflows
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker image definition
└── package.json          # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `DELETE /api/users/me` - Delete user account
- `GET /api/users` - Get all users (admin)

### Payments
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `POST /api/payments/stripe/create-payment` - Create Stripe payment
- `POST /api/payments/stripe/webhook` - Stripe webhook handler

### File Upload
- `POST /api/upload` - Upload file to S3
- `DELETE /api/upload/:fileKey` - Delete file
- `GET /api/upload/:fileKey` - Get signed URL

### Health & Metrics
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Access Token**: Short-lived (15 minutes), used for API requests
2. **Refresh Token**: Long-lived (7 days), used to get new access tokens

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 💳 Payment Integration

### Razorpay (India)
1. Create an order using `/api/payments/razorpay/create-order`
2. Process payment on frontend
3. Verify payment using `/api/payments/razorpay/verify`

### Stripe (International)
1. Create payment intent using `/api/payments/stripe/create-payment`
2. Process payment on frontend
3. Webhook handles payment confirmation automatically

## 📊 Monitoring

### Prometheus Metrics
Access metrics at `/metrics` endpoint. Integrate with Grafana for visualization.

### Sentry Error Tracking
Configure `SENTRY_DSN` in `.env` to enable error tracking.

### Logging
Logs are written to:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- `logs/exceptions.log` - Uncaught exceptions

## 🔄 Job Queues

BullMQ is used for background job processing. Start workers separately:

```bash
node src/workers/payment.worker.js
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### AWS ECS/EKS
1. Build Docker image
2. Push to ECR
3. Update ECS service or Kubernetes deployment

### DigitalOcean
1. Build Docker image
2. Push to DigitalOcean Container Registry
3. Deploy using App Platform or Droplets

### Heroku
```bash
heroku create z-home-backend
heroku addons:create mongolab
heroku addons:create heroku-redis
git push heroku main
```

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `REDIS_HOST` - Redis host
- `JWT_SECRET` - JWT signing secret
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `RAZORPAY_KEY_ID` - Razorpay credentials
- `STRIPE_SECRET_KEY` - Stripe secret key

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📱 Mobile App Integration

This API is fully compatible with mobile applications (iOS, Android, React Native, Flutter).

**Key Features for Mobile:**
- ✅ RESTful JSON API
- ✅ JWT token authentication
- ✅ Automatic token refresh
- ✅ File upload support
- ✅ Real-time features via Socket.io
- ✅ Mobile-friendly error responses
- ✅ CORS configured for mobile apps

See [MOBILE_API_GUIDE.md](./MOBILE_API_GUIDE.md) for detailed mobile integration guide and examples.

**Quick Start for Mobile:**
1. Use the same API endpoints
2. Include `Authorization: Bearer <token>` header
3. Handle token refresh on 401 responses
4. Store tokens securely (Keychain/Keystore)

## 📞 Support

For issues and questions, please open an issue on GitHub.

