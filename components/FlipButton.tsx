export function FlipButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex items-center gap-1.5 font-sans text-sm text-ink-faint hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-airmail rounded px-2 py-1"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4v5h5M20 20v-5h-5" />
        <path d="M4.5 15a8 8 0 0 0 14.4 3.5M19.5 9A8 8 0 0 0 5.1 5.5" />
      </svg>
      {label}
    </button>
  );
}
