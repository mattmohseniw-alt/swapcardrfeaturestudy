"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckIn } from "../context";
import { MOCK_ATTENDEES, TYPE_COLORS, BRAND } from "@/components/CheckInDemo/types";
import ViewNav from "@/components/CheckInDemo/ViewNav";
import SwapcardPicto from "@/components/CheckInDemo/SwapcardPicto";
import SwapcardLogo from "@/components/CheckInDemo/SwapcardLogo";

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

// ─── QR ───────────────────────────────────────────────────────────────────────
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
    <svg width={dim} height={dim} viewBox={`0 0 ${QR_N} ${QR_N}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect width={QR_N} height={QR_N} fill="white" />
      {QR_CELLS.map((f, i) =>
        f ? <rect key={i} x={i % QR_N} y={Math.floor(i / QR_N)} width={1} height={1} fill={BRAND.navy} /> : null
      )}
    </svg>
  );
}

// ─── Schedule data ────────────────────────────────────────────────────────────
const SCHEDULE = [
  { time: "09:00", title: "Registration & Welcome Coffee", room: "Main Foyer" },
  { time: "09:30", title: "Opening Keynote: The Future of Events", room: "Main Stage" },
  { time: "11:00", title: "Product Innovation Showcase", room: "Hall B" },
  { time: "12:30", title: "Networking Lunch", room: "Hall B Terrace" },
  { time: "14:00", title: "Panel: Technology & Sustainability", room: "Theatre 3" },
  { time: "15:30", title: "Breakout Sessions", room: "Various Rooms" },
  { time: "16:00", title: "Innovation Lab Open Hours", room: "Innovation Zone" },
  { time: "16:45", title: "Awards Ceremony", room: "Main Stage" },
  { time: "18:00", title: "Evening Reception", room: "Rooftop Terrace" },
];

// ─── StatusBar ────────────────────────────────────────────────────────────────
function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-5 bg-white" style={{ height: 44, paddingTop: 6 }}>
      <span className="text-xs font-bold tabular-nums" style={{ color: BRAND.navy }}>{time}</span>
      <div className="flex items-center gap-1.5">
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill={BRAND.navy} />
          <path d="M4.3 7.2a4.5 4.5 0 0 1 6.4 0" stroke={BRAND.navy} strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M1.5 4.5a8 8 0 0 1 12 0" stroke={BRAND.navy} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
          <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke={BRAND.navy} strokeWidth="1" />
          <path d="M19.5 4v4a2 2 0 0 0 0-4z" fill={BRAND.navy} />
          <rect x="2" y="2" width="13" height="8" rx="1.5" fill={BRAND.navy} />
        </svg>
      </div>
    </div>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
type Screen = "home" | "schedule" | "network";

interface BottomNavProps {
  active: Screen;
  onNav: (s: Screen) => void;
  onTicket: () => void;
  isCheckedIn: boolean;
}

interface Tab {
  id: Screen | "ticket";
  label: string;
  icon: ReactNode;
}

function BottomNav({ active, onNav, onTicket, isCheckedIn }: BottomNavProps) {
  const tabs: Tab[] = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M7 18v-5h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "schedule",
      label: "Agenda",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2.5" y="4" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6.5 2v4M13.5 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2.5 9h15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "network",
      label: "Network",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "ticket",
      label: "My Ticket",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 5v2a2 2 0 0 0 0 6v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 9h5M6 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="flex-shrink-0 flex items-stretch bg-white"
      style={{ height: 56, borderTop: `1px solid ${BRAND.border}` }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id !== "ticket" && active === tab.id;
        const isTicket = tab.id === "ticket";
        return (
          <button
            key={tab.id}
            onClick={() => (isTicket ? onTicket() : onNav(tab.id as Screen))}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
            style={{ color: isActive || isTicket ? BRAND.teal : BRAND.muted }}
          >
            {isCheckedIn && isTicket && (
              <span
                className="absolute top-2 right-[calc(50%-10px)] w-2 h-2 rounded-full border-2 border-white"
                style={{ backgroundColor: BRAND.teal }}
              />
            )}
            {tab.icon}
            <span className="text-[9px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
type Attendee = (typeof MOCK_ATTENDEES)[number];
type Colors   = (typeof TYPE_COLORS)[keyof typeof TYPE_COLORS];

interface HomeScreenProps {
  attendee:     Attendee;
  colors:       Colors;
  selectedId:   number;
  onSelectId:   (id: number) => void;
  onTicketOpen: () => void;
  isCheckedIn:  boolean;
}

function HomeScreen({ attendee, colors, selectedId, onSelectId, onTicketOpen, isCheckedIn }: HomeScreenProps) {
  const firstName = attendee.name.split(" ")[0];
  const initials  = attendee.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex-1 min-h-0 flex flex-col" style={{ backgroundColor: BRAND.pageBg }}>
      {/* App header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: BRAND.navy }}
      >
        <div className="flex items-center gap-2">
          <SwapcardPicto size={20} style={{ flexShrink: 0 }} />
          <div>
            <div className="text-xs font-black text-white" style={{ letterSpacing: "-0.01em" }}>Tech Summit 2025</div>
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>Hall A · Apr 23</div>
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
          style={{ backgroundColor: colors.bg }}
        >
          {initials}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-4 pt-4 pb-2 flex flex-col gap-4">

        {/* Attendee picker */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: BRAND.muted }}>
            Simulating as
          </label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => onSelectId(Number(e.target.value))}
              className="w-full rounded-xl px-3 py-2 pr-8 text-xs font-semibold bg-white appearance-none"
              style={{ border: `1px solid ${BRAND.border}`, color: BRAND.navy, outline: "none" }}
            >
              {MOCK_ATTENDEES.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.type}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1l5 5 5-5" stroke={BRAND.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Greeting */}
        <div>
          <div className="text-lg font-black" style={{ color: BRAND.navy, letterSpacing: "-0.02em" }}>
            {isCheckedIn ? `Welcome, ${firstName}!` : `Hi, ${firstName}`}
          </div>
          <div className="text-xs" style={{ color: BRAND.muted }}>
            {isCheckedIn
              ? "You're checked in · Tech Summit 2025"
              : "Tech Summit 2025 · Check in when you arrive"}
          </div>
        </div>

        {/* Event hero card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: `linear-gradient(135deg, ${BRAND.navy} 0%, #2a3547 100%)`,
            boxShadow: BRAND.cardShadow,
          }}
        >
          <div className="text-[9px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Live Event
          </div>
          <div className="text-base font-black text-white mb-1" style={{ letterSpacing: "-0.02em" }}>Tech Summit 2025</div>
          <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>April 23–24 · ExCeL London · Hall A</div>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: BRAND.teal }} />
            <span className="text-[10px] font-bold" style={{ color: BRAND.teal }}>Doors open · Registration ongoing</span>
          </div>
        </div>

        {/* My Ticket teaser */}
        <button
          onClick={onTicketOpen}
          className="w-full rounded-2xl bg-white flex items-center gap-3 px-4 py-3 text-left transition-all active:scale-[0.98]"
          style={{ boxShadow: BRAND.cardShadow, border: `1px solid ${BRAND.border}` }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: BRAND.pageBg, padding: 2 }}
          >
            <TicketQR dim={36} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black" style={{ color: BRAND.navy }}>My Ticket</div>
            <div className="text-[10px] truncate" style={{ color: BRAND.muted }}>
              {attendee.name} · {attendee.type}
            </div>
          </div>
          {isCheckedIn ? (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: BRAND.tealFaint, color: BRAND.tealDark }}
            >
              Checked in ✓
            </span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke={BRAND.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Today's agenda */}
        <div>
          <div className="text-xs font-black mb-2" style={{ color: BRAND.navy }}>Today&rsquo;s Agenda</div>
          <div className="rounded-2xl bg-white overflow-hidden" style={{ boxShadow: BRAND.cardShadow }}>
            {SCHEDULE.slice(0, 5).map((s, i) => (
              <div
                key={i}
                className="flex gap-3 px-4 py-2.5"
                style={{ borderBottom: i < 4 ? `1px solid ${BRAND.border}` : "none" }}
              >
                <div className="text-[10px] font-bold tabular-nums flex-shrink-0 w-10 pt-0.5" style={{ color: BRAND.teal }}>{s.time}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold leading-tight truncate" style={{ color: BRAND.navy }}>{s.title}</div>
                  <div className="text-[10px]" style={{ color: BRAND.muted }}>{s.room}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}

// ─── TicketScreen ─────────────────────────────────────────────────────────────
interface TicketScreenProps {
  attendee:    Attendee;
  colors:      Colors;
  isCheckedIn: boolean;
  record:      { time: string; checkedInBy: string } | undefined;
  onCheckIn:   () => void;
  onClose:     () => void;
  badgeConfig: { primaryColor: string; accentColor: string };
}

function TicketScreen({ attendee, colors, isCheckedIn, record, onCheckIn, onClose, badgeConfig }: TicketScreenProps) {
  const ticketCode = `TSX-${String(attendee.id).padStart(3, "0")}-${String((attendee.id * 557 + 12345) % 100000).padStart(5, "0")}`;

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 flex flex-col overflow-hidden"
      style={{ top: 44, zIndex: 50, backgroundColor: BRAND.pageBg }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: BRAND.navy }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <SwapcardLogo height={13} onDark />
        <div style={{ width: 48 }} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-4 py-5 flex flex-col gap-4">

        <div className="text-center">
          <div className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: BRAND.muted }}>Your Ticket</div>
          <div className="text-base font-black mt-0.5" style={{ color: BRAND.navy, letterSpacing: "-0.01em" }}>Tech Summit 2025</div>
        </div>

        {/* QR card */}
        <div
          className="rounded-2xl bg-white flex flex-col items-center py-6 gap-3"
          style={{ boxShadow: BRAND.cardShadow, border: `1px solid ${BRAND.border}` }}
        >
          <TicketQR dim={220} />
          <div className="font-mono text-xs font-bold tracking-widest" style={{ color: BRAND.navy }}>
            {ticketCode}
          </div>
          <div className="text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: BRAND.muted }}>
            Scan to check in
          </div>
        </div>

        {/* Ticket info */}
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: BRAND.cardShadow }}>
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ backgroundColor: badgeConfig.primaryColor }}
          >
            <span className="text-[10px] font-black tracking-wider text-white/70 uppercase">Tech Summit 2025</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Hall A · Apr 23</span>
          </div>
          <div className="flex bg-white">
            <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: badgeConfig.accentColor }} />
            <div className="flex-1 px-4 py-4">
              <div className="font-black text-base leading-tight" style={{ color: BRAND.navy }}>{attendee.name}</div>
              <div className="text-xs mt-0.5 mb-3" style={{ color: BRAND.muted }}>{attendee.org}</div>
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: colors.fill, color: colors.bg }}
                >
                  {attendee.type}
                </span>
                <span className="text-[10px]" style={{ color: BRAND.muted }}>ExCeL London</span>
              </div>
            </div>
          </div>
        </div>

        {/* VIP fast-track banner */}
        {attendee.type === "VIP" && !isCheckedIn && (
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: "#EEEDFE", border: "1px solid #c5c1f8" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 1.5l2 4.2 4.6.7-3.3 3.2.8 4.6L9 12l-4.1 2.2.8-4.6L2.4 6.4l4.6-.7z"
                fill="#EEEDFE" stroke="#534AB7" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
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
              onClick={onCheckIn}
              className="w-full py-4 rounded-2xl text-base font-black text-white transition-all active:scale-[0.98] hover:opacity-90"
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
                  {record?.time} · {record?.checkedInBy === "staff" ? "Staff-assisted" : "Self-serve"}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: BRAND.teal }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M4 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M4 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Your badge is printing…
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add to Wallet */}
        <button
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: "#000" }}
          onClick={(e) => e.preventDefault()}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="4.5" width="15" height="10" rx="2" stroke="white" strokeWidth="1.3" />
            <path d="M1.5 7.5h15" stroke="white" strokeWidth="1.3" />
            <circle cx="5" cy="11" r="1" fill="white" />
          </svg>
          Add to Wallet
        </button>

        <div className="h-4" />
      </div>
    </motion.div>
  );
}

// ─── ScheduleScreen ───────────────────────────────────────────────────────────
function ScheduleScreen() {
  return (
    <div className="flex-1 min-h-0 flex flex-col" style={{ backgroundColor: BRAND.pageBg }}>
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ backgroundColor: BRAND.navy }}
      >
        <div className="text-sm font-black text-white" style={{ letterSpacing: "-0.01em" }}>Agenda</div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>April 23, 2025 · Tech Summit</div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-4 py-2">
        <div className="rounded-2xl bg-white overflow-hidden mt-3" style={{ boxShadow: BRAND.cardShadow }}>
          {SCHEDULE.map((s, i) => (
            <div
              key={i}
              className="flex gap-3 px-4 py-3"
              style={{ borderBottom: i < SCHEDULE.length - 1 ? `1px solid ${BRAND.border}` : "none" }}
            >
              <div
                className="text-[10px] font-bold tabular-nums flex-shrink-0 w-10 pt-0.5"
                style={{ color: BRAND.teal }}
              >
                {s.time}
              </div>
              <div>
                <div className="text-[12px] font-semibold" style={{ color: BRAND.navy }}>{s.title}</div>
                <div className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>{s.room}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── NetworkScreen ────────────────────────────────────────────────────────────
function NetworkScreen() {
  return (
    <div className="flex-1 min-h-0 flex flex-col" style={{ backgroundColor: BRAND.pageBg }}>
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ backgroundColor: BRAND.navy }}
      >
        <div className="text-sm font-black text-white" style={{ letterSpacing: "-0.01em" }}>Network</div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{MOCK_ATTENDEES.length} attendees registered</div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-4 py-2">
        {MOCK_ATTENDEES.map((a) => {
          const c = TYPE_COLORS[a.type];
          const initials = a.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: `1px solid ${BRAND.border}` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ backgroundColor: c.bg }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold truncate" style={{ color: BRAND.navy }}>{a.name}</div>
                <div className="text-[10px] truncate" style={{ color: BRAND.muted }}>{a.org}</div>
              </div>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.fill, color: c.bg }}
              >
                {a.type}
              </span>
            </div>
          );
        })}
        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AttendeeView() {
  const { state, checkIn } = useCheckIn();
  const clock = useClock();
  const [selectedId, setSelectedId] = useState(1);
  const [screen, setScreen]         = useState<Screen>("home");
  const [ticketOpen, setTicketOpen] = useState(false);

  const attendee   = MOCK_ATTENDEES.find((a) => a.id === selectedId)!;
  const record     = state.checkedIn[selectedId];
  const isCheckedIn = !!record;
  const colors     = TYPE_COLORS[attendee.type];

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
        <div
          className="relative flex-shrink-0"
          style={{
            width: 390,
            height: "min(660px, calc(100vh - 100px))",
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
          <div
            className="absolute z-20 rounded-full"
            style={{ width: 110, height: 30, backgroundColor: "#000", top: 18, left: "50%", transform: "translateX(-50%)" }}
          />
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

            {/* Screen content */}
            {screen === "home" && (
              <HomeScreen
                attendee={attendee}
                colors={colors}
                selectedId={selectedId}
                onSelectId={setSelectedId}
                onTicketOpen={() => setTicketOpen(true)}
                isCheckedIn={isCheckedIn}
              />
            )}
            {screen === "schedule" && <ScheduleScreen />}
            {screen === "network"  && <NetworkScreen />}

            <BottomNav
              active={screen}
              onNav={setScreen}
              onTicket={() => setTicketOpen(true)}
              isCheckedIn={isCheckedIn}
            />

            {/* Ticket overlay — absolute, slides up over BottomNav */}
            <AnimatePresence>
              {ticketOpen && (
                <TicketScreen
                  attendee={attendee}
                  colors={colors}
                  isCheckedIn={isCheckedIn}
                  record={record}
                  onCheckIn={() => checkIn(selectedId, "self")}
                  onClose={() => setTicketOpen(false)}
                  badgeConfig={state.badgeConfig}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
