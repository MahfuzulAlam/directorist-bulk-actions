<?php
/**
 * Plugin Name: Directorist - Bulk Actions
 * Plugin URI: https://github.com/MahfuzulAlam/directorist-bulk-actions
 * Description: A plugin that provides bulk actions for the Directorist plugin, enabling users to perform operations such as bulk import/export of taxonomies, deleting listings, deleting taxonomies, updating listing fields, and more.
 * Version: 1.0.0
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
defined( 'ABSPATH' ) || die( 'No direct script access allowed!' );


if (!class_exists('Directorist_Bulk_Actions')) {

    final class Directorist_Bulk_Actions
    {
        /**
         * Instance
         */
        private static $instance;

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
            if ( !defined( 'DIRECTORIST_BULK_ACTIONS_URI' ) ) {
                define( 'DIRECTORIST_BULK_ACTIONS_URI', plugin_dir_url( __FILE__ ) );
            }

            if ( !defined( 'DIRECTORIST_BULK_ACTIONS_DIR' ) ) {
                define( 'DIRECTORIST_BULK_ACTIONS_DIR', plugin_dir_path( __FILE__ ) );
            }
        }

        /**
         * Included Files
         */
        public function includes()
        {
            include_once( DIRECTORIST_BULK_ACTIONS_DIR . '/inc/functions.php' );
            include_once( DIRECTORIST_BULK_ACTIONS_DIR . '/inc/class-admin-page.php' );
        }

        /**
         * Enqueues
         */
        public function enqueues()
        {
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
        }

        /**
         * Hooks
         */
        public function hooks()
        {
            add_filter( 'directorist_template', array( $this, 'directorist_template' ), 10, 2 );
        }

        /**
         *  Enqueue JS file
         */
        public function enqueue_admin_scripts()
        {
            // Replace 'your-plugin-name' with the actual name of your plugin's folder.
            wp_enqueue_script( 'dba-admin-script', DIRECTORIST_BULK_ACTIONS_URI . 'assets/js/admin.js', array( 'jquery' ), '1.0', true );
        }

        /**
         *  Enqueue CSS file
         */
        public function enqueue_admin_styles()
        {
            // Replace 'your-plugin-name' with the actual name of your plugin's folder.
            wp_enqueue_style( 'dba-admin-style', DIRECTORIST_BULK_ACTIONS_URI . 'assets/css/admin.css', array(), '1.0' );
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

            $file = DIRECTORIST_CUSTOM_CODE_DIR . '/templates/' . $template_file . '.php';

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