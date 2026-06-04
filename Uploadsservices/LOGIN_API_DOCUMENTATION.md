# Login Backend API Documentation

## Overview
This document describes the login and authentication backend for the HR Dashboard. The backend uses JWT tokens for authentication and BCrypt for password encoding.

## Base URL
```
http://localhost:6002/api/auth
```

## Endpoints

### 1. Register New HR User
**Endpoint:** `POST /api/auth/register`

**Description:** Register a new HR user account

**Request Body:**
```json
{
  "companyName": "TechCorp Inc",
  "hrName": "John Doe",
  "email": "john@techcorp.com",
  "phone": "+1-234-567-8900",
  "website": "https://techcorp.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "hrInfo": {
    "id": 1,
    "email": "john@techcorp.com",
    "companyName": "TechCorp Inc",
    "hrName": "John Doe",
    "phone": "+1-234-567-8900",
    "website": "https://techcorp.com",
    "role": "HR"
  }
}
```

**Response (Failure - 400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. Login HR User
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate HR user and get JWT token

**Request Body:**
```json
{
  "email": "john@techcorp.com",
  "password": "SecurePassword123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "hrInfo": {
    "id": 1,
    "email": "john@techcorp.com",
    "companyName": "TechCorp Inc",
    "hrName": "John Doe",
    "phone": "+1-234-567-8900",
    "website": "https://techcorp.com",
    "role": "HR"
  }
}
```

**Response (Failure - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get HR Profile
**Endpoint:** `GET /api/auth/profile/{hrId}`

**Description:** Retrieve HR profile information by user ID

**Path Parameters:**
- `hrId` (Long): HR user ID

**Response (Success - 200):**
```json
{
  "id": 1,
  "email": "john@techcorp.com",
  "companyName": "TechCorp Inc",
  "hrName": "John Doe",
  "phone": "+1-234-567-8900",
  "website": "https://techcorp.com",
  "role": "HR"
}
```

**Response (Failure - 404):**
```
User not found
```

---

### 4. Update HR Profile
**Endpoint:** `PUT /api/auth/profile/{hrId}`

**Description:** Update HR profile information

**Path Parameters:**
- `hrId` (Long): HR user ID

**Request Body:**
```json
{
  "companyName": "TechCorp Inc Updated",
  "hrName": "John Doe",
  "email": "john@techcorp.com",
  "phone": "+1-987-654-3210",
  "website": "https://newtechcorp.com",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "hrInfo": {
    "id": 1,
    "email": "john@techcorp.com",
    "companyName": "TechCorp Inc Updated",
    "hrName": "John Doe",
    "phone": "+1-987-654-3210",
    "website": "https://newtechcorp.com",
    "role": "HR"
  }
}
```

---

### 5. Validate JWT Token
**Endpoint:** `POST /api/auth/validate`

**Description:** Validate JWT token and get user information

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "hrInfo": {
    "id": 1,
    "email": "john@techcorp.com",
    "companyName": "TechCorp Inc",
    "hrName": "John Doe",
    "phone": "+1-234-567-8900",
    "website": "https://techcorp.com",
    "role": "HR"
  }
}
```

**Response (Failure - 401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### 6. Health Check
**Endpoint:** `GET /api/auth/health`

**Description:** Check if auth service is running

**Response (200):**
```
Auth service is running
```

---

## Authentication

All endpoints except `/register`, `/login`, and `/health` require JWT token authentication.

**How to use JWT token:**
1. After login or registration, you'll receive a token
2. Add the token to the `Authorization` header with format: `Bearer <token>`
3. Example:
   ```
   Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb2huQHRlY2hjb3JwLmNvbSIsInVzZXJJZCI6MSwiZXhwIjoxNjg0MTM2MDAwfQ.signature
   ```

---

## Token Details

- **Token Type:** JWT (JSON Web Token)
- **Algorithm:** HS512
- **Expiration:** 24 hours (configurable in `application.properties`)
- **Claims:** 
  - `sub` (subject): User email
  - `userId`: User ID
  - `iat` (issued at): Token creation time
  - `exp` (expiration): Token expiration time

---

## Error Handling

All endpoints return appropriate HTTP status codes:

| Status Code | Description |
|---|---|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials or token |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## CORS Configuration

The backend supports CORS for the following origins:
- `http://localhost:3000`
- `http://localhost:4200`
- `http://localhost:5173`
- `*` (all origins)

Allowed HTTP methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

---

## Configuration

Key configuration properties in `application.properties`:

```properties
# JWT Configuration
jwt.secret=mySecretKeyForJWTTokenGenerationAndValidationPurpose2024
jwt.expiration=86400000  # 24 hours in milliseconds

# Server Port
server.port=6002

# Database (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/resume_db
spring.datasource.username=root
spring.datasource.password=3564
```

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:6002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "TechCorp Inc",
    "hrName": "John Doe",
    "email": "john@techcorp.com",
    "phone": "+1-234-567-8900",
    "website": "https://techcorp.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:6002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@techcorp.com",
    "password": "SecurePassword123!"
  }'
```

**Validate Token:**
```bash
curl -X POST http://localhost:6002/api/auth/validate \
  -H "Authorization: Bearer <your-token-here>"
```

### Using Postman

1. Create a new request
2. Set the method to POST
3. Enter the endpoint URL
4. Go to "Body" tab and select "raw" and "JSON"
5. Paste the JSON request body
6. Click "Send"

---

## Next Steps

1. Test the endpoints using Postman or cURL
2. Integrate with your frontend application
3. Store the JWT token in localStorage or sessionStorage
4. Include the token in subsequent requests for authentication
5. Implement token refresh mechanism if needed

---

## Security Considerations

1. **Password Encoding:** All passwords are encoded using BCrypt
2. **JWT Secret:** Keep `jwt.secret` secure and change it in production
3. **HTTPS:** Always use HTTPS in production
4. **Token Expiration:** Tokens expire after 24 hours
5. **CORS:** Restrict CORS origins in production

---

## Troubleshooting

**Issue:** "Email already registered"
- **Solution:** Use a different email address

**Issue:** "Passwords do not match"
- **Solution:** Ensure password and confirmPassword are identical

**Issue:** "Invalid or expired token"
- **Solution:** Generate a new token by logging in again

**Issue:** CORS error
- **Solution:** Check if your frontend origin is in the CORS allowed list

---

For more information or issues, please contact the development team.
