var FLBuilderLayoutConfig = {
	anchorLinkAnimations : {
		duration 	: 1000,
		easing		: 'swing',
		offset 		: 100
	},
	paths : {
		pluginUrl : '<?php echo FLBuilder::plugin_url(); ?>',
		wpAjaxUrl : '<?php echo admin_url( 'admin-ajax.php' ); ?>'
	},
	breakpoints : {
		small  : <?php echo FLBuilderUtils::sanitize_number( $global_settings->responsive_breakpoint ); ?>,
		medium : <?php echo FLBuilderUtils::sanitize_number( $global_settings->medium_breakpoint ); ?>,
		large : <?php echo FLBuilderUtils::sanitize_number( $global_settings->large_breakpoint ); ?>
	},
	waypoint: {
		offset: 80
	}
};
