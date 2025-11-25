<?php

namespace Directorist\BulkActions\REST;

defined('ABSPATH') || die('Direct access is not allowed.');

class RunUpdate
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_endpoint']);
    }

    public function register_endpoint(): void
    {
        register_rest_route(
            'directorist_bulk_actions/v1',
            '/run/update',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'run_update_loop'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );
    }

    public function run_update_loop(\WP_REST_Request $request)
    {
        $offset = $request->get_param('offset') ? $request->get_param('offset') : 0;
        $limit  = $request->get_param('limit') ? $request->get_param('limit') : 5;

        $count   = 0;
        $updated = [];

        $posts = get_posts(
            [
                'post_type'   => ATBDP_POST_TYPE,
                'post_status' => ['publish', 'private', 'draft', 'expired'],
                'numberposts' => $limit,
                'fields'      => 'ids',
                'offset'      => $offset,
            ]
        );

        if ($posts && count($posts) > 0) {
            foreach ($posts as $post) {
                do_action('directorist_bulk_actions_run_update_loop', $post);
                $count++;
                $updated[] = $post;
            }

            $offset = $offset + $count;

            return rest_ensure_response(
                [
                    'message' => __('Listings updated successfully!', 'directorist-bulk-actions'),
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
}
