"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Postcard } from "@/components/Postcard";
import { FlipButton } from "@/components/FlipButton";
import { EmailPrompt } from "@/components/EmailPrompt";
import { formatStampDate } from "@/lib/date";

const today = () => formatStampDate(new Date());

export default function ComposePage() {
  return (
    <Suspense fallback={null}>
      <ComposeApp />
    </Suspense>
  );
}

function ComposeApp() {
  const searchParams = useSearchParams();
  const replyToName = searchParams.get("to") ?? "";
  const replyToEmail = searchParams.get("toEmail") ?? "";

  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState(replyToName);
  const [flipped, setFlipped] = useState(true);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [sending, setSending] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [result, setResult] = useState<{ viewUrl: string; recipientEmail: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImageSelect(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !senderName.trim() || !recipientName.trim()) return;
    setShowEmailPrompt(true);
  }

  async function handleConfirmSend(senderEmail: string, recipientEmail: string) {
    setShowEmailPrompt(false);
    setError(null);
    setSending(true);
    setFlipped(true);
    setStamping(true);

    const sendPromise = fetch("/api/postcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        imageUrl,
        senderName,
        recipientName,
        senderEmail,
        recipientEmail,
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send");
      return res.json();
    });

    const [outcome] = await Promise.allSettled([
      sendPromise,
      new Promise((resolve) => setTimeout(resolve, 850)),
    ]);

    setStamping(false);
    setSending(false);

    if (outcome.status === "fulfilled") {
      setResult({ viewUrl: outcome.value.viewUrl, recipientEmail });
    } else {
      setError(outcome.reason instanceof Error ? outcome.reason.message : "Failed to send");
    }
  }

  if (result) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-16">
        <div className="w-full max-w-lg">
          <Postcard
            flipped
            onToggleFlip={() => {}}
            imageUrl={imageUrl}
            message={message}
            senderName={senderName}
            recipientName={recipientName}
            date={today()}
          />
        </div>
        <div className="text-center">
          <h1 className="font-hand text-3xl text-ink mb-1">Sealed and sent</h1>
          <p className="text-ink-faint text-sm mb-4">
            {recipientName} will get an email with the link below.
          </p>
          <a
            href={result.viewUrl}
            target="_blank"
            className="text-sm text-airmail underline break-all"
          >
            {result.viewUrl}
          </a>
        </div>
        <button
          onClick={() => {
            setResult(null);
            setMessage("");
            setImageUrl(null);
            setRecipientName("");
            setSenderName("");
            setFlipped(true);
          }}
          className="font-sans text-sm px-5 py-2.5 rounded-full border border-ink-faint text-ink hover:bg-paper transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-airmail"
        >
          Write another
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 sm:py-16">
      <h1 className="font-hand text-4xl text-ink mb-1">Postcard</h1>
      {replyToName ? (
        <p className="text-ink-faint text-sm mb-8">Replying to a postcard from {replyToName}</p>
      ) : (
        <p className="text-ink-faint text-sm mb-8">Write one, send it, no signup needed</p>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col items-center gap-4">
        <Postcard
          flipped={flipped}
          onToggleFlip={() => setFlipped((f) => !f)}
          imageUrl={imageUrl}
          editableImage
          onImageSelect={handleImageSelect}
          uploading={uploading}
          message={message}
          onMessageChange={setMessage}
          editableMessage
          senderName={senderName}
          onSenderNameChange={setSenderName}
          recipientName={recipientName}
          onRecipientNameChange={setRecipientName}
          editableNames
          date={today()}
          showPostmark={sending || stamping}
          stamping={stamping}
          thumping={stamping}
        />

        <FlipButton
          label={flipped ? "See the photo side" : "Back to writing"}
          onClick={() => setFlipped((f) => !f)}
        />

        {error && <p className="text-sm text-stamp text-center">{error}</p>}

        <button
          type="submit"
          disabled={sending || uploading}
          className="mt-2 font-sans text-sm font-medium px-8 py-3 rounded-full bg-stamp text-white disabled:opacity-40 hover:brightness-105 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-airmail"
        >
          {sending ? "Sending..." : "Send postcard"}
        </button>
      </form>

      {showEmailPrompt && (
        <EmailPrompt
          recipientName={recipientName}
          defaultSenderEmail=""
          defaultRecipientEmail={replyToEmail}
          onCancel={() => setShowEmailPrompt(false)}
          onConfirm={handleConfirmSend}
        />
      )}
    </main>
  );
}
