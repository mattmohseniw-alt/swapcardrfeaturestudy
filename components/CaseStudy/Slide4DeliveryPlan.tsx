"use client";

import { motion } from "framer-motion";

const steps = [
  { week: "Wk 1–2", label: "Discovery", desc: "Stakeholder interviews, user research, competitive analysis" },
  { week: "Wk 2–3", label: "Architecture", desc: "Technical design, integrations spec, hardware selection" },
  { week: "Wk 3–5", label: "Build Sprint", desc: "Kiosk setup, printer integration, API sync implementation" },
  { week: "Wk 5–6", label: "Alpha Pilot", desc: "Live test with 50-attendee internal event, bug triage" },
  { week: "Wk 6–7", label: "Iteration", desc: "Feedback loop, performance tuning, UX refinements" },
  { week: "Wk 8", label: "Rollout", desc: "Full production launch with monitoring & on-call support" },
];

export default function Slide4DeliveryPlan() {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#F4FAFA" }}>
      {/* Header */}
      <div className="px-12 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "#028090" }}
        >
          Execution
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-3xl font-bold"
          style={{ color: "#0D3D3A" }}
        >
          Delivery Plan
        </motion.h2>
      </div>

      {/* Timeline */}
      <div className="flex-1 px-12 pb-14 flex gap-10">
        {/* Vertical line + steps */}
        <div className="relative flex flex-col gap-0 w-full mt-4">
          {/* The animated vertical line */}
          <div className="absolute left-[22px] top-3 bottom-3 w-0.5" style={{ backgroundColor: "#E8F6F5" }}>
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{ backgroundColor: "#02C39A" }}
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 1.2, delay: 0.35, ease: "easeInOut" }}
            />
          </div>

          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.18 }}
              className="relative flex items-start gap-5 pb-5 last:pb-0"
            >
              {/* Circle */}
              <motion.div
                initial={{ backgroundColor: "#E8F6F5", scale: 0.7 }}
                animate={{ backgroundColor: "#02C39A", scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.18, type: "spring", stiffness: 300 }}
                className="relative z-10 w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
                style={{ border: "2px solid #02C39A" }}
              >
                {i + 1}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.35, delay: 0.65 + i * 0.18 }}
                className="pt-2 flex-1"
              >
                <div className="flex items-baseline gap-3 mb-0.5">
                  <span className="font-bold text-sm" style={{ color: "#0D3D3A" }}>
                    {s.label}
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#E8F6F5", color: "#028090" }}
                  >
                    {s.week}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#5a7a78" }}>
                  {s.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
