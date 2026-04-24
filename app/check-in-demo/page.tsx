"use client";

import Link from "next/link";
import { useCheckIn } from "./context";
import { MOCK_ATTENDEES, TYPE_COLORS, BRAND } from "@/components/CheckInDemo/types";
import SwapcardLogo from "@/components/CheckInDemo/SwapcardLogo";

const PERSPECTIVES = [
  {
    id: "attendee",
    title: "Attendee",
    desc: "Your personal mobile check-in — select your ticket and tap to check in.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="7" y="2" width="14" height="24" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="14" cy="20" r="1.5" fill="currentColor"/>
        <rect x="11" y="5" width="6" height="1.5" rx="0.75" fill="currentColor"/>
      </svg>
    ),
    accent: BRAND.teal,
    href: "/check-in-demo/attendee",
  },
  {
    id: "organizer",
    title: "Organizer",
    desc: "Event command centre — live stats, type breakdown, attendee table and real-time feed.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="2" width="24" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M9 26h10M14 20v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M7 13l3-4 3 3 3-5 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: BRAND.teal,
    href: "/check-in-demo/organizer",
  },
  {
    id: "staff",
    title: "Staff",
    desc: "Onsite check-in tablet — search by name, scan badges and run bulk check-ins.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="4" width="22" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M10 24h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 21v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: BRAND.teal,
    href: "/check-in-demo/staff",
  },
  {
    id: "swapcard-ops",
    title: "Platform Ops",
    desc: "Internal platform monitoring — API health, event stream and platform metrics.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M14 8v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="14" r="2" fill="currentColor"/>
      </svg>
    ),
    accent: BRAND.teal,
    href: "/check-in-demo/swapcard-ops",
  },
] as const;

export default function CheckInHubPage() {
  const { state, reset } = useCheckIn();
  const checkedCount = Object.keys(state.checkedIn).length;
  const total = MOCK_ATTENDEES.length;
  const pct = Math.round((checkedCount / total) * 100);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `radial-gradient(ellipse at 50% 25%, #2a3547 0%, ${BRAND.darkBg} 55%, ${BRAND.darkBgDeep} 100%)`,
      }}
    >
      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-8 pt-6 pb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <SwapcardLogo height={22} onDark />
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(3,171,129,0.15)", color: BRAND.teal }}>
            Demo
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: "rgba(3,171,129,0.1)",
              border: "1px solid rgba(3,171,129,0.2)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: BRAND.teal }} />
            <span className="text-xs font-bold tabular-nums" style={{ color: BRAND.teal }}>
              {checkedCount}/{total} checked in
            </span>
          </div>
          <button
            onClick={reset}
            className="text-[11px] font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Reset ↺
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="text-center mt-8 mb-6 px-4">
        <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: `rgba(3,171,129,0.6)` }}>
          Tech Summit 2025 · Hall A · Live simulation
        </div>
        <h1 className="text-5xl font-black text-white mb-3" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          One event.{" "}
          <span style={{ color: BRAND.teal }}>Four perspectives.</span>
        </h1>
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
          All views share the same live check-in state. Switch freely — changes appear everywhere instantly.
        </p>
      </div>

      {/* ── Progress bar ── */}
      <div className="mx-auto mb-8 w-full max-w-[680px] px-8">
        <div className="flex justify-between text-[11px] mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
          <span>Global progress</span>
          <span className="font-bold tabular-nums" style={{ color: BRAND.teal }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: BRAND.teal }}
          />
        </div>
      </div>

      {/* ── 2×2 perspective cards ── */}
      <div className="flex-1 flex items-center justify-center px-8 pb-10">
        <div className="grid grid-cols-2 gap-4 w-full" style={{ maxWidth: 720 }}>
          {PERSPECTIVES.map((p) => (
            <Link key={p.id} href={p.href} className="group block">
              <div
                className="rounded-2xl p-6 h-full flex flex-col transition-all duration-200 group-hover:translate-y-[-2px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.055)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ backgroundColor: "rgba(3,171,129,0.12)", color: BRAND.teal }}
                >
                  {p.icon}
                </div>

                {/* Title + desc */}
                <div className="text-base font-bold text-white mb-1.5" style={{ letterSpacing: "-0.01em" }}>
                  {p.title}
                </div>
                <div className="text-xs leading-relaxed flex-1 font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
                  {p.desc}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between mt-5 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex gap-1">
                    {(["VIP", "Exhibitor", "Speaker", "Attendee"] as const).map((t) => {
                      const checked = MOCK_ATTENDEES.filter((a) => a.type === t && state.checkedIn[a.id]).length;
                      const total   = MOCK_ATTENDEES.filter((a) => a.type === t).length;
                      if (!total) return null;
                      return (
                        <span
                          key={t}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${TYPE_COLORS[t].bg}22`, color: TYPE_COLORS[t].bg }}
                        >
                          {checked}/{total}
                        </span>
                      );
                    })}
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all"
                    style={{ color: BRAND.teal }}
                  >
                    Enter view
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Type legend ── */}
      <div
        className="flex items-center justify-center gap-6 py-3 px-8 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {(["VIP", "Exhibitor", "Speaker", "Attendee"] as const).map((t) => (
          <div key={t} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[t].bg }} />
            <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
