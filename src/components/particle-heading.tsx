"use client";

import { useEffect, useRef } from "react";

const padding = 64;
const spacing = 2;
const cellSize = 32;
const motionQuery = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  dotRadius: number;
  turnCos: number;
  turnSin: number;
  blend: number;
}

interface PaintBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// Keep real, selectable text at rest; only replace its paint while particles move.
export function ParticleHeading({ text, id, as: Tag = "h1", className = "" }: { text: string; id?: string; as?: "h1" | "p"; className?: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const label = textRef.current;
    const canvas = canvasRef.current;
    if (!heading || !label || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const media = window.matchMedia(motionQuery);
    const bitmap = document.createElement("canvas");
    const paint = bitmap.getContext("2d");
    if (!paint) return;

    const cells = new Map<number, Particle[]>();
    const active = new Set<Particle>();
    let columns = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let color = "";
    let radius = 42;
    let frame = 0;
    let lastTime = 0;
    let ready = false;
    let disposed = false;
    let inView = false;
    let invalidated = true;
    let preparationFrame = 0;
    let headingBounds: DOMRect | null = null;
    let paintedBounds: PaintBounds | null = null;
    let pointer: { x: number; y: number } | null = null;

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      pointer = null;
      delete heading!.dataset.particlesActive;
      if (paintedBounds) context!.clearRect(0, 0, width, height);
      paintedBounds = null;
      for (const particle of active) {
        particle.x = particle.homeX;
        particle.y = particle.homeY;
        particle.vx = particle.vy = particle.blend = 0;
      }
      active.clear();
    }

    // Coalesce font, theme and resize notifications, and defer offscreen rasters.
    function schedulePrepare() {
      invalidated = true;
      ready = false;
      headingBounds = null;
      reset();
      if (disposed || !inView || preparationFrame) return;
      preparationFrame = requestAnimationFrame(() => {
        preparationFrame = 0;
        prepare();
      });
    }

    function prepare() {
      reset();
      ready = false;
      cells.clear();
      if (disposed || !inView || !media.matches) return;
      invalidated = false;
      const bounds = heading!.getBoundingClientRect();
      headingBounds = bounds;
      if (!bounds.width || !bounds.height) return;
      const style = getComputedStyle(heading!);
      width = Math.ceil(bounds.width) + padding * 2;
      height = Math.ceil(bounds.height) + padding * 2;
      columns = Math.ceil(width / cellSize);
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      color = style.color;
      radius = Math.min(48, Math.max(30, parseFloat(style.fontSize) * .6));
      const left = Math.min(padding, Math.max(0, bounds.left));
      const right = Math.min(padding, Math.max(0, document.documentElement.clientWidth - bounds.right));
      const visibleWidth = bounds.width + left + right;
      canvas!.width = Math.ceil(visibleWidth * ratio);
      canvas!.height = Math.ceil(height * ratio);
      canvas!.style.width = `${visibleWidth}px`;
      canvas!.style.height = `${height}px`;
      canvas!.style.left = `${-left}px`;
      context!.setTransform(ratio, 0, 0, ratio, -(padding - left) * ratio, 0);
      bitmap.width = Math.ceil(width * ratio);
      bitmap.height = canvas!.height;
      paint!.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint!.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      paint!.letterSpacing = style.letterSpacing;
      paint!.fillStyle = color;
      paint!.direction = style.direction === "rtl" ? "rtl" : "ltr";
      paint!.textAlign = style.direction === "rtl" ? "right" : "left";

      // Read browser line breaks, then paint whole lines to preserve Arabic shaping.
      const node = label!.firstChild;
      if (!node) return;
      const range = document.createRange();
      const lines: { text: string; left: number; right: number; top: number; height: number }[] = [];
      let offset = 0;
      for (const character of Array.from(text)) {
        range.setStart(node, offset);
        offset += character.length;
        range.setEnd(node, offset);
        const rect = range.getBoundingClientRect();
        if (!rect.height) continue;
        let line = lines.find(item => Math.abs(item.top - rect.top) < 1);
        if (!line) {
          line = { text: "", left: rect.left, right: rect.right, top: rect.top, height: rect.height };
          lines.push(line);
        }
        line.text += character;
        line.left = Math.min(line.left, rect.left);
        line.right = Math.max(line.right, rect.right);
      }
      for (const line of lines) {
        const metrics = paint!.measureText(line.text);
        const ascent = metrics.fontBoundingBoxAscent;
        const descent = metrics.fontBoundingBoxDescent;
        const baseline = padding + line.top - bounds.top + (line.height - ascent - descent) / 2 + ascent;
        const x = padding + (style.direction === "rtl" ? line.right : line.left) - bounds.left;
        paint!.fillText(line.text, x, baseline);
      }

      // Sample the rendered glyphs once. Pointer movement never reads pixels.
      const sample = document.createElement("canvas");
      sample.width = width;
      sample.height = height;
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;
      sampleContext.drawImage(bitmap, 0, 0, width, height);
      const pixels = sampleContext.getImageData(0, 0, width, height).data;
      let count = 0;
      for (let y = padding; y < height - padding; y += spacing) {
        for (let x = padding; x < width - padding; x += spacing) {
          let alpha = 0;
          for (let dy = 0; dy < spacing; dy++) {
            for (let dx = 0; dx < spacing; dx++) {
              alpha += pixels[((y + dy) * width + x + dx) * 4 + 3] ?? 0;
            }
          }
          alpha /= spacing * spacing * 255;
          if (alpha < .04) continue;
          const homeX = x + spacing / 2;
          const homeY = y + spacing / 2;
          const seed = Math.random();
          const turn = (seed - .5) * .9;
          const particle = { homeX, homeY, x: homeX, y: homeY, vx: 0, vy: 0, alpha,
            dotRadius: .65 + seed * .5, turnCos: Math.cos(turn), turnSin: Math.sin(turn), blend: 0 };
          const key = Math.floor(homeY / cellSize) * columns + Math.floor(homeX / cellSize);
          const cell = cells.get(key);
          if (cell) cell.push(particle);
          else cells.set(key, [particle]);
          count++;
        }
      }
      ready = count > 0;
    }

    function animate(now: number) {
      frame = 0;
      if (disposed || !inView || !media.matches || document.hidden) { reset(); return; }
      const step = Math.min((now - (lastTime || now - 16.67)) / 16.67, 2);
      lastTime = now;
      // Only nearby home cells can receive a force. Returning particles stay active.
      if (pointer) {
        const radiusSquared = radius * radius;
        const minColumn = Math.max(0, Math.floor((pointer.x - radius) / cellSize));
        const maxColumn = Math.min(columns - 1, Math.floor((pointer.x + radius) / cellSize));
        const minRow = Math.max(0, Math.floor((pointer.y - radius) / cellSize));
        const maxRow = Math.min(Math.ceil(height / cellSize) - 1, Math.floor((pointer.y + radius) / cellSize));
        for (let row = minRow; row <= maxRow; row++) {
          for (let column = minColumn; column <= maxColumn; column++) {
            const cell = cells.get(row * columns + column);
            if (!cell) continue;
            for (const particle of cell) {
              const dx = particle.homeX - pointer.x;
              const dy = particle.homeY - pointer.y;
              const distanceSquared = dx * dx + dy * dy;
              if (distanceSquared >= radiusSquared) continue;
              const distance = Math.sqrt(distanceSquared);
              const nx = distance ? dx / distance : 1;
              const ny = distance ? dy / distance : 0;
              const force = (1 - distance / radius) ** 2 * 2.1 * step;
              particle.vx += (nx * particle.turnCos - ny * particle.turnSin) * force;
              particle.vy += (ny * particle.turnCos + nx * particle.turnSin) * force;
              active.add(particle);
            }
          }
        }
      }
      const damping = .82 ** step;
      let nextBounds: PaintBounds | null = null;
      for (const particle of active) {
        particle.vx += (particle.homeX - particle.x) * .045 * step;
        particle.vy += (particle.homeY - particle.y) * .045 * step;
        particle.vx *= damping;
        particle.vy *= damping;
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        const dx = particle.x - particle.homeX;
        const dy = particle.y - particle.homeY;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < .08 ** 2 && particle.vx * particle.vx + particle.vy * particle.vy < .08 ** 2) {
          particle.x = particle.homeX;
          particle.y = particle.homeY;
          particle.vx = particle.vy = particle.blend = 0;
          active.delete(particle);
        } else {
          particle.blend = distanceSquared >= 9 ? 1 : Math.sqrt(distanceSquared) / 3;
          // Cover home tiles, moving dots, and their antialiased edges.
          const left = Math.min(particle.homeX - 2, particle.x - 2);
          const top = Math.min(particle.homeY - 2, particle.y - 2);
          const right = Math.max(particle.homeX + 2, particle.x + 2);
          const bottom = Math.max(particle.homeY + 2, particle.y + 2);
          if (!nextBounds) nextBounds = { left, top, right, bottom };
          else {
            nextBounds.left = Math.min(nextBounds.left, left);
            nextBounds.top = Math.min(nextBounds.top, top);
            nextBounds.right = Math.max(nextBounds.right, right);
            nextBounds.bottom = Math.max(nextBounds.bottom, bottom);
          }
        }
      }
      if (!nextBounds) { reset(); return; }

      context!.globalAlpha = 1;
      if (!paintedBounds) {
        context!.drawImage(bitmap, 0, 0, width, height);
        heading!.dataset.particlesActive = "true";
      } else {
        // Restore both old and new regions so settled particles and trails disappear.
        const left = Math.max(0, Math.floor(Math.min(paintedBounds.left, nextBounds.left) * ratio) / ratio);
        const top = Math.max(0, Math.floor(Math.min(paintedBounds.top, nextBounds.top) * ratio) / ratio);
        const right = Math.min(width, Math.ceil(Math.max(paintedBounds.right, nextBounds.right) * ratio) / ratio);
        const bottom = Math.min(height, Math.ceil(Math.max(paintedBounds.bottom, nextBounds.bottom) * ratio) / ratio);
        context!.clearRect(left, top, right - left, bottom - top);
        context!.drawImage(bitmap, left * ratio, top * ratio, (right - left) * ratio, (bottom - top) * ratio,
          left, top, right - left, bottom - top);
      }
      paintedBounds = nextBounds;
      // Batch all erased home tiles before drawing dots; neighbouring dots stay intact.
      context!.fillStyle = color;
      context!.globalCompositeOperation = "destination-out";
      context!.beginPath();
      for (const particle of active) context!.rect(particle.homeX - 1, particle.homeY - 1, spacing, spacing);
      context!.fill();
      context!.globalCompositeOperation = "source-over";
      for (const particle of active) {
        const x = particle.homeX - 1;
        const y = particle.homeY - 1;
        if (particle.blend < 1) {
          context!.globalAlpha = 1 - particle.blend;
          context!.drawImage(bitmap, x * ratio, y * ratio, spacing * ratio, spacing * ratio, x, y, spacing, spacing);
        }
        context!.globalAlpha = particle.alpha * particle.blend;
        context!.beginPath();
        context!.arc(particle.x, particle.y, particle.dotRadius, 0, Math.PI * 2);
        context!.fill();
      }
      context!.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    }

    function move(event: PointerEvent) {
      if (!ready || !inView || !media.matches || event.pointerType === "touch" || event.buttons || window.getSelection()?.toString()) return;
      const bounds = headingBounds ?? (headingBounds = heading!.getBoundingClientRect());
      pointer = { x: event.clientX - bounds.left + padding, y: event.clientY - bounds.top + padding };
      if (!frame) frame = requestAnimationFrame(animate);
    }
    function enter(event: PointerEvent) {
      // The intro or page transition may have moved the heading since preparation.
      headingBounds = heading!.getBoundingClientRect();
      move(event);
    }
    function leave() { pointer = null; headingBounds = null; }
    function scroll() { leave(); headingBounds = null; }
    function visibility() { if (document.hidden) reset(); }

    // Theme/device/font changes invalidate the raster, without rerendering React per frame.
    const resize = new ResizeObserver(schedulePrepare);
    const theme = new MutationObserver(schedulePrepare);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      headingBounds = null;
      if (!inView) reset();
      else if (invalidated) schedulePrepare();
    });
    intersection.observe(heading);
    resize.observe(heading);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "dir", "class"] });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", schedulePrepare);
    scheme.addEventListener("change", schedulePrepare);
    document.fonts.addEventListener("loadingdone", schedulePrepare);
    document.addEventListener("visibilitychange", visibility);
    heading.addEventListener("pointermove", move);
    heading.addEventListener("pointerenter", enter);
    heading.addEventListener("pointerleave", leave);
    heading.addEventListener("pointercancel", leave);
    heading.addEventListener("pointerdown", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("resize", schedulePrepare);
    window.addEventListener("scroll", scroll, { passive: true });
    void document.fonts.ready.then(() => { if (!disposed) schedulePrepare(); });

    return () => {
      disposed = true;
      reset();
      cancelAnimationFrame(preparationFrame);
      resize.disconnect();
      theme.disconnect();
      intersection.disconnect();
      media.removeEventListener("change", schedulePrepare);
      scheme.removeEventListener("change", schedulePrepare);
      document.fonts.removeEventListener("loadingdone", schedulePrepare);
      document.removeEventListener("visibilitychange", visibility);
      heading.removeEventListener("pointermove", move);
      heading.removeEventListener("pointerenter", enter);
      heading.removeEventListener("pointerleave", leave);
      heading.removeEventListener("pointercancel", leave);
      heading.removeEventListener("pointerdown", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("resize", schedulePrepare);
      window.removeEventListener("scroll", scroll);
    };
  }, [text]);

  return (
    <Tag ref={headingRef} id={id} className={`particle-heading ${className}`.trim()}>
      <span ref={textRef} className="particle-heading-text">{text}</span>
      <canvas ref={canvasRef} className="particle-heading-canvas" aria-hidden="true" />
    </Tag>
  );
}
