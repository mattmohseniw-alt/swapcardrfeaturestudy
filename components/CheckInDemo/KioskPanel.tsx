"use client";

import { motion, AnimatePresence } from "framer-motion";
import { KioskState, Attendee, TYPE_COLORS, BRAND } from "./types";

// ─── QR code grid (21×21, generated once at module load) ─────────────────────

function buildQR(): boolean[] {
  const N = 21;
  const g = new Array<boolean>(N * N).fill(false);
  const s = (r: number, c: number, v: boolean) => { g[r * N + c] = v; };
  const finder = (sr: number, sc: number) => {
    for (let dr = 0; dr < 7; dr++)
      for (let dc = 0; dc < 7; dc++)
        s(sr + dr, sc + dc,
          dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
          (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
  };
  finder(0, 0); finder(0, 14); finder(14, 0);
  for (let i = 8; i <= 12; i++) { s(6, i, i % 2 === 0); s(i, 6, i % 2 === 0); }
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (r <= 7 && c <= 7)  continue;
      if (r <= 7 && c >= 13) continue;
      if (r >= 13 && c <= 7) continue;
      if (r === 6 || c === 6) continue;
      s(r, c, ((r * 7 + c * 13 + r * c * 3) % 5) < 3);
    }
  }
  return g;
}

const QR_CELLS = buildQR();
const N = 21;

function QRCodeSVG({ dim, color }: { dim: number; color: string }) {
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
      {QR_CELLS.map((filled, i) =>
        filled ? (
          <rect key={i} x={i % N} y={Math.floor(i / N)} width={1} height={1} fill={color} />
        ) : null
      )}
    </svg>
  );
}

// ─── Badge card ───────────────────────────────────────────────────────────────

function BadgeCard({ attendee }: { attendee: Attendee }) {
  const colors = TYPE_COLORS[attendee.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.35, type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-2xl overflow-hidden bg-white select-none"
      style={{ width: 260, boxShadow: "0 16px 48px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.15)" }}
    >
      <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: BRAND.navy }}>
        <span className="text-xs font-bold tracking-widest text-white/80" style={{ letterSpacing: "0.18em" }}>
          SWAPCARD
        </span>
        <span className="text-[10px] font-medium text-white/40">Tech Summit 2025</span>
      </div>
      <div className="flex">
        <div className="w-2 flex-shrink-0" style={{ backgroundColor: colors.stripe }} />
        <div className="flex-1 px-4 py-4">
          <div className="font-black text-lg leading-tight mb-0.5" style={{ color: BRAND.navy, letterSpacing: "-0.02em" }}>
            {attendee.name}
          </div>
          <div className="text-xs mb-3" style={{ color: BRAND.muted }}>{attendee.org}</div>
          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.fill, color: colors.bg }}>
            {attendee.type}
          </span>
        </div>
      </div>
      <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: BRAND.tealFaint, borderTop: `1px solid ${BRAND.tealLight}` }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.teal }} />
        <span className="text-[10px] font-medium" style={{ color: BRAND.tealDark }}>Checked in · Badge printed</span>
      </div>
    </motion.div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <motion.svg width={18} height={18} viewBox="0 0 18 18" fill="none"
      animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}>
      <circle cx={9} cy={9} r={7} stroke={BRAND.teal} strokeWidth={2} strokeDasharray="22 22" strokeLinecap="round" />
    </motion.svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { kioskState: KioskState; }

export default function KioskPanel({ kioskState }: Props) {
  const { status, attendee } = kioskState;

  return (
    <div
      className="relative flex flex-col items-center justify-between overflow-hidden"
      style={{ backgroundColor: BRAND.darkBg }}
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(3,171,129,0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top label */}
      <div className="relative z-10 pt-6 text-center">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5" style={{ color: `rgba(3,171,129,0.5)` }}>
          Onsite Check-In
        </div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          Kiosk Terminal · 01
        </div>
      </div>

      {/* Central display */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <AnimatePresence mode="wait">

          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-5">
              <div className="rounded-2xl p-5 relative overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}>
                <QRCodeSVG dim={160} color={BRAND.navy} />
                <motion.div
                  className="absolute left-5 right-5 h-0.5 rounded-full pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${BRAND.teal}, transparent)`, boxShadow: `0 0 8px 2px rgba(3,171,129,0.6)` }}
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Waiting for QR scan…</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>or select an attendee →</p>
              </div>
            </motion.div>
          )}

          {status === "scanning" && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-5">
              <div className="rounded-2xl p-5 relative overflow-hidden" style={{ backgroundColor: "white", boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}>
                <QRCodeSVG dim={160} color={BRAND.navy} />
                <motion.div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: "rgba(3,171,129,0.2)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 0.3 }} />
              </div>
              <div className="flex items-center gap-2.5">
                <Spinner />
                <span className="text-sm font-semibold" style={{ color: BRAND.teal }}>Processing…</span>
              </div>
            </motion.div>
          )}

          {status === "success" && attendee && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-5">
              <svg viewBox="0 0 96 96" width={80} height={80}>
                <motion.circle cx={48} cy={48} r={44} fill={BRAND.tealFaint} stroke={BRAND.teal} strokeWidth={3}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, type: "spring", stiffness: 300 }} />
                <motion.path d="M 26 48 L 42 64 L 70 30" stroke={BRAND.teal} strokeWidth={5.5} fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }} />
              </svg>
              <div className="text-center">
                <div className="text-base font-bold text-white">Check-in successful!</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Badge printing…</div>
              </div>
              <BadgeCard attendee={attendee} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status */}
      <div className="relative z-10 pb-5 flex items-center gap-2">
        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.teal }}
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        <span className="text-[10px]" style={{ color: "rgba(3,171,129,0.5)" }}>
          {status === "idle" ? "Ready" : status === "scanning" ? "Scanning" : "Done"}
        </span>
      </div>
    </div>
  );
}
