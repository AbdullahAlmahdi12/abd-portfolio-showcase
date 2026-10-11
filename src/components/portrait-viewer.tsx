"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "./use-reduced-motion";

gsap.registerPlugin(useGSAP);
const subscribeToMount = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

interface PortraitViewerProps {
  src: string;
  darkSrc?: string;
  alt: string;
}

export function PortraitViewer({ src, darkSrc = src, alt }: PortraitViewerProps) {
  const t = useTranslations("Portrait");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const viewerImage = useRef<HTMLDivElement>(null);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const opening = useRef(false);
  const openRequest = useRef(0);
  const closing = useRef(false);
  const previousOverflow = useRef<string | null>(null);
  const ready = useSyncExternalStore(subscribeToMount, clientSnapshot, serverSnapshot);
  const reduced = useReducedMotion();

  function restoreScroll() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }

  useEffect(() => {
    const onLanguage = () => {openRequest.current++; opening.current = false; transition.current?.kill(); dialog.current?.close(); restoreScroll();};
    window.addEventListener("portfolio:language-change", onLanguage);
    return () => {window.removeEventListener("portfolio:language-change", onLanguage); restoreScroll();};
  }, []);

  const { contextSafe } = useGSAP((_, safe) => {
    const button = trigger.current;
    const badge = cursor.current;
    if (!button || !badge || !safe) return;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    gsap.set(badge, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: .65 });
    const xTo = gsap.quickTo(badge, "x", { duration: reduced ? 0 : .22, ease: "power3.out" });
    const yTo = gsap.quickTo(badge, "y", { duration: reduced ? 0 : .22, ease: "power3.out" });
    const enter = safe((event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch" || dialog.current?.open) return;
      button.dataset.cursorReady = "true";
      gsap.set(badge, { x: event.clientX, y: event.clientY });
      xTo(event.clientX, event.clientX);
      yTo(event.clientY, event.clientY);
      gsap.to(badge, { autoAlpha: 1, scale: 1, duration: reduced ? 0 : .3, ease: "power2.out", overwrite: "auto" });
    });
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const leave = safe(() => {
      delete button.dataset.cursorReady;
      gsap.to(badge, { autoAlpha: 0, scale: .65, duration: reduced ? 0 : .25, ease: "power2.out", overwrite: "auto" });
    });
    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointermove", move);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("pointercancel", leave);
    window.addEventListener("blur", leave);
    return () => {
      button.removeEventListener("pointerenter", enter);
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerleave", leave);
      button.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", leave);
      delete button.dataset.cursorReady;
      transition.current?.kill();
      transition.current = null;
      openRequest.current++;
      opening.current = false;
      // A preference change during a transition should leave the viewer usable.
      if (dialog.current?.open) {
        if (closing.current) dialog.current.close();
        else {
          gsap.set(dialog.current, { "--portrait-backdrop-opacity": 1 });
          gsap.set(viewerImage.current, { opacity: 1, scale: 1, y: 0 });
        }
      }
      closing.current = false;
    };
  }, { dependencies: [ready, reduced], revertOnUpdate: true });

  async function open() {
    const modal = dialog.current;
    if (!modal || modal.open || opening.current) return;
    const image = Array.from(viewerImage.current?.querySelectorAll("img") ?? []).find(image => getComputedStyle(image).display !== "none");
    if (!image) return;
    opening.current = true;
    const request = ++openRequest.current;
    // Eager loading starts before the click; decoding keeps the first fade identical to later opens.
    try { await image.decode(); }
    catch {
      if (!image.complete || !image.naturalWidth) {
        if (request === openRequest.current) opening.current = false;
        return;
      }
    }
    if (request !== openRequest.current || !modal.isConnected) return;
    contextSafe(() => {
      opening.current = false;
      if (modal.open) return;
      transition.current?.kill();
      closing.current = false;
      if (cursor.current) gsap.to(cursor.current, { autoAlpha: 0, duration: .15, overwrite: "auto" });
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      gsap.set(modal, { "--portrait-backdrop-opacity": 0 });
      modal.showModal();
      transition.current = gsap.timeline()
        .to(modal, { "--portrait-backdrop-opacity": 1, duration: reduced ? 0 : .5, ease: "power2.out" })
        .fromTo(viewerImage.current, { opacity: 0, scale: .94, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: reduced ? 0 : .6, ease: "power3.out" }, 0);
    })();
  }

  function close() {
    contextSafe(() => {
      if (!dialog.current?.open || closing.current) return;
      closing.current = true;
      transition.current?.kill();
      transition.current = gsap.timeline({ onComplete: () => {
        dialog.current?.close();
        closing.current = false;
      } })
        .to(viewerImage.current, { opacity: 0, scale: .96, y: 12, duration: reduced ? 0 : .35, ease: "power2.in" })
        .to(dialog.current, { "--portrait-backdrop-opacity": 0, duration: reduced ? 0 : .4, ease: "power2.inOut" }, 0);
    })();
  }

  return (
    <>
      <button ref={trigger} className="portrait portrait-trigger" type="button" onClick={open} aria-label={t("open")} aria-haspopup="dialog">
        <Image className="portrait-image portrait-light" src={src} alt={alt} width={96} height={96} preload />
        <Image className="portrait-image portrait-dark" src={darkSrc} alt={alt} width={96} height={96} loading="eager" />
      </button>
      {ready && createPortal(<span ref={cursor} className="portrait-view-cursor" aria-hidden="true">{t("view")}</span>, document.body)}
      {ready && createPortal(<dialog ref={dialog} className="portrait-viewer" aria-label={alt} data-lenis-prevent onClose={restoreScroll} onCancel={event => {
        event.preventDefault();
        close();
      }} onClick={event => {
        if (event.target === event.currentTarget) close();
      }}>
        <div ref={viewerImage} className="portrait-viewer-image">
          <Image className="portrait-light" src={src} alt={alt} fill sizes="(max-width: 810px) 90vw, 80vh" loading="eager" />
          <Image className="portrait-dark" src={darkSrc} alt={alt} fill sizes="(max-width: 810px) 90vw, 80vh" loading="eager" />
        </div>
        <button className="portrait-viewer-close" type="button" onClick={close} aria-label={t("close")} autoFocus>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </dialog>, document.body)}
    </>
  );
}
