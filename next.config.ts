import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { prepareArabicFont } from "./scripts/prepare-fonts.mjs";

prepareArabicFont();

const config: NextConfig = { poweredByHeader: false, experimental: { globalNotFound: true } };
export default createNextIntlPlugin()(config);
