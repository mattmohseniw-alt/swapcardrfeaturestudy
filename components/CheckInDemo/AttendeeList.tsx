"use client";

import { Attendee, CheckInRecord, FilterType, TYPE_COLORS, BRAND } from "./types";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All",       value: "all" },
  { label: "VIP",       value: "vip" },
  { label: "Exhibitor", value: "exhibitor" },
  { label: "Speaker",   value: "speaker" },
  { label: "Attendee",  value: "attendee" },
];

interface Props {
  attendees: Attendee[];
  checkedIn: Record<number, CheckInRecord>;
  activeFilter: FilterType;
  onCheckIn: (id: number) => void;
  onFilterChange: (f: FilterType) => void;
}

export default function AttendeeList({
  attendees,
  checkedIn,
  activeFilter,
  onCheckIn,
  onFilterChange,
}: Props) {
  const filtered = attendees.filter(
    (a) => activeFilter === "all" || a.type.toLowerCase() === activeFilter
  );

  const countByType: Record<string, number> = { all: attendees.length };
  attendees.forEach((a) => {
    const k = a.type.toLowerCase();
    countByType[k] = (countByType[k] ?? 0) + 1;
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Filter pills — horizontally scrollable */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 py-3 hide-scrollbar"
        style={{
          overflowX: "auto",
          borderBottom: `1px solid ${BRAND.border}`,
          backgroundColor: BRAND.cardBg,
        }}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f.value;
          const colors = f.value !== "all"
            ? TYPE_COLORS[f.label as keyof typeof TYPE_COLORS]
            : null;
          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 transition-all"
              style={{
                backgroundColor: active
                  ? (colors?.bg ?? BRAND.navy)
                  : (colors?.fill ?? BRAND.tealFaint),
                color: active
                  ? "#fff"
                  : (colors?.bg ?? BRAND.navyLight),
                border: active ? "none" : `1px solid ${colors?.fill ?? BRAND.border}`,
              }}
            >
              {f.label}
              <span
                className="text-[10px] font-bold rounded-full px-1 min-w-[16px] text-center"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)",
                  color: active ? "#fff" : "inherit",
                }}
              >
                {countByType[f.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Attendee list */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {filtered.length === 0 && (
          <div className="py-10 text-center text-xs" style={{ color: BRAND.muted }}>
            No attendees in this category
          </div>
        )}
        {filtered.map((a) => (
          <AttendeeRow
            key={a.id}
            attendee={a}
            isCheckedIn={!!checkedIn[a.id]}
            checkedInTime={checkedIn[a.id]?.time}
            colors={TYPE_COLORS[a.type]}
            onCheckIn={onCheckIn}
          />
        ))}
      </div>
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

interface RowProps {
  attendee: Attendee;
  isCheckedIn: boolean;
  checkedInTime?: string;
  colors: { bg: string; fill: string; text: string };
  onCheckIn: (id: number) => void;
}

function AttendeeRow({ attendee, isCheckedIn, checkedInTime, colors, onCheckIn }: RowProps) {
  return (
    <div
      onClick={() => !isCheckedIn && onCheckIn(attendee.id)}
      className="flex items-center gap-3 px-4"
      style={{
        paddingTop: 14,
        paddingBottom: 14,
        borderBottom: `1px solid ${BRAND.border}`,
        opacity: isCheckedIn ? 0.45 : 1,
        cursor: isCheckedIn ? "default" : "pointer",
        WebkitTapHighlightColor: "transparent",
        transition: "background-color 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!isCheckedIn) (e.currentTarget as HTMLDivElement).style.backgroundColor = BRAND.tealFaint;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
      }}
      onMouseDown={(e) => {
        if (!isCheckedIn) (e.currentTarget as HTMLDivElement).style.backgroundColor = BRAND.tealLight;
      }}
      onMouseUp={(e) => {
        if (!isCheckedIn) (e.currentTarget as HTMLDivElement).style.backgroundColor = BRAND.tealFaint;
      }}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white select-none"
        style={{ backgroundColor: colors.bg }}
      >
        {attendee.initials}
      </div>

      {/* Name + org */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: BRAND.navy }}>
          {attendee.name}
        </div>
        <div className="text-xs truncate mt-0.5" style={{ color: BRAND.muted }}>
          {attendee.org}
        </div>
      </div>

      {/* Right: badge + status */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: colors.fill, color: colors.bg }}
        >
          {attendee.type}
        </span>
        {isCheckedIn ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: BRAND.teal }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke={BRAND.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {checkedInTime}
          </span>
        ) : (
          <span className="text-[10px] font-semibold" style={{ color: BRAND.tealDark }}>
            Tap to check in
          </span>
        )}
      </div>
    </div>
  );
}
