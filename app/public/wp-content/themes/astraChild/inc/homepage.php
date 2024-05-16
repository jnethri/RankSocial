<?php

function foobar_func( $atts ){
	echo do_shortcode('[smartslider3 slider="2"]');
}

add_shortcode( 'foobar', 'foobar_func' );

?>