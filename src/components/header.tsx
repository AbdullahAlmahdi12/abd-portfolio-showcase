"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { EmailContact } from "./email-contact";
import { ResumeLink } from "./resume-link";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps { name: string; email: string; emailLink: string; whatsappHref?: string }

export function Header(props: HeaderProps) {
  const pathname = usePathname();
  return <ContactNavigation key={pathname} pathname={pathname} {...props} />;
}

function ContactNavigation({ name, email, emailLink, whatsappHref, pathname }: HeaderProps & { pathname: string }) {
  const t = useTranslations("Navigation");
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const contactToggle = useRef<HTMLButtonElement>(null);
  const contactPanel = useRef<HTMLDivElement>(null);

  function navigateHome(event: MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    setContactOpen(false);
    if (pathname !== "/" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const scrollEvent = new Event("portfolio:scroll-top", { cancelable: true });
    if (!window.dispatchEvent(scrollEvent)) return;
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && contactOpen) {
        setContactOpen(false);
        contactToggle.current?.focus();
      } else if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    const media = matchMedia("(min-width: 810px)");
    function onResize() { setOpen(false); setContactOpen(false); }
    function onLanguage() { setOpen(false); setContactOpen(false); }
    function onOutside(event: PointerEvent) {
      if (event.target instanceof Node && !contactPanel.current?.contains(event.target) && !contactToggle.current?.contains(event.target)) setContactOpen(false);
    }
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onResize);
    window.addEventListener("portfolio:language-change", onLanguage);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onResize);
      window.removeEventListener("portfolio:language-change", onLanguage);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open, contactOpen]);

  useEffect(() => {
    if (contactOpen) contactPanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [contactOpen]);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <nav className="header-inner" aria-label={t("label")}>
        <div className="header-brand">
          <Link className="brand-name" href="/" onClick={navigateHome}>{name}</Link>
        </div>
        <div className="header-links" id="header-navigation">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} onClick={navigateHome}>{t("home")}</Link>
          <Link href="/portfolio" aria-current={pathname.startsWith("/portfolio") ? "page" : undefined} onClick={() => {setOpen(false); setContactOpen(false);}}>{t("portfolio")}</Link>
          <LanguageSwitcher />
        </div>
        <div className="header-tools">
          <div className="header-actions">
            <button ref={contactToggle} className="contact-toggle" type="button" aria-expanded={contactOpen} aria-controls="header-contact" onClick={() => setContactOpen(value => !value)}>{t("contact")}</button>
            <LanguageSwitcher />
            <ThemeToggle />
            <button ref={toggle} className="menu-toggle" type="button" aria-label={t(open ? "closeMenu" : "openMenu")} aria-expanded={open} aria-controls="header-navigation header-contact" onClick={() => setOpen(value => !value)}>
              <span /><span /><span />
            </button>
          </div>
          <div ref={contactPanel} className="header-contact" id="header-contact" data-open={contactOpen || undefined} inert={!open && !contactOpen} aria-hidden={!open && !contactOpen} role="region" aria-label={t("contact")}>
            <EmailContact email={email} href={emailLink} whatsappHref={whatsappHref} />
            <ResumeLink />
          </div>
        </div>
      </nav>
    </header>
  );
}
