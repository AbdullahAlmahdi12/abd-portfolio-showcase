import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import content from "@/content/site.json";
const middleware = createMiddleware(routing);
const paths = new Set(["/", "/portfolio", "/404", ...content.projects.map(project => `/portfolio/${project.slug}`)]);
export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const locale = pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";
  const page = pathname.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";
  if (paths.has(page)) return middleware(request);
  // Select a complete localized error document before streaming starts.
  const fallback = new NextRequest(new URL(`${locale === "ar" ? "/ar" : ""}/404`, request.url), {headers: request.headers});
  const response = middleware(fallback);
  response.headers.delete("x-middleware-next");
  response.headers.set("x-middleware-rewrite", new URL(`/${locale}/404`, request.url).toString());
  return new NextResponse(response.body, {status: 404, headers: response.headers});
}
export const config = { matcher: ["/((?!api|_next|_netlify|\\.netlify|_vercel|images|fonts|.*\\..*).*)"] };
