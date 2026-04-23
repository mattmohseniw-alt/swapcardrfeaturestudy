"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const features = [
  { icon: "🖨", text: "On-demand badge printing at self-service kiosks" },
  { icon: "🔗", text: "Real-time attendee sync via registration API" },
  { icon: "📱", text: "QR code mobile check-in — no paper required" },
  { icon: "📊", text: "Live staff dashboard with queue metrics" },
  { icon: "🔌", text: "Offline fallback mode for connectivity failures" },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    setCount(0);
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [target, duration, active]);
  return count;
}

export default function Slide3FeatureVision() {
  const [counterActive, setCounterActive] = useState(false);
  const count = useCountUp(90, 1400, counterActive);

  useEffect(() => {
    // Start counter after bullets finish animating
    const timer = setTimeout(() => setCounterActive(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex" style={{ backgroundColor: "#F4FAFA" }}>
      {/* Left column */}
      <div className="flex flex-col px-12 pt-10 pb-14 w-[58%]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#028090" }}
        >
          Solution
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-3xl font-bold mb-8"
          style={{ color: "#0D3D3A" }}
        >
          Feature Vision
        </motion.h2>

        {/* Bullet points */}
        <div className="flex flex-col gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              className="flex items-center gap-4"
            >
              {/* Animated dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.28 + i * 0.15,
                  type: "spring",
                  stiffness: 350,
                }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#02C39A" }}
              />
              <span className="text-sm font-medium leading-snug" style={{ color: "#0D3D3A" }}>
                <span className="mr-2">{f.icon}</span>
                {f.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-14">
        {/* Goal box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0D3D3A 0%, #028090 100%)",
            boxShadow: "0 8px 32px rgba(13,61,58,0.25)",
          }}
        >
          <div className="p-7 text-center">
            <div className="text-xs font-semibold tracking-widest uppercase mb-4 text-white/60">
              Primary Goal
            </div>
            <div className="text-6xl font-black text-white mb-2 tabular-nums">
              {count}
              <span className="text-2xl font-bold ml-1 text-white/70">s</span>
            </div>
            <div className="text-sm font-medium text-white/70">
              Target check-in time per attendee
            </div>
          </div>
          <div
            className="px-7 py-4 flex items-center gap-3"
            style={{ backgroundColor: "rgba(2,195,154,0.15)", borderTop: "1px solid rgba(2,195,154,0.2)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#02C39A" }} />
            <span className="text-xs text-white/60">
              Down from the current average of <strong className="text-white/80">8–15 minutes</strong>
            </span>
          </div>
        </motion.div>

        {/* Secondary stat */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.6 }}
          className="mt-5 w-full rounded-xl px-5 py-4 flex items-center gap-4"
          style={{ backgroundColor: "#E8F6F5", border: "1px solid rgba(2,128,144,0.2)" }}
        >
          <span className="text-2xl">🎯</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: "#028090" }}>
              Scope
            </div>
            <div className="text-sm font-medium" style={{ color: "#0D3D3A" }}>
              Events with 200–5,000 attendees
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
