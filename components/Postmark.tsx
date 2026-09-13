export function Postmark({
  date,
  animate,
}: {
  date: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 110"
      className={`postmark-ink w-full h-full ${animate ? "postmark-stamping" : ""}`}
      style={{ transform: animate ? undefined : "rotate(-8deg)" }}
      aria-hidden="true"
    >
      <circle cx="55" cy="55" r="40" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="55" cy="55" r="33" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path id="postmark-arc-top" d="M 22 55 A 33 33 0 0 1 88 55" fill="none" />
      <text fontSize="9" letterSpacing="2" fontFamily="var(--font-mono)" fill="currentColor">
        <textPath href="#postmark-arc-top" startOffset="50%" textAnchor="middle">
          POSTCARD
        </textPath>
      </text>
      <text
        x="55"
        y="60"
        fontSize="9.5"
        letterSpacing="0.5"
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        fill="currentColor"
      >
        {date}
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={100}
          y1={30 + i * 12}
          x2={150}
          y2={26 + i * 12}
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
