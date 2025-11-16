import nodemailer from "nodemailer";

// Use noreplyrosarioresorts@gmail.com as default, or environment variable if set
const EMAIL_USER = process.env.EMAIL_USER || "noreplyrosarioresorts@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Add a third parameter "isReminder" (default false)
export const sendReservationEmail = async (
  to,
  reservationDetails,
  isReminder = false
) => {
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
    from: `"Rosario Resorts and Hotel" <${EMAIL_USER}>`,
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
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                  reservationDetails.roomName || reservationDetails.roomId
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Check-In:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                  reservationDetails.checkInDate
                }</td>

              </tr> 

              </tr>

              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Check-Out:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                  reservationDetails.checkOutDate
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Guests:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                  reservationDetails.guests?.adults || 0
                } Adult(s), ${
      reservationDetails.guests?.children || 0
    } Child(ren)</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Total Price:</strong></td>
                <td style="padding: 10px;">₱${
                  reservationDetails.totalPrice
                }</td>
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

// Send email notification for event reservation status updates (Confirmed or Cancelled)
export const sendEventReservationEmail = async (to, eventDetails, status) => {
  const isConfirmed = status === "Confirmed";

  const subject = isConfirmed
    ? "✅ Event Reservation Confirmed | Rosario Resorts and Hotel"
    : "❌ Event Reservation Declined | Rosario Resorts and Hotel";

  const messageHeader = isConfirmed
    ? "Your Event Reservation is Confirmed!"
    : "Event Reservation Update";

  const introMessage = isConfirmed
    ? "Thank you for choosing Rosario Resorts and Hotel! Your event reservation has been successfully confirmed. Below are your event details:"
    : "We regret to inform you that your event reservation has been declined. Please see the details below:";

  // Format date using local date components to avoid timezone shifts
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    try {
      let date;
      if (dateInput instanceof Date) {
        date = dateInput;
      } else if (typeof dateInput === "string") {
        // Handle YYYY-MM-DD or YYYY-MM-DD HH:MM:SS format
        const dateStr = dateInput.split("T")[0].split(" ")[0]; // Get just YYYY-MM-DD part
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [year, month, day] = dateStr.split("-").map(Number);
          // Create date using local time to avoid timezone shifts
          date = new Date(year, month - 1, day);
        } else {
          date = new Date(dateInput);
        }
      } else {
        date = new Date(dateInput);
      }
      
      if (isNaN(date.getTime())) {
        return String(dateInput).split("T")[0].split(" ")[0] || "N/A";
      }
      
      // Manual formatting using local date components to avoid timezone shifts
      const year = date.getFullYear();
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      return `${month} ${day}, ${year}`;
    } catch (e) {
      // Fallback: try to extract date part from string
      const dateStr = String(dateInput).split("T")[0].split(" ")[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
      return dateStr || "N/A";
    }
  };

  await transporter.sendMail({
    from: `"Rosario Resorts and Hotel" <${EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background-color:#f5f5f5; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
         
          <!-- HEADER - MATCHED DESIGN -->
          <div style="background-color:#007bff; color:white; text-align:center; padding:25px;">
            <h1 style="margin:0;">Rosario Resorts and Hotel</h1>
            <p style="margin:5px 0 0;">${messageHeader}</p>
          </div>

          <!-- BODY -->
          <div style="padding:30px;">
            <h2 style="color:#333;">Dear ${
              eventDetails.customer_name || "Guest"
            },</h2>
            <p style="font-size:16px; color:#555;">${introMessage}</p>

            <!-- EVENT STATUS BADGE -->
            <div style="background-color:#f8f9fa; padding:15px; border-radius:8px; margin:20px 0; border-left:4px solid ${
              isConfirmed ? "#28a745" : "#dc3545"
            };">
              <p style="margin:0; font-weight:bold; color:${
                isConfirmed ? "#28a745" : "#dc3545"
              };">
                ${isConfirmed ? "✅ Status: Confirmed" : "❌ Status: Declined"}
              </p>
            </div>

            <!-- TABLE (MATCHED DESIGN) -->
            <table style="width:100%; border-collapse:collapse; margin-top:20px;">
              <tr>
                <td style="padding:10px; border-bottom:1px solid #eee;"><strong>Event Type:</strong></td>
                <td style="padding:10px; border-bottom:1px solid #eee;">${
                  eventDetails.event_type || "N/A"
                }</td>
              </tr>
              <tr>
                <td style="padding:10px; border-bottom:1px solid #eee;"><strong>Start Date:</strong></td>
                <td style="padding:10px; border-bottom:1px solid #eee;">${formatDate(
                  eventDetails.event_start_date
                )}</td>
              </tr>
              <tr>
                <td style="padding:10px; border-bottom:1px solid #eee;"><strong>End Date:</strong></td>
                <td style="padding:10px; border-bottom:1px solid #eee;">${formatDate(
                  eventDetails.event_end_date
                )}</td>
              </tr>
              ${
                eventDetails.contact_number
                  ? `
                <tr>
                  <td style="padding:10px; border-bottom:1px solid #eee;"><strong>Contact Number:</strong></td>
                  <td style="padding:10px; border-bottom:1px solid #eee;">${eventDetails.contact_number}</td>
                </tr>`
                  : ""
              }
              ${
                eventDetails.special_request
                  ? `
                <tr>
                  <td style="padding:10px; border-bottom:1px solid #eee;"><strong>Special Request:</strong></td>
                  <td style="padding:10px; border-bottom:1px solid #eee;">${eventDetails.special_request}</td>
                </tr>`
                  : ""
              }
            </table>

            <!-- FOOTER TEXT -->
            <p style="margin-top:25px; color:#555;">
              ${
                isConfirmed
                  ? "We look forward to hosting your event! If you have any questions or need to make changes to your booking, please contact us at:"
                  : "We apologize for the inconvenience. If you wish to discuss alternative dates, please contact us at:"
              }
            </p>

            <p style="color:#007bff; font-weight:bold;">
              📞 0949-990-6350 / 0977-806-4396<br>
              ✉️ reservations@rosarioresort.com
            </p>

            <div style="text-align:center; margin-top:30px;">
              <a href="https://rosarioresorts.com"
                style="background-color:#007bff; color:white; padding:12px 25px; text-decoration:none; border-radius:8px; display:inline-block;">
                Visit Our Website
              </a>
            </div>
          </div>

          <!-- FOOTER -->
          <div style="background-color:#f1f1f1; text-align:center; padding:15px; font-size:14px; color:#777;">
            © ${new Date().getFullYear()} Rosario Resorts and Hotel. All rights reserved.
          </div>
        </div>
      </div>
    `,
  });
};