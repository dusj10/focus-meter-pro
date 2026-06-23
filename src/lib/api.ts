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

export function mockSummary(userId: string, day: string): SummaryResponse {
  const data: Record<string, UserSummary> = {
    petra: {
      active_hours: 5.2,
      idle_hours: 1.4,
      total_tracked_hours: 6.6,
      apps: [
        { app: "Figma", raw: "figma.exe", category: "Tvorba", active_min: 180, idle_min: 20 },
        { app: "Slack", raw: "slack.exe", category: "Komunikace", active_min: 60, idle_min: 30 },
        { app: "Google Chrome", raw: "chrome.exe", category: "Prohlížeč", active_min: 72, idle_min: 34 },
      ],
      categories: {
        Tvorba: { active_min: 180, idle_min: 20 },
        Komunikace: { active_min: 60, idle_min: 30 },
        Prohlížeč: { active_min: 72, idle_min: 34 },
      },
    },
    martin: {
      active_hours: 6.8,
      idle_hours: 0.6,
      total_tracked_hours: 7.4,
      apps: [
        { app: "Visual Studio Code", raw: "code.exe", category: "Vývoj", active_min: 280, idle_min: 15 },
        { app: "Příkazový řádek", raw: "cmd.exe", category: "Vývoj", active_min: 80, idle_min: 5 },
        { app: "Microsoft Teams", raw: "ms-teams.exe", category: "Komunikace", active_min: 48, idle_min: 16 },
      ],
      categories: {
        Vývoj: { active_min: 360, idle_min: 20 },
        Komunikace: { active_min: 48, idle_min: 16 },
      },
    },
  };
  return { day, users: { [userId]: data[userId] ?? data.petra } };
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
  return `https://cdn.simpleicons.org/${entry.slug}/${entry.color}`;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Tvorba: "bg-violet-100 text-violet-700 border-violet-200",
  Komunikace: "bg-blue-100 text-blue-700 border-blue-200",
  Prohlížeč: "bg-amber-100 text-amber-700 border-amber-200",
  Vývoj: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Systém: "bg-slate-100 text-slate-700 border-slate-200",
};
