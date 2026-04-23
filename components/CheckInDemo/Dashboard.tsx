"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Attendee, CheckInRecord, LogEntry, TYPE_COLORS, calcAvgWait } from "./types";

interface Props {
  attendees: Attendee[];
  checkedIn: Record<number, CheckInRecord>;
  log: LogEntry[];
}

export default function Dashboard({ attendees, checkedIn, log }: Props) {
  const total       = attendees.length;
  const checked     = Object.keys(checkedIn).length;
  const remaining   = total - checked;
  const pct         = total > 0 ? Math.round((checked / total) * 100) : 0;
  const vipsArrived = attendees.filter((a) => a.type === "VIP" && checkedIn[a.id]).length;
  const vipAlerts   = log.filter((e) => e.type === "VIP");

  const stats = [
    { label: "Checked In",   value: checked,           color: "#1D9E75", icon: "✅" },
    { label: "Remaining",    value: remaining,          color: "#028090", icon: "⏳" },
    { label: "VIPs Arrived", value: vipsArrived,        color: "#534AB7", icon: "⭐" },
    { label: "Avg Wait",     value: calcAvgWait(log),   color: "#BA7517", icon: "⚡" },
  ];

  return (
    <div
      className="h-full overflow-y-auto hide-scrollbar px-4 py-4 flex flex-col gap-4"
      style={{ backgroundColor: "#F4FAFA" }}
    >
      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl px-4 py-3.5 bg-white"
            style={{ boxShadow: "0 1px 8px rgba(13,61,58,0.07)" }}
          >
            <div className="text-[10px] mb-1.5" style={{ color: "#9bbaba" }}>
              {s.icon} {s.label}
            </div>
            <div
              className="text-3xl font-black tabular-nums leading-none"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div
        className="rounded-2xl px-4 py-4 bg-white"
        style={{ boxShadow: "0 1px 8px rgba(13,61,58,0.07)" }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold" style={{ color: "#0D3D3A" }}>
            Check-in Progress
          </span>
          <span className="text-sm font-black" style={{ color: "#02C39A" }}>
            {pct}%
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E8F6F5" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: "#02C39A" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px]" style={{ color: "#9bbaba" }}>{checked} checked in</span>
          <span className="text-[11px]" style={{ color: "#9bbaba" }}>{remaining} remaining</span>
        </div>
      </div>

      {/* ── VIP notification feed ── */}
      <div>
        <div
          className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
          style={{ color: "#9bbaba" }}
        >
          VIP Alerts
        </div>
        {vipAlerts.length === 0 ? (
          <div
            className="text-xs text-center py-5 rounded-2xl"
            style={{
              color: "#9bbaba",
              backgroundColor: "rgba(255,255,255,0.7)",
              border: "1px dashed #e0eeee",
            }}
          >
            No VIPs checked in yet
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {vipAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 bg-white"
                  style={{
                    boxShadow: "0 1px 6px rgba(13,61,58,0.07)",
                    borderLeft: "3px solid #534AB7",
                  }}
                >
                  <span className="text-base flex-shrink-0">⭐</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: "#0D3D3A" }}>
                      {alert.name}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "#9bbaba" }}>
                      arrived · {alert.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
