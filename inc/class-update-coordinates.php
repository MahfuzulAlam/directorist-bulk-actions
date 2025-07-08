<?php

/**
 * Directorist_Bulk_Actions DBA_Update_Coordinates
 *
 * This class is for Admin Page of the Directorist Bulk Actions
 *
 * @package     Directorist_Bulk_Actions
 * @since       1.0
 */

// Exit if accessed directly.
defined('ABSPATH') || die('Direct access is not allowed.');

if (! class_exists('DBA_Update_Coordinates')):

    /**
     * Class DBA_Update_Coordinates
     */
    class DBA_Update_Coordinates
    {

        /**
         * DBA_Update_Coordinates Constructor
         */
        public function __construct()
        {
            add_action('rest_api_init', [$this, 'update_coordinates_api']);
        }

        // WordPress: functions.php or plugin file
        public function update_coordinates_api()
        {
            register_rest_route('directorist_bulk_actions/v1', '/update/coordinates', [
                'methods'  => 'POST',
                'callback' => [$this, 'update_coordinates'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]);
        }


        public function update_coordinates(\WP_REST_Request $request)
        {

            $offset = $request->get_param('offset') ? $request->get_param('offset') : 0;
            $limit = $request->get_param('limit') ? $request->get_param('limit') : 5;

            $api_key = get_directorist_option('map_api_key', '');
            if (empty($api_key)) {
                return new WP_REST_Response([
                    'status'  => 'error',
                    'message' => 'Google Map API key does not exists!',
                ], 403);
            }

            $count = 0;
            $updated = [];
            $address_missing = 0;

            $posts = get_posts([
                'post_type'      => ATBDP_POST_TYPE,
                //'post_status'    => ['draft'],
                'post_status'    => ['publish', 'private', 'draft'],
                'numberposts'    => $limit,
                'fields'         => 'ids',
                'offset'         => $offset,
            ]);

            if ($posts && count($posts) > 0) {
                foreach ($posts as $post) {
                    // Update Coordinates
                    $address = get_post_meta($post, '_address', true);
                    if ($address) {
                        $is_updated = $this->get_lat_lng_from_address($address, $post);
                        if ($is_updated) $updated[] = $post;
                    }

                    //Counter
                    $count++;
                }

                //$url = directorist_removeUrlParameters( atbdp_get_current_url() );

                //e_var_dump( [ $offset, $number ] );
                $offset = $offset + $count;

                return rest_ensure_response([
                    'message' => 'Coordinates Updated Successfully!',
                    'status'  => 'success',
                    'offset' => $offset,
                    'posts' => $posts,
                    'updated'   => $updated,
                ]);
            } else {
                return rest_ensure_response([
                    'message' => 'The process has been completed Successfully!',
                    'status'  => 'success',
                ]);
            }
        }

        public function get_lat_lng_from_address($address, $listing_id = 0)
        {

            $api_key = get_directorist_option('map_api_key', 'AIzaSyCwxELCisw4mYqSv_cBfgOahfrPFjjQLLo'); // Replace with your actual Google API key
            $address = urlencode($address);

            $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$address}&key={$api_key}";

            $response = wp_remote_get($url);

            if (is_wp_error($response)) {
                return false;
            }

            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body);

            if ($data->status === 'OK') {
                $location = $data->results[0]->geometry->location;
                // e_var_dump(  [
                // 	'lat' => $location->lat,
                // 	'lng' => $location->lng,
                // ] );
                if ($location) {
                    update_post_meta($listing_id, '_manual_lat', $location->lat);
                    update_post_meta($listing_id, '_manual_lng', $location->lng);
                }

                return true;
            }

            return false;
        }
    }

    new DBA_Update_Coordinates();

endif;
