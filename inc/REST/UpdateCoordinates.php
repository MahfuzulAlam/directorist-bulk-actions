<?php

namespace Directorist\BulkActions\REST;

use WP_REST_Response;

defined('ABSPATH') || die('Direct access is not allowed.');

class UpdateCoordinates
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_endpoint']);
    }

    public function register_endpoint(): void
    {
        register_rest_route(
            'directorist_bulk_actions/v1',
            '/update/coordinates',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'update_coordinates'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );
    }

    public function update_coordinates(\WP_REST_Request $request)
    {
        $offset = $request->get_param('offset') ? $request->get_param('offset') : 0;
        $limit  = $request->get_param('limit') ? $request->get_param('limit') : 5;

        $api_key = get_directorist_option('map_api_key', '');
        if (empty($api_key)) {
            return new WP_REST_Response(
                [
                    'status'  => 'error',
                    'message' => __('Google Map API key does not exist!', 'directorist-bulk-actions'),
                ],
                403
            );
        }

        $count   = 0;
        $updated = [];

        $posts = get_posts(
            [
                'post_type'   => ATBDP_POST_TYPE,
                'post_status' => ['publish', 'private', 'draft'],
                'numberposts' => $limit,
                'fields'      => 'ids',
                'offset'      => $offset,
            ]
        );

        if ($posts && count($posts) > 0) {
            foreach ($posts as $post) {
                $address = get_post_meta($post, '_address', true);
                if ($address) {
                    $is_updated = $this->get_lat_lng_from_address($address, $post);
                    if ($is_updated) {
                        $updated[] = $post;
                    }
                }
                $count++;
            }

            $offset = $offset + $count;

            return rest_ensure_response(
                [
                    'message' => __('Coordinates updated successfully!', 'directorist-bulk-actions'),
                    'status'  => 'success',
                    'offset'  => $offset,
                    'posts'   => $posts,
                    'updated' => $updated,
                ]
            );
        }

        return rest_ensure_response(
            [
                'message' => __('The process has been completed successfully!', 'directorist-bulk-actions'),
                'status'  => 'success',
            ]
        );
    }

    public function get_lat_lng_from_address($address, $listing_id = 0)
    {
        $api_key = get_directorist_option('map_api_key', '');
        $address = urlencode($address);

        $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$address}&key={$api_key}";

        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            return false;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body);

        if (isset($data->status) && 'OK' === $data->status) {
            $location = $data->results[0]->geometry->location ?? null;
            if ($location) {
                update_post_meta($listing_id, '_manual_lat', $location->lat);
                update_post_meta($listing_id, '_manual_lng', $location->lng);
            }

            return true;
        }

        return false;
    }
}
