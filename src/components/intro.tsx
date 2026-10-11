"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { ArabicIntroName } from "./arabic-intro-name";

export function Intro({ name, children, locale }: { name: string; children: ReactNode; locale: Locale }) {
  const t = useTranslations("Intro");
  const pathname = usePathname();
  const [entryPath] = useState(pathname);
  const [phase, setPhase] = useState<"playing" | "finished" | "skipped" | "navigated">("playing");
  // The root layout persists across client navigation, unlike page templates.
  // Cancel an unfinished intro too if the visitor leaves its initial route.
  if (pathname !== entryPath && phase !== "navigated") setPhase("navigated");
  const characters = Array.from(name);
  const effectivePhase = phase;
  // Last character finishes before the hold, exit, and homepage reveal begin.
  const exitDelay = 0.3 + Math.max(0, characters.length - 1) * 0.09 + 0.4 + 0.35;
  const timing = {
    "--intro-exit-delay": `${exitDelay}s`,
    "--home-reveal-delay": `${effectivePhase === "navigated" || effectivePhase === "skipped" ? 0 : exitDelay + 0.8}s`,
  } as CSSProperties;

  useEffect(() => {
    if (phase !== "playing") return;
    function skip(event: KeyboardEvent) {
      if (event.key === "Escape") setPhase("skipped");
    }
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [phase]);

  return (
    <div className="site-sequence" data-intro-phase={effectivePhase} style={timing}>
      {effectivePhase === "playing" && (
        <button type="button" className="intro" data-intro aria-label={t("skip")} onClick={() => setPhase("skipped")}
          onAnimationEnd={event => {
            if (event.target === event.currentTarget && event.animationName === "intro-exit") setPhase("finished");
          }}>
          <span className="intro-name" data-locale={locale} aria-hidden="true">
            {locale === "ar" ? <ArabicIntroName name={name} /> : characters.map((character, index) => <span key={index} style={{ "--character": index } as CSSProperties}>{character === " " ? "\u00a0" : character}</span>)}
          </span>
          <span className="intro-skip">{t("skip")}</span>
        </button>
      )}
      {children}
    </div>
  );
}
