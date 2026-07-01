import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamlenseLogo } from "@/components/team-lense-logo";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
});

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <TeamlenseLogo iconClassName="w-14 h-14" textClassName="text-2xl" />
          <p className="text-sm text-gray-500">Teamlense Agent pro Windows</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 space-y-5">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Verze 1.0.0 · Windows 10/11</p>
            <p className="text-xs text-gray-400">teamlense-agent.exe · 16 MB</p>
          </div>

          <a href="https://koopqhxqshilwwnmxkou.supabase.co/storage/v1/object/public/downloads/teamlense-agent.exe" download>
            <Button className="w-full gap-2 bg-[#1D9E75] hover:bg-[#15805F] text-white h-11 text-base">
              <Download className="h-5 w-5" />
              Stáhnout agenta
            </Button>
          </a>

          <p className="text-xs text-gray-400">
            Po stažení spusťte soubor a zadejte aktivační kód z e-mailu, který jste od nás obdrželi.
          </p>
        </div>

        <p className="text-xs text-gray-300">© 2026 Teamlense</p>
      </div>
    </div>
  );
}
