<?php

namespace Directorist\BulkActions\REST;

use WP_REST_Response;

defined('ABSPATH') || die('Direct access is not allowed.');

class TaxonomyExport
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_endpoint']);
    }

    public function register_endpoint(): void
    {
        register_rest_route(
            'directorist_bulk_actions/v1',
            '/export/taxonomies',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'export_taxonomies'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );
    }

    public function export_taxonomies(\WP_REST_Request $request)
    {
        $taxonomy_slug = $request->get_param('taxonomy') ? $request->get_param('taxonomy') : 'category';

        switch ($taxonomy_slug) {
            case 'location':
                $taxonomy = ATBDP_LOCATION;
                break;
            case 'category':
            default:
                $taxonomy = ATBDP_CATEGORY;
                break;
        }

        $terms = get_terms(
            [
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
                'orderby'    => 'parent',
                'order'      => 'DESC',
            ]
        );

        if (is_wp_error($terms)) {
            return new WP_REST_Response(['error' => 'Failed to get terms'], 500);
        }

        $categories = [];

        foreach ($terms as $term) {
            $categories[] = [
                'id'             => $term->term_id,
                'name'           => wp_specialchars_decode($term->name),
                'slug'           => wp_specialchars_decode($term->slug),
                'description'    => wp_specialchars_decode($term->description),
                'parent'         => $term->parent ? wp_specialchars_decode(get_term($term->parent)->name) : '',
                'category_icon'  => get_term_meta($term->term_id, 'category_icon', true),
                'directory_type' => $this->get_directory_types($term),
                'image'          => $this->get_term_image_url($term),
            ];
        }

        if ($categories && count($categories) > 0) {
            return new WP_REST_Response(
                [
                    'status'  => 'success',
                    'message' => __('Successfully retrieved data', 'directorist-bulk-actions'),
                    'terms'   => $categories,
                ],
                200
            );
        }

        return new WP_REST_Response(
            [
                'status'  => 'error',
                'message' => __('Nothing found', 'directorist-bulk-actions'),
            ],
            500
        );
    }

    public function get_directory_types($term)
    {
        $dir_types        = $this->get_all_directory_types();
        $term_dir_types   = [];
        $directory_types  = get_term_meta($term->term_id, '_directory_type', true);

        if (!empty($dir_types) && !empty($directory_types)) {
            foreach ($directory_types as $directory_type) {
                if (isset($dir_types[$directory_type]) && !empty($dir_types[$directory_type])) {
                    $term_dir_types[] = $dir_types[$directory_type];
                }
            }
        }

        return count($term_dir_types) > 0 ? implode(',', $term_dir_types) : '';
    }

    public function get_term_image_url($term, $size = 'full')
    {
        $image_id = get_term_meta($term->term_id, 'image', true);

        if (!$image_id) {
            return '';
        }

        $image_url = wp_get_attachment_image_url($image_id, $size);

        return $image_url ? $image_url : '';
    }

    public function get_all_directory_types()
    {
        $dir_types = [];
        $directory_types = get_terms(
            [
                'taxonomy'   => ATBDP_TYPE,
                'hide_empty' => false,
            ]
        );

        if (!is_wp_error($directory_types) && count($directory_types) > 0) {
            foreach ($directory_types as $dir_type) {
                $dir_types[$dir_type->term_id] = $dir_type->slug;
            }
        }

        if (!empty($dir_types)) {
            return $dir_types;
        }

        return false;
    }
}
