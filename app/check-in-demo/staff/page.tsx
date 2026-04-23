"use client";

import { useState, useEffect } from "react";
import { useCheckIn } from "../context";
import { MOCK_ATTENDEES, TYPE_COLORS, BRAND, AttendeeType } from "@/components/CheckInDemo/types";
import ViewNav from "@/components/CheckInDemo/ViewNav";
import KioskPanel from "@/components/CheckInDemo/KioskPanel";
import SwapcardPicto from "@/components/CheckInDemo/SwapcardPicto";

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(remaining / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return `00:${m}:${s}`;
}

// ─── Search + manual check-in panel ──────────────────────────────────────────

function SearchPanel() {
  const { state, checkIn } = useCheckIn();
  const [query, setQuery] = useState("");

  const filtered = MOCK_ATTENDEES.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.org.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ width: "40%", borderRight: `1px solid ${BRAND.border}` }}>
      {/* Panel header */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ backgroundColor: BRAND.navy }}
      >
        <div
          className="text-[10px] font-black tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Check-in Desk 2
        </div>
        <div className="text-xs font-semibold text-white mt-0.5">Staff: Jordan</div>
      </div>

      {/* Search */}
      <div className="flex-shrink-0 px-3 py-2.5" style={{ backgroundColor: "white", borderBottom: `1px solid ${BRAND.border}` }}>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke={BRAND.muted} strokeWidth="1.4"/>
            <path d="M9 9l2.5 2.5" stroke={BRAND.muted} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search attendees…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: BRAND.pageBg,
              border: `1px solid ${BRAND.border}`,
              color: BRAND.navy,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar" style={{ backgroundColor: "white" }}>
        {filtered.map((a) => {
          const checked = !!state.checkedIn[a.id];
          const colors  = TYPE_COLORS[a.type];
          return (
            <div
              key={a.id}
              className="flex items-center gap-2.5 px-3 py-2.5"
              style={{
                borderBottom: `1px solid ${BRAND.border}`,
                opacity: checked ? 0.45 : 1,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: colors.bg }}
              >
                {a.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: BRAND.navy }}>{a.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: colors.fill, color: colors.bg }}
                  >
                    {a.type}
                  </span>
                  {checked && (
                    <span className="text-[9px] font-semibold" style={{ color: BRAND.teal }}>
                      ✓ {state.checkedIn[a.id].time}
                    </span>
                  )}
                </div>
              </div>
              {checked ? (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: BRAND.tealLight }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke={BRAND.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <button
                  onClick={() => checkIn(a.id, "staff")}
                  className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 hover:opacity-85"
                  style={{ backgroundColor: BRAND.teal, color: "#fff", cursor: "pointer" }}
                >
                  Check in
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffView() {
  const { state, checkInBatch } = useCheckIn();
  const countdown = useCountdown(10 * 60);

  const total        = MOCK_ATTENDEES.length;
  const checkedCount = Object.keys(state.checkedIn).length;
  const remaining    = total - checkedCount;

  const avgTime = (() => {
    if (state.log.length < 2) return "—";
    const diffs: number[] = [];
    for (let i = 1; i < state.log.length; i++)
      diffs.push(state.log[i - 1].timestamp - state.log[i].timestamp);
    return `${Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length / 1000)}s`;
  })();

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #2a3547 0%, ${BRAND.darkBg} 55%, ${BRAND.darkBgDeep} 100%)`,
      }}
    >
      <ViewNav active="staff" />

      <div className="flex-1 flex items-center justify-center px-6 py-4 overflow-auto hide-scrollbar">
        <div className="flex items-start gap-5 flex-shrink-0">

          {/* ── Tablet frame ── */}
          <div
            className="relative flex-shrink-0"
            style={{
              width: 980,
              height: 640,
              background: "linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 45%, #111113 100%)",
              borderRadius: 24,
              padding: 14,
              boxShadow: [
                "0 0 0 1px rgba(255,255,255,0.09)",
                "0 0 0 2.5px rgba(0,0,0,0.6)",
                "0 40px 80px -10px rgba(0,0,0,0.75)",
                "inset 0 1px 0 rgba(255,255,255,0.07)",
              ].join(", "),
            }}
          >
            {/* Front camera */}
            <div className="absolute z-20 rounded-full" style={{ width: 10, height: 10, backgroundColor: "#111", top: 20, left: "50%", transform: "translateX(-50%)" }} />
            {/* Home button */}
            <div
              className="absolute z-20 rounded-full"
              style={{
                width: 36, height: 36,
                background: "linear-gradient(135deg, #3a3a3c, #2a2a2c)",
                border: "1px solid rgba(255,255,255,0.06)",
                right: -18, top: "50%", transform: "translateY(-50%)",
              }}
            />

            {/* Screen */}
            <div
              className="absolute flex flex-col overflow-hidden"
              style={{
                top: 14, left: 14, right: 14, bottom: 14,
                borderRadius: 14,
                backgroundColor: BRAND.pageBg,
              }}
            >
              {/* Screen header — Swapcard brand navy */}
              <div
                className="flex-shrink-0 flex items-center justify-between px-4 py-2.5"
                style={{ backgroundColor: BRAND.navy }}
              >
                <div className="flex items-center gap-2">
                  <SwapcardPicto size={20} />
                  <span className="text-xs font-black tracking-[0.15em] text-white/70">TECH SUMMIT 2025</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: BRAND.teal }} />
                  <span className="text-[11px] font-bold" style={{ color: BRAND.teal }}>
                    {checkedCount}/{total} checked in
                  </span>
                </div>
                <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                  ⏱ Session in {countdown}
                </div>
              </div>

              {/* Content split */}
              <div className="flex flex-1 overflow-hidden">
                <SearchPanel />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <KioskPanel kioskState={state.kioskState} />
                </div>
              </div>

              {/* Bottom strip */}
              <div
                className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5"
                style={{ backgroundColor: BRAND.navy, borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Bulk check-in:
                </span>

                {(["Exhibitor", "Speaker"] as AttendeeType[]).map((type) => {
                  const rem    = MOCK_ATTENDEES.filter((a) => a.type === type && !state.checkedIn[a.id]).length;
                  const colors = TYPE_COLORS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => checkInBatch((a) => a.type === type, "staff")}
                      disabled={rem === 0}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                      style={{
                        backgroundColor: rem > 0 ? colors.fill : "rgba(255,255,255,0.07)",
                        color: rem > 0 ? colors.bg : "rgba(255,255,255,0.2)",
                        cursor: rem > 0 ? "pointer" : "default",
                        border: `1px solid ${rem > 0 ? colors.bg + "44" : "transparent"}`,
                      }}
                    >
                      All {type}s {rem > 0 ? `(${rem})` : "✓"}
                    </button>
                  );
                })}

                <div className="ml-auto flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke={BRAND.teal} strokeWidth="1.2"/>
                    <path d="M6 3.5v2.8l1.8 1.2" stroke={BRAND.teal} strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: BRAND.teal }}>{countdown}</span>
                  <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>until next session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Queue stats card */}
          <div
            className="flex-shrink-0 rounded-2xl p-5 flex flex-col gap-4"
            style={{
              width: 176,
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)",
              marginTop: 40,
            }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              Queue Stats
            </div>
            {[
              { label: "In queue",   value: remaining,    color: BRAND.teal },
              { label: "Checked in", value: checkedCount, color: "#03ab81" },
              { label: "Avg time",   value: avgTime,      color: "#BA7517" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[10px] mb-0.5 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
