<?php

namespace Directorist\BulkActions\REST;

defined('ABSPATH') || die('Direct access is not allowed.');

class DeleteListings
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_endpoint']);
    }

    public function register_endpoint(): void
    {
        register_rest_route(
            'directorist_bulk_actions/v1',
            '/delete/listings',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'delete_listings'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );
    }

    public function delete_listings(\WP_REST_Request $request)
    {
        $offset          = $request->get_param('offset') ? $request->get_param('offset') : 0;
        $limit           = $request->get_param('limit') ? $request->get_param('limit') : 5;
        $category        = $request->get_param('category') ? $request->get_param('category') : [];
        $location        = $request->get_param('location') ? $request->get_param('location') : [];
        $metas           = $request->get_param('metas') ? $request->get_param('metas') : [];
        $media           = $request->get_param('media') ? $request->get_param('media') : [];
        $directory_types = $request->get_param('directory_types') ? $request->get_param('directory_types') : [];
        $type            = $request->get_param('type') ? $request->get_param('type') : 'trash';
        $users           = $request->get_param('users') ? $this->extract_values($request->get_param('users')) : [];
        $status          = $request->get_param('status') ? $this->extract_values($request->get_param('status')) : 'any';

        $directory_types = is_array($directory_types) && count($directory_types) > 0 ? $this->extract_values($directory_types) : [];
        $category        = is_array($category) && count($category) > 0 ? $this->extract_values($category) : [];

        $count   = 0;
        $deleted = [];
        $missing = 0;

        $args = [
            'post_type'   => ATBDP_POST_TYPE,
            'post_status' => $status,
            'numberposts' => $limit,
            'fields'      => 'ids',
            'offset'      => $offset,
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

        if (!empty($location) && is_array($location)) {
            $tax_query[] = [
                'taxonomy' => ATBDP_LOCATION,
                'field'    => is_numeric($location[0]) ? 'term_id' : 'slug',
                'terms'    => $location,
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
            foreach ($posts as $post) {
                $is_deleted = false;

                if (isset($media['featured']) && true === $media['featured']) {
                    $this->delete_featured_image_by_meta($post);
                }

                if (isset($media['gallery']) && true === $media['gallery']) {
                    $this->delete_gallery_images_by_meta($post);
                }

                if (isset($metas['deleteType']) && 'all' === $metas['deleteType']) {
                    $this->delete_all_post_metas($post);
                }

                if ('trash' === $type) {
                    $is_deleted = $this->trash_listing($post);
                } elseif ('permanent' === $type) {
                    $is_deleted = $this->delete_listing_permanently($post);
                }

                if ($is_deleted) {
                    $deleted[] = $post;
                } else {
                    $missing++;
                }

                $count++;
            }

            $offset = $offset + $count;

            return rest_ensure_response(
                [
                    'message' => __('Listings Deleted Successfully!', 'directorist-bulk-actions'),
                    'status'  => 'success',
                    'offset'  => $offset,
                    'posts'   => $posts,
                    'deleted' => $deleted,
                    'missing' => $missing,
                ]
            );
        }

        return rest_ensure_response(
            [
                'message' => __('The process has been completed successfully!', 'directorist-bulk-actions'),
                'status'  => 'completed',
            ]
        );
    }

    public function trash_listing($listing_id): bool
    {
        $result = wp_trash_post($listing_id);

        // wp_trash_post() returns the post object on success, false on failure.
        // It never returns a WP_Error, so checking is_wp_error() alone would
        // always evaluate to true — including when trashing actually failed.
        return false !== $result;
    }

    public function delete_listing_permanently($listing_id, $meta_delete = false): bool
    {
        $result = wp_delete_post($listing_id, $meta_delete);

        return !is_wp_error($result) && false !== $result;
    }

    public function delete_all_post_metas($listing_id): void
    {
        global $wpdb;
        $wpdb->delete($wpdb->postmeta, ['post_id' => $listing_id]);
    }

    public function delete_featured_image_by_meta($listing_id): bool
    {
        $attachment_id = get_post_meta($listing_id, '_listing_prv_img', true);

        if (!empty($attachment_id) && 'attachment' === get_post_type($attachment_id)) {
            $deleted = wp_delete_attachment($attachment_id, true);

            if ($deleted) {
                delete_post_meta($listing_id, '_listing_prv_img');
                return true;
            }
        }

        return false;
    }

    public function delete_gallery_images_by_meta($listing_id): bool
    {
        $attachment_ids = get_post_meta($listing_id, '_listing_img', true);

        if (!empty($attachment_ids) && is_array($attachment_ids)) {
            $all_deleted = true;

            foreach ($attachment_ids as $attachment_id) {
                if ('attachment' === get_post_type($attachment_id)) {
                    $deleted = wp_delete_attachment($attachment_id, true);
                    if (!$deleted) {
                        $all_deleted = false;
                    }
                }
            }

            delete_post_meta($listing_id, '_listing_img');

            return $all_deleted;
        }

        return false;
    }

    public function extract_values(array $items, string $key = 'value'): array
    {
        return array_column($items, $key);
    }
}
