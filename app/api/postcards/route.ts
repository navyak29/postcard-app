import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { sql } from "@/lib/db";
import { sendPostcardEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, imageUrl, senderName, recipientName, senderEmail, recipientEmail } = body as {
    message?: string;
    imageUrl?: string | null;
    senderName?: string;
    recipientName?: string;
    senderEmail?: string;
    recipientEmail?: string;
  };

  if (
    !message?.trim() ||
    !senderName?.trim() ||
    !recipientName?.trim() ||
    !senderEmail?.trim() ||
    !recipientEmail?.trim()
  ) {
    return NextResponse.json(
      { error: "message, sender/recipient names, and sender/recipient emails are required" },
      { status: 400 }
    );
  }

  const id = nanoid(12);

  try {
    await sql`
      insert into postcards (id, sender_name, recipient_name, sender_email, recipient_email, message, image_url)
      values (${id}, ${senderName.trim()}, ${recipientName.trim()}, ${senderEmail.trim().toLowerCase()}, ${recipientEmail.trim().toLowerCase()}, ${message.trim()}, ${imageUrl ?? null})
    `;
  } catch (err) {
    console.error("Failed to save postcard:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your postcard. Try again." },
      { status: 500 }
    );
  }

  const origin = req.nextUrl.origin;
  const viewUrl = `${origin}/p/${id}`;

  try {
    await sendPostcardEmail({
      to: recipientEmail.trim().toLowerCase(),
      fromName: senderName.trim(),
      viewUrl,
      message: message.trim(),
    });
  } catch (err) {
    console.error("Failed to send postcard email:", err);
  }

  return NextResponse.json({ id, viewUrl });
}
