# Product Requirements Document (PRD)

## Directorist – Bulk Actions

| | |
|---|---|
| **Product** | Directorist – Bulk Actions (WordPress plugin, Directorist extension) |
| **Version** | 2.2.0 |
| **Author / Vendor** | wpXplore ([wpxplore.com](https://wpxplore.com)) |
| **Plugin URI** | https://wpxplorer.com/tools/directorist-bulk-actions |
| **License** | GPL-2.0-or-later |
| **Status** | Shipped / Maintained |
| **Document date** | 2026-07-28 |

---

## 1. Overview

### 1.1 Problem statement

Directorist directory sites accumulate hundreds or thousands of listings (`at_biz_dir` posts) plus large category/location taxonomies. WordPress and Directorist core provide no efficient way to:

- Delete large sets of listings filtered by directory type, category, status, or author — including their media and metadata.
- Update listing fields, taxonomies, and images in bulk from a spreadsheet.
- Move category/location trees (with icons, images, hierarchy, and directory-type assignments) between sites.
- Re-geocode every listing after enabling maps or changing address data.
- Run arbitrary site-specific update logic across all listings safely.

Doing these one listing at a time is impractical; doing them in a single request times out on shared hosting.

### 1.2 Solution

A single admin screen (**Listings → Bulk Actions**) hosting six tools built as a React SPA, backed by custom WordPress REST API endpoints. Every long-running operation is processed in small batches (5–10 items per request) driven by a client-side loop, so operations of any size complete within standard PHP execution limits, with live progress bars, per-batch logs, and success/failure counters.

### 1.3 Target users

- **Directory site administrators** — cleanup, migration, and maintenance of large listing databases. (All tools require the `manage_options` capability.)
- **Agencies / migration engineers** — moving Directorist data between staging and production sites via CSV.
- **Developers** — extending the plugin with custom per-listing update logic via hooks.

---

## 2. Goals and non-goals

### 2.1 Goals

1. Perform bulk operations on thousands of listings without server timeouts (batch processing).
2. Provide precise filtering so destructive operations affect exactly the intended listings.
3. Make destructive actions hard to trigger accidentally (typed confirmation, trash-first option, live count preview).
4. Round-trip taxonomy data (export → edit → import) with full fidelity: hierarchy, icons, images, directory types.
5. Stay extensible: expose hooks so developers can plug custom bulk logic into the existing batch runner UI.

### 2.2 Non-goals

- Bulk **creation** of listings (Directorist CSV import covers this; this plugin updates existing listings by ID).
- Front-end / non-admin functionality — the plugin is admin-only by design.
- Scheduled or background (cron/Action Scheduler) processing — batches are driven by the open browser tab.
- Export of listings themselves (only taxonomies are exported).

---

## 3. Feature requirements

### 3.1 Update Listings (CSV bulk update)

**User story:** As an admin, I want to update many listings at once from a CSV file so I don't have to edit them individually.

| # | Requirement | Status |
|---|---|---|
| U1 | Accept a CSV upload, parsed client-side (PapaParse, header row required, empty lines skipped). | ✅ |
| U2 | Require a target directory type before upload. | ✅ |
| U3 | Match rows to existing listings **by post ID** (`id` column). Rows with missing/invalid IDs or non-listing post types are reported as errors, not created. | ✅ |
| U4 | Update core fields: `listing_title` (sanitized text), `listing_content` (filtered HTML via `wp_kses_post`), `publish_date` (`d/m/Y H:i` format; invalid dates keep the existing post date). | ✅ |
| U5 | Assign taxonomies from comma-separated `category`, `location`, and `tag` columns; auto-create missing terms and tag new category/location terms with the selected directory type. | ✅ |
| U6 | Treat any other column as post meta, stored with a `_` prefix; CSV-escaped values (`'=`, `'+`, `'-`, `'@`) are unescaped and serialized-array strings are restored. | ✅ |
| U7 | Import images from a comma-separated `images` URL column; first image becomes the preview image (`_listing_prv_img`), the rest the gallery (`_listing_img`). | ✅ |
| U8 | Process rows in batches of 10 with progress bar, per-row success/failure log, and totals. | ✅ |

**Endpoint:** `POST /wp-json/directorist_bulk_actions/v1/update/listings` — body `{ directory, items: [...] }`.

### 3.2 Delete Listings (filtered bulk delete)

**User story:** As an admin, I want to delete a filtered subset of listings — optionally including their images and metadata — with safeguards against mistakes.

| # | Requirement | Status |
|---|---|---|
| D1 | Filter by directory type, category, status (including Directorist's `expired`), and author — all multi-select, combined with AND across filter groups. | ✅ |
| D2 | Author dropdown lists only users who actually own listings (custom `directorist_rest_user_query` filter integration). | ✅ |
| D3 | Show a live count of listings matching the current filters before deletion (`/listing/count`). | ✅ |
| D4 | Deletion modes: **Move to trash** (default, reversible) or **Delete permanently**. | ✅ |
| D5 | Optional media cleanup: delete the featured image and/or gallery images from the media library. | ✅ |
| D6 | Optional metadata cleanup: delete all post meta for each listing. | ✅ |
| D7 | Require the user to type `Delete` in a confirmation dialog before starting. | ✅ |
| D8 | Process in batches of 5 with progress bar, per-batch log, deleted/failed totals; abort with an error if a batch deletes nothing (prevents infinite loops). | ✅ |

**Endpoints:** `POST /delete/listings`, `POST /listing/count`.

### 3.3 Export Taxonomies

**User story:** As an admin, I want to download all categories or locations as CSV so I can edit them or move them to another site.

| # | Requirement | Status |
|---|---|---|
| E1 | One-click export of **Categories** or **Locations** to a CSV file downloaded in the browser. | ✅ |
| E2 | Columns: `id, name, slug, description, parent, category_icon, directory_type, image`. | ✅ |
| E3 | `parent` is exported as the parent term's **name**; `directory_type` as comma-separated directory-type **slugs**; `image` as the full attachment URL. | ✅ |
| E4 | Include empty terms; order parents before children so re-import can resolve hierarchy. | ✅ |
| E5 | Properly CSV-escape values (quotes doubled, fields quoted). | ✅ |

**Endpoint:** `POST /export/taxonomies` — body `{ taxonomy: "category" | "location" }`.

### 3.4 Import Taxonomies

**User story:** As an admin, I want to import a category/location CSV, choosing whether existing terms are updated or skipped.

| # | Requirement | Status |
|---|---|---|
| I1 | Accept the same CSV format the exporter produces (round-trip compatible). | ✅ |
| I2 | Match existing terms by term **ID**, then by **slug**. | ✅ |
| I3 | "Update terms if a match is found" toggle: matched terms are updated (name, slug, description, parent, meta) when on, skipped and reported as *exists* when off. | ✅ |
| I4 | Resolve `parent` by name; auto-create the parent term (with directory-type meta) if it doesn't exist yet. | ✅ |
| I5 | Map comma-separated directory-type slugs back to term IDs and store as `_directory_type` term meta; store `category_icon` meta. | ✅ |
| I6 | Sideload the `image` URL into the media library and attach it as term image; Google Drive / googleusercontent URLs (including subdomains) use a legacy download path that resolves the file extension from the response content type. | ✅ |
| I7 | Process in batches of 10 with progress bar and added/updated/failed counters and per-row log. | ✅ |

**Endpoint:** `POST /import/taxonomies` — body `{ taxonomy, allow_update, items: [...] }`.

### 3.5 Set Coordinates (bulk geocoding)

**User story:** As an admin, I want to fill in latitude/longitude for all listings from their street addresses so map views work.

| # | Requirement | Status |
|---|---|---|
| C1 | Iterate all listings (publish/private/draft) in batches of 5, geocoding each listing's `_address` meta via the Google Maps Geocoding API. | ✅ |
| C2 | Use the Google Maps API key already configured in Directorist settings; fail fast with a clear error if none is set. | ✅ |
| C3 | Store results in `_manual_lat` / `_manual_lng` post meta. | ✅ |
| C4 | Skip and count listings without an address ("Total Missing Address"); show progress bar and per-batch log. | ✅ |

**Endpoint:** `POST /update/coordinates` — body `{ offset, limit }`.

### 3.6 Run Update (extensible batch runner)

**User story:** As a developer, I want to run my own update logic on every listing using the plugin's batching/progress UI, without writing my own runner.

| # | Requirement | Status |
|---|---|---|
| R1 | Iterate all listings (publish/private/draft/expired) in batches of 5. | ✅ |
| R2 | Fire `do_action('directorist_bulk_actions_run_update_loop', $listing_id)` for each listing; the plugin itself performs no changes. | ✅ |
| R3 | Document the hook in the tool's UI; show progress, totals, and per-batch log. | ✅ |

**Endpoint:** `POST /run/update` — body `{ offset, limit }`.

### 3.7 Admin experience (cross-cutting)

- Single submenu page **Bulk Actions** under the Directorist listings menu (`edit.php?post_type=at_biz_dir`), rendering a React app mounted on `#directorist-bulk-actions-admin`.
- Modern sidebar-navigation layout (2.2.0): icon + label + hint per tool, card-based content area, page header with version badge and total-listings stat, danger styling on the destructive tool. Neutral slate palette with the WP admin theme color as single accent; responsive (sidebar collapses to horizontal pills < 960px); honors `prefers-reduced-motion`.
- Six tools: Update Listings / Export Taxonomies / Import Taxonomies / Delete Listings / Set Coordinates / Run Update, with a warning against switching tabs mid-operation.
- **Performance:** plugin JS/CSS load only on this admin page (hook-suffix scoped enqueue), and the app is code-split with `React.lazy` — the initial bundle is the ~8 KB shell; each tool's chunk (and heavy vendors: SweetAlert2, react-select, PapaParse, FileSaver) loads on demand with a skeleton loading state. React itself is externalized to WordPress core scripts.
- Bootstrap data localized to `window.dba_data`: total listing count, directory types (with all-status counts), post statuses (incl. `expired`), REST namespace, plugin version.
- The plugin only boots when the Directorist base plugin is active (single-site or network-activated).

---

## 4. Technical design

### 4.1 Architecture

```
React SPA (assets/build/app.js, wp-scripts build)
   │  @wordpress/api-fetch (REST nonce auto-attached)
   ▼
WordPress REST API — namespace directorist_bulk_actions/v1
   │  one controller class per endpoint (inc/REST/*)
   ▼
WordPress core APIs (WP_Query/get_posts, taxonomy, media, meta) + $wpdb
```

- **Bootstrap:** `directorist-bulk-actions.php` → Composer autoloader (PSR-4 `Directorist\BulkActions\` → `inc/`), with manual `require_once` fallback when `vendor/` is absent → `Plugin::instance()` singleton registers services and hooks.
- **Batching model:** the client loops: request batch → update progress/log → request next, until the server reports `completed`/zero results. Update-style tools advance an `offset`; deletion always sends `offset: 0` because deleted posts leave the result set.
- **Frontend stack:** React 18 (via `@wordpress/element`), react-select, SweetAlert2 (typed delete confirmation), PapaParse (CSV parse), FileSaver (CSV download). Built with `@wordpress/scripts` (webpack); dependencies/version emitted to `app.asset.php`.

### 4.2 REST API summary

All routes: `POST`, namespace `directorist_bulk_actions/v1`, permission `current_user_can('manage_options')`, CSRF via standard REST nonce.

| Route | Purpose | Batch driver |
|---|---|---|
| `/update/listings` | CSV-driven listing updates | client slices rows (10/req) |
| `/delete/listings` | Filtered delete/trash + media/meta cleanup | server query (5/req, offset 0) |
| `/listing/count` | Count listings matching delete filters | single request |
| `/export/taxonomies` | Full term dump for CSV download | single request |
| `/import/taxonomies` | Term create/update from CSV rows | client slices rows (10/req) |
| `/update/coordinates` | Geocode `_address` → lat/lng meta | server query (5/req, offset) |
| `/run/update` | Fire per-listing action hook | server query (5/req, offset) |

### 4.3 Extension points

| Hook | Type | Purpose |
|---|---|---|
| `directorist_bulk_actions_run_update_loop` | action | Custom per-listing logic for the Run Update tool. Receives `$listing_id`. |
| `directorist_rest_user_query` | filter (consumed) | The plugin narrows Directorist's user endpoint to listing owners when called with `custom=bulk_action`. |

### 4.4 Data touched

- **Post type:** `at_biz_dir` (constant `ATBDP_POST_TYPE`).
- **Taxonomies:** `at_biz_dir-category`, `at_biz_dir-location`, `at_biz_dir-tags`, `atbdp_listing_types` (directory types), via Directorist constants.
- **Post meta:** `_listing_prv_img`, `_listing_img`, `_address`, `_manual_lat`, `_manual_lng`, plus arbitrary `_`-prefixed meta from CSV columns.
- **Term meta:** `category_icon`, `_directory_type`, `image`.

---

## 5. Non-functional requirements

| Area | Requirement |
|---|---|
| **Security** | Admin-only (`manage_options`) on every endpoint; REST nonce CSRF protection; input sanitization (`sanitize_text_field`, `sanitize_title`, `sanitize_textarea_field`, `wp_kses_post`, `sanitize_key`); `$wpdb->prepare()` for raw SQL; `ABSPATH` guards on all PHP files; URL validation before image sideloading. |
| **Performance** | No operation may exceed a single-request PHP timeout: batch sizes 5 (server-queried loops) / 10 (CSV rows). Assets and bootstrap queries load only on the plugin's admin page. |
| **Reliability** | Per-item error capture — one bad row/post never aborts the batch; client loops stop on server-reported errors, completion, or stalled deletion. |
| **Compatibility** | WordPress ≥ 5.8, PHP ≥ 7.4, Directorist ≥ 7.0. Degrades gracefully: no Directorist → plugin doesn't boot; no `vendor/` → manual includes; no build assets → enqueue skipped. |
| **i18n** | All PHP-emitted strings translatable, text domain `directorist-bulk-actions`. (React UI strings not yet translatable — see roadmap.) |

---

## 6. Constraints, risks, and mitigations

| Risk | Mitigation |
|---|---|
| Permanent deletion is irreversible | Trash is the default mode; typed "Delete" confirmation; live pre-count of affected listings; docs recommend backups. |
| Google Geocoding API cost/quota on large sites | Fail fast without a key; batches are small; only listings with addresses are sent. |
| CSV meta values restore PHP-serialized data (`maybe_unserialize`) | Endpoint restricted to administrators; input comes only from admin-uploaded CSVs. |
| Closing the browser tab stops the run | Operations are resumable — re-running continues from remaining data (delete) or can be re-run idempotently (geocode, run-update). |
| Trash + "delete all metas" combination loses meta on restore | Documented behavior; meta cleanup is opt-in. |

---

## 7. Release notes (2.1.2)

Fixes applied in the 2.1.2 code review:

1. **Composer PSR-4 autoloading repaired** — the namespace prefix in `composer.json` (and generated vendor maps) was over-escaped (`Directorist\\BulkActions\\` as literal), so the autoloader never matched the plugin's classes; the plugin survived only via manual includes.
2. **Admin assets scoped to the plugin page** — scripts, styles, and the bootstrap listing-count query previously ran on every wp-admin page.
3. **Missing-build guard** — enqueue now bails cleanly instead of fataling when `assets/build/app.asset.php` is absent.
4. **`/update/listings` and `/import/taxonomies` validate `items`** — malformed requests now return 400 instead of a PHP error.
5. **Invalid CSV `publish_date` no longer resets a listing's date to "now"** — the existing post date is preserved.
6. **Taxonomy import parent resolution** returns `0` (not `''`) when there is no parent.
7. **Google-hosted image URLs on subdomains** (e.g. `lh3.googleusercontent.com`) now correctly route through the legacy downloader.
8. **Delete loop stall guard** — the UI aborts with an error if a batch deletes nothing, instead of requesting the same failing posts forever.
9. **Progress-bar division-by-zero guard** in Set Coordinates / Run Update on sites with no listings.
10. **Delete Listings category filter loads all categories** — the Directorist REST categories endpoint is paginated (default 10, max 100 per page); the UI now fetches every page of non-empty categories.

---

## 8. Roadmap / future considerations

- Unit test coverage (PHP + React).
- WP-CLI commands mirroring each bulk tool.
- Configurable batch size (filter + UI setting).
- i18n for React-rendered strings (`@wordpress/i18n`).
- Selected-meta-keys deletion mode (UI scaffolding exists, currently commented out).
- Additional export formats (JSON/XML) and listing export.
- Scheduled/background processing via Action Scheduler.
- Import validation preview (dry-run) before committing changes.
