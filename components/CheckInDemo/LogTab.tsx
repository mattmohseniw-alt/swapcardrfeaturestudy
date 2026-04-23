"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogEntry, TYPE_COLORS, BRAND } from "./types";

interface Props {
  log: LogEntry[];
  onReset: () => void;
}

export default function LogTab({ log, onReset }: Props) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: BRAND.pageBg }}>
      {/* Scrollable log entries */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-4 pb-2">
        {log.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-40 rounded-2xl text-center gap-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              border: `1px dashed ${BRAND.border}`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="2" width="16" height="22" rx="2" stroke={BRAND.muted} strokeWidth="1.4" fill="none"/>
              <path d="M8 8h8M8 12h8M8 16h5" stroke={BRAND.muted} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <div className="text-xs font-medium" style={{ color: BRAND.muted }}>
              No check-ins yet.<br />Tap an attendee to get started.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {log.map((entry) => {
                const colors = TYPE_COLORS[entry.type];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: 20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 bg-white flex-shrink-0"
                    style={{ boxShadow: BRAND.cardShadow }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white select-none"
                      style={{ backgroundColor: colors.bg }}
                    >
                      {entry.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>

                    {/* Name + time */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: BRAND.navy }}>
                        {entry.name}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: BRAND.muted }}>
                        {entry.time}
                      </div>
                    </div>

                    {/* Type badge */}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                      style={{ backgroundColor: colors.fill, color: colors.bg }}
                    >
                      {entry.type}
                    </span>

                    {/* Check icon */}
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: BRAND.tealLight }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke={BRAND.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Reset button — pinned at bottom */}
      <div className="flex-shrink-0 px-4 py-4" style={{ borderTop: `1px solid ${BRAND.border}` }}>
        <button
          onClick={onReset}
          className="w-full py-3 rounded-2xl text-sm font-semibold transition-colors"
          style={{
            border: "1px solid #fca5a5",
            color: "#ef4444",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          Reset all check-ins
        </button>
      </div>
    </div>
  );
}
