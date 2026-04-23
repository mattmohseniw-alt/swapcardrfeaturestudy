"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Attendee, CheckInRecord, LogEntry, TYPE_COLORS, BRAND, calcAvgWait } from "./types";

interface Props {
  attendees: Attendee[];
  checkedIn: Record<number, CheckInRecord>;
  log: LogEntry[];
}

// Simple SVG icons replacing emoji
function IconChecked() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill={BRAND.tealLight}/>
      <path d="M4 7l2.2 2.2L10 4.5" stroke={BRAND.teal} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke={BRAND.navyLight} strokeWidth="1.2" fill="none"/>
      <path d="M7 4v3.2l2 1.3" stroke={BRAND.navyLight} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5l1.5 3.1 3.4.5-2.5 2.4.6 3.4L7 9.2l-3 1.7.6-3.4-2.5-2.4 3.4-.5z" fill="#EEEDFE" stroke="#534AB7" strokeWidth="1"/>
    </svg>
  );
}
function IconBolt() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8.5 1.5L4 8h4.5L5.5 12.5l6-7H7z" fill="#FAEEDA" stroke="#BA7517" strokeWidth="0.8"/>
    </svg>
  );
}

export default function Dashboard({ attendees, checkedIn, log }: Props) {
  const total       = attendees.length;
  const checked     = Object.keys(checkedIn).length;
  const remaining   = total - checked;
  const pct         = total > 0 ? Math.round((checked / total) * 100) : 0;
  const vipsArrived = attendees.filter((a) => a.type === "VIP" && checkedIn[a.id]).length;
  const vipAlerts   = log.filter((e) => e.type === "VIP");

  const stats = [
    { label: "Checked In",   value: checked,           color: BRAND.teal,    Icon: IconChecked },
    { label: "Remaining",    value: remaining,          color: BRAND.navyMid, Icon: IconClock  },
    { label: "VIPs Arrived", value: vipsArrived,        color: "#534AB7",     Icon: IconStar   },
    { label: "Avg Wait",     value: calcAvgWait(log),   color: "#BA7517",     Icon: IconBolt   },
  ];

  return (
    <div
      className="h-full overflow-y-auto hide-scrollbar px-4 py-4 flex flex-col gap-4"
      style={{ backgroundColor: BRAND.pageBg }}
    >
      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl px-4 py-3.5 bg-white"
            style={{ boxShadow: BRAND.cardShadow }}
          >
            <div className="flex items-center gap-1.5 mb-1.5" style={{ color: BRAND.muted }}>
              <s.Icon />
              <span className="text-[10px]">{s.label}</span>
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
        style={{ boxShadow: BRAND.cardShadow }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold" style={{ color: BRAND.navy }}>
            Check-in Progress
          </span>
          <span className="text-sm font-black" style={{ color: BRAND.teal }}>
            {pct}%
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: BRAND.tealLight }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: BRAND.teal }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px]" style={{ color: BRAND.muted }}>{checked} checked in</span>
          <span className="text-[11px]" style={{ color: BRAND.muted }}>{remaining} remaining</span>
        </div>
      </div>

      {/* ── VIP notification feed ── */}
      <div>
        <div
          className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
          style={{ color: BRAND.muted }}
        >
          VIP Alerts
        </div>
        {vipAlerts.length === 0 ? (
          <div
            className="text-xs text-center py-5 rounded-2xl"
            style={{
              color: BRAND.muted,
              backgroundColor: "rgba(255,255,255,0.7)",
              border: `1px dashed ${BRAND.border}`,
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
                    boxShadow: BRAND.cardShadow,
                    borderLeft: "3px solid #534AB7",
                  }}
                >
                  <IconStar />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: BRAND.navy }}>
                      {alert.name}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: BRAND.muted }}>
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
