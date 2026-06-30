import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Clock, Pause, Timer, CalendarCheck } from "lucide-react";
import { format, subDays, startOfMonth } from "date-fns";
import { cs } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  fetchSummary,
  fetchTimeline,
  mockSummary,
  mockUserDay,
  TEAM,
  appIconUrl,
  fallbackIconUrl,
  CATEGORY_COLORS,
  type UserSummary,
  type TimelineMinute,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatHours, formatMinutes } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/employee/$userId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.userId} — Teamlense` },
      { name: "description", content: "Detail aktivity zaměstnance." },
    ],
  }),
  component: EmployeeDetail,
});

function EmployeeDetail() {
  const { userId } = useParams({ from: "/_authenticated/employee/$userId" });
  const member = TEAM.find((m) => m.id === userId) ?? TEAM[0];
  const today = new Date();
  const day = format(today, "yyyy-MM-dd");

  const { data: summaryData } = useQuery({
    queryKey: ["summary", userId, day],
    queryFn: async () => {
      try {
        const result = await fetchSummary(userId, day);
        if (result.users[userId]) return result;
      } catch {}
      return mockSummary(userId, day);
    },
  });

  const { data: timelineData } = useQuery({
    queryKey: ["timeline", userId, day],
    queryFn: async () => {
      try {
        const result = await fetchTimeline(userId, day);
        if (result.timeline.length > 0) return result;
      } catch {}
      return null;
    },
  });

  const summary = summaryData?.users[userId] as UserSummary | undefined;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    return format(d, "yyyy-MM-dd");
  });

  const weekQueries = useQueries({
    queries: last7.map((d) => ({
      queryKey: ["summary", userId, d],
      queryFn: async () => {
        try {
          const result = await fetchSummary(userId, d);
          if (result.users[userId]) return result;
        } catch {}
        return mockSummary(userId, d);
      },
    })),
  });

  const chartData = last7.map((d, i) => {
    const s = weekQueries[i].data?.users[userId];
    return {
      label: format(new Date(d), "EE d.M.", { locale: cs }),
      active: Number((s?.active_hours ?? 0).toFixed(2)),
    };
  });

  const monthHours = useMemo(() => {
    const first = startOfMonth(today);
    let total = 0;
    for (let d = first; d <= today; d = new Date(d.getTime() + 86400000)) {
      const ds = format(d, "yyyy-MM-dd");
      total += mockUserDay(userId, ds).active_hours;
    }
    return Math.round(total * 100) / 100;
  }, [userId]);

  const apps = (summary?.apps ?? []).slice().sort((a, b) => b.active_min - a.active_min);
  const maxAppMin = Math.max(...apps.map((a) => a.active_min), 1);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4" /> Zpět na přehled týmu
        </Link>
      </Button>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center text-lg font-semibold">
          {member.initials}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{member.name}</h1>
          <p className="text-sm text-muted-foreground">
            {member.role} · {format(today, "d. M. yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={<Clock className="h-4 w-4 text-active" />}
          label="Aktivní čas dnes"
          value={formatHours(summary?.active_hours ?? 0)}
          accent="active"
        />
        <Stat
          icon={<Pause className="h-4 w-4 text-idle" />}
          label="Čas nečinnosti"
          value={formatHours(summary?.idle_hours ?? 0)}
          accent="idle"
        />
        <Stat
          icon={<Timer className="h-4 w-4 text-muted-foreground" />}
          label="Celkem sledováno"
          value={formatHours(summary?.total_tracked_hours ?? 0)}
        />
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarCheck className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Odpracováno tento měsíc
            </span>
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {formatHours(monthHours)}
          </div>
        </div>
      </div>

      <AttendanceAndTimeline
        loginTime={timelineData?.login_time}
        logoutTime={timelineData?.logout_time}
        timeline={timelineData?.timeline}
      />

      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Aktivní hodiny za posledních 7 dní</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Sledovaný čas v hodinách</p>
          </div>
        </div>
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.005 260)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "oklch(0.5 0.015 260)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "oklch(0.5 0.015 260)" }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                cursor={{ fill: "oklch(0.97 0.005 260)" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid oklch(0.93 0.005 260)",
                  fontSize: 12,
                }}
                formatter={(v: number) => [formatHours(v), "Aktivní"]}
              />
              <Bar dataKey="active" fill="oklch(0.72 0.17 152)" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="text-sm font-semibold">Rozdělení podle aplikací</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                <th className="px-5 py-3 font-medium">Aplikace</th>
                <th className="px-5 py-3 font-medium">Kategorie</th>
                <th className="px-5 py-3 font-medium w-[35%]">Aktivní čas</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    Žádná data
                  </td>
                </tr>
              )}
              {apps.map((a) => {
                const icon = appIconUrl(a.app);
                const pct = (a.active_min / maxAppMin) * 100;
                return (
                  <tr key={a.raw} className="border-b last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <AppIcon app={a.app} icon={icon} />
                        <span className="font-medium">{a.app}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[a.category] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        {a.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-active rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums w-20 text-right text-muted-foreground">
                          {formatMinutes(a.active_min)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Souhrn kategorií</h2>
          <div className="space-y-2">
            {Object.entries(summary?.categories ?? {}).map(([cat, v]) => (
              <div
                key={cat}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <Badge variant="outline" className={`${CATEGORY_COLORS[cat] ?? ""} font-medium`}>
                  {cat}
                </Badge>
                <div className="text-right">
                  <div className="text-sm font-medium tabular-nums">
                    {formatMinutes(v.active_min)}
                  </div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">
                    + {formatMinutes(v.idle_min)} nečinný
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(summary?.categories ?? {}).length === 0 && (
              <p className="text-sm text-muted-foreground">Žádná data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppIcon({ app, icon }: { app: string; icon: string | null }) {
  const [error, setError] = useState(false);
  const letter = app.charAt(0).toUpperCase();
  const fallback = fallbackIconUrl(app);

  if (!icon || error) {
    return (
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-muted-foreground">{letter}</span>
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
      <img
        src={icon}
        alt={app}
        width={22}
        height={22}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          if (fallback && e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          } else {
            setError(true);
          }
        }}
        className="w-[22px] h-[22px]"
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "active" | "idle";
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div
        className={`mt-3 text-3xl font-semibold tracking-tight ${accent === "active" ? "text-active" : accent === "idle" ? "text-idle" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

type MinState = { state: "active" | "idle" | "offline"; app?: string };

function parseTimeMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minToLabel(abs: number) {
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const MOCK_ARRIVAL = "09:15";
const MOCK_DEPARTURE = "17:42";
const MOCK_DAY_START = 9 * 60;
const MOCK_DAY_END = 17 * 60;
const MOCK_TOTAL = MOCK_DAY_END - MOCK_DAY_START;
const MOCK_BLOCKS: Array<[number, number, string]> = [
  [9 * 60 + 15, 10 * 60 + 45, "Visual Studio Code"],
  [11 * 60, 12 * 60 + 30, "Slack"],
  [13 * 60 + 15, 15 * 60, "Visual Studio Code"],
  [15 * 60 + 20, 17 * 60 + 30, "Figma"],
];
const MOCK_PRESENCE: [number, number] = [9 * 60 + 15, 17 * 60 + 30];

function buildMockMinutes(): MinState[] {
  const arr: MinState[] = [];
  for (let i = 0; i < MOCK_TOTAL; i++) {
    const abs = MOCK_DAY_START + i;
    if (abs < MOCK_PRESENCE[0] || abs >= MOCK_PRESENCE[1]) {
      arr.push({ state: "offline" });
      continue;
    }
    const block = MOCK_BLOCKS.find(([s, e]) => abs >= s && abs < e);
    if (block) arr.push({ state: "active", app: block[2] });
    else arr.push({ state: "idle" });
  }
  return arr;
}

function AttendanceAndTimeline({
  loginTime,
  logoutTime,
  timeline,
}: {
  loginTime?: string | null;
  logoutTime?: string | null;
  timeline?: TimelineMinute[];
}) {
  const { minutes, dayStartMin, totalMin, arrival, departure, windowLabel, ticks } = useMemo(() => {
    if (timeline && timeline.length > 0 && loginTime && logoutTime) {
      const loginMin = parseTimeMin(loginTime);
      const logoutMin = parseTimeMin(logoutTime);
      const startH = Math.floor(loginMin / 60);
      const endH = Math.ceil((logoutMin + 1) / 60);
      const dayStartMin = startH * 60;
      const dayEndMin = endH * 60;
      const totalMin = dayEndMin - dayStartMin;

      const minuteMap = new Map(timeline.map((e) => [parseTimeMin(e.time), e]));

      const minutes: MinState[] = [];
      for (let i = 0; i < totalMin; i++) {
        const abs = dayStartMin + i;
        const entry = minuteMap.get(abs);
        if (entry) {
          minutes.push({ state: entry.status, app: entry.app });
        } else {
          minutes.push({ state: "offline" });
        }
      }

      const ticks: number[] = [];
      for (let h = startH; h <= endH; h += 2) ticks.push(h);

      return {
        minutes,
        dayStartMin,
        totalMin,
        arrival: loginTime,
        departure: logoutTime,
        windowLabel: `${minToLabel(dayStartMin)} – ${minToLabel(dayEndMin)}`,
        ticks,
      };
    }

    return {
      minutes: buildMockMinutes(),
      dayStartMin: MOCK_DAY_START,
      totalMin: MOCK_TOTAL,
      arrival: MOCK_ARRIVAL,
      departure: MOCK_DEPARTURE,
      windowLabel: "09:00 – 17:00",
      ticks: [9, 11, 13, 15, 17],
    };
  }, [timeline, loginTime, logoutTime]);

  const segments = useMemo(() => {
    const segs: Array<{ start: number; length: number; state: MinState["state"]; app?: string }> = [];
    let i = 0;
    while (i < minutes.length) {
      let j = i + 1;
      while (
        j < minutes.length &&
        minutes[j].state === minutes[i].state &&
        minutes[j].app === minutes[i].app
      )
        j++;
      segs.push({ start: i, length: j - i, state: minutes[i].state, app: minutes[i].app });
      i = j;
    }
    return segs;
  }, [minutes]);

  const [hover, setHover] = useState<{
    x: number;
    label: string;
    app?: string;
    state: MinState["state"];
  } | null>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const minIdx = Math.min(totalMin - 1, Math.floor(ratio * totalMin));
    const m = minutes[minIdx];
    setHover({ x, label: minToLabel(dayStartMin + minIdx), app: m.app, state: m.state });
  }

  const stateLabel: Record<MinState["state"], string> = {
    active: "Aktivní",
    idle: "Nečinný",
    offline: "Offline",
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-active" />
            <span className="text-xs font-medium uppercase tracking-wide">Příchod</span>
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{arrival}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-idle" />
            <span className="text-xs font-medium uppercase tracking-wide">Odchod</span>
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{departure}</div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Časová osa dne</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Pracovní den {windowLabel}</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-active inline-block" /> Aktivní
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" /> Nečinný
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm border border-border bg-white inline-block" />
              Offline
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            className="relative flex h-10 w-full overflow-hidden rounded-md border border-border bg-white"
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
          >
            {segments.map((seg, idx) => (
              <div
                key={idx}
                style={{ width: `${(seg.length / totalMin) * 100}%` }}
                className={
                  seg.state === "active"
                    ? "bg-active h-full"
                    : seg.state === "idle"
                      ? "bg-slate-300 h-full"
                      : "bg-transparent h-full"
                }
              />
            ))}
            {hover && (
              <div
                className="pointer-events-none absolute top-0 bottom-0 w-px bg-foreground/40"
                style={{ left: hover.x }}
              />
            )}
          </div>

          {hover && (
            <div
              className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md whitespace-nowrap"
              style={{ left: hover.x }}
            >
              <div className="font-medium tabular-nums">{hover.label}</div>
              <div className="text-muted-foreground">
                {stateLabel[hover.state]}
                {hover.app ? ` · ${hover.app}` : ""}
              </div>
            </div>
          )}

          <div className="relative mt-2 h-4">
            {ticks.map((h) => {
              const pct = ((h * 60 - dayStartMin) / totalMin) * 100;
              return (
                <div
                  key={h}
                  className="absolute -translate-x-1/2 text-[11px] text-muted-foreground tabular-nums"
                  style={{ left: `${pct}%` }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
