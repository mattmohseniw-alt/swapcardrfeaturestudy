"use client";

import Link from "next/link";
import { useCheckIn } from "./context";
import { MOCK_ATTENDEES, TYPE_COLORS } from "@/components/CheckInDemo/types";

const PERSPECTIVES = [
  {
    id: "attendee",
    title: "Attendee",
    desc: "Your personal check-in experience on mobile — select your ticket and tap to check in.",
    icon: "📱",
    accent: "#1D9E75",
    fill: "#E1F5EE",
    href: "/check-in-demo/attendee",
  },
  {
    id: "organizer",
    title: "Organizer",
    desc: "Event command center — live stats, type breakdown, attendee table and real-time feed.",
    icon: "📊",
    accent: "#028090",
    fill: "#E8F6F5",
    href: "/check-in-demo/organizer",
  },
  {
    id: "staff",
    title: "Staff",
    desc: "Onsite check-in tablet — search by name, scan badges and run bulk check-ins.",
    icon: "🖥",
    accent: "#534AB7",
    fill: "#EEEDFE",
    href: "/check-in-demo/staff",
  },
  {
    id: "swapcard-ops",
    title: "Swapcard Ops",
    desc: "Internal platform monitoring — API health, event stream and simulated platform metrics.",
    icon: "🔧",
    accent: "#BA7517",
    fill: "#FAEEDA",
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
        background:
          "radial-gradient(ellipse at 50% 30%, #1a4a46 0%, #0D3D3A 55%, #061d1b 100%)",
      }}
    >
      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-8 pt-7 pb-2 flex-shrink-0">
        <div>
          <div
            className="text-[10px] font-bold tracking-[0.22em] uppercase"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Tech Summit 2025 · Hall A · Live simulation
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live counter */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: "rgba(2,195,154,0.1)",
              border: "1px solid rgba(2,195,154,0.22)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
              style={{ backgroundColor: "#02C39A" }}
            />
            <span className="text-xs font-bold" style={{ color: "#02C39A" }}>
              {checkedCount}/{total} checked in
            </span>
          </div>
          <button
            onClick={reset}
            className="text-[11px] font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Reset ↺
          </button>
        </div>
      </header>

      {/* ── Hero text ── */}
      <div className="text-center mt-6 mb-8 px-4">
        <h1
          className="text-5xl font-black text-white mb-3"
          style={{ letterSpacing: "-0.03em" }}
        >
          One event.{" "}
          <span style={{ color: "#02C39A" }}>Four perspectives.</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          All views share the same live check-in state. Switch freely — changes
          appear everywhere instantly.
        </p>
      </div>

      {/* ── Progress bar ── */}
      <div className="mx-auto mb-8 w-full max-w-[700px] px-8">
        <div className="flex justify-between text-[11px] mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>Global progress</span>
          <span className="font-bold" style={{ color: "#02C39A" }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: "#02C39A" }}
          />
        </div>
      </div>

      {/* ── 2 × 2 perspective cards ── */}
      <div className="flex-1 flex items-center justify-center px-8 pb-10">
        <div
          className="grid grid-cols-2 gap-5 w-full"
          style={{ maxWidth: 740 }}
        >
          {PERSPECTIVES.map((p) => {
            const isCheckedIn = (id: number) => !!state.checkedIn[id];
            const typeCount = MOCK_ATTENDEES.filter(
              (a) => a.type === p.title
            ).length;
            const typeChecked = MOCK_ATTENDEES.filter(
              (a) => a.type === p.title && isCheckedIn(a.id)
            ).length;

            return (
              <Link key={p.id} href={p.href} className="group block">
                <div
                  className="rounded-2xl p-6 h-full flex flex-col transition-all duration-200 group-hover:scale-[1.02]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.055)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {/* Icon */}
                  <div className="text-3xl mb-3 select-none">{p.icon}</div>

                  {/* Title + desc */}
                  <div
                    className="text-lg font-bold text-white mb-1"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {p.title}
                  </div>
                  <div
                    className="text-xs leading-relaxed flex-1"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {p.desc}
                  </div>

                  {/* Footer: type mini-stat + CTA */}
                  <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    {typeCount > 0 ? (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: p.fill + "22", color: p.accent }}
                      >
                        {typeChecked}/{typeCount} {p.title}s
                      </span>
                    ) : (
                      <span />
                    )}
                    <div
                      className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all"
                      style={{ color: p.accent }}
                    >
                      Enter view
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Type legend strip ── */}
      <div
        className="flex items-center justify-center gap-6 py-3 px-8 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {(["VIP", "Exhibitor", "Speaker", "Attendee"] as const).map((t) => (
          <div key={t} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[t].bg }}
            />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
