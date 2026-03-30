<?php

/**
 * Plugin Name: Directorist - Bulk Actions
 * Plugin URI: https://wpxplorer.com/tools/directorist-bulk-actions
 * Description: Bulk tools for Directorist to import/export, clean up, and update listings at scale.
 * Version: 2.1.1
 * Author: wpXplore
 * Author URI: https://wpxplore.com
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: directorist-bulk-actions
 * Domain Path: /languages
 *
 * @package Directorist_Bulk_Actions
 */

if (!defined('ABSPATH')) {
    exit;
}

$plugin_file = __FILE__;

if (!defined('DIRECTORIST_BULK_ACTIONS_FILE')) {
    define('DIRECTORIST_BULK_ACTIONS_FILE', $plugin_file);
}

$composer_autoload = __DIR__ . '/vendor/autoload.php';
$using_composer    = false;

if (is_readable($composer_autoload)) {
    require_once $composer_autoload;
    $using_composer = true;
}

if (!defined('DIRECTORIST_BULK_ACTIONS_USING_COMPOSER')) {
    define('DIRECTORIST_BULK_ACTIONS_USING_COMPOSER', $using_composer);
}

if (!class_exists(\Directorist\BulkActions\Plugin::class)) {
    require_once __DIR__ . '/inc/Plugin.php';
}

use Directorist\BulkActions\Plugin;

if (!function_exists('directorist_is_plugin_active')) {
    function directorist_is_plugin_active($plugin)
    {
        return in_array($plugin, (array) get_option('active_plugins', []), true) || directorist_is_plugin_active_for_network($plugin);
    }
}

if (!function_exists('directorist_is_plugin_active_for_network')) {
    function directorist_is_plugin_active_for_network($plugin)
    {
        if (!is_multisite()) {
            return false;
        }

        $plugins = get_site_option('active_sitewide_plugins');

        return isset($plugins[$plugin]);
    }
}

function Directorist_Bulk_Actions(): Plugin
{
    return Plugin::instance();
}

if (directorist_is_plugin_active('directorist/directorist-base.php')) {
    Directorist_Bulk_Actions();
}
