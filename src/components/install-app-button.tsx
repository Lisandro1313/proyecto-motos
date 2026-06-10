"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Download, Info } from "lucide-react";

type InstallOutcome = "accepted" | "dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: InstallOutcome; platform: string }>;
};

type InstallAppButtonProps = {
  className?: string;
  variant?: "light" | "dark";
};

function isStandaloneDisplay() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function isAppleMobile() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function InstallAppButton({
  className = "",
  variant = "light",
}: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const initialCheck = window.setTimeout(() => {
      setInstalled(isStandaloneDisplay());
    }, 0);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setHelpMessage("");
    }

    function handleAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
      setHelpMessage("Aplicación instalada.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.clearTimeout(initialCheck);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (installed || isStandaloneDisplay()) {
      setInstalled(true);
      setHelpMessage("Aplicación instalada.");
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (choice.outcome === "accepted") {
        setInstalled(true);
        setHelpMessage("Aplicación instalada.");
        return;
      }

      setHelpMessage("Instalación cancelada.");
      return;
    }

    setHelpMessage(
      isAppleMobile()
        ? "En iPhone: Compartir > Agregar a pantalla de inicio."
        : "Si no aparece el instalador, abrí el menú del navegador y elegí Instalar aplicación.",
    );
  }, [deferredPrompt, installed]);

  if (installed) return null;

  const dark = variant === "dark";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleInstall}
        className={
          dark
            ? "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
            : "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        }
      >
        <Download className="size-4" />
        Instalar aplicación
      </button>

      {helpMessage ? (
        <div
          className={
            dark
              ? "mt-2 flex gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-5 text-slate-200"
              : "mt-2 flex gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-slate-600"
          }
        >
          {helpMessage === "Aplicación instalada." ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
          ) : (
            <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
          )}
          <span>{helpMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
