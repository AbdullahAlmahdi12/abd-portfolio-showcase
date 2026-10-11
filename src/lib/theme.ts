// Runs before body paint; storage failure preserves the device-based CSS default.
export const themeInitScript = `try{const t=localStorage.getItem("portfolio-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch{}`;
