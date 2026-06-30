import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "teamlense-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // ignore
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-6 md:max-w-md">
      <div className="rounded-2xl border bg-card shadow-lg p-5 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tento web používá pouze technické cookies nezbytné pro fungování přihlášení. Žádné
          analytické ani marketingové cookies nepoužíváme.
        </p>
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={accept}
            style={{ backgroundColor: "#1D9E75" }}
            className="text-white hover:opacity-90"
          >
            Rozumím
          </Button>
        </div>
      </div>
    </div>
  );
}
