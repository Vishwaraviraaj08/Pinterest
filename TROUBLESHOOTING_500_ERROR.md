# Troubleshooting 500 Internal Server Error on Registration

## Steps to Diagnose

### 1. Check Server Logs

The most important step is to check the **server console logs** when you make the registration request. The improved logging will show:

- Where the error occurs
- The actual exception message
- Stack trace

**Look for lines like:**
```
ERROR ... UserService - Unexpected error during registration: ...
```

### 2. Common Causes and Solutions

#### A. Database Connection Issue

**Symptoms:**
- Error mentions "Connection refused" or "Communications link failure"
- Error mentions "Access denied"

**Solution:**
1. Verify MySQL is running
2. Check database credentials in `application.yml`
3. Verify database exists: `pinterest_user_db`
4. Check if user has proper permissions

**Test Connection:**
```sql
mysql -u root -p
USE pinterest_user_db;
SHOW TABLES;
```

#### B. Table Doesn't Exist

**Symptoms:**
- Error mentions "Table 'pinterest_user_db.users' doesn't exist"

**Solution:**
1. Check if table was created:
   ```sql
   SHOW TABLES;
   DESCRIBE users;
   ```
2. If table doesn't exist, restart the service - Hibernate should create it
3. Or manually run the DDL script from `server/database/ddl.sql`

#### C. JWT Secret Key Issue

**Symptoms:**
- Error mentions "Invalid key" or "Key size"

**Solution:**
- The JWT secret should be at least 32 characters
- Current secret: `pinterest-secret-key-for-jwt-token-generation-2024` (47 chars) - should be fine
- If issue persists, try a longer key

#### D. Constraint Violation

**Symptoms:**
- Error mentions "Duplicate entry" or "Constraint violation"
- Email or username already exists

**Solution:**
- Try with a different email/username
- Or delete existing user from database

#### E. ModelMapper Issue

**Symptoms:**
- Error mentions "ModelMapper" or "Mapping"

**Solution:**
- ModelMapper is configured correctly
- If issue persists, check if ModelMapper bean is created

### 3. Quick Fixes to Try

#### Fix 1: Restart the Service

Sometimes a simple restart fixes issues:
```bash
# Stop the service
# Then restart it
cd server/user-authentication-service
mvn spring-boot:run
```

#### Fix 2: Verify Database

```sql
-- Connect to MySQL
mysql -u root -p

-- Check database exists
SHOW DATABASES LIKE 'pinterest_user_db';

-- Use the database
USE pinterest_user_db;

-- Check table exists
SHOW TABLES;

-- Check table structure
DESCRIBE users;

-- If table doesn't exist, create it manually
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    bio TEXT,
    avatar VARCHAR(500),
    mobile_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Fix 3: Check Application Logs

After making a registration request, immediately check the console output for:
- ERROR messages
- Stack traces
- Database connection messages

### 4. Test Direct Database Insert

To verify database is working:

```sql
INSERT INTO users (email, username, password, first_name, last_name) 
VALUES ('test@test.com', 'testuser', 'hashedpassword', 'Test', 'User');
```

If this fails, there's a database issue.

### 5. Enable More Detailed Logging

Add to `application.yml`:
```yaml
logging:
  level:
    com.pinterest: DEBUG
    org.springframework.security: DEBUG
    org.hibernate: DEBUG
    org.springframework.web: DEBUG
```

### 6. Test with Minimal Request

Try with minimal data to isolate the issue:

```json
{
  "email": "test2@example.com",
  "username": "testuser2",
  "password": "Test123!@#",
  "confirmPassword": "Test123!@#",
  "firstName": "Test",
  "lastName": "User"
}
```

(Remove mobileNumber to see if that's the issue)

## Next Steps

1. **Check the server console logs** - This is the most important step
2. **Share the error message** from the logs
3. **Try the quick fixes** above
4. **Verify database connection** and table existence

The improved error handling will now log the exact exception, making it easier to identify the root cause.

