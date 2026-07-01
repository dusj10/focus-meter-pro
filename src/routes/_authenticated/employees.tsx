import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { UserPlus, Copy, Check, Mail, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchEmployees, createEmployee, type Employee } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/employees")({
  head: () => ({
    meta: [{ title: "Zaměstnanci — Teamlense" }],
  }),
  component: EmployeesPage,
});

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
      title="Zkopírovat"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState<{ code: string; name: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createEmployee({ name: name.trim(), email: email.trim(), role: role.trim() }),
    onSuccess: (data) => {
      setResult({ code: data.code, name: data.name });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setEmail("");
      setRole("");
      setResult(null);
      setCodeCopied(false);
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Přidat zaměstnance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Přidat zaměstnance</DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Zaměstnanec <span className="font-medium text-foreground">{result.name}</span> byl přidán.
              Pošlete mu níže uvedený kód — po spuštění agenta ho zadá a automaticky se propojí s vaším týmem.
            </p>
            <div className="rounded-xl border bg-muted/40 p-5 text-center space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Aktivační kód</p>
              <p className="text-3xl font-mono font-bold tracking-widest text-foreground">
                {result.code}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 mt-1"
                onClick={() => copyCode(result.code)}
              >
                {codeCopied ? (
                  <><Check className="h-3.5 w-3.5 text-green-600" /> Zkopírováno</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Zkopírovat kód</>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Kód je jednorázový a váže se k tomuto zaměstnanci. Po aktivaci ho nelze použít znovu.
            </p>
            <div className="flex justify-end gap-2">
              <Button onClick={handleClose}>Hotovo</Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="emp-name">Jméno a příjmení</Label>
              <Input
                id="emp-name"
                placeholder="Jan Novák"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-email">E-mail</Label>
              <Input
                id="emp-email"
                type="email"
                placeholder="jan@firma.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-role">
                Pozice <span className="text-muted-foreground font-normal">(nepovinná)</span>
              </Label>
              <Input
                id="emp-role"
                placeholder="Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            {mutation.isError && (
              <p className="text-sm text-red-500">Chyba při přidávání — zkuste to znovu.</p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={handleClose}>
                Zrušit
              </Button>
              <Button type="submit" disabled={mutation.isPending || !name.trim() || !email.trim()}>
                {mutation.isPending ? "Generuji kód…" : "Přidat a vygenerovat kód"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ employee }: { employee: Employee }) {
  if (employee.activated_at) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
        <Shield className="h-3 w-3" />
        Aktivní
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
      <Clock className="h-3 w-3" />
      Čeká na aktivaci
    </span>
  );
}

function EmployeesPage() {
  const { data: employees = [], isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(),
    staleTime: 30_000,
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Zaměstnanci</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Spravujte členy týmu a jejich aktivační kódy.
          </p>
        </div>
        <AddEmployeeDialog />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Načítám…</div>
        ) : isError ? (
          <div className="p-12 text-center text-sm text-red-500">
            Nepodařilo se načíst zaměstnance. Zkuste obnovit stránku.
          </div>
        ) : employees.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <UserPlus className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Zatím žádní zaměstnanci</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Přidejte prvního zaměstnance tlačítkem výše. Obdrží aktivační kód pro nainstalování agenta.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                  <th className="px-5 py-3 font-medium">Jméno</th>
                  <th className="px-5 py-3 font-medium">Pozice</th>
                  <th className="px-5 py-3 font-medium">Aktivační kód</th>
                  <th className="px-5 py-3 font-medium">Stav</th>
                  <th className="px-5 py-3 font-medium">Přidán</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.user_id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {emp.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{emp.name}</div>
                          {emp.email && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {emp.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {emp.role || <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm tracking-wider bg-muted/60 rounded px-2 py-0.5">
                        {emp.code}
                      </span>
                      {!emp.activated_at && <CopyButton text={emp.code} />}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge employee={emp} />
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {format(new Date(emp.created_at), "d. M. yyyy", { locale: cs })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-muted/30 p-5 flex gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Shield className="h-4 w-4 text-blue-600" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Jak to funguje?</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Po přidání zaměstnance mu pošlete aktivační kód. Zaměstnanec si stáhne agenta, při první instalaci
            zadá kód a automaticky se propojí s vaším týmem. Každý kód lze použít pouze jednou.
          </p>
        </div>
      </div>
    </div>
  );
}
