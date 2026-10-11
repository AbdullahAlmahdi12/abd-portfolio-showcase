"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export function EmailContact({ email, href, whatsappHref }: { email: string; href: string; whatsappHref?: string }) {
  const t = useTranslations("Email");
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);
  useEffect(() => { if (status === "error") { input.current?.focus(); input.current?.select(); } }, [status]);

  async function copy() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="email-contact">
      <div className="email-row flex flex-wrap items-center gap-4">
        <a className="email-link" dir="ltr" href={href}>{email}</a>
        <button type="button" className="copy-button" onClick={copy} aria-label={t("copyLabel")}>
          {status === "copied" ? t("copied") : status === "error" ? t("retry") : t("copy")}
        </button>
        {whatsappHref && <a className="whatsapp-button" href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={t("whatsappLabel")} title={`${t("whatsapp")} · +963 949 381 491`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2a9.84 9.84 0 0 0-8.52 14.75L2 22l5.4-1.42A9.86 9.86 0 1 0 12.04 2Zm0 18.04a8.17 8.17 0 0 1-4.17-1.14l-.3-.18-3.2.84.85-3.12-.2-.32a8.2 8.2 0 1 1 7.02 3.92Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12-.16.25-.63.8-.78.96-.14.17-.28.19-.53.07-.24-.13-1.03-.38-1.96-1.21-.72-.64-1.2-1.43-1.34-1.67-.14-.25-.01-.38.11-.5.11-.1.25-.28.37-.42.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.06s.88 2.38 1 2.55c.13.16 1.73 2.64 4.2 3.7.59.26 1.05.41 1.41.52.6.2 1.14.17 1.57.1.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.47-.28Z" />
          </svg>
        </a>}
      </div>
      <span className={status === "error" ? "copy-feedback" : "sr-only"} role="status" aria-live="polite">
        {status === "copied" ? t("success") : status === "error" ? t("failure") : ""}
      </span>
      {status === "error" && (
        <input ref={input} className="manual-email" dir="ltr" aria-label={t("manual")} value={email} readOnly onFocus={event => event.currentTarget.select()} />
      )}
    </div>
  );
}
