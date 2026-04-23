"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckIn } from "../context";
import { MOCK_ATTENDEES, TYPE_COLORS, BRAND } from "@/components/CheckInDemo/types";
import ViewNav from "@/components/CheckInDemo/ViewNav";

// ─── Clock ────────────────────────────────────────────────────────────────────

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ─── Decorative QR ───────────────────────────────────────────────────────────

const QR_N = 21;
function buildQR(): boolean[] {
  const g = new Array<boolean>(QR_N * QR_N).fill(false);
  const s = (r: number, c: number, v: boolean) => { g[r * QR_N + c] = v; };
  const finder = (sr: number, sc: number) => {
    for (let dr = 0; dr < 7; dr++)
      for (let dc = 0; dc < 7; dc++)
        s(sr + dr, sc + dc,
          dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
          (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
  };
  finder(0, 0); finder(0, 14); finder(14, 0);
  for (let i = 8; i <= 12; i++) { s(6, i, i % 2 === 0); s(i, 6, i % 2 === 0); }
  for (let r = 0; r < QR_N; r++)
    for (let c = 0; c < QR_N; c++) {
      if (r <= 7 && c <= 7) continue;
      if (r <= 7 && c >= 13) continue;
      if (r >= 13 && c <= 7) continue;
      if (r === 6 || c === 6) continue;
      s(r, c, ((r * 7 + c * 13 + r * c * 3) % 5) < 3);
    }
  return g;
}
const QR_CELLS = buildQR();

function TicketQR({ dim }: { dim: number }) {
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${QR_N} ${QR_N}`} shapeRendering="crispEdges">
      {QR_CELLS.map((f, i) =>
        f ? <rect key={i} x={i % QR_N} y={Math.floor(i / QR_N)} width={1} height={1} fill={BRAND.navy} /> : null
      )}
    </svg>
  );
}

// ─── iOS-style status bar ─────────────────────────────────────────────────────

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-5 bg-white" style={{ height: 44, paddingTop: 6 }}>
      <span className="text-xs font-bold tabular-nums" style={{ color: BRAND.navy }}>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Wi-Fi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill={BRAND.navy}/>
          <path d="M4.3 7.2a4.5 4.5 0 0 1 6.4 0" stroke={BRAND.navy} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <path d="M1.5 4.5a8 8 0 0 1 12 0" stroke={BRAND.navy} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Battery */}
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
          <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke={BRAND.navy} strokeWidth="1"/>
          <path d="M19.5 4v4a2 2 0 0 0 0-4z" fill={BRAND.navy}/>
          <rect x="2" y="2" width="13" height="8" rx="1.5" fill={BRAND.navy}/>
        </svg>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AttendeeView() {
  const { state, checkIn } = useCheckIn();
  const clock = useClock();
  const [selectedId, setSelectedId] = useState(1);

  const attendee = MOCK_ATTENDEES.find((a) => a.id === selectedId)!;
  const record   = state.checkedIn[selectedId];
  const isCheckedIn = !!record;
  const colors   = TYPE_COLORS[attendee.type];

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, #2a3547 0%, ${BRAND.darkBg} 55%, ${BRAND.darkBgDeep} 100%)`,
      }}
    >
      <ViewNav active="attendee" />

      {/* Centre the phone */}
      <div className="flex-1 flex items-center justify-center py-4">
        {/* Phone frame */}
        <div
          className="relative flex-shrink-0"
          style={{
            width: 390,
            height: "min(810px, calc(100vh - 80px))",
            background: "linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 45%, #111113 100%)",
            borderRadius: 44,
            padding: 12,
            boxShadow: [
              "0 0 0 1px rgba(255,255,255,0.09)",
              "0 0 0 2px rgba(0,0,0,0.6)",
              "0 40px 80px -10px rgba(0,0,0,0.75)",
              "inset 0 1px 0 rgba(255,255,255,0.07)",
            ].join(", "),
          }}
        >
          {/* Dynamic island */}
          <div className="absolute z-20 rounded-full" style={{ width: 120, height: 34, backgroundColor: "#000", top: 20, left: "50%", transform: "translateX(-50%)" }} />
          {/* Side buttons */}
          <div className="absolute rounded-l-sm" style={{ width: 3, height: 34, top: 128, left: -3, background: "linear-gradient(180deg, #3a3a3c, #2a2a2c)" }} />
          <div className="absolute rounded-l-sm" style={{ width: 3, height: 34, top: 178, left: -3, background: "linear-gradient(180deg, #3a3a3c, #2a2a2c)" }} />
          <div className="absolute rounded-r-sm" style={{ width: 3, height: 68, top: 158, right: -3, background: "linear-gradient(180deg, #3a3a3c, #2a2a2c)" }} />

          {/* Screen */}
          <div
            className="absolute flex flex-col overflow-hidden"
            style={{ top: 12, left: 12, right: 12, bottom: 12, borderRadius: 32, backgroundColor: BRAND.pageBg }}
          >
            <StatusBar time={clock} />

            {/* App header — Swapcard brand navy */}
            <div
              className="flex-shrink-0 px-5 py-3"
              style={{ backgroundColor: BRAND.navy, borderBottom: `1px solid rgba(255,255,255,0.07)` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                  style={{ backgroundColor: BRAND.teal }}
                >
                  S
                </div>
                <div>
                  <div className="font-bold text-sm text-white" style={{ letterSpacing: "-0.01em" }}>Tech Summit 2025</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Hall A · Doors open 9:00 AM</div>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4 flex flex-col gap-4">

              {/* Attendee picker */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: BRAND.muted }}>
                  Playing as
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm font-medium bg-white appearance-none"
                  style={{ border: `1px solid ${BRAND.border}`, color: BRAND.navy, outline: "none" }}
                >
                  {MOCK_ATTENDEES.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} — {a.type}</option>
                  ))}
                </select>
              </div>

              {/* Ticket card */}
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: BRAND.cardShadow }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: BRAND.navy }}>
                  <span className="text-xs font-black tracking-[0.18em] text-white/80">SWAPCARD</span>
                  <span className="text-[10px] text-white/40">Tech Summit 2025</span>
                </div>
                <div className="flex bg-white">
                  <div className="w-2 flex-shrink-0" style={{ backgroundColor: colors.stripe }} />
                  <div className="flex items-center justify-center p-3" style={{ borderRight: `1px solid ${BRAND.border}` }}>
                    <TicketQR dim={88} />
                  </div>
                  <div className="flex-1 px-4 py-4">
                    <div className="font-black text-base leading-tight mb-0.5" style={{ color: BRAND.navy }}>
                      {attendee.name}
                    </div>
                    <div className="text-xs mb-3" style={{ color: BRAND.muted }}>{attendee.org}</div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.fill, color: colors.bg }}>
                      {attendee.type}
                    </span>
                    <div className="mt-2 text-[10px]" style={{ color: BRAND.muted }}>
                      Hall A · April 23, 2026
                    </div>
                  </div>
                </div>
              </div>

              {/* VIP fast-track banner */}
              {attendee.type === "VIP" && !isCheckedIn && (
                <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#EEEDFE", border: "1px solid #c5c1f8" }}>
                  <span className="text-lg">⭐</span>
                  <div>
                    <div className="text-xs font-bold" style={{ color: "#534AB7" }}>VIP fast-track lane</div>
                    <div className="text-[11px]" style={{ color: "#7a73d4" }}>Proceed to Desk 1 — no queue</div>
                  </div>
                </div>
              )}

              {/* Check-in CTA / Success */}
              <AnimatePresence mode="wait">
                {!isCheckedIn ? (
                  <motion.button
                    key="cta"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => checkIn(selectedId, "self")}
                    className="w-full py-4 rounded-2xl text-base font-black text-white transition-all active:scale-[0.98]"
                    style={{ backgroundColor: BRAND.teal }}
                  >
                    Tap to check in
                  </motion.button>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, type: "spring", stiffness: 280 }}
                    className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center"
                    style={{ backgroundColor: BRAND.tealFaint, border: `1px solid ${BRAND.tealLight}` }}
                  >
                    <svg viewBox="0 0 64 64" width={52} height={52}>
                      <motion.circle cx={32} cy={32} r={29} fill="#fff" stroke={BRAND.teal} strokeWidth={2.5}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: "spring" }} />
                      <motion.path d="M17 32l11 11L47 22" stroke={BRAND.teal} strokeWidth={4.5} fill="none"
                        strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.2 }} />
                    </svg>
                    <div>
                      <div className="font-bold text-base" style={{ color: BRAND.tealDark }}>
                        {attendee.type === "VIP" ? "Welcome, VIP!" : "You're checked in!"}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: BRAND.teal }}>
                        {record.time} · {record.checkedInBy === "staff" ? "Staff-assisted" : "Self-serve"}
                      </div>
                    </div>
                    <div className="text-xs font-medium" style={{ color: BRAND.teal }}>
                      🖨 Your badge is printing…
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Event info */}
              <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: BRAND.cardShadow }}>
                <div className="text-xs font-bold mb-3" style={{ color: BRAND.navy }}>Event Details</div>
                {[
                  { icon: "📅", label: "Date",    val: "April 23–24, 2026" },
                  { icon: "📍", label: "Venue",   val: "ExCeL London · Hall A" },
                  { icon: "🎤", label: "Keynote", val: "09:30 — Main Stage" },
                  { icon: "🍽", label: "Lunch",   val: "12:30 — Hall B Terrace" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-1.5" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                    <span className="text-sm w-5 text-center">{item.icon}</span>
                    <div>
                      <div className="text-[10px]" style={{ color: BRAND.muted }}>{item.label}</div>
                      <div className="text-xs font-medium" style={{ color: BRAND.navy }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge preview (post check-in) */}
              {isCheckedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ boxShadow: BRAND.cardShadow }}
                >
                  <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: BRAND.navy }}>
                    <span className="text-xs font-black tracking-[0.18em] text-white/80">YOUR BADGE</span>
                    <span className="text-[10px] text-white/40">Printing complete</span>
                  </div>
                  <div className="flex bg-white">
                    <div className="w-2 flex-shrink-0" style={{ backgroundColor: colors.stripe }} />
                    <div className="flex-1 px-4 py-4">
                      <div className="font-black text-lg" style={{ color: BRAND.navy }}>{attendee.name}</div>
                      <div className="text-xs mb-2" style={{ color: BRAND.muted }}>{attendee.org}</div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.fill, color: colors.bg }}>
                        {attendee.type}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: BRAND.tealFaint, borderTop: `1px solid ${BRAND.tealLight}` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.teal }} />
                    <span className="text-[10px] font-medium" style={{ color: BRAND.tealDark }}>Checked in · {record.time}</span>
                  </div>
                </motion.div>
              )}

              <div className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
