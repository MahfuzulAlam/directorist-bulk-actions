<?php

namespace Directorist\BulkActions\REST;

defined('ABSPATH') || die('Direct access is not allowed.');

class ListingCount
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_endpoint']);
    }

    public function register_endpoint(): void
    {
        register_rest_route(
            'directorist_bulk_actions/v1',
            '/listing/count',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'listing_count'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );
    }

    public function listing_count(\WP_REST_Request $request)
    {
        $category        = $request->get_param('category') ? $request->get_param('category') : [];
        $directory_types = $request->get_param('directory_types') ? $request->get_param('directory_types') : [];
        $users           = $request->get_param('users') ? $this->extract_values($request->get_param('users')) : [];
        $status          = $request->get_param('status') ? $this->extract_values($request->get_param('status')) : 'any';

        $directory_types = is_array($directory_types) && count($directory_types) > 0 ? $this->extract_values($directory_types) : [];
        $category        = is_array($category) && count($category) > 0 ? $this->extract_values($category) : [];

        $args = [
            'post_type'   => ATBDP_POST_TYPE,
            'post_status' => $status,
            'numberposts' => -1,
            'fields'      => 'ids',
        ];

        $tax_query = [];

        if (!empty($category) && is_array($category)) {
            $tax_query[] = [
                'taxonomy' => ATBDP_CATEGORY,
                'field'    => is_numeric($category[0]) ? 'term_id' : 'slug',
                'terms'    => $category,
                'operator' => 'IN',
            ];
        }

        if (!empty($directory_types) && is_array($directory_types)) {
            $tax_query[] = [
                'taxonomy' => ATBDP_DIRECTORY_TYPE,
                'field'    => is_numeric($directory_types[0]) ? 'term_id' : 'slug',
                'terms'    => $directory_types,
                'operator' => 'IN',
            ];
        }

        if (!empty($tax_query)) {
            $tax_query['relation'] = 'AND';
            $args['tax_query']      = $tax_query;
        }

        if (!empty($users) && is_array($users)) {
            $args['author__in'] = $users;
        }

        $posts = get_posts($args);

        if ($posts && count($posts) > 0) {
            return rest_ensure_response(
                [
                    'message' => __('Listings found.', 'directorist-bulk-actions'),
                    'status'  => 'success',
                    'count'   => count($posts),
                ]
            );
        }

        return rest_ensure_response(
            [
                'message' => __('Could not find any listings.', 'directorist-bulk-actions'),
                'status'  => 'none',
                'count'   => 0,
            ]
        );
    }

    public function extract_values(array $items, string $key = 'value'): array
    {
        return array_column($items, $key);
    }
}
