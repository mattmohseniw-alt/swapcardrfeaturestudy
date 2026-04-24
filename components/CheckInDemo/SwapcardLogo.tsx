/**
 * Generic platform wordmark — "on" (navy/white) + "site" (teal).
 * Drop-in replacement, same props API as before.
 */

interface Props {
  height?: number;
  onDark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function SwapcardLogo({
  height = 30,
  onDark = false,
  className,
  style,
}: Props) {
  const navy = onDark ? "#ffffff" : "#262F3D";

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        fontFamily: "var(--font-work-sans, 'Work Sans', Arial, sans-serif)",
        fontWeight: 800,
        fontSize: Math.round(height * 1.15),
        letterSpacing: "-0.03em",
        lineHeight: `${height}px`,
        height,
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ color: navy }}>on</span>
      <span style={{ color: "#03ab81" }}>site</span>
    </span>
  );
}
