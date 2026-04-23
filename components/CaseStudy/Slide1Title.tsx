"use client";

import { motion } from "framer-motion";

// A single circuit trace path: draws from one end, plus dots at junctions
const traces = [
  { d: "M -10 72 H 132 V 32 H 292 V 112 H 382 V 54 H 420", delay: 0, color: "#02C39A", w: 1.5 },
  { d: "M -10 158 H 86 V 198 H 212 V 116 H 318 V 162 H 420", delay: 0.15, color: "#028090", w: 1 },
  { d: "M -10 242 H 66 V 178 H 178 V 256 H 348 V 214 H 420", delay: 0.3, color: "#02C39A", w: 1 },
  { d: "M 132 32 V -10", delay: 0.6, color: "#02C39A", w: 1 },
  { d: "M 292 32 V -10", delay: 0.7, color: "#028090", w: 1 },
  { d: "M 178 178 V 310", delay: 0.8, color: "#02C39A", w: 1 },
  { d: "M 318 116 V 310", delay: 0.85, color: "#028090", w: 1 },
  { d: "M 212 116 H 212 V 90 H 260 V 116", delay: 0.9, color: "#028090", w: 1 },
];

const dots = [
  { cx: 132, cy: 72, delay: 0.45, r: 3.5, color: "#02C39A" },
  { cx: 132, cy: 32, delay: 0.65, r: 3, color: "#02C39A" },
  { cx: 292, cy: 32, delay: 0.72, r: 3, color: "#028090" },
  { cx: 292, cy: 112, delay: 0.55, r: 3.5, color: "#02C39A" },
  { cx: 382, cy: 54, delay: 0.6, r: 3, color: "#02C39A" },
  { cx: 86, cy: 158, delay: 0.5, r: 3, color: "#028090" },
  { cx: 86, cy: 198, delay: 0.7, r: 3, color: "#028090" },
  { cx: 212, cy: 116, delay: 0.65, r: 3.5, color: "#028090" },
  { cx: 318, cy: 162, delay: 0.72, r: 3, color: "#028090" },
  { cx: 66, cy: 242, delay: 0.6, r: 3, color: "#02C39A" },
  { cx: 178, cy: 256, delay: 0.75, r: 3, color: "#02C39A" },
  { cx: 348, cy: 214, delay: 0.78, r: 3, color: "#02C39A" },
  { cx: 260, cy: 90, delay: 0.95, r: 4, color: "#028090", filled: true },
  { cx: 212, cy: 90, delay: 0.95, r: 4, color: "#028090", filled: true },
];

// Small IC chip rectangles
const chips = [
  { x: 250, y: 82, w: 24, h: 16, delay: 1.0 },
  { x: 138, y: 148, w: 18, h: 12, delay: 1.05 },
  { x: 300, y: 200, w: 20, h: 14, delay: 1.1 },
];

export default function Slide1Title() {
  return (
    <div className="absolute inset-0 flex" style={{ backgroundColor: "#0D3D3A" }}>
      {/* Left panel — brand & text */}
      <div className="flex flex-col justify-center pl-14 pr-8 w-[48%] z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs font-semibold tracking-[0.22em] uppercase mb-5"
          style={{ color: "#02C39A" }}
        >
          Swapcard
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="text-4xl font-bold leading-tight text-white mb-5"
          style={{ letterSpacing: "-0.02em" }}
        >
          Badge Printing &{" "}
          <span style={{ color: "#02C39A" }}>Onsite</span>
          <br />
          Check-In
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="text-base font-medium mb-8"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Product Owner Case Study
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.58 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-8" style={{ backgroundColor: "#02C39A" }} />
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
            Matt Mullen · April 2026
          </span>
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-px self-stretch my-12"
        style={{ backgroundColor: "rgba(2,195,154,0.25)", transformOrigin: "top" }}
      />

      {/* Right panel — circuit board SVG */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <motion.svg
          viewBox="0 0 420 300"
          className="absolute inset-0 w-full h-full"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ opacity: 0.7 }}
        >
          {/* Traces */}
          {traces.map((t, i) => (
            <motion.path
              key={i}
              d={t.d}
              stroke={t.color}
              strokeWidth={t.w}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.6 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.9, delay: t.delay, ease: "easeInOut" }}
            />
          ))}

          {/* Junction dots */}
          {dots.map((d, i) => (
            <motion.circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.25, delay: d.delay, type: "spring", stiffness: 300 }}
            />
          ))}

          {/* IC chips */}
          {chips.map((c, i) => (
            <motion.rect
              key={i}
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={2}
              stroke="#028090"
              strokeWidth={1}
              fill="rgba(2,128,144,0.15)"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 0.3, delay: c.delay }}
            />
          ))}
        </motion.svg>

        {/* Floating label badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 1.2 }}
          className="relative z-10 rounded-xl px-5 py-4 text-center"
          style={{
            background: "rgba(2,195,154,0.12)",
            border: "1px solid rgba(2,195,154,0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="text-2xl font-bold text-white mb-0.5">2026</div>
          <div className="text-xs font-medium" style={{ color: "#02C39A" }}>
            Event Technology
          </div>
        </motion.div>
      </div>
    </div>
  );
}
