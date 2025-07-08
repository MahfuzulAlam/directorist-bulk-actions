<?php

/**
 * Directorist_Bulk_Actions DBA_Taxonomy_Import
 *
 * This class is for Admin Page of the Directorist Bulk Actions
 *
 * @package     Directorist_Bulk_Actions
 * @since       1.0
 */

// Exit if accessed directly.
defined('ABSPATH') || die('Direct access is not allowed.');

if (! class_exists('DBA_Taxonomy_Import')):

    /**
     * Class DBA_Taxonomy_Import
     */
    class DBA_Taxonomy_Import
    {

        /**
         * DBA_Taxonomy_Import Constructor
         */
        public function __construct()
        {
            add_action('rest_api_init', [$this, 'import_taxonomies_api']);
        }

        // WordPress: functions.php or plugin file
        public function import_taxonomies_api()
        {
            register_rest_route('directorist_bulk_actions/v1', '/import/taxonomies', [
                'methods'             => 'POST',
                'callback'            => [$this, 'import_taxonomies'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]);
        }

        public function import_taxonomies(\WP_REST_Request $request)
        {
            $taxonomy_slug = $request->get_param('taxonomy');
            $items     = $request->get_param('items');

            if (empty($taxonomy_slug) || !in_array($taxonomy_slug, ['category', 'location'])) {
                return new WP_REST_Response([
                    'error' => 'Invalid or missing taxonomy: ' . json_encode($taxonomy_slug)
                ], 400);
            }

            switch ($taxonomy_slug) {
                case 'category':
                    $taxonomy = ATBDP_CATEGORY;
                    break;
                case 'location':
                    $taxonomy = ATBDP_LOCATION;
                    break;
                default:
                    $taxonomy = ATBDP_CATEGORY;
                    break;
            }

            $response = [];

            foreach ($items as $item) {
                $name = sanitize_text_field($item['name'] ?? '');
                $slug = sanitize_title($item['slug'] ?? '');
                $description = sanitize_textarea_field($item['description'] ?? '');
                $parent = isset($item['parent']) && !empty($item['parent']) ? $item['parent'] : '';
                $image = isset($item['image']) && !empty($item['image']) ? dba_upload_image_from_url($item['image']) : '';
                //$image = !empty($image) && ! is_wp_error($image) ? $image : '';
                $meta = [
                    'category_icon'    => $item['category_icon'] ?? '',
                    '_directory_type'  => isset($item['directory_type']) && !empty($item['directory_type']) ? $this->get_directory_types($item['directory_type']) : '',
                    'image'            => $image,
                ];

                if (empty($name)) {
                    $response[] = ['status' => 'failed', 'message' => 'Missing name'];
                    continue;
                }

                // Check if term already exists
                $existing_id = get_term_by('id', $slug, $taxonomy);
                $existing_term = get_term_by('slug', $slug, $taxonomy);
                $parent_id = $this->get_parent_term_id($parent, $taxonomy);

                if ($existing_id || $existing_term) {
                    wp_update_term($existing_term->term_id, $taxonomy, [
                        'name'        => $name,
                        'description' => $description,
                        'parent'      => $parent_id,
                        'slug'        => $slug,
                    ]);

                    foreach ($meta as $key => $value) {
                        update_term_meta($existing_term->term_id, $key, $value);
                    }

                    $response[] = ['status' => 'updated'];
                } else {
                    $result = wp_insert_term($name, $taxonomy, [
                        'slug'        => $slug,
                        'description' => $description,
                        'parent'      => $parent_id,
                    ]);

                    if (is_wp_error($result)) {
                        $response[] = ['status' => 'failed', 'message' => $result->get_error_message()];
                    } else {
                        $term_id = $result['term_id'];
                        foreach ($meta as $key => $value) {
                            update_term_meta($term_id, $key, $value);
                        }
                        $response[] = ['status' => 'added'];
                    }
                }
            }

            return new WP_REST_Response(['results' => $response], 200);
        }

        public function get_directory_types($term_dir_type)
        {
            $term_directory_types = [];
            $dir_types = $this->get_all_directory_types();
            if (!empty($dir_types) && !empty($term_dir_type)) {
                $directory_types = explode(',', $term_dir_type);

                if (!empty($directory_types) && count($directory_types) > 0) {
                    foreach ($directory_types as $directory_type) {
                        if (!empty($dir_types && count($dir_types) > 0)) {
                            foreach ($dir_types as $key => $type) {
                                if ($type === trim($directory_type)) $term_directory_types[] = $key;
                            }
                        }
                    }
                }
            }
            return $term_directory_types;
        }

        public function get_term_image_url($term, $size = 'full')
        {
            $image_id = get_term_meta($term->term_id, 'image', true);

            if (! $image_id) {
                return ''; // No image set
            }

            $image_url = wp_get_attachment_image_url($image_id, $size);

            return $image_url ? $image_url : '';
        }

        public function get_all_directory_types()
        {
            $dir_types = array();
            $directory_types = get_terms(array(
                'taxonomy'   => ATBDP_TYPE,
                'hide_empty' => false,
            ));

            if (!is_wp_error($directory_types) && count($directory_types) > 0) {
                foreach ($directory_types as $dir_type) {
                    $dir_types[$dir_type->term_id] = $dir_type->slug;
                }
            }

            if (!empty($dir_types)) {
                return $dir_types;
            } else {
                return false;
            }
        }

        public function get_parent_term_id($parent, $taxonomy)
        {
            if (!empty($parent)) {
                $parent_term = get_term_by('name', $parent, $taxonomy);
                //file_put_contents(__DIR__ . '/items.json', json_encode([$parent_term, $taxonomy]));
                if ($parent_term && !is_wp_error($parent_term)) {
                    return $parent_term->term_id;
                }
            }
            return '';
        }
    }

    new DBA_Taxonomy_Import();

endif;
