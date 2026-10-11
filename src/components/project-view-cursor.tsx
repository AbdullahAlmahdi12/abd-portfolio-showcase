"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import gsap from "gsap";
import { useReducedMotion } from "./use-reduced-motion";

const subscribeToMount = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// One cursor serves every project card, including cards after navigation.
export function ProjectViewCursor() {
  const t = useTranslations("Portrait");
  const pathname = usePathname();
  const ready = useSyncExternalStore(subscribeToMount, clientSnapshot, serverSnapshot);
  const reduced = useReducedMotion();
  const cursor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const badge = cursor.current;
    if (!badge) return;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine)", () => {
      let active: HTMLElement | null = null;
      gsap.set(badge, {xPercent: -50, yPercent: -50, autoAlpha: 0, scale: .65});
      const xTo = gsap.quickTo(badge, "x", {duration: reduced ? 0 : .22, ease: "power3.out"});
      const yTo = gsap.quickTo(badge, "y", {duration: reduced ? 0 : .22, ease: "power3.out"});
      const card = (target: EventTarget | null) => target instanceof Element ? target.closest<HTMLElement>("[data-view-cursor]") : null;
      function leave() {
        if (active) delete active.dataset.cursorReady;
        active = null;
        gsap.to(badge, {autoAlpha: 0, scale: .65, duration: reduced ? 0 : .25, ease: "power2.out", overwrite: "auto"});
      }
      function enter(event: PointerEvent) {
        if (event.pointerType === "touch") return;
        const next = card(event.target);
        if (next === active) return;
        if (active) delete active.dataset.cursorReady;
        active = next;
        if (!active) {leave(); return;}
        active.dataset.cursorReady = "true";
        gsap.set(badge, {x: event.clientX, y: event.clientY});
        xTo(event.clientX, event.clientX); yTo(event.clientY, event.clientY);
        gsap.to(badge, {autoAlpha: 1, scale: 1, duration: reduced ? 0 : .3, ease: "power2.out", overwrite: "auto"});
      }
      function move(event: PointerEvent) {
        if (!active || event.pointerType === "touch") return;
        xTo(event.clientX); yTo(event.clientY);
      }
      function exit(event: PointerEvent) {if (active && card(event.relatedTarget) !== active) leave();}
      document.addEventListener("pointerover", enter);
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerout", exit);
      document.addEventListener("click", leave);
      document.addEventListener("visibilitychange", leave);
      window.addEventListener("blur", leave);
      return () => {
        if (active) delete active.dataset.cursorReady;
        document.removeEventListener("pointerover", enter);
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerout", exit);
        document.removeEventListener("click", leave);
        document.removeEventListener("visibilitychange", leave);
        window.removeEventListener("blur", leave);
        xTo.tween.kill(); yTo.tween.kill(); gsap.killTweensOf(badge);
      };
    });
    return () => media.revert();
  }, [ready, reduced, pathname]);

  return ready ? createPortal(<span ref={cursor} className="portrait-view-cursor" aria-hidden="true">{t("view")}</span>, document.body) : null;
}
