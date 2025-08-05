<?php

/**
 * Directorist_Bulk_Actions DBA_Run_Update
 *
 * This class is for Admin Page of the Directorist Bulk Actions
 *
 * @package     Directorist_Bulk_Actions
 * @since       1.0
 */

// Exit if accessed directly.
defined('ABSPATH') || die('Direct access is not allowed.');

if (! class_exists('DBA_Run_Update')):

    /**
     * Class DBA_Run_Update
     */
    class DBA_Run_Update
    {

        /**
         * DBA_Run_Update Constructor
         */
        public function __construct()
        {
            add_action('rest_api_init', [$this, 'run_update_api']);
        }

        // WordPress: functions.php or plugin file
        public function run_update_api()
        {
            register_rest_route('directorist_bulk_actions/v1', '/run/update', [
                'methods'  => 'POST',
                'callback' => [$this, 'run_update_loop'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]);
        }


        public function run_update_loop(\WP_REST_Request $request)
        {

            $offset = $request->get_param('offset') ? $request->get_param('offset') : 0;
            $limit = $request->get_param('limit') ? $request->get_param('limit') : 5;

            $count = 0;
            $updated = [];

            $posts = get_posts([
                'post_type'      => ATBDP_POST_TYPE,
                'post_status'    => ['publish', 'private', 'draft', 'expired'],
                'numberposts'    => $limit,
                'fields'         => 'ids',
                'offset'         => $offset,
            ]);

            if ($posts && count($posts) > 0) {
                foreach ($posts as $post) {
                    // Update Loop
                    do_action( 'directorist_bulk_actions_run_update_loop', $post );

                    //Counter
                    $count++;
                    $updated[]=$post;
                }

                $offset = $offset + $count;

                return rest_ensure_response([
                    'message' => 'Listing Updated Successfully!',
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

    }

    new DBA_Run_Update();

endif;
