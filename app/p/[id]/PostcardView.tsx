"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Postcard } from "@/components/Postcard";
import { FlipButton } from "@/components/FlipButton";
import { formatStampDate } from "@/lib/date";
import type { Postcard as PostcardData } from "@/lib/db";

export function PostcardView({ postcard }: { postcard: PostcardData }) {
  const [flipped, setFlipped] = useState(false);
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 sm:py-16">
      <h1 className="font-hand text-4xl text-ink mb-1">Postcard</h1>
      <p className="text-ink-faint text-sm mb-8">
        {flipped ? "A message from" : "A postcard from"} {postcard.sender_name}
      </p>

      <div className="w-full max-w-lg flex flex-col items-center gap-4">
        <Postcard
          flipped={flipped}
          onToggleFlip={() => setFlipped((f) => !f)}
          imageUrl={postcard.image_url}
          message={postcard.message}
          senderName={postcard.sender_name}
          recipientName={postcard.recipient_name}
          date={formatStampDate(new Date(postcard.created_at))}
        />

        <FlipButton
          label={flipped ? "See the photo side" : "Turn over to read"}
          onClick={() => setFlipped((f) => !f)}
        />

        <button
          onClick={() =>
            router.push(
              `/?to=${encodeURIComponent(postcard.sender_name)}&toEmail=${encodeURIComponent(postcard.sender_email)}`
            )
          }
          className="mt-2 font-sans text-sm font-medium px-8 py-3 rounded-full border-2 border-stamp text-stamp hover:bg-stamp hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-airmail"
        >
          Reply with a postcard
        </button>
      </div>
    </main>
  );
}
