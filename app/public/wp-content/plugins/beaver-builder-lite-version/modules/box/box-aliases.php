<?php
$img_path = FL_BUILDER_URL . 'img/placeholders/box-module-aliases/';

FLBuilder::register_module_alias( 'horizontal-stack', [
	'module'      => 'box',
	'name'        => __( 'Flex Columns', 'fl-builder' ),
	'description' => __( 'A simple flex column', 'fl-builder' ),
	'category'    => __( 'Box', 'fl-builder' ),
	'icon'        => 'layout.svg',
	'settings'    => [
		'layout'         => 'flex',
		'flex_direction' => 'row',
		'child_flex'     => [ 'grow' => '1' ],
		'margin_top'     => '0',
		'margin_right'   => '0',
		'margin_bottom'  => '0',
		'margin_left'    => '0',
	],
	'template'    => [
		[ 'box', [] ],
		[ 'box', [] ],
		[ 'box', [] ],
	],
] );

FLBuilder::register_module_alias( 'box-three-x-two-grid', [
	'module'      => 'box',
	'name'        => __( '3x2 Grid', 'fl-builder' ),
	'description' => __( 'A 3-column grid', 'fl-builder' ),
	'category'    => __( 'Box', 'fl-builder' ),
	'icon'        => 'layout.svg',
	'settings'    => [
		'layout'          => 'grid',
		'grid_tracks'     => [
			'columns'     => [
				[
					'type'  => 'basic-track',
					'value' => '3',
				],
			],
			'columns_css' => 'repeat( 3, 1fr )',
			'rows'        => [
				[
					'type'  => 'basic-track',
					'value' => '2',
				],
			],
			'rows_css'    => 'repeat( 2, 1fr )',
		],
		'grid_gap_row'    => '40',
		'grid_gap_column' => '40',
		'grid_gap_unit'   => 'px',
		'margin_top'      => '0',
		'margin_right'    => '0',
		'margin_bottom'   => '0',
		'margin_left'     => '0',
	],
	'template'    => [
		[ 'box', [] ],
		[ 'box', [] ],
		[ 'box', [] ],
		[ 'box', [] ],
		[ 'box', [] ],
		[ 'box', [] ],
	],
] );

FLBuilder::register_module_alias( 'box-four-x-two-grid', [
	'module'      => 'box',
	'name'        => __( '4x2 Grid', 'fl-builder' ),
	'description' => __( 'A 3-column grid', 'fl-builder' ),
	'category'    => __( 'Box', 'fl-builder' ),
	'icon'        => 'layout.svg',
	'settings'    => [
		'layout'                   => 'grid',
		'grid_tracks_display_mode' => 'basic',
		'grid_tracks'              => [
			'columns'     => [
				[
					'type'  => 'basic-track',
					'value' => '4',
				],
			],
			'columns_css' => 'repeat( 4, 1fr )',
			'rows'        => [
				[
					'type'  => 'basic-track',
					'value' => '2',
				],
			],
			'rows_css'    => 'repeat( 2, 1fr )',
		],
		'grid_gap_row'             => '20',
		'grid_gap_column'          => '20',
		'grid_gap_unit'            => 'px',
		'margin_top'               => '0',
		'margin_right'             => '0',
		'margin_bottom'            => '0',
		'margin_left'              => '0',
	],
	'template'    => [
		[
			'box',
			[
				'aspect_ratio' => '1/1',
				'grid_row'     => [
					'span' => '2',
					'css'  => 'span 2',
				],
				'grid_col'     => [
					'span' => '2',
					'css'  => 'span 2',
				],
			],
		],
		[ 'box', [] ],
		[ 'box', [] ],
		[ 'box', [] ],
		[ 'box', [] ],
	],
] );

FLBuilder::register_module_alias( 'split-header', [
	'module'      => 'box',
	'name'        => __( 'Split Header', 'fl-builder' ),
	'description' => __( 'A divided header with a center logo cell', 'fl-builder' ),
	'category'    => __( 'Box', 'fl-builder' ),
	'icon'        => 'layout.svg',
	'settings'    => [
		'layout'                   => 'grid',
		'grid_tracks_display_mode' => 'advanced',
		'grid_tracks'              => [
			'columns'     => [
				[
					'type'  => 'text',
					'value' => '1fr',
				],
				[
					'type'  => 'text',
					'value' => 'max-content',
				],
				[
					'type'  => 'text',
					'value' => '1fr',
				],
			],
			'columns_css' => '1fr max-content 1fr',
		],
		'grid_gap_row'             => '40',
		'grid_gap_column'          => '40',
		'grid_gap_unit'            => 'px',
		'margin_top'               => '0',
		'margin_right'             => '0',
		'margin_bottom'            => '0',
		'margin_left'              => '0',
	],
	'template'    => [
		[
			'box',
			[
				'place_content' => [
					'vertical'   => 'center',
					'horizontal' => 'end',
				],
			],
			[
				[ 'menu', [] ],
			],
		],
		[
			'photo',
			[
				'photo_source'  => 'url',
				'photo_url'     => $img_path . 'logo-a.svg',
				'width'         => '106',
				'margin_top'    => '0',
				'margin_right'  => '0',
				'margin_bottom' => '0',
				'margin_left'   => '0',
				'place_content' => [
					'vertical'   => 'center',
					'horizontal' => 'center',
				],
			],
			[
				[
					'photo',
					[
						'photo_source'  => 'url',
						'photo_url'     => $img_path . 'logo-a.svg',
						'width'         => '106',
						'margin_top'    => '0',
						'margin_right'  => '0',
						'margin_bottom' => '0',
						'margin_left'   => '0',
					],
				],
			],
		],
		[
			'box',
			[
				'place_content' => [
					'vertical'   => 'center',
					'horizontal' => 'start',
				],
			],
			[
				[ 'menu', [] ],
			],
		],
	],
] );

FLBuilder::register_module_alias( 'photo-grid', [
	'module'      => 'box',
	'name'        => __( 'Photo Grid', 'fl-builder' ),
	'description' => __( 'A grid of photos with some featured', 'fl-builder' ),
	'category'    => __( 'Box', 'fl-builder' ),
	'icon'        => 'layout.svg',
	'settings'    => [
		'layout'                   => 'grid',
		'grid_tracks_display_mode' => 'basic',
		'grid_tracks'              => [
			'columns'     => [
				[
					'type'  => 'basic-track',
					'value' => '4',
				],
			],
			'columns_css' => 'repeat( 4, 1fr )',
			'rows'        => [
				[
					'type'  => 'basic-track',
					'value' => '3',
				],
			],
			'rows_css'    => 'repeat( 3, 1fr )',
		],
		'grid_gap_row'             => '30',
		'grid_gap_column'          => '30',
		'grid_gap_unit'            => 'px',
		'margin_top'               => '0',
		'margin_right'             => '0',
		'margin_bottom'            => '0',
		'margin_left'              => '0',
	],
	'template'    => [
		[
			'box',
			[
				'aspect_ratio' => '1/1',
				'grid_row'     => [
					'span' => '2',
					'css'  => 'span 2',
				],
				'grid_col'     => [
					'span' => '2',
					'css'  => 'span 2',
				],
			],
			[
				[
					'photo',
					[
						'photo_source'   => 'url',
						'photo_url'      => $img_path . 'placeholder-geo-five.svg',
						'fill_container' => [ 'fit' => 'cover' ],
					],
				],
			],
		],
		[
			'photo',
			[
				'photo_source'   => 'url',
				'photo_url'      => $img_path . 'placeholder-geo-two.svg',
				'fill_container' => [ 'fit' => 'cover' ],
			],
		],
		[
			'photo',
			[
				'photo_source'   => 'url',
				'photo_url'      => $img_path . 'placeholder-geo-three.svg',
				'fill_container' => [ 'fit' => 'cover' ],
			],
		],
		[
			'box',
			[
				'aspect_ratio' => '1/1',
				'grid_row'     => [
					'span' => '2',
					'css'  => 'span 2',
				],
				'grid_col'     => [
					'span' => '2',
					'css'  => 'span 2',
				],
			],
			[
				[
					'photo',
					[
						'photo_source'   => 'url',
						'photo_url'      => $img_path . 'placeholder-geo-four.svg',
						'fill_container' => [ 'fit' => 'cover' ],
					],
				],
			],
		],
		[
			'photo',
			[
				'photo_source'   => 'url',
				'photo_url'      => $img_path . 'placeholder-geo-one.svg',
				'fill_container' => [ 'fit' => 'cover' ],
			],
		],
		[
			'photo',
			[
				'photo_source'   => 'url',
				'photo_url'      => $img_path . 'placeholder-geo-three.svg',
				'fill_container' => [ 'fit' => 'cover' ],
			],
		],
	],
] );
