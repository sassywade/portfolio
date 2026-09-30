# Neel Saswade — Portfolio

Neel's personal product-design portfolio: a quiet editorial site with an interactive Alamo Square hero, a focused work archive, an About page, and individual case studies.

## Start here

- Read [AGENTS.md](./AGENTS.md) before changing the site.
- Read [design.md](./design.md) for the portfolio's visual and interaction direction.
- Read [docs/portfolio-system.md](./docs/portfolio-system.md) for the product, design, and interaction model.
- Edit project content in `app/projects.ts`.
- Run `npm test` before publishing.

## Commands

```bash
npm install
npm run dev
npm test
```

## Deployment

Development is local and preview-only by default. Production is hosted on Cloudflare and connected to GitHub `main`; pushing that branch can publish the website. Do not push to `main`, deploy, or change hosting settings unless Neel explicitly asks to publish the reviewed change. Editing, cleanup, testing, and finishing a task do not authorize publishing.

For an explicitly authorized release, run `npm test`, push only the reviewed and tested commit, then confirm that Cloudflare deployed that commit and that `neelsaswade.com` serves it. ChatGPT Sites is no longer part of the deployment path.

## Live site

[neelsaswade.com](https://neelsaswade.com/)

## Environment

The About page's Spotify card is optional. Copy `.env.example` to `.dev.vars` and provide the listed Spotify credentials to enable it locally. Never commit secrets.
