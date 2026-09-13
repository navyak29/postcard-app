"use client";

import { useState } from "react";

export default function ComposePage() {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ viewUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/postcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, imageUrl, senderEmail, recipientEmail }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-xl font-semibold mb-2">Postcard sent</h1>
          <p className="text-neutral-600 mb-6">
            {recipientEmail} will get an email with the link below.
          </p>
          <a
            href={result.viewUrl}
            target="_blank"
            className="block break-all text-sm text-blue-600 underline mb-6"
          >
            {result.viewUrl}
          </a>
          <button
            onClick={() => {
              setResult(null);
              setMessage("");
              setImageUrl(null);
              setRecipientEmail("");
            }}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm"
          >
            Send another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 pt-10">
        <div>
          <h1 className="text-2xl font-semibold mb-6">Send a postcard</h1>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-neutral-300 p-3 text-sm"
                placeholder="Wish you were here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Background image (optional)
              </label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {uploading && (
                <p className="text-xs text-neutral-400 mt-1">Uploading...</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your email</label>
              <input
                required
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient&apos;s email
              </label>
              <input
                required
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-sm"
                placeholder="friend@example.com"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={sending || uploading}
              className="w-full py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send postcard"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Preview</h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="w-full h-56 object-cover" />
            )}
            <div className="p-6">
              <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">
                From {senderEmail || "you"}
              </p>
              <p className="whitespace-pre-wrap text-neutral-800 min-h-[3em]">
                {message || "Your message will appear here..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
