package com.example.DemoHotelBooking.service;

import com.example.DemoHotelBooking.entity.Booking;
import com.example.DemoHotelBooking.entity.Payment;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendBookingConfirmation(Booking booking, Payment payment, BigDecimal discount) {
        String recipient = booking.getUser().getEmail();
        String subject = "Booking Confirmation - " + booking.getReservationNumber();

        String htmlContent = String.format(
            "<html>" +
            "<body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" +
            "  <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;'>" +
            "    <h2 style='color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;'>Your Reservation is Confirmed!</h2>" +
            "    <p>Dear <strong>%s</strong>,</p>" +
            "    <p>Thank you for booking with us. Your reservation at <strong>%s</strong> is successfully confirmed.</p>" +
            "    " +
            "    <div style='background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;'>" +
            "      <h3 style='margin-top: 0; color: #1e293b;'>Reservation Details</h3>" +
            "      <table style='width: 100%%; border-collapse: collapse;'>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Reservation Number:</td><td>%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Hotel:</td><td>%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Location:</td><td>%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Room Number:</td><td>%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Check-In Date:</td><td>%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Check-Out Date:</td><td>%s</td></tr>" +
            "      </table>" +
            "    </div>" +
            "    " +
            "    <div style='background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;'>" +
            "      <h3 style='margin-top: 0; color: #1e293b;'>Payment Summary</h3>" +
            "      <table style='width: 100%%; border-collapse: collapse;'>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Payment Status:</td><td>%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Payment Method:</td><td>%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold;'>Applied Discount:</td><td>$%s</td></tr>" +
            "        <tr><td style='padding: 5px 0; font-weight: bold; font-size: 1.1em;'>Total Charged:</td><td style='font-weight: bold; font-size: 1.1em; color: #4f46e5;'>$%s</td></tr>" +
            "      </table>" +
            "    </div>" +
            "    " +
            "    <p style='font-size: 0.9em; color: #64748b;'>If you have any questions or need to cancel your booking, please log into your account and manage your booking history.</p>" +
            "    <p style='margin-bottom: 0;'>Best regards,<br/><strong>Demo Hotel Booking Team</strong></p>" +
            "  </div>" +
            "</body>" +
            "</html>",
            booking.getUser().getName(),
            booking.getRoom().getHotel().getHotelName(),
            booking.getReservationNumber(),
            booking.getRoom().getHotel().getHotelName(),
            booking.getRoom().getHotel().getLocation(),
            booking.getRoom().getRoomNumber(),
            booking.getCheckInDate(),
            booking.getCheckOutDate(),
            payment.getPaymentStatus(),
            payment.getPaymentMethod(),
            discount.toString(),
            payment.getAmount().toString()
        );

        // Always print to console/logger as backup & testing output
        logger.info("\n=== EMAIL CONFIRMATION SENT TO: {} ===\nSubject: {}\nBody:\n{}\n====================================\n",
                recipient, subject, htmlContent);

        try {
            if (mailSender != null) {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(recipient);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                logger.info("Successfully sent booking confirmation email to: {}", recipient);
            } else {
                logger.warn("JavaMailSender is not initialized. Skipping actual email delivery.");
            }
        } catch (Exception e) {
            logger.error("Failed to send email confirmation: {}. Booking transaction will still succeed.", e.getMessage());
        }
    }
}
