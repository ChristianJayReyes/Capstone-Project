<?php
declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';


function send_email(string $toEmail, string $toName, string $subject, string $htmlBody, string $altBody = ''): array {
    try {
        // Try PHPMailer first if available
        if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = getenv('SMTP_USER') ?: 'noreplyrosarioresorts@gmail.com';
            $mail->Password = getenv('SMTP_PASS') ?: 'coyj spjm pdig fxhg';
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->CharSet = 'UTF-8';
            $mail->setFrom(getenv('MAIL_FROM') ?: 'noreplyrosarioresorts@gmail.com', getenv('MAIL_FROM_NAME') ?: 'Rosario Resorts');
            $mail->addAddress($toEmail, $toName);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $altBody ?: strip_tags($htmlBody);
            $mail->send();
            return ['success' => true, 'message' => 'Email sent via PHPMailer'];
        }
    } catch (Throwable $e) { 
        error_log('PHPMailer error: ' . $e->getMessage());
    }

    // Fallback to mail() function
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: " . (getenv('MAIL_FROM') ?: 'noreplyrosarioresorts@gmail.com') . "\r\n";
    
    $ok = @mail($toEmail, $subject, $htmlBody, $headers);
    return $ok ? ['success' => true, 'message' => 'Email sent via mail()'] : ['success' => false, 'message' => 'mail() failed'];
}

function send_booking_confirmation(string $guestEmail, string $guestName, array $bookingData): array {
    $subject = 'Booking Confirmation — Rosario Resorts — Booking #' . $bookingData['booking_id'];
    
    $html = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Booking Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #374151; }
            .detail-value { color: #6b7280; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Rosario Resorts</h1>
                <h2>Booking Confirmation</h2>
            </div>
            <div class="content">
                <p>Hi ' . htmlspecialchars($guestName) . ',</p>
                <p>Your booking has been confirmed. We look forward to welcoming you to Rosario Resorts!</p>
                
                <div class="booking-details">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">#' . htmlspecialchars($bookingData['booking_id']) . '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Room Type:</span>
                        <span class="detail-value">' . htmlspecialchars($bookingData['room_type']) . '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Room Number:</span>
                        <span class="detail-value">' . htmlspecialchars($bookingData['room_number']) . '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Check-in Date:</span>
                        <span class="detail-value">' . htmlspecialchars($bookingData['check_in_date']) . '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Check-out Date:</span>
                        <span class="detail-value">' . htmlspecialchars($bookingData['check_out_date']) . '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total Price:</span>
                        <span class="detail-value">₱' . number_format($bookingData['total_price'], 2) . '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value" style="color: #059669; font-weight: bold;">Confirmed</span>
                    </div>
                </div>
                
                <p>If you have any questions or need to make changes to your booking, please contact us.</p>
            </div>
            <div class="footer">
                <p>Thank you for choosing Rosario Resorts!</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>';
    
    return send_email($guestEmail, $guestName, $subject, $html);
}

?>