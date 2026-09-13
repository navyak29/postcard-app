import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
}

export const sql = neon(process.env.DATABASE_URL);

export type Postcard = {
  id: string;
  sender_email: string;
  recipient_email: string;
  message: string;
  image_url: string | null;
  created_at: string;
};
