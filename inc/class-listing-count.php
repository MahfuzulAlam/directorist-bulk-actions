<?php

/**
 * Directorist_Bulk_Actions DBA_Listing_Count
 *
 * This class is for Admin Page of the Directorist Bulk Actions
 *
 * @package     Directorist_Bulk_Actions
 * @since       1.0
 */

// Exit if accessed directly.
defined('ABSPATH') || die('Direct access is not allowed.');

if (! class_exists('DBA_Listing_Count')):

    /**
     * Class DBA_Delete_Listings
     */
    class DBA_Listing_Count
    {

        /**
         * DBA_Delete_Listings Constructor
         */
        public function __construct()
        {
            add_action('rest_api_init', [$this, 'listing_count_api']);
        }

        // WordPress: functions.php or plugin file
        public function listing_count_api()
        {
            register_rest_route('directorist_bulk_actions/v1', '/listing/count', [
                'methods'  => 'POST',
                'callback' => [$this, 'listing_count'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]);
        }


        public function listing_count(\WP_REST_Request $request)
        {

            $category = $request->get_param('category') ? $request->get_param('category') : [];
            $directory_types = $request->get_param('directory_types') ? $request->get_param('directory_types') : [];
            $users = $request->get_param('users') ? $this->extract_values($request->get_param('users')) : [];
            $status = $request->get_param('status') ? $this->extract_values($request->get_param('status')) : 'any';

            $directory_types = is_array($directory_types) && count($directory_types) > 0 ? $this->extract_values($directory_types) : [];
            $category = is_array($category) && count($category) > 0 ? $this->extract_values($category) : [];

            //file_put_contents(__DIR__ . '/log.json', json_encode($request->get_param('users')));

            $args = [
                'post_type'   => ATBDP_POST_TYPE,
                'post_status' => $status,
                'numberposts' => -1,
                'fields'      => 'ids',
            ];

            // Initialize taxonomy query array
            $tax_query = [];

            // Add category taxonomy query if $category is not empty
            if (! empty($category) && is_array($category)) {
                $tax_query[] = [
                    'taxonomy' => ATBDP_CATEGORY,
                    'field'    => is_numeric($category[0]) ? 'term_id' : 'slug', // detect type dynamically
                    'terms'    => $category,
                    'operator' => 'IN',
                ];
            }

            // Add location taxonomy query if $location is not empty
            if (! empty($directory_types) && is_array($directory_types)) {
                $tax_query[] = [
                    'taxonomy' => ATBDP_DIRECTORY_TYPE,
                    'field'    => is_numeric($directory_types[0]) ? 'term_id' : 'slug',
                    'terms'    => $directory_types,
                    'operator' => 'IN',
                ];
            }

            // Only add tax_query to args if we have any taxonomy conditions
            if (! empty($tax_query)) {
                // If more than one taxonomy filter, relation should be 'AND' (default)
                $tax_query['relation'] = 'AND';
                $args['tax_query'] = $tax_query;
            }

            // Add author query if $users is not empty
            if (! empty($users) && is_array($users)) {
                $args['author__in'] = $users;
            }

            $posts = get_posts($args);

            if ($posts && count($posts) > 0) {

                return rest_ensure_response([
                    'message' => 'Listings Deleted Successfully!',
                    'status'  => 'success',
                    'count'   => count($posts),
                ]);

            } else {
                return rest_ensure_response([
                    'message' => 'Could not find any listings!',
                    'status'  => 'none',
                    'count'   => 0,
                ]);
            }

        }

        public function extract_values(array $items, string $key = 'value'): array
        {
            return array_column($items, $key);
        }
    }

    new DBA_Listing_Count();

endif;