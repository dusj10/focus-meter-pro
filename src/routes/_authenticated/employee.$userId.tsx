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
  mockSummary,
  mockUserDay,
  TEAM,
  appIconUrl,
  fallbackIconUrl,
  CATEGORY_COLORS,
  type UserSummary,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatHours, formatMinutes } from "@/lib/utils";

const MONTHLY_TARGET_HOURS = 160;

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
  const today = new Date(2026, 5, 22);
  const day = format(today, "yyyy-MM-dd");

  const isReal = userId === "honza";
  const { data } = useQuery({
    queryKey: ["summary", userId, day],
    queryFn: () =>
      isReal
        ? fetchSummary(userId, day).catch(() => mockSummary(userId, day))
        : Promise.resolve(mockSummary(userId, day)),
  });

  const summary = data?.users[userId] as UserSummary | undefined;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    return format(d, "yyyy-MM-dd");
  });

  const weekQueries = useQueries({
    queries: last7.map((d) => ({
      queryKey: ["summary", userId, d],
      queryFn: () =>
        isReal && d === day
          ? fetchSummary(userId, d).catch(() => mockSummary(userId, d))
          : Promise.resolve(mockSummary(userId, d)),
    })),
  });

  const chartData = last7.map((d, i) => {
    const s = weekQueries[i].data?.users[userId];
    return {
      label: format(new Date(d), "EE d.M.", { locale: cs }),
      active: Number((s?.active_hours ?? 0).toFixed(2)),
    };
  });

  // Monthly hours: 1st of month → today
  const monthHours = useMemo(() => {
    const first = startOfMonth(today);
    let total = 0;
    for (let d = first; d <= today; d = new Date(d.getTime() + 86400000)) {
      const ds = format(d, "yyyy-MM-dd");
      // Use mock for the whole month for consistency (avoids 30 API calls)
      total += mockUserDay(userId, ds).active_hours;
    }
    return Math.round(total * 100) / 100;
  }, [userId]);
  const monthPct = Math.min((monthHours / MONTHLY_TARGET_HOURS) * 100, 100);

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
            <span className="text-base font-normal text-muted-foreground ml-1">
              z ~{MONTHLY_TARGET_HOURS}h
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-active rounded-full transition-all"
              style={{ width: `${monthPct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-muted-foreground tabular-nums">
            {Math.round(monthPct)}% měsíčního cíle
          </div>
        </div>
      </div>

      <AttendanceAndTimeline />


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
