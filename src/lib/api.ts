import { addDays, format, startOfMonth, endOfMonth, startOfWeek } from "date-fns";
import { cs } from "date-fns/locale";

export interface AppEntry {
  app: string;
  raw: string;
  category: string;
  active_min: number;
  idle_min: number;
}



export interface UserSummary {
  active_hours: number;
  idle_hours: number;
  total_tracked_hours: number;
  apps: AppEntry[];
  categories: Record<string, { active_min: number; idle_min: number }>;
}

export interface SummaryResponse {
  day: string;
  users: Record<string, UserSummary>;
}

const BASE = "https://web-production-b3877.up.railway.app";

export async function fetchSummary(userId: string, day: string): Promise<SummaryResponse> {
  const res = await fetch(`${BASE}/api/summary?user_id=${userId}&day=${day}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export const TEAM = [
  { id: "honza", name: "Honza Novák", role: "Frontend Developer", initials: "HN" },
  { id: "petra", name: "Petra Svobodová", role: "Product Designer", initials: "PS" },
  { id: "martin", name: "Martin Dvořák", role: "Backend Developer", initials: "MD" },
];

type AppProfile = { app: string; raw: string; category: string; share: number };

const USER_PROFILES: Record<string, { apps: AppProfile[]; baseHours: number }> = {
  honza: {
    baseHours: 6.2,
    apps: [
      { app: "Visual Studio Code", raw: "code.exe", category: "Vývoj", share: 0.5 },
      { app: "Google Chrome", raw: "chrome.exe", category: "Prohlížeč", share: 0.22 },
      { app: "Slack", raw: "slack.exe", category: "Komunikace", share: 0.14 },
      { app: "Figma", raw: "figma.exe", category: "Tvorba", share: 0.08 },
      { app: "Notion", raw: "notion.exe", category: "Tvorba", share: 0.06 },
    ],
  },
  petra: {
    baseHours: 5.8,
    apps: [
      { app: "Figma", raw: "figma.exe", category: "Tvorba", share: 0.52 },
      { app: "Google Chrome", raw: "chrome.exe", category: "Prohlížeč", share: 0.18 },
      { app: "Slack", raw: "slack.exe", category: "Komunikace", share: 0.14 },
      { app: "Notion", raw: "notion.exe", category: "Tvorba", share: 0.1 },
      { app: "Adobe Photoshop", raw: "photoshop.exe", category: "Tvorba", share: 0.06 },
    ],
  },
  martin: {
    baseHours: 6.6,
    apps: [
      { app: "Visual Studio Code", raw: "code.exe", category: "Vývoj", share: 0.46 },
      { app: "PowerShell", raw: "pwsh.exe", category: "Vývoj", share: 0.2 },
      { app: "Postman", raw: "postman.exe", category: "Vývoj", share: 0.12 },
      { app: "Microsoft Teams", raw: "ms-teams.exe", category: "Komunikace", share: 0.12 },
      { app: "Google Chrome", raw: "chrome.exe", category: "Prohlížeč", share: 0.1 },
    ],
  },
};

function seedRng(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  };
}

function emptySummary(): UserSummary {
  return { active_hours: 0, idle_hours: 0, total_tracked_hours: 0, apps: [], categories: {} };
}

export function mockUserDay(userId: string, day: string): UserSummary {
  const profile = USER_PROFILES[userId] ?? USER_PROFILES.honza;
  const date = new Date(day + "T00:00:00");
  const dow = date.getDay(); // 0=Sun..6=Sat
  const isWeekend = dow === 0 || dow === 6;
  const rng = seedRng(`${userId}-${day}`);

  let active_hours: number;
  let idle_hours: number;

  if (isWeekend) {
    // Occasional weekend work
    if (rng() > 0.8) {
      active_hours = 0.5 + rng() * 1.2;
      idle_hours = 0.1 + rng() * 0.3;
    } else {
      return emptySummary();
    }
  } else {
    active_hours = profile.baseHours - 0.8 + rng() * 1.6; // ~5–7h
    idle_hours = 0.4 + rng() * 1.1;
  }

  active_hours = Math.round(active_hours * 100) / 100;
  idle_hours = Math.round(idle_hours * 100) / 100;

  // Distribute apps with mild jitter
  const jittered = profile.apps.map((p) => ({ ...p, w: p.share * (0.75 + rng() * 0.5) }));
  const totalW = jittered.reduce((s, a) => s + a.w, 0);
  const apps: AppEntry[] = jittered.map((a) => ({
    app: a.app,
    raw: a.raw,
    category: a.category,
    active_min: Math.round((a.w / totalW) * active_hours * 60),
    idle_min: Math.round((a.w / totalW) * idle_hours * 60),
  }));

  const categories: UserSummary["categories"] = {};
  apps.forEach((a) => {
    const c = (categories[a.category] ??= { active_min: 0, idle_min: 0 });
    c.active_min += a.active_min;
    c.idle_min += a.idle_min;
  });

  return {
    active_hours,
    idle_hours,
    total_tracked_hours: Math.round((active_hours + idle_hours) * 100) / 100,
    apps,
    categories,
  };
}

export function mockSummary(userId: string, day: string): SummaryResponse {
  return { day, users: { [userId]: mockUserDay(userId, day) } };
}

export function aggregateSummaries(list: UserSummary[]): UserSummary {
  const out = emptySummary();
  const appMap = new Map<string, AppEntry>();
  list.forEach((s) => {
    out.active_hours += s.active_hours;
    out.idle_hours += s.idle_hours;
    out.total_tracked_hours += s.total_tracked_hours;
    s.apps.forEach((a) => {
      const ex = appMap.get(a.raw);
      if (ex) {
        ex.active_min += a.active_min;
        ex.idle_min += a.idle_min;
      } else {
        appMap.set(a.raw, { ...a });
      }
    });
    Object.entries(s.categories).forEach(([k, v]) => {
      const c = (out.categories[k] ??= { active_min: 0, idle_min: 0 });
      c.active_min += v.active_min;
      c.idle_min += v.idle_min;
    });
  });
  out.active_hours = Math.round(out.active_hours * 100) / 100;
  out.idle_hours = Math.round(out.idle_hours * 100) / 100;
  out.total_tracked_hours = Math.round(out.total_tracked_hours * 100) / 100;
  out.apps = Array.from(appMap.values());
  return out;
}

export type RangeKind = "day" | "week" | "month";

export function getRangeDays(range: RangeKind, date: Date): string[] {
  if (range === "day") return [format(date, "yyyy-MM-dd")];
  if (range === "week") {
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 5 }, (_, i) => format(addDays(monday, i), "yyyy-MM-dd"));
  }
  const first = startOfMonth(date);
  const last = endOfMonth(date);
  const days: string[] = [];
  for (let d = first; d <= last; d = addDays(d, 1)) days.push(format(d, "yyyy-MM-dd"));
  return days;
}

export function getRangeLabel(range: RangeKind, date: Date): string {
  if (range === "day") return format(date, "d. M. yyyy");
  if (range === "week") {
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    const friday = addDays(monday, 4);
    return `${format(monday, "d.M.")} – ${format(friday, "d.M.")}`;
  }
  return format(date, "LLLL yyyy", { locale: cs });
}

const ICON_MAP: Record<string, { slug: string; color: string }> = {
  "Microsoft Teams": { slug: "microsoftteams", color: "6264A7" },
  "Microsoft Word": { slug: "microsoftword", color: "2B579A" },
  Word: { slug: "microsoftword", color: "2B579A" },
  "Microsoft Excel": { slug: "microsoftexcel", color: "217346" },
  "Microsoft PowerPoint": { slug: "microsoftpowerpoint", color: "D24726" },
  PowerPoint: { slug: "microsoftpowerpoint", color: "D24726" },
  "Microsoft Outlook": { slug: "microsoftoutlook", color: "0078D4" },
  Outlook: { slug: "microsoftoutlook", color: "0078D4" },
  Zoom: { slug: "zoom", color: "2D8CFF" },
  Slack: { slug: "slack", color: "4A154B" },
  Discord: { slug: "discord", color: "5865F2" },
  "Google Chrome": { slug: "googlechrome", color: "4285F4" },
  "Microsoft Edge": { slug: "microsoftedge", color: "0078D7" },
  Firefox: { slug: "firefox", color: "FF7139" },
  "Visual Studio Code": { slug: "visualstudiocode", color: "007ACC" },
  "VS Code": { slug: "visualstudiocode", color: "007ACC" },
  Cursor: { slug: "cursor", color: "000000" },
  PyCharm: { slug: "pycharm", color: "21D789" },
  Figma: { slug: "figma", color: "F24E1E" },
  Notion: { slug: "notion", color: "000000" },
  PowerShell: { slug: "powershell", color: "012456" },
  Postman: { slug: "postman", color: "FF6C37" },
  "Adobe Photoshop": { slug: "adobephotoshop", color: "001E36" },
  Photoshop: { slug: "adobephotoshop", color: "001E36" },
  "Adobe Illustrator": { slug: "adobeillustrator", color: "FF7C00" },
  Illustrator: { slug: "adobeillustrator", color: "FF7C00" },
  Brave: { slug: "brave", color: "FB542B" },
  Skype: { slug: "skype", color: "00AFF0" },
  "Příkazový řádek": { slug: "windowsterminal", color: "4D4D4D" },
  "Průzkumník souborů": { slug: "files", color: "404040" },
};

export function appIconUrl(app: string): string | null {
  const entry = ICON_MAP[app];
  if (!entry) return null;
  return `https://cdn.simpleicons.org/${entry.slug}`;
}

export function fallbackIconUrl(app: string): string | null {
  const entry = ICON_MAP[app];
  if (!entry) return null;
  return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${entry.slug}.svg`;
}


export const CATEGORY_COLORS: Record<string, string> = {
  Tvorba: "bg-violet-100 text-violet-700 border-violet-200",
  Komunikace: "bg-blue-100 text-blue-700 border-blue-200",
  Prohlížeč: "bg-amber-100 text-amber-700 border-amber-200",
  Vývoj: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Systém: "bg-slate-100 text-slate-700 border-slate-200",
};
