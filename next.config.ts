import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const config: NextConfig = { poweredByHeader: false, experimental: { globalNotFound: true } };
export default createNextIntlPlugin()(config);
