# Asset and provenance record

This public source edition excludes Thmanyah binaries while supporting their use in builds with privately supplied, permitted copies. Screenshots document implementation work; public visibility is not a blanket grant to reuse the depicted artwork.

## Included assets

All paths below are relative to `public/`.

| Files | Source / owner | Terms and decision |
| --- | --- | --- |
| `fonts/geist-latin-variable.woff2`, `fonts/geist-OFL.txt` | Geist, Vercel; copyright and license in the accompanying notice | Retained with the SIL Open Font License 1.1 notice. The font is not relicensed by this project. |
| `fonts/noto-sans-arabic/NotoSansArabic-Variable.ttf`, `fonts/noto-sans-arabic/OFL.txt` | The Noto Project Authors; unmodified Google Fonts distribution | Bundled as the fallback when private Thmanyah files are absent, with the SIL Open Font License 1.1 notice. |
| `images/abdullah-portrait-light.webp`, `images/abdullah-portrait-dark.webp` | Owner-supplied photograph, AI-styled studio portraits | Retained for this personal portfolio, not offered as stock assets or a reusable identity. |
| `images/projects/iphone-desktop.webp`, `images/projects/iphone-mobile.webp` | Screenshots of [the owner's iPhone learning implementation](https://abdullah-iphone-website.netlify.app/) | Retained to document the implementation. Apple product imagery/branding belongs to its respective owners; screenshot provenance does not grant rights to reuse that artwork. |
| `images/projects/brainwave-desktop.webp`, `images/projects/brainwave-mobile.webp` | Screenshots of [the owner's Brain Wave learning implementation](https://abdullah-brain-wave.netlify.app/) | Retained as project documentation. Tutorial/reference design and artwork are not the owner's original commercial work; underlying asset terms have not been independently verified. |
| `images/projects/hoobank-desktop.webp`, `images/projects/hoobank-mobile.webp` | Screenshots of [the owner's HooBank learning implementation](https://abdullah-hoobank.netlify.app/) | Retained as project documentation, not an asset pack. Sample brand, imagery, figures and testimonials are reference content. Underlying redistribution terms have not been independently verified. |
| `images/projects/abd-studio-desktop.webp`, `images/projects/abd-studio-mobile.webp` | Screenshots of [the owner's educational recreation](https://abd-studio.netlify.app/) of [Kargul Studio](https://kargul.studio/) | Retained with visible project attribution. Original design/creative direction and studio reference content belong to Kargul Studio and respective creators. No affiliation or client-work claim; no blanket screenshot/artwork license is granted. |
| `downloads/Abdullah-Al-Mahdi-CV.pdf` | Owner's recruiter-facing CV; editable source in `docs/resume/` | Intended professional contact, education and project information. Original private DOCX and historical backups are excluded. |

The README preview at `docs/images/portfolio-desktop.webp` is a screenshot of the owner's local production build using the permitted private Thmanyah files. Public checkouts without those files use Noto Sans Arabic. The screenshot does not distribute a font binary or change the template or artwork permission boundaries below.

### Noto Sans Arabic source

The font and notice were obtained from [Google Fonts at the pinned source revision](https://github.com/google/fonts/tree/bd8f81ddb5c74d5c8897b36ad88b440266245103/ofl/notosansarabic). The upstream binary is `NotoSansArabic[wdth,wght].ttf`; this edition changes only its filename to simplify paths. Its weight axis supports 100–900. No conversion of Thmanyah is used.

SHA-256 of the bundled binary: `63111b5b2e074dd48cc67692e0a2726d86ee94c1c37fe8598257b7b4e87e869e`.

## Code and design origin

The supplied Framer portfolio informed the layout. This is the owner's personalised Next.js implementation, not a claim to have designed the supplied template. The original template's reuse terms have not been established in this exported edition. Do not market it as an unrestricted reusable template.

Package dependencies retain their own licenses in their distributions. The Rive, Three.js, Apple and Kargul implementations described in project case studies are separate projects, not bundled applications in this repository.

## Intentionally excluded

- All five Thmanyah `.otf` files and the private candidate's font-containing Git history. Local copies live in the ignored `.amp/in/private-fonts/thmanyah/` directory, outside `public/`. They are inputs to a licensed-font build, never copied to Git by the preparation script.
- The generated `src/app/arabic-font.generated.ts` loader. Next.js configuration prepares it before compiling, selecting the complete private font set or the bundled fallback. An incomplete set fails with an actionable message.
- Seven unused historical template JPEGs and unused Fraunces, Public Sans and Inter font files.
- Original Git history, branches and tags; private capture/handoff material and old migration scripts.
- Private resume DOCX, superseded PDF backups, local review logs and machine-specific editor state.
- `.env` files other than the public placeholder example; dependencies, build output and test artifacts.

No active image path was removed just to hide an unresolved permission question. The optional fallback is a separately licensed font, not renamed or converted Thmanyah files.

## Permission boundaries

The owner has permission to use ثمانية, but has not confirmed permission to redistribute the binaries in public GitHub source. Do not commit, convert, or add public download links to those files. Keep private contracts and correspondence outside Git.

Excluding the inputs from Git does not exclude them from a compiled Thmanyah build: Next.js emits font assets that browsers must receive to display the font. Confirm that a deployment is covered by the relevant web embedding/hosting permission before publishing that build. Earlier GitHub CI runs used the Noto fallback because they had no private font files; that workflow has since been removed. No private-font deployment or build archive upload is claimed here.

The supplied-template terms and underlying reference-project artwork terms have not been independently established. This record identifies uncertainty, not a finding of infringement. Screenshots remain attributed implementation documentation, not an unrestricted asset pack; check the applicable terms before reusing or distributing the depicted designs separately.

No blanket source-code or media license has been added while incorporated-template and asset terms remain unresolved. Public visibility is not itself a redistribution license.
