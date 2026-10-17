# Argus security validation docs

<!-- conduit-change: CONDUIT-2026-001 -->

Public documentation site for **Argus**, a local-first static application security (SAST) scanner for
JavaScript, TypeScript, React, Java and Python. The site covers the product overview, features, quick
start, detection coverage, CI/CD integration, the privacy model, the Juice Shop validation lab and a
detector reference.

- Live site: <https://naresh-fd.github.io/argus-security-validation-docs/>
- Argus source code lives in a separate private repository. This repository holds the documentation
  site only.

## What is in this repository

| Path | Purpose |
|---|---|
| `app/page.tsx` | The whole documentation page (a single React component) |
| `app/report-data.json` | Tables rendered by the page: metrics, severity, categories, top rules and files, packages, redaction checks and detector inventories |
| `app/globals.css`, `app/icons.tsx` | Styles and icons |
| `public/Argus-Juice-Shop-Security-Validation.docx` | Downloadable validation report linked from the page |
| `index.html`, `src/main.tsx`, `vite.pages.config.ts` | Entry point and Vite config for the GitHub Pages build |
| `scripts/export_report_data.py` | Regenerates `app/report-data.json` (see below) |
| `tests/rendered-html.test.mjs` | Checks that the rendered page contains the expected content and that the report data and download ship |
| `.github/workflows/pages.yml` | Builds and deploys the site to GitHub Pages on every push to `main` |

The repository began as a vinext starter. `db/`, `drizzle/`, `drizzle.config.ts`, `worker/`,
`examples/d1/`, `app/chatgpt-auth.ts`, `.openai/hosting.json` and `build/` belong to that scaffold. The
GitHub Pages build does not import any of them.

## Requirements

- Node.js `>=22.13.0`
- npm (the repository has a `package-lock.json`)
- Python 3 with `python-docx`, only if you regenerate the report tables from the DOCX report

## Local development

```bash
npm ci
npm run dev
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the vinext dev server |
| `npm run build` | vinext production build (used by `npm test`) |
| `npm run build:pages` | Builds the static GitHub Pages site into `pages-dist/` |
| `npm run preview:pages` | Serves the `pages-dist/` build locally |
| `npm test` | Runs `npm run build`, then `node --test tests/rendered-html.test.mjs` |
| `npm run lint` | ESLint over the repository |

## Publishing

Pushing to `main` runs `.github/workflows/pages.yml`, which runs `npm ci` and `npm run build:pages` and
deploys `pages-dist/` to GitHub Pages. The workflow does not run `npm test` or `npm run lint`, so run
both locally before you push. The site is served under the `/argus-security-validation-docs/` base
path set in `vite.pages.config.ts`.

## Updating the report data

`app/report-data.json` is generated, not hand-edited. `scripts/export_report_data.py` reads the Juice
Shop validation report (`reports/juice-shop/Argus-Juice-Shop-Security-Validation.docx`) and the attack
vector matrix (`docs/attack-vector-matrix.md`) from an Argus checkout, then writes the JSON.

The script resolves those inputs relative to its own location: this site must sit one directory below the
Argus repository root, for example `<argus>/<site-folder>/scripts/export_report_data.py`. This repository
does not contain those inputs, so run the script from a checkout where they exist. After regenerating,
run `npm test` and commit the updated `app/report-data.json`.

## Documentation accuracy

The site describes Argus as of the report it was generated from. If the scanner's detector set, supported
languages or CI behaviour changes, regenerate the report data and update `app/page.tsx` in the same change.
