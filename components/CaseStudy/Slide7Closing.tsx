"use client";

import { motion } from "framer-motion";

const headlineWords = ["Faster", "Check-In.", "Better", "Events."];

export default function Slide7Closing() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0D3D3A" }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,195,154,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-16">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold tracking-[0.22em] uppercase mb-8 px-4 py-2 rounded-full"
          style={{
            backgroundColor: "rgba(2,195,154,0.15)",
            color: "#02C39A",
            border: "1px solid rgba(2,195,154,0.3)",
          }}
        >
          Case Study — Badge Printing & Check-In
        </motion.div>

        {/* Animated headline */}
        <h1 className="text-6xl font-black text-white mb-6 leading-tight">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.12 }}
              className="inline-block mr-4 last:mr-0"
              style={
                word.endsWith(".")
                  ? { color: "#02C39A" }
                  : {}
              }
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.72 }}
          className="text-lg mb-12 max-w-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Delivering memorable first impressions through thoughtful product ownership
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="w-16 h-px mb-10"
          style={{ backgroundColor: "#02C39A", transformOrigin: "center" }}
        />

        {/* Name / presenter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="text-base font-semibold text-white">Matt Mullen</div>
          <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
            Product Owner · Swapcard
          </div>
        </motion.div>

        {/* Bottom metrics row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-14 flex items-center gap-10"
        >
          {[
            { val: "< 90s", label: "Check-in time" },
            { val: "< 2%", label: "Error rate" },
            { val: "85%+", label: "Staff satisfaction" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black" style={{ color: "#02C39A" }}>
                {item.val}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
