import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import type { SiteContent } from "../src/content/types";

test("complete content exists independently of the private resume and handoff", () => {
  assert.ok(existsSync("src/content/site.json"), "editable local content must exist");
});

test("portfolio projects have translated copy, real local images and valid link formats", () => {
  const site: SiteContent = JSON.parse(readFileSync("src/content/site.json", "utf8"));
  const arabic = JSON.parse(readFileSync("src/content/locales/ar.json", "utf8"));
  assert.equal(site.profile.name, "Abdullah Al Mahdi");
  assert.equal(site.profile.emailLink, `mailto:${site.profile.email}`);
  assert.equal(new Set(site.projects.map(project => project.slug)).size, site.projects.length);
  assert.ok(existsSync(`public${site.profile.photo.src}`));
  for (const project of site.projects) {
    assert.ok(!("client" in project) && !("year" in project), "do not invent project clients or dates");
    assert.ok(arabic.projects[project.slug]?.description.length, `missing Arabic copy: ${project.slug}`);
    for (const link of [project.liveLink, project.repositoryLink].filter(Boolean)) {
      assert.equal(new URL(link!).protocol, "https:");
    }
    for (const image of [project.cover, ...project.gallery]) {
      assert.ok(existsSync(`public${image.src}`));
      assert.ok(image.alt && arabic.imageAlts[image.alt], `missing image description: ${image.src}`);
      assert.doesNotMatch(image.alt, /placeholder|temporary template/i);
    }
  }
});

test("abd-studio is presented as a personal recreation with original-design attribution", () => {
  const site = JSON.parse(readFileSync("src/content/site.json", "utf8"));
  const arabic = JSON.parse(readFileSync("src/content/locales/ar.json", "utf8"));
  const studio = site.projects.find((project: { slug: string }) => project.slug === "abd-studio");
  assert.ok(studio, "abd-studio must be discoverable in the portfolio");
  assert.equal(studio.originalLink, "https://kargul.studio/");
  assert.match(studio.description.join(" "), /educational|learning/i);
  assert.match(studio.description.join(" "), /design and creative direction belong to Kargul Studio/);
  assert.match(arabic.projects[studio.slug].description.join(" "), /Kargul Studio/);
});
