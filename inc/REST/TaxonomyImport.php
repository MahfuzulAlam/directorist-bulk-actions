<?php

namespace Directorist\BulkActions\REST;

use WP_REST_Response;
use function Directorist\BulkActions\Support\dba_upload_image_from_url;

defined('ABSPATH') || die('Direct access is not allowed.');

class TaxonomyImport
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_endpoint']);
    }

    public function register_endpoint(): void
    {
        register_rest_route(
            'directorist_bulk_actions/v1',
            '/import/taxonomies',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'import_taxonomies'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );
    }

    public function import_taxonomies(\WP_REST_Request $request)
    {
        $taxonomy_slug = $request->get_param('taxonomy');
        $items         = $request->get_param('items');
        $allow_update  = $request->get_param('allow_update');

        if (empty($taxonomy_slug) || !in_array($taxonomy_slug, ['category', 'location'], true)) {
            return new WP_REST_Response(
                [
                    'error' => 'Invalid or missing taxonomy: ' . json_encode($taxonomy_slug),
                ],
                400
            );
        }

        if (empty($items) || !is_array($items)) {
            return new WP_REST_Response(['error' => 'Invalid or missing items'], 400);
        }

        switch ($taxonomy_slug) {
            case 'location':
                $taxonomy = ATBDP_LOCATION;
                break;
            case 'category':
            default:
                $taxonomy = ATBDP_CATEGORY;
                break;
        }

        $response = [];

        foreach ($items as $item) {
            $term_id         = sanitize_text_field($item['id'] ?? '');
            $name            = sanitize_text_field($item['name'] ?? '');
            $slug            = sanitize_title($item['slug'] ?? '');
            $description     = sanitize_textarea_field($item['description'] ?? '');
            $parent          = isset($item['parent']) && !empty($item['parent']) ? $item['parent'] : '';
            $image           = isset($item['image']) && !empty($item['image']) ? dba_upload_image_from_url($item['image']) : '';
            $directory_types = isset($item['directory_type']) && !empty($item['directory_type']) ? $this->get_directory_types($item['directory_type']) : '';

            $meta = [
                'category_icon'   => $item['category_icon'] ?? '',
                '_directory_type' => $directory_types,
                'image'           => $image,
            ];

            if (empty($name)) {
                $response[] = ['status' => 'failed', 'message' => 'Missing name'];
                continue;
            }

            $existing_id = 0;

            if ($term_id) {
                $check_id = get_term_by('id', $term_id, $taxonomy);
                if ($check_id) {
                    $existing_id = $check_id->term_id;
                }
            }

            if ($slug) {
                $check_term = get_term_by('slug', $slug, $taxonomy);
                if ($check_term) {
                    $existing_id = $check_term->term_id;
                }
            }

            $parent_id = $this->get_parent_term_id($parent, $taxonomy, $directory_types);

            $args = [
                'slug'        => $slug,
                'description' => $description,
                'parent'      => $parent_id,
            ];

            if ($existing_id) {
                if ($allow_update) {
                    $args['name'] = $name;
                    wp_update_term($existing_id, $taxonomy, $args);

                    foreach ($meta as $key => $value) {
                        update_term_meta($existing_id, $key, $value);
                    }

                    $response[] = ['status' => 'updated'];
                } else {
                    $response[] = ['status' => 'exists', 'message' => 'Term already exists with ID: ' . $existing_id];
                }
            } else {
                $result     = $this->insert_term($name, $taxonomy, $args, $meta);
                $response[] = $result ? ['status' => 'added'] : ['status' => 'failed'];
            }
        }

        return new WP_REST_Response(['results' => $response], 200);
    }

    public function get_directory_types($term_dir_type)
    {
        $term_directory_types = [];
        $dir_types            = $this->get_all_directory_types();

        if (!empty($dir_types) && !empty($term_dir_type)) {
            $directory_types = explode(',', $term_dir_type);

            if (!empty($directory_types) && count($directory_types) > 0) {
                foreach ($directory_types as $directory_type) {
                    if (!empty($dir_types) && count($dir_types) > 0) {
                        foreach ($dir_types as $key => $type) {
                            if ($type === trim($directory_type)) {
                                $term_directory_types[] = $key;
                            }
                        }
                    }
                }
            }
        }

        return $term_directory_types;
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

    public function insert_term($name, $taxonomy, $args = [], $meta = [], $type = '')
    {
        $result = wp_insert_term($name, $taxonomy, $args);

        if (!is_wp_error($result)) {
            $term_id = $result['term_id'];
            foreach ($meta as $key => $value) {
                update_term_meta($term_id, $key, $value);
            }

            return $term_id;
        }

        return false;
    }

    public function get_parent_term_id($parent, $taxonomy, $directory_types)
    {
        if (!empty($parent)) {
            $parent_term = get_term_by('name', $parent, $taxonomy);
            if ($parent_term && !is_wp_error($parent_term)) {
                return $parent_term->term_id;
            }

            $parent_term_id = $this->insert_term(
                $parent,
                $taxonomy,
                [
                    'parent' => 0,
                ],
                [
                    '_directory_type' => $directory_types,
                ],
                'parent'
            );
            if ($parent_term_id) {
                return $parent_term_id;
            }
        }

        return 0;
    }
}
