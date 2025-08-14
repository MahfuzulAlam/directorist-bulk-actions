<?php

/**
 * Directorist_Bulk_Actions DBA_Delete_Listings
 *
 * This class is for Admin Page of the Directorist Bulk Actions
 *
 * @package     Directorist_Bulk_Actions
 * @since       1.0
 */

// Exit if accessed directly.
defined('ABSPATH') || die('Direct access is not allowed.');

if (! class_exists('DBA_Delete_Listings')):

    /**
     * Class DBA_Delete_Listings
     */
    class DBA_Delete_Listings
    {

        /**
         * DBA_Delete_Listings Constructor
         */
        public function __construct()
        {
            add_action('rest_api_init', [$this, 'delete_listings_api']);
        }

        // WordPress: functions.php or plugin file
        public function delete_listings_api()
        {
            register_rest_route('directorist_bulk_actions/v1', '/delete/listings', [
                'methods'  => 'POST',
                'callback' => [$this, 'delete_listings'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]);
        }


        public function delete_listings(\WP_REST_Request $request)
        {

            $offset = $request->get_param('offset') ? $request->get_param('offset') : 0;
            $limit = $request->get_param('limit') ? $request->get_param('limit') : 5;

            $category = $request->get_param('category') ? $request->get_param('category') : [];
            $location = $request->get_param('location') ? $request->get_param('location') : [];
            $metas = $request->get_param('metas') ? $request->get_param('metas') : [];
            $media = $request->get_param('media') ? $request->get_param('media') : [];
            $directory_types = $request->get_param('directory_types') ? $request->get_param('directory_types') : [];
            $type = $request->get_param('type') ? $request->get_param('type') : 'trash';

            $directory_types = is_array( $directory_types ) && count( $directory_types ) > 0 ? $this->extract_values( $directory_types ): [];
            $category = is_array( $category ) && count( $category ) > 0 ? $this->extract_values( $category ): [];

            file_put_contents( __DIR__ . '/log.json', json_encode( [$metas['deleteType'], $media] ) );

            $count = 0;
            $updated = [];
            $address_missing = 0;

            $args = [
                'post_type'   => ATBDP_POST_TYPE,
                'post_status' => ['publish', 'private', 'draft', 'expired'],
                'numberposts' => $limit,
                'fields'      => 'ids',
                'offset'      => $offset,
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
            if (! empty($location) && is_array($location)) {
                $tax_query[] = [
                    'taxonomy' => ATBDP_LOCATION,
                    'field'    => is_numeric($location[0]) ? 'term_id' : 'slug',
                    'terms'    => $location,
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


            $posts = get_posts($args);

            if ($posts && count($posts) > 0) {
                foreach ($posts as $post) {

                    $is_deleted = true;

                    // Delete media files
                    if( isset($media['featured']) && $media['featured'] == true){
                        //$this->delete_featured_image_by_meta($post);
                    }

                    if( isset($media['gallery']) && $media['gallery'] == true){
                        //$this->delete_gallery_images_by_meta($post);
                    }

                    // Delete Postmeta
                    if( isset( $metas['deleteType'] ) ){
                        if( $metas['deleteType'] == 'all' ){
                            //$this->delete_all_post_metas( $post );
                        }
                    }

                    // Delete Listing
                    //if( $type == 'trash' ) $is_deleted = $this->trash_listing($post);
                    //if( $type == 'permanent' ) $is_deleted = $this->delete_listing_permanently($post);
                    
                    if ($is_deleted) $updated[] = $post;

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
                    'updated'   => $args,
                ]);
            } else {
                return rest_ensure_response([
                    'message' => 'The process has been completed Successfully!',
                    'status'  => 'completed',
                ]);
            }
        }

        /**
         * Trash a post
         */
        public function trash_listing($listing_id)
        {
            $result = wp_trash_post($listing_id);

            if (! is_wp_error($result)) {
                return true; // Successfully moved to trash
            }

            return false; // Failed, WP_Error returned
        }

        public function delete_listing_permanently($listing_id, $meta_delete = false)
        {
            $result = wp_delete_post($listing_id, $meta_delete); // true = force delete

            if (! is_wp_error($result) && $result !== false) {
                return true; // Successfully deleted
            }

            return false; // Failed
        }

        public function delete_all_post_metas( $listing_id )
        {
            // Extra cleanup: delete all post meta
            global $wpdb;
            $wpdb->delete($wpdb->postmeta, array('post_id' => $listing_id));
        }

        public function delete_featured_image_by_meta($listing_id)
        {
            // Get the attachment ID from the meta field '_prv_image'
            $attachment_id = get_post_meta($listing_id, '_listing_prv_img', true);

            if (! empty($attachment_id) && get_post_type($attachment_id) === 'attachment') {
                // Delete the attachment permanently (force delete)
                $deleted = wp_delete_attachment($attachment_id, true);

                if ($deleted) {
                    // Optionally, delete the meta key after deleting the attachment
                    delete_post_meta($listing_id, '_listing_prv_img');
                    return true;
                }
            }

            return false; // No attachment found or deletion failed
        }

        public function delete_gallery_images_by_meta($listing_id)
        {
            $attachment_ids = get_post_meta($listing_id, '_listing_img', true);

            if (! empty($attachment_ids) && is_array($attachment_ids)) {
                $all_deleted = true;

                foreach ($attachment_ids as $attachment_id) {
                    if (get_post_type($attachment_id) === 'attachment') {
                        $deleted = wp_delete_attachment($attachment_id, true);
                        if (! $deleted) {
                            $all_deleted = false; // Track if any deletion fails
                        }
                    }
                }

                // Optionally delete the meta key after deleting attachments
                delete_post_meta($listing_id, '_listing_img');

                return $all_deleted;
            }

            return false; // No gallery images found or invalid format
        }

        public function extract_values(array $items, string $key = 'value'): array {
            return array_column($items, $key);
        }
    }

    new DBA_Delete_Listings();

endif;
