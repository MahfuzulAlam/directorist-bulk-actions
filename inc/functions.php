<?php

/**
 * Directorist_Bulk_Actions Functions
 */

/**
 * Get Template
 */
if( ! function_exists( 'dba_get_template' ) )
{
    function dba_get_template($template_file, $args = array())
    {
        if (is_array($args)) {
            extract($args);
        }
        $data = $args;

        if (isset($args['form'])) $listing_form = $args['form'];

        $file = DIRECTORIST_BULK_ACTIONS_DIR . 'templates/' . $template_file . '.php';

        if ( dba_template_exists( $template_file ) ) {
            include $file;
        }
    }
}

/**
 * Template Exists
 */
if( ! function_exists( 'dba_template_exists' ) )
{
    function dba_template_exists($template_file)
    {
        $file = DIRECTORIST_BULK_ACTIONS_DIR . 'templates/' . $template_file . '.php';

        if (file_exists($file)) {
            return true;
        } else {
            return false;
        }
    }
}



/**
 * API
 */
add_action( 'rest_api_init', function () {
    register_rest_route( 'directorist_bulk_actions/v1', '/update/coordinate', [
        'methods'  => 'POST',
        'callback' => 'dba_update_coordinate',
        'permission_callback' => '__return_true'
        // 'permission_callback' => function () {
        //     return current_user_can( 'manage_options' ); // admin only
        // }
    ] );
} );

function dba_update_coordinate( $request ) {

    $offset = $request->get_param( 'offset' ) ? $request->get_param( 'offset' ): 0;
    $limit = $request->get_param( 'limit' ) ? $request->get_param( 'limit' ): 5;
    $nonce = $request->get_header( 'x_wp_nonce' ) ? $request->get_header( 'x_wp_nonce' ): '';

    if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
        return new WP_REST_Response([
            'status'  => 'error',
            'message' => 'Invalid nonce',
        ], 403 );
    }

    $api_key = get_directorist_option( 'map_api_key', '' );
    if ( empty( $api_key ) ) {
        return new WP_REST_Response([
            'status'  => 'error',
            'message' => 'Invalid API key',
        ], 403 );
    }

    $count = 0;
    $updated = [];

    $posts = get_posts( [
        'post_type'      => ATBDP_POST_TYPE,
        'post_status'    => [ 'publish', 'private', 'draft' ],
        'numberposts'    => $limit,
        'fields'         => 'ids',
		'offset'		 => $offset,
    ] );

	if( $posts && count( $posts ) > 0 )
	{
		foreach( $posts as $post )
		{
			// Update Coordinates
			$address = get_post_meta( $post, '_address', true );
			$is_updated = directorist_get_lat_lng_from_address( $address, $post );

            if( $is_updated ) $updated[] = $post;

            //Counter
            $count++;
		}

		//$url = directorist_removeUrlParameters( atbdp_get_current_url() );
        
        //e_var_dump( [ $offset, $number ] );
        $offset = $offset + $count;

        return rest_ensure_response( [
            'message' => 'Coordinates Updated Successfully!',
            'status'  => 'success',
            'offset' => $offset,
            'posts' => $posts,
            'updated'   => $updated,
        ] );
	}

    return rest_ensure_response( [
        'message' => 'Coordinates Update Failed!',
        'status'  => 'error',
        'offset' => $offset,
        'posts' => $posts,
        'udpated' => $updated,
    ] );
}

if( ! function_exists( 'directorist_get_lat_lng_from_address' ) ){
	function directorist_get_lat_lng_from_address( $address, $listing_id = 0 ) {

		$api_key = get_directorist_option( 'map_api_key', 'AIzaSyCwxELCisw4mYqSv_cBfgOahfrPFjjQLLo' ); // Replace with your actual Google API key
		$address = urlencode( $address );

		$url = "https://maps.googleapis.com/maps/api/geocode/json?address={$address}&key={$api_key}";

		$response = wp_remote_get( $url );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body );

		if ( $data->status === 'OK' ) {
			$location = $data->results[0]->geometry->location;
			// e_var_dump(  [
			// 	'lat' => $location->lat,
			// 	'lng' => $location->lng,
			// ] );
			if( $location ){
				update_post_meta( $listing_id, '_manual_lat', $location->lat );
				update_post_meta( $listing_id, '_manual_lng', $location->lng );
			}

            return true;
		}

        return false;
	}
}