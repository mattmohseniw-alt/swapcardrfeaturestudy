"use client";

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCheckIn } from "../context";
import {
  BRAND,
  DEFAULT_BADGE_CONFIG,
  MOCK_ATTENDEES,
  TYPE_COLORS,
  type Attendee,
  type AttendeeType,
  type BadgeConfig,
  type CheckInRecord,
} from "@/components/CheckInDemo/types";
import ViewNav from "@/components/CheckInDemo/ViewNav";
import SwapcardLogo from "@/components/CheckInDemo/SwapcardLogo";

type OrganizerTab = "attendees" | "badge" | "reports" | "settings";
type StatusFilter = "all" | "checked-in" | "pending";
type TypeFilter = "all" | AttendeeType;

const NAV_ITEMS: { id: OrganizerTab; label: string; icon: string }[] = [
  { id: "attendees", label: "Attendees", icon: "users" },
  { id: "badge", label: "Badge Design", icon: "badge" },
  { id: "reports", label: "Reports", icon: "chart" },
  { id: "settings", label: "Settings", icon: "gear" },
];

const TYPE_ORDER: AttendeeType[] = ["VIP", "Speaker", "Exhibitor", "Attendee"];

function NavIcon({ name }: { name: string }) {
  const cls = "flex-shrink-0";
  if (name === "users") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cls}>
        <circle cx="5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M1 11.5c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="10.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M13 11c0-1.7-1.1-3.1-2.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "badge") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cls}>
        <rect x="2" y="3" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 1h4v3.5a2 2 0 0 1-4 0V1z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4.5 8.5h5M4.5 10.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "chart") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cls}>
        <path d="M1.5 12V8.5M5 12V6M8.5 12V3.5M12 12V1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cls}>
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3.1 3.1l.7.7M10.2 10.2l.7.7M10.9 3.1l-.7.7M3.8 10.2l-.7.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SurfaceCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl bg-white ${className}`}
      style={{ boxShadow: BRAND.cardShadow, border: `1px solid ${BRAND.border}`, ...style }}
    >
      {children}
    </div>
  );
}

function Sidebar({
  activeTab,
  onTabChange,
  checkedCount,
  total,
}: {
  activeTab: OrganizerTab;
  onTabChange: (tab: OrganizerTab) => void;
  checkedCount: number;
  total: number;
}) {
  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{
        width: 228,
        backgroundColor: BRAND.navy,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-5 py-5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <SwapcardLogo height={20} onDark />
        <div className="mt-1 text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
          ORGANIZER STUDIO
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors"
              style={{
                backgroundColor: active ? "rgba(3,171,129,0.16)" : "transparent",
                color: active ? BRAND.teal : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <NavIcon name={item.icon} />
              <span className="text-[13px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Active Event
        </div>
        <div className="text-xs font-semibold text-white mb-1.5">Tech Summit 2025</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: BRAND.teal }} />
          <span className="text-[11px] font-semibold" style={{ color: BRAND.teal }}>
            LIVE · {checkedCount}/{total} checked in
          </span>
        </div>
      </div>
    </div>
  );
}

function ReprintToast({ msg }: { msg: string | null }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: BRAND.navy,
            color: "white",
            border: "1px solid rgba(3,171,129,0.25)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: BRAND.teal }}>
            <rect x="2" y="5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: BRAND.pageBg }}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{
              backgroundColor: active ? "white" : "transparent",
              color: active ? BRAND.navy : BRAND.muted,
              border: "none",
              cursor: "pointer",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 38,
        height: 22,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        backgroundColor: checked ? BRAND.teal : BRAND.border,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 19 : 3,
          width: 16,
          height: 16,
          borderRadius: 999,
          backgroundColor: "white",
          transition: "left 0.16s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
        }}
      />
    </button>
  );
}

function BadgePreview({
  attendee,
  config,
}: {
  attendee: Attendee;
  config: BadgeConfig;
}) {
  const typeColor = TYPE_COLORS[attendee.type];
  const bgColor =
    config.background === "white"
      ? "#ffffff"
      : config.background === "light"
        ? BRAND.pageBg
        : config.background === "dark"
          ? BRAND.darkBg
          : config.primaryColor;
  const dark = config.background === "dark" || config.background === "brand";
  const textColor = dark ? "rgba(255,255,255,0.96)" : BRAND.navy;
  const subColor = dark ? "rgba(255,255,255,0.55)" : BRAND.muted;

  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          width: 420,
          maxWidth: "100%",
          backgroundColor: bgColor,
          boxShadow: "0 24px 60px rgba(38,46,61,0.18)",
          border: dark ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${BRAND.border}`,
        }}
      >
        <div className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: config.primaryColor }}>
          {config.fields.logoArea ? (
            <div className="w-12 h-5 rounded bg-white/20 border border-dashed border-white/35" />
          ) : (
            <SwapcardLogo height={14} onDark />
          )}
          {config.fields.eventName && (
            <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Tech Summit 2025
            </span>
          )}
        </div>
        <div className="flex min-h-[220px]">
          <div className="w-2 flex-shrink-0" style={{ backgroundColor: config.accentColor }} />
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="text-[30px] font-black leading-none" style={{ color: textColor, letterSpacing: "-0.03em" }}>
                {attendee.name}
              </div>
              {config.fields.org && (
                <div className="text-sm mt-2" style={{ color: subColor }}>{attendee.org}</div>
              )}
              {config.fields.jobTitle && (
                <div className="text-sm mt-1" style={{ color: subColor }}>Product Manager</div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {config.fields.typeBadge && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: typeColor.fill, color: typeColor.bg }}>
                  {attendee.type}
                </span>
              )}
              {config.sponsorLogo.show && (
                <div
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold"
                  style={{
                    color: subColor,
                    border: dark ? "1px dashed rgba(255,255,255,0.28)" : `1px dashed ${BRAND.muted}`,
                  }}
                >
                  SPONSOR
                </div>
              )}
            </div>
          </div>
          {config.fields.qrCode && (
            <div
              className="w-[118px] flex items-center justify-center"
              style={{
                backgroundColor: dark ? "rgba(255,255,255,0.04)" : BRAND.pageBg,
                borderLeft: dark ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${BRAND.border}`,
              }}
            >
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 36 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-2.5 h-2.5 rounded-[2px]"
                    style={{
                      backgroundColor: (index + attendee.id) % 3 === 0 ? config.primaryColor : "transparent",
                      border: (index + attendee.id) % 3 === 0 ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.08)" : BRAND.border}`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-[11px] mt-3" style={{ color: BRAND.muted }}>
        Applied changes propagate to attendee tickets and onsite print output.
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <SurfaceCard className="px-5 py-4">
      <div className="text-[11px] font-semibold mb-3" style={{ color: BRAND.muted }}>{label}</div>
      <div className="text-4xl font-black tabular-nums" style={{ color: accent }}>{value}</div>
    </SurfaceCard>
  );
}

function methodLabel(record?: CheckInRecord) {
  if (!record) return "Pending";
  return record.checkedInBy === "self" ? "Self-serve" : "Staff";
}

export default function OrganizerView() {
  const { state, checkIn, setBadgeConfig, reset } = useCheckIn();
  const toastTimerRef = useRef<number | null>(null);
  const [activeTab, setActiveTab] = useState<OrganizerTab>("attendees");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(MOCK_ATTENDEES[0]?.id ?? 1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [draftBadge, setDraftBadge] = useState<BadgeConfig>(state.badgeConfig);
  const [previewId, setPreviewId] = useState(MOCK_ATTENDEES[0]?.id ?? 1);
  const [applied, setApplied] = useState(false);
  const [reprintCount, setReprintCount] = useState(0);
  const [selfServeEnabled, setSelfServeEnabled] = useState(true);
  const [autoPrintEnabled, setAutoPrintEnabled] = useState(true);
  const [vipPriorityEnabled, setVipPriorityEnabled] = useState(true);
  const [staffReprintEnabled, setStaffReprintEnabled] = useState(true);

  const total = state.attendees.length;
  const checkedCount = Object.keys(state.checkedIn).length;
  const pendingCount = total - checkedCount;
  const vipOnsite = state.attendees.filter((attendee) => attendee.type === "VIP" && state.checkedIn[attendee.id]).length;
  const selfServeCount = Object.values(state.checkedIn).filter((record) => record.checkedInBy === "self").length;
  const staffAssistedCount = checkedCount - selfServeCount;
  const pct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  const selectedAttendee = state.attendees.find((attendee) => attendee.id === selectedId) ?? state.attendees[0];
  const previewAttendee = state.attendees.find((attendee) => attendee.id === previewId) ?? state.attendees[0];

  const filteredAttendees = useMemo(() => {
    return state.attendees.filter((attendee) => {
      const matchesSearch =
        search.trim().length === 0 ||
        attendee.name.toLowerCase().includes(search.toLowerCase()) ||
        attendee.org.toLowerCase().includes(search.toLowerCase());
      const record = state.checkedIn[attendee.id];
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "checked-in" && !!record) ||
        (statusFilter === "pending" && !record);
      const matchesType = typeFilter === "all" || attendee.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, state.attendees, state.checkedIn, statusFilter, typeFilter]);

  const latestCheckIn = state.log[0];
  const earliestCheckIn = state.log[state.log.length - 1];

  const recentArrivals = useMemo(() => {
    return state.log.slice(0, 6);
  }, [state.log]);

  const typeMetrics = TYPE_ORDER.map((type) => {
    const totalByType = state.attendees.filter((attendee) => attendee.type === type).length;
    const checkedByType = state.attendees.filter((attendee) => attendee.type === type && state.checkedIn[attendee.id]).length;
    return {
      type,
      total: totalByType,
      checked: checkedByType,
      pct: totalByType > 0 ? Math.round((checkedByType / totalByType) * 100) : 0,
    };
  });

  function pushToast(message: string) {
    setToastMsg(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 2200);
  }

  function handleReprint(name: string) {
    if (!staffReprintEnabled) return;
    setReprintCount((count) => count + 1);
    pushToast(`Badge reprint queued · ${name}`);
  }

  function handleCheckIn(attendeeId: number) {
    checkIn(attendeeId, selfServeEnabled ? "self" : "staff");
  }

  function patchBadge<K extends keyof BadgeConfig>(key: K, value: BadgeConfig[K]) {
    setDraftBadge((current) => ({ ...current, [key]: value }));
  }

  function patchBadgeField(key: keyof BadgeConfig["fields"], value: boolean) {
    setDraftBadge((current) => ({ ...current, fields: { ...current.fields, [key]: value } }));
  }

  function patchBadgeSponsor(key: keyof BadgeConfig["sponsorLogo"], value: BadgeConfig["sponsorLogo"][typeof key]) {
    setDraftBadge((current) => ({ ...current, sponsorLogo: { ...current.sponsorLogo, [key]: value } }));
  }

  function applyBadgePreset(preset: BadgeConfig["template"]) {
    if (preset === "standard") {
      setDraftBadge({ ...DEFAULT_BADGE_CONFIG, template: "standard" });
    }
    if (preset === "networking") {
      setDraftBadge({
        ...DEFAULT_BADGE_CONFIG,
        template: "networking",
        primaryColor: BRAND.navy,
        accentColor: BRAND.teal,
        background: "white",
        fields: { ...DEFAULT_BADGE_CONFIG.fields, jobTitle: true },
      });
    }
    if (preset === "vip") {
      setDraftBadge({
        ...DEFAULT_BADGE_CONFIG,
        template: "vip",
        primaryColor: "#232046",
        accentColor: "#e3c75f",
        background: "dark",
        sponsorLogo: { show: false, position: "bottom-center" },
      });
    }
  }

  function handleApplyBadge() {
    setBadgeConfig(draftBadge);
    setApplied(true);
    pushToast("Badge design applied to event");
    window.setTimeout(() => setApplied(false), 2200);
  }

  const badgeFieldControls: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }[] = [
    { label: "Organisation", checked: draftBadge.fields.org, onChange: (value) => patchBadgeField("org", value) },
    { label: "Job title", checked: draftBadge.fields.jobTitle, onChange: (value) => patchBadgeField("jobTitle", value) },
    { label: "Type badge", checked: draftBadge.fields.typeBadge, onChange: (value) => patchBadgeField("typeBadge", value) },
    { label: "QR code", checked: draftBadge.fields.qrCode, onChange: (value) => patchBadgeField("qrCode", value) },
    { label: "Event name", checked: draftBadge.fields.eventName, onChange: (value) => patchBadgeField("eventName", value) },
    { label: "Logo area", checked: draftBadge.fields.logoArea, onChange: (value) => patchBadgeField("logoArea", value) },
  ];

  const onsiteControls: {
    label: string;
    value: boolean;
    setter: (value: boolean) => void;
  }[] = [
    { label: "Enable self-serve check-in", value: selfServeEnabled, setter: setSelfServeEnabled },
    { label: "Enable automatic badge printing", value: autoPrintEnabled, setter: setAutoPrintEnabled },
    { label: "Enable VIP fast-track highlighting", value: vipPriorityEnabled, setter: setVipPriorityEnabled },
    { label: "Allow staff badge reprints", value: staffReprintEnabled, setter: setStaffReprintEnabled },
  ];

  function renderAttendeesTab() {
    return (
      <div className="px-8 py-6 max-w-[1240px]">
        <div className="mb-6">
          <h1 className="text-2xl font-black" style={{ color: BRAND.navy, letterSpacing: "-0.03em" }}>
            Attendees
          </h1>
          <p className="text-sm mt-1" style={{ color: BRAND.muted }}>
            Live roster, check-in activity, and badge operations in one workspace.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard label="Registered" value={total} accent={BRAND.navy} />
          <MetricCard label="Checked In" value={checkedCount} accent={BRAND.teal} />
          <MetricCard label="Pending" value={pendingCount} accent="#BA7517" />
          <MetricCard label="VIP Onsite" value={vipOnsite} accent="#534AB7" />
        </div>

        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "1.3fr 0.7fr" }}>
          <SurfaceCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-bold" style={{ color: BRAND.navy }}>Arrival Progress</div>
                <div className="text-[11px] mt-1" style={{ color: BRAND.muted }}>
                  {checkedCount} of {total} attendees are onsite
                </div>
              </div>
              <div className="text-3xl font-black" style={{ color: BRAND.teal }}>{pct}%</div>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-5" style={{ backgroundColor: BRAND.tealLight }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: BRAND.teal }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {typeMetrics.map((metric) => {
                const colors = TYPE_COLORS[metric.type];
                return (
                  <div key={metric.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.fill, color: colors.bg }}>
                        {metric.type}
                      </span>
                      <span className="text-[11px] font-semibold tabular-nums" style={{ color: BRAND.navyMid }}>
                        {metric.checked}/{metric.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.fill }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors.bg }}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.pct}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
              <div>
                <div className="text-sm font-bold" style={{ color: BRAND.navy }}>Live Feed</div>
                <div className="text-[11px] mt-1" style={{ color: BRAND.muted }}>Most recent onsite activity</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: BRAND.tealLight, color: BRAND.teal }}>
                {state.log.length} events
              </span>
            </div>
            <div className="px-3 py-3 max-h-[290px] overflow-y-auto hide-scrollbar">
              {recentArrivals.length === 0 ? (
                <div className="px-3 py-10 text-center text-xs font-medium" style={{ color: BRAND.muted }}>
                  Waiting for first check-in...
                </div>
              ) : (
                recentArrivals.map((entry) => {
                  const colors = TYPE_COLORS[entry.type];
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
                      style={{ backgroundColor: entry.type === "VIP" ? "#f5f3ff" : BRAND.pageBg }}
                    >
                      <div className="w-8 h-8 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                        {entry.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: BRAND.navy }}>{entry.name}</div>
                        <div className="text-[10px]" style={{ color: BRAND.muted }}>
                          {entry.time} · {entry.checkedInBy === "self" ? "self-serve" : "staff assisted"}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.fill, color: colors.bg }}>
                        {entry.type}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </SurfaceCard>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "1.35fr 0.65fr" }}>
          <SurfaceCard className="overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-sm font-bold" style={{ color: BRAND.navy }}>Roster</div>
                  <div className="text-[11px] mt-1" style={{ color: BRAND.muted }}>
                    Search attendees, action pending arrivals, and queue reprints.
                  </div>
                </div>
                <div className="text-[11px] font-semibold" style={{ color: BRAND.muted }}>
                  Showing {filteredAttendees.length} attendees
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by attendee or company"
                  className="flex-1 rounded-xl px-3 py-2 text-sm"
                  style={{ border: `1px solid ${BRAND.border}`, outline: "none", color: BRAND.navy }}
                />
                <SegmentedControl
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: "All", value: "all" },
                    { label: "Checked in", value: "checked-in" },
                    { label: "Pending", value: "pending" },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {([{ label: "All types", value: "all" }, ...TYPE_ORDER.map((type) => ({ label: type, value: type }))] as const).map((item) => {
                  const active = typeFilter === item.value;
                  const colors = item.value === "all" ? null : TYPE_COLORS[item.value];
                  return (
                    <button
                      key={item.value}
                      onClick={() => setTypeFilter(item.value)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        border: active ? "none" : `1px solid ${colors ? colors.fill : BRAND.border}`,
                        backgroundColor: active ? (colors ? colors.bg : BRAND.navy) : (colors ? colors.fill : "white"),
                        color: active ? "white" : (colors ? colors.bg : BRAND.navyMid),
                        cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="grid px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
              style={{
                gridTemplateColumns: "1.2fr 1fr 110px 120px 90px 98px",
                backgroundColor: BRAND.pageBg,
                color: BRAND.muted,
                borderBottom: `1px solid ${BRAND.border}`,
              }}
            >
              <span>Name</span>
              <span>Company</span>
              <span>Type</span>
              <span>Status</span>
              <span>Method</span>
              <span />
            </div>

            <div className="max-h-[520px] overflow-y-auto hide-scrollbar">
              {filteredAttendees.map((attendee, index) => {
                const record = state.checkedIn[attendee.id];
                const checked = !!record;
                const colors = TYPE_COLORS[attendee.type];
                const selected = attendee.id === selectedId;
                return (
                  <div
                    key={attendee.id}
                    className="grid items-center px-5 py-3"
                    style={{
                      gridTemplateColumns: "1.2fr 1fr 110px 120px 90px 98px",
                      backgroundColor: selected ? "#eef8f5" : index % 2 === 0 ? "white" : BRAND.pageBg,
                      borderBottom: `1px solid ${BRAND.border}`,
                    }}
                  >
                    <button
                      onClick={() => setSelectedId(attendee.id)}
                      className="flex items-center gap-2.5 text-left"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      <div className="w-8 h-8 rounded-full text-[11px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                        {attendee.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: BRAND.navy }}>{attendee.name}</div>
                        <div className="text-[10px]" style={{ color: BRAND.muted }}>ID {String(attendee.id).padStart(3, "0")}</div>
                      </div>
                    </button>

                    <span className="text-xs truncate" style={{ color: BRAND.navyLight }}>{attendee.org}</span>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: colors.fill, color: colors.bg }}>
                      {attendee.type}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: checked ? BRAND.teal : BRAND.border }} />
                      <span className="text-xs font-semibold" style={{ color: checked ? BRAND.teal : BRAND.muted }}>
                        {checked ? "Checked in" : "Pending"}
                      </span>
                    </div>

                    <span className="text-xs" style={{ color: BRAND.navyLight }}>{methodLabel(record)}</span>

                    {checked ? (
                      <button
                        onClick={() => handleReprint(attendee.name)}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "white",
                          color: staffReprintEnabled ? BRAND.navyMid : BRAND.muted,
                          border: `1px solid ${BRAND.border}`,
                          cursor: staffReprintEnabled ? "pointer" : "not-allowed",
                        }}
                      >
                        Reprint
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(attendee.id)}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: BRAND.teal, color: "white", border: "none", cursor: "pointer" }}
                      >
                        Check in
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </SurfaceCard>

          <div className="flex flex-col gap-4">
            <SurfaceCard className="p-5">
              <div className="text-sm font-bold mb-4" style={{ color: BRAND.navy }}>Selected Attendee</div>
              {selectedAttendee && (() => {
                const record = state.checkedIn[selectedAttendee.id];
                const colors = TYPE_COLORS[selectedAttendee.type];
                return (
                  <>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl text-sm font-bold text-white flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                        {selectedAttendee.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-black" style={{ color: BRAND.navy }}>{selectedAttendee.name}</div>
                        <div className="text-xs mt-1" style={{ color: BRAND.muted }}>{selectedAttendee.org}</div>
                        <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.fill, color: colors.bg }}>
                          {selectedAttendee.type}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl px-3 py-3" style={{ backgroundColor: BRAND.pageBg }}>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: BRAND.muted }}>
                          Status
                        </div>
                        <div className="text-xs font-semibold" style={{ color: record ? BRAND.teal : "#BA7517" }}>
                          {record ? "Checked in" : "Awaiting arrival"}
                        </div>
                      </div>
                      <div className="rounded-xl px-3 py-3" style={{ backgroundColor: BRAND.pageBg }}>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: BRAND.muted }}>
                          Method
                        </div>
                        <div className="text-xs font-semibold" style={{ color: BRAND.navy }}>
                          {methodLabel(record)}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl px-4 py-4 mb-4" style={{ backgroundColor: BRAND.pageBg }}>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: BRAND.muted }}>
                        Timeline
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: BRAND.navyMid }}>Registration created</span>
                          <span style={{ color: BRAND.muted }}>Apr 21 · 14:05</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: BRAND.navyMid }}>Badge template</span>
                          <span style={{ color: BRAND.muted }}>{state.badgeConfig.template}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: BRAND.navyMid }}>Onsite status</span>
                          <span style={{ color: record ? BRAND.teal : BRAND.muted }}>
                            {record ? `${record.time} · ${methodLabel(record)}` : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!record && (
                        <button
                          onClick={() => handleCheckIn(selectedAttendee.id)}
                          className="flex-1 text-xs font-bold px-3 py-2.5 rounded-xl"
                          style={{ backgroundColor: BRAND.teal, color: "white", border: "none", cursor: "pointer" }}
                        >
                          Check in attendee
                        </button>
                      )}
                      <button
                        onClick={() => handleReprint(selectedAttendee.name)}
                        className="flex-1 text-xs font-bold px-3 py-2.5 rounded-xl"
                        style={{
                          backgroundColor: "white",
                          color: staffReprintEnabled ? BRAND.navy : BRAND.muted,
                          border: `1px solid ${BRAND.border}`,
                          cursor: staffReprintEnabled ? "pointer" : "not-allowed",
                        }}
                      >
                        Reprint badge
                      </button>
                    </div>
                  </>
                );
              })()}
            </SurfaceCard>

            <SurfaceCard className="p-5">
              <div className="text-sm font-bold mb-4" style={{ color: BRAND.navy }}>Operational Notes</div>
              <div className="flex flex-col gap-3 text-xs">
                <div className="rounded-xl px-3 py-3" style={{ backgroundColor: BRAND.tealFaint, color: BRAND.tealDark }}>
                  Self-serve check-in is {selfServeEnabled ? "enabled" : "disabled"} for this event.
                </div>
                <div className="rounded-xl px-3 py-3" style={{ backgroundColor: "#f5f3ff", color: "#534AB7" }}>
                  VIP fast-track lane is {vipPriorityEnabled ? "active" : "paused"}.
                </div>
                <div className="rounded-xl px-3 py-3" style={{ backgroundColor: BRAND.pageBg, color: BRAND.navyMid }}>
                  {reprintCount} badge reprints queued this session.
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    );
  }

  function renderBadgeTab() {
    return (
      <div className="px-8 py-6 max-w-[1240px]">
        <div className="mb-6">
          <h1 className="text-2xl font-black" style={{ color: BRAND.navy, letterSpacing: "-0.03em" }}>
            Badge Design
          </h1>
          <p className="text-sm mt-1" style={{ color: BRAND.muted }}>
            Compact organizer controls for the onsite badge template with live event preview.
          </p>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "380px 1fr" }}>
          <SurfaceCard className="p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: BRAND.muted }}>
              Quick Presets
            </div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(["standard", "networking", "vip"] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyBadgePreset(preset)}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold capitalize"
                  style={{
                    border: draftBadge.template === preset ? `2px solid ${BRAND.teal}` : `1px solid ${BRAND.border}`,
                    backgroundColor: draftBadge.template === preset ? BRAND.tealFaint : "white",
                    color: BRAND.navy,
                    cursor: "pointer",
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Preview attendee</div>
                <select
                  value={previewId}
                  onChange={(event) => setPreviewId(Number(event.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm"
                  style={{ border: `1px solid ${BRAND.border}`, outline: "none", color: BRAND.navy, backgroundColor: "white" }}
                >
                  {state.attendees.map((attendee) => (
                    <option key={attendee.id} value={attendee.id}>
                      {attendee.name} - {attendee.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Primary color</div>
                <input type="color" value={draftBadge.primaryColor} onChange={(event) => patchBadge("primaryColor", event.target.value)} />
              </div>

              <div>
                <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Accent color</div>
                <input type="color" value={draftBadge.accentColor} onChange={(event) => patchBadge("accentColor", event.target.value)} />
              </div>

              <div>
                <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Background</div>
                <SegmentedControl
                  value={draftBadge.background}
                  onChange={(value) => patchBadge("background", value)}
                  options={[
                    { label: "White", value: "white" },
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "Brand", value: "brand" },
                  ]}
                />
              </div>

              <div>
                <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Badge size</div>
                <SegmentedControl
                  value={draftBadge.badgeSize}
                  onChange={(value) => patchBadge("badgeSize", value)}
                  options={[
                    { label: "Standard", value: "standard" },
                    { label: "Tall", value: "tall" },
                    { label: "Lanyard", value: "lanyard" },
                  ]}
                />
              </div>

              <div className="pt-1" style={{ borderTop: `1px solid ${BRAND.border}` }}>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3 mt-4" style={{ color: BRAND.muted }}>
                  Badge Fields
                </div>
                <div className="flex flex-col gap-3">
                  {badgeFieldControls.map((field) => (
                    <div key={field.label} className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: BRAND.navy }}>{field.label}</span>
                      <Toggle checked={field.checked} onChange={field.onChange} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1" style={{ borderTop: `1px solid ${BRAND.border}` }}>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3 mt-4" style={{ color: BRAND.muted }}>
                  Sponsor
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium" style={{ color: BRAND.navy }}>Show sponsor logo</span>
                  <Toggle checked={draftBadge.sponsorLogo.show} onChange={(value) => patchBadgeSponsor("show", value)} />
                </div>
                {draftBadge.sponsorLogo.show && (
                  <SegmentedControl
                    value={draftBadge.sponsorLogo.position}
                    onChange={(value) => patchBadgeSponsor("position", value)}
                    options={[
                      { label: "Top right", value: "top-right" },
                      { label: "Bottom left", value: "bottom-left" },
                      { label: "Bottom center", value: "bottom-center" },
                    ]}
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDraftBadge(state.badgeConfig)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl"
                  style={{ backgroundColor: "white", color: BRAND.navy, border: `1px solid ${BRAND.border}`, cursor: "pointer" }}
                >
                  Revert
                </button>
                <button
                  onClick={handleApplyBadge}
                  className="flex-1 text-xs font-bold px-4 py-2.5 rounded-xl"
                  style={{ backgroundColor: applied ? BRAND.teal : BRAND.navy, color: "white", border: "none", cursor: "pointer" }}
                >
                  {applied ? "Applied to event" : "Apply to event"}
                </button>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-8 flex items-center justify-center" style={{ minHeight: 620 }}>
            {previewAttendee && <BadgePreview attendee={previewAttendee} config={draftBadge} />}
          </SurfaceCard>
        </div>
      </div>
    );
  }

  function renderReportsTab() {
    return (
      <div className="px-8 py-6 max-w-[1240px]">
        <div className="mb-6">
          <h1 className="text-2xl font-black" style={{ color: BRAND.navy, letterSpacing: "-0.03em" }}>
            Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: BRAND.muted }}>
            Read-only onsite health view for arrivals, channels, and badge operations.
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <MetricCard label="Arrival Rate" value={`${pct}%`} accent={BRAND.teal} />
          <MetricCard label="Self-serve" value={selfServeCount} accent="#0284C7" />
          <MetricCard label="Staff-assisted" value={staffAssistedCount} accent="#D85A30" />
          <MetricCard label="Badge Reprints" value={reprintCount} accent="#BA7517" />
          <MetricCard label="No-shows" value={pendingCount} accent={BRAND.navyMid} />
        </div>

        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <SurfaceCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold" style={{ color: BRAND.navy }}>Attendee Type Performance</div>
              <div className="text-[11px] font-semibold" style={{ color: BRAND.muted }}>Live</div>
            </div>
            <div className="flex flex-col gap-4">
              {typeMetrics.map((metric) => {
                const colors = TYPE_COLORS[metric.type];
                return (
                  <div key={metric.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: BRAND.navy }}>{metric.type}</span>
                      <span className="text-[11px] tabular-nums" style={{ color: BRAND.muted }}>
                        {metric.checked}/{metric.total}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.fill }}>
                      <div className="h-full rounded-full" style={{ width: `${metric.pct}%`, backgroundColor: colors.bg }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold" style={{ color: BRAND.navy }}>Check-in Channels</div>
              <div className="text-[11px] font-semibold" style={{ color: BRAND.muted }}>Current split</div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Self-serve", value: selfServeCount, color: "#0284C7" },
                { label: "Staff-assisted", value: staffAssistedCount, color: "#D85A30" },
              ].map((row) => {
                const width = checkedCount === 0 ? 0 : Math.round((row.value / checkedCount) * 100);
                return (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: BRAND.navy }}>{row.label}</span>
                      <span className="text-[11px] font-semibold tabular-nums" style={{ color: BRAND.muted }}>
                        {row.value} · {width}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: BRAND.pageBg }}>
                      <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: row.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SurfaceCard>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "0.8fr 1.2fr" }}>
          <SurfaceCard className="p-5">
            <div className="text-sm font-bold mb-4" style={{ color: BRAND.navy }}>Event Snapshot</div>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span style={{ color: BRAND.navyMid }}>First arrival</span>
                <span style={{ color: BRAND.navy }}>{earliestCheckIn ? earliestCheckIn.time : "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: BRAND.navyMid }}>Latest arrival</span>
                <span style={{ color: BRAND.navy }}>{latestCheckIn ? latestCheckIn.time : "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: BRAND.navyMid }}>Auto-print</span>
                <span style={{ color: BRAND.navy }}>{autoPrintEnabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: BRAND.navyMid }}>Template</span>
                <span style={{ color: BRAND.navy, textTransform: "capitalize" }}>{state.badgeConfig.template}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: BRAND.navyMid }}>VIP priority</span>
                <span style={{ color: BRAND.navy }}>{vipPriorityEnabled ? "Active" : "Off"}</span>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
              <div className="text-sm font-bold" style={{ color: BRAND.navy }}>Recent Activity</div>
              <button
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: "white", color: BRAND.navy, border: `1px solid ${BRAND.border}`, cursor: "pointer" }}
              >
                Export CSV
              </button>
            </div>
            <div className="max-h-[430px] overflow-y-auto hide-scrollbar px-4 py-3">
              {state.log.length === 0 ? (
                <div className="py-12 text-center text-xs" style={{ color: BRAND.muted }}>
                  Activity appears here after check-in events.
                </div>
              ) : (
                state.log.map((entry) => {
                  const colors = TYPE_COLORS[entry.type];
                  return (
                    <div key={entry.id} className="flex items-center gap-3 px-2 py-2.5" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                      <div className="w-8 h-8 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                        {entry.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: BRAND.navy }}>{entry.name}</div>
                        <div className="text-[10px]" style={{ color: BRAND.muted }}>
                          {entry.time} · {entry.checkedInBy === "self" ? "self-serve entry" : "staff desk check-in"}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.fill, color: colors.bg }}>
                        {entry.type}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </SurfaceCard>
        </div>
      </div>
    );
  }

  function renderSettingsTab() {
    return (
      <div className="px-8 py-6 max-w-[1040px]">
        <div className="mb-6">
          <h1 className="text-2xl font-black" style={{ color: BRAND.navy, letterSpacing: "-0.03em" }}>
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: BRAND.muted }}>
            Limited onsite controls for check-in behavior, badge defaults, and staff safety actions.
          </p>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <SurfaceCard className="p-5">
            <div className="text-sm font-bold mb-4" style={{ color: BRAND.navy }}>Onsite Controls</div>
            <div className="flex flex-col gap-4">
              {onsiteControls.map((control) => (
                <div key={control.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: BRAND.pageBg }}>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: BRAND.navy }}>{control.label}</div>
                    <div className="text-[11px] mt-1" style={{ color: BRAND.muted }}>
                      {control.value ? "Enabled for current event" : "Disabled for current event"}
                    </div>
                  </div>
                  <Toggle checked={control.value} onChange={control.setter} />
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <div className="text-sm font-bold mb-4" style={{ color: BRAND.navy }}>Event Defaults</div>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: BRAND.pageBg }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: BRAND.muted }}>
                  Event
                </div>
                <div className="text-sm font-semibold" style={{ color: BRAND.navy }}>Tech Summit 2025</div>
                <div className="text-xs mt-1" style={{ color: BRAND.muted }}>Hall A · Live check-in simulation</div>
              </div>
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: BRAND.pageBg }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: BRAND.muted }}>
                  Badge Template
                </div>
                <div className="text-sm font-semibold capitalize" style={{ color: BRAND.navy }}>{state.badgeConfig.template}</div>
                <div className="text-xs mt-1" style={{ color: BRAND.muted }}>
                  Primary {state.badgeConfig.primaryColor} · Accent {state.badgeConfig.accentColor}
                </div>
              </div>
              <button
                onClick={() => {
                  setDraftBadge(DEFAULT_BADGE_CONFIG);
                  setBadgeConfig(DEFAULT_BADGE_CONFIG);
                  pushToast("Default badge template restored");
                }}
                className="text-xs font-bold px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "white", color: BRAND.navy, border: `1px solid ${BRAND.border}`, cursor: "pointer" }}
              >
                Restore default badge template
              </button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <div className="text-sm font-bold mb-4" style={{ color: BRAND.navy }}>Staff Access</div>
            <div className="flex flex-col gap-3 text-xs">
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: BRAND.pageBg }}>
                Front desk team can search, check in, and reprint badges.
              </div>
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: BRAND.pageBg }}>
                Organizer workspace keeps reporting read-only and operational controls local to this event.
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <div className="text-sm font-bold mb-4" style={{ color: BRAND.navy }}>Safety Actions</div>
            <div className="rounded-xl px-4 py-4 mb-4" style={{ backgroundColor: "#fff3f0", border: "1px solid #ffd9cf" }}>
              <div className="text-xs font-semibold" style={{ color: "#a84320" }}>
                Reset clears attendee check-ins, live feed entries, and kiosk state across the demo.
              </div>
            </div>
            <button
              onClick={() => {
                reset();
                setReprintCount(0);
                pushToast("Demo event reset");
              }}
              className="text-xs font-bold px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: "#D85A30", color: "white", border: "none", cursor: "pointer" }}
            >
              Reset event state
            </button>
          </SurfaceCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: BRAND.pageBg }}>
      <ViewNav active="organizer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} checkedCount={checkedCount} total={total} />
        <div className="flex-1 overflow-y-auto hide-scrollbar" style={{ backgroundColor: BRAND.pageBg }}>
          {activeTab === "attendees" && renderAttendeesTab()}
          {activeTab === "badge" && renderBadgeTab()}
          {activeTab === "reports" && renderReportsTab()}
          {activeTab === "settings" && renderSettingsTab()}
        </div>
      </div>
      <ReprintToast msg={toastMsg} />
    </div>
  );
}
