export default function SnowballIllustration() {
  return (
    <svg viewBox="0 0 420 280" className="w-full max-w-md" aria-label="Snowball rolling and growing">
      <defs>
        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcf1e3" />
          <stop offset="100%" stopColor="#bce3ca" />
        </linearGradient>
        <radialGradient id="ball" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cfe7ff" />
        </radialGradient>
      </defs>
      <path d="M0 220 Q 120 120 260 180 T 420 160 L 420 280 L 0 280 Z" fill="url(#hill)" />
      {/* small ball */}
      <circle cx="70" cy="200" r="14" fill="url(#ball)" stroke="#8ccea7" strokeWidth="2" />
      {/* medium */}
      <circle cx="170" cy="190" r="24" fill="url(#ball)" stroke="#56b07f" strokeWidth="2" />
      {/* big snowball */}
      <circle cx="320" cy="160" r="50" fill="url(#ball)" stroke="#319562" strokeWidth="3" />
      {/* face */}
      <circle cx="310" cy="150" r="4" fill="#1c6041" />
      <circle cx="335" cy="150" r="4" fill="#1c6041" />
      <path d="M305 170 Q 322 185 340 170" stroke="#1c6041" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* trail dots */}
      <g fill="#ffffff" opacity="0.8">
        <circle cx="95" cy="210" r="2" />
        <circle cx="120" cy="208" r="2" />
        <circle cx="200" cy="200" r="2" />
        <circle cx="230" cy="195" r="2" />
      </g>
      {/* label */}
      <text x="210" y="40" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="18" fontWeight="700" fill="#1c6041">
        Your snowball grows!
      </text>
    </svg>
  );
}
