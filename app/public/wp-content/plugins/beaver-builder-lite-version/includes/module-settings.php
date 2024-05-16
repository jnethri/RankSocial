<?php

$global_settings = FLBuilderModel::get_global_settings();

FLBuilder::register_settings_form('module_advanced', array(
	'title'    => __( 'Advanced', 'fl-builder' ),
	'sections' => array(
		'margins'       => array(
			'fields' => array(
				'margin' => array(
					'type'       => 'dimension',
					'label'      => __( 'Margins', 'fl-builder' ),
					'slider'     => true,
					'units'      => array(
						'px',
						'%',
					),
					'preview'    => array(
						'type'     => 'css',
						'selector' => '.fl-module-content',
						'property' => 'margin',
					),
					'responsive' => array(
						'default_unit' => array(
							'default'    => $global_settings->module_margins_unit,
							'large'      => $global_settings->module_margins_large_unit,
							'medium'     => $global_settings->module_margins_medium_unit,
							'responsive' => $global_settings->module_margins_responsive_unit,
						),
						'placeholder'  => array(
							'default'    => array(
								'top'    => empty( $global_settings->module_margins_top ) ? '' : $global_settings->module_margins_top,
								'right'  => empty( $global_settings->module_margins_right ) ? '' : $global_settings->module_margins_right,
								'bottom' => empty( $global_settings->module_margins_bottom ) ? '' : $global_settings->module_margins_bottom,
								'left'   => empty( $global_settings->module_margins_left ) ? '' : $global_settings->module_margins_left,
							),
							'large'      => FLBuilderModel::get_node_spacing_breakpoint_placeholders( 'module', 'margins', 'large' ),
							'medium'     => FLBuilderModel::get_node_spacing_breakpoint_placeholders( 'module', 'margins', 'medium' ),
							'responsive' => FLBuilderModel::get_node_spacing_breakpoint_placeholders( 'module', 'margins', 'responsive' ),
						),
					),
				),
			),
		),
		'visibility'    => array(
			'title'  => __( 'Visibility', 'fl-builder' ),
			'fields' => array(
				'responsive_display'         => array(
					'type'         => 'button-group',
					'label'        => __( 'Breakpoint', 'fl-builder' ),
					'options'      => array(
						'desktop' => '<i class="dashicons dashicons-desktop"></i>',
						'large'   => '<i class="dashicons dashicons-laptop"></i>',
						'medium'  => '<i class="dashicons dashicons-tablet"></i>',
						'mobile'  => '<i class="dashicons dashicons-smartphone"></i>',
					),
					'tooltip'      => array(
						'desktop' => __( 'Extra Large', 'fl-builder' ),
						'large'   => __( 'Large', 'fl-builder' ),
						'medium'  => __( 'Medium', 'fl-builder' ),
						'mobile'  => __( 'Mobile', 'fl-builder' ),
					),
					'default'      => 'desktop,large,medium,mobile',
					'multi-select' => array(
						'min' => 1,
					),
					'preview'      => array(
						'type' => 'none',
					),
				),
				'visibility_display'         => array(
					'type'    => 'select',
					'label'   => __( 'Display', 'fl-builder' ),
					'options' => array(
						''           => __( 'Always', 'fl-builder' ),
						'logged_out' => __( 'Logged Out User', 'fl-builder' ),
						'logged_in'  => __( 'Logged In User', 'fl-builder' ),
						'0'          => __( 'Never', 'fl-builder' ),
					),
					'toggle'  => array(
						'logged_in' => array(
							'fields' => array( 'visibility_user_capability' ),
						),
					),
					'preview' => array(
						'type' => 'none',
					),
				),
				'visibility_user_capability' => array(
					'type'        => 'text',
					'label'       => __( 'User Capability', 'fl-builder' ),
					/* translators: %s: wporg docs link */
					'description' => sprintf( __( 'Optional. Set the <a%s>capability</a> required for users to view this module.', 'fl-builder' ), ' href="http://codex.wordpress.org/Roles_and_Capabilities#Capability_vs._Role_Table" target="_blank"' ),
					'preview'     => array(
						'type' => 'none',
					),
				),
			),
		),
		'animation'     => array(
			'title'  => __( 'Animation', 'fl-builder' ),
			'fields' => array(
				'animation' => array(
					'type'    => 'animation',
					'label'   => __( 'Animation', 'fl-builder' ),
					'preview' => array(
						'type'     => 'animation',
						'selector' => '{node}',
					),
				),
			),
		),
		'css_selectors' => array(
			'title'  => __( 'HTML Element', 'fl-builder' ),
			'fields' => array(
				'container_element' => array(
					'type'     => 'select',
					'label'    => __( 'Container Element', 'fl-builder' ),
					'default'  => 'div',
					'sanitize' => array( 'FLBuilderUtils::esc_tags', 'div' ),
					/**
					 * Filter to add/remove container types.
					 * @see fl_builder_node_container_element_options
					 */
					'options'  => apply_filters( 'fl_builder_node_container_element_options', array(
						'div'     => '&lt;div&gt;',
						'section' => '&lt;section&gt;',
						'article' => '&lt;article&gt;',
						'aside'   => '&lt;aside&gt;',
						'main'    => '&lt;main&gt;',
						'header'  => '&lt;header&gt;',
						'footer'  => '&lt;footer&gt;',
					) ),
					'help'     => __( 'Optional. Choose an appropriate HTML5 content sectioning element to use for this module to improve accessibility and machine-readability.', 'fl-builder' ),
					'preview'  => array(
						'type' => 'none',
					),
				),
				'id'                => array(
					'type'    => 'text',
					'label'   => __( 'ID', 'fl-builder' ),
					'help'    => __( "A unique ID that will be applied to this module's HTML. Must start with a letter and only contain dashes, underscores, letters or numbers. No spaces.", 'fl-builder' ),
					'preview' => array(
						'type' => 'none',
					),
				),
				'class'             => array(
					'type'    => 'text',
					'label'   => __( 'Class', 'fl-builder' ),
					'help'    => __( "A class that will be applied to this module's HTML. Must start with a letter and only contain dashes, underscores, letters or numbers. Separate multiple classes with spaces.", 'fl-builder' ),
					'preview' => array(
						'type' => 'none',
					),
				),
				'node_label'        => array(
					'type'     => 'text',
					'label'    => __( 'Label', 'fl-builder' ),
					'help'     => __( 'A label that will applied and used in the UI for easy identification.', 'fl-builder' ),
					'sanitize' => 'strip_tags',
					'preview'  => array(
						'type' => 'none',
					),
				),
			),
		),
		'export_import' => array(
			'title'     => __( 'Export/Import', 'fl-builder' ),
			'collapsed' => true,
			'fields'    => array(
				'export' => array(
					'type'    => 'raw',
					'label'   => __( 'Export', 'fl-builder' ),
					'preview' => 'none',
					'content' => '<button style="margin-right:10px" class="fl-builder-button fl-builder-button-small module-export-all" title="Copy Settings">Copy Settings</button><button class="fl-builder-button fl-builder-button-small module-export-style" title="Copy Styles">Copy Styles</button>',
				),
				'import' => array(
					'type'    => 'raw',
					'label'   => __( 'Import', 'fl-builder' ),
					'preview' => 'none',
					'content' => '<div class="module-import-wrap"><input type="text" class="module-import-input" placeholder="Paste settings or styles here..." /><button class="fl-builder-button fl-builder-button-small module-import-apply">Import</button></div><div class="module-import-error"></div>',
				),
			),
		),
	),
));
