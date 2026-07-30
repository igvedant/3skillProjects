const nodemailer = require('nodemailer');

// Configure transporter
const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
};

/**
 * Send Booking Confirmation Email
 */
const sendBookingConfirmationEmail = async (toEmail, userName, booking, event) => {
  const subject = `🎉 Booking Confirmed: ${event.title} [Ref: ${booking.bookingReference}]`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmation</h1>
        <p style="margin-top: 8px; opacity: 0.9;">Your registration has been confirmed!</p>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Thank you for registering for <strong>${event.title}</strong>. Here are your booking details:</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span style="font-family: monospace; font-size: 16px; color: #4f46e5; font-weight: bold;">${booking.bookingReference}</span></p>
          <p style="margin: 4px 0;"><strong>Event Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 4px 0;"><strong>Time:</strong> ${event.time}</p>
          <p style="margin: 4px 0;"><strong>Location:</strong> ${event.location}</p>
          <p style="margin: 4px 0;"><strong>Tickets Booked:</strong> ${booking.ticketsCount}</p>
          <p style="margin: 4px 0;"><strong>Total Paid:</strong> $${booking.totalAmount}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Approved / Confirmed</span></p>
        </div>

        <p>Please show your Booking Reference code at the venue entrance upon arrival.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">EventHub Platform - Connecting You to Amazing Events</p>
      </div>
    </div>
  `;

  console.log(`\n================ EMAIL DISPATCH NOTIFICATION ================`);
  console.log(`[TO]: ${toEmail}`);
  console.log(`[SUBJECT]: ${subject}`);
  console.log(`[BOOKING REF]: ${booking.bookingReference}`);
  console.log(`=============================================================\n`);

  try {
    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"EventHub" <no-reply@eventhub.com>',
        to: toEmail,
        subject: subject,
        html: htmlContent,
      });
      console.log(`[Email Sent Successfully via Nodemailer to ${toEmail}]`);
    }
  } catch (err) {
    console.error(`[Email Dispatch Warning]: Could not deliver via SMTP (${err.message}). Previews logged to console.`);
  }
};

/**
 * Send Booking Rejection Email
 */
const sendBookingRejectionEmail = async (toEmail, userName, booking, event, reason = 'Event capacity adjusted or administrative decision.') => {
  const subject = `Notice regarding your booking for ${event.title} [Ref: ${booking.bookingReference}]`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">Booking Update</h1>
        <p style="margin-top: 8px; opacity: 0.9;">We are sorry to inform you</p>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <p>Dear <strong>${userName}</strong>,</p>
        <p>We regret to inform you that your booking for <strong>${event.title}</strong> (Reference: <code>${booking.bookingReference}</code>) has been <strong>cancelled / rejected</strong> by the event organizer.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 4px 0;"><strong>Reason:</strong> ${reason}</p>
          <p style="margin: 4px 0;"><strong>Event:</strong> ${event.title}</p>
          <p style="margin: 4px 0;"><strong>Refund Status:</strong> If this was a paid event ($${booking.totalAmount}), your full refund has been initiated to your original payment method.</p>
        </div>

        <p>We deeply apologize for any inconvenience caused. Please browse our platform for other upcoming events that might interest you.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">EventHub Platform Support Team</p>
      </div>
    </div>
  `;

  console.log(`\n================ EMAIL DISPATCH REJECTION NOTIFICATION ================`);
  console.log(`[TO]: ${toEmail}`);
  console.log(`[SUBJECT]: ${subject}`);
  console.log(`[BOOKING REF]: ${booking.bookingReference}`);
  console.log(`=======================================================================\n`);

  try {
    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"EventHub" <no-reply@eventhub.com>',
        to: toEmail,
        subject: subject,
        html: htmlContent,
      });
      console.log(`[Rejection Email Sent Successfully via Nodemailer to ${toEmail}]`);
    }
  } catch (err) {
    console.error(`[Email Dispatch Warning]: Could not deliver via SMTP (${err.message}). Previews logged to console.`);
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingRejectionEmail,
};
