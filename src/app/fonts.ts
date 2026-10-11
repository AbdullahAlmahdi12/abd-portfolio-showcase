import localFont from "next/font/local";

export const geist = localFont({src: "../../public/fonts/geist-latin-variable.woff2", variable: "--font-geist", weight: "100 900", display: "swap"});
export const arabic = localFont({
  src: "../../public/fonts/noto-sans-arabic/NotoSansArabic-Variable.ttf",
  variable: "--font-arabic", weight: "100 900", display: "swap", preload: false,
});
