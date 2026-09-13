import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPostcardEmail({
  to,
  fromEmail,
  viewUrl,
  message,
}: {
  to: string;
  fromEmail: string;
  viewUrl: string;
  message: string;
}) {
  const preview = message.length > 120 ? message.slice(0, 120) + "…" : message;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "postcards@resend.dev",
    to,
    subject: `${fromEmail} sent you a postcard`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>${fromEmail} sent you a postcard:</p>
        <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #555;">${preview}</blockquote>
        <p><a href="${viewUrl}" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">Open your postcard</a></p>
        <p style="color:#999;font-size:12px;">No account needed — the link works for anyone.</p>
      </div>
    `,
  });
}
