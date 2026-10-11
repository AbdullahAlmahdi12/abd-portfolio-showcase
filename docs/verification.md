# Showcase verification

## Local results — 11 October 2026

Environment: Windows, Node.js 25.6.1, npm 11.12.1. The documented minimum is Node 22.18; the workflow selects Node 22. Linux/remote CI results are separate from this local record.

| Check | Observed result |
| --- | --- |
| Fresh `npm ci` | Installation completed from the checked-in lockfile |
| `npm run lint` | Exit 0 |
| `npm run typecheck` | Route type generation and TypeScript completed, exit 0 |
| `npm test` | 3 content tests passed |
| `npm run build` | Production build completed, exit 0 |
| `npm run test:browser` | 21 Chromium tests passed, including the public-font regression |
| Additional production renders | 18 home, project-index, and studio-detail renders across English/Arabic, light/dark and 320px/390px/1440px states; no horizontal overflow, missing images, or page errors |
| CV | One page, selectable text, 9 hyperlinks; private repository links removed; rendered layout inspected |
| CV download | Production response bytes match this edition's checked-in PDF |
| Secret scan | Gitleaks 8.30.1 found no detections in the staged release tree |

The source-availability regression failed with the old case-study renderer because the explanatory note was missing. It passed after adding the conditional English/Arabic note. It checks the optional source-link contract rather than assuming that projects must remain private forever.

The public-font regression first failed because the original build served Thmanyah `.otf` files. After switching to bundled Noto Sans Arabic and removing private files from `public/`, it passed: the rendered Arabic body uses a loaded local font, RTL is preserved, font requests contain no `.otf` assets, and all five former public Thmanyah URLs return HTTP 404. A clean production build contains only the Geist WOFF2 and Noto TTF font assets. Arabic intro dismissal, Latin/Arabic prose spacing, desktop/mobile headers and footer wordmarks were also checked.

The browser server uses port 3011 and the application's existing hostname binding. An IPv4-only binding caused localized rewrites to loop during preparation; preserving the working binding resolved it. The no-JavaScript test uses the configured base URL, not the original portfolio's port.

## Links and content

- The original portfolio, all four project demos, Kargul Studio, the GitHub profile, and X returned HTTP 200 during the check.
- LinkedIn returned HTTP 999 to automated requests. Its URL matches the supplied professional profile, but anonymous availability was not confirmed by that check.
- Project repository visibility was checked through GitHub: all four original repositories remained private. Their source actions are omitted in this edition; live and original-design links remain.
- English/Arabic copy, image paths, studio attribution, and project metadata were retained or checked against the inspected source projects. No employment, client, technology, or performance claims were added.
- The Humanizer pass reviewed the final text for marketing language and repetitive phrasing. Existing concrete first-person copy was preserved; the new availability messages use direct wording.
- Screenshots of the rendered candidate were inspected, including the source note in English/Arabic on desktop/mobile and in the dark theme. Review artifacts are local and ignored, except the README preview.

## Dependency findings

`npm audit --omit=dev` reported **0 vulnerabilities**. The full dependency audit reported **5 high-severity entries**, all in the development lint chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`.

The underlying finding is [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), concerning stack exhaustion while parsing deeply nested glob patterns. At verification time, the registry's latest `braces` release was 3.0.3 and the advisory covered it. npm proposed a breaking downgrade of `eslint-config-next` to 14.2.35, not a compatible patched dependency. That downgrade was not applied to a Next.js 16 project.

These tools run against this repository's source and lint configuration, not visitor-supplied glob input. The finding remains recorded; it is not a claim that the full audit is clean. Revisit when a compatible patched release exists, and do not run untrusted lint configuration with credentials.

## Release limits

- This public edition starts with unrelated Git history. The font-containing candidate is preserved separately and privately; deleting fonts only in a later commit or force-pushing that existing GitHub repository would not ensure old cached objects were unavailable.
- Thmanyah is excluded, not converted or hotlinked. The [asset notes](assets.md) retain template/reference-media attribution and reuse limitations. Secret scanning does not establish copyright permission.
- A GitHub Actions workflow is provided without an unverified passing badge. Its configuration alone does not prove a successful remote run.
- No new public deployment or deployment-source migration is claimed. Update the canonical origin and links only after the actual approved deployment exists.
- Browser coverage is Chromium, not a claim of testing every browser or assistive technology. No Lighthouse score or performance improvement is claimed.
- Upstream Geist and Noto license notices are preserved byte-for-byte, including their original trailing spaces; application and documentation changes pass Git's whitespace check.
