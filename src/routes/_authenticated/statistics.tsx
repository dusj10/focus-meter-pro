import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  TEAM,
  mockUserDay,
  aggregateSummaries,
  getRangeDays,
  getRangeLabel,
  appIconUrl,
  fallbackIconUrl,
  type RangeKind,
  type UserSummary,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMinutes } from "@/lib/utils";
import { subWeeks, subMonths } from "date-fns";
import { Users, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/statistics")({
  head: () => ({ meta: [{ title: "Statistiky týmu — Teamlense" }] }),
  component: StatisticsPage,
});

const CATEGORY_COLORS: Record<string, string> = {
  Komunikace: "#3b82f6",
  Tvorba: "#8b5cf6",
  Vývoj: "#10b981",
  Prohlížeč: "#f59e0b",
  Systém: "#64748b",
};

function aggregateTeam(days: string[]): Record<string, UserSummary> {
  const out: Record<string, UserSummary> = {};
  TEAM.forEach((m) => {
    out[m.id] = aggregateSummaries(days.map((d) => mockUserDay(m.id, d)));
  });
  return out;
}

function StatisticsPage() {
  const [range, setRange] = useState<RangeKind>("week");
  const [refDate] = useState(new Date("2026-06-22"));

  const currentDays = useMemo(() => getRangeDays(range, refDate), [range, refDate]);
  const previousDays = useMemo(() => {
    const prev = range === "week" ? subWeeks(refDate, 1) : subMonths(refDate, 1);
    return getRangeDays(range, prev);
  }, [range, refDate]);

  const current = useMemo(() => aggregateTeam(currentDays), [currentDays]);
  const previous = useMemo(() => aggregateTeam(previousDays), [previousDays]);

  const totalActive = Object.values(current).reduce((s, u) => s + u.active_hours, 0);
  const avgPerEmployee = totalActive / TEAM.length;

  // Employee comparison
  const empCompare = TEAM.map((m) => ({
    name: m.name.split(" ")[0],
    hours: Math.round(current[m.id].active_hours * 10) / 10,
  })).sort((a, b) => b.hours - a.hours);

  // Categories across team
  const catMap: Record<string, number> = {};
  Object.values(current).forEach((u) =>
    Object.entries(u.categories).forEach(([k, v]) => {
      catMap[k] = (catMap[k] ?? 0) + v.active_min;
    }),
  );
  const totalCatMin = Object.values(catMap).reduce((s, v) => s + v, 0) || 1;
  const catData = Object.entries(catMap).map(([name, value]) => ({
    name,
    value,
    pct: Math.round((value / totalCatMin) * 100),
  }));

  // Top apps
  const appMap = new Map<string, { app: string; min: number }>();
  Object.values(current).forEach((u) =>
    u.apps.forEach((a) => {
      const ex = appMap.get(a.app);
      if (ex) ex.min += a.active_min;
      else appMap.set(a.app, { app: a.app, min: a.active_min });
    }),
  );
  const topApps = Array.from(appMap.values()).sort((a, b) => b.min - a.min).slice(0, 5);
  const maxAppMin = topApps[0]?.min ?? 1;

  // Heatmap (mock from seeded distribution): days × hours 8-18
  const dayLabels = ["Po", "Út", "St", "Čt", "Pá"];
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);
  const heatmap = dayLabels.map((dl, di) => {
    return hours.map((h) => {
      // mix all team members' active minutes weighted by sine-like distribution
      const dayActive = TEAM.reduce((s, m) => {
        const day = currentDays[di] ?? currentDays[0];
        return s + mockUserDay(m.id, day).active_hours;
      }, 0);
      // peak around 10-11 and 14-15
      const peakFactor =
        Math.exp(-Math.pow(h - 10.5, 2) / 6) * 0.6 + Math.exp(-Math.pow(h - 14.5, 2) / 6) * 0.6;
      const intensity = (dayActive / 3) * peakFactor;
      return { day: dl, hour: h, value: intensity };
    });
  });
  const maxHeat = Math.max(...heatmap.flat().map((c) => c.value), 0.01);

  // Week vs week per employee
  const wvw = TEAM.map((m) => ({
    name: m.name.split(" ")[0],
    "Toto období": Math.round(current[m.id].active_hours * 10) / 10,
    "Minulé období": Math.round(previous[m.id].active_hours * 10) / 10,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Statistiky týmu</h1>
          <p className="text-sm text-muted-foreground mt-1">{getRangeLabel(range, refDate)}</p>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as RangeKind)}>
          <TabsList>
            <TabsTrigger value="week">Týden</TabsTrigger>
            <TabsTrigger value="month">Měsíc</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard
          icon={<Clock className="h-4 w-4" />}
          label="Celkem odpracováno týmem"
          value={formatMinutes(totalActive * 60)}
        />
        <SummaryCard
          icon={<Users className="h-4 w-4" />}
          label="Průměr na zaměstnance"
          value={formatMinutes(avgPerEmployee * 60)}
        />
      </div>

      {/* Employee comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Srovnání zaměstnanců</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={empCompare} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}h`} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip formatter={(v: number) => [`${v} h`, "Aktivní čas"]} />
              <Bar dataKey="hours" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Categories donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kategorie napříč týmem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={catData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={2}
                  >
                    {catData.map((c) => (
                      <Cell key={c.name} fill={CATEGORY_COLORS[c.name] ?? "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatMinutes(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full sm:w-56 space-y-3">
                {catData.map((c) => (
                  <div key={c.name} className="flex items-start gap-3">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0 mt-1"
                      style={{ background: CATEGORY_COLORS[c.name] ?? "#94a3b8" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        <span className="font-medium text-foreground">{c.pct}%</span>
                        {" · "}
                        {formatMinutes(c.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top apps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top aplikace týmu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topApps.map((a) => (
                <div key={a.app} className="flex items-center gap-3">
                  <AppIcon app={a.app} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="truncate font-medium">{a.app}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatMinutes(a.min)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(a.min / maxAppMin) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kdy je tým nejaktivnější</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-1 pl-8 mb-1">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="w-8 text-[10px] text-muted-foreground text-center tabular-nums"
                  >
                    {h}:00
                  </div>
                ))}
              </div>
              {heatmap.map((row, ri) => (
                <div key={ri} className="flex items-center gap-1 mb-1">
                  <div className="w-7 text-xs text-muted-foreground">{dayLabels[ri]}</div>
                  {row.map((cell, ci) => {
                    const ratio = cell.value / maxHeat;
                    const bg =
                      cell.value < 0.02
                        ? "#f1f5f9"
                        : `rgba(16, 185, 129, ${0.15 + ratio * 0.85})`;
                    return (
                      <div
                        key={ci}
                        className="w-8 h-8 rounded-sm"
                        style={{ background: bg }}
                        title={`${dayLabels[ri]} ${cell.hour}:00 — ${formatMinutes(cell.value * 60)}`}
                      />
                    );
                  })}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <span>Méně</span>
                <div className="flex gap-1">
                  {[0.15, 0.35, 0.55, 0.75, 1].map((r) => (
                    <div
                      key={r}
                      className="w-4 h-4 rounded-sm"
                      style={{ background: `rgba(16, 185, 129, ${r})` }}
                    />
                  ))}
                </div>
                <span>Více</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week vs week */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {range === "week" ? "Týden vs. týden" : "Měsíc vs. měsíc"} – srovnání
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={wvw}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${v}h`} />
              <Tooltip formatter={(v: number) => `${v} h`} />
              <Legend />
              <Bar dataKey="Minulé období" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Toto období" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function AppIcon({ app }: { app: string }) {
  const [err, setErr] = useState(false);
  const url = appIconUrl(app);
  const fallback = fallbackIconUrl(app);
  if (!url || err) {
    return (
      <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-semibold shrink-0">
        {app.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={app}
      width={32}
      height={32}
      referrerPolicy="no-referrer"
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        } else {
          setErr(true);
        }
      }}
      className="w-8 h-8 rounded-md shrink-0"
    />
  );
}

