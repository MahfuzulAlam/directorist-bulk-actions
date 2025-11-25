<?php

/**
 * Helper functions for Directorist Bulk Actions.
 */

namespace Directorist\BulkActions\Support;

use DateTime;
use Exception;

defined('ABSPATH') || exit;

/**
 * Render a template file from the plugin templates directory.
 */
function dba_get_template($template_file, $args = [])
{
    if (is_array($args)) {
        extract($args);
    }

    if (isset($args['form'])) {
        $listing_form = $args['form'];
    }

    $file = DIRECTORIST_BULK_ACTIONS_DIR . 'templates/' . $template_file . '.php';

    if (dba_template_exists($template_file)) {
        include $file;
    }
}

/**
 * Check whether a template exists.
 */
function dba_template_exists($template_file): bool
{
    $file = DIRECTORIST_BULK_ACTIONS_DIR . 'templates/' . $template_file . '.php';

    return file_exists($file);
}

function dba_upload_image_from_url($image_url, $post_id = 0)
{
    $legacy = false;

    if (!wp_http_validate_url($image_url)) {
        return '';
    }

    $allowed_hosts = ['googleusercontent.com', 'drive.google.com'];
    $parsed_host   = parse_url($image_url, PHP_URL_HOST);

    if (in_array($parsed_host, $allowed_hosts, true)) {
        $legacy = true;
    }

    if (!$legacy) {
        return dba_insert_attachment_from_url($image_url, $post_id);
    }

    return dba_legacy_insert_attachment_from_url($image_url, $post_id);
}

function dba_insert_attachment_from_url($image_url, $post_id = 0)
{
    if (!filter_var($image_url, FILTER_VALIDATE_URL)) {
        return false;
    }

    $upload = directorist_rest_upload_image_from_url(esc_url_raw($image_url));

    if (is_wp_error($upload)) {
        return $upload;
    }

    return directorist_rest_set_uploaded_image_as_attachment($upload, $post_id);
}

function dba_legacy_insert_attachment_from_url($file_url, $post_id)
{
    if (!filter_var($file_url, FILTER_VALIDATE_URL)) {
        return false;
    }

    $contents = @file_get_contents($file_url);

    if (false === $contents) {
        return false;
    }

    if (!wp_check_filetype($file_url)['ext']) {
        $headers = [
            'Accept' => 'application/json',
        ];

        $config = [
            'method'      => 'GET',
            'timeout'     => 30,
            'redirection' => 5,
            'httpversion' => '1.0',
            'headers'     => $headers,
            'cookies'     => [],
        ];

        $upload = [];

        try {
            $response = wp_remote_get($file_url, $config);

            if (!is_wp_error($response)) {
                $type      = wp_remote_retrieve_header($response, 'content-type');
                $extension = preg_replace('/\w+\//', '', $type);
                $upload    = wp_upload_bits(basename($file_url . '.' . $extension), '', wp_remote_retrieve_body($response));
            }
        } catch (Exception $e) {
            // Fail silently to mirror previous behavior.
        }
    } else {
        $upload = wp_upload_bits(basename($file_url), null, $contents);
    }

    if (isset($upload['error']) && $upload['error']) {
        return false;
    }

    $type = '';

    if (!empty($upload['type'])) {
        $type = $upload['type'];
    } else {
        $mime = wp_check_filetype($upload['file']);
        if ($mime) {
            $type = $mime['type'];
        }
    }

    $attachment = [
        'post_title'     => basename($upload['file']),
        'post_content'   => '',
        'post_type'      => 'attachment',
        'post_mime_type' => $type,
        'guid'           => $upload['url'],
    ];

    $id = wp_insert_attachment($attachment, $upload['file'], $post_id);

    if (!function_exists('wp_generate_attachment_metadata')) {
        require_once ABSPATH . 'wp-admin/includes/image.php';
    }

    wp_update_attachment_metadata($id, wp_generate_attachment_metadata($id, $upload['file']));

    return $id;
}

/**
 * Convert CSV date string to WP format.
 */
function format_csv_date_to_wp($csv_date)
{
    if (empty($csv_date)) {
        return null;
    }

    $date_obj = DateTime::createFromFormat('d/m/Y H:i', trim($csv_date));

    if ($date_obj) {
        return $date_obj->format('Y-m-d H:i:s');
    }

    return null;
}

function dba_request(): \WP_REST_Request
{
    $request = new \WP_REST_Request('POST', '/');
    $server  = new \WP_REST_Server();

    $request->set_query_params(wp_unslash($_GET));
    $request->set_body_params(wp_unslash($_POST));
    $request->set_file_params($_FILES);
    $request->set_headers($server->get_headers(wp_unslash($_SERVER)));
    $request->set_body($server->get_raw_data());

    return $request;
}

add_filter(
    'directorist_rest_user_query',
    function ($args, $request) {
        if ($request->get_param('custom') && 'bulk_action' === $request->get_param('custom')) {
            $args['number']  = -1;
            $args['include'] = get_users_with_at_biz_dir_posts();
            unset($args['has_published_posts']);
        }

        return $args;
    },
    10,
    2
);

function get_users_with_at_biz_dir_posts(): array
{
    global $wpdb;

    $results = $wpdb->get_results(
        $wpdb->prepare(
            "
            SELECT DISTINCT u.ID
            FROM $wpdb->users u
            INNER JOIN $wpdb->posts p ON u.ID = p.post_author
            WHERE p.post_type = %s
            ",
            'at_biz_dir'
        )
    );

    if (empty($results)) {
        return [];
    }

    return wp_list_pluck($results, 'ID');
}
