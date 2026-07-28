---
name: directorist-bulk-actions
description: Working on the Directorist Bulk Actions plugin — architecture map, build/lint workflow, conventions, and gotchas. Use whenever editing files under plugins/directorist-bulk-actions.
---

# Directorist – Bulk Actions plugin development

Custom Directorist extension (author wpXplore) providing six admin bulk tools for `at_biz_dir` listings. Own git repo (GitHub: MahfuzulAlam/directorist-bulk-actions), separate from the site.

## Mandatory rules (apply to EVERY change)

1. **Maintain WordPress coding standards.** All PHP must follow WordPress conventions: snake_case function/method names, translatable strings via `__()`/`esc_html__()` with text domain `directorist-bulk-actions`, Yoda-safe strict comparisons, hooks over hard-wiring. Match the existing file style (4-space indent, one class per file, PSR-4 file naming under `inc/`).
2. **Maintain WordPress security standards.** Every REST route MUST have a `permission_callback` checking `current_user_can('manage_options')`. Sanitize all input (`sanitize_text_field`, `sanitize_title`, `sanitize_textarea_field`, `sanitize_key`, `absint`; `wp_kses_post` for HTML). Escape all output (`esc_html`, `esc_attr`, `esc_url`). Use `$wpdb->prepare()` for every raw query. Keep the `defined('ABSPATH') || exit;` guard at the top of every PHP file. Validate URLs (`wp_http_validate_url`) before sideloading remote files. Validate that array params are arrays before iterating (return 400 otherwise). Destructive actions keep the typed-confirmation UI.
3. **Update `README.md` every time you fix, update, or add something** — feature lists, API reference, FAQ, and any affected examples must reflect the change. Keep `PRD.md` in sync for feature-level changes.
4. **Bump the version every time you fix/modify/create something.** The version lives in three places and must move together: the plugin header in `directorist-bulk-actions.php`, `Plugin::$version` in `inc/Plugin.php`, and `package.json`. Patch bump for fixes, minor for new features.

## Architecture

- **Bootstrap:** `directorist-bulk-actions.php` → Composer autoload (PSR-4 `Directorist\BulkActions\` → `inc/`) with manual `require_once` fallback → `Plugin::instance()` singleton. Only boots when the Directorist base plugin is active.
- **Backend:** one REST controller class per endpoint in `inc/REST/`, namespace `directorist_bulk_actions/v1`, all `POST` + `manage_options` permission. Helpers in `inc/Support/functions.php` (namespaced functions, loaded via Composer `files`). Admin page registration in `inc/Admin/AdminPage.php`.
- **Frontend:** React SPA in `src/` (entry `src/app.jsx`, tab components in `src/components/`, reusable selects in `src/components/fields/`). Compiled by `@wordpress/scripts` to `assets/build/`. Bootstrap data is localized to `window.dba_data` (totalListings, directoryTypes, statuses, restUrl).
- **Batching model:** client-side loops request small batches (5 server-queried, 10 CSV rows) until the server reports completion. Update-style tools advance `offset`; **deletion always sends `offset: 0`** because deleted posts leave the result set — keep that invariant, plus the stall guard (abort if a batch deletes nothing).
- Admin page hook suffix: `at_biz_dir_page_directorist-bulk-actions` (assets are scoped to it in `Plugin.php`).

## Critical workflow rules

1. **Any `src/` (JSX/CSS) change requires a rebuild:** `npm run build` from the plugin root (run `npm ci` first if `node_modules/` is missing). Never edit `assets/build/` by hand; never ship without rebuilding. Webpack entry is `src/app.jsx` only; the build cleans `assets/build/` each run.
2. **PHP lint:** no `php` in PATH. Use Local's binary:
   `/Applications/Local.app/Contents/Resources/extraResources/lightning-services/php-8.2.29+0/bin/darwin-arm64/bin/php -l <file>`
3. **No composer binary on this machine.** New classes under `inc/` autoload fine via the existing PSR-4 mapping, but if you change `composer.json` autoload config you must hand-edit `vendor/composer/autoload_psr4.php` and `autoload_static.php` to match (watch backslash escaping: prefix is `Directorist\\BulkActions\\` in PHP source, and `prefixLengthsPsr4` must equal the literal prefix string length). Also add any new PHP file to the manual-include list in `Plugin::conditionally_include_files()` so the no-vendor fallback keeps working.
4. IDE diagnostics like "Undefined function 'add_filter'/'get_option'" or "unknown class WP_REST_Response" are **noise** — the PHP language server lacks WordPress stubs. Trust `php -l` instead.
5. `templates/readme.txt` is empty and `.gitignore` ignores `readme.txt` — `README.md` is the canonical changelog/docs file.

## Adding a new bulk tool (checklist)

1. REST controller class in `inc/REST/` (constructor hooks `rest_api_init`, registers a `POST` route under `directorist_bulk_actions/v1` with `manage_options` permission callback; response convention: `status` = `success` | `completed` | `error` | `none`, plus `message`, and `offset`/`posts`/`updated` arrays for batch loops).
2. Register it in `Plugin::register_services()` **and** add the file to `Plugin::conditionally_include_files()`.
3. React tab component in `src/components/` following the existing shape: batch loop, progress bar, reversed log list, totals, disabled button while running. Reusable inputs go in `src/components/fields/` as controlled components taking `options`/`onChange` props (react-select for multi-selects, `label` + `help-text` markup).
4. Export the component in `src/components/index.jsx` and add its tab entry + conditional render in `src/app.jsx`.
5. Rebuild assets, update `README.md` + `PRD.md`, bump the version (all three places).

## Compatibility floor

WordPress ≥ 5.8, PHP ≥ 7.4, Directorist ≥ 7.0. Avoid PHP 8-only functions (e.g. `str_ends_with`) and WP polyfills newer than 5.8 in plugin PHP.

## Directorist API notes (verified against the installed plugin)

- Constants: `ATBDP_POST_TYPE` (`at_biz_dir`), `ATBDP_CATEGORY`, `ATBDP_LOCATION`, `ATBDP_TAGS`, `ATBDP_DIRECTORY_TYPE`, `ATBDP_TYPE` (directory-type taxonomy).
- Directorist REST collections (e.g. `/directorist/v1/listings/categories`) inherit WP core pagination: **`per_page` defaults to 10, max 100** — always paginate (see `fetchAllTerms` in `src/components/DeleteListings.jsx`).
- `/directorist/v1/users?custom=bulk_action` is unpaginated because `inc/Support/functions.php` hooks `directorist_rest_user_query` to set `number = -1` and restrict to listing owners.
- Directorist controllers live at `plugins/directorist/includes/rest-api/Version1/` — read them there when behavior is unclear.

## Key meta/term keys

- Listing meta: `_listing_prv_img` (preview image ID), `_listing_img` (gallery ID array), `_address`, `_manual_lat`, `_manual_lng`; CSV columns become `_`-prefixed meta.
- Term meta: `category_icon`, `_directory_type` (array of directory-type term IDs), `image` (attachment ID).

## Extension hook

`do_action('directorist_bulk_actions_run_update_loop', $listing_id)` — fired per listing by the Run Update tool; the plugin performs no changes itself there.

## Testing endpoints locally

Site runs under Local at `http://booking.local`. Public Directorist endpoints can be curl-tested directly; the plugin's own endpoints need an authenticated admin (REST nonce), so verify those through the admin UI or by reasoning through the controller code.
