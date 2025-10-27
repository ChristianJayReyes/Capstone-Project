import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Add a third parameter "isReminder" (default false)
export const sendReservationEmail = async (to, reservationDetails, isReminder = false) => {
  const subject = isReminder
    ? "📅 Reminder: Your Stay is Tomorrow | Rosario Resorts and Hotel"
    : "🌴 Your Reservation is Confirmed | Rosario Resorts and Hotel";

  const messageHeader = isReminder
    ? "Reminder: Your Stay is Tomorrow!"
    : "Your Booking Confirmation";

  const introMessage = isReminder
    ? "This is a friendly reminder that your stay at Rosario Resorts and Hotel starts tomorrow. Here are your booking details:"
    : "Thank you for choosing Rosario Resorts and Hotel! Your reservation has been successfully confirmed. Below are your booking details:";

  await transporter.sendMail({
    from: `"Rosario Resorts and Hotel" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <div style="background-color: #007bff; color: white; text-align: center; padding: 25px;">
            <h1 style="margin: 0;">Rosario Resorts and Hotel</h1>
            <p style="margin: 5px 0 0;">${messageHeader}</p>
          </div>
    
          <div style="padding: 30px;">
            <h2 style="color: #333;">Dear Guest,</h2>
            <p style="font-size: 16px; color: #555;">${introMessage}</p>
    
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Room:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${reservationDetails.roomName || reservationDetails.roomId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Check-In:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${reservationDetails.checkInDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Check-Out:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${reservationDetails.checkOutDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Guests:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${reservationDetails.guests?.adults || 0} Adult(s), ${reservationDetails.guests?.children || 0} Child(ren)</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Total Price:</strong></td>
                <td style="padding: 10px;">₱${reservationDetails.totalPrice}</td>
              </tr>
            </table>
    
            <p style="margin-top: 25px; color: #555;">
              ${
                isReminder
                  ? "We’re excited to welcome you soon! Please bring a valid ID and your booking reference upon arrival."
                  : "We look forward to welcoming you soon. If you have any questions or need to make changes to your booking, please contact us at:"
              }
            </p>
    
            <p style="color: #007bff; font-weight: bold;">📞 0949-990-6350 / 0977-806-4396<br>✉️ reservations@rosarioresort.com</p>
    
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://rosarioresorts.com" 
                style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Visit Our Website
              </a>
            </div>
          </div>
    
          <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #777;">
            © ${new Date().getFullYear()} Rosario Resorts and Hotel. All rights reserved.
          </div>
        </div>
      </div>
    `,
  });
};
