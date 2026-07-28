# Production Build Manifest

## Directorist – Bulk Actions v2.2.1

This document lists exactly what must (and must not) ship in a production release of the plugin — e.g. a distribution ZIP or a deploy to a live site.

---

## ✅ Required for production

| Path | Why it's required |
|---|---|
| `directorist-bulk-actions.php` | Plugin bootstrap file — WordPress reads the plugin header from here. |
| `inc/` | The entire PHP backend: `Plugin.php`, `Admin/AdminPage.php`, all `REST/*.php` controllers, `Support/functions.php`. |
| `assets/build/` | **All** compiled frontend files: `app.js` (entry shell), every numbered chunk file (`*.js` — lazy-loaded tab/vendor chunks; the app breaks without them), `app.asset.php` (script dependencies + cache-busting version), `style-app.css`, `style-app-rtl.css`. |
| `templates/` | `admin/dashboard.php` — the admin page mount point. |
| `vendor/` | Composer autoloader (`autoload.php` + `composer/` class maps). The plugin has a manual-include fallback, but shipping `vendor/` keeps autoloading fast and standard. |
| `composer.json` | Required by the autoloader tooling and for regenerating `vendor/` on the target if ever needed. |
| `LICENSE` | GPL-2.0 license text — must accompany distribution. |
| `README.md` | Documentation and changelog (recommended to ship; harmless to omit on a private deploy). |

### Minimal file tree

```
directorist-bulk-actions/
├── directorist-bulk-actions.php
├── composer.json
├── LICENSE
├── README.md
├── assets/
│   └── build/
│       ├── app.js
│       ├── app.asset.php
│       ├── *.js               ← ALL numbered chunk files (code-split tabs + vendors)
│       ├── style-app.css
│       └── style-app-rtl.css
├── inc/
│   ├── Plugin.php
│   ├── Admin/
│   │   └── AdminPage.php
│   ├── REST/
│   │   ├── DeleteListings.php
│   │   ├── ListingCount.php
│   │   ├── RunUpdate.php
│   │   ├── TaxonomyExport.php
│   │   ├── TaxonomyImport.php
│   │   ├── UpdateCoordinates.php
│   │   └── UpdateListings.php
│   └── Support/
│       └── functions.php
├── templates/
│   └── admin/
│       └── dashboard.php
└── vendor/
    ├── autoload.php
    └── composer/
```

---

## ❌ Excluded from production (development only)

| Path | Reason |
|---|---|
| `src/` | React/CSS sources — already compiled into `assets/build/`. |
| `node_modules/` | npm dependencies — build-time only, very large. |
| `package.json`, `package-lock.json` | npm manifest/lockfile — build-time only. |
| `webpack.config.js` | Build configuration. |
| `PRD.md`, `PRODUCTION.md` | Internal product/process docs. |
| `.claude/` | Agent skill files (development tooling). |
| `.git/`, `.gitignore` | Version control. |
| `templates/readme.txt` | Empty placeholder. |
| `.DS_Store`, `*.log`, editor folders | OS/editor artifacts. |

---

## 📦 Building a release ZIP

Run from `wp-content/plugins/`:

```bash
# 1. Fresh production build
cd directorist-bulk-actions
npm ci && npm run build
cd ..

# 2. Package (excludes all dev files)
zip -r directorist-bulk-actions-2.2.1.zip directorist-bulk-actions \
  -x "directorist-bulk-actions/src/*" \
  -x "directorist-bulk-actions/node_modules/*" \
  -x "directorist-bulk-actions/.git/*" \
  -x "directorist-bulk-actions/.claude/*" \
  -x "directorist-bulk-actions/.gitignore" \
  -x "directorist-bulk-actions/package.json" \
  -x "directorist-bulk-actions/package-lock.json" \
  -x "directorist-bulk-actions/webpack.config.js" \
  -x "directorist-bulk-actions/PRD.md" \
  -x "directorist-bulk-actions/PRODUCTION.md" \
  -x "directorist-bulk-actions/templates/readme.txt" \
  -x "*.DS_Store"
```

## ✔️ Pre-release checklist

1. `npm run build` completed with no errors; `assets/build/` contains `app.js`, `app.asset.php`, both CSS files, **and** the numbered chunk files.
2. Version matches in all three places: plugin header, `Plugin::$version`, `package.json`.
3. `README.md` changelog entry added for this release.
4. All PHP files pass lint (`php -l`).
5. Smoke test on a staging site: page loads, each tab opens (chunks fetch correctly), one batch operation runs end-to-end.
