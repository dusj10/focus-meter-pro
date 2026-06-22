import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Activity, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn, formatHours } from "@/lib/utils";
import { fetchSummary, mockSummary, TEAM, type UserSummary } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Přehled týmu — HomeOffice Checker" },
      { name: "description", content: "Dnešní aktivita vašeho týmu na jednom místě." },
    ],
  }),
  component: TeamOverview,
});

function TeamOverview() {
  const [date, setDate] = useState<Date>(new Date(2026, 5, 22));
  const [range, setRange] = useState("day");
  const day = format(date, "yyyy-MM-dd");

  const queries = TEAM.map((m) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["summary", m.id, day],
      queryFn: () =>
        m.id === "honza" ? fetchSummary(m.id, day) : Promise.resolve(mockSummary(m.id, day)),
    }),
  );

  const members = TEAM.map((m, i) => ({
    ...m,
    summary: queries[i].data?.users[m.id] as UserSummary | undefined,
    loading: queries[i].isLoading,
  }));

  const activeToday = members.filter((m) => (m.summary?.active_hours ?? 0) > 0.05).length;
  const avgActive =
    members.reduce((s, m) => s + (m.summary?.active_hours ?? 0), 0) / Math.max(members.length, 1);
  const top = [...members].sort(
    (a, b) => (b.summary?.active_hours ?? 0) - (a.summary?.active_hours ?? 0),
  )[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Přehled týmu</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acme s.r.o. · {format(date, "EEEE d. MMMM yyyy", { locale: cs })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={setRange}>
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
                {format(date, "d. M. yyyy")}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Aktivní členové dnes"
          value={`${activeToday} / ${TEAM.length}`}
          hint="zaměstnanců sledováno"
        />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label="Průměrný aktivní čas"
          value={formatHours(avgActive)}
          hint="napříč týmem"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Nejproduktivnější"
          value={top?.name.split(" ")[0] ?? "—"}
          hint={`${formatHours(top?.summary?.active_hours ?? 0)} aktivní`}
        />
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
                <th className="px-5 py-3 font-medium">Stav</th>
                <th className="px-5 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const active = m.summary?.active_hours ?? 0;
                const idle = m.summary?.idle_hours ?? 0;
                const total = Math.max(active + idle, 1);
                const pct = (active / 8) * 100;
                const topApp = m.summary?.apps
                  ?.slice()
                  .sort((a, b) => b.active_min - a.active_min)[0]?.app;
                const isActive = active > 0.05;
                return (
                  <tr
                    key={m.id}
                    className="border-b last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <Link
                        to="/employee/$userId"
                        params={{ userId: m.id }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center text-xs font-semibold">
                          {m.initials}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.role}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <Link to="/employee/$userId" params={{ userId: m.id }} className="block">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-active rounded-full transition-all"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium tabular-nums w-16 text-right">
                            {formatHours(active)}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <Link to="/employee/$userId" params={{ userId: m.id }}>
                        <span className="text-sm tabular-nums text-muted-foreground">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-idle mr-2 align-middle" />
                          {formatHours(idle)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <Link to="/employee/$userId" params={{ userId: m.id }}>
                        <span className="text-sm">{topApp ?? "—"}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <Link to="/employee/$userId" params={{ userId: m.id }}>
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
                      </Link>
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
