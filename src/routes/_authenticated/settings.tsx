import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const TIMEZONES = [
  "Europe/Prague",
  "Europe/Bratislava",
  "Europe/Vienna",
  "Europe/Berlin",
  "Europe/London",
  "UTC",
];

const MEMBERS = [
  { id: "honza", name: "Honza Novák", role: "Manažer", active: true, addedAt: "12. 1. 2025", initials: "HN" },
  { id: "petra", name: "Petra Svobodová", role: "Designérka", active: true, addedAt: "3. 2. 2025", initials: "PS" },
  { id: "martin", name: "Martin Dvořák", role: "Vývojář", active: false, addedAt: "18. 3. 2025", initials: "MD" },
];

function SettingsPage() {
  const [companyName, setCompanyName] = useState("Acme s.r.o.");
  const [timezone, setTimezone] = useState("Europe/Prague");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Změny byly uloženy");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 border-b flex items-center px-4 gap-3 bg-background">
        <SidebarTrigger />
        <h1 className="font-semibold">Nastavení</h1>
      </header>

      <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Firemní profil</CardTitle>
            <CardDescription>Základní informace o vaší firmě.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="company">Název firmy</Label>
                <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tz">Časové pásmo</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="tz"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button type="submit">Uložit změny</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Členové týmu</CardTitle>
            <CardDescription>Spravujte přístup členů svého týmu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Jméno</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Datum přidání</TableHead>
                    <TableHead className="text-right">Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MEMBERS.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-muted">{m.initials}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-muted-foreground">{m.role}</TableCell>
                      <TableCell>
                        {m.active ? (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Aktivní</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Neaktivní</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{m.addedAt}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              Odebrat
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Odebrat {m.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tato akce odebere člena z týmu. Tuto demo akci nelze ve skutečnosti provést.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Zrušit</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => toast.info("Demo režim — člen nebyl odebrán")}
                              >
                                Odebrat
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button variant="outline" disabled className="opacity-60 cursor-not-allowed">
                      + Přidat zaměstnance
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Tato funkce bude brzy dostupná</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
