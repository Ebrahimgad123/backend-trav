// services/sendEmail.ts
import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  username: string;
  emailToken: string;
}

export const sendEmail = async ({ email, username, emailToken }: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.BACKEND_URL}/auth/verify-email/${emailToken}`;

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `<h3>Hello ${username}</h3><p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`,
  });
};
