import { test, expect, type Page } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import type { SiteContent } from "../src/content/types";

const site: SiteContent = JSON.parse(readFileSync("src/content/site.json", "utf8"));
const english = JSON.parse(readFileSync("src/messages/en.json", "utf8"));
const arabic = JSON.parse(readFileSync("src/messages/ar.json", "utf8"));
const artifacts = ".amp/in/artifacts";
mkdirSync(artifacts, { recursive: true });
async function settled(page: Page) {
  await expect(page.locator("[data-intro]")).toBeHidden({ timeout: 6000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1100);
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
}

test("homepage contains every section, link and local asset, without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await settled(page);
  await expect(page.getByRole("heading", { name: site.profile.name, exact: true })).toBeVisible();
  for (const name of ["About", "Skills & Tools", "Portfolio", "Work History", "Education"]) await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(site.projects.length);
  await expect(page.locator(".tool-group li")).toHaveCount(site.tools.length);
  await expect(page.locator(".work-item li")).toHaveCount(site.workHistory.reduce((count, job) => count + job.impacts.length, 0));
  await expect(page.getByRole("link", { name: "Get Template Free" })).toHaveCount(0);
  for (const social of site.profile.socials) await expect(page.locator(".hero").getByRole("link", { name: social.label, exact: true })).toHaveAttribute("href", social.href);
  await page.locator("header").getByRole("button", { name: "Contact", exact: true }).click();
  await expect(page.locator("header").getByRole("link", { name: site.profile.email })).toHaveAttribute("href", site.profile.emailLink);
  await page.keyboard.press("Escape");
  await revealAll(page);
  expect(await page.locator("img").evaluateAll(images => images.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
});

for (const project of site.projects) {
  test(`card and direct route: ${project.slug}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.locator(`a[href='/portfolio/${project.slug}']`).click();
    await expect(page).toHaveURL(`/portfolio/${project.slug}`);
    await expect(page.getByRole("heading", { name: project.title, exact: true })).toBeVisible();
    await expect(page.locator(".case-cover img")).toHaveCount(1);
    await expect(page.locator(".project-goal")).toContainText(project.goal);
    await expect(page.getByRole("link", { name: "See it live" })).toHaveAttribute("href", project.liveLink);
    if (project.originalLink) {
      await expect(page.getByRole("link", { name: "Original Kargul Studio website" })).toHaveAttribute("href", project.originalLink);
      await expect(page.locator(".case-description")).toContainText("The original design and creative direction belong to Kargul Studio");
    }
    await page.getByRole("link", { name: "Back to Portfolio", exact: true }).first().click();
    await expect(page).toHaveURL("/portfolio");
    const response = await page.goto(`/portfolio/${project.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${project.title} — Portfolio`);
  });
}

test("missing routes return HTTP 404; the explicit error preview remains accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/unknown-page", "/portfolio/unknown-project", "/404"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(route === "/404" ? 200 : 404);
    await expect(page.getByRole("heading", { name: "This page doesn't exist." })).toBeVisible();
    await page.getByRole("link", { name: "Back to home", exact: true }).click();
    await expect(page).toHaveURL("/");
  }
});

test("mobile header expands, copies, closes with Escape, and stays keyboard accessible", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation menu" });
  await expect(page.locator("header .email-contact")).toBeHidden();
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("header .email-contact")).toBeVisible();
  await page.locator("header").getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator("header .copy-button")).toHaveText("Copied!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.profile.email);
  await page.screenshot({ path: `${artifacts}/mobile-header-open.png` });
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.locator("header").getByRole("link", { name: site.profile.name }).click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("copy errors expose a selectable fallback instead of false success", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new Error("Permission denied"); } } });
  });
  await page.goto("/");
  await page.locator("header").getByRole("button", { name: "Contact", exact: true }).click();
  await page.locator("header").getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator("header .copy-button")).toHaveText("Try again");
  await expect(page.getByRole("textbox", { name: "Email address to copy manually" })).toHaveValue(site.profile.email);
  await expect(page.getByRole("status").filter({ hasText: "Copy unavailable" })).toBeVisible();
});

test("intro automatically dismisses, can be skipped, and is absent with reduced motion", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-intro]")).toBeVisible();
  await settled(page);
  await page.reload();
  await expect(page.locator("[data-intro]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-intro]")).toBeHidden();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("[data-intro]")).toBeHidden();
  await expect(page.locator(".hero h1")).toBeVisible();
  expect(await page.locator(".hero h1").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  expect(await page.locator("html").getAttribute("class")).not.toContain("lenis");
});

for (const width of [390, 810, 1200, 1440, 320, 809, 1199, 1201]) {
  test(`responsive rendered pages at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    for (const [route, name] of [["/", "home"], [`/portfolio/${site.projects[0].slug}`, "case"], ["/404", "missing"]]) {
      await page.goto(route);
      await settled(page);
      await noOverflow(page);
      await expect(page.locator("main")).toBeVisible();
      if ([390, 810, 1200, 1440].includes(width)) {
        await revealAll(page);
        await page.screenshot({ path: `${artifacts}/${name}-${width}.png`, fullPage: true });
      }
    }
  });
}

test("essential content remains available without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: site.profile.name, exact: true })).toBeVisible();
  await expect(page.locator("[data-intro]")).toBeHidden();
  await page.locator(".project-card").first().click();
  await expect(page.getByRole("heading", { name: site.projects[0].title, exact: true })).toBeVisible();
  await context.close();
});

test("Arabic prose keeps visible spacing after Latin technical terms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ar/portfolio/abd-studio");
  await page.evaluate(() => document.fonts.ready);
  const gap = await page.locator(".case-description").evaluate(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const bounds: Record<string, { left: number; right: number }> = {};
    while (walker.nextNode()) {
      const node = walker.currentNode;
      for (const word of ["Rive", "الحركات"]) {
        const offset = (node.textContent ?? "").indexOf(word);
        if (offset < 0) continue;
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset + word.length);
        const rect = range.getBoundingClientRect();
        bounds[word] = { left: rect.left, right: rect.right };
      }
    }
    return bounds.Rive.left - bounds["الحركات"].right;
  });
  expect(gap).toBeGreaterThan(2);
});

test("project pages explain source availability in both languages", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [prefix, messages] of [["", english], ["/ar", arabic]] as const) {
    for (const project of site.projects) {
      await page.goto(`${prefix}/portfolio/${project.slug}`);
      const source = page.getByRole("link", { name: messages.CaseStudy.code, exact: true });
      if (project.repositoryLink) {
        await expect(source).toHaveAttribute("href", project.repositoryLink);
      } else {
        await expect(source).toHaveCount(0);
        await expect(page.getByText(messages.CaseStudy.privateCode, { exact: true })).toBeVisible();
      }
    }
  }
});

test("Arabic typography prefers privately supplied Thmanyah without exposing the input directory", async ({ page, request }) => {
  const fonts: string[] = [];
  page.on("response", response => {
    if (response.request().resourceType() === "font") fonts.push(response.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ar");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => {
    const family = getComputedStyle(document.body).fontFamily.split(",")[0].replaceAll('"', "").trim();
    return [...document.fonts].some(font => font.family.replaceAll('"', "") === family && font.status === "loaded");
  })).toBe(true);
  expect(fonts.length).toBeGreaterThan(0);
  const weights = ["Light", "Regular", "Medium", "Bold", "Black"];
  const hasThmanyah = weights.every(weight => existsSync(`.amp/in/private-fonts/thmanyah/thmanyahsans-${weight}.otf`));
  expect(fonts.some(url => /thmanyahsans/i.test(url))).toBe(hasThmanyah);
  expect(fonts.some(url => /NotoSansArabic/i.test(url))).toBe(!hasThmanyah);
  for (const weight of ["Light", "Regular", "Medium", "Bold", "Black"]) {
    const response = await request.get(`/fonts/thmanyah/thmanyahsans-${weight}.otf`);
    expect(response.status()).toBe(404);
    const privateResponse = await request.get(`/.amp/in/private-fonts/thmanyah/thmanyahsans-${weight}.otf`);
    expect(privateResponse.status()).toBe(404);
  }
});
