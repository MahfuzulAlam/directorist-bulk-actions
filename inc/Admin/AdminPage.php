<?php

namespace Directorist\BulkActions\Admin;

use function Directorist\BulkActions\Support\dba_get_template;

defined('ABSPATH') || die('Direct access is not allowed.');

class AdminPage
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'admin_page']);
    }

    public function admin_page(): void
    {
        add_submenu_page(
            'edit.php?post_type=at_biz_dir',
            __('Bulk Actions - Directorist', 'directorist-bulk-actions'),
            __('Bulk Actions', 'directorist-bulk-actions'),
            'manage_options',
            'directorist-bulk-actions',
            [$this, 'directorist_bulk_actions_layout']
        );
    }

    public function directorist_bulk_actions_layout(): void
    {
        dba_get_template('admin/dashboard');
    }
}
