"use client";

import Link from "next/link";
import { useCheckIn } from "@/app/check-in-demo/context";
import { MOCK_ATTENDEES } from "./types";

type ViewId = "attendee" | "organizer" | "staff" | "swapcard-ops";

const VIEWS: { id: ViewId; label: string; href: string }[] = [
  { id: "attendee",     label: "👤 Attendee",    href: "/check-in-demo/attendee" },
  { id: "organizer",   label: "📊 Organizer",    href: "/check-in-demo/organizer" },
  { id: "staff",       label: "🖥 Staff",         href: "/check-in-demo/staff" },
  { id: "swapcard-ops",label: "🔧 Swapcard Ops", href: "/check-in-demo/swapcard-ops" },
];

const VIEW_LABELS: Record<ViewId, string> = {
  attendee:      "Attendee View",
  organizer:     "Organizer View",
  staff:         "Staff View",
  "swapcard-ops":"Swapcard Ops",
};

interface Props {
  active: ViewId;
}

export default function ViewNav({ active }: Props) {
  const { state } = useCheckIn();
  const checkedCount = Object.keys(state.checkedIn).length;
  const total = MOCK_ATTENDEES.length;

  return (
    <nav
      className="flex items-center gap-3 px-5 flex-shrink-0"
      style={{
        height: 36,
        backgroundColor: "#061d1b",
        borderBottom: "1px solid rgba(2,195,154,0.1)",
      }}
    >
      {/* Back to hub */}
      <Link
        href="/check-in-demo"
        className="flex items-center gap-1.5 text-[11px] font-medium"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 9.5L4 6l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Hub
      </Link>

      <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>

      {/* View links */}
      {VIEWS.map((v) => (
        <Link
          key={v.id}
          href={v.href}
          className="text-[11px] font-semibold"
          style={{ color: v.id === active ? "#02C39A" : "rgba(255,255,255,0.3)" }}
        >
          {v.label}
        </Link>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Current view label + live counter */}
      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
        {VIEW_LABELS[active]}
      </span>
      <span style={{ color: "rgba(255,255,255,0.08)" }}>·</span>
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{
            backgroundColor: "#02C39A",
            opacity: checkedCount > 0 ? 1 : 0.35,
          }}
        />
        <span className="text-[11px] font-bold tabular-nums" style={{ color: "#02C39A" }}>
          {checkedCount}&thinsp;/&thinsp;{total}
        </span>
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          checked in
        </span>
      </div>
    </nav>
  );
}
