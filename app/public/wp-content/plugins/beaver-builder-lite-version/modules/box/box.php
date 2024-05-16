<?php

class FLBuilderBoxModule extends FLBuilderModule {

	public function __construct() {
		global $wp_version;
		parent::__construct( [
			'name'            => __( 'Box', 'fl-builder' ),
			'description'     => __( 'A simple layout container', 'fl-builder' ),
			'category'        => __( 'Box', 'fl-builder' ),
			'icon'            => 'layout.svg',
			'partial_refresh' => true,
			'include_wrapper' => false,
			'accepts'         => 'all',
			'enabled'         => version_compare( $wp_version, '5.2', '>=' ) && ! function_exists( 'classicpress_version' ),
		] );

		// Register custom fields.
		add_filter( 'fl_builder_custom_fields', __CLASS__ . '::get_custom_field_types' );
	}

	/**
	 * Filter the attributes of the root HTML element.
	 *
	 * @param Array $attrs
	 * @return Array
	 */
	public function filter_attributes( $attrs = [] ) {

		// Support link field attributes
		if ( '' !== $this->settings->link ) {
			$attrs['href'] = esc_url( $this->settings->link );

			if ( isset( $this->settings->link_target ) ) {
				$attrs['target'] = esc_attr( $this->settings->link_target );
			}
			$rel = $this->get_rel_attr( 'link' );
			if ( '' !== $rel ) {
				$attrs['rel'] = esc_attr( $rel );
			}
		}
		return $attrs;
	}

	public function get_rel_attr( $setting_name = 'link' ) {
		$rel = array();
		if ( '_blank' == $this->settings->{"{$setting_name}_target"} ) {
			$rel[] = 'noopener';
		}
		if ( isset( $this->settings->{"{$setting_name}_nofollow"} ) &&
			'yes' == $this->settings->{"{$setting_name}_nofollow"}
		) {
			$rel[] = 'nofollow';
		}
		$rel = implode( ' ', $rel );
		return $rel;
	}

	/**
	 * Render the tag for a non-wrapped module.
	 */
	public function tag( $tag = 'div' ) {

		// Check advanced container setting
		if ( '' !== $this->settings->container_element ) {
			$tag = $this->settings->container_element;
		}

		// Link support
		if ( '' !== $this->settings->link ) {
			$tag = 'a';
		}

		echo $tag;
	}

	static public function child_selector() {
		return ':where( .fl-node-{node_id} > :not( .fl-block-overlay, .fl-drop-target ) )';
	}

	/**
	 * Lookup field files in fields directory and register.
	 *
	 * @param Array $fields
	 * @return Array
	 */
	static public function get_custom_field_types( $fields ) {
		$paths = glob( __DIR__ . '/fields/ui-field-*.php' );

		foreach ( $paths as $path ) {
			$slug            = str_replace( array( 'ui-field-', '.php' ), '', basename( $path ) );
			$fields[ $slug ] = $path;
		}
		return $fields;
	}

	static public function get_aspect_ratio_options() {
		return [
			'basics' => [
				'label'   => __( 'Basics', 'fl-builder' ),
				'options' => [
					''    => __( 'None', 'fl-builder' ),
					'1/1' => __( 'Square', 'fl-builder' ),
				],
			],
			'wide'   => [
				'label'   => __( 'Wide', 'fl-builder' ),
				'options' => [
					'5/4'  => __( 'Wide (5:4)', 'fl-builder' ),
					'3/2'  => __( 'Wide (3:2)', 'fl-builder' ),
					'16/9' => __( 'Video (16:9)', 'fl-builder' ),
					'21/9' => __( 'Ultra-wide Video (21:9)', 'fl-builder' ),
				],
			],
			'tall'   => [
				'label'   => __( 'Tall', 'fl-builder' ),
				'options' => [
					'4/5'  => __( 'Tall (4:5)', 'fl-builder' ),
					'2/3'  => __( 'Tall (2:3)', 'fl-builder' ),
					'3/4'  => __( 'Poster (3:4)', 'fl-builder' ),
					'9/16' => __( 'Portrait Video (9:16)', 'fl-builder' ),
				],
			],
		];
	}

	static public function init() {
		if ( FLBuilderUIIFrame::is_enabled() ) {
			add_action( 'fl_builder_ui_enqueue_scripts', __CLASS__ . '::enqueue_custom_elements' );
		} else {
			add_action( 'wp_enqueue_scripts', __CLASS__ . '::enqueue_custom_elements' );
		}
	}

	static public function enqueue_custom_elements() {
		if ( FLBuilderModel::is_builder_active() ) {
			$ver    = FL_BUILDER_VERSION;
			$js_url = FL_BUILDER_URL . 'modules/box/js/custom-elements/';

			wp_enqueue_script( 'fl-base-element', $js_url . 'fl-element.js', [ 'wp-compose' ], $ver );
			wp_enqueue_script( 'fl-menu-element', $js_url . 'fl-menu.js', [ 'fl-base-element' ], $ver );
			wp_enqueue_script( 'fl-stepper-element', $js_url . 'fl-stepper.js', [], $ver );
			wp_enqueue_script( 'fl-grid-area-field-element', $js_url . 'fl-grid-area-field.js', [], $ver );
			wp_enqueue_script( 'fl-layer-group-element', $js_url . 'fl-layer-group.js', [ 'fl-base-element', 'jquery' ], $ver );
			wp_enqueue_script( 'fl-grid-tracklist-element', $js_url . 'fl-grid-tracklist.js', [ 'fl-layer-group-element', 'jquery' ], $ver );
		}
	}
}

FLBuilderBoxModule::init();

/**
 * Register the node and its form settings.
 */
FLBuilder::register_module( 'FLBuilderBoxModule', [
	'general'  => [
		'title'    => __( 'Container', 'fl-builder' ),
		'sections' => [
			'general' => [
				'fields' => [
					'layout'         => [
						'label'       => __( 'Display', 'fl-builder' ),
						'type'        => 'button-group',
						'responsive'  => [
							'default' => [
								'default'    => 'flex',
								'large'      => '',
								'medium'     => '',
								'responsive' => '',
							],
						],
						'fill_space'  => true,
						'appearance'  => 'padded', // Vertical flexbox is default
						'options'     => [
							'flex'    => __( 'Flex', 'fl-builder' ),
							'grid'    => __( 'Grid', 'fl-builder' ),
							'z_stack' => __( 'Layers', 'fl-builder' ),
						],
						'icons'       => [
							'flex'    => '<svg width="24" height="10"><use href="#fl-h-stack-icon" /></svg>',
							'z_stack' => '<svg width="24" height="10"><use href="#fl-z-stack-icon" /></svg>',
							'grid'    => '<svg width="26" height="10"><use href="#fl-grid-display-icon" /></svg>',
						],
						'align_icons' => 'vertical',
						'toggle'      => [
							'grid'    => [
								'fields' => [ 'grid_tracks', 'grid_tracks_v2', 'grid_auto_flow', 'grid_gap', 'child_grid_col', 'child_grid_row' ],
							],
							'z_stack' => [
								'fields' => [ 'child_grid_col', 'child_grid_row' ],
							],
							'flex'    => [
								'fields' => [ 'flex_wrap', 'flex_direction', 'gap', 'child_flex' ],
							],
						],
						'set'         => [
							'grid'    => [
								'x_overflow'     => '',
								'grid_auto_flow' => 'normal',
								'child_grid_col' => [
									'start' => '',
									'span'  => '',
									'end'   => '',
								],
								'child_grid_row' => [
									'start' => '',
									'span'  => '',
									'end'   => '',
								],
							],
							'z_stack' => [
								'grid_auto_flow' => '',
								'place_content'  => [
									'horizontal' => 'stretch',
									'vertical'   => 'stretch',
								],
								'x_overflow'     => '',
								'child_grid_col' => [
									'start' => 1,
									'span'  => '',
									'end'   => -1,
								],
								'child_grid_row' => [
									'start' => 1,
									'span'  => '',
									'end'   => -1,
								],
								'child_z_index'  => '1',
							],
						],
						'preview'     => [
							'type'  => 'css',
							'auto'  => true,
							'rules' => [
								[
									'property'          => 'display',
									'substitute_values' => [
										'z_stack' => 'grid',
									],
								],
							],
						],
					],
					'grid_tracks'    => [
						'label'      => 'Grid',
						'type'       => 'grid-tracklist',
						'responsive' => [
							'default' => [
								'default' => [
									'columns'      => [
										[
											'type'  => 'basic-track',
											'value' => '3',
										],
									],
									'rows'         => [],
									'auto_columns' => [],
									'auto_rows'    => [],
								],
							],
						],
						'preview'    => [
							'type'  => 'css',
							'auto'  => true,
							'rules' => [
								[
									'property'  => 'grid-template-columns',
									'sub_value' => 'columns_css',
									'enabled'   => [
										'layout' => [
											'nearest_value' => 'grid',
										],
									],
								],
								[
									'property'  => 'grid-template-rows',
									'sub_value' => 'rows_css',
									'enabled'   => [
										'layout' => [
											'nearest_value' => 'grid',
										],
									],
								],
								[
									'property'  => 'grid-auto-columns',
									'sub_value' => 'auto_columns_css',
									'enabled'   => [
										'layout' => [
											'nearest_value' => 'grid',
										],
									],
								],
								[
									'property'  => 'grid-auto-rows',
									'sub_value' => 'auto_rows_css',
									'enabled'   => [
										'layout' => [
											'nearest_value' => 'grid',
										],
									],
								],
							],
						],
					],
					'flex_direction' => [
						'label'      => __( 'Direction', 'fl-builder' ),
						'type'       => 'button-group',
						'responsive' => [
							'default' => [
								'default'    => 'row',
								'large'      => '',
								'medium'     => '',
								'responsive' => '',
							],
						],
						'options'    => [
							'row'            => __( 'Row', 'fl-builder' ),
							'column'         => __( 'Column', 'fl-builder' ),
							'row-reverse'    => __( 'Reversed Row', 'fl-builder' ),
							'column-reverse' => __( 'Reversed Column', 'fl-builder' ),
						],
						'preview'    => [
							'type'     => 'css',
							'auto'     => true,
							'property' => 'flex-direction',
						],
					],
					'grid_auto_flow' => [
						'label'      => __( 'Flow Direction', 'fl-builder' ),
						'type'       => 'button-group',
						'fill_space' => true,
						'options'    => [
							'row'    => __( 'Row', 'fl-builder' ),
							'column' => __( 'Column', 'fl-builder' ),
						],
						'icons'      => [
							'row'    => '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3.00633 16.3741C2.80125 16.6475 2.43211 16.6407 2.22703 16.3741L0.777812 14.4532C0.470194 14.043 0.654765 13.544 1.1743 13.544H2.11082V6.44828H1.1743C0.654765 6.44828 0.470194 5.95609 0.777812 5.54593L2.22703 3.6182C2.42527 3.36527 2.80125 3.3516 3.00633 3.6182L4.45555 5.54593C4.77 5.94925 4.58543 6.44828 4.0659 6.44828H3.12937V13.544H4.0659C4.59226 13.544 4.75633 14.0567 4.45555 14.4532L3.00633 16.3741ZM7.46336 5.34085C7.08055 5.34085 6.77293 5.01273 6.77293 4.63675C6.77293 4.25394 7.07371 3.93949 7.46336 3.93949H18.6811C19.0639 3.93949 19.3716 4.25394 19.3716 4.63675C19.3716 5.01956 19.0639 5.34085 18.6811 5.34085H7.46336ZM7.46336 8.92289C7.08055 8.92289 6.77293 8.59476 6.77293 8.21878C6.77293 7.84281 7.07371 7.52152 7.46336 7.52152H18.6811C19.0639 7.52152 19.3716 7.83597 19.3716 8.21878C19.3716 8.6016 19.0639 8.92289 18.6811 8.92289H7.46336ZM7.46336 12.5049C7.08055 12.5049 6.77293 12.1836 6.77293 11.8077C6.77293 11.4248 7.07371 11.1104 7.46336 11.1104H18.6811C19.0639 11.1104 19.3716 11.418 19.3716 11.8077C19.3716 12.1836 19.0639 12.5049 18.6811 12.5049H7.46336ZM7.46336 16.0869C7.08055 16.0869 6.77293 15.7657 6.77293 15.3897C6.77293 15.0069 7.07371 14.6924 7.46336 14.6924H14.3198C14.7095 14.6924 15.0171 15 15.0171 15.3897C15.0171 15.7657 14.7095 16.0869 14.3198 16.0869H7.46336Z" fill="currentColor"/>
							</svg>',

							'column' => '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33839 4.25624C3.07179 4.05116 3.07862 3.68202 3.33839 3.48378L5.25929 2.03456C5.67628 1.72011 6.16847 1.90468 6.16847 2.42421V3.36073H13.8316V2.42421C13.8316 1.90468 14.3306 1.72011 14.7407 2.03456L16.6616 3.48378C16.9214 3.67518 16.9282 4.05116 16.6616 4.25624L14.7407 5.70546C14.3306 6.01991 13.8316 5.83534 13.8316 5.31581V4.37929H6.16847V5.31581C6.16847 5.84218 5.66261 6.00624 5.25929 5.70546L3.33839 4.25624ZM14.6792 8.21425C14.6792 7.83143 15.0005 7.52382 15.3765 7.52382C15.7593 7.52382 16.0737 7.83143 16.0737 8.21425V17.4291C16.0737 17.8187 15.7593 18.1195 15.3765 18.1195C14.9937 18.1195 14.6792 17.8187 14.6792 17.4291V8.21425ZM11.0972 8.21425C11.0972 7.83143 11.4185 7.52382 11.7944 7.52382C12.1773 7.52382 12.4917 7.83143 12.4917 8.21425V17.4291C12.4917 17.8187 12.1773 18.1195 11.7944 18.1195C11.4116 18.1195 11.0972 17.8187 11.0972 17.4291V8.21425ZM7.50831 8.21425C7.50831 7.83143 7.83643 7.52382 8.20557 7.52382C8.58839 7.52382 8.90968 7.83143 8.90968 8.21425V17.4291C8.90968 17.8187 8.59522 18.1195 8.20557 18.1195C7.8296 18.1195 7.50831 17.8187 7.50831 17.4291V8.21425ZM3.92628 8.21425C3.92628 7.83143 4.2544 7.52382 4.62354 7.52382C5.00636 7.52382 5.32081 7.83143 5.32081 8.21425V13.0746C5.32081 13.4642 5.01319 13.765 4.62354 13.765C4.24757 13.765 3.92628 13.4574 3.92628 13.0746V8.21425Z" fill="currentColor"/></svg>',
						],
						'responsive' => [
							'default' => [
								'default'    => 'row',
								'large'      => '',
								'medium'     => '',
								'responsive' => '',
							],
						],
						'preview'    => [
							'type'     => 'css',
							'property' => 'grid-auto-flow',
							'auto'     => true,
							'enabled'  => [
								'layout' => [
									'nearest_value' => [ 'grid', 'z_stack' ],
								],
							],
						],
					],
					'place_content'  => [
						'label'      => __( 'Align', 'fl-builder' ),
						'type'       => 'justify',
						'preset'     => 'v_flex',
						'responsive' => true,
						'preview'    => [
							'type'  => 'css',
							'auto'  => true,
							'rules' => [

								// Vertical Flex
								[
									'property'  => 'justify-content',
									'sub_value' => 'vertical',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'flex' ],
										'flex_direction' => [ 'nearest_value' => [ 'column', 'column-reverse' ] ],
									],
								],
								[
									'property'  => 'align-items',
									'sub_value' => 'horizontal',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'flex' ],
										'flex_direction' => [ 'nearest_value' => [ 'column', 'column-reverse' ] ],
									],
								],

								// Horizontal Flex
								[
									'property'  => 'justify-content',
									'sub_value' => 'horizontal',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'flex' ],
										'flex_direction' => [ 'nearest_value' => [ '', 'row', 'row-reverse' ] ],
									],
								],
								[
									'property'  => 'align-items',
									'sub_value' => 'vertical',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'flex' ],
										'flex_direction' => [ 'nearest_value' => [ '', 'row', 'row-reverse' ] ],
									],
								],

								// Vertical Grid
								[
									'property'  => 'justify-content',
									'sub_value' => 'horizontal',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'grid' ],
										'grid_auto_flow' => [
											'nearest_value' => [ '', 'column', 'dense', 'column dense' ],
										],
									],
								],
								[
									'property'  => 'align-content',
									'sub_value' => 'vertical',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'grid' ],
										'grid_auto_flow' => [
											'nearest_value' => [ '', 'column', 'dense', 'column dense' ],
										],
									],
								],

								// Horizontal Grid
								[
									'property'  => 'justify-content',
									'sub_value' => 'horizontal',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'grid' ],
										'grid_auto_flow' => [
											'nearest_value' => [ 'row', 'row dense' ],
										],
									],
								],
								[
									'property'  => 'align-content',
									'sub_value' => 'vertical',
									'enabled'   => [
										'layout'         => [ 'nearest_value' => 'grid' ],
										'grid_auto_flow' => [
											'nearest_value' => [ 'row', 'row dense' ],
										],
									],
								],

								// Layered Z-Stack Grid
								[
									'property'  => 'justify-items',
									'sub_value' => 'horizontal',
									'enabled'   => [
										'layout' => [ 'nearest_value' => 'z_stack' ],
									],
								],
								[
									'property'  => 'align-items',
									'sub_value' => 'vertical',
									'enabled'   => [
										'layout' => [ 'nearest_value' => 'z_stack' ],
									],
								],
							],
						],
					],
					'flex_wrap'      => [
						'label'       => __( 'Wrap', 'fl-builder' ),
						'type'        => 'button-group',
						'responsive'  => true,
						'allow_empty' => false,
						'fill_space'  => true,
						'options'     => [
							''             => __( 'Normal', 'fl-builder' ),
							'nowrap'       => __( 'No Wrap', 'fl-builder' ),
							'wrap'         => __( 'Wrap', 'fl-builder' ),
							'wrap-reverse' => __( 'Reverse Wrap', 'fl-builder' ),
						],
						'preview'     => [
							'type'     => 'css',
							'property' => 'flex-wrap',
							'auto'     => true,
							'enabled'  => [
								'layout' => [
									'nearest_value' => [ 'flex' ],
								],
							],
						],
					],
				],
			],
			'spacing' => [
				'title'  => __( 'Spacing', 'fl-builder' ),
				'fields' => [
					'gap'      => [
						'label'      => __( 'Gap', 'fl-builder' ),
						'type'       => 'unit',
						'default'    => '10',
						'responsive' => true,
						'units'      => [ 'px', 'em', '%', 'vw', 'vh' ],
						'slider'     => [
							'min' => 0,
							'max' => 100,
						],
						'preview'    => [
							'type'     => 'css',
							'property' => 'gap',
							'auto'     => true,
							'enabled'  => [
								'layout' => [
									'nearest_value' => [ 'flex' ],
								],
							],
						],
					],
					'grid_gap' => [
						'label'      => __( 'Gap', 'fl-builder' ),
						'type'       => 'dimension',
						'keys'       => [
							'row'    => __( 'Row', 'fl-builder' ),
							'column' => __( 'Column', 'fl-builder' ),
						],
						'responsive' => [
							'default'      => [
								'default' => '10',
							],
							'default_unit' => [
								'default' => 'px',
							],
						],
						'units'      => [ 'px', 'em', '%', 'vw', 'vh' ],
						'slider'     => [
							'min' => 0,
							'max' => 100,
						],
						'preview'    => [
							'type'     => 'css',
							'property' => 'gap',
							'auto'     => true,
							'enabled'  => [
								'layout' => [
									'nearest_value' => [ 'grid' ],
								],
							],
						],
					],
					'padding'  => [
						'label'      => __( 'Padding', 'fl-builder' ),
						'type'       => 'dimension',
						'responsive' => true,
						'slider'     => true,
						'units'      => [ 'px', 'em', '%', 'vw', 'vh' ],
						'preview'    => [
							'type'     => 'css',
							'property' => 'padding',
							'auto'     => true,
						],
					],
				],
			],
			'sizing'  => [
				'title'       => __( 'Sizing & Placement', 'fl-builder' ),
				'description' => __( 'These settings allow you to control how this box fits within its parent container.', 'fl-builder' ),
				'collapsed'   => true,
				'fields'      => [

					'aspect_ratio' => [
						'label'      => __( 'Aspect Ratio', 'fl-builder' ),
						'type'       => 'select',
						'options'    => FLBuilderBoxModule::get_aspect_ratio_options(),
						'default'    => '',
						'responsive' => true,
						'preview'    => [
							'type'     => 'css',
							'property' => 'aspect-ratio',
							'auto'     => true,
						],
					],
					'flex'         => [
						'label'      => __( 'Flex', 'fl-builder' ),
						'type'       => 'flex',
						'responsive' => true,
						'preview'    => [
							'type'  => 'css',
							'auto'  => true,
							'rules' => [
								[
									'property'  => 'flex-grow',
									'sub_value' => 'grow',
									'enabled'   => [
										'layout' => [
											'nearest_value' => [ 'flex' ],
										],
									],
								],
								[
									'property'  => 'flex-shrink',
									'sub_value' => 'shrink',
									'enabled'   => [
										'layout' => [
											'nearest_value' => [ 'flex' ],
										],
									],
								],
								[
									'property'  => 'flex-basis',
									'sub_value' => [
										'setting_name' => 'basis',
										'type'         => 'unit',
									],
									'enabled'   => [
										'layout' => [
											'nearest_value' => [ 'flex' ],
										],
									],
								],
							],
						],
					],
					'grid_col'     => [
						'label'      => __( 'Grid Column', 'fl-builder' ),
						'type'       => 'grid-area',
						'responsive' => true,
						'preview'    => [
							'type'      => 'css',
							'property'  => 'grid-column',
							'sub_value' => 'css',
							'auto'      => true,
							'important' => true,
						],
					],
					'grid_row'     => [
						'label'      => __( 'Grid Row', 'fl-builder' ),
						'type'       => 'grid-area',
						'responsive' => true,
						'preview'    => [
							'type'      => 'css',
							'property'  => 'grid-row',
							'sub_value' => 'css',
							'auto'      => true,
							'important' => true,
						],
					],
					'size'         => [
						'label'      => __( 'Width & Height', 'fl-builder' ),
						'type'       => 'size',
						'responsive' => true,
						'preview'    => [
							'type'  => 'css',
							'auto'  => true,
							'rules' => [
								[
									'property'  => 'min-width',
									'sub_value' => [
										'setting_name' => 'min_width',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'width',
									'sub_value' => [
										'setting_name' => 'width',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'max-width',
									'sub_value' => [
										'setting_name' => 'max_width',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'min-height',
									'sub_value' => [
										'setting_name' => 'min_height',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'height',
									'sub_value' => [
										'setting_name' => 'height',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'max-height',
									'sub_value' => [
										'setting_name' => 'max_height',
										'type'         => 'unit',
									],
								],
							],
						],
					],
				],
			],
			'style'   => [
				'title'     => __( 'Appearance', 'fl-builder' ),
				'collapsed' => true,
				'fields'    => [
					'bg_color' => [
						'label'       => __( 'Background Color', 'fl-builder' ),
						'type'        => 'color',
						'responsive'  => true,
						'show_reset'  => true,
						'show_alpha'  => true,
						'connections' => [ 'color' ],
						'preview'     => [
							'type'     => 'css',
							'property' => 'background-color',
							'auto'     => true,
						],
					],
					'color'    => [
						'label'       => __( 'Text Color', 'fl-builder' ),
						'type'        => 'color',
						'responsive'  => true,
						'show_reset'  => true,
						'show_alpha'  => true,
						'connections' => [ 'color' ],
						'preview'     => [
							'type'     => 'css',
							'property' => 'color',
							'auto'     => true,
						],
					],
					'border'   => [
						'label'      => __( 'Border', 'fl-builder' ),
						'type'       => 'border',
						'responsive' => true,
						'preview'    => [
							'type'     => 'css',
							'property' => 'border',
							'auto'     => true,
						],
					],
				],
			],
			'link'    => [
				'title'     => __( 'Linking', 'fl-builder' ),
				'collapsed' => true,
				'fields'    => [
					'link' => [
						'label'         => __( 'Link', 'fl-builder' ),
						'type'          => 'link',
						'placeholder'   => __( 'http://www.example.com', 'fl-builder' ),
						'show_target'   => true,
						'show_nofollow' => true,
						'show_download' => true,
						'connections'   => [ 'url' ],
						'preview'       => [
							'type' => 'none',
						],
						'connections'   => [ 'url' ],
					],
				],
			],
		],
	],
	'children' => [
		'title'       => __( 'Children', 'fl-builder' ),
		'description' => __( 'These settings apply to all direct children of this container.', 'fl-builder' ),
		'sections'    => [
			'child_placement'  => [
				'fields' => [
					'child_flex'     => [
						'label'      => __( 'Grow & Shrink', 'fl-builder' ),
						'type'       => 'flex',
						'help'       => __( 'Children of flex containers can allow themselves to grow or shrink. Zero indicates they cannot grow or shrink beyond their inherent size. 1 or greater determines what portion of the available space (or lack of it) will be allocated to this item.', 'fl-builder' ),
						'responsive' => true,
						'preview'    => [
							'type'  => 'css',
							'auto'  => true,
							'rules' => [
								[
									'property'  => 'flex-grow',
									'sub_value' => 'grow',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'enabled'   => [
										'layout' => [
											'nearest_value' => [ 'flex' ],
										],
									],
								],
								[
									'property'  => 'flex-shrink',
									'sub_value' => 'shrink',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'enabled'   => [
										'layout' => [
											'nearest_value' => [ 'flex' ],
										],
									],
								],
								[
									'property'  => 'flex-basis',
									'sub_value' => [
										'setting_name' => 'basis',
										'type'         => 'unit',
									],
									'selector'  => FLBuilderBoxModule::child_selector(),
									'enabled'   => [
										'layout' => [
											'nearest_value' => [ 'flex' ],
										],
									],
								],
							],
						],
					],
					'child_grid_col' => [
						'label'      => __( 'Grid Column', 'fl-builder' ),
						'type'       => 'grid-area',
						'responsive' => true,
						'preview'    => [
							'type'      => 'css',
							'auto'      => true,
							'property'  => 'grid-column',
							'sub_value' => 'css',
							'selector'  => FLBuilderBoxModule::child_selector(),
							'enabled'   => [
								'layout' => [
									'nearest_value' => [ 'grid', 'z_stack' ],
								],
							],
						],
					],
					'child_grid_row' => [
						'label'      => __( 'Grid Row', 'fl-builder' ),
						'type'       => 'grid-area',
						'responsive' => true,
						'preview'    => [
							'type'      => 'css',
							'auto'      => true,
							'property'  => 'grid-row',
							'sub_value' => 'css',
							'selector'  => FLBuilderBoxModule::child_selector(),
							'enabled'   => [
								'layout' => [
									'nearest_value' => [ 'grid', 'z_stack' ],
								],
							],
						],
					],
					'child_z_index'  => [
						'type'       => 'hidden',
						'default'    => '',
						'responsive' => true,
						'preview'    => [
							'type'     => 'css',
							'auto'     => true,
							'selector' => FLBuilderBoxModule::child_selector(),
							'property' => 'z-index',
							'enabled'  => [
								'layout' => [
									'nearest_value' => [ 'z_stack' ],
								],
							],
						],
					],
					'child_padding'  => [
						'label'      => __( 'Padding', 'fl-builder' ),
						'type'       => 'dimension',
						'slider'     => true,
						'responsive' => true,
						'units'      => [ 'px', 'em', '%', 'vw', 'vh' ],
						'preview'    => [
							'type'     => 'css',
							'auto'     => true,
							'selector' => FLBuilderBoxModule::child_selector(),
							'property' => 'padding',
						],
					],
				],
			],
			'child_sizing'     => [
				'title'     => __( 'Sizing', 'fl-builder' ),
				'collapsed' => true,
				'fields'    => [
					'child_size'         => [
						'label'      => __( 'Width & Height', 'fl-builder' ),
						'type'       => 'size',
						'responsive' => true,
						'preview'    => [
							'type'  => 'css',
							'auto'  => true,
							'rules' => [
								[
									'property'  => 'min-width',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'sub_value' => [
										'setting_name' => 'min_width',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'width',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'sub_value' => [
										'setting_name' => 'width',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'max-width',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'sub_value' => [
										'setting_name' => 'max_width',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'min-height',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'sub_value' => [
										'setting_name' => 'min_height',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'height',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'sub_value' => [
										'setting_name' => 'height',
										'type'         => 'unit',
									],
								],
								[
									'property'  => 'max-height',
									'selector'  => FLBuilderBoxModule::child_selector(),
									'sub_value' => [
										'setting_name' => 'max_height',
										'type'         => 'unit',
									],
								],
							],
						],
					],
					'child_aspect_ratio' => [
						'label'      => __( 'Aspect Ratio', 'fl-builder' ),
						'type'       => 'select',
						'options'    => FLBuilderBoxModule::get_aspect_ratio_options(),
						'default'    => '',
						'responsive' => true,
						'preview'    => [
							'type'     => 'css',
							'property' => 'aspect-ratio',
							'selector' => FLBuilderBoxModule::child_selector(),
							'auto'     => true,
						],
					],
				],
			],
			'child_appearance' => [
				'title'     => __( 'Appearance', 'fl-builder' ),
				'collapsed' => true,
				'fields'    => [
					'child_color'    => [
						'label'       => __( 'Text Color', 'fl-builder' ),
						'type'        => 'color',
						'responsive'  => true,
						'show_reset'  => true,
						'show_alpha'  => true,
						'connections' => [ 'color' ],
						'preview'     => [
							'type'     => 'css',
							'property' => 'color',
							'auto'     => true,
							'selector' => FLBuilderBoxModule::child_selector(),
						],
					],
					'child_bg_color' => [
						'label'       => __( 'Background Color', 'fl-builder' ),
						'type'        => 'color',
						'responsive'  => true,
						'show_reset'  => true,
						'show_alpha'  => true,
						'connections' => [ 'color' ],
						'preview'     => [
							'type'     => 'css',
							'property' => 'background-color',
							'auto'     => true,
							'selector' => FLBuilderBoxModule::child_selector(),
						],
					],
					'child_border'   => [
						'label'      => __( 'Border', 'fl-builder' ),
						'type'       => 'border',
						'responsive' => true,
						'preview'    => [
							'type'     => 'css',
							'property' => 'border',
							'auto'     => true,
							'selector' => FLBuilderBoxModule::child_selector(),
						],
					],
				],
			],
		],
	],
] );

require_once dirname( __FILE__ ) . '/box-aliases.php';
