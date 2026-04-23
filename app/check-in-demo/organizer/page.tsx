"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckIn } from "../context";
import { MOCK_ATTENDEES, TYPE_COLORS, AttendeeType } from "@/components/CheckInDemo/types";
import ViewNav from "@/components/CheckInDemo/ViewNav";

// ─── Type breakdown rows ──────────────────────────────────────────────────────

const TYPE_ROWS: { type: AttendeeType; label: string }[] = [
  { type: "VIP",       label: "VIP" },
  { type: "Attendee",  label: "Attendee" },
  { type: "Exhibitor", label: "Exhibitor" },
  { type: "Speaker",   label: "Speaker" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ checkedCount, total }: { checkedCount: number; total: number }) {
  const NAV = [
    { label: "Overview",       icon: "▦", active: true },
    { label: "Attendees",      icon: "👥", active: false },
    { label: "Badge Designer", icon: "🎫", active: false },
    { label: "Reports",        icon: "📈", active: false },
    { label: "Settings",       icon: "⚙", active: false },
  ];

  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{
        width: 220,
        backgroundColor: "#0a2926",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Branding */}
      <div className="px-5 py-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black text-white"
            style={{ backgroundColor: "#02C39A" }}
          >
            S
          </div>
          <span className="text-sm font-bold text-white" style={{ letterSpacing: "-0.01em" }}>
            Swapcard Studio
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer"
            style={{
              backgroundColor: item.active ? "rgba(2,195,154,0.12)" : "transparent",
              color: item.active ? "#02C39A" : "rgba(255,255,255,0.35)",
            }}
          >
            <span className="text-sm w-4 text-center">{item.icon}</span>
            <span className="text-[13px] font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Event indicator */}
      <div
        className="px-5 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Active Event
        </div>
        <div className="text-xs font-semibold text-white mb-1">Tech Summit 2025</div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ backgroundColor: "#02C39A" }}
          />
          <span className="text-[11px]" style={{ color: "#02C39A" }}>
            LIVE · {checkedCount}/{total} checked in
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Reprint toast ────────────────────────────────────────────────────────────

function ReprintToast({ msg }: { msg: string | null }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-white"
          style={{
            backgroundColor: "#0a2926",
            border: "1px solid rgba(2,195,154,0.25)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <span style={{ color: "#02C39A" }}>🖨</span>
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizerView() {
  const { state } = useCheckIn();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const total       = MOCK_ATTENDEES.length;
  const checkedCount = Object.keys(state.checkedIn).length;
  const noShows     = total - checkedCount;
  const vipsOnSite  = MOCK_ATTENDEES.filter(
    (a) => a.type === "VIP" && state.checkedIn[a.id]
  ).length;
  const pct = Math.round((checkedCount / total) * 100);

  function handleReprint(name: string) {
    setToastMsg(`Badge sent to printer · ${name}`);
    setTimeout(() => setToastMsg(null), 2500);
  }

  const STAT_CARDS = [
    { label: "Total Registered", value: total,        color: "#02C39A", bg: "rgba(2,195,154,0.1)" },
    { label: "Checked In",       value: checkedCount, color: "#1D9E75", bg: "rgba(29,158,117,0.1)" },
    { label: "Pending",          value: noShows,       color: "#BA7517", bg: "rgba(186,117,23,0.1)" },
    { label: "VIPs On-site",     value: vipsOnSite,   color: "#534AB7", bg: "rgba(83,74,183,0.1)" },
  ];

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "#0f1a19" }}
    >
      <ViewNav active="organizer" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar checkedCount={checkedCount} total={total} />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar" style={{ backgroundColor: "#111f1e" }}>
          <div className="px-8 py-6 max-w-[1100px]">

            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
                Overview
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Tech Summit 2025 · Hall A · Real-time check-in dashboard
              </p>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {STAT_CARDS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-5 py-4"
                  style={{ backgroundColor: s.bg, border: `1px solid ${s.color}22` }}
                >
                  <div className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: s.color + "99" }}>
                    {s.label}
                  </div>
                  <div className="text-4xl font-black tabular-nums" style={{ color: s.color }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Progress + live feed ── */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "1fr 360px" }}>

              {/* Progress section */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-white">Check-in Progress</span>
                  <span className="text-2xl font-black tabular-nums" style={{ color: "#02C39A" }}>{pct}%</span>
                </div>

                {/* Master bar */}
                <div className="h-3 rounded-full overflow-hidden mb-5" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#02C39A" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Per-type breakdown */}
                <div className="flex flex-col gap-3">
                  {TYPE_ROWS.map(({ type, label }) => {
                    const typeTotal   = MOCK_ATTENDEES.filter((a) => a.type === type).length;
                    const typeChecked = MOCK_ATTENDEES.filter((a) => a.type === type && state.checkedIn[a.id]).length;
                    const typePct     = typeTotal > 0 ? Math.round((typeChecked / typeTotal) * 100) : 0;
                    const colors      = TYPE_COLORS[type];

                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: colors.fill + "22", color: colors.bg }}
                            >
                              {label}
                            </span>
                          </div>
                          <span className="text-[11px] tabular-nums font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {typeChecked}&thinsp;/&thinsp;{typeTotal}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: colors.bg }}
                            initial={{ width: 0 }}
                            animate={{ width: `${typePct}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live feed */}
              <div className="rounded-xl flex flex-col overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="px-4 py-3 flex items-center gap-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ backgroundColor: "#02C39A" }}
                  />
                  <span className="text-xs font-bold text-white">Live Feed</span>
                  <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(2,195,154,0.12)", color: "#02C39A" }}>
                    {state.log.length} events
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-2" style={{ maxHeight: 280 }}>
                  {state.log.length === 0 ? (
                    <div className="flex items-center justify-center h-24 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                      Waiting for first check-in…
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {state.log.map((entry) => {
                        const colors = TYPE_COLORS[entry.type];
                        const isVIP  = entry.type === "VIP";
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            transition={{ duration: 0.22 }}
                            className="flex items-center gap-2.5 py-2.5 px-2 rounded-lg mb-1"
                            style={{
                              borderLeft: isVIP ? "3px solid #534AB7" : "3px solid transparent",
                              backgroundColor: isVIP ? "rgba(83,74,183,0.07)" : "transparent",
                            }}
                          >
                            <div
                              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ backgroundColor: colors.bg }}
                            >
                              {entry.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate text-white">{entry.name}</div>
                              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                via {entry.checkedInBy === "self" ? "self-serve" : "staff"} · {entry.time}
                              </div>
                            </div>
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: colors.fill + "22", color: colors.bg }}
                            >
                              {entry.type}
                            </span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>

            {/* ── Attendee table ── */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Table header */}
              <div
                className="grid text-[10px] font-bold uppercase tracking-widest px-5 py-3"
                style={{
                  gridTemplateColumns: "1fr 120px 90px 100px 70px 80px 90px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.3)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span>Name</span>
                <span>Organisation</span>
                <span>Type</span>
                <span>Status</span>
                <span>Time</span>
                <span>Method</span>
                <span />
              </div>

              {/* Rows */}
              {MOCK_ATTENDEES.map((a, idx) => {
                const record  = state.checkedIn[a.id];
                const checked = !!record;
                const colors  = TYPE_COLORS[a.type];

                return (
                  <div
                    key={a.id}
                    className="grid items-center px-5 py-3"
                    style={{
                      gridTemplateColumns: "1fr 120px 90px 100px 70px 80px 90px",
                      backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {/* Name + avatar */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: colors.bg }}
                      >
                        {a.initials}
                      </div>
                      <span className="text-xs font-medium text-white truncate">{a.name}</span>
                    </div>

                    {/* Org */}
                    <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{a.org}</span>

                    {/* Type badge */}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block w-fit"
                      style={{ backgroundColor: colors.fill + "22", color: colors.bg }}
                    >
                      {a.type}
                    </span>

                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: checked ? "#1D9E75" : "rgba(255,255,255,0.2)" }}
                      />
                      <span className="text-xs font-medium" style={{ color: checked ? "#1D9E75" : "rgba(255,255,255,0.3)" }}>
                        {checked ? "Checked In" : "Pending"}
                      </span>
                    </div>

                    {/* Time */}
                    <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {record?.time ?? "—"}
                    </span>

                    {/* Method */}
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {record ? (record.checkedInBy === "self" ? "Self-serve" : "Staff") : "—"}
                    </span>

                    {/* Reprint */}
                    <button
                      onClick={() => handleReprint(a.name)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                      }}
                    >
                      Reprint
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      <ReprintToast msg={toastMsg} />
    </div>
  );
}
