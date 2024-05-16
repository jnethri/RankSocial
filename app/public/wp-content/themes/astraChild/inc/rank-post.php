<?php
    function rankPost_func( $atts ){
        if( isset( $_POST['ranking'] ) ){ 
            if ( !metadata_exists( 'user',  get_current_user_id(), $_POST['ranking'][0] ) ) {
                add_user_meta( get_current_user_id(), $_POST['ranking'][0], $_POST['ranking'][1] );
            } else {
                update_user_meta( get_current_user_id(), $_POST['ranking'][0], $_POST['ranking'][1] );
            }
        }
    }

    add_shortcode( 'rankPost', 'rankPost_func' );
?>