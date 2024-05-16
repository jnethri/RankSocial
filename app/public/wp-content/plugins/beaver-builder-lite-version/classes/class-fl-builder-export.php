<?php

/**
 * Custom export handling.
 *
 * @since 1.8
 */
final class FLBuilderExport {

	/**
	 * @since 1.8
	 * @return void
	 */
	static public function init() {
		add_action( 'admin_enqueue_scripts', 'FLBuilderExport::enqueue_scripts' );
		add_action( 'export_filters', 'FLBuilderExport::filters' );
		add_action( 'wp_ajax_fl_builder_export_templates_data', 'FLBuilderExport::templates_data' );
		add_action( 'export_wp', 'FLBuilderExport::export' );
		add_filter( 'wxr_export_skip_postmeta', 'FLBuilderExport::wxr_filter_postmeta', 10, 2 );
	}

	/**
	 * Enqueues the export scripts and styles.
	 *
	 * @since 1.8
	 * @return void
	 */
	static public function enqueue_scripts() {
		global $pagenow;

		if ( 'export.php' != $pagenow ) {
			return;
		}

		wp_enqueue_style( 'fl-builder-export', FLBuilder::plugin_url() . 'css/fl-builder-export.css', array(), FL_BUILDER_VERSION );
		wp_enqueue_script( 'fl-builder-export', FLBuilder::plugin_url() . 'js/fl-builder-export.js', array(), FL_BUILDER_VERSION, true );

		wp_localize_script( 'fl-builder-export', 'fl_builder_export_nonce', array( 'nonce' => wp_create_nonce( 'fl_builder_export_nonce' ) ) );
	}

	/**
	 * Renders the export filters markup.
	 *
	 * @since 1.8
	 * @return void
	 */
	static public function filters() {
		include FL_BUILDER_DIR . 'includes/export-filters.php';
	}

	/**
	 * Called via AJAX and returns the data used for selecting
	 * templates for export.
	 *
	 * @since 1.8
	 * @return void
	 */
	static public function templates_data() {

		check_admin_referer( 'fl_builder_export_nonce' );

		$type  = isset( $_POST['type'] ) ? sanitize_text_field( $_POST['type'] ) : 'fl-builder-template';
		$data  = array();
		$query = new WP_Query( array(
			'post_type'      => $type,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'posts_per_page' => '-1',
		) );

		foreach ( $query->posts as $post ) {
			$data[] = array(
				'id'    => $post->ID,
				'title' => $post->post_title,
			);
		}

		echo FLBuilderUtils::json_encode( $data );

		die();
	}

	/**
	 * Download the export file.
	 *
	 * @since 1.8
	 * @param array $args
	 * @return void
	 */
	static public function export( $args ) {
		/**
		 * Allowed types for export
		 * @see fl_builder_export_allowed_post_types
		 */
		$allowed_types = apply_filters( 'fl_builder_export_allowed_post_types', array(
			'fl-builder-template',
			'fl-theme-layout',
		) );

		if ( ! current_user_can( 'export' ) ) {
			return;
		}
		if ( ! in_array( $args['content'], $allowed_types, true ) ) {
			return;
		}
		if ( ! isset( $_REQUEST['fl-builder-template-export-select'] ) ) {
			return;
		}
		if ( 'all' == $_REQUEST['fl-builder-template-export-select'] ) {
			return;
		}
		if ( ! is_array( $_REQUEST['fl-builder-export-template'] ) ) {
			return;
		}

		require_once FL_BUILDER_DIR . 'includes/export.php';

		fl_export_wp( $_REQUEST['fl-builder-export-template'] );

		die();
	}

	/**
	 *
	 * @param bool   $return_me
	 * @param string $meta_key
	 * @return bool
	 */
	static public function wxr_filter_postmeta( $return_me, $meta_key ) {
		if ( '_edit_lock' == $meta_key ) {
			$return_me = true;
		}
		if ( false !== strpos( $meta_key, '_fl_builder_history' ) ) {
			$return_me = true;
		}
		return $return_me;
	}
}

FLBuilderExport::init();
