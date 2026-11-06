export const faviconPaths = {
  light: "/images/favicon-light.png?v=2",
  dark: "/images/favicon-dark.png?v=2",
};

export function updateThemeFavicon(theme: "light" | "dark") {
  const icon = document.getElementById("theme-favicon");
  if (icon instanceof HTMLLinkElement && icon.getAttribute("href") !== faviconPaths[theme]) {
    icon.href = faviconPaths[theme];
  }
}

// Select the page theme and favicon together before hydration, even when storage is blocked.
export const themeInitScript = `(() => {
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  } catch {}
  const chosen = document.documentElement.dataset.theme;
  const theme = chosen === "light" || chosen === "dark" ? chosen : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const icon = document.getElementById("theme-favicon") || document.createElement("link");
  icon.id = "theme-favicon";
  icon.rel = "icon";
  icon.type = "image/png";
  icon.sizes = "64x64";
  icon.href = ${JSON.stringify(faviconPaths)}[theme];
  document.head.appendChild(icon);
})()`;
