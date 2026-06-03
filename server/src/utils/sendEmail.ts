import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(
  to: string,
  from: string,
  subject: string,
  content: string
) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject: subject,
      html: content,
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}