<?php

class FLACFBlockModule extends FLBuilderModule {

	/**
	 * @return void
	 */
	public function __construct() {
		parent::__construct( array(
			'name'            => __( 'ACF Block', 'fl-builder' ),
			'description'     => __( 'Display an ACF block.', 'fl-builder' ),
			'group'           => __( 'ACF Blocks', 'fl-builder' ),
			'category'        => __( 'ACF Blocks', 'fl-builder' ),
			'icon'            => 'layout.svg',
			'editor_export'   => true,
			'partial_refresh' => true,
			'enabled'         => false, // We use aliases instead.
		) );
	}

	/**
	 * Checks if the module should be registered.
	 *
	 * @return bool
	 */
	static public function should_register() {
		if ( ! function_exists( 'acf_get_block_types' ) ) {
			return false;
		} elseif ( FLACFBlockModule::is_disabled() ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if ACF blocks are disabled in the builder UI.
	 *
	 * @return bool
	 */
	static public function is_disabled() {
		return apply_filters( 'fl_disable_acf_blocks', false );
	}

	/**
	 * Checks to see if a block is enabled for the current post type.
	 *
	 * @return bool
	 */
	static public function is_block_enabled_for_post_type( $block ) {
		$post_types = $block['post_types'];
		$post_type  = get_post_type();

		if ( ! empty( $post_types ) && ! in_array( $post_type, $post_types ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get an array of ACF block types to use in BB.
	 *
	 * @return array
	 */
	static public function get_block_types() {
		$supported_blocks = array();
		$blocks           = acf_get_block_types();

		foreach ( $blocks as $key => $block ) {

			// Make sure the block is enabled for this post type.
			if ( ! self::is_block_enabled_for_post_type( $block ) ) {
				continue;
			}

			// We can't support inner blocks.
			if ( isset( $block['supports']['jsx'] ) && $block['supports']['jsx'] ) {
				continue;
			}

			$supported_blocks[ $key ] = $block;
		}

		return $supported_blocks;
	}

	/**
	 * Get the module group to use in BB for this block if set.
	 *
	 * @param array $block The block settings.
	 * @return string|null
	 */
	static public function get_block_group( $block ) {
		if ( isset( $block['beaver_builder'] ) && isset( $block['beaver_builder']['group'] ) ) {
			return $block['beaver_builder']['group'];
		}

		return null;
	}

	/**
	 * Get the block category title to use in BB.
	 *
	 * @param string $slug The block category slug.
	 * @return string
	 */
	static public function get_block_category( $slug ) {
		$post       = get_post();
		$categories = get_block_categories( $post );

		foreach ( $categories as $category ) {
			if ( $category['slug'] === $slug ) {
				return $category['title'];
			}
		}

		return __( 'ACF Blocks', 'fl-builder' );
	}

	/**
	 * Get the block icon to use in BB.
	 *
	 * @param string|array $icon The block icon slug or inline svg.
	 * @return string
	 */
	static public function get_block_icon( $icon ) {
		if ( is_array( $icon ) && isset( $icon['src'] ) ) {
			return $icon['src'];
		}

		return $icon;
	}

	/**
	 * Get the ACF block data for rendering the block and settings.
	 *
	 * @param string $id The node ID to use for this block.
	 * @param string $settings The node settings to use for this block.
	 * @return string
	 */
	static public function get_block_data( $id, $settings ) {
		$id = acf_ensure_block_id_prefix( $id );

		$context = array(
			'postId'   => get_the_ID(),
			'postType' => get_post_type(),
		);

		$block = array(
			'id'           => $id,
			'name'         => $settings->acf_block_type,
			'data'         => acf_setup_meta( $settings->acf, $id, true ),
			'mode'         => 'preview',
			'_acf_context' => $context,
		);

		// Load field defaults if we don't have any data yet.
		if ( empty( $block['data'] ) ) {
			$fields = acf_get_block_fields( $block );
			foreach ( $fields as $field ) {
				$block['data'][ "_{$field['name']}" ] = $field['key'];
			}
		}

		return acf_prepare_block( $block );
	}
}

/**
 * Register the module and its settings form.
 */
function fl_register_acf_block_module() {
	if ( ! FLACFBlockModule::should_register() ) {
		return;
	}

	FLBuilder::register_module( 'FLACFBlockModule', array(
		'settings' => array(
			'title' => __( 'Settings', 'fl-builder' ),
			'file'  => FL_BUILDER_DIR . 'modules/acf-block/includes/settings.php',
		),
	) );
}

add_action( 'init', 'fl_register_acf_block_module' );

/**
 * Check block.json for any Beaver Builder specific settings.
 */
function fl_handle_json_block_registration( $settings, $metadata ) {
	if ( ! isset( $metadata['beaverBuilder'] ) ) {
		return $settings;
	}

	$settings['beaver_builder'] = $metadata['beaverBuilder'];

	return $settings;
}

add_filter( 'block_type_metadata_settings', 'fl_handle_json_block_registration', 10, 2 );

/**
 * Register module aliases for each ACF block so they
 * can be dragged in like modules.
 */
function fl_register_acf_block_aliases() {
	if ( ! FLACFBlockModule::should_register() || ! FLBuilderModel::is_builder_active() ) {
		return;
	}

	$blocks = FLACFBlockModule::get_block_types();

	foreach ( $blocks as $key => $block ) {

		$slug = str_replace( '/', '-', $key );

		FLBuilder::register_module_alias( 'fl-' . $slug, array(
			'module'      => 'acf-block',
			'name'        => $block['title'],
			'description' => $block['description'],
			'group'       => FLACFBlockModule::get_block_group( $block ),
			'category'    => FLACFBlockModule::get_block_category( $block['category'] ),
			'icon'        => FLACFBlockModule::get_block_icon( $block['icon'] ),
			'settings'    => array(
				'acf_block_type' => $key,
				'acf'            => array(),
				'node_label'     => $block['title'],
			),
		) );
	}
}

add_action( 'wp', 'fl_register_acf_block_aliases', 1 );

/**
 * Render the ACF blocks head.
 */
function fl_render_acf_blocks_head() {
	if ( ! FLACFBlockModule::should_register() || ! FLBuilderModel::is_builder_active() ) {
		return;
	}

	$blocks = FLACFBlockModule::get_block_types();

	if ( empty( $blocks ) ) {
		return;
	}

	acf_form_head();
}

add_action( 'wp_head', 'fl_render_acf_blocks_head' );
