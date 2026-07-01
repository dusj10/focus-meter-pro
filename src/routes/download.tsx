import { createFileRoute } from "@tanstack/react-router";
import { Download, Shield, Monitor, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/download")({
  component: DownloadPage,
});

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#1D9E75] flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Teamlense Agent</h1>
            <p className="text-sm text-gray-500 mt-1">Monitorovací agent pro Windows</p>
          </div>
        </div>

        {/* Download card */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 space-y-5">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Verze 1.0.0 · Windows 10/11</p>
            <p className="text-xs text-gray-400">teamlense-agent.exe · 16 MB</p>
          </div>

          <a href="/teamlense-agent.exe" download>
            <Button className="w-full gap-2 bg-[#1D9E75] hover:bg-[#15805F] text-white h-11 text-base">
              <Download className="h-5 w-5" />
              Stáhnout agenta
            </Button>
          </a>

          <p className="text-xs text-gray-400">
            Po stažení spusťte soubor a zadejte aktivační kód, který jste obdrželi od svého manažera.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mx-auto">
              <Monitor className="h-4 w-4 text-[#1D9E75]" />
            </div>
            <p className="text-xs text-gray-500">Sledování aktivity</p>
          </div>
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mx-auto">
              <Shield className="h-4 w-4 text-[#1D9E75]" />
            </div>
            <p className="text-xs text-gray-500">Bezpečný provoz</p>
          </div>
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mx-auto">
              <RefreshCw className="h-4 w-4 text-[#1D9E75]" />
            </div>
            <p className="text-xs text-gray-500">Automatické spuštění</p>
          </div>
        </div>

        <p className="text-xs text-gray-300">© 2026 Teamlense</p>
      </div>
    </div>
  );
}
