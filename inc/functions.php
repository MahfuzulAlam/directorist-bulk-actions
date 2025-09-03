<?php

/**
 * Directorist_Bulk_Actions Functions
 */

/**
 * Get Template
 */
if (! function_exists('dba_get_template')) {
    function dba_get_template($template_file, $args = array())
    {
        if (is_array($args)) {
            extract($args);
        }
        $data = $args;

        if (isset($args['form'])) $listing_form = $args['form'];

        $file = DIRECTORIST_BULK_ACTIONS_DIR . 'templates/' . $template_file . '.php';

        if (dba_template_exists($template_file)) {
            include $file;
        }
    }
}

/**
 * Template Exists
 */
if (! function_exists('dba_template_exists')) {
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

if (! function_exists('dba_upload_image_from_url')) {
    function dba_upload_image_from_url($image_url, $post_id = 0)
    {
        $legacy = false;

        if (! wp_http_validate_url($image_url)) return '';

        // Allow Google Drive or Googleusercontent images
        $allowed_hosts = ['googleusercontent.com', 'drive.google.com'];
        $parsed_host = parse_url($image_url, PHP_URL_HOST);

        if (in_array($parsed_host, $allowed_hosts)) $legacy = true;

        if (! $legacy) {
            return dba_insert_attachment_from_url($image_url, $post_id);
        }

        return dba_legacy_insert_attachment_from_url($image_url, $post_id);
    }
}

if (! function_exists('dba_insert_attachment_from_url')) {
    function dba_insert_attachment_from_url($image_url, $post_id = 0)
    {
        if (!filter_var($image_url, FILTER_VALIDATE_URL)) {
            return false;
        }

        $upload = directorist_rest_upload_image_from_url(esc_url_raw($image_url));

        if (is_wp_error($upload)) {
            return $upload;
        }

        $image_id = directorist_rest_set_uploaded_image_as_attachment($upload, $post_id);

        return $image_id;
    }
}

if (! function_exists('dba_legacy_insert_attachment_from_url')) {
    function dba_legacy_insert_attachment_from_url($file_url, $post_id)
    {

        if (!filter_var($file_url, FILTER_VALIDATE_URL)) {
            return false;
        }
        $contents = @file_get_contents($file_url);

        if ($contents === false) {
            return false;
        }

        if (! wp_check_filetype($file_url)['ext']) {

            $headers = array(
                'Accept'     => 'application/json',
            );

            $config = array(
                'method'      => 'GET',
                'timeout'     => 30,
                'redirection' => 5,
                'httpversion' => '1.0',
                'headers'     => $headers,
                'cookies'     => array(),
            );

            $upload = array();

            try {
                $response = wp_remote_get($file_url, $config);

                if (! is_wp_error($response)) {
                    $type = wp_remote_retrieve_header($response, 'content-type');
                    $extension = preg_replace("/\w+\//", '', $type);
                    $upload = wp_upload_bits(basename($file_url . '.' . $extension), '', wp_remote_retrieve_body($response));
                }
            } catch (Exception $e) {
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
        $attachment = array('post_title' => basename($upload['file']), 'post_content' => '', 'post_type' => 'attachment', 'post_mime_type' => $type, 'guid' => $upload['url']);
        $id = wp_insert_attachment($attachment, $upload['file'], $post_id);

        // Ensure the required file is included before calling the function
        if (! function_exists('wp_generate_attachment_metadata')) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        wp_update_attachment_metadata($id, wp_generate_attachment_metadata($id, $upload['file']));

        return $id;
    }
}

/**
 * Converts a CSV date string (e.g. "29/05/2025 08:17") to WP format "Y-m-d H:i:s"
 *
 * @param string $csv_date
 * @return string|null Formatted date string or null if invalid
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

function dba_request()
{
    $request = new \WP_REST_Request('POST', '/');
    $server  = new \WP_REST_Server();

    // Populate query parameters from GET data.
    // phpcs:ignore WordPress.Security.NonceVerification.Recommended
    $request->set_query_params(wp_unslash($_GET));

    // Populate body parameters from POST data.
    // phpcs:ignore WordPress.Security.NonceVerification.Missing
    $request->set_body_params(wp_unslash($_POST));

    // Set file parameters.
    $request->set_file_params($_FILES);

    // Populate headers from server data.
    $request->set_headers($server->get_headers(wp_unslash($_SERVER)));

    // Set raw body data.
    $request->set_body($server->get_raw_data());

    return $request;
}


/**
 * User Query Args
 */
add_filter('directorist_rest_user_query', function ($args, $request) {
    if ($request->get_param('custom') && $request->get_param('custom') == 'bulk_action') {
        $args['number'] = -1;
        $args['include'] = get_users_with_at_biz_dir_posts();
        unset($args['has_published_posts']);
    }
    return $args;
}, 10, 2);

/**
 * Get all users who have posts in custom post type `at_biz_dir`.
 *
 * @return array List of WP_User objects.
 */
if (! function_exists('get_users_with_at_biz_dir_posts')) {

    function get_users_with_at_biz_dir_posts()
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

        // Extract IDs
        $user_ids = wp_list_pluck($results, 'ID');

        // Load full user objects
        return $user_ids;
    }
}
