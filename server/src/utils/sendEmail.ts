import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  to: string,
  from: string,
  subject: string,
  content: string
) {
  try {
    const data = await transporter.sendMail({
      from: from || process.env.SMTP_FROM,
      to,
      subject: subject,
      html: content,
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}