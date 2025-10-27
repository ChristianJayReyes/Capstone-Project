import nodemailer from "nodemailer";
import connectDB from "../configs/db.js";
import { sendReservationEmail } from "../utils/reservationEmail.js";
import cron from "node-cron";

cron.schedule("0 8 * * *", async () => {
  console.log("Running booking reminder scheduler...");

  const db = await connectDB();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().slice(0, 10);

  //Find all bookings that start tomorrow
  const [bookings] = await db.query(
    `SELECT b.booking_id, b.check_in, b.check_out, b.total_price, b.adults, b.children,
                u.email, rt.type_name AS roomType
         FROM bookings b
         JOIN users u ON b.user_id = u.user_id
         JOIN room_types rt ON b.room_type_id = rt.room_type_id
         WHERE DATE(b.check_in) = ?`,
    [formattedTomorrow]
  );

  if (bookings.length === 0) {
    console.log("No bookings found for tomorrow");
    return;
  }

  console.log(`Found ${bookings.length} bookings for tomorrow`);

  //Send reminder emails
  for (const booking of bookings) {
    const reservationDetails = {
      bookingId: booking.booking_id,
      checkInDate: booking.check_in,
      checkOutDate: booking.check_out,
      roomType: booking.roomType,
      totalPrice: booking.total_price,
      guests: {
        adults: booking.adults,
        children: booking.children,
      },
    };

    try {
      await sendReservationEmail(
        booking.email,
        reservationDetails,
        true // passing "true" means this is a reminder email
      );
      console.log(`📨 Reminder sent to ${booking.email}`);
    } catch (err) {
      console.error(`❌ Failed to send reminder to ${booking.email}:`, err.message);
    }
  }
});
