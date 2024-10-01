<?php

/**
 * Directorist_Bulk_Actions DBA_Admin_Page
 *
 * This class is for Admin Page of the Directorist Bulk Actions
 *
 * @package     Directorist_Bulk_Actions
 * @since       1.0
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || die( 'Direct access is not allowed.' );

if ( ! class_exists( 'DBA_Admin_Page' ) ) :

	/**
	 * Class DBA_Admin_Page
	 */
	class DBA_Admin_Page {

        /**
         * DBA_Admin_Page Constructor
         */
        public function __construct()
        {
            add_action('admin_menu', array( $this, 'admin_page' ) );
        }

        public function admin_page()
        {
            add_submenu_page(
                'edit.php?post_type=at_biz_dir',
                __('Bulk Actions - Directorist', 'directorist-bulk-actions'),
                __('Bulk Actions', 'directorist-bulk-actions'),
                'manage_options',
                'directorist-bulk-actions',
                array($this, 'directorist_bulk_actions_layout')
            );
        }

        public function directorist_bulk_actions_layout()
        {
            dba_get_template( 'admin/dashboard' );
        }

    }

    new DBA_Admin_Page();

endif;