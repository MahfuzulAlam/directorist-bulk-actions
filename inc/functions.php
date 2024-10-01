<?php

/**
 * Directorist_Bulk_Actions Functions
 */

/**
 * Get Template
 */
if( ! function_exists( 'dba_get_template' ) )
{
    function dba_get_template($template_file, $args = array())
    {
        if (is_array($args)) {
            extract($args);
        }
        $data = $args;

        if (isset($args['form'])) $listing_form = $args['form'];

        $file = DIRECTORIST_BULK_ACTIONS_DIR . 'templates/' . $template_file . '.php';

        if ( dba_template_exists( $template_file ) ) {
            include $file;
        }
    }
}

/**
 * Template Exists
 */
if( ! function_exists( 'dba_template_exists' ) )
{
    function dba_template_exists($template_file)
    {
        $file = DIRECTORIST_BULK_ACTIONS_DIR . 'templates/' . $template_file . '.php';

        if (file_exists($file)) {
            return true;
        } else {
            return false;
        }
    }
}