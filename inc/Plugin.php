<?php

namespace Directorist\BulkActions;

use Directorist\BulkActions\Admin\AdminPage;
use Directorist\BulkActions\REST\DeleteListings;
use Directorist\BulkActions\REST\ListingCount;
use Directorist\BulkActions\REST\RunUpdate;
use Directorist\BulkActions\REST\TaxonomyExport;
use Directorist\BulkActions\REST\TaxonomyImport;
use Directorist\BulkActions\REST\UpdateCoordinates;
use Directorist\BulkActions\REST\UpdateListings;

defined('ABSPATH') || exit;

final class Plugin
{
    /**
     * Plugin instance.
     *
     * @var Plugin|null
     */
    private static ?Plugin $instance = null;

    /**
     * Plugin version string for assets.
     */
    private string $version = '2.1.1';

    /**
     * Bootstrapped service classes.
     *
     * @var array<int,object>
     */
    private array $services = [];

    /**
     * Retrieve the singleton instance.
     */
    public static function instance(): Plugin
    {
        if (!isset(self::$instance) || !(self::$instance instanceof self)) {
            self::$instance = new self();
            self::$instance->init();
        }

        return self::$instance;
    }

    /**
     * Initialize plugin internals.
     */
    private function init(): void
    {
        $this->define_constants();
        $this->conditionally_include_files();
        $this->register_services();
        $this->register_hooks();
    }

    /**
     * Define plugin-wide constants.
     */
    private function define_constants(): void
    {
        $plugin_file = defined('DIRECTORIST_BULK_ACTIONS_FILE') ? DIRECTORIST_BULK_ACTIONS_FILE : dirname(__DIR__) . '/directorist-bulk-actions.php';
        $plugin_dir  = plugin_dir_path($plugin_file);
        $plugin_url  = plugin_dir_url($plugin_file);

        if (!defined('DIRECTORIST_BULK_ACTIONS_URI')) {
            define('DIRECTORIST_BULK_ACTIONS_URI', $plugin_url);
        }

        if (!defined('DIRECTORIST_BULK_ACTIONS_DIR')) {
            define('DIRECTORIST_BULK_ACTIONS_DIR', $plugin_dir);
        }
    }

    /**
     * Manually include files when Composer autoloading is unavailable.
     */
    private function conditionally_include_files(): void
    {
        $files = [
            'inc/Support/functions.php',
            'inc/Admin/AdminPage.php',
            'inc/REST/UpdateCoordinates.php',
            'inc/REST/TaxonomyExport.php',
            'inc/REST/TaxonomyImport.php',
            'inc/REST/UpdateListings.php',
            'inc/REST/RunUpdate.php',
            'inc/REST/DeleteListings.php',
            'inc/REST/ListingCount.php',
        ];

        foreach ($files as $file) {
            $path = DIRECTORIST_BULK_ACTIONS_DIR . $file;
            if (file_exists($path)) {
                require_once $path;
            }
        }
    }

    /**
     * Register the service classes that add hooks.
     */
    private function register_services(): void
    {
        $this->services = [
            new AdminPage(),
            new UpdateCoordinates(),
            new TaxonomyExport(),
            new TaxonomyImport(),
            new UpdateListings(),
            new RunUpdate(),
            new DeleteListings(),
            new ListingCount(),
        ];
    }

    /**
     * Register shared hooks.
     */
    private function register_hooks(): void
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_styles']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
    }

    /**
     * Enqueue plugin admin scripts.
     */
    public function enqueue_admin_scripts(): void
    {
        $assets = include DIRECTORIST_BULK_ACTIONS_DIR . 'assets/build/app.asset.php';

        wp_enqueue_script(
            'dba-admin-script',
            DIRECTORIST_BULK_ACTIONS_URI . 'assets/build/app.js',
            $assets['dependencies'],
            $assets['version'],
            true
        );

        wp_localize_script(
            'dba-admin-script',
            'dba_data',
            [
                'totalListings'     => $this->total_listings(),
                'directoryTypes'    => $this->get_directory_types(),
                'statuses'          => $this->get_statuses(),
                'allDirectoryTypes' => $this->get_directory_types('all'),
                'restUrl'           => 'directorist_bulk_actions/v1',
            ]
        );
    }

    /**
     * Enqueue plugin admin styles.
     */
    public function enqueue_admin_styles(): void
    {
        $css_file = 'assets/build/style-app.css';
        $css_path = DIRECTORIST_BULK_ACTIONS_DIR . $css_file;
        $css_ver  = file_exists($css_path) ? filemtime($css_path) : $this->version;
        wp_enqueue_style('dba-admin-style', DIRECTORIST_BULK_ACTIONS_URI . $css_file, [], $css_ver);
    }

    /**
     * Total number of listings.
     */
    public function total_listings(): int
    {
        $posts = get_posts(
            [
                'post_type'   => ATBDP_POST_TYPE,
                'post_status' => $this->get_statuses('keys'),
                'numberposts' => -1,
                'fields'      => 'ids',
            ]
        );

        return $posts ? count($posts) : 0;
    }

    /**
     * Retrieve directory types.
     */
    public function get_directory_types(string $info = ''): array
    {
        $directory_types = [];
        $directories     = directorist_get_directories();

        if ($directories && count($directories) > 0) {
            foreach ($directories as $directory) {
                if ('all' === $info) {
                    $directory->count = $this->get_term_count_all_statuses( $directory->term_id, ATBDP_DIRECTORY_TYPE );
                    $directory_types[] = $directory;
                } else {
                    $directory_types[$directory->term_id] = $directory->name;
                }
            }
        }

        return $directory_types;
    }

    /**
     * Retrieve statuses.
     */
    public function get_statuses(string $data = 'all'): array
    {
        $statuses              = get_post_statuses();
        $statuses['expired']   = __('Expired', 'directorist-bulk-actions');

        if ('keys' === $data) {
            $statuses = array_keys($statuses);
        }

        return $statuses;
    }

    public function get_term_count_all_statuses( $term_id, $taxonomy, $post_type = 'at_biz_dir' ) {

        global $wpdb;
    
        $count = $wpdb->get_var( $wpdb->prepare("
            SELECT COUNT( DISTINCT p.ID )
            FROM {$wpdb->posts} p
            INNER JOIN {$wpdb->term_relationships} tr ON p.ID = tr.object_id
            INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
            WHERE tt.term_id = %d
              AND tt.taxonomy = %s
              AND p.post_type = %s
              AND p.post_status != 'trash'
        ", $term_id, $taxonomy, $post_type ) );
    
        return (int) $count;
    }
}
