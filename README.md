# APTUS Iran — digital catalog

A responsive, frontend-only catalog for the modular precast concrete industrial shed system. Persian is the default; the header switches the full interface and detail pages to English or Turkish, with matching text direction. No backend, build step, third-party JavaScript, or internet connection is required at runtime. The interface follows the supplied APTUS palette: Gray `#58595B`, Orange `#F58220`, Dark Gray `#333333`, Medium Gray `#666666`, Light Gray `#E6E6E6`, and White `#FFFFFF`.

## Run locally

From this folder, run:

```bash
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/` in a browser. On Windows, `py -m http.server 8000 --directory dist` also works. Serve the directory over HTTP because the catalog uses JavaScript modules; opening `index.html` directly as a `file://` URL can block those modules.

## Deploy

Upload **the contents of `dist/`** to the document root of any static web server (Nginx, Apache, Caddy, object storage static hosting, or a static site host). The provided `Dockerfile` is an optional Nginx deployment:

```bash
docker build -t aptus-catalog .
docker run --rm -p 8080:80 aptus-catalog
```

Then open `http://localhost:8080/`. The `dist/` folder has relative asset paths and query-based detail URLs, so it also works under a repository subpath on GitHub Pages. Push this folder as a Git repository; publish `dist/` using the hosting provider's static-site workflow. No environment variables are needed.

## Edit the catalog

- `dist/content.js` contains the company abstract, contact fields, type dimensions, and the original assembly component list. The current abstract is a draft based on the earlier PDF.
- `dist/supplied-content.js` contains the full Persian component text, 25 advantage topics, application and facade imagery, and links to 12 supplied documents. It was transcribed from the supplied menu archive.
- `dist/i18n.js` and `dist/editorial-i18n.js` hold the English and Turkish interface and editorial translations. Update them when the source content changes.
- `dist/app.js` renders 18 type URLs (`?type=3H-5M` through `?type=5H-10M`), nine component pages (`?part=column`, etc.), the complete advantages (`?benefits=all`), facade concepts (`?facades=all`), and the document list (`?documents=all`). Add `&lang=en` or `&lang=tr` for localized deep links. The eight assembly hotspots correspond to the supplied numbered diagram; the ninth corner wall appears in the component grid and selector.
- `dist/styles.css` holds the base layout; `dist/glass.css` and `dist/brand.css` contain the rounded interface and official palette. `dist/assets/` includes the supplied component and facade images, document files, logo, and bundled Persian typeface.

### Information still needed from APTUS

`dist/content.js` intentionally does not invent a phone number or street address. Fill `company.phone` and `company.address` with verified details; replace `company.about` with the approved company abstract when supplied. The 12 provided certificates, permits, and commendations are linked from `dist/supplied-content.js` and stored under `dist/assets/documents/`. Confirm their current status from the original files before making claims about validity.

## Source notes

Dimensions come from the provided Persian technical PDF and the single-span matrix in the menu archive: `H = M = 2.4 m`, six standard spans (`5M`–`10M`), three heights (`3H`–`5H`), and their clear spans, outside-column widths, and under-roof heights. `11M` and `12M` are marked under study. Component descriptions, the 25 advantage topics, facade concepts, illustrative application imagery, and document files come from the newly supplied archive. The application photographs illustrate possible uses and are not labeled as completed APTUS projects. Detailed engineering drawings, final connection details, a street address, and an official phone number were not supplied.

The included Noto Sans Arabic font is distributed under the SIL Open Font License by Google. The APTUS imagery and mark are from the materials supplied for this catalog and remain subject to their owners' rights.
