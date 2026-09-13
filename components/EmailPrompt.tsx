"use client";

import { useState } from "react";

export function EmailPrompt({
  recipientName,
  defaultSenderEmail,
  defaultRecipientEmail,
  onCancel,
  onConfirm,
}: {
  recipientName: string;
  defaultSenderEmail: string;
  defaultRecipientEmail: string;
  onCancel: () => void;
  onConfirm: (senderEmail: string, recipientEmail: string) => void;
}) {
  const [senderEmail, setSenderEmail] = useState(defaultSenderEmail);
  const [recipientEmail, setRecipientEmail] = useState(defaultRecipientEmail);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/40 px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm(senderEmail.trim(), recipientEmail.trim());
        }}
        className="w-full max-w-sm rounded-2xl bg-paper shadow-2xl p-6 sm:p-7"
      >
        <h2 className="font-hand text-2xl text-ink mb-1">One more thing</h2>
        <p className="text-sm text-ink-faint mb-5">
          Where should this actually go? {recipientName ? `We'll email ${recipientName}.` : ""}
        </p>

        <label className="block mb-4">
          <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
            Your email
          </span>
          <input
            type="email"
            required
            autoFocus
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="you@example.com"
            className="block w-full bg-transparent border-b border-rule pb-1.5 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-airmail rounded-sm"
          />
        </label>

        <label className="block mb-6">
          <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">
            Their email
          </span>
          <input
            type="email"
            required
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="friend@example.com"
            className="block w-full bg-transparent border-b border-rule pb-1.5 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-airmail rounded-sm"
          />
        </label>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-sm px-4 py-2 rounded-full text-ink-faint hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-airmail"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="font-sans text-sm font-medium px-6 py-2 rounded-full bg-stamp text-white hover:brightness-105 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-airmail"
          >
            Send postcard
          </button>
        </div>
      </form>
    </div>
  );
}
