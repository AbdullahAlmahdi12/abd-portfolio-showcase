import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { prepareArabicFont } from "./scripts/prepare-fonts.mjs";

prepareArabicFont();

const config: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  redirects() {
    return ["", "/ar", "/en"].map(prefix => ({
      source: `${prefix}/portfolio/:path*`,
      destination: `${prefix === "/en" ? "" : prefix}/projects/:path*`,
      permanent: true,
    }));
  },
};
export default createNextIntlPlugin()(config);
