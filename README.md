# Directorist - Bulk Actions

[![WordPress](https://img.shields.io/badge/WordPress-5.8%2B-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://www.php.net/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-GPL--2.0%2B-green.svg)](LICENSE)

A modern WordPress plugin extension for [Directorist](https://wordpress.org/plugins/directorist/) that enables scalable bulk operations on directory listings and taxonomies. Built with a hybrid PHP backend + React frontend architecture using Composer and webpack for optimal performance.

## 🎯 Overview

**Directorist Bulk Actions** streamlines directory management by providing powerful batch processing capabilities for listings and taxonomies. Perfect for directory sites with hundreds or thousands of listings that need efficient bulk operations.

### Key Highlights

- 🚀 **Scalable Batch Processing**: Handles thousands of listings with offset-based pagination
- ⚛️ **Modern React UI**: Responsive, real-time progress tracking
- 🔐 **Security-First**: Capability checks, input sanitization, CSRF protection
- 🏗️ **Clean Architecture**: PSR-4 namespacing, service-oriented design
- 🔌 **Extensible**: WordPress hooks and filters for custom operations
- 📦 **Composer-Based**: Modern PHP dependency management

---

## 📋 Table of Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Development](#-development)
- [API Reference](#-api-reference)
- [Hooks & Filters](#-hooks--filters)
- [Security](#-security)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 1. **Delete Listings**
- Batch deletion with advanced filtering (category, location, directory type, status, author)
- Options: Move to trash or permanent deletion
- Media cleanup (featured images & gallery images)
- Metadata cleanup options
- Real-time progress tracking
- Confirmation dialogs for safety

### 2. **Update Listings**
- CSV-based bulk import/update
- Update post fields (title, content, publish date)
- Taxonomy assignment (categories, locations, tags)
- Custom meta field updates
- Bulk image imports from URLs
- Auto-creates missing taxonomy terms
- Smart data type detection and serialization

### 3. **Taxonomy Import/Export**
- Export categories/locations to CSV
- Import from CSV with update or skip options
- Hierarchical term handling (parent-child relationships)
- Directory type associations
- Category icons and images
- Bulk term creation

### 4. **Set Coordinates**
- Automatic geocoding using Google Maps API
- Batch process all listings with addresses
- Updates latitude/longitude metadata
- Progress tracking with batch processing

### 5. **Run Update**
- Generic bulk update loop
- Extensible via action hooks
- Process all listings with custom logic
- Batch processing for scalability

### 6. **Listing Count**
- Real-time listing counts with filters
- Used for progress calculations
- Validates filter combinations

---

## 📦 Requirements

### Server Requirements
- **WordPress**: 5.8 or higher
- **PHP**: 7.4 or higher
- **Directorist Plugin**: 7.0 or higher
- **MySQL**: 5.6 or higher

### Development Requirements
- **Composer**: 2.0+
- **Node.js**: 14.0+
- **npm**: 6.0+

---

## 🚀 Installation

### End Users

1. **Download** the plugin from the GitHub repository
2. **Upload** to `/wp-content/plugins/directorist-bulk-actions/`
3. **Install dependencies** (if not already included):
   ```bash
   cd wp-content/plugins/directorist-bulk-actions
   composer install --no-dev
   ```
4. **Activate** through WordPress admin (Plugins → Installed Plugins)
5. Access via **Directorist → Bulk Actions** in the WordPress admin menu

### Developers

```bash
# Clone the repository
git clone https://github.com/MahfuzulAlam/directorist-bulk-actions.git
cd directorist-bulk-actions

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Build frontend assets
npm run build

# Or run in development mode with hot reload
npm run start
```

---

## 💻 Usage

### Admin Interface

Navigate to **Directorist → Bulk Actions** in WordPress admin to access six tabbed interfaces:

#### 1. Delete Listings
- Select filters (directory type, category, status, author)
- View real-time listing count
- Choose deletion type (trash/permanent)
- Optional media and metadata cleanup
- Type "Delete" to confirm

#### 2. Update Listings
- Upload CSV file with listing data
- Map columns to fields
- Process in batches with progress bar
- Review success/error logs

#### 3. Export Taxonomies
- Select taxonomy type (categories/locations)
- Download CSV with all term data
- Includes hierarchy, icons, images, directory types

#### 4. Import Taxonomies
- Upload CSV file
- Choose update or skip existing terms
- Auto-create parent terms if needed
- Import images from URLs

#### 5. Set Coordinates
- Requires Google Maps API key in Directorist settings
- Processes all listings with addresses
- Updates latitude/longitude automatically

#### 6. Run Update
- Generic update runner for custom operations
- Hook into `directorist_bulk_actions_run_update_loop` action

### CSV Format Examples

#### Listings Update CSV
```csv
id,listing_title,listing_content,category,location,tag,publish_date,images
123,"New Title","Content here","Restaurant,Cafe","New York","pizza,food","01/12/2024 10:30","https://example.com/img1.jpg,https://example.com/img2.jpg"
```

#### Taxonomy Import CSV
```csv
id,name,slug,description,parent,category_icon,directory_type,image
,"Pizza Places",pizza-places,"Best pizza spots","Restaurants",fas fa-pizza-slice,general,https://example.com/pizza.jpg
```

---

## 🏗️ Architecture

### Technology Stack

**Backend (PHP)**
- PHP 7.4+ with type declarations
- PSR-4 autoloading via Composer
- Namespace: `Directorist\BulkActions`
- WordPress REST API

**Frontend (React)**
- React 18.2.0 with hooks
- WordPress Scripts (webpack)
- @wordpress/api-fetch for API calls
- SweetAlert2 for modals
- React Select for dropdowns
- PapaParse for CSV parsing

### Project Structure

```
directorist-bulk-actions/
├── directorist-bulk-actions.php    # Plugin bootstrap
├── composer.json                   # PHP dependencies
├── package.json                    # Node dependencies
├── webpack.config.js              # Build configuration
│
├── inc/                           # PHP Backend
│   ├── Plugin.php                # Main singleton class
│   ├── Admin/
│   │   └── AdminPage.php        # Admin menu registration
│   ├── REST/                     # REST API Controllers
│   │   ├── DeleteListings.php   # DELETE /delete/listings
│   │   ├── UpdateListings.php   # POST /update/listings
│   │   ├── TaxonomyImport.php   # POST /import/taxonomies
│   │   ├── TaxonomyExport.php   # POST /export/taxonomies
│   │   ├── UpdateCoordinates.php # POST /update/coordinates
│   │   ├── RunUpdate.php        # POST /run/update
│   │   └── ListingCount.php     # POST /listing/count
│   └── Support/
│       └── functions.php         # Helper utilities
│
├── src/                          # React Frontend
│   ├── app.jsx                  # Main React app
│   ├── style.css                # Global styles
│   └── components/
│       ├── index.jsx            # Component exports
│       ├── DeleteListings.jsx
│       ├── UpdateListings.jsx
│       ├── ImportTaxonomies.jsx
│       ├── ExportTaxonomies.jsx
│       ├── SetCoordinates.jsx
│       ├── RunListingUpdate.jsx
│       └── fields/              # Reusable form components
│
├── assets/build/                # Compiled assets (generated)
├── templates/admin/             # PHP templates
└── vendor/                      # Composer packages (generated)
```

### Design Patterns

1. **Singleton Pattern**: Main `Plugin` class
2. **Service Locator**: Centralized service registration
3. **REST API Architecture**: Decoupled frontend/backend
4. **Batch Processing**: Offset-based pagination for scalability
5. **Observer Pattern**: WordPress action/filter hooks
6. **Component-Based UI**: Reusable React components

### Data Flow

```
User Action → React Component → WordPress REST API → PHP Controller
                    ↓                                      ↓
              State Update ← JSON Response ← Database Query
```

---

## 🔌 API Reference

### REST Endpoints

All endpoints are prefixed with `/wp-json/directorist_bulk_actions/v1/`

#### Authentication
All endpoints require `manage_options` capability (Administrator role).

#### 1. Delete Listings
```
POST /delete/listings
```

**Request Body:**
```json
{
  "offset": 0,
  "limit": 5,
  "category": [{"value": "restaurants"}],
  "directory_types": [{"value": "general"}],
  "status": [{"value": "publish"}],
  "users": [{"value": 1}],
  "type": "trash",
  "media": {
    "featured": true,
    "gallery": true
  },
  "metas": {
    "deleteType": "all"
  }
}
```

**Response:**
```json
{
  "status": "success|completed|error",
  "message": "Listings Deleted Successfully!",
  "offset": 5,
  "deleted": [123, 456],
  "missing": 0
}
```

#### 2. Update Listings
```
POST /update/listings
```

**Request Body:**
```json
{
  "directory": "general",
  "items": [
    {
      "id": "123",
      "listing_title": "New Title",
      "listing_content": "Content",
      "category": "Restaurant,Cafe",
      "location": "New York",
      "tag": "pizza,food",
      "publish_date": "01/12/2024 10:30",
      "images": "https://example.com/img.jpg",
      "_custom_meta": "value"
    }
  ]
}
```

**Response:**
```json
{
  "status": "completed",
  "results": [
    {
      "status": "success",
      "ID": 123,
      "message": "Listing updated successfully."
    }
  ]
}
```

#### 3. Export Taxonomies
```
POST /export/taxonomies
```

**Request Body:**
```json
{
  "taxonomy": "category"
}
```

**Response:**
```json
{
  "status": "success",
  "terms": [
    {
      "id": 1,
      "name": "Restaurants",
      "slug": "restaurants",
      "description": "Best restaurants",
      "parent": "",
      "category_icon": "fas fa-utensils",
      "directory_type": "general,places",
      "image": "https://example.com/img.jpg"
    }
  ]
}
```

#### 4. Import Taxonomies
```
POST /import/taxonomies
```

**Request Body:**
```json
{
  "taxonomy": "category",
  "allow_update": true,
  "items": [
    {
      "id": "",
      "name": "Pizza Places",
      "slug": "pizza-places",
      "description": "Best pizza",
      "parent": "Restaurants",
      "category_icon": "fas fa-pizza-slice",
      "directory_type": "general",
      "image": "https://example.com/img.jpg"
    }
  ]
}
```

#### 5. Update Coordinates
```
POST /update/coordinates
```

**Request Body:**
```json
{
  "offset": 0,
  "limit": 5
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Coordinates updated successfully!",
  "offset": 5,
  "updated": [123, 456]
}
```

#### 6. Run Update
```
POST /run/update
```

**Request Body:**
```json
{
  "offset": 0,
  "limit": 5
}
```

#### 7. Listing Count
```
POST /listing/count
```

**Request Body:**
```json
{
  "category": [{"value": "restaurants"}],
  "directory_types": [{"value": "general"}],
  "status": [{"value": "publish"}],
  "users": [{"value": 1}]
}
```

**Response:**
```json
{
  "status": "success",
  "count": 250
}
```

---

## 🎣 Hooks & Filters

### Actions

#### `directorist_bulk_actions_run_update_loop`
Fires during the "Run Update" operation for each listing.

**Parameters:**
- `$post_id` (int): The listing post ID

**Example:**
```php
add_action('directorist_bulk_actions_run_update_loop', function($post_id) {
    // Your custom update logic
    update_post_meta($post_id, '_custom_field', 'new_value');
    
    // Trigger custom calculations
    calculate_rating($post_id);
}, 10, 1);
```

### Filters

#### `directorist_rest_user_query`
Modify user query arguments for bulk action user selectors.

**Parameters:**
- `$args` (array): WP_User_Query arguments
- `$request` (WP_REST_Request): REST request object

**Example:**
```php
add_filter('directorist_rest_user_query', function($args, $request) {
    if ($request->get_param('custom') === 'bulk_action') {
        // Only show users with specific role
        $args['role__in'] = ['administrator', 'editor'];
    }
    return $args;
}, 10, 2);
```

### Custom Endpoints

You can register additional bulk action endpoints:

```php
add_action('rest_api_init', function() {
    register_rest_route('directorist_bulk_actions/v1', '/custom/action', [
        'methods' => 'POST',
        'callback' => 'my_custom_bulk_action',
        'permission_callback' => function() {
            return current_user_can('manage_options');
        }
    ]);
});

function my_custom_bulk_action($request) {
    $offset = $request->get_param('offset') ?: 0;
    $limit = $request->get_param('limit') ?: 5;
    
    // Your custom bulk logic here
    
    return rest_ensure_response([
        'status' => 'success',
        'offset' => $offset + $limit
    ]);
}
```

---

## 🔐 Security

### Backend Security

1. **Capability Checks**: All REST endpoints require `manage_options` capability
2. **Nonce Validation**: Automatic via WordPress REST API
3. **Input Sanitization**:
   - `sanitize_text_field()` for text inputs
   - `sanitize_textarea_field()` for textarea
   - `wp_kses_post()` for HTML content
   - `absint()` for integers
4. **SQL Injection Prevention**: Uses `$wpdb->prepare()` for all queries
5. **Direct Access Protection**: `defined('ABSPATH') || exit` on all PHP files
6. **File Upload Validation**: Image type checking and size limits
7. **URL Validation**: `wp_http_validate_url()` for image imports

### Frontend Security

1. **XSS Prevention**: Text sanitization helper function
2. **CSRF Protection**: WordPress REST API nonce in headers
3. **User Confirmation**: Typed confirmation ("Delete") for destructive actions
4. **Input Validation**: Type checking and array validation
5. **Error Handling**: Try-catch blocks with user-friendly messages

### Best Practices

- Always backup database before bulk operations
- Test on staging environment first
- Use trash deletion initially (avoid permanent delete)
- Review CSV data before import
- Monitor progress logs for errors

---

## 🛠️ Development

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/MahfuzulAlam/directorist-bulk-actions.git
cd directorist-bulk-actions

# Install dependencies
composer install
npm install

# Start development server (watches for changes)
npm run start
```

### Build for Production

```bash
# Build minified assets
npm run build

# Generate optimized autoloader
composer dump-autoload --optimize
```

### File Structure Conventions

**PHP Files:**
- Use PSR-4 autoloading
- Namespace: `Directorist\BulkActions\{Subfolder}`
- Type hints on all methods
- PHPDoc comments for all public methods

**React Components:**
- Functional components with hooks
- PropTypes for type checking
- JSDoc comments for complex functions
- Memoization for expensive operations (`useCallback`, `useMemo`)

### Code Style

**PHP:**
```php
namespace Directorist\BulkActions\REST;

defined('ABSPATH') || exit;

class MyController
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_endpoint']);
    }

    public function register_endpoint(): void
    {
        // Implementation
    }
}
```

**JavaScript:**
```javascript
import { useState, useCallback } from '@wordpress/element';

const MyComponent = () => {
    const [state, setState] = useState(initialValue);
    
    const handleAction = useCallback(() => {
        // Implementation
    }, [dependencies]);
    
    return <div>Content</div>;
};

export default MyComponent;
```

### Testing

```bash
# Lint PHP (if configured)
composer lint

# Lint JavaScript
npm run lint

# Build and test
npm run build
```

### Debugging

Enable WordPress debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Check logs at `wp-content/debug.log`.

For React debugging, use browser DevTools:
- Console for errors
- Network tab for API calls
- React DevTools extension

---

## ❓ FAQ

### General Questions

**Q: Is this plugin compatible with Directorist extensions?**  
A: Yes, it works seamlessly with all official Directorist extensions and most third-party extensions.

**Q: Can I undo a bulk delete operation?**  
A: Trash deletions can be restored from WordPress trash. Permanent deletions cannot be undone. Always backup first.

**Q: What's the maximum number of listings I can process?**  
A: There's no hard limit. The plugin uses batch processing (5 listings per batch by default) to handle thousands of listings without timeout issues.

**Q: Does it work on shared hosting?**  
A: Yes, the batch processing approach is designed for shared hosting with standard PHP limits.

### Technical Questions

**Q: How do I customize the batch size?**  
A: Currently hardcoded to 5. You can modify the `BATCH_LIMIT` constant in component files or create a filter.

**Q: Can I add custom fields to CSV import?**  
A: Yes, any column not in the reserved list (`id`, `listing_title`, etc.) is treated as post meta with `_` prefix.

**Q: How do I extend the Run Update feature?**  
A: Hook into the `directorist_bulk_actions_run_update_loop` action. See [Hooks & Filters](#-hooks--filters).

**Q: Can I import images from external URLs?**  
A: Yes, the plugin downloads and attaches images from URLs in the CSV `images` column.

**Q: What date format is supported for imports?**  
A: `d/m/Y H:i` format (e.g., "01/12/2024 10:30"). See `format_csv_date_to_wp()` in `functions.php`.

### Troubleshooting

**Q: Import/export not working?**  
A: Check browser console for errors. Verify REST API is accessible at `/wp-json/`. Check file permissions.

**Q: Coordinates not updating?**  
A: Ensure Google Maps API key is configured in Directorist settings. Check API key has Geocoding API enabled.

**Q: Frontend not loading?**  
A: Run `npm run build` to compile assets. Check `assets/build/` directory exists with `app.js`.

**Q: PHP errors after update?**  
A: Run `composer install` to update dependencies. Clear OPcache if enabled.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check [existing issues](https://github.com/MahfuzulAlam/directorist-bulk-actions/issues)
2. Create a new issue with:
   - WordPress version
   - Directorist version
   - PHP version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/error logs

### Submitting Pull Requests

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Make** your changes (follow code style guidelines)
4. **Test** thoroughly
5. **Commit** with clear messages:
   ```bash
   git commit -m "Add feature: description of feature"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
7. **Open** a pull request with:
   - Clear description of changes
   - Link to related issues
   - Screenshots (if UI changes)

### Development Guidelines

- Follow WordPress coding standards
- Add PHPDoc/JSDoc comments
- Include error handling
- Test on multiple PHP/WordPress versions
- Update README if adding features

### Priority Areas

- Performance optimizations
- Additional bulk operations
- UI/UX improvements
- Internationalization (i18n)
- Unit tests
- Documentation

---

## 📝 Changelog

### 2.2.1 — 2026-07-28

**Changed**
- The Directory Type field (Update Listings tab) and Taxonomy field (Import Taxonomies tab) now use searchable react-select dropdowns via a new reusable `SingleSelect` field component, replacing the native `<select>` elements and matching the rest of the design system.

### 2.2.0 — 2026-07-28

**Changed**
- Complete admin UI redesign: modern sidebar navigation with icons and hints, card-based content area, refreshed design tokens (neutral slate base + WP admin accent color, larger radii, softer shadows), redesigned buttons, form controls, file-upload dropzones, animated progress bars, dark log console, and a danger-styled delete flow. Fully responsive with reduced-motion support.

**Performance**
- Code-split the admin app with `React.lazy`: the initial bundle dropped from ~209 KB to ~8 KB. Each tool's code — including heavy vendors (SweetAlert2, react-select, PapaParse, FileSaver) — now loads on demand when its tab is opened, with a skeleton loading state.

**Added**
- Plugin version exposed to the UI (`dba_data.version`) and shown as a badge in the page header.

### 2.1.2 — 2026-07-28

**Fixed**
- Composer PSR-4 autoloading: the namespace prefix in `composer.json` and the generated vendor maps was over-escaped, so plugin classes never resolved through the autoloader (only the manual include fallback kept the plugin working).
- Admin assets (JS, CSS, and the localized bootstrap data with its full listing-count query) loaded on every wp-admin page; they are now scoped to the Bulk Actions screen only.
- Fatal error when `assets/build/app.asset.php` is missing — the enqueue now bails gracefully.
- `/update/listings` and `/import/taxonomies` now return HTTP 400 for a missing or non-array `items` payload instead of raising a PHP error.
- An invalid CSV `publish_date` no longer resets a listing's publish date to the current time — the existing date is preserved.
- Taxonomy import parent resolution returns `0` instead of an empty string when no parent exists.
- Google-hosted image URLs on subdomains (e.g. `lh3.googleusercontent.com`) now correctly use the legacy download path.
- Delete Listings: the category filter now loads **all** non-empty categories by paginating the Directorist REST API (previously capped at the API's default of 10 per page).
- Delete Listings: the batch loop aborts with an error if a batch deletes nothing, instead of re-requesting the same posts forever.
- Set Coordinates / Run Update: progress calculation no longer divides by zero on sites with no listings.

---

## 📄 License

This plugin is licensed under **GPL-2.0-or-later**.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately

Under the terms:
- 📋 Disclose source
- 📋 Include license and copyright
- 📋 State changes
- 📋 Use same license for derivatives

See [LICENSE](LICENSE) file for full details.

---

## 🙏 Credits

**Developed by** [Mahfuzul Alam](https://github.com/MahfuzulAlam)

**Built with:**
- [WordPress](https://wordpress.org/)
- [Directorist](https://directorist.com/)
- [React](https://reactjs.org/)
- [Composer](https://getcomposer.org/)
- [WordPress Scripts](https://www.npmjs.com/package/@wordpress/scripts)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/MahfuzulAlam/directorist-bulk-actions/issues)
- **Documentation**: [GitHub Wiki](https://github.com/MahfuzulAlam/directorist-bulk-actions/wiki)
- **Directorist**: [Official Documentation](https://directorist.com/documentation/)

---

## 🗺️ Roadmap

- [ ] Unit test coverage
- [ ] WP-CLI commands
- [ ] Additional export formats (JSON, XML)
- [ ] Scheduling bulk operations
- [ ] Email notifications on completion
- [ ] Duplicate listing detection
- [ ] Advanced filtering options
- [ ] Multi-site support
- [ ] Import validation preview

---

**⭐ If you find this plugin helpful, please star the repository!**
