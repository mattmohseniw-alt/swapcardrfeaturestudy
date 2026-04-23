"use client";

import { motion } from "framer-motion";

const rows = [
  {
    risk: "Hardware failure mid-event",
    mitigation: "Hot-swap spare units on-site + manual fallback checklist",
    level: "High",
    color: "#e05252",
  },
  {
    risk: "API sync latency or outage",
    mitigation: "Offline-first local cache with background retry queue",
    level: "Medium",
    color: "#e09a52",
  },
  {
    risk: "Staff training gaps",
    mitigation: "Mandatory pre-event training sessions + laminated quick-start cards",
    level: "Medium",
    color: "#e09a52",
  },
  {
    risk: "GDPR / data privacy concerns",
    mitigation: "Local-only badge data storage, minimal data collection policy",
    level: "Low",
    color: "#028090",
  },
];

export default function Slide5Risks() {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#F4FAFA" }}>
      {/* Header */}
      <div className="px-12 pt-10 pb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#028090" }}
        >
          Risk Management
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-3xl font-bold"
          style={{ color: "#0D3D3A" }}
        >
          Risks & Mitigations
        </motion.h2>
      </div>

      {/* Column headers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="px-12 pb-2 grid grid-cols-[1fr_1fr_80px] gap-4"
      >
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#028090" }}>
          Risk
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#028090" }}>
          Mitigation
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-right" style={{ color: "#028090" }}>
          Level
        </div>
      </motion.div>

      {/* Risk rows */}
      <div className="flex-1 px-12 pb-14 flex flex-col gap-3">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.14 }}
            className="relative grid grid-cols-[1fr_1fr_80px] gap-4 items-center rounded-xl p-4 overflow-hidden bg-white"
            style={{
              boxShadow: "0 1px 8px rgba(13,61,58,0.07)",
              borderLeft: "3px solid transparent",
            }}
          >
            {/* Animated teal left border overlay */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.45 + i * 0.14, ease: "easeOut" }}
              style={{ backgroundColor: "#02C39A", transformOrigin: "top" }}
            />

            {/* Risk */}
            <div className="text-sm font-semibold pl-1" style={{ color: "#0D3D3A" }}>
              {row.risk}
            </div>

            {/* Mitigation — wipe in with clip-path */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.55, delay: 0.6 + i * 0.14, ease: "easeOut" }}
              className="text-xs leading-relaxed"
              style={{ color: "#5a7a78" }}
            >
              {row.mitigation}
            </motion.div>

            {/* Level badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.7 + i * 0.14 }}
              className="flex justify-end"
            >
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${row.color}18`,
                  color: row.color,
                  border: `1px solid ${row.color}40`,
                }}
              >
                {row.level}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
