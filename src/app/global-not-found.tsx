import { geist } from "./fonts";
import Link from "next/link";
import "./globals.css";
export default function GlobalNotFound() {
  return <html lang="en" dir="ltr" className={geist.variable}><body><main className="missing-page"><div className="missing-content"><h1>This page doesn&apos;t exist.</h1><Link href="/">Back to home</Link></div></main></body></html>;
}
