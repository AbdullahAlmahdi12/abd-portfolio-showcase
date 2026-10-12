# Showcase verification

## Current font selection

Thmanyah is preferred when the complete permitted font set is supplied privately. The original public-source release below used Noto only; that is now the fallback for checkouts without those files.

| Mode / check | Observed result |
| --- | --- |
| Owner's private-font build | Lint, typecheck, 3 content tests, build, and all 21 browser tests passed |
| Fresh source-only checkout | `npm ci`, lint, typecheck, 3 content tests, build, and all 21 browser tests passed without private files |
| Font-selection regression | Failed against the Noto-only build with private inputs present; passed after restoring preference for Thmanyah |
| Browser font requests | Thmanyah assets loaded in the owner's build; Noto assets loaded in the source-only checkout |
| Private input paths | Both the old public font URLs and `.amp/in/private-fonts/` URLs return HTTP 404 |
| Selection edge cases | Missing files select Noto; partial inputs fail clearly; all five weights select Thmanyah; repeated preparation does not rewrite unchanged output |
| Rendered typography | 18 private-font page renders across English/Arabic, desktop/mobile and light/dark states checked and representative screenshots inspected |

The Thmanyah build contains generated font assets needed by browsers. Those assets were used only for local verification and were not uploaded to GitHub or deployed. Private inputs and the generated loader are ignored. The source-only build contains Geist and Noto, not Thmanyah.

The isolated source-only checkout is nested under local scratch storage, so Next.js reported a multiple-lockfile workspace inference warning there. It did not prevent installation, compilation, or browser tests; no production configuration was changed to suppress a scratch-only warning.

## Initial public-source release results — 11 October 2026

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

## Public-release verification — 11 October 2026

- [Fresh Linux CI](https://github.com/AbdullahAlmahdi12/abd-portfolio-showcase/actions/runs/38150787702) passed on Node 22.23.3 and npm 10.9.9: lockfile installation, lint, typecheck, 3 content tests, production build, and all 21 browser tests.
- Gitleaks found no detections in the sanitized release tree, its new Git history, or the CI log. No old font-containing commits were pushed into the replacement repository.
- Public visibility and anonymous access were checked: the repository and raw README returned HTTP 200, and cloning without a credential helper succeeded.
- Both old candidate commits, all five old Thmanyah blob IDs, and the five former raw font paths returned HTTP 404 through the new public repository.
- The old candidate remains a separate private repository. Its anonymous API response was HTTP 404. Do not make that archive public: it retains the font-containing history for private preservation.
- Local Thmanyah copies and old Git metadata are outside `public/` in ignored private storage. The original portfolio and its deployment remain unchanged. Local development and preview servers were stopped after verification.

## Dependency findings

`npm audit --omit=dev` reported **0 vulnerabilities**. The full dependency audit reported **5 high-severity entries**, all in the development lint chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`.

The underlying finding is [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), concerning stack exhaustion while parsing deeply nested glob patterns. At verification time, the registry's latest `braces` release was 3.0.3 and the advisory covered it. npm proposed a breaking downgrade of `eslint-config-next` to 14.2.35, not a compatible patched dependency. That downgrade was not applied to a Next.js 16 project.

These tools run against this repository's source and lint configuration, not visitor-supplied glob input. The finding remains recorded; it is not a claim that the full audit is clean. Revisit when a compatible patched release exists, and do not run untrusted lint configuration with credentials.

## Release limits

- This public edition starts with unrelated Git history. The font-containing candidate is preserved separately and privately; deleting fonts only in a later commit or force-pushing that existing GitHub repository would not ensure old cached objects were unavailable.
- Thmanyah binaries are excluded from public Git, not converted or hotlinked. Licensed-font builds still embed and serve those files through Next.js; deployment must comply with the relevant web-use permission. The [asset notes](assets.md) retain template/reference-media attribution and reuse limitations. Secret scanning does not establish copyright permission.
- Remote CI evidence above applies to the linked source revision; workflow configuration alone is not evidence of a passing run.
- No new public deployment or deployment-source migration is claimed. Update the canonical origin and links only after the actual approved deployment exists.
- Browser coverage is Chromium, not a claim of testing every browser or assistive technology. No Lighthouse score or performance improvement is claimed.
- Upstream Geist and Noto license notices are preserved byte-for-byte, including their original trailing spaces; application and documentation changes pass Git's whitespace check.
