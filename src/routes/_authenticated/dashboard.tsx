import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Users,
  Activity,
  TrendingUp,
  ChevronRight,
  ArrowUp,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatHours } from "@/lib/utils";
import {
  fetchSummary,
  mockSummary,
  TEAM,
  aggregateSummaries,
  getRangeDays,
  getRangeLabel,
  type RangeKind,
  type UserSummary,
} from "@/lib/api";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Přehled týmu — Teamlense" },
      { name: "description", content: "Aktivita vašeho týmu na jednom místě." },
    ],
  }),
  component: TeamOverview,
});

const RANGE_LABELS: Record<RangeKind, { unit: string; suffix: string }> = {
  day: { unit: "dnes", suffix: "dnes" },
  week: { unit: "tento týden", suffix: "tento týden" },
  month: { unit: "tento měsíc", suffix: "tento měsíc" },
};

function TeamOverview() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date(2026, 5, 22));
  const [range, setRange] = useState<RangeKind>("day");

  const days = useMemo(() => getRangeDays(range, date), [range, date]);

  // Flat list of {userId, day} queries for all team members across the range
  const tasks = useMemo(
    () => TEAM.flatMap((m) => days.map((d) => ({ id: m.id, day: d }))),
    [days],
  );

  const results = useQueries({
    queries: tasks.map((t) => ({
      queryKey: ["summary", t.id, t.day],
      queryFn: () =>
        t.id === "honza" && range === "day"
          ? fetchSummary(t.id, t.day).catch(() => mockSummary(t.id, t.day))
          : Promise.resolve(mockSummary(t.id, t.day)),
      staleTime: 60_000,
    })),
  });

  const members = TEAM.map((m) => {
    const summaries: UserSummary[] = [];
    tasks.forEach((t, i) => {
      if (t.id !== m.id) return;
      const s = results[i].data?.users[m.id];
      if (s) summaries.push(s);
    });
    return { ...m, summary: aggregateSummaries(summaries) };
  });

  const activeCount = members.filter((m) => m.summary.active_hours > 0.05).length;
  const avgActive =
    members.reduce((s, m) => s + m.summary.active_hours, 0) / Math.max(members.length, 1);
  const top = [...members].sort((a, b) => b.summary.active_hours - a.summary.active_hours)[0];

  const labels = RANGE_LABELS[range];
  const rangeLabel = getRangeLabel(range, date);
  const subtitle =
    range === "day"
      ? format(date, "EEEE d. MMMM yyyy", { locale: cs })
      : range === "week"
        ? `Týden ${rangeLabel}`
        : rangeLabel.charAt(0).toUpperCase() + rangeLabel.slice(1);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Přehled týmu</h1>
          <p className="text-sm text-muted-foreground mt-1">Acme s.r.o. · {subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={(v) => setRange(v as RangeKind)}>
            <TabsList>
              <TabsTrigger value="day">Den</TabsTrigger>
              <TabsTrigger value="week">Týden</TabsTrigger>
              <TabsTrigger value="month">Měsíc</TabsTrigger>
            </TabsList>
          </Tabs>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal gap-2">
                <CalendarIcon className="h-4 w-4" />
                {rangeLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label={`Aktivní členové ${labels.unit}`}
          value={`${activeCount} / ${TEAM.length}`}
          hint="zaměstnanců sledováno"
        />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label="Průměrný aktivní čas"
          value={formatHours(avgActive)}
          hint={`napříč týmem ${labels.suffix}`}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Nejproduktivnější"
          value={top?.name.split(" ")[0] ?? "—"}
          hint={`${formatHours(top?.summary.active_hours ?? 0)} aktivní`}
        />
        <ProductivityCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WeeklyTrend className="lg:col-span-2" />
        <TeamStatus />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold">Členové týmu</h2>
          <span className="text-xs text-muted-foreground">{members.length} osob</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                <th className="px-5 py-3 font-medium">Jméno</th>
                <th className="px-5 py-3 font-medium w-[28%]">Aktivní čas</th>
                <th className="px-5 py-3 font-medium">Čas nečinnosti</th>
                <th className="px-5 py-3 font-medium">Top aplikace</th>
                <th className="px-5 py-3 font-medium">Produktivita %</th>
                <th className="px-5 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const active = m.summary.active_hours;
                const idle = m.summary.idle_hours;
                // Scale progress bar to range max: 8h day, 40h week, 160h month
                const max = range === "day" ? 8 : range === "week" ? 40 : 160;
                const pct = (active / max) * 100;
                const topApp = m.summary.apps
                  .slice()
                  .sort((a, b) => b.active_min - a.active_min)[0]?.app;
                const isActive = active > 0.05;
                return (
                  <tr
                    key={m.id}
                    onClick={() => navigate({ to: "/employee/$userId", params: { userId: m.id } } as any)}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center text-xs font-semibold">
                          {m.initials}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-active rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium tabular-nums w-20 text-right">
                          {formatHours(active)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-idle mr-2 align-middle" />
                        {formatHours(idle)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm">{topApp ?? "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      {isActive ? (
                        <Badge className="bg-active/10 text-active hover:bg-active/15 border-active/20 border font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-active mr-1.5 animate-pulse" />
                          Aktivní
                        </Badge>
                      ) : (
                        <Badge className="bg-idle/10 text-idle hover:bg-idle/15 border-idle/20 border font-medium">
                          Nečinný
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function ProductivityCard() {
  const value = 73;
  const trend = 8;
  const color = value > 60 ? "#1D9E75" : value >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Activity className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">Produktivita</span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight" style={{ color }}>
          {value}%
        </span>
        <span className="text-xs font-medium flex items-center gap-0.5" style={{ color: "#1D9E75" }}>
          <ArrowUp className="h-3 w-3" />
          {trend}%
        </span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">oproti minulému týdnu</div>
    </div>
  );
}

function WeeklyTrend({ className }: { className?: string }) {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 4 : Math.min(today - 1, 4);
  const data = [
    { day: "Po", hours: 6.2 },
    { day: "Út", hours: 7.1 },
    { day: "St", hours: 5.8 },
    { day: "Čt", hours: 6.9 },
    { day: "Pá", hours: 5.4 },
  ];
  return (
    <div className={cn("rounded-xl border bg-card p-5", className)}>
      <h2 className="text-sm font-semibold">Týdenní trend</h2>
      <p className="text-xs text-muted-foreground mt-1">Průměrný aktivní čas týmu</p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis axisLine={false} tickLine={false} className="text-xs" />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              formatter={(v: number) => [formatHours(v), "Aktivní"]}
            />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === todayIdx ? "#15805F" : "#1D9E75"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TeamStatus() {
  const people = [
    { name: "Jan Novák", color: "#1D9E75", label: "VS Code", status: "active" },
    { name: "Petra", color: "#F59E0B", label: "Nečinný 15 min", status: "idle" },
    { name: "Tomáš", color: "#9CA3AF", label: "Offline od 16:30", status: "offline" },
    { name: "Marie", color: "#1D9E75", label: "Chrome", status: "active" },
  ];
  const online = people.filter((p) => p.status === "active").length;
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Stav týmu</h2>
        <span className="text-xs text-muted-foreground">
          {online} online · {people.length - online} mimo
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {people.map((p) => (
          <li key={p.name} className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {p.label}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
