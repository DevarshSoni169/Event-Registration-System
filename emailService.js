const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // If email is not configured, return a mock transporter
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email not configured. Using console output only.');
    return {
      sendMail: (mailOptions) => {
        console.log('📧 EMAIL WOULD BE SENT:');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Text:', mailOptions.text);
        console.log('---');
        return Promise.resolve({ messageId: 'mock-message-id' });
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  registration: (studentName, eventTitle, eventDate, eventTime, eventLocation) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Registration Confirmed!</h1>
        </div>
        <div class="content">
            <h2>Hello ${studentName},</h2>
            <p>Your registration for <strong>${eventTitle}</strong> has been successfully confirmed!</p>
            
            <div class="event-details">
                <h3>Event Details:</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
                <p><strong>⏰ Time:</strong> ${eventTime}</p>
                <p><strong>📍 Location:</strong> ${eventLocation}</p>
            </div>
            
            <p>We're excited to have you join us! Please arrive 15 minutes early.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <div class="footer">
                <p>Best regards,<br>Event Registration Team</p>
            </div>
        </div>
    </div>
</body>
</html>
  `,

  waitlist: (studentName, eventTitle, position) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .position { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 18px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏳ Waitlist Confirmation</h1>
        </div>
        <div class="content">
            <h2>Hello ${studentName},</h2>
            <p>You have been added to the waiting list for <strong>${eventTitle}</strong>.</p>
            
            <div class="position">
                Your position in queue: #${position}
            </div>
            
            <p>We'll notify you immediately if a spot becomes available. You'll be automatically registered if you reach the top of the list.</p>
            <p>Keep an eye on your email for updates!</p>
            
            <div class="footer">
                <p>Best regards,<br>Event Registration Team</p>
            </div>
        </div>
    </div>
</body>
</html>
  `,

  promotion: (studentName, eventTitle, eventDate, eventTime, eventLocation) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .celebrate { font-size: 24px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎊 You're In!</h1>
        </div>
        <div class="content">
            <div class="celebrate">🎉 Congratulations! 🎉</div>
            
            <h2>Hello ${studentName},</h2>
            <p>Great news! A spot has opened up and you've been promoted from the waiting list!</p>
            <p>You are now officially registered for <strong>${eventTitle}</strong>.</p>
            
            <div class="event-details">
                <h3>Event Details:</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
                <p><strong>⏰ Time:</strong> ${eventTime}</p>
                <p><strong>📍 Location:</strong> ${eventLocation}</p>
            </div>
            
            <p>We look forward to seeing you at the event!</p>
            
            <div class="footer">
                <p>Best regards,<br>Event Registration Team</p>
            </div>
        </div>
    </div>
</body>
</html>
  `,

  cancellation: (studentName, eventTitle) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Registration Cancelled</h1>
        </div>
        <div class="content">
            <h2>Hello ${studentName},</h2>
            <p>Your registration for <strong>${eventTitle}</strong> has been cancelled as requested.</p>
            
            <p>We're sorry to see you go! If this was a mistake or you'd like to re-register, please visit our registration system.</p>
            
            <p>We hope to see you at future events!</p>
            
            <div class="footer">
                <p>Best regards,<br>Event Registration Team</p>
            </div>
        </div>
    </div>
</body>
</html>
  `
};

// Send email function
const sendEmail = async (to, subject, templateName, data) => {
  try {
    const transporter = createTransporter();
    
    let html = '';
    let text = '';

    switch (templateName) {
      case 'registration':
        html = emailTemplates.registration(
          data.studentName,
          data.eventTitle,
          data.eventDate,
          data.eventTime,
          data.eventLocation
        );
        text = `Hello ${data.studentName},\n\nYour registration for "${data.eventTitle}" has been confirmed.\n\nDate: ${new Date(data.eventDate).toLocaleDateString()}\nTime: ${data.eventTime}\nLocation: ${data.eventLocation}\n\nThank you for registering!`;
        break;

      case 'waitlist':
        html = emailTemplates.waitlist(
          data.studentName,
          data.eventTitle,
          data.position
        );
        text = `Hello ${data.studentName},\n\nYou have been added to the waiting list for "${data.eventTitle}".\n\nYour position in queue: #${data.position}\n\nWe will notify you if a spot becomes available.`;
        break;

      case 'promotion':
        html = emailTemplates.promotion(
          data.studentName,
          data.eventTitle,
          data.eventDate,
          data.eventTime,
          data.eventLocation
        );
        text = `Hello ${data.studentName},\n\nCongratulations! You have been promoted from the waiting list and are now registered for "${data.eventTitle}".\n\nDate: ${new Date(data.eventDate).toLocaleDateString()}\nTime: ${data.eventTime}\nLocation: ${data.eventLocation}\n\nWe look forward to seeing you!`;
        break;

      case 'cancellation':
        html = emailTemplates.cancellation(data.studentName, data.eventTitle);
        text = `Hello ${data.studentName},\n\nYour registration for "${data.eventTitle}" has been cancelled.\n\nWe hope to see you at future events!`;
        break;

      default:
        throw new Error('Unknown email template');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@events.com',
      to: to,
      subject: subject,
      text: text,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully to:', to);
    return true;

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Don't throw error to prevent registration from failing due to email issues
    return false;
  }
};

module.exports = { sendEmail };