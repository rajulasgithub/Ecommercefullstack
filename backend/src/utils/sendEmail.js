import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates Nodemailer Transporter using environment variables or fallback values.
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Reusable email sending utility function using Handlebars templates.
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.template - Template file name inside `src/views/` (without .hbs extension)
 * @param {Object} options.context - Variables passed to the Handlebars template
 */
export const sendEmail = async ({ to, subject, template, context = {} }) => {
  try {
    if (!to) {
      console.warn(`[sendEmail Warning]: No recipient email provided for template '${template}'.`);
      return false;
    }

    // Resolve template path
    const templatePath = path.join(__dirname, '../views', `${template}.hbs`);

    if (!fs.existsSync(templatePath)) {
      console.error(`[sendEmail Error]: Template file not found at path '${templatePath}'`);
      return false;
    }

    // Read and compile Handlebars template
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);

    // Merge context with default dynamic variables
    const fullContext = {
      year: new Date().getFullYear(),
      ...context,
    };

    const html = compiledTemplate(fullContext);

    const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || '"TrendLife Store" <no-reply@trendlife.com>';

    const transporter = createTransporter();

    const mailOptions = {
      from: fromAddress,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[sendEmail Success]: Email '${subject}' successfully sent to ${to} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[sendEmail Error]: Failed to send email '${subject}' to ${to}:`, error.message);
    return false;
  }
};

export default sendEmail;
