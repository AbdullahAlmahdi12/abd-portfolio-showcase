"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

interface Slice { left: number; width: number; index: number }

// Reveal slices of the fully shaped name instead of splitting Arabic text runs.
// Each slice moves independently, while the original letter joins stay intact.
export function ArabicIntroName({name}: {name: string}) {
  const source = useRef<HTMLSpanElement>(null);
  const [slices, setSlices] = useState<Slice[]>([]);
  useLayoutEffect(() => {
    const element = source.current;
    const text = element?.firstChild;
    if (!element || !text) return;
    let active = true;
    function measure() {
      if (!active || !element || !text) return;
      const bounds = element.getBoundingClientRect();
      const range = document.createRange();
      const segments = [...new Intl.Segmenter("ar", {granularity: "grapheme"}).segment(name)];
      setSlices(segments.map((segment, index) => {
        range.setStart(text, segment.index);
        range.setEnd(text, segment.index + segment.segment.length);
        const rect = range.getBoundingClientRect();
        return {left: rect.left - bounds.left, width: rect.width, index};
      }));
    }
    measure();
    void document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {active = false; observer.disconnect();};
  }, [name]);
  return <span className="intro-arabic-name" dir="rtl">
    <span ref={source} className="intro-arabic-source">{name}</span>
    {slices.map(slice => <span key={slice.index} className="intro-arabic-glyph" style={{left: slice.left, width: slice.width, "--character": slice.index} as CSSProperties}>
      <span className="intro-arabic-copy" style={{left: -slice.left}}>{name}</span>
    </span>)}
  </span>;
}
