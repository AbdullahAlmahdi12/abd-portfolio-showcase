import { Fragment } from "react";

// Keep Latin brands, technical terms and numerical ranges isolated in RTL prose.
export function LocalizedText({ text }: { text: string }) {
  return text.split(/(\(?[A-Za-z0-9©][A-Za-z0-9 .,+/%=–—-]*\)?)/g).map((part, index) => {
    if (!/^\(?[A-Za-z0-9©]/.test(part)) return part;
    const term = part.trimEnd();
    // Separating whitespace belongs to the surrounding direction, not the Latin island.
    return <Fragment key={index}><bdi dir="ltr">{term}</bdi>{part.slice(term.length)}</Fragment>;
  });
}
