# Convalt Energy 3D Experience

A browser-based interactive experience for presenting Convalt Energy through immersive 3D visuals and a modern web interface.

## Author

**Afaq Ahmad** — Developer

This project was prepared, adapted, and documented by Afaq Ahmad.

## Overview

The application is a Next.js App Router project intended to serve as the public web experience for Convalt Energy. It is structured for interactive visual storytelling, responsive presentation, and future 3D/WebGL enhancements.

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Vercel Analytics in production
- Three.js for interactive 3D/WebGL visuals
- Next.js App Router

## Project structure

```text
app/
  layout.tsx       Root layout and SEO metadata
  page.tsx         Main experience route
  globals.css      Global styles
public/            Static assets
components/        Reusable UI components
lib/               Shared utilities
```

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000` in a browser.

## Production build

Validate the production bundle with:

```bash
pnpm build
pnpm start
```

## Deployment

The project is configured for deployment on Vercel. To make the latest version public, use the **Publish** action in the Vercel project interface and select the production deployment option. After deployment, verify the public URL in an incognito browser window and confirm that the page loads without requiring authentication.

## Branding and metadata

The default v0/Vercel generator metadata and default favicon references have been removed. The document title, description, and author metadata identify the project and its developer: **Afaq Ahmad**.

## Notes for future development

- Keep the main route responsive across desktop and mobile widths.
- Add 3D assets under `public/` and load them from local paths when they are introduced.
- Prefer reusable components over a single large page component.
- Keep accessibility labels and meaningful alternative text on all non-decorative imagery.
- Run the production build before publishing changes.

## License

Add the project license and usage terms here before distributing the application outside its intended deployment.

---

Developed by **Afaq Ahmad**.
