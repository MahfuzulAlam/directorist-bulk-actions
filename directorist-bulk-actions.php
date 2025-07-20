<?php

/**
 * Plugin Name: Directorist - Bulk Actions
 * Plugin URI: https://github.com/MahfuzulAlam/directorist-bulk-actions
 * Description: A plugin that provides bulk actions for the Directorist plugin, enabling users to perform operations such as bulk import/export of taxonomies, deleting listings, deleting taxonomies, updating listing fields, and more.
 * Version: 2.0.2
 * Author: Mahfuz
 * Author URI: https://github.com/MahfuzulAlam/
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: directorist-bulk-actions
 * Domain Path: /languages
 *
 * @package Directorist_Bulk_Actions
 */

// prevent direct access to the file
defined('ABSPATH') || die('No direct script access allowed!');


if (!class_exists('Directorist_Bulk_Actions')) {

    final class Directorist_Bulk_Actions
    {
        /**
         * Instance
         */
        private static $instance;

        /**
         * Plugin Version
         */
        private $version = '2.0.2';

        /**
         * Instance
         */
        public static function instance()
        {
            if (!isset(self::$instance) && !(self::$instance instanceof Directorist_Bulk_Actions)) {
                self::$instance = new Directorist_Bulk_Actions;
                self::$instance->init();
            }
            return self::$instance;
        }

        /**
         * Init
         */
        public function init()
        {
            $this->define_constant();
            $this->includes();
            $this->enqueues();
            $this->hooks();
        }

        /**
         * Define
         */
        public function define_constant()
        {
            if (!defined('DIRECTORIST_BULK_ACTIONS_URI')) {
                define('DIRECTORIST_BULK_ACTIONS_URI', plugin_dir_url(__FILE__));
            }

            if (!defined('DIRECTORIST_BULK_ACTIONS_DIR')) {
                define('DIRECTORIST_BULK_ACTIONS_DIR', plugin_dir_path(__FILE__));
            }
        }

        /**
         * Included Files
         */
        public function includes()
        {
            include_once(DIRECTORIST_BULK_ACTIONS_DIR . '/inc/functions.php');
            include_once(DIRECTORIST_BULK_ACTIONS_DIR . '/inc/class-admin-page.php');
            include_once(DIRECTORIST_BULK_ACTIONS_DIR . '/inc/class-update-coordinates.php');
            include_once(DIRECTORIST_BULK_ACTIONS_DIR . '/inc/class-taxonomy-export.php');
            include_once(DIRECTORIST_BULK_ACTIONS_DIR . '/inc/class-taxonomy-import.php');
            include_once(DIRECTORIST_BULK_ACTIONS_DIR . '/inc/class-update-listings.php');
        }

        /**
         * Enqueues
         */
        public function enqueues()
        {
            add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_styles'));
            add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        }

        /**
         * Hooks
         */
        public function hooks()
        {
            add_filter('directorist_template', array($this, 'directorist_template'), 10, 2);
        }

        /**
         *  Enqueue JS file
         */
        public function enqueue_admin_scripts()
        {
            // Replace 'your-plugin-name' with the actual name of your plugin's folder.
            //wp_enqueue_script( 'dba-admin-script', DIRECTORIST_BULK_ACTIONS_URI . 'assets/js/admin.js', array( 'jquery' ), '1.0', true );

            $assets  = include DIRECTORIST_BULK_ACTIONS_DIR . 'assets/build/app.asset.php';

            wp_enqueue_script(
                'dba-admin-script',
                DIRECTORIST_BULK_ACTIONS_URI . 'assets/build/app.js',
                $assets['dependencies'], // ensures React from WP core is loaded
                $assets['version'],
                true
            );

            wp_localize_script('dba-admin-script', 'dba_data', [
                'totalListings' => $this->total_listings(),
                'directoryTypes' => $this->get_directory_types(),
                'restUrl'       => 'directorist_bulk_actions/v1',
            ]);
        }

        /**
         *  Enqueue CSS file
         */
        public function enqueue_admin_styles()
        {
            // Replace 'your-plugin-name' with the actual name of your plugin's folder.
            wp_enqueue_style('dba-admin-style', DIRECTORIST_BULK_ACTIONS_URI . 'assets/css/admin.css', array(), $this->version);
        }

        /**
         * Template Exists
         */
        public function template_exists($template_file)
        {
            $file = DIRECTORIST_BULK_ACTIONS_DIR . '/templates/' . $template_file . '.php';

            if (file_exists($file)) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Get Template
         */
        public function get_template($template_file, $args = array())
        {
            if (is_array($args)) {
                extract($args);
            }
            $data = $args;

            if (isset($args['form'])) $listing_form = $args['form'];

            $file = DIRECTORIST_BULK_ACTIONS_DIR . '/templates/' . $template_file . '.php';

            if ($this->template_exists($template_file)) {
                include $file;
            }
        }

        /**
         * Directorist Template
         */
        public function directorist_template($template, $field_data)
        {
            if ($this->template_exists($template)) $template = $this->get_template($template, $field_data);
            return $template;
        }

        /**
         * Total number of the listings
         */
        public function total_listings()
        {
            $posts = get_posts([
                'post_type'      => ATBDP_POST_TYPE,
                'post_status'    => ['publish', 'private', 'draft'],
                'numberposts'    => -1,
                'fields'         => 'ids',
            ]);

            return $posts ? count($posts) : 0;
        }

        /**
         * Get Directory Types
         */
        public function get_directory_types()
        {
            $directory_types = [];
            $directories =  directorist_get_directories();
            if (count($directories) > 0) {
                foreach ($directories as $directory) {
                    $directory_types[$directory->term_id] = $directory->name;
                }
            }
            return $directory_types;
        }
    }

    if (!function_exists('directorist_is_plugin_active')) {
        function directorist_is_plugin_active($plugin)
        {
            return in_array($plugin, (array) get_option('active_plugins', array()), true) || directorist_is_plugin_active_for_network($plugin);
        }
    }

    if (!function_exists('directorist_is_plugin_active_for_network')) {
        function directorist_is_plugin_active_for_network($plugin)
        {
            if (!is_multisite()) {
                return false;
            }

            $plugins = get_site_option('active_sitewide_plugins');
            if (isset($plugins[$plugin])) {
                return true;
            }

            return false;
        }
    }

    function Directorist_Bulk_Actions()
    {
        return Directorist_Bulk_Actions::instance();
    }

    if (directorist_is_plugin_active('directorist/directorist-base.php')) {
        Directorist_Bulk_Actions(); // get the plugin running
    }
}
