"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckIn } from "../context";
import { MOCK_ATTENDEES, TYPE_COLORS, BRAND, LogEntry } from "@/components/CheckInDemo/types";
import ViewNav from "@/components/CheckInDemo/ViewNav";

// ─── Badge job state machine ──────────────────────────────────────────────────

type JobStatus = "queued" | "printing" | "done";

interface BadgeJob {
  jobId: string;
  attendeeId: number;
  name: string;
  type: string;
  status: JobStatus;
}

// ─── Live clock ───────────────────────────────────────────────────────────────

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

function secsAgo(ts: number, now: number) {
  return Math.max(0, Math.round((now - ts) / 1000));
}

// ─── Webhook endpoints ────────────────────────────────────────────────────────

const WEBHOOKS = [
  { id: "wh1", name: "attendee.checked_in",    endpoint: "https://crm.acmecorp.io/hooks/swapcard" },
  { id: "wh2", name: "badge.print_job.created", endpoint: "https://badgepro.internal/webhook" },
  { id: "wh3", name: "analytics.event.tracked", endpoint: "https://data.eventhub.com/ingest" },
];

interface KioskSession {
  id: string;
  label: string;
  lastScanTs: number | null;
}

// ─── Server health pill ───────────────────────────────────────────────────────

function HealthPill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.teal }} />
      <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
    </div>
  );
}

// ─── Log line ─────────────────────────────────────────────────────────────────

function LogLine({ entry }: { entry: LogEntry }) {
  const isVIP    = entry.type === "VIP";
  const latency  = 30 + (entry.attendeeId * 7 % 40);
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{ duration: 0.2 }}
      className="px-3 py-1.5 rounded font-mono text-[11px] leading-relaxed mb-0.5"
      style={{
        backgroundColor: isVIP ? "rgba(83,74,183,0.1)" : "rgba(255,255,255,0.03)",
        borderLeft: isVIP ? "2px solid rgba(83,74,183,0.5)" : "2px solid transparent",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.2)" }}>[{entry.time}]</span>
      {" "}
      <span style={{ color: BRAND.teal }}>CHECK_IN</span>
      {" · "}
      <span style={{ color: "rgba(255,255,255,0.35)" }}>attendee_id=</span><span className="text-white">{entry.attendeeId}</span>
      {" · "}
      <span style={{ color: "rgba(255,255,255,0.35)" }}>method=</span><span className="text-white">{entry.checkedInBy === "self" ? "qr_scan" : "staff_manual"}</span>
      {" · "}
      <span style={{ color: "rgba(255,255,255,0.35)" }}>badge_job=</span><span style={{ color: "#BA7517" }}>queued</span>
      {" · "}
      <span style={{ color: "rgba(255,255,255,0.35)" }}>latency=</span><span className="text-white">{latency}ms</span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SwapcardOpsView() {
  const { state } = useCheckIn();
  const now = useNow();

  const total        = MOCK_ATTENDEES.length;
  const checkedCount = Object.keys(state.checkedIn).length;

  // Badge print jobs
  const [jobs, setJobs] = useState<BadgeJob[]>([]);
  const processedIds = useRef(new Set<number>());

  useEffect(() => {
    state.log.forEach((entry) => {
      if (processedIds.current.has(entry.attendeeId)) return;
      processedIds.current.add(entry.attendeeId);

      const job: BadgeJob = {
        jobId:      `badge_job_${String(entry.attendeeId).padStart(3, "0")}`,
        attendeeId: entry.attendeeId,
        name:       entry.name,
        type:       entry.type,
        status:     "queued",
      };
      setJobs((prev) => [job, ...prev]);

      setTimeout(() => setJobs((prev) => prev.map((j) => j.jobId === job.jobId ? { ...j, status: "printing" } : j)), 1000);
      setTimeout(() => setJobs((prev) => prev.map((j) => j.jobId === job.jobId ? { ...j, status: "done" } : j)), 3500);
    });
  }, [state.log]);

  // Kiosk sessions
  const [kiosks, setKiosks] = useState<KioskSession[]>([
    { id: "kiosk-a", label: "Kiosk A", lastScanTs: null },
    { id: "kiosk-b", label: "Kiosk B", lastScanTs: null },
  ]);

  const lastLogEntry = state.log[0] ?? null;
  const lastLogRef   = useRef<number | null>(null);
  useEffect(() => {
    if (!lastLogEntry) return;
    if (lastLogRef.current === lastLogEntry.attendeeId) return;
    lastLogRef.current = lastLogEntry.attendeeId;
    const targetId = lastLogEntry.attendeeId % 2 === 0 ? "kiosk-a" : "kiosk-b";
    setKiosks((prev) =>
      prev.map((k) => k.id === targetId ? { ...k, lastScanTs: lastLogEntry.timestamp } : k)
    );
  }, [lastLogEntry]);

  // Webhook timestamps
  const [whTs, setWhTs] = useState<Record<string, number>>(() =>
    Object.fromEntries(WEBHOOKS.map((w) => [w.id, Date.now() - Math.floor(Math.random() * 8000)]))
  );
  useEffect(() => {
    if (!lastLogEntry) return;
    WEBHOOKS.forEach((wh, i) => {
      setTimeout(() => setWhTs((prev) => ({ ...prev, [wh.id]: Date.now() })), i * 180);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.log.length]);

  // Avg check-in time
  const avgSec = (() => {
    if (state.log.length < 2) return null;
    const sorted = [...state.log].sort((a, b) => a.timestamp - b.timestamp);
    const diffs  = sorted.slice(1).map((e, i) => e.timestamp - sorted[i].timestamp);
    return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length / 1000);
  })();

  const METRIC_CARDS = [
    { label: "Events running today",  value: "1",                               color: BRAND.teal },
    { label: "Total check-ins",       value: checkedCount,                      color: BRAND.teal },
    { label: "Avg check-in time",     value: avgSec !== null ? `${avgSec}s` : "—", color: "#03ab81" },
    { label: "Badge print jobs",      value: checkedCount,                      color: "#BA7517" },
    { label: "Errors / failed scans", value: "0",                               color: "#D85A30" },
  ];

  const JOB_COLORS: Record<JobStatus, { text: string; bg: string }> = {
    queued:   { text: "#BA7517", bg: "rgba(186,117,23,0.12)" },
    printing: { text: BRAND.teal, bg: "rgba(3,171,129,0.12)" },
    done:     { text: BRAND.tealDark, bg: "rgba(3,171,129,0.08)" },
  };

  // Surface / card colours for dark ops theme
  const surface = "rgba(255,255,255,0.04)";
  const surfaceBorder = "rgba(255,255,255,0.07)";

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: BRAND.darkBgDeep }}>
      <ViewNav active="swapcard-ops" />

      {/* ── Ops header ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 py-3"
        style={{ backgroundColor: BRAND.darkBg, borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: BRAND.teal }}>
              S
            </div>
            <div>
              <div className="text-[11px] font-black tracking-[0.12em] text-white/70">SWAPCARD PLATFORM</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Internal Ops · EVT-2025-0042</div>
            </div>
          </div>
          <div
            className="text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "rgba(3,171,129,0.15)", color: BRAND.teal, border: `1px solid rgba(3,171,129,0.25)` }}
          >
            LIVE
          </div>
        </div>
        <div className="flex items-center gap-5">
          <HealthPill label="API" />
          <HealthPill label="DB" />
          <HealthPill label="Queue" />
          <HealthPill label="CDN" />
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="flex-shrink-0 flex gap-3 px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {METRIC_CARDS.map((m) => (
          <div key={m.label} className="flex-1 rounded-xl px-4 py-3" style={{ backgroundColor: surface, border: `1px solid ${surfaceBorder}` }}>
            <div className="text-[9px] uppercase tracking-widest font-bold mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
              {m.label}
            </div>
            <div className="text-3xl font-black tabular-nums" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── Main: feed + system panel ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Activity stream (60%) */}
        <div className="flex flex-col overflow-hidden" style={{ width: "60%", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: BRAND.teal }} />
            <span className="text-xs font-bold text-white">Activity Stream</span>
            <span
              className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded"
              style={{ backgroundColor: surface, color: "rgba(255,255,255,0.3)" }}
            >
              {state.log.length} events
            </span>
          </div>
          <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-3">
            {state.log.length === 0 ? (
              <div className="font-mono text-[11px] py-2 px-3 rounded" style={{ backgroundColor: surface, color: "rgba(255,255,255,0.2)" }}>
                <span style={{ color: "rgba(255,255,255,0.12)" }}>[system]</span>{" "}
                Waiting for first check-in event…
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {state.log.map((entry) => <LogLine key={entry.id} entry={entry} />)}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* System panel (40%) */}
        <div className="flex flex-col overflow-y-auto hide-scrollbar" style={{ width: "40%" }}>

          {/* Badge print queue */}
          <div className="flex-shrink-0 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              Badge Print Queue
            </div>
            {jobs.length === 0 ? (
              <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.18)" }}>No print jobs yet</div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <AnimatePresence initial={false}>
                  {jobs.slice(0, 6).map((job) => {
                    const jc = JOB_COLORS[job.status];
                    return (
                      <motion.div
                        key={job.jobId}
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        transition={{ duration: 0.18 }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: surface, border: `1px solid ${surfaceBorder}` }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{job.jobId}</div>
                          <div className="text-[11px] font-semibold text-white truncate">{job.name}</div>
                        </div>
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: jc.bg, color: jc.text }}
                        >
                          {job.status}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Active kiosk sessions */}
          <div className="flex-shrink-0 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              Active Kiosk Sessions
            </div>
            <div className="flex flex-col gap-2">
              {kiosks.map((k) => {
                const lastSec  = k.lastScanTs ? secsAgo(k.lastScanTs, now) : null;
                const isActive = lastSec !== null && lastSec < 5;
                return (
                  <div
                    key={k.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: surface, border: `1px solid ${surfaceBorder}` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? BRAND.teal : "rgba(255,255,255,0.2)" }} />
                      <span className="text-xs font-semibold text-white">{k.label}</span>
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: isActive ? BRAND.teal : "rgba(255,255,255,0.3)" }}>
                      {k.lastScanTs ? (isActive ? "scanning…" : `last scan ${lastSec}s ago`) : "idle"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Webhook delivery log */}
          <div className="flex-shrink-0 px-5 py-4">
            <div className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              Webhook Delivery Log
            </div>
            <div className="flex flex-col gap-2">
              {WEBHOOKS.map((wh) => {
                const secs = secsAgo(whTs[wh.id], now);
                return (
                  <div key={wh.id} className="rounded-lg px-3 py-3" style={{ backgroundColor: surface, border: `1px solid ${surfaceBorder}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold" style={{ color: BRAND.teal }}>{wh.name}</span>
                      <span className="text-[10px] tabular-nums font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{secs}s ago</span>
                    </div>
                    <div className="font-mono text-[9px] truncate" style={{ color: "rgba(255,255,255,0.18)" }}>{wh.endpoint}</div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: BRAND.teal }} />
                      <span className="text-[9px] font-semibold" style={{ color: BRAND.teal }}>200 OK</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
