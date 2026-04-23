"use client";

import { motion, AnimatePresence } from "framer-motion";
import { KioskState, Attendee, TYPE_COLORS } from "./types";

// ─── Shared spinner ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <motion.svg
      width={22} height={22} viewBox="0 0 22 22" fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={11} cy={11} r={8.5} stroke="#02C39A" strokeWidth={2.5} strokeDasharray="26 26" strokeLinecap="round" />
    </motion.svg>
  );
}

// ─── Badge preview inside the sheet ──────────────────────────────────────────

function BadgePreview({ attendee }: { attendee: Attendee }) {
  const c = TYPE_COLORS[attendee.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 280, damping: 22 }}
      className="rounded-2xl overflow-hidden w-full"
      style={{ boxShadow: "0 4px 20px rgba(13,61,58,0.14)" }}
    >
      {/* Badge header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: "#0D3D3A" }}
      >
        <span className="text-xs font-black tracking-[0.18em] text-white/80">SWAPCARD</span>
        <span className="text-[10px] text-white/40">Tech Summit 2025</span>
      </div>

      {/* Badge body */}
      <div className="flex bg-white">
        {/* Type stripe */}
        <div className="w-2 flex-shrink-0" style={{ backgroundColor: c.stripe }} />
        {/* Content */}
        <div className="flex-1 px-4 py-4">
          <div
            className="font-black text-xl leading-tight mb-0.5"
            style={{ color: "#0D3D3A", letterSpacing: "-0.02em" }}
          >
            {attendee.name}
          </div>
          <div className="text-xs mb-3" style={{ color: "#8aabaa" }}>
            {attendee.org}
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: c.fill, color: c.bg }}
          >
            {attendee.type}
          </span>
        </div>
      </div>

      {/* Badge footer */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ backgroundColor: "#F4FAFA", borderTop: "1px solid #E8F6F5" }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#02C39A" }} />
        <span className="text-[10px] font-medium" style={{ color: "#5a7a78" }}>
          Checked in · Badge printing…
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  kioskState: KioskState;
}

export default function BottomSheet({ kioskState }: Props) {
  const { status, attendee } = kioskState;
  const visible = status !== "idle";

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
            style={{ backgroundColor: "#fff" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
          >
            {/* Pull handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: "#d1d5db" }}
              />
            </div>

            <div className="px-5 pb-8 pt-3">
              {/* ── Scanning state ── */}
              {status === "scanning" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 py-6"
                >
                  <Spinner />
                  <div className="text-sm font-semibold" style={{ color: "#028090" }}>
                    Reading QR code…
                  </div>
                </motion.div>
              )}

              {/* ── Success state ── */}
              {status === "success" && attendee && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center gap-5"
                >
                  {/* Checkmark */}
                  <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 80 80" width={64} height={64}>
                      <motion.circle
                        cx={40} cy={40} r={36}
                        fill="#E1F5EE"
                        stroke="#1D9E75"
                        strokeWidth={2.5}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.28, type: "spring", stiffness: 300 }}
                      />
                      <motion.path
                        d="M 22 40 L 35 53 L 58 27"
                        stroke="#1D9E75"
                        strokeWidth={4.5}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.35, delay: 0.18, ease: "easeOut" }}
                      />
                    </svg>

                    <div className="text-center">
                      <div className="text-base font-bold" style={{ color: "#0D3D3A" }}>
                        Check-in successful!
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#9bbaba" }}>
                        Welcome, {attendee.name.split(" ")[0]}
                      </div>
                    </div>
                  </div>

                  {/* Badge preview */}
                  <BadgePreview attendee={attendee} />
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
