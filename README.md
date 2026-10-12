# Abdullah Al Mahdi — Portfolio Showcase

My personal portfolio, built with Next.js and TypeScript. The site has English and Arabic pages for my projects, background, and contact details, plus a downloadable CV.

[Live Portfolio](https://abdullah-almahdi-portfolio.netlify.app/) · [GitHub profile](https://github.com/AbdullahAlmahdi12)

This repository is the public code showcase; the live link points to my existing portfolio deployment.

![Portfolio home on desktop](docs/images/portfolio-desktop.webp)

## What I built

I rebuilt and personalised a supplied Framer portfolio as a standalone Next.js app. My work includes the components, content integration, language switching, and browser interactions.

- English and Arabic pages, with right-to-left layouts for Arabic.
- A project index and individual case studies with screenshots and live links.
- Responsive navigation, light and dark themes, and a fullscreen portrait viewer.
- GSAP animations and Lenis scrolling, with reduced-motion support.
- Contact controls for copying my email address and downloading my CV.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, next-intl, GSAP, and Lenis.

## Projects

| Project | Focus | Live demo |
| --- | --- | --- |
| Apple iPhone 3D Showcase | Interactive 3D model, React state, and video controls | [View](https://abdullah-iphone-website.netlify.app/) |
| Brain Wave | Reusable React sections, mobile navigation, and parallax | [View](https://abdullah-brain-wave.netlify.app/) |
| HooBank | Shared content data and responsive Tailwind layouts | [View](https://abdullah-hoobank.netlify.app/) |
| abd-studio | Next.js, gallery interactions, and Rive animation fallbacks | [View](https://abd-studio.netlify.app/) |

These are front-end learning projects. Each case study explains my implementation work and credits its reference design. `abd-studio` is an educational recreation of [Kargul Studio](https://kargul.studio/); the original design and creative direction belong to the studio.

## Run locally

Use Node.js 22.18 or newer. From the project directory:

```bash
npm ci
npm run dev
```

`npm ci` installs the dependencies from the lockfile. After that, use `npm run dev` whenever you want to start development. Open the address printed in the terminal, normally http://localhost:3000.

To preview a production build:

```bash
npm run build
npm start
```

The app does not need API keys. If you deploy it at a different address, set `NEXT_PUBLIC_SITE_URL` to that origin; see [.env.example](.env.example).

## Editing content

- `src/content/site.json`: profile, projects, skills, experience, and education.
- `src/content/locales/ar.json`: Arabic content and image descriptions.
- `src/messages/`: translated interface labels.
- `src/app/[locale]/`: pages and locale routes.
- `src/components/`: shared UI and interactive components.
- `public/images/projects/`: project screenshots.
- `docs/resume/`: [editable CV and PDF instructions](docs/resume/README.md).

Update both languages when changing project content.

## Checks

```bash
npm run check
```

This runs ESLint, TypeScript checks, and a production build.

The supplied Framer template informed the portfolio layout; I do not claim its original design as my own. See the [asset notes](docs/assets.md) for sources and reuse terms.
