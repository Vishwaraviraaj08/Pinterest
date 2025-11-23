# Postman Testing Guide for Pinterest Microservices

This guide explains how to test all the microservices APIs using Postman.

## Prerequisites

1. **All services must be running:**
   - Gateway Service (Port 8080)
   - User Authentication Service (Port 8081)
   - Content Service (Port 8082)
   - Collaboration Service (Port 8083)
   - Business Account Service (Port 8084)
   - Consul (Port 8500)

2. **Postman installed** (download from https://www.postman.com/downloads/)

## Setup Postman Environment

### Create Environment Variables

1. Open Postman
2. Click on "Environments" in the left sidebar
3. Click "+" to create a new environment
4. Name it "Pinterest Microservices"
5. Add these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `base_url` | http://localhost:8080/api | http://localhost:8080/api |
| `token` | (leave empty) | (leave empty) |
| `user_id` | (leave empty) | (leave empty) |

6. Click "Save"

7. **Select the environment** from the dropdown in the top right

## Testing Flow

### Step 1: Register a New User

**Request:**
- **Method:** POST
- **URL:** `{{base_url}}/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "testuser@example.com",
  "username": "testuser",
  "password": "Test123!@#",
  "confirmPassword": "Test123!@#",
  "firstName": "Test",
  "lastName": "User",
  "mobileNumber": "1234567890"
}
```

**Expected Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "testuser@example.com",
  "username": "testuser",
  "userId": 1,
  "message": "Registration successful"
}
```

**Action:** Copy the `token` value and paste it into the `token` environment variable.

### Step 2: Login (Alternative to Registration)

**Request:**
- **Method:** POST
- **URL:** `{{base_url}}/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "testuser@example.com",
  "password": "Test123!@#"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "testuser@example.com",
  "username": "testuser",
  "userId": 1,
  "message": "Login successful"
}
```

**Action:** Update the `token` environment variable with the received token.

### Step 3: Get User Profile

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/auth/profile/{{user_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "email": "testuser@example.com",
  "username": "testuser",
  "firstName": "Test",
  "lastName": "User",
  "bio": null,
  "avatar": null,
  "mobileNumber": "1234567890",
  "createdAt": "2025-11-23T10:00:00"
}
```

**Action:** Copy the `id` value and paste it into the `user_id` environment variable.

## Content Service APIs

### Create a Board

**Request:**
- **Method:** POST
- **URL:** `{{base_url}}/content/boards`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "My Travel Board",
  "description": "Places I want to visit",
  "isPrivate": false
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "name": "My Travel Board",
  "description": "Places I want to visit",
  "userId": 1,
  "isPrivate": false,
  "coverImage": null,
  "pinCount": 0,
  "pins": [],
  "createdAt": "2025-11-23T10:00:00",
  "updatedAt": "2025-11-23T10:00:00"
}
```

### Create a Pin

**Request:**
- **Method:** POST
- **URL:** `{{base_url}}/content/pins`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "Beautiful Beach",
  "description": "A stunning beach view",
  "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "link": "https://example.com",
  "boardId": 1,
  "isPublic": true,
  "isDraft": false
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "title": "Beautiful Beach",
  "description": "A stunning beach view",
  "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "link": "https://example.com",
  "userId": 1,
  "boardId": 1,
  "isPublic": true,
  "isDraft": false,
  "isSponsored": false,
  "savesCount": 0,
  "commentsCount": 0,
  "createdAt": "2025-11-23T10:00:00",
  "updatedAt": "2025-11-23T10:00:00"
}
```

### Get Public Pins

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/content/pins/public`
- **Headers:**
  - `Authorization: Bearer {{token}}`

### Search Pins

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/content/pins/search?keyword=beach`
- **Headers:**
  - `Authorization: Bearer {{token}}`

### Get User Boards

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/content/boards/user/{{user_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

## Collaboration Service APIs

### Follow a User

**Request:**
- **Method:** POST
- **URL:** `{{base_url}}/collaboration/connections/follow/2`
- **Headers:**
  - `Authorization: Bearer {{token}}`

**Note:** Replace `2` with the user ID you want to follow.

### Get Followers

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/collaboration/connections/followers/{{user_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

### Get Following

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/collaboration/connections/following/{{user_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

### Create Invitation

**Request:**
- **Method:** POST
- **URL:** `{{base_url}}/collaboration/invitations`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "inviteeId": 2,
  "boardId": 1,
  "invitationType": "BOARD_COLLABORATION"
}
```

### Get Invitations

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/collaboration/invitations/user/{{user_id}}`
- **Headers:**
  - `Authorization: Bearer {{token}}`

## Business Account Service APIs

### Create Business Profile

**Request:**
- **Method:** POST
- **URL:** `{{base_url}}/business/profiles`
- **Headers:**
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "businessName": "My Business",
  "description": "A great business",
  "website": "https://mybusiness.com",
  "logo": "https://example.com/logo.jpg"
}
```

### Get All Business Profiles

**Request:**
- **Method:** GET
- **URL:** `{{base_url}}/business/profiles`
- **Headers:**
  - `Authorization: Bearer {{token}}`

## Testing Direct Service Endpoints (Bypassing Gateway)

You can also test services directly (useful for debugging):

### User Authentication Service (Direct)
- Base URL: `http://localhost:8081/api/auth`
- Example: `http://localhost:8081/api/auth/login`

### Content Service (Direct)
- Base URL: `http://localhost:8082/api/content`
- Example: `http://localhost:8082/api/content/pins/public`
- **Note:** Direct access doesn't require JWT token, but Gateway does.

## Common Issues and Solutions

### 1. 401 Unauthorized
- **Problem:** Token expired or invalid
- **Solution:** Re-login and update the `token` environment variable

### 2. 403 Forbidden
- **Problem:** Missing or invalid authorization header
- **Solution:** Ensure `Authorization: Bearer {{token}}` header is present

### 3. 404 Not Found
- **Problem:** Wrong URL or service not running
- **Solution:** Check service is running and URL is correct

### 4. CORS Error
- **Problem:** CORS policy blocking request
- **Solution:** This shouldn't happen with Gateway, but if testing directly, add CORS headers

### 5. Connection Refused
- **Problem:** Service not running
- **Solution:** Start the service and verify it's listening on the correct port

## Postman Collection

You can create a Postman Collection to organize all requests:

1. Click "New" → "Collection"
2. Name it "Pinterest Microservices"
3. Create folders:
   - Authentication
   - Content (Pins & Boards)
   - Collaboration
   - Business
4. Add requests to appropriate folders
5. Use environment variables for `{{base_url}}`, `{{token}}`, and `{{user_id}}`

## Quick Test Checklist

- [ ] Register a new user
- [ ] Login with credentials
- [ ] Get user profile
- [ ] Create a board
- [ ] Create a pin
- [ ] Get public pins
- [ ] Search pins
- [ ] Follow a user
- [ ] Get followers
- [ ] Create invitation
- [ ] Create business profile

## Tips

1. **Save requests** in Postman for easy reuse
2. **Use environment variables** for dynamic values
3. **Test error cases** (invalid credentials, missing fields, etc.)
4. **Check response status codes** (200, 201, 400, 401, 404, 500)
5. **Verify response structure** matches expected format
6. **Test with multiple users** to test collaboration features

---

**Happy Testing! 🚀**

