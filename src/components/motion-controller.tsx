"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "./use-reduced-motion";

export function MotionController() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: true, smoothWheel: true, lerp: 0.1, syncTouch: false, infinite: false, stopInertiaOnNavigate: true });
    function scrollTop(event: Event) {
      event.preventDefault();
      lenis.scrollTo(0, { duration: 1.1 });
    }
    function scrollProjects(event: Event) {
      const section = document.getElementById("portfolio");
      if (!section) return;
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 88;
      event.preventDefault();
      lenis.scrollTo(section, { offset: -headerHeight - 24, duration: 1.1 });
    }
    window.addEventListener("portfolio:scroll-top", scrollTop);
    window.addEventListener("portfolio:scroll-projects", scrollProjects);
    return () => {
      window.removeEventListener("portfolio:scroll-top", scrollTop);
      window.removeEventListener("portfolio:scroll-projects", scrollProjects);
      lenis.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !("IntersectionObserver" in window)) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        // Animate only when visible; never leave server-rendered content hidden.
        animations.push(entry.target.animate([
          { opacity: 0, transform: "translateY(20px)", filter: "blur(10px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
        ], { duration: 800, easing: "cubic-bezier(.16,1,.3,1)" }));
      }
    }, { threshold: 0 });
    const initialIntro = document.querySelector('.site-sequence:is([data-intro-phase="playing"], [data-intro-phase="finished"])');
    document.querySelectorAll("[data-reveal]").forEach(element => {
      // About belongs to the initial CSS cascade; don't animate it twice.
      if (initialIntro && element.matches(".about-section")) return;
      observer.observe(element);
    });
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [pathname, reduced]);
  return null;
}
