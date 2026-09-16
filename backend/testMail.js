import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const testEmail = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = 465; // Force 465 for SSL testing
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  console.log(`Connecting to ${host}:${port} with user ${user}...`);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: user && pass ? { user, pass } : undefined,
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 5000,
    socketTimeout: 5000,
    debug: true, // show debug output
    logger: true // log to console
  });

  try {
    const info = await transporter.sendMail({
      from: user,
      to: user, // send to self
      subject: "Test Email",
      text: "This is a test email to verify credentials.",
    });
    console.log("Email sent successfully: ", info.messageId);
  } catch (error) {
    console.error("Failed to send email. Error details:");
    console.error(error.message);
  }
};

testEmail();
