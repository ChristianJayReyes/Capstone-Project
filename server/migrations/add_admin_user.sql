-- Add admin user to the database
-- Replace 'admin@rosarioresorts.com' and 'YourSecurePassword123!' with your desired admin email and password
-- The password will be hashed using bcrypt

-- First, make sure the role column exists and can store 'admin' or 'hotelAdmin'
-- If role column doesn't exist or needs to be updated:
-- ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'user';

-- Insert admin user (you'll need to hash the password first using bcrypt)
-- Option 1: Use Node.js to hash the password, then insert
-- Option 2: Use this SQL and update password_hash after

INSERT INTO users (
    full_name, 
    email, 
    password, 
    role, 
    verified,
    created_at
) VALUES (
    'Admin User',
    'admin@rosarioresorts.com',  -- Change this to your admin email
    '$2b$10$YourHashedPasswordHere',  -- This needs to be a bcrypt hash
    'hotelAdmin',  -- or 'admin' depending on your preference
    1,  -- verified = true
    NOW()
);

-- If admin user already exists, update the role:
-- UPDATE users SET role = 'hotelAdmin' WHERE email = 'admin@rosarioresorts.com';

