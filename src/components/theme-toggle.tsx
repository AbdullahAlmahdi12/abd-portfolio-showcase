"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const themeEvent = "portfolio:theme-change";

function currentTheme(): "light" | "dark" {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(listener: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);
  window.addEventListener(themeEvent, listener);
  return () => {
    media.removeEventListener("change", listener);
    window.removeEventListener(themeEvent, listener);
  };
}

export function ThemeToggle() {
  const t = useTranslations("Theme");
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light");
  const next = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* In-memory choice still works when storage is blocked. */ }
    window.dispatchEvent(new Event(themeEvent));
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={t(next)} title={t(next)}>
      <svg className="theme-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
      <svg className="theme-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" />
      </svg>
    </button>
  );
}
