<?php

/**
 * A module for rendering reusable blocks.
 *
 * @since 2.6
 */
class FLReusableBlockModule extends FLBuilderModule {

	/**
	 * @since 2.6
	 * @return void
	 */
	public function __construct() {
		parent::__construct( array(
			'name'            => __( 'WordPress Pattern', 'fl-builder' ),
			'description'     => __( 'Display a WordPress Pattern.', 'fl-builder' ),
			'group'           => __( 'WordPress Patterns', 'fl-builder' ),
			'category'        => __( 'WordPress Patterns', 'fl-builder' ),
			'icon'            => 'layout.svg',
			'editor_export'   => true,
			'partial_refresh' => true,
			'enabled'         => false, // We use aliases instead.
		) );
	}

	/**
	 * Returns options for the block select setting.
	 *
	 * @since 2.6
	 * @return array
	 */
	static public function get_options() {
		$posts = get_posts( array(
			'post_type'      => 'wp_block',
			'orderby'        => 'menu_order title',
			'order'          => 'ASC',
			'posts_per_page' => '-1',
		) );

		if ( count( $posts ) ) {
			$blocks = array( __( 'Choose...', 'fl-builder' ) );
		} else {
			$blocks = array( __( 'No WordPress Patterns found!', 'fl-builder' ) );
		}

		foreach ( $posts as $post ) {
			$blocks[ "block-{$post->ID}" ] = $post->post_title;
		}

		return $blocks;
	}
}

/**
 * Register the module and its form settings.
 */
FLBuilder::register_module( 'FLReusableBlockModule', array(
	'general' => array(
		'title'    => __( 'General', 'fl-builder' ),
		'sections' => array(
			'general' => array(
				'title'  => '',
				'fields' => array(
					'block_id' => array(
						'type'    => 'select',
						'label'   => __( 'WordPress Pattern', 'fl-builder' ),
						'options' => 'FLReusableBlockModule::get_options',
					),
				),
			),
		),
	),
) );

/**
 * Register module aliases for each WordPress Pattern (formerly called Reusable Block) in the
 * WordPress Patterns group so they can be dragged in like modules.
 */
function fl_register_reusable_block_aliases() {
	if ( ! FLBuilderModel::is_builder_active() ) {
		return;
	}

	$posts = get_posts( array(
		'post_type'      => 'wp_block',
		'orderby'        => 'menu_order title',
		'order'          => 'ASC',
		'posts_per_page' => '-1',
	) );

	foreach ( $posts as $post ) {
		FLBuilder::register_module_alias( 'fl-reusable-block-' . $post->ID, array(
			'module'      => 'reusable-block',
			'name'        => $post->post_title,
			'description' => __( 'Display a WordPress Pattern.', 'fl-builder' ),
			'group'       => __( 'WordPress Patterns', 'fl-builder' ),
			'category'    => __( 'WordPress Patterns', 'fl-builder' ),
			'icon'        => 'layout.svg',
			'settings'    => array(
				'block_id' => "block-{$post->ID}",
			),
		) );
	}
}

add_action( 'wp', 'fl_register_reusable_block_aliases', 1 );
