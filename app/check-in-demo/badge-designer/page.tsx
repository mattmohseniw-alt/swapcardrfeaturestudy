"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckIn } from "../context";
import {
  MOCK_ATTENDEES, TYPE_COLORS, BRAND,
  BadgeConfig, DEFAULT_BADGE_CONFIG,
} from "@/components/CheckInDemo/types";
import ViewNav from "@/components/CheckInDemo/ViewNav";
import SwapcardLogo from "@/components/CheckInDemo/SwapcardLogo";

// ─── QR code ──────────────────────────────────────────────────────────────────

function buildQR(): boolean[] {
  const N = 21;
  const g = new Array<boolean>(N * N).fill(false);
  const s = (r: number, c: number, v: boolean) => { g[r * N + c] = v; };
  const finder = (sr: number, sc: number) => {
    for (let dr = 0; dr < 7; dr++)
      for (let dc = 0; dc < 7; dc++)
        s(sr + dr, sc + dc, dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
  };
  finder(0, 0); finder(0, 14); finder(14, 0);
  for (let i = 8; i <= 12; i++) { s(6, i, i % 2 === 0); s(i, 6, i % 2 === 0); }
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (r <= 7 && c <= 7) continue; if (r <= 7 && c >= 13) continue;
      if (r >= 13 && c <= 7) continue; if (r === 6 || c === 6) continue;
      s(r, c, ((r * 7 + c * 13 + r * c * 3) % 5) < 3);
    }
  return g;
}
const QR_CELLS = buildQR();
const QR_N = 21;

function QRMini({ dim, color }: { dim: number; color: string }) {
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${QR_N} ${QR_N}`} shapeRendering="crispEdges" style={{ flexShrink: 0 }}>
      {QR_CELLS.map((f, i) => f
        ? <rect key={i} x={i % QR_N} y={Math.floor(i / QR_N)} width={1} height={1} fill={color} />
        : null)}
    </svg>
  );
}

// ─── Size definitions ─────────────────────────────────────────────────────────

const SIZE_DIMS: Record<BadgeConfig["badgeSize"], { w: number; h: number; label: string }> = {
  standard: { w: 560, h: 320, label: "3.5 × 2 inches" },
  tall:     { w: 460, h: 345, label: "4 × 3 inches"   },
  lanyard:  { w: 320, h: 452, label: "4.25 × 6 inches" },
};

// ─── Badge preview ────────────────────────────────────────────────────────────

function BadgePreview({ config, attendeeId }: { config: BadgeConfig; attendeeId: number }) {
  const attendee = MOCK_ATTENDEES.find((a) => a.id === attendeeId) ?? MOCK_ATTENDEES[0];
  const { w, h, label } = SIZE_DIMS[config.badgeSize];
  const tc = TYPE_COLORS[attendee.type];

  const bgColor =
    config.background === "white" ? "#ffffff"
    : config.background === "light" ? BRAND.pageBg
    : config.background === "dark"  ? BRAND.darkBg
    : config.primaryColor;

  const isDark = config.background === "dark" || config.background === "brand";
  const bodyText = isDark ? "rgba(255,255,255,0.95)" : config.primaryColor;
  const subText  = isDark ? "rgba(255,255,255,0.5)"  : BRAND.muted;
  const qrColor  = isDark ? "rgba(255,255,255,0.8)"  : config.primaryColor;

  const fontFamily =
    config.fontStyle === "serif" ? "Georgia,'Times New Roman',serif"
    : config.fontStyle === "mono" ? "'Courier New',Courier,monospace"
    : "inherit";

  const namePx = config.nameFontSize === "small" ? 16 : config.nameFontSize === "medium" ? 22 : 28;

  const badge: React.CSSProperties = {
    width: w, height: h,
    backgroundColor: bgColor,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)",
    fontFamily,
    flexShrink: 0,
  };

  // Sponsor logo placeholder element
  function SponsorBox({ style }: { style: React.CSSProperties }) {
    return (
      <div style={{
        width: 52, height: 22, borderRadius: 3,
        backgroundColor: isDark ? "rgba(255,255,255,0.1)" : BRAND.border,
        border: `1px dashed ${isDark ? "rgba(255,255,255,0.2)" : BRAND.muted}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        ...style,
      }}>
        <span style={{ fontSize: 8, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.3)" : BRAND.muted, letterSpacing: "0.1em" }}>
          SPONSOR
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div style={badge}>
        {/* ── PREVIEW watermark ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: "rotate(-22deg)",
        }}>
          <span style={{
            fontSize: Math.min(w, h) * 0.13, fontWeight: 900,
            letterSpacing: "0.22em", userSelect: "none",
            color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.055)",
            textTransform: "uppercase",
          }}>
            PREVIEW
          </span>
        </div>

        {/* ════════ STANDARD LAYOUT ════════ */}
        {config.template === "standard" && (() => {
          const headerH = 42;
          const bodyH   = h - headerH;
          const qrDim   = Math.min(bodyH - 20, 90);
          return (
            <>
              {/* Header */}
              <div style={{ height: headerH, backgroundColor: config.primaryColor, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
                {config.fields.logoArea
                  ? <div style={{ width: 36, height: 18, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 3, border: "1px dashed rgba(255,255,255,0.3)" }} />
                  : <SwapcardLogo height={13} onDark />}
                {config.fields.eventName && (
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 9.5, letterSpacing: "0.04em" }}>Tech Summit 2025</span>
                )}
              </div>

              {/* Body */}
              <div style={{ display: "flex", height: bodyH }}>
                {/* Accent stripe */}
                <div style={{ width: 8, backgroundColor: config.accentColor, flexShrink: 0 }} />

                {/* Text content */}
                <div style={{ flex: 1, padding: "14px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: namePx, fontWeight: 900, color: bodyText, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                      {attendee.name}
                    </div>
                    {config.fields.org && (
                      <div style={{ fontSize: 11, color: subText, marginTop: 4 }}>{attendee.org}</div>
                    )}
                    {config.fields.jobTitle && (
                      <div style={{ fontSize: 11, color: subText, marginTop: 2 }}>Product Manager</div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {config.fields.typeBadge && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, backgroundColor: tc.fill, color: tc.bg }}>
                        {attendee.type}
                      </span>
                    )}
                    {config.sponsorLogo.show && config.sponsorLogo.position === "bottom-left" && (
                      <SponsorBox style={{}} />
                    )}
                  </div>
                </div>

                {/* QR column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 14px", gap: 8 }}>
                  {config.fields.qrCode && <QRMini dim={qrDim} color={qrColor} />}
                  {config.sponsorLogo.show && config.sponsorLogo.position === "top-right" && (
                    <SponsorBox style={{ marginTop: 4 }} />
                  )}
                </div>
              </div>

              {/* Bottom-center sponsor */}
              {config.sponsorLogo.show && config.sponsorLogo.position === "bottom-center" && (
                <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)" }}>
                  <SponsorBox style={{}} />
                </div>
              )}
            </>
          );
        })()}

        {/* ════════ NETWORKING LAYOUT ════════ */}
        {config.template === "networking" && (() => {
          const headerH = 32;
          const bodyH   = h - headerH;
          const qrDim   = Math.min(bodyH - 32, w * 0.3);
          return (
            <>
              {/* Slim header */}
              <div style={{ height: headerH, backgroundColor: config.primaryColor, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", flexShrink: 0 }}>
                {config.fields.eventName && (
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em" }}>
                    TECH SUMMIT 2025
                  </span>
                )}
                {config.fields.logoArea
                  ? <div style={{ width: 28, height: 14, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 2, border: "1px dashed rgba(255,255,255,0.3)" }} />
                  : <SwapcardLogo height={11} onDark />}
              </div>

              {/* Body: text left, QR right */}
              <div style={{ display: "flex", height: bodyH }}>
                {/* Left accent */}
                <div style={{ width: 6, backgroundColor: config.accentColor, flexShrink: 0 }} />

                {/* Text */}
                <div style={{ flex: 1, padding: "16px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: namePx, fontWeight: 900, color: bodyText, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                    {attendee.name}
                  </div>
                  {config.fields.org && (
                    <div style={{ fontSize: 11, color: subText, marginTop: 5 }}>{attendee.org}</div>
                  )}
                  {config.fields.jobTitle && (
                    <div style={{ fontSize: 11, color: subText, marginTop: 2 }}>Product Manager</div>
                  )}
                  {config.fields.typeBadge && (
                    <div style={{ marginTop: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, backgroundColor: tc.fill, color: tc.bg }}>
                        {attendee.type}
                      </span>
                    </div>
                  )}
                  {config.sponsorLogo.show && (
                    <SponsorBox style={{ marginTop: 12 }} />
                  )}
                </div>

                {/* QR panel */}
                {config.fields.qrCode && (
                  <div style={{
                    width: Math.round(w * 0.34), display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : BRAND.pageBg,
                    borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : BRAND.border}`,
                    padding: 12,
                  }}>
                    <QRMini dim={qrDim} color={qrColor} />
                  </div>
                )}
              </div>
            </>
          );
        })()}

        {/* ════════ VIP LAYOUT ════════ */}
        {config.template === "vip" && (() => {
          const footerH = 40;
          const bodyH   = h - footerH - 5;
          return (
            <>
              {/* Accent top bar */}
              <div style={{ height: 5, backgroundColor: config.accentColor }} />

              {/* Type chip top-right */}
              {config.fields.typeBadge && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  backgroundColor: config.accentColor, fontSize: 9.5, fontWeight: 800,
                  padding: "3px 12px", borderRadius: 99, letterSpacing: "0.1em",
                  color: isDark ? BRAND.darkBg : "#fff",
                }}>
                  {attendee.type}
                </div>
              )}

              {/* Centered body */}
              <div style={{
                position: "absolute", top: 5, left: 0, right: 0, bottom: footerH,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "24px 32px", gap: 4,
              }}>
                <div style={{ fontSize: namePx, fontWeight: 900, color: bodyText, textAlign: "center", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  {attendee.name}
                </div>
                {config.fields.org && (
                  <div style={{ fontSize: 11, color: subText, marginTop: 4, textAlign: "center" }}>{attendee.org}</div>
                )}
                {config.fields.jobTitle && (
                  <div style={{ fontSize: 11, color: subText, marginTop: 2, textAlign: "center" }}>Product Manager</div>
                )}
              </div>

              {/* Footer strip */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: footerH,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 14px",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              }}>
                {config.fields.qrCode
                  ? <QRMini dim={26} color={qrColor} />
                  : <div />}
                {config.fields.eventName && (
                  <span style={{ fontSize: 9, color: subText, letterSpacing: "0.1em" }}>TECH SUMMIT 2025</span>
                )}
                {config.sponsorLogo.show
                  ? <SponsorBox style={{ width: 40, height: 18 }} />
                  : config.fields.logoArea
                    ? <div style={{ width: 32, height: 14, backgroundColor: isDark ? "rgba(255,255,255,0.1)" : BRAND.border, borderRadius: 2 }} />
                    : <SwapcardLogo height={12} onDark={isDark} />}
              </div>
            </>
          );
        })()}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: BRAND.muted, textAlign: "center" }}>
        Actual size: {label}
      </div>
    </div>
  );
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: `1px solid ${BRAND.border}`, padding: "16px 0" }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.16em", color: BRAND.muted, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SegmentedControl<T extends string>({
  options, value, onChange,
}: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: "flex", gap: 2, backgroundColor: `${BRAND.border}55`, padding: 3, borderRadius: 8 }}>
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          flex: 1, padding: "5px 6px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "none",
          backgroundColor: value === opt.value ? "white" : "transparent",
          color: value === opt.value ? BRAND.navy : BRAND.muted,
          cursor: "pointer", transition: "all 0.12s",
          boxShadow: value === opt.value ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
        }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 10, border: "none", flexShrink: 0,
        backgroundColor: checked ? BRAND.teal : BRAND.border,
        cursor: disabled ? "default" : "pointer",
        position: "relative", transition: "background-color 0.18s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{
        width: 14, height: 14, borderRadius: 7, backgroundColor: "white",
        position: "absolute", top: 3, transition: "left 0.18s",
        left: checked ? 19 : 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function FieldRow({ label, checked, onChange, locked = false }: { label: string; checked: boolean; onChange: (v: boolean) => void; locked?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: locked ? BRAND.muted : BRAND.navy }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {locked && <span style={{ fontSize: 10, color: BRAND.muted }}>Always on</span>}
        <Toggle checked={checked} onChange={onChange} disabled={locked} />
      </div>
    </div>
  );
}

const COLOR_SWATCHES = ["#03ab81", "#262e3d", "#534AB7", "#D85A30", "#BA7517", "#0284C7"];

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: BRAND.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {/* Hex input */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: `1px solid ${BRAND.border}`, borderRadius: 8, backgroundColor: "white", flex: 1 }}>
          <div style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: value, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
            }}
            style={{ flex: 1, fontSize: 12, fontFamily: "'Courier New', monospace", border: "none", outline: "none", color: BRAND.navy, backgroundColor: "transparent" }}
          />
        </div>
        {/* Native colour picker */}
        <div style={{ position: "relative", width: 30, height: 30, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: value, border: `1px solid ${BRAND.border}`, cursor: "pointer" }} />
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
        </div>
      </div>
      {/* Swatches */}
      <div style={{ display: "flex", gap: 6 }}>
        {COLOR_SWATCHES.map((s) => (
          <button key={s} onClick={() => onChange(s)} style={{
            width: 22, height: 22, borderRadius: 4, backgroundColor: s, border: "none",
            cursor: "pointer", flexShrink: 0,
            outline: value === s ? `2px solid ${BRAND.navy}` : "2px solid transparent",
            outlineOffset: 1,
          }} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ id, active, onClick }: { id: BadgeConfig["template"]; active: boolean; onClick: () => void }) {
  const META: Record<BadgeConfig["template"], { label: string; desc: string }> = {
    standard:    { label: "Standard",    desc: "Name + org, type badge, QR right side" },
    networking:  { label: "Networking",  desc: "Large QR panel — great for scanning"   },
    vip:         { label: "VIP",         desc: "Centered name, dark accent, prestige"  },
  };
  const m = META[id];
  return (
    <button onClick={onClick} style={{
      padding: "10px 12px", borderRadius: 10, textAlign: "left", width: "100%",
      border: `2px solid ${active ? BRAND.teal : BRAND.border}`,
      backgroundColor: active ? BRAND.tealFaint : "white",
      cursor: "pointer", transition: "all 0.12s",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.navy }}>{m.label}</div>
      <div style={{ fontSize: 10, color: BRAND.muted, marginTop: 2 }}>{m.desc}</div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BadgeDesignerPage() {
  const { state, setBadgeConfig } = useCheckIn();
  const [config, setConfig] = useState<BadgeConfig>(state.badgeConfig);
  const [previewId, setPreviewId] = useState(1);
  const [applied, setApplied] = useState(false);

  function patch<K extends keyof BadgeConfig>(key: K, val: BadgeConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: val }));
  }
  function patchField(key: keyof BadgeConfig["fields"], val: boolean) {
    setConfig((prev) => ({ ...prev, fields: { ...prev.fields, [key]: val } }));
  }
  function patchSponsor(key: keyof BadgeConfig["sponsorLogo"], val: string | boolean) {
    setConfig((prev) => ({ ...prev, sponsorLogo: { ...prev.sponsorLogo, [key]: val } }));
  }

  function handleApply() {
    setBadgeConfig(config);
    setApplied(true);
    setTimeout(() => setApplied(false), 2200);
  }

  function handleDownload() {
    const spec = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      event: "Tech Summit 2025",
      badgeTemplate: config,
    };
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "badge-template-spec.json";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: BRAND.pageBg }}>
      <ViewNav active="badge-designer" />

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden hide-scrollbar"
          style={{ width: "40%", borderRight: `1px solid ${BRAND.border}`, backgroundColor: "white" }}
        >
          {/* Panel header */}
          <div className="flex-shrink-0 px-5 py-4" style={{ backgroundColor: BRAND.navy, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              Badge Designer
            </div>
            <div className="text-sm font-bold text-white mt-0.5">Template Builder</div>
          </div>

          {/* Scrollable controls */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-5">

            <ControlSection title="Template">
              <div className="flex flex-col gap-2">
                {(["standard", "networking", "vip"] as const).map((t) => (
                  <TemplateCard key={t} id={t} active={config.template === t} onClick={() => patch("template", t)} />
                ))}
              </div>
            </ControlSection>

            <ControlSection title="Preview Attendee">
              <select
                value={previewId}
                onChange={(e) => setPreviewId(Number(e.target.value))}
                className="w-full rounded-xl text-xs font-medium"
                style={{ padding: "8px 10px", border: `1px solid ${BRAND.border}`, color: BRAND.navy, backgroundColor: "white", outline: "none" }}
              >
                {MOCK_ATTENDEES.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} — {a.type}</option>
                ))}
              </select>
            </ControlSection>

            <ControlSection title="Badge Fields">
              <div className="flex flex-col gap-3">
                <FieldRow label="Attendee name"  checked={true}                  onChange={() => {}}                        locked />
                <FieldRow label="Organisation"   checked={config.fields.org}     onChange={(v) => patchField("org", v)} />
                <FieldRow label="Job title"      checked={config.fields.jobTitle} onChange={(v) => patchField("jobTitle", v)} />
                <FieldRow label="Type badge"     checked={config.fields.typeBadge} onChange={(v) => patchField("typeBadge", v)} />
                <FieldRow label="QR code"        checked={config.fields.qrCode}  onChange={(v) => patchField("qrCode", v)} />
                <FieldRow label="Event name"     checked={config.fields.eventName} onChange={(v) => patchField("eventName", v)} />
                <FieldRow label="Logo area"      checked={config.fields.logoArea} onChange={(v) => patchField("logoArea", v)} />
              </div>
            </ControlSection>

            <ControlSection title="Branding">
              <div className="flex flex-col gap-5">
                <ColorPicker label="Primary colour" value={config.primaryColor} onChange={(v) => patch("primaryColor", v)} />
                <ColorPicker label="Accent colour"  value={config.accentColor}  onChange={(v) => patch("accentColor", v)} />
                <div>
                  <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Background</div>
                  <SegmentedControl
                    options={[
                      { label: "White", value: "white" as const },
                      { label: "Light", value: "light" as const },
                      { label: "Dark",  value: "dark"  as const },
                      { label: "Brand", value: "brand" as const },
                    ]}
                    value={config.background}
                    onChange={(v) => patch("background", v)}
                  />
                </div>
              </div>
            </ControlSection>

            <ControlSection title="Typography">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Name size</div>
                  <SegmentedControl
                    options={[
                      { label: "Small",  value: "small"  as const },
                      { label: "Medium", value: "medium" as const },
                      { label: "Large",  value: "large"  as const },
                    ]}
                    value={config.nameFontSize}
                    onChange={(v) => patch("nameFontSize", v)}
                  />
                </div>
                <div>
                  <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Font style</div>
                  <SegmentedControl
                    options={[
                      { label: "Sans",  value: "sans"  as const },
                      { label: "Serif", value: "serif" as const },
                      { label: "Mono",  value: "mono"  as const },
                    ]}
                    value={config.fontStyle}
                    onChange={(v) => patch("fontStyle", v)}
                  />
                </div>
              </div>
            </ControlSection>

            <ControlSection title="Badge Size">
              <SegmentedControl
                options={[
                  { label: "Standard", value: "standard" as const },
                  { label: "Tall",     value: "tall"     as const },
                  { label: "Lanyard",  value: "lanyard"  as const },
                ]}
                value={config.badgeSize}
                onChange={(v) => patch("badgeSize", v)}
              />
            </ControlSection>

            <ControlSection title="Sponsor Logo">
              <div className="flex flex-col gap-3">
                <FieldRow label="Show sponsor logo" checked={config.sponsorLogo.show} onChange={(v) => patchSponsor("show", v)} />
                {config.sponsorLogo.show && (
                  <div>
                    <div className="text-[11px] mb-2" style={{ color: BRAND.muted }}>Position</div>
                    <SegmentedControl
                      options={[
                        { label: "Top-R",  value: "top-right"     as const },
                        { label: "Bot-L",  value: "bottom-left"   as const },
                        { label: "Bot-C",  value: "bottom-center" as const },
                      ]}
                      value={config.sponsorLogo.position}
                      onChange={(v) => patchSponsor("position", v)}
                    />
                  </div>
                )}
              </div>
            </ControlSection>

            {/* Reset defaults */}
            <div className="py-5">
              <button
                onClick={() => setConfig(DEFAULT_BADGE_CONFIG)}
                className="text-xs font-semibold transition-colors"
                style={{ color: BRAND.muted, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = BRAND.navy; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = BRAND.muted; }}
              >
                Reset to defaults
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="flex-1 flex flex-col items-center justify-center overflow-auto hide-scrollbar"
          style={{ backgroundColor: BRAND.pageBg, padding: 32 }}
        >
          {/* Preview label */}
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6" style={{ color: BRAND.muted }}>
            Live Preview
          </div>

          {/* Badge */}
          <div className="overflow-auto">
            <BadgePreview config={config} attendeeId={previewId} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-xs font-semibold rounded-xl transition-colors"
              style={{ padding: "10px 18px", border: `1px solid ${BRAND.border}`, backgroundColor: "white", color: BRAND.navy, cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = BRAND.pageBg; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "white"; }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Download template spec
            </button>

            <AnimatePresence mode="wait">
              <motion.button
                key={applied ? "applied" : "idle"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                onClick={handleApply}
                className="flex items-center gap-2 text-xs font-bold rounded-xl"
                style={{
                  padding: "10px 20px", border: "none",
                  backgroundColor: applied ? BRAND.teal : BRAND.navy,
                  color: "white", cursor: "pointer",
                  transition: "background-color 0.25s",
                }}
              >
                {applied
                  ? <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Applied to event
                    </>
                  : <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1l5 5-5 5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 6h10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                      Apply to event
                    </>
                }
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Info note */}
          <p className="text-[10px] text-center mt-4 max-w-sm" style={{ color: BRAND.muted, lineHeight: 1.6 }}>
            "Apply to event" updates badge style across all views — attendee ticket,
            staff kiosk, and badge print queue — in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
