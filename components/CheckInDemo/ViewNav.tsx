"use client";

import Link from "next/link";
import { useCheckIn } from "@/app/check-in-demo/context";
import { MOCK_ATTENDEES, BRAND } from "./types";
import SwapcardLogo from "./SwapcardLogo";

type ViewId = "attendee" | "organizer" | "staff" | "swapcard-ops" | "badge-designer";

const VIEWS: { id: ViewId; label: string; href: string }[] = [
  { id: "attendee",      label: "Attendee",     href: "/check-in-demo/attendee" },
  { id: "organizer",     label: "Organizer",    href: "/check-in-demo/organizer" },
  { id: "staff",         label: "Staff",        href: "/check-in-demo/staff" },
  { id: "swapcard-ops",  label: "Platform Ops", href: "/check-in-demo/swapcard-ops" },
];

const VIEW_LABELS: Record<ViewId, string> = {
  attendee:         "Attendee View",
  organizer:        "Organizer Dashboard",
  staff:            "Staff Kiosk",
  "swapcard-ops":   "Platform Ops",
  "badge-designer": "Badge Designer",
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
      className="flex items-center gap-1 px-4 flex-shrink-0"
      style={{
        height: 40,
        backgroundColor: BRAND.navy,
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
      }}
    >
      {/* Swapcard wordmark */}
      <Link href="/check-in-demo" className="flex items-center mr-4 flex-shrink-0">
        <SwapcardLogo height={18} onDark />
      </Link>

      <span className="mr-3" style={{ color: "rgba(255,255,255,0.12)", fontSize: 14 }}>|</span>

      {/* View tabs */}
      {VIEWS.map((v) => {
        const isActive = v.id === active;
        return (
          <Link
            key={v.id}
            href={v.href}
            className="relative flex items-center px-3 h-full text-[12px] font-medium transition-colors"
            style={{
              color: isActive ? BRAND.teal : "rgba(255,255,255,0.4)",
            }}
          >
            {v.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full"
                style={{ backgroundColor: BRAND.teal }}
              />
            )}
          </Link>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Current view + live pill */}
      <span className="text-[11px] font-medium mr-2" style={{ color: "rgba(255,255,255,0.25)" }}>
        {VIEW_LABELS[active]}
      </span>

      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{
          backgroundColor: "rgba(3,171,129,0.12)",
          border: "1px solid rgba(3,171,129,0.2)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{
            backgroundColor: BRAND.teal,
            opacity: checkedCount > 0 ? 1 : 0.4,
          }}
        />
        <span className="text-[11px] font-bold tabular-nums" style={{ color: BRAND.teal }}>
          {checkedCount}&thinsp;/&thinsp;{total}
        </span>
      </div>
    </nav>
  );
}
