// ─── Enumerations ─────────────────────────────────────────────────────────────

export type AttendeeType  = "VIP" | "Attendee" | "Exhibitor" | "Speaker";
export type FilterType    = "all" | "attendee" | "vip" | "exhibitor" | "speaker";
export type KioskStatus   = "idle" | "scanning" | "success";
export type ActiveTab     = "checkin" | "dashboard" | "log";
export type CheckedInBy   = "self" | "staff";

// ─── Data shapes ──────────────────────────────────────────────────────────────

export interface Attendee {
  id: number;
  name: string;
  org: string;
  type: AttendeeType;
  initials: string;
}

export interface CheckInRecord {
  time: string;
  timestamp: number;
  checkedInBy: CheckedInBy;
}

export interface LogEntry {
  id: number;
  attendeeId: number;
  name: string;
  type: AttendeeType;
  time: string;
  timestamp: number;
  checkedInBy: CheckedInBy;
}

export interface KioskState {
  status: KioskStatus;
  attendee: Attendee | null;
}

/** Shared state — filter/tab state is per-view and not stored here */
export interface AppState {
  attendees: Attendee[];
  checkedIn: Record<number, CheckInRecord>;
  log: LogEntry[];
  kioskState: KioskState;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type Action =
  | { type: "CHECK_IN";  attendeeId: number; checkedInBy: CheckedInBy }
  | { type: "SET_KIOSK"; status: KioskStatus; attendee?: Attendee | null }
  | { type: "RESET" };

// ─── Type colour system ───────────────────────────────────────────────────────

export const TYPE_COLORS: Record<
  AttendeeType,
  { bg: string; fill: string; text: string; stripe: string }
> = {
  Attendee: { bg: "#1D9E75", fill: "#E1F5EE", text: "#0d5c42", stripe: "#1D9E75" },
  VIP:      { bg: "#534AB7", fill: "#EEEDFE", text: "#2d268a", stripe: "#534AB7" },
  Exhibitor:{ bg: "#BA7517", fill: "#FAEEDA", text: "#7a4d0e", stripe: "#BA7517" },
  Speaker:  { bg: "#D85A30", fill: "#FAECE7", text: "#8c3417", stripe: "#D85A30" },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_ATTENDEES: Attendee[] = [
  { id: 1,  name: "Sarah Chen",    org: "Informa Markets", type: "VIP",      initials: "SC" },
  { id: 2,  name: "Marcus Webb",   org: "SME Group",       type: "Attendee", initials: "MW" },
  { id: 3,  name: "Priya Nair",    org: "Koelnmesse",      type: "Speaker",  initials: "PN" },
  { id: 4,  name: "Tom Eriksen",   org: "Qualys Inc.",     type: "Exhibitor",initials: "TE" },
  { id: 5,  name: "Aisha Diallo",  org: "PCMA",            type: "Attendee", initials: "AD" },
  { id: 6,  name: "James Okoro",   org: "Emerald",         type: "VIP",      initials: "JO" },
  { id: 7,  name: "Lena Müller",   org: "GES Worldwide",   type: "Exhibitor",initials: "LM" },
  { id: 8,  name: "Carlos Reyes",  org: "Tech Summit",     type: "Speaker",  initials: "CR" },
  { id: 9,  name: "Nina Park",     org: "Independent",     type: "Attendee", initials: "NP" },
  { id: 10, name: "David Lau",     org: "EventPro",        type: "Attendee", initials: "DL" },
];

// ─── Reducer ──────────────────────────────────────────────────────────────────

function nowString(): string {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export const INITIAL_STATE: AppState = {
  attendees: MOCK_ATTENDEES,
  checkedIn: {},
  log: [],
  kioskState: { status: "idle", attendee: null },
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "CHECK_IN": {
      if (state.checkedIn[action.attendeeId]) return state;
      const attendee = state.attendees.find((a) => a.id === action.attendeeId)!;
      const time = nowString();
      const timestamp = Date.now();
      return {
        ...state,
        checkedIn: {
          ...state.checkedIn,
          [action.attendeeId]: { time, timestamp, checkedInBy: action.checkedInBy },
        },
        log: [
          {
            id: state.log.length,
            attendeeId: action.attendeeId,
            name: attendee.name,
            type: attendee.type,
            time,
            timestamp,
            checkedInBy: action.checkedInBy,
          },
          ...state.log,
        ],
        kioskState: { status: "scanning", attendee },
      };
    }

    case "SET_KIOSK":
      return {
        ...state,
        kioskState: {
          status: action.status,
          attendee:
            action.status === "idle"
              ? null
              : action.attendee !== undefined
              ? action.attendee
              : state.kioskState.attendee,
        },
      };

    case "RESET":
      return { ...state, checkedIn: {}, log: [], kioskState: { status: "idle", attendee: null } };

    default:
      return state;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function calcAvgWait(log: LogEntry[]): string {
  if (log.length < 2) return "—";
  const sorted = [...log].sort((a, b) => a.timestamp - b.timestamp);
  const diffs = sorted.slice(1).map((e, i) => e.timestamp - sorted[i].timestamp);
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const s = Math.round(avg / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}
