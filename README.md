# Pinterest Microservices Application

A comprehensive Pinterest-like social media platform built using microservices architecture with Spring Boot backend and React frontend.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Setup Instructions](#setup-instructions)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Database Setup](#database-setup)
9. [Service Discovery](#service-discovery)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

## Project Overview

This application is a Pinterest clone that allows users to:
- Register and authenticate securely
- Create and manage Pins and Boards
- Search and discover content
- Follow other users and view connections
- Collaborate on boards through invitations
- View business profiles and sponsored content

## Architecture

The application follows a **Microservices Architecture** with the following services:

### Microservices

1. **User Authentication Service** (Port: 8081)
   - User registration and login
   - JWT token generation
   - Password reset functionality
   - User profile management
   - Circuit breaker for login attempts

2. **Content Service** (Port: 8082)
   - Pin creation, retrieval, update, and deletion
   - Board management
   - Search functionality for pins and boards
   - Public/private content visibility

3. **Collaboration Service** (Port: 8083)
   - Board collaboration management
   - Invitation system
   - User connections (followers/following)

4. **Business Account Service** (Port: 8084)
   - Business profile management
   - Sponsored pins
   - Advertising campaigns

5. **Gateway Service** (Port: 8080)
   - API Gateway using Spring Cloud Gateway
   - JWT authentication and authorization
   - Request routing and load balancing
   - CORS configuration

### Service Discovery

- **Spring Cloud Consul** for service registration and discovery
- All services register with Consul on startup
- Gateway uses service discovery for routing

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Cloud 2023.0.0**
- **Spring Data JPA**
- **Spring Security** with JWT
- **Spring Cloud Gateway**
- **Spring Cloud Consul**
- **MySQL** Database
- **Resilience4j** for Circuit Breaker
- **Lombok** for boilerplate code reduction
- **ModelMapper** for DTO mapping
- **Swagger/OpenAPI** for API documentation

### Frontend
- **React 18**
- **TypeScript**
- **Axios** for HTTP requests
- **React Router** for navigation
- **Bootstrap** for styling
- **Vite** as build tool

## Prerequisites

Before setting up the application, ensure you have the following installed:

1. **Java Development Kit (JDK) 17** or higher
   ```bash
   java -version
   ```

2. **Maven 3.6+**
   ```bash
   mvn -version
   ```

3. **MySQL 8.0+**
   ```bash
   mysql --version
   ```

4. **Node.js 18+** and **npm**
   ```bash
   node -v
   npm -v
   ```

5. **Consul** (for service discovery)
   - Download from: https://www.consul.io/downloads
   - Or use Docker: `docker run -d -p 8500:8500 consul`

6. **Git** (optional, for cloning the repository)

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "Pinterest - Final version"
```

### Step 2: Database Setup

1. **Start MySQL Server**
   ```bash
   # On Windows
   net start MySQL80
   
   # On Linux/Mac
   sudo systemctl start mysql
   ```

2. **Create Databases**
   - The databases will be created automatically when services start (if `createDatabaseIfNotExist=true` is set)
   - Alternatively, run the DDL script manually:
   ```bash
   mysql -u root -p < server/database/ddl.sql
   ```

3. **Update Database Credentials**
   - Update database credentials in each service's `application.yml`:
     - `server/user-authentication-service/src/main/resources/application.yml`
     - `server/content-service/src/main/resources/application.yml`
     - `server/collaboration-service/src/main/resources/application.yml`
     - `server/business-account-service/src/main/resources/application.yml`

### Step 3: Start Consul (Service Discovery)

**Option 1: Using Docker**
```bash
docker run -d -p 8500:8500 --name consul consul
```

**Option 2: Using Consul Binary**
1. Download Consul from https://www.consul.io/downloads
2. Extract and run:
   ```bash
   consul agent -dev -client 0.0.0.0
   ```

Verify Consul is running:
- Open browser: http://localhost:8500

### Step 4: Build Backend Services

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Build all microservices**
   ```bash
   mvn clean install
   ```

   This will build all services:
   - user-authentication-service
   - content-service
   - collaboration-service
   - business-account-service
   - gateway-service

### Step 5: Start Backend Services

Start services in the following order:

1. **User Authentication Service**
   ```bash
   cd user-authentication-service
   mvn spring-boot:run
   ```
   Or run the JAR:
   ```bash
   java -jar target/user-authentication-service-1.0.0.jar
   ```

2. **Content Service**
   ```bash
   cd content-service
   mvn spring-boot:run
   ```

3. **Collaboration Service**
   ```bash
   cd collaboration-service
   mvn spring-boot:run
   ```

4. **Business Account Service**
   ```bash
   cd business-account-service
   mvn spring-boot:run
   ```

5. **Gateway Service** (Start last)
   ```bash
   cd gateway-service
   mvn spring-boot:run
   ```

**Note:** For production, you can run multiple instances of each service for load balancing. Just change the port in `application.yml` for additional instances.

### Step 6: Setup Frontend

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at: http://localhost:5173

## Running the Application

### Complete Startup Sequence

1. **Start MySQL**
2. **Start Consul** (port 8500)
3. **Start all backend services** (in any order, but Gateway should be last)
4. **Start frontend** (npm run dev)

### Verify Services are Running

- **Gateway Service**: http://localhost:8080
- **User Auth Service**: http://localhost:8081
- **Content Service**: http://localhost:8082
- **Collaboration Service**: http://localhost:8083
- **Business Service**: http://localhost:8084
- **Frontend**: http://localhost:5173
- **Consul UI**: http://localhost:8500

### API Documentation (Swagger)

Each service has Swagger documentation available at:
- User Auth: http://localhost:8081/swagger-ui.html
- Content: http://localhost:8082/swagger-ui.html
- Collaboration: http://localhost:8083/swagger-ui.html
- Business: http://localhost:8084/swagger-ui.html

## API Documentation

### Base URL
All API requests go through the Gateway: `http://localhost:8080/api`

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Authentication Service APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNumber": "1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Response includes JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "username": "username",
  "userId": 1,
  "message": "Login successful"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "mobileNumber": "1234567890",
  "newPassword": "NewPassword123!"
}
```

### Content Service APIs

#### Create Pin
```http
POST /api/content/pins
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Pin",
  "description": "Pin description",
  "imageUrl": "https://example.com/image.jpg",
  "link": "https://example.com",
  "boardId": 1,
  "isPublic": true,
  "isDraft": false
}
```

#### Get Public Pins
```http
GET /api/content/pins/public
```

#### Search Pins
```http
GET /api/content/pins/search?keyword=travel
```

#### Create Board
```http
POST /api/content/boards
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Board",
  "description": "Board description",
  "isPrivate": false
}
```

### Collaboration Service APIs

#### Follow User
```http
POST /api/collaboration/connections/follow/{userId}
Authorization: Bearer <token>
```

#### Get Followers
```http
GET /api/collaboration/connections/followers/{userId}
```

#### Create Invitation
```http
POST /api/collaboration/invitations
Authorization: Bearer <token>
Content-Type: application/json

{
  "inviteeId": 2,
  "boardId": 1,
  "invitationType": "BOARD_COLLABORATION"
}
```

### Business Account Service APIs

#### Create Business Profile
```http
POST /api/business/profiles
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "My Business",
  "description": "Business description",
  "website": "https://example.com",
  "logo": "https://example.com/logo.jpg"
}
```

## Database Setup

### Database Configuration

The application uses separate databases for each microservice:

- **pinterest_user_db** - User Authentication Service
- **pinterest_content_db** - Content Service
- **pinterest_collaboration_db** - Collaboration Service
- **pinterest_business_db** - Business Account Service

### Database Credentials

Default configuration (update in `application.yml` if different):
- **Username**: root
- **Password**: root
- **Host**: localhost
- **Port**: 3306

### Running DDL Script

```bash
mysql -u root -p < server/database/ddl.sql
```

Or manually create databases and run the SQL statements from `server/database/ddl.sql`.

## Service Discovery

### Consul Configuration

- **Host**: localhost
- **Port**: 8500
- **UI**: http://localhost:8500

All services automatically register with Consul on startup. The Gateway uses Consul for service discovery and load balancing.

### Verifying Service Registration

1. Open Consul UI: http://localhost:8500
2. Navigate to "Services" tab
3. You should see all registered services:
   - user-authentication-service
   - content-service
   - collaboration-service
   - business-account-service
   - gateway-service

## Testing

### Backend Testing

Run JUnit tests for each service:
```bash
cd <service-directory>
mvn test
```

### API Testing with Postman

1. Import the Postman collection (if available)
2. Set environment variables:
   - `base_url`: http://localhost:8080/api
   - `token`: (will be set after login)

3. Test flow:
   - Register a new user
   - Login to get JWT token
   - Use token for authenticated requests

### Frontend Testing

The frontend includes integration with all backend APIs. Test the complete flow:
1. Register/Login
2. Create pins and boards
3. Search content
4. Follow users
5. View invitations

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Error**: `Port 8080 is already in use`

**Solution**: 
- Stop the process using the port
- Or change the port in `application.yml`

#### 2. Database Connection Failed
**Error**: `Cannot connect to MySQL`

**Solution**:
- Verify MySQL is running
- Check database credentials in `application.yml`
- Ensure databases are created

#### 3. Consul Connection Failed
**Error**: `Connection refused to Consul`

**Solution**:
- Verify Consul is running on port 8500
- Check Consul UI: http://localhost:8500
- Restart the service

#### 4. JWT Token Invalid
**Error**: `Invalid token` or `Unauthorized`

**Solution**:
- Ensure token is included in Authorization header
- Check token hasn't expired
- Re-login to get a new token

#### 5. Service Not Found
**Error**: `Service not found in Consul`

**Solution**:
- Verify service is registered in Consul UI
- Check service name matches in `application.yml`
- Restart the service

#### 6. CORS Errors
**Error**: `CORS policy blocked`

**Solution**:
- Verify frontend URL is in Gateway CORS configuration
- Check `application.yml` in gateway-service

### Logs

Check service logs for detailed error information:
- Logs are printed to console
- Check for stack traces and error messages

### Health Checks

Verify service health:
- Check Consul UI for service health status
- Each service exposes health endpoints

## Additional Notes

### Circuit Breaker Configuration

The application uses Resilience4j for circuit breakers:
- **Timeout**: 3 seconds
- **Error Threshold**: 50%
- **Open Duration**: 60 seconds
- **Minimum Calls**: 3

### Security Features

- **Password Hashing**: BCrypt
- **JWT Tokens**: Stateless authentication
- **Session Management**: JWT-based (stored in sessionStorage)
- **Input Validation**: Bean validation on all endpoints

### Performance Considerations

- **Lazy Loading**: Implemented for images
- **Caching**: Can be added using Spring Cache
- **Load Balancing**: Supported through Consul
- **Database Indexing**: Indexes on frequently queried columns

## Project Structure

```
Pinterest - Final version/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utilities
│   └── package.json
├── server/                 # Backend microservices
│   ├── user-authentication-service/
│   ├── content-service/
│   ├── collaboration-service/
│   ├── business-account-service/
│   ├── gateway-service/
│   ├── database/
│   │   └── ddl.sql        # Database scripts
│   └── pom.xml            # Parent POM
└── README.md
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review service logs
3. Verify all prerequisites are installed
4. Ensure all services are running

## License

This project is for educational purposes.

---

**Happy Pinning! 📌**


