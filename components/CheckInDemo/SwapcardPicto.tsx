/**
 * Generic app icon — rounded square with dark-green gradient bg + white checkmark.
 * Drop-in replacement, same props API as before.
 */

import { useId } from "react";

interface Props {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SwapcardPicto({ size = 32, className, style }: Props) {
  const uid = useId();
  const gid = `picto-grad-${uid.replace(/:/g, "_")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Onsite"
      role="img"
    >
      {/* Background rounded-square */}
      <rect width="60" height="60" rx="10" fill={`url(#${gid})`} />

      {/* Outer ring (subtle) */}
      <circle cx="30" cy="30" r="15" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" />

      {/* Checkmark */}
      <path
        d="M21 30l7 7 11-14"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <radialGradient
          id={gid}
          cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(30 30) rotate(90) scale(30)"
        >
          <stop offset="0.45" stopColor="#014744" />
          <stop offset="1" stopColor="#014744" stopOpacity="0.4" />
        </radialGradient>
      </defs>
    </svg>
  );
}
