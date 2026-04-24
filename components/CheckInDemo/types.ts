// ─── Badge config ─────────────────────────────────────────────────────────────

export interface BadgeConfig {
  template:      "standard" | "networking" | "vip";
  primaryColor:  string;
  accentColor:   string;
  background:    "white" | "light" | "dark" | "brand";
  fields: {
    org:       boolean;
    jobTitle:  boolean;
    typeBadge: boolean;
    qrCode:    boolean;
    eventName: boolean;
    logoArea:  boolean;
  };
  nameFontSize: "small" | "medium" | "large";
  fontStyle:    "sans" | "serif" | "mono";
  badgeSize:    "standard" | "tall" | "lanyard";
  sponsorLogo: {
    show:     boolean;
    position: "top-right" | "bottom-left" | "bottom-center";
  };
}

export const DEFAULT_BADGE_CONFIG: BadgeConfig = {
  template:     "standard",
  primaryColor: "#262e3d",
  accentColor:  "#03ab81",
  background:   "white",
  fields: {
    org: true, jobTitle: false, typeBadge: true,
    qrCode: true, eventName: true, logoArea: false,
  },
  nameFontSize: "large",
  fontStyle:    "sans",
  badgeSize:    "standard",
  sponsorLogo:  { show: false, position: "bottom-center" },
};

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
  attendees:   Attendee[];
  checkedIn:   Record<number, CheckInRecord>;
  log:         LogEntry[];
  kioskState:  KioskState;
  badgeConfig: BadgeConfig;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type Action =
  | { type: "CHECK_IN";        attendeeId: number; checkedInBy: CheckedInBy }
  | { type: "SET_KIOSK";       status: KioskStatus; attendee?: Attendee | null }
  | { type: "SET_BADGE_CONFIG"; config: BadgeConfig }
  | { type: "RESET" };

// ─── Swapcard brand constants ─────────────────────────────────────────────────

export const BRAND = {
  teal:        "#03ab81",   // primary brand green
  tealDark:    "#028a68",   // hover / active teal
  tealLight:   "#D7F5F1",   // light teal highlight bg
  tealFaint:   "#edfaf6",   // very light teal surface
  navy:        "#262e3d",   // primary dark / sidebar bg
  navyMid:     "#374255",   // secondary text
  navyLight:   "#5a6478",   // tertiary text
  muted:       "#8b99a8",   // muted text
  border:      "#d4dae3",   // borders / dividers
  orange:      "#d1481d",   // CTA / accent orange
  pageBg:      "#f4f5f7",   // light page background
  cardBg:      "#ffffff",   // card background
  cardShadow:  "0 2px 12px rgba(172,184,205,0.28)",
  // Dark-mode surfaces (nav, sidebar, device frames, ops page)
  darkBg:      "#1a2332",   // dark page bg
  darkBgDeep:  "#0f1724",   // deepest dark bg
  darkSurface: "#242f42",   // dark card / panel
  darkBorder:  "rgba(255,255,255,0.08)",
  darkMuted:   "rgba(255,255,255,0.3)",
} as const;

// ─── Type colour system ───────────────────────────────────────────────────────

export const TYPE_COLORS: Record<
  AttendeeType,
  { bg: string; fill: string; text: string; stripe: string }
> = {
  Attendee: { bg: "#0284C7", fill: "#E0F2FE", text: "#0369A1", stripe: "#0284C7" },
  VIP:      { bg: "#534AB7", fill: "#EEEDFE", text: "#2d268a", stripe: "#534AB7" },
  Exhibitor:{ bg: "#BA7517", fill: "#FAEEDA", text: "#7a4d0e", stripe: "#BA7517" },
  Speaker:  { bg: "#D85A30", fill: "#FAECE7", text: "#8c3417", stripe: "#D85A30" },
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_ATTENDEES: Attendee[] = [
  // ── VIPs (15) ──────────────────────────────────────────────────────────────
  { id: 1,   name: "Sarah Chen",        org: "Informa Markets",       type: "VIP",       initials: "SC" },
  { id: 2,   name: "James Okoro",       org: "Emerald Expositions",   type: "VIP",       initials: "JO" },
  { id: 3,   name: "Elena Vasquez",     org: "Reed Exhibitions",      type: "VIP",       initials: "EV" },
  { id: 4,   name: "Raj Sharma",        org: "Messe Frankfurt",       type: "VIP",       initials: "RS" },
  { id: 5,   name: "Wei Zhang",         org: "GL Events",             type: "VIP",       initials: "WZ" },
  { id: 6,   name: "Mohammed Hassan",   org: "IMEX Group",            type: "VIP",       initials: "MH" },
  { id: 7,   name: "Anna Lindgren",     org: "UFI Global",            type: "VIP",       initials: "AL" },
  { id: 8,   name: "Patrick O'Brien",   org: "Hyve Group",            type: "VIP",       initials: "PO" },
  { id: 9,   name: "Sofia Rossi",       org: "Fiera Milano",          type: "VIP",       initials: "SR" },
  { id: 10,  name: "Lucas Santos",      org: "Comexposium",           type: "VIP",       initials: "LS" },
  { id: 11,  name: "Ingrid Svensson",   org: "Amsterdam RAI",         type: "VIP",       initials: "IS" },
  { id: 12,  name: "Dmitri Petrov",     org: "NürnbergMesse",         type: "VIP",       initials: "DP" },
  { id: 13,  name: "Fatima Okafor",     org: "Questex Media",         type: "VIP",       initials: "FO" },
  { id: 14,  name: "Kenji Tanaka",      org: "Tarsus Group",          type: "VIP",       initials: "KT" },
  { id: 15,  name: "Amara Mensah",      org: "MCI Group",             type: "VIP",       initials: "AM" },

  // ── Speakers (20) ──────────────────────────────────────────────────────────
  { id: 16,  name: "Priya Nair",        org: "Koelnmesse",            type: "Speaker",   initials: "PN" },
  { id: 17,  name: "Carlos Reyes",      org: "Tech Summit Inc.",      type: "Speaker",   initials: "CR" },
  { id: 18,  name: "Yuki Nakamura",     org: "MIT Media Lab",         type: "Speaker",   initials: "YN" },
  { id: 19,  name: "Isabella Torres",   org: "Stanford GSB",          type: "Speaker",   initials: "IT" },
  { id: 20,  name: "Ibrahim Khalil",    org: "Oxford Future of Tech", type: "Speaker",   initials: "IK" },
  { id: 21,  name: "Mei Lin",           org: "Gartner Research",      type: "Speaker",   initials: "ML" },
  { id: 22,  name: "Andre Moreira",     org: "Forrester Research",    type: "Speaker",   initials: "AM" },
  { id: 23,  name: "Zara Ahmed",        org: "IDC Analytics",         type: "Speaker",   initials: "ZA" },
  { id: 24,  name: "Ryan Foster",       org: "Harvard Business Rev.", type: "Speaker",   initials: "RF" },
  { id: 25,  name: "Layla Mansour",     org: "Bloomberg Intelligence",type: "Speaker",   initials: "LM" },
  { id: 26,  name: "Oscar Brandt",      org: "Wired Magazine",        type: "Speaker",   initials: "OB" },
  { id: 27,  name: "Nadia Kozlov",      org: "IE Business School",    type: "Speaker",   initials: "NK" },
  { id: 28,  name: "Felix Baumann",     org: "INSEAD",                type: "Speaker",   initials: "FB" },
  { id: 29,  name: "Kwame Asante",      org: "London Business School",type: "Speaker",   initials: "KA" },
  { id: 30,  name: "Valentina Cruz",    org: "ESADE Business School", type: "Speaker",   initials: "VC" },
  { id: 31,  name: "Hiroshi Mori",      org: "Nikkei Group",          type: "Speaker",   initials: "HM" },
  { id: 32,  name: "Emma Richardson",   org: "McKinsey Global Inst.", type: "Speaker",   initials: "ER" },
  { id: 33,  name: "Ethan Park",        org: "Deloitte Insights",     type: "Speaker",   initials: "EP" },
  { id: 34,  name: "Simone Beaumont",   org: "L'Oréal Digital",       type: "Speaker",   initials: "SB" },
  { id: 35,  name: "Arjun Kapoor",      org: "BCG Henderson Inst.",   type: "Speaker",   initials: "AK" },

  // ── Exhibitors (30) ────────────────────────────────────────────────────────
  { id: 36,  name: "Tom Eriksen",       org: "Qualys Inc.",           type: "Exhibitor", initials: "TE" },
  { id: 37,  name: "Lena Müller",       org: "GES Worldwide",         type: "Exhibitor", initials: "LM" },
  { id: 38,  name: "Victor Osei",       org: "Salesforce",            type: "Exhibitor", initials: "VO" },
  { id: 39,  name: "Diana Johansson",   org: "Microsoft",             type: "Exhibitor", initials: "DJ" },
  { id: 40,  name: "Hamza Benali",      org: "Google Cloud",          type: "Exhibitor", initials: "HB" },
  { id: 41,  name: "Stella Papadaki",   org: "IBM",                   type: "Exhibitor", initials: "SP" },
  { id: 42,  name: "Ezra Cohen",        org: "Oracle",                type: "Exhibitor", initials: "EC" },
  { id: 43,  name: "Rania Hassan",      org: "SAP",                   type: "Exhibitor", initials: "RH" },
  { id: 44,  name: "Ben Murphy",        org: "Cisco Systems",         type: "Exhibitor", initials: "BM" },
  { id: 45,  name: "Theo Christou",     org: "Cvent",                 type: "Exhibitor", initials: "TC" },
  { id: 46,  name: "Mateo Iglesias",    org: "Bizzabo",               type: "Exhibitor", initials: "MI" },
  { id: 47,  name: "Fiona MacLeod",     org: "Hopin",                 type: "Exhibitor", initials: "FM" },
  { id: 48,  name: "Leo Brandt",        org: "NTT Data",              type: "Exhibitor", initials: "LB" },
  { id: 49,  name: "Camille Renard",    org: "Atos",                  type: "Exhibitor", initials: "CR" },
  { id: 50,  name: "Nour Aziz",         org: "Fujitsu",               type: "Exhibitor", initials: "NA" },
  { id: 51,  name: "Hugo Larsson",      org: "Siemens",               type: "Exhibitor", initials: "HL" },
  { id: 52,  name: "Tobias Bauer",      org: "Bosch Digital",         type: "Exhibitor", initials: "TB" },
  { id: 53,  name: "Marco Bellini",     org: "Capgemini",             type: "Exhibitor", initials: "MB" },
  { id: 54,  name: "Sven Eriksson",     org: "Cognizant",             type: "Exhibitor", initials: "SE" },
  { id: 55,  name: "Dante Ricci",       org: "Infosys",               type: "Exhibitor", initials: "DR" },
  { id: 56,  name: "Alicia Moreno",     org: "Wipro",                 type: "Exhibitor", initials: "AL" },
  { id: 57,  name: "Remi Dupont",       org: "TCS",                   type: "Exhibitor", initials: "RD" },
  { id: 58,  name: "Stefan Lehmann",    org: "HCL Technologies",      type: "Exhibitor", initials: "SL" },
  { id: 59,  name: "Elias Bergman",     org: "CGI Group",             type: "Exhibitor", initials: "EB" },
  { id: 60,  name: "Kofi Acheampong",   org: "PwC Advisory",          type: "Exhibitor", initials: "KA" },
  { id: 61,  name: "Diego Medina",      org: "Accenture Tech",        type: "Exhibitor", initials: "DM" },
  { id: 62,  name: "Magnus Holm",       org: "Schneider Electric",    type: "Exhibitor", initials: "MH" },
  { id: 63,  name: "Emre Demir",        org: "ABB",                   type: "Exhibitor", initials: "ED" },
  { id: 64,  name: "Baptiste Laurent",  org: "Thales Digital",        type: "Exhibitor", initials: "BL" },
  { id: 65,  name: "Cyrus Rahimi",      org: "Honeywell Connect",     type: "Exhibitor", initials: "CR" },

  // ── Attendees (135) ────────────────────────────────────────────────────────
  { id: 66,  name: "Marcus Webb",       org: "SME Group",             type: "Attendee",  initials: "MW" },
  { id: 67,  name: "Aisha Diallo",      org: "PCMA",                  type: "Attendee",  initials: "AD" },
  { id: 68,  name: "Nina Park",         org: "Independent",           type: "Attendee",  initials: "NP" },
  { id: 69,  name: "David Lau",         org: "EventPro",              type: "Attendee",  initials: "DL" },
  { id: 70,  name: "Alex Turner",       org: "Messe Düsseldorf",      type: "Attendee",  initials: "AT" },
  { id: 71,  name: "Mia Wilson",        org: "ExCeL London",          type: "Attendee",  initials: "MW" },
  { id: 72,  name: "Noah Evans",        org: "Reed UK",               type: "Attendee",  initials: "NE" },
  { id: 73,  name: "Lily Chen",         org: "Global Events Media",   type: "Attendee",  initials: "LC" },
  { id: 74,  name: "Grace Kim",         org: "Event Marketer Mag",    type: "Attendee",  initials: "GK" },
  { id: 75,  name: "Naomi Clark",       org: "Meetings & Conventions",type: "Attendee",  initials: "NC" },
  { id: 76,  name: "Zoe Robinson",      org: "BizBash",               type: "Attendee",  initials: "ZR" },
  { id: 77,  name: "Hannah Scott",      org: "Exhibition World",      type: "Attendee",  initials: "HS" },
  { id: 78,  name: "Freya Anderson",    org: "EventMB",               type: "Attendee",  initials: "FA" },
  { id: 79,  name: "Jade Martin",       org: "Connect Meetings",      type: "Attendee",  initials: "JM" },
  { id: 80,  name: "Aurora Phillips",   org: "Northstar Meetings",    type: "Attendee",  initials: "AP" },
  { id: 81,  name: "Beatrice Hall",     org: "Skift Meetings",        type: "Attendee",  initials: "BH" },
  { id: 82,  name: "Iris Thompson",     org: "M&IT Magazine",         type: "Attendee",  initials: "IT" },
  { id: 83,  name: "Petra Wallace",     org: "C&IT Magazine",         type: "Attendee",  initials: "PW" },
  { id: 84,  name: "Yasmin Hassan",     org: "Micebook",              type: "Attendee",  initials: "YH" },
  { id: 85,  name: "Celeste Morgan",    org: "Venue Directory",       type: "Attendee",  initials: "CM" },
  { id: 86,  name: "Frida Lindqvist",   org: "Event Industry News",   type: "Attendee",  initials: "FL" },
  { id: 87,  name: "Naledi Dlamini",    org: "Africa Events Assoc.",  type: "Attendee",  initials: "ND" },
  { id: 88,  name: "Saoirse Murphy",    org: "SITE Ireland",          type: "Attendee",  initials: "SM" },
  { id: 89,  name: "Asel Nurova",       org: "Central Asia Events",   type: "Attendee",  initials: "AN" },
  { id: 90,  name: "Renata Kowalczyk",  org: "Meetings Poland",       type: "Attendee",  initials: "RK" },
  { id: 91,  name: "Catalina Jimenez",  org: "COCAL",                 type: "Attendee",  initials: "CJ" },
  { id: 92,  name: "Kiri Waititi",      org: "Events NZ",             type: "Attendee",  initials: "KW" },
  { id: 93,  name: "Finn Larsen",       org: "Nordic Events",         type: "Attendee",  initials: "FL" },
  { id: 94,  name: "Owen Bradley",      org: "EventsBase UK",         type: "Attendee",  initials: "OB" },
  { id: 95,  name: "Tobias Kraft",      org: "Deutsche Messe",        type: "Attendee",  initials: "TK" },
  { id: 96,  name: "Marco Romano",      org: "AEFI Italy",            type: "Attendee",  initials: "MR" },
  { id: 97,  name: "Chioma Eze",        org: "Nigerian Events Assoc.",type: "Attendee",  initials: "CE" },
  { id: 98,  name: "Hana Yamamoto",     org: "JTB Corp",              type: "Attendee",  initials: "HY" },
  { id: 99,  name: "Astrid Bergstrom",  org: "SIME Sweden",           type: "Attendee",  initials: "AB" },
  { id: 100, name: "Elif Yilmaz",       org: "TURSAB Turkey",         type: "Attendee",  initials: "EY" },
  { id: 101, name: "Leandro Castro",    org: "ABEOC Brazil",          type: "Attendee",  initials: "LC" },
  { id: 102, name: "Kwesi Mensah",      org: "AOCA Africa",           type: "Attendee",  initials: "KM" },
  { id: 103, name: "Lara Novak",        org: "Czech Events Assoc.",   type: "Attendee",  initials: "LN" },
  { id: 104, name: "Amos Gitau",        org: "Kenya Assoc. of Events",type: "Attendee",  initials: "AG" },
  { id: 105, name: "Miriam Goldstein",  org: "IBTM World",            type: "Attendee",  initials: "MG" },
  { id: 106, name: "Nikolai Volkov",    org: "Expocentre Moscow",     type: "Attendee",  initials: "NV" },
  { id: 107, name: "Vera Santos",       org: "Brazil Exhibitions",    type: "Attendee",  initials: "VS" },
  { id: 108, name: "Ade Adeyemi",       org: "West Africa Events",    type: "Attendee",  initials: "AA" },
  { id: 109, name: "Soren Madsen",      org: "Denmark Events",        type: "Attendee",  initials: "SM" },
  { id: 110, name: "Phoebe Clarke",     org: "Melbourne Convention",  type: "Attendee",  initials: "PC" },
  { id: 111, name: "Edmund Fairfax",    org: "London Events Co.",     type: "Attendee",  initials: "EF" },
  { id: 112, name: "Rowan Mackenzie",   org: "Edinburgh Int'l",       type: "Attendee",  initials: "RM" },
  { id: 113, name: "Jack Williams",     org: "Freeman Co.",           type: "Attendee",  initials: "JW" },
  { id: 114, name: "Oliver Brown",      org: "George P. Johnson",     type: "Attendee",  initials: "OB" },
  { id: 115, name: "Charlie Davies",    org: "Jack Morton",           type: "Attendee",  initials: "CD" },
  { id: 116, name: "Harry Jones",       org: "Vok Dams",              type: "Attendee",  initials: "HJ" },
  { id: 117, name: "Archie Taylor",     org: "Imagination",           type: "Attendee",  initials: "AT" },
  { id: 118, name: "Freddie Moore",     org: "Wasserman",             type: "Attendee",  initials: "FM" },
  { id: 119, name: "George Harris",     org: "Momentum Worldwide",    type: "Attendee",  initials: "GH" },
  { id: 120, name: "Alfie Jackson",     org: "Live Nation Events",    type: "Attendee",  initials: "AJ" },
  { id: 121, name: "Tommy Lewis",       org: "CWT Meetings",          type: "Attendee",  initials: "TL" },
  { id: 122, name: "Sam Robinson",      org: "BCD Meetings & Events", type: "Attendee",  initials: "SR" },
  { id: 123, name: "Max Walker",        org: "Amex GBT",              type: "Attendee",  initials: "MW" },
  { id: 124, name: "Ben Young",         org: "IHG Hotels & Resorts",  type: "Attendee",  initials: "BY" },
  { id: 125, name: "Joe King",          org: "Marriott Bonvoy",       type: "Attendee",  initials: "JK" },
  { id: 126, name: "Dan Wright",        org: "Hilton Hotels",         type: "Attendee",  initials: "DW" },
  { id: 127, name: "Chris Scott",       org: "Hyatt Regency",         type: "Attendee",  initials: "CS" },
  { id: 128, name: "Lee Hill",          org: "AccorHotels",           type: "Attendee",  initials: "LH" },
  { id: 129, name: "Mark Green",        org: "Four Seasons",          type: "Attendee",  initials: "MG" },
  { id: 130, name: "Will Adams",        org: "Radisson Hotels",       type: "Attendee",  initials: "WA" },
  { id: 131, name: "Paul Nelson",       org: "Kempinski Hotels",      type: "Attendee",  initials: "PN" },
  { id: 132, name: "Rob Carter",        org: "Meliá Hotels",          type: "Attendee",  initials: "RC" },
  { id: 133, name: "Phil Mitchell",     org: "Shangri-La Hotels",     type: "Attendee",  initials: "PM" },
  { id: 134, name: "Ian Roberts",       org: "NH Hotels",             type: "Attendee",  initials: "IR" },
  { id: 135, name: "Ed Phillips",       org: "Unilever",              type: "Attendee",  initials: "EP" },
  { id: 136, name: "Ray Campbell",      org: "Nestlé",                type: "Attendee",  initials: "RC" },
  { id: 137, name: "Pete Parker",       org: "Novartis",              type: "Attendee",  initials: "PP" },
  { id: 138, name: "Tony Evans",        org: "Roche",                 type: "Attendee",  initials: "TE" },
  { id: 139, name: "Frank Edwards",     org: "Pfizer",                type: "Attendee",  initials: "FE" },
  { id: 140, name: "Mike Collins",      org: "Johnson & Johnson",     type: "Attendee",  initials: "MC" },
  { id: 141, name: "Alan Stewart",      org: "AstraZeneca",           type: "Attendee",  initials: "AS" },
  { id: 142, name: "Terry Morris",      org: "GSK",                   type: "Attendee",  initials: "TM" },
  { id: 143, name: "Gary Rogers",       org: "L'Oréal",               type: "Attendee",  initials: "GR" },
  { id: 144, name: "Don Reed",          org: "LVMH",                  type: "Attendee",  initials: "DR" },
  { id: 145, name: "Jeff Morgan",       org: "HSBC",                  type: "Attendee",  initials: "JM" },
  { id: 146, name: "Steve Bell",        org: "Barclays",              type: "Attendee",  initials: "SB" },
  { id: 147, name: "Kevin Murphy",      org: "Deutsche Bank",         type: "Attendee",  initials: "KM" },
  { id: 148, name: "Larry Bailey",      org: "BNP Paribas",           type: "Attendee",  initials: "LB" },
  { id: 149, name: "Scott Rivera",      org: "Société Générale",      type: "Attendee",  initials: "SR" },
  { id: 150, name: "Jason Cooper",      org: "ING",                   type: "Attendee",  initials: "JC" },
  { id: 151, name: "Brian Richardson",  org: "ABN AMRO",              type: "Attendee",  initials: "BR" },
  { id: 152, name: "Dennis Cox",        org: "Allianz",               type: "Attendee",  initials: "DC" },
  { id: 153, name: "Andy Howard",       org: "AXA",                   type: "Attendee",  initials: "AH" },
  { id: 154, name: "Randy Ward",        org: "Zurich Insurance",      type: "Attendee",  initials: "RW" },
  { id: 155, name: "Keith Flores",      org: "Prudential",            type: "Attendee",  initials: "KF" },
  { id: 156, name: "Helen Murray",      org: "Trade Show Executive",  type: "Attendee",  initials: "HM" },
  { id: 157, name: "Carol Hayes",       org: "Exhibit City News",     type: "Attendee",  initials: "CH" },
  { id: 158, name: "Janet Long",        org: "Expo Magazine",         type: "Attendee",  initials: "JL" },
  { id: 159, name: "Ruth Sanders",      org: "MPI",                   type: "Attendee",  initials: "RS" },
  { id: 160, name: "Dorothy Price",     org: "Events Industry Council",type: "Attendee", initials: "DP" },
  { id: 161, name: "Linda Butler",      org: "The Meetings Show",     type: "Attendee",  initials: "LB" },
  { id: 162, name: "Margaret Foster",   org: "Confex",                type: "Attendee",  initials: "MF" },
  { id: 163, name: "Betty Gonzalez",    org: "IMEX America",          type: "Attendee",  initials: "BG" },
  { id: 164, name: "Barbara Diaz",      org: "IBTM World",            type: "Attendee",  initials: "BD" },
  { id: 165, name: "Patricia Ramirez",  org: "Event Biz",             type: "Attendee",  initials: "PR" },
  { id: 166, name: "Maria Jenkins",     org: "Eventex Awards",        type: "Attendee",  initials: "MJ" },
  { id: 167, name: "Susan Perry",       org: "Events Industry Alliance",type:"Attendee", initials: "SP" },
  { id: 168, name: "Lisa Powell",       org: "Eventscase",            type: "Attendee",  initials: "LP" },
  { id: 169, name: "Nancy Torres",      org: "Whova",                 type: "Attendee",  initials: "NT" },
  { id: 170, name: "Karen Flores",      org: "Webex Events",          type: "Attendee",  initials: "KF" },
  { id: 171, name: "Sandra Henderson",  org: "Swoogo",                type: "Attendee",  initials: "SH" },
  { id: 172, name: "Laura Coleman",     org: "Attendease",            type: "Attendee",  initials: "LC" },
  { id: 173, name: "Sarah Jenkins",     org: "Grip",                  type: "Attendee",  initials: "SJ" },
  { id: 174, name: "Olga Ivanova",      org: "ExpoCloud",             type: "Attendee",  initials: "OI" },
  { id: 175, name: "Chloe Martineau",   org: "Accelevents",           type: "Attendee",  initials: "CM" },
  { id: 176, name: "Santiago Vargas",   org: "Eventmobi",             type: "Attendee",  initials: "SV" },
  { id: 177, name: "Grace Okonkwo",     org: "Airmeet",               type: "Attendee",  initials: "GO" },
  { id: 178, name: "Etienne Moreau",    org: "Superevent",            type: "Attendee",  initials: "EM" },
  { id: 179, name: "Hina Yusuf",        org: "GEVME",                 type: "Attendee",  initials: "HY" },
  { id: 180, name: "Tunde Adebisi",     org: "Eventdex",              type: "Attendee",  initials: "TA" },
  { id: 181, name: "Iris Yamada",       org: "RegFox",                type: "Attendee",  initials: "IY" },
  { id: 182, name: "Lars Henriksen",    org: "EventsAir",             type: "Attendee",  initials: "LH" },
  { id: 183, name: "Nora Fitzgerald",   org: "Aventri",               type: "Attendee",  initials: "NF" },
  { id: 184, name: "Bakary Diallo",     org: "Eventsforce",           type: "Attendee",  initials: "BD" },
  { id: 185, name: "Camille Dubois",    org: "Ungerboeck",            type: "Attendee",  initials: "CD" },
  { id: 186, name: "Yosef Ben-David",   org: "Expo Logic",            type: "Attendee",  initials: "YB" },
  { id: 187, name: "Reem Al-Farsi",     org: "Dubai World Trade Ctr", type: "Attendee",  initials: "RA" },
  { id: 188, name: "Jun Wei",           org: "Shanghai New Int'l",    type: "Attendee",  initials: "JW" },
  { id: 189, name: "Moana Tuilagi",     org: "Auckland Convention",   type: "Attendee",  initials: "MT" },
  { id: 190, name: "Bjorn Haugen",      org: "Oslo Spektrum",         type: "Attendee",  initials: "BH" },
  { id: 191, name: "Thiago Ferreira",   org: "São Paulo Expo",        type: "Attendee",  initials: "TF" },
  { id: 192, name: "Amina Osei",        org: "Accra Int'l Conf Ctr",  type: "Attendee",  initials: "AO" },
  { id: 193, name: "Daria Popescu",     org: "Bucharest Expo",        type: "Attendee",  initials: "DP" },
  { id: 194, name: "Mehmet Yilmaz",     org: "Istanbul Congress Ctr", type: "Attendee",  initials: "MY" },
  { id: 195, name: "Ananya Reddy",      org: "India Exposition Mart", type: "Attendee",  initials: "AR" },
  { id: 196, name: "Callum Fraser",     org: "SECC Glasgow",          type: "Attendee",  initials: "CF" },
  { id: 197, name: "Yemi Adesanya",     org: "Lagos Int'l Trade Fair",type: "Attendee",  initials: "YA" },
  { id: 198, name: "Solène Petit",      org: "Paris Nord Villepinte", type: "Attendee",  initials: "SP" },
  { id: 199, name: "Andrei Popov",      org: "Expocentre Krasnaya",   type: "Attendee",  initials: "AP" },
  { id: 200, name: "Céleste Bergmann",  org: "Vienna Congress Ctr",   type: "Attendee",  initials: "CB" },
];

// ─── Reducer ──────────────────────────────────────────────────────────────────

function nowString(): string {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export const INITIAL_STATE: AppState = {
  attendees:   MOCK_ATTENDEES,
  checkedIn:   {},
  log:         [],
  kioskState:  { status: "idle", attendee: null },
  badgeConfig: DEFAULT_BADGE_CONFIG,
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

    case "SET_BADGE_CONFIG":
      return { ...state, badgeConfig: action.config };

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
