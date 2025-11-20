-- Migration: Add discount and ID image columns to bookings table
-- Run this SQL in your phpMyAdmin or MySQL client

-- Add ID image URL column (for storing Cloudinary URL)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS id_image_url VARCHAR(500) NULL COMMENT 'URL of uploaded ID image (PWD/Senior Citizen)';

-- Add discount type column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS discount_type VARCHAR(50) DEFAULT 'None' COMMENT 'Discount type: None, PWD, or Senior Citizen';

-- Add base price column (price before discount)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10, 2) NULL COMMENT 'Original price before discount';

-- Add discount amount column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Discount amount (20% for PWD/Senior Citizen)';

-- Update existing records to set default values
UPDATE bookings 
SET discount_type = 'None', 
    discount_amount = 0.00,
    base_price = total_price
WHERE discount_type IS NULL OR base_price IS NULL;

