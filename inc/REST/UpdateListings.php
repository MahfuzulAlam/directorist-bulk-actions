<?php

namespace Directorist\BulkActions\REST;

use ATBDP_Tools;
use WP_REST_Response;
use function Directorist\BulkActions\Support\format_csv_date_to_wp;

defined('ABSPATH') || exit;

class UpdateListings
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_update_listings_api']);
    }

    public function register_update_listings_api(): void
    {
        register_rest_route(
            'directorist_bulk_actions/v1',
            '/update/listings',
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'handle_update_listings'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );
    }

    public function handle_update_listings(\WP_REST_Request $request)
    {
        $directory = $request->get_param('directory');
        $items     = $request->get_param('items');

        if (empty($directory)) {
            return new WP_REST_Response(['error' => 'Invalid or missing directory type'], 400);
        }

        $results = [];

        foreach ($items as $item) {
            if (!isset($item['id']) || empty($item['id']) || !is_numeric($item['id'])) {
                $results[] = [
                    'status'  => 'error',
                    'message' => 'Missing or invalid post ID',
                    'item'    => $item,
                ];
                continue;
            }

            $post_id  = (int) $item['id'];
            $existing = get_post($post_id);

            if (!$existing || 'at_biz_dir' !== $existing->post_type) {
                $results[] = [
                    'status'  => 'error',
                    'message' => 'Post not found or not a valid listing',
                    'ID'      => $post_id,
                ];
                continue;
            }

            $tax_input  = $this->prepare_tax_input($item, $directory);
            $meta_input = $this->prepare_meta_input($item);

            $post_data = [
                'ID'           => $post_id,
                'post_title'   => isset($item['listing_title']) ? sanitize_text_field($item['listing_title']) : $existing->post_title,
                'post_content' => isset($item['listing_content']) ? wp_kses_post($item['listing_content']) : $existing->post_content,
                'post_date'    => isset($item['publish_date']) ? format_csv_date_to_wp($item['publish_date']) : $existing->post_date,
                'tax_input'    => $tax_input,
                'meta_input'   => $meta_input,
            ];

            $result = wp_update_post($post_data, true);

            if (is_wp_error($result)) {
                $results[] = [
                    'status'  => 'error',
                    'message' => $result->get_error_message(),
                    'ID'      => $post_id,
                ];
                continue;
            }

            if (isset($item['images']) && $item['images']) {
                $this->import_images($item['images'], $post_id);
            }

            $results[] = [
                'status'  => 'success',
                'ID'      => $post_id,
                'message' => 'Listing updated successfully.',
            ];
        }

        return new WP_REST_Response(
            ['status' => 'completed', 'results' => $results],
            200
        );
    }

    private function prepare_tax_input($item, $directory)
    {
        $tax_input = [];

        $taxonomy_map = [
            'category' => ATBDP_CATEGORY,
            'location' => ATBDP_LOCATION,
            'tag'      => ATBDP_TAGS,
        ];

        foreach ($taxonomy_map as $item_key => $taxonomy) {
            if (!empty($item[$item_key])) {
                $terms    = array_map('trim', explode(',', $item[$item_key]));
                $term_ids = [];

                foreach ($terms as $term_name) {
                    $term = term_exists($term_name, $taxonomy);

                    if (!$term) {
                        $term = wp_insert_term($term_name, $taxonomy);
                        if (ATBDP_TAGS !== $taxonomy && !is_wp_error($term) && isset($term['term_id'])) {
                            update_term_meta($term['term_id'], '_directory_type', [$directory]);
                        }
                    }

                    if (!is_wp_error($term)) {
                        $term_ids[] = is_array($term) ? $term['term_id'] : $term;
                    }
                }

                $tax_input[$taxonomy] = $term_ids;
            }
        }

        return $tax_input;
    }

    private function prepare_meta_input($item)
    {
        $meta_input = [];

        $skip_keys = ['id', 'listing_title', 'listing_content', 'publish_date', 'category', 'location', 'tag', 'images'];

        foreach ($item as $key => $value) {
            if (in_array($key, $skip_keys, true)) {
                continue;
            }

            $value    = $value ? self::unescape_data($value) : '';
            $value    = $this->maybe_unserialize_csv_string($value);
            $meta_key = '_' . ltrim(sanitize_key($key), '_');
            $meta_input[$meta_key] = $value;
        }

        return $meta_input;
    }

    protected static function unescape_data($value)
    {
        $active_content_triggers = ["'=", "'+", "'-", "'@"];

        if (in_array(mb_substr($value, 0, 2), $active_content_triggers, true)) {
            $value = mb_substr($value, 1);
        }

        return $value;
    }

    public function maybe_unserialize_csv_string($data)
    {
        if (!is_string($data)) {
            return $data;
        }

        $_data = str_replace("'", '"', $data);
        $_data = maybe_unserialize(maybe_unserialize($_data));

        if (!empty($_data)) {
            return $_data;
        }

        return $data;
    }

    public function import_images($image_urls, $post_id): void
    {
        if (empty($image_urls)) {
            return;
        }

        $attachment_ids = [];
        $image_urls     = empty($image_urls) ? [] : explode(',', $image_urls);

        foreach ($image_urls as $image_url) {
            $image_url = trim($image_url);
            if (!empty($image_url)) {
                $attachment_id = ATBDP_Tools::atbdp_insert_attachment_from_url($image_url, $post_id);
                if ($attachment_id) {
                    $attachment_ids[] = $attachment_id;
                }
            }
        }

        if ($attachment_ids && count($attachment_ids) > 0) {
            update_post_meta($post_id, '_listing_prv_img', $attachment_ids[0]);
            if (count($attachment_ids) > 1) {
                array_shift($attachment_ids);
                update_post_meta($post_id, '_listing_img', $attachment_ids);
            }
        }
    }
}
