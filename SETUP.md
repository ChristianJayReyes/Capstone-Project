# Hotel Management System - Backend Setup

## Overview
This is a complete hotel management system with PHP backend and React frontend. The system includes booking management, room management, guest management, and booking logs.

## Database Setup (AlwaysData MySQL)

### 1. Database Configuration
The system is configured to use AlwaysData MySQL with the following credentials:
- Host: `mysql-rosarioresortshotel.alwaysdata.net`
- Database: `rosarioresortshotel_db`
- Username: `423538`
- Password: `rosarioresorts`

### 2. Database Schema
The system automatically creates the following tables:

#### Users Table
- `user_id` (Primary Key)
- `full_name`
- `email`
- `phone`
- `password`
- `created_at`
- `photo`
- `reset_token`
- `reset_expires`
- `verified`
- `verification_token`
- `otp`
- `otp_expires`
- `role` (guest/admin)

#### Room Types Table
- `room_type_id` (Primary Key)
- `type_name`
- `capacity_adults`
- `capacity_children`
- `price_per_night`

#### Rooms Table
- `room_id` (Primary Key)
- `room_number`
- `room_type_id` (Foreign Key)
- `status` (Available/Booked/Maintenance)

#### Bookings Table
- `booking_id` (Primary Key)
- `user_id` (Foreign Key)
- `room_type_id` (Foreign Key)
- `check_in_date`
- `check_out_date`
- `status` (Pending/Confirmed/Checked-in/Checked-out/Cancelled)
- `created_at`
- `total_price`
- `check_in_time`
- `check_out_time`

#### Booking Rooms Table
- `id` (Primary Key)
- `booking_id` (Foreign Key)
- `room_id` (Foreign Key)
- `assigned_at`

#### Booking Logs Table
- `log_id` (Primary Key)
- `booking_id` (Foreign Key)
- `action`
- `admin_id` (Foreign Key)
- `timestamp`

## Backend API Endpoints

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-bookings` - Get recent bookings

### Bookings Endpoints
- `GET /api/bookings` - Get all bookings (with filters)
- `POST /api/bookings/confirm` - Confirm a booking
- `POST /api/bookings/cancel` - Cancel a booking
- `POST /api/bookings/checkin` - Check-in a guest
- `POST /api/bookings/checkout` - Check-out a guest

### Booking Logs Endpoints
- `GET /api/booking-logs` - Get booking logs (with filters)
- `GET /api/booking-logs/export` - Export booking logs as CSV

### Rooms Endpoints
- `GET /api/rooms` - Get all rooms (with filters)
- `POST /api/rooms` - Add a new room
- `PUT /api/rooms` - Update a room
- `DELETE /api/rooms` - Delete a room
- `GET /api/rooms/guests` - Get guest info for a room

### Room Types Endpoints
- `GET /api/room-types` - Get all room types
- `POST /api/room-types` - Add a new room type

### Guests Endpoints
- `GET /api/guests` - Get all guests (with filters)

### Email Endpoints
- `POST /api/send-email` - Send email notifications

## Setup Instructions

### 1. Backend Setup
1. Upload all files in the `server/` directory to your AlwaysData hosting
2. Ensure PHP 7.4+ is enabled
3. The database tables will be created automatically on first API call

### 2. Sample Data
To populate the database with sample data, visit:
```
https://yourdomain.com/api/sample_data.php
```

### 3. Frontend Setup
1. Navigate to the `client/` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### 4. API Configuration
The frontend is configured to make API calls to `/api/` endpoints. Ensure your web server is configured to route these requests to the PHP backend.

## Features

### Dashboard
- Total bookings count
- Pending approvals count
- Confirmed bookings count
- Total revenue
- Recent bookings table

### Bookings Management
- View all bookings with filters
- Search by guest name or room type
- Filter by status, room type, dates
- Confirm bookings (assign room + send email)
- Cancel bookings
- Check-in/Check-out guests
- View booking details

### Room Management
- View all rooms with filters
- Add new rooms
- Edit room details
- Delete rooms
- View room assignments
- Filter by room type and status

### Guest Management
- View all guests
- Search guests
- View guest booking history
- Guest statistics

### Booking Logs
- View all booking activities
- Filter by date range, status, room type
- Export logs to CSV
- Detailed log information

## Email Notifications
The system sends email notifications for:
- Booking confirmations
- Booking cancellations
- Check-in confirmations

Email configuration is in `server/api/email.php` using PHPMailer with Gmail SMTP.

## Security Features
- Prepared statements for all database queries
- Input sanitization
- CORS headers configured
- SQL injection protection
- XSS protection

## Error Handling
- Comprehensive error handling throughout the API
- User-friendly error messages
- Logging of errors for debugging

## Testing
To test the system:
1. Visit the dashboard to see statistics
2. Create some sample bookings
3. Test the booking confirmation flow
4. Test room management
5. Test guest management
6. Test booking logs and export

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Check AlwaysData credentials in `db.php`
2. **CORS Issues**: Ensure CORS headers are properly set
3. **Email Not Sending**: Check SMTP credentials in `email.php`
4. **API Not Found**: Ensure `.htaccess` is properly configured

### Debug Mode
Enable error reporting by adding this to the top of PHP files:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## Support
For issues or questions, check the error logs and ensure all dependencies are properly installed.
