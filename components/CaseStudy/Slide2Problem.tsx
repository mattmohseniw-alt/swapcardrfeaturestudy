"use client";

import { motion } from "framer-motion";

const painPoints = [
  {
    icon: "⏱",
    title: "Long check-in queues at peak arrival",
    description: "Attendees wait 8–15 min during the first 30 minutes of large events.",
    severity: 88,
    color: "#028090",
    label: "High Impact",
  },
  {
    icon: "🔄",
    title: "No live sync between registration & check-in",
    description: "Last-minute registrants are invisible to on-site staff, causing confusion.",
    severity: 74,
    color: "#02C39A",
    label: "Medium–High",
  },
  {
    icon: "🖨",
    title: "Badge printing errors and reprints",
    description: "Manual entry mistakes lead to wasted materials and longer queues.",
    severity: 62,
    color: "#028090",
    label: "Medium",
  },
  {
    icon: "😓",
    title: "Staff overwhelmed by manual processes",
    description: "Repetitive tasks prevent staff from delivering a warm welcome.",
    severity: 79,
    color: "#02C39A",
    label: "High",
  },
];

export default function Slide2Problem() {
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
          Context
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-3xl font-bold"
          style={{ color: "#0D3D3A" }}
        >
          The Problem Space
        </motion.h2>
      </div>

      {/* Cards grid */}
      <div className="flex-1 px-12 pb-14 grid grid-cols-2 gap-5">
        {painPoints.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.12 }}
            className="rounded-2xl p-5 flex flex-col gap-3 bg-white"
            style={{ boxShadow: "0 2px 16px rgba(13,61,58,0.08)" }}
          >
            {/* Icon + title */}
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">{p.icon}</span>
              <div>
                <div className="font-semibold text-sm leading-snug mb-1" style={{ color: "#0D3D3A" }}>
                  {p.title}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "#5a7a78" }}>
                  {p.description}
                </div>
              </div>
            </div>

            {/* Severity bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium" style={{ color: p.color }}>
                  {p.label}
                </span>
                <span className="text-xs font-bold" style={{ color: p.color }}>
                  {p.severity}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E8F6F5" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.severity}%` }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
