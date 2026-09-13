"use client";

import { useRef } from "react";
import { Postmark } from "./Postmark";
import { SunflowerStamp } from "./StampIcon";

type PostcardProps = {
  flipped: boolean;
  onToggleFlip: () => void;
  imageUrl: string | null;
  editableImage?: boolean;
  onImageSelect?: (file: File) => void;
  uploading?: boolean;
  message: string;
  onMessageChange?: (value: string) => void;
  editableMessage?: boolean;
  senderName: string;
  onSenderNameChange?: (value: string) => void;
  recipientName: string;
  onRecipientNameChange?: (value: string) => void;
  editableNames?: boolean;
  date: string;
  stamping?: boolean;
  thumping?: boolean;
  showPostmark?: boolean;
};

export function Postcard({
  flipped,
  onToggleFlip,
  imageUrl,
  editableImage,
  onImageSelect,
  uploading,
  message,
  onMessageChange,
  editableMessage,
  senderName,
  onSenderNameChange,
  recipientName,
  onRecipientNameChange,
  editableNames,
  date,
  stamping,
  thumping,
  showPostmark = true,
}: PostcardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFrontClick() {
    if (editableImage) {
      fileInputRef.current?.click();
    } else if (!editableMessage) {
      onToggleFlip();
    }
  }

  return (
    <div className="airmail-frame w-full">
      <div className={`postcard-scene ${thumping ? "card-thumping" : ""}`}>
        <div className={`postcard ${flipped ? "is-flipped" : ""}`}>
          {/* Front: photo side */}
          <div
            className="postcard-face postcard-front"
            onClick={handleFrontClick}
            role={editableImage || !editableMessage ? "button" : undefined}
            tabIndex={editableImage || !editableMessage ? 0 : undefined}
          >
            {imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                {editableImage && (
                  <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 font-sans text-xs font-medium bg-white/90 text-ink px-2.5 py-1 rounded-full shadow-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    {uploading ? "Uploading..." : "Change photo"}
                  </span>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-ink-faint">
                {editableImage ? (
                  <>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <circle cx="8.5" cy="10" r="1.5" />
                      <path d="M21 15l-5-5-4 4-2-2-5 5" />
                    </svg>
                    <span className="font-sans text-sm">
                      {uploading ? "Uploading..." : "Tap to add a photo"}
                    </span>
                  </>
                ) : (
                  <span className="font-hand text-3xl">no photo attached</span>
                )}
              </div>
            )}
            {editableImage && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onImageSelect) onImageSelect(file);
                }}
              />
            )}
            {!editableMessage && (
              <span className="absolute bottom-2 right-3 font-sans text-xs tracking-wide text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                turn over &rarr;
              </span>
            )}
          </div>

          {/* Back: message + address side */}
          <div className="postcard-face postcard-back">
            <div className="flex-[1.4] relative border-r border-dashed border-rule">
              {editableMessage ? (
                <textarea
                  value={message}
                  onChange={(e) => onMessageChange?.(e.target.value)}
                  placeholder="Wish you were here..."
                  className="message-pane ruled-lines message-text w-full h-full resize-none overflow-y-auto bg-transparent font-hand text-ink placeholder:text-ink-faint focus:outline-none"
                  style={{ backgroundAttachment: "local" }}
                />
              ) : (
                <div
                  className="message-pane ruled-lines w-full h-full overflow-y-auto"
                  style={{ backgroundAttachment: "local" }}
                >
                  <p className="message-text font-hand text-ink whitespace-pre-wrap">
                    {message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between p-2.5 sm:p-5 min-w-0">
              <div className="relative h-14 sm:h-24 flex justify-end">
                <div className="stamp-box w-10 h-12 sm:w-16 sm:h-20 bg-paper flex flex-col items-center justify-center gap-0.5 sm:gap-1 rotate-[-4deg]">
                  <div className="w-4 h-4 sm:w-6 sm:h-6">
                    <SunflowerStamp />
                  </div>
                  <span className="hidden sm:inline font-mono text-[7px] tracking-widest text-ink-faint">POSTAGE</span>
                </div>
                {showPostmark && (
                  <div className="absolute right-4 sm:right-8 top-4 sm:top-8 w-12 h-9 sm:w-20 sm:h-14">
                    <Postmark date={date} animate={stamping} />
                  </div>
                )}
              </div>

              <div className="space-y-1 sm:space-y-3">
                <AddressLine
                  label="From"
                  value={senderName}
                  onChange={onSenderNameChange}
                  editable={editableNames}
                  placeholder="Your name"
                />
                <AddressLine
                  label="To"
                  value={recipientName}
                  onChange={onRecipientNameChange}
                  editable={editableNames}
                  placeholder="Their name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddressLine({
  label,
  value,
  onChange,
  editable,
  placeholder,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  placeholder: string;
}) {
  return (
    <div className="border-b border-rule pb-0.5 sm:pb-1 min-w-0">
      <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-ink-faint uppercase">
        {label}
      </span>
      {editable ? (
        <input
          type="text"
          required
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="block w-full min-w-0 bg-transparent font-hand text-base sm:text-xl text-ink placeholder:text-ink-faint placeholder:font-sans placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-airmail rounded-sm"
        />
      ) : (
        <span className="block font-hand text-base sm:text-xl text-ink truncate">{value}</span>
      )}
    </div>
  );
}
