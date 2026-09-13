export function SunflowerStamp() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="12"
            cy="5.2"
            rx="2.1"
            ry="4"
            fill={i % 2 === 0 ? "#E8A93A" : "#F2C161"}
            transform={`rotate(${i * 45} 12 12)`}
          />
        ))}
      </g>
      <circle cx="12" cy="12" r="3.4" fill="#7A4B22" />
    </svg>
  );
}
