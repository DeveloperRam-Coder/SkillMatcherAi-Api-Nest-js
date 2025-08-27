# SkillMatcher AI API - NestJS Project

This is a fresh NestJS project that replicates the functionality of your Express.js application with modern architecture and best practices.

## 🚀 Project Overview

This NestJS application provides the same functionality as your Express.js app:
- User authentication (register, login, logout)
- JWT token management with refresh tokens
- Role-based access control (admin, candidate, interviewer)
- User CRUD operations (admin only)
- Password hashing with bcrypt
- CORS configuration
- Cookie-based refresh tokens
- Health check endpoint

## 📁 Project Structure

```
SkillMatcherAi-NestJS/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts          # Root module
│   ├── auth/                  # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   └── auth.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── decorators/
│   │       └── current-user.decorator.ts
│   ├── users/                 # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── schemas/
│   │       └── user.schema.ts
│   └── health/                # Health check module
│       ├── health.module.ts
│       └── health.controller.ts
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── nest-cli.json            # NestJS CLI configuration
└── README.md                # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- npm or yarn package manager

### 1. Install Dependencies
```bash
cd SkillMatcherAi-NestJS
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/skillmatcher

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRE=1h

# Server Configuration
NODE_ENV=development
PORT=5000

# CORS Configuration
CLIENT_ORIGINS=http://localhost:5173,http://localhost:8080
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Build and Run
```bash
# Build the application
npm run build

# Start in development mode (with hot reload)
npm run start:dev

# Start in production mode
npm run start:prod
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health
- `GET /api/health` - Health check

## 📚 API Documentation

Once the application is running, visit `/api/docs` for interactive Swagger documentation.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🏗️ Architecture Benefits

### 1. **Modular Design**
- Clear separation of concerns
- Easy to maintain and scale
- Reusable components

### 2. **Type Safety**
- Full TypeScript support
- Compile-time error checking
- Better IDE support

### 3. **Built-in Features**
- Automatic validation with class-validator
- Swagger documentation generation
- Dependency injection
- Guards and interceptors

### 4. **Testing Support**
- Built-in testing utilities
- Easy mocking and testing
- Jest integration

### 5. **Performance**
- Efficient dependency injection
- Better memory management
- Optimized for production

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure cookie handling

## 📈 Next Steps

To extend this application:

1. **Add More Modules**
   - Skills module for candidate skills
   - Interviews module for scheduling
   - Assessments module for evaluations

2. **Enhance Security**
   - Rate limiting
   - Request logging
   - Audit trails

3. **Add Features**
   - File uploads
   - Email notifications
   - Real-time updates with WebSockets

4. **Monitoring & Logging**
   - Health checks
   - Performance monitoring
   - Error tracking

## 🤝 Contributing

This is a standalone project. Feel free to modify and extend it according to your needs.

## 📄 License

This project is for educational and development purposes.
