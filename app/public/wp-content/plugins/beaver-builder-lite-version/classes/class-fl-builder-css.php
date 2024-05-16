<?php

/**
 * Helper class for outputting CSS.
 *
 * @since 2.2
 */
final class FLBuilderCSS {

	/**
	 * Static list of breakpoints.
	 *
	 * @since 2.8
	 * @var array $breakpoints
	 */
	static private $breakpoints = array( '', 'large', 'medium', 'responsive' );

	/**
	 * An array of rule arg arrays that is used
	 * and cleared when the render method is called.
	 *
	 * @since 2.2
	 * @var array $rules
	 */
	static protected $rules = array();

	/**
	 * Adds a rule config array.
	 *
	 * @since 2.2
	 * @param array $rules
	 * @return void
	 */
	static public function rule( $args = array() ) {
		self::$rules[] = $args;
	}

	/**
	 * Retrieve all breakpoints.
	 *
	 * @since 2.8
	 * @return array
	 */
	static public function get_breakpoints() {
		return self::$breakpoints;
	}

	/**
	 * Returns an array of selectors for a responsive rule,
	 * keyed to each breakpoint.
	 *
	 * @since 2.8
	 * @param string|array $selector
	 * @return array
	 */
	static public function get_responsive_selectors( $selector ) {
		$selectors = [];

		foreach ( self::$breakpoints as $breakpoint ) {
			if ( ! is_array( $selector ) ) {
				$selectors[ $breakpoint ] = $selector;
			} elseif ( ! self::is_array_associative( $selector ) ) {
				$selectors[ $breakpoint ] = implode( ', ', $selector );
			} else {
				if ( '' === $breakpoint ) {
					$selectors[ $breakpoint ] = $selector['default'];
				} else {
					$selectors[ $breakpoint ] = $selector[ $breakpoint ];
				}
			}
		}

		return $selectors;
	}

	/**
	 * Adds rule config arrays for responsive settings.
	 *
	 * @since 2.2
	 * @param array $args
	 * @return void
	 */
	static public function responsive_rule( $args = array() ) {
		$global_settings   = FLBuilderModel::get_global_settings();
		$default_args      = array(
			'settings'          => null,
			'setting_name'      => '',
			'setting_base_name' => '',
			'selector'          => '',
			'prop'              => '',
			'props'             => array(),
			'unit'              => '',
			'enabled'           => true,
			'ignore'            => array(),
			'format_value'      => null,
			'substitute_vals'   => null,
		);
		$args              = wp_parse_args( $args, $default_args );
		$settings          = $args['settings'];
		$setting_name      = $args['setting_name'];
		$setting_base_name = $args['setting_base_name'];
		$selectors         = self::get_responsive_selectors( $args['selector'] );
		$prop              = $args['prop'];
		$props             = $args['props'];
		$default_unit      = $args['unit'];
		$enabled           = $args['enabled'];
		$breakpoints       = self::get_breakpoints();
		$ignore            = $args['ignore'];
		$format_val        = $args['format_value'];
		$substitute_vals   = $args['substitute_vals'];

		if ( ! $settings || empty( $setting_name ) || empty( $args['selector'] ) ) {
			return;
		}

		foreach ( $breakpoints as $breakpoint ) {

			if ( ! empty( $breakpoint ) && ! $global_settings->responsive_enabled ) {
				continue;
			}

			$suffix    = empty( $breakpoint ) ? '' : "_{$breakpoint}";
			$name      = ! is_array( $setting_name ) ? $setting_name . $suffix : null;
			$base_name = empty( $setting_base_name ) ? $name : $setting_base_name . $suffix;

			if ( ! self::is_rule_enabled( $enabled, $base_name, $settings, $breakpoint ) ) {
				continue;
			}

			// Handle compound fields
			if ( isset( $settings->{$base_name} ) && is_array( $settings->{$base_name} ) ) {

				// This fixes an issue where the compound field base name should not be suffixed.
				$sub_setting = $setting_name;

				if ( is_string( $sub_setting ) ) {

					if ( ! isset( $settings->{$base_name}[ $sub_setting ] ) ) {
						continue;
					}

					$setting = $settings->{$base_name}[ $sub_setting ];

				} elseif ( is_array( $sub_setting ) ) {

					// Special sub-sub field handling
					if ( isset( $sub_setting['setting_name'] ) ) {
						$sub_name = $sub_setting['setting_name'];

						if ( ! isset( $settings->{$base_name}[ $sub_name ] ) ) {
							continue;
						}

						// Special handling for unit type subfields
						if ( isset( $sub_setting['type'] ) && 'unit' === $sub_setting['type'] ) {
							$sub     = $settings->{$base_name}[ $sub_name ];
							$setting = isset( $sub['length'] ) ? $sub['length'] : '';

							if ( '' !== $setting && isset( $sub['unit'] ) ) {
								$setting .= $sub['unit'];
							}
						} else {
							$setting = $settings->{$base_name}[ $sub_name ];
						}
					} else {
						continue;
					}
				}
			} else {
				$setting = isset( $settings->{$name} ) ? $settings->{$name} : null;
			}

			// Allow staticly-defined substitute values
			if ( $substitute_vals && in_array( $setting, array_keys( $substitute_vals ) ) ) {
				$setting = $substitute_vals[ $setting ];
			}

			if ( null === $setting ) {
				continue;
			}

			if ( ! in_array( $setting, $ignore ) ) {

				if ( ! empty( $prop ) ) {
					$props[ $prop ] = array(
						'value' => $setting,
						'unit'  => FLBuilderCSS::get_unit( $base_name, $settings, $default_unit ),
					);
				}

				self::$rules[] = array(
					'media'        => $breakpoint,
					'selector'     => $selectors[ $breakpoint ],
					'props'        => $props,
					'format_value' => $args['format_value'],
				);
			}
		}
	}

	/**
	 * Adds a responsive rule config array for a dimension field.
	 *
	 * @since 2.2
	 * @param array $args
	 * @return void
	 */
	static public function dimension_field_rule( $args = array() ) {
		$args              = wp_parse_args( $args, array(
			'settings'     => null,
			'setting_name' => '',
			'selector'     => '',
			'props'        => array(),
			'unit'         => '',
			'enabled'      => true,
		) );
		$settings          = $args['settings'];
		$setting_base_name = $args['setting_name'];
		$selector          = $args['selector'];
		$props             = $args['props'];
		$unit              = $args['unit'];
		$enabled           = $args['enabled'];

		if ( ! $settings || empty( $setting_base_name ) || empty( $selector ) ) {
			return;
		}

		foreach ( $props as $prop => $settings_name ) {
			self::responsive_rule( array(
				'settings'          => $settings,
				'setting_name'      => $settings_name,
				'setting_base_name' => $setting_base_name,
				'selector'          => $selector,
				'prop'              => $prop,
				'unit'              => $unit,
				'enabled'           => $enabled,
			) );
		}
	}

	/**
	 * Adds a responsive rule config array for a compound field.
	 *
	 * @since 2.2
	 * @param array $args
	 * @return void
	 */
	static public function compound_field_rule( $args = array() ) {
		$global_settings = FLBuilderModel::get_global_settings();
		$args            = wp_parse_args( $args, array(
			'type'         => '',
			'selector'     => '',
			'settings'     => null,
			'setting_name' => '',
		) );
		$type            = $args['type'];
		$selectors       = self::get_responsive_selectors( $args['selector'] );
		$settings        = $args['settings'];
		$setting_name    = $args['setting_name'];
		$breakpoints     = array( '', 'large', 'medium', 'responsive' );

		if ( empty( $type ) || empty( $args['selector'] ) || ! $settings || empty( $setting_name ) ) {
			return;
		}

		foreach ( $breakpoints as $breakpoint ) {

			if ( ! empty( $breakpoint ) && ! $global_settings->responsive_enabled ) {
				continue;
			}

			$name     = empty( $breakpoint ) ? $setting_name : "{$setting_name}_{$breakpoint}";
			$setting  = isset( $settings->{$name} ) ? $settings->{$name} : null;
			$callback = "{$type}_field_props";
			$props    = array();

			// Settings must be an array. Settings in nested forms can become objects when encoded.
			if ( is_object( $setting ) ) {
				$setting = (array) $setting;
				foreach ( $setting as $key => $value ) {
					if ( is_object( $value ) ) {
						$setting[ $key ] = (array) $value;
					}
				}
			}

			if ( ! is_array( $setting ) ) {
				continue;
			}
			if ( method_exists( __CLASS__, $callback ) ) {
				$props = call_user_func( array( __CLASS__, $callback ), $setting );
			}

			self::$rules[] = array(
				'media'    => $breakpoint,
				'selector' => $selectors[ $breakpoint ],
				'props'    => $props,
			);
		}
	}

	/**
	 * Adds a responsive rule config array for a border field.
	 *
	 * @since 2.2
	 * @param array $args
	 * @return void
	 */
	static public function border_field_rule( $args = array() ) {
		$args['type'] = 'border';
		self::compound_field_rule( $args );
	}

	/**
	 * Returns a property config array for a border field.
	 *
	 * @since 2.2
	 * @param array $setting
	 * @return array
	 */
	static public function border_field_props( $setting = array() ) {
		$props = array();

		if ( isset( $setting['style'] ) && ! empty( $setting['style'] ) ) {
			$props['border-style']    = $setting['style'];
			$props['border-width']    = '0'; // Default to zero.
			$props['background-clip'] = 'border-box';
		}
		if ( isset( $setting['color'] ) && ! empty( $setting['color'] ) ) {
			$props['border-color'] = $setting['color'];
		}
		if ( isset( $setting['width'] ) && is_array( $setting['width'] ) ) {
			foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
				if ( isset( $setting['width'][ $side ] ) && strlen( trim( $setting['width'][ $side ] ) ) ) {
					$props[ "border-$side-width" ] = intval( $setting['width'][ $side ] ) . 'px';
				}
			}
		}
		if ( isset( $setting['radius'] ) && is_array( $setting['radius'] ) ) {
			if ( isset( $setting['radius']['top_left'] ) && '' !== $setting['radius']['top_left'] ) {
				$props['border-top-left-radius'] = $setting['radius']['top_left'] . 'px';
			}
			if ( '' !== $setting['radius']['top_right'] ) {
				$props['border-top-right-radius'] = $setting['radius']['top_right'] . 'px';
			}
			if ( isset( $setting['radius']['bottom_left'] ) && '' !== $setting['radius']['bottom_left'] ) {
				$props['border-bottom-left-radius'] = $setting['radius']['bottom_left'] . 'px';
			}
			if ( isset( $setting['radius']['bottom_right'] ) && '' !== $setting['radius']['bottom_right'] ) {
				$props['border-bottom-right-radius'] = $setting['radius']['bottom_right'] . 'px';
			}
		}
		if ( isset( $setting['shadow'] ) && is_array( $setting['shadow'] ) ) {
			$props['box-shadow'] = FLBuilderColor::shadow( $setting['shadow'] );
		}

		return $props;
	}

	/**
	 * Adds a responsive rule config array for a typography field.
	 *
	 * @since 2.2
	 * @param array $args
	 * @return void
	 */
	static public function typography_field_rule( $args = array() ) {
		$args['type'] = 'typography';
		self::compound_field_rule( $args );
	}

	/**
	 * Returns a property config array for a typography field.
	 *
	 * @since 2.2
	 * @param array $setting
	 * @return array
	 */
	static public function typography_field_props( $setting = array() ) {
		$props    = array();
		$settings = FLBuilderModel::get_global_settings();
		$pattern  = '%s, %s';
		if ( isset( $setting['font_family'] ) && 'Default' !== $setting['font_family'] ) {
			$fallback = FLBuilderFonts::get_font_fallback( $setting['font_family'] );
			if ( preg_match( '#[0-9\s]#', $setting['font_family'] ) ) {
				$pattern = '"%s", %s';
			}
			$props['font-family'] = sprintf( $pattern, $setting['font_family'], $fallback );
		}
		if ( isset( $setting['font_weight'] ) && 'i' == substr( $setting['font_weight'], -1 ) ) {
			$props['font-weight'] = substr( $setting['font_weight'], 0, -1 );
			$props['font-style']  = 'italic';
		}
		if ( isset( $setting['font_weight'] ) && 'default' !== $setting['font_weight'] && 'italic' !== $setting['font_weight'] ) {
			$props['font-weight'] = $setting['font_weight'];
		}
		if ( isset( $setting['font_size'] ) && ! empty( $setting['font_size']['length'] ) ) {
			if ( 'vw' == $setting['font_size']['unit'] && isset( $settings->responsive_base_fontsize ) ) {
				$props['font-size'] = sprintf( 'calc(%spx + %svw)', $settings->responsive_base_fontsize, $setting['font_size']['length'] );
			} else {
				$props['font-size'] = $setting['font_size']['length'] . $setting['font_size']['unit'];
			}
		}
		if ( isset( $setting['line_height'] ) && ! empty( $setting['line_height']['length'] ) && is_numeric( $setting['line_height']['length'] ) ) {
			$props['line-height'] = $setting['line_height']['length'];
			if ( isset( $setting['line_height']['unit'] ) && ! empty( $setting['line_height']['unit'] ) ) {
				$props['line-height'] .= $setting['line_height']['unit'];
			}
		}
		if ( isset( $setting['letter_spacing'] ) && isset( $setting['letter_spacing']['length'] ) && '' !== strval( $setting['letter_spacing']['length'] ) ) {
			$unit                    = isset( $setting['letter_spacing']['unit'] ) && '' !== $setting['letter_spacing']['unit'] ? $setting['letter_spacing']['unit'] : 'px';
			$props['letter-spacing'] = floatval( $setting['letter_spacing']['length'] ) . $unit;
		}
		if ( isset( $setting['text_align'] ) ) {
			$props['text-align'] = $setting['text_align'];
		}
		if ( isset( $setting['text_transform'] ) ) {
			$props['text-transform'] = $setting['text_transform'];
		}
		if ( isset( $setting['text_decoration'] ) ) {
			$props['text-decoration'] = $setting['text_decoration'];
		}
		if ( isset( $setting['font_style'] ) ) {
			$props['font-style'] = $setting['font_style'];
		}
		if ( isset( $setting['font_variant'] ) ) {
			$props['font-variant'] = $setting['font_variant'];
		}
		if ( isset( $setting['text_shadow'] ) ) {
			$props['text-shadow'] = FLBuilderColor::shadow( $setting['text_shadow'] );
		}

		return $props;
	}

	/**
	 * Renders the CSS for all of the rules that have
	 * been added and resets the $rules array.
	 *
	 * @since 2.2
	 * @return void
	 */
	static public function render() {
		$rendered    = array();
		$breakpoints = self::get_breakpoints();
		$css         = '';

		// Setup system breakpoints here to ensure proper order.
		foreach ( $breakpoints as $breakpoint ) {
			$media              = self::media_value( $breakpoint );
			$rendered[ $media ] = array();
		}

		/**
		 * Filter all responsive css rules before css is rendered
		 * @see fl_builder_pre_render_css_rules
		 */
		$rules = apply_filters( 'fl_builder_pre_render_css_rules', self::$rules );

		foreach ( $rules as $args ) {
			$defaults = array(
				'media'        => '',
				'selector'     => '',
				'enabled'      => true,
				'props'        => array(),
				'format_value' => null,
			);

			$args     = array_merge( $defaults, $args );
			$media    = self::media_value( $args['media'] );
			$selector = is_array( $args['selector'] ) ? implode( ', ', $args['selector'] ) : $args['selector'];
			$props    = self::properties( $args['props'], $args['format_value'] );

			if ( ! $args['enabled'] || empty( $selector ) || empty( $props ) ) {
				continue;
			}

			if ( ! isset( $rendered[ $media ] ) ) {
				$rendered[ $media ] = array();
			}

			if ( ! isset( $rendered[ $media ][ $selector ] ) ) {
				$rendered[ $media ][ $selector ] = array();
			}

			$rendered[ $media ][ $selector ][] = $props;
		}

		foreach ( $rendered as $media => $selectors ) {

			if ( ! empty( $media ) && ! empty( $selectors ) ) {
				$css .= "@media($media) {\n";
				$tab  = "\t";
			} else {
				$tab = '';
			}

			foreach ( $selectors as $selector => $group ) {
				$css .= "$tab$selector {\n";
				foreach ( $group as $props ) {
					$css .= str_replace( "\t", "$tab\t", $props );
				}
				$css .= "$tab}\n";
			}

			if ( ! empty( $media ) && ! empty( $selectors ) ) {
				$css .= "}\n";
			}
		}

		self::$rules = array();

		echo $css;
	}

	/**
	 * Returns the property string for a rule block.
	 *
	 * @since 2.2
	 * @param array $props
	 * @return string
	 */
	static public function properties( $props, $format_value = '' ) {
		$css      = '';
		$defaults = array(
			'value'   => '',
			'unit'    => '',
			'enabled' => true,
		);

		foreach ( $props as $name => $args ) {

			if ( ! is_array( $args ) ) {
				$args = array(
					'value' => $args,
				);
			}

			$args  = array_merge( $defaults, $args );
			$value = $args['value'];
			$type  = self::property_type( $name );

			if ( '' === $value || ! $args['enabled'] ) {
				continue;
			}

			switch ( $type ) {

				case 'color':
					if ( strstr( $value, 'rgb' ) || strstr( $value, 'var' ) || strstr( $value, 'url' ) ) {
						$css .= "\t$name: $value;\n";
					} elseif ( 'inherit' === $value ) {
						$css .= "\t$name: inherit;\n";
					} elseif ( 'transparent' === $value ) {
						$css .= "\t$name: transparent;\n";
					} else {
						$css .= sprintf( "\t%s: #%s;\n", $name, ltrim( $value, '#' ) );
						if ( isset( $args['opacity'] ) && '' !== $args['opacity'] ) {
							$rgb  = implode( ',', FLBuilderColor::hex_to_rgb( $value ) );
							$a    = $args['opacity'] / 100;
							$css .= "\t$name: rgba($rgb,$a);\n";
						}
					}
					break;

				case 'image':
					if ( stristr( $value, 'gradient(' ) ) {
						$css .= "\t$name: $value;\n";
					} else {
						$css .= "\t$name: url($value);\n";
					}
					break;

				default:
					$css .= "\t$name: ";

					// Append unit if exists
					if ( isset( $args['unit'] ) && '' !== $args['unit'] ) {
						$value .= $args['unit'];
					}

					// Apply format string
					if ( is_string( $format_value ) && '' !== $format_value ) {
						$value = sprintf( $format_value, $value );
					}

					$css .= $value;

					$css .= ";\n";
			}
		}

		return $css;
	}

	/**
	 * Returns the type for a single property.
	 *
	 * @since 2.2
	 * @param string $name
	 * @return string|bool
	 */
	static public function property_type( $name ) {
		if ( strstr( $name, 'image' ) ) {
			return 'image';
		} elseif ( strstr( $name, 'color' ) ) {
			return 'color';
		}
		// Support SVG color properties
		if ( 'fill' === $name || 'stroke' === $name ) {
			return 'color';
		}
		return false;
	}

	/**
	 * Returns the value for a media declaration.
	 *
	 * @since 2.2
	 * @param string $media
	 * @return string
	 */
	static public function media_value( $media ) {
		$settings = FLBuilderModel::get_global_settings();

		if ( 'default' === $media ) {
			$media = '';
		} elseif ( 'large' === $media ) {
			$media = "max-width: {$settings->large_breakpoint}px";
		} elseif ( 'medium' === $media ) {
			$media = "max-width: {$settings->medium_breakpoint}px";
		} elseif ( 'responsive' === $media ) {
			$media = "max-width: {$settings->responsive_breakpoint}px";
		}

		return $media;
	}

	/**
	 * Checks is unit field value is actually empty or not.
	 *
	 * @since 2.2
	 * @param string $value
	 * @return bool
	 */
	static public function is_empty( $value = '' ) {
		return empty( $value ) && '0' !== $value;
	}

	/**
	 * Get the unit for a given setting. If no default unit is passed, it looks for a _unit setting.
	 *
	 * @since 2.2
	 * @param string $name
	 * @param object $settings
	 * @param string $default_unit
	 * @return string
	 */
	static public function get_unit( $setting_name, $settings, $default_unit = '' ) {
		$unit = $default_unit;
		if ( '' === $unit && property_exists( $settings, $setting_name . '_unit' ) ) {
			$unit = $settings->{$setting_name . '_unit'};
		}
		return $unit;
	}

	/**
	 * Automatically render CSS for a module based on its field preview data.
	 *
	 * @since 2.8
	 * @param object $module
	 * @return void
	 */
	static public function auto_css( $module ) {
		$fields = FLBuilderModel::get_settings_form_fields( $module->form );
		self::auto_css_setup_fields( $fields, $module->node, $module->settings );
	}

	/**
	 * Loop over form fields and setup any with auto css enabled.
	 * Handle sub-form fields.
	 *
	 * @return void
	 */
	static public function auto_css_setup_fields( $fields, $node_id, $settings ) {
		// Get fields with auto-style enabled
		foreach ( $fields as $handle => $field ) {

			if ( 'form' === $field['type'] ) {
				$fields = FLBuilderModel::get_settings_form_fields( $field['form'], 'general' );
				self::auto_css_setup_fields( $fields, $node_id, $settings->{$handle} );

			} elseif (
				isset( $field['preview'] ) &&
				isset( $field['preview']['auto'] ) &&
				true === $field['preview']['auto']
			) {
				$field['handle'] = $handle;
				self::auto_css_field( $field, $node_id, $settings );
			}
		}
	}

	/**
	 * Auto-render css for a single field
	 *
	 * @param object $field
	 * @param object $module
	 * @return void
	 */
	static public function auto_css_field( $field, $node_id, $settings ) {
		$preview    = $field['preview'];
		$field_name = $field['handle'];
		$types      = [ 'css', 'refresh' ];

		// CSS Preview
		if ( isset( $preview['type'] ) && in_array( $preview['type'], $types ) ) {

			if ( isset( $preview['rules'] ) ) {
				foreach ( $preview['rules'] as $rule ) {
					self::auto_css_rule( $node_id, $rule, $field, $settings );
				}
			} else {
				self::auto_css_rule( $node_id, $preview, $field, $settings );
			}
		}
	}

	/**
	 * Check if a preview rule using auto-css is enabled.
	 *
	 * @param array $rule - Either $preview or one of the rule arrays specified in preview
	 * @param string $field_name - key for the given setting
	 * @param object $settings - node settings
	 * @return bool
	 */
	static public function is_rule_enabled( $enabled, $field_name, $settings, $breakpoint ) {

		if ( is_callable( $enabled ) ) {
			return call_user_func( $enabled, $settings->{$field_name}, $settings );

		} elseif ( is_bool( $enabled ) ) {
			return $enabled;

		} elseif ( is_array( $enabled ) ) {

			// All matches must be true
			$matches = [];
			foreach ( $enabled as $property => $value ) {

				// Value can be array of possible values to match
				if ( is_array( $value ) ) {

					if ( self::is_array_associative( $value ) ) {

						if ( isset( $value['nearest_value'] ) ) {

							$inherited = self::get_inherited_setting_value( $property, $breakpoint, $settings );

							if ( is_string( $value['nearest_value'] ) ) {
								$matches[] = $value['nearest_value'] === $inherited;

							} elseif ( is_array( $value['nearest_value'] ) ) {
								$matches[] = in_array( $inherited, $value['nearest_value'] );
							}
						}
					} else {

						// Simple arrays check if there are any value matches
						$matches[] = in_array( $settings->{$property}, $value );
					}

					// Value can be strict value
				} elseif ( isset( $settings->{$property} ) ) {
					$matches[] = $settings->{$property} === $value;
				}
			}
			return ! in_array( false, $matches );
		}
		return boolval( $enabled );
	}

	/**
	 * Handle any filtering of selector strings. Meant to match FLBuilderPreview.getFormattedSelector()
	 *
	 * @param string selector
	 * @return string
	 */
	static public function get_formatted_selector( $prefix, $selector, $node_id ) {
		$formatted = '';
		$parts     = preg_split( '/,(?![^()]*\))/', $selector );

		foreach ( $parts as $i => $part ) {

			if ( strpos( $part, '{node}' ) ) {
				$formatted .= str_replace( '{node}', $prefix, $part );
			} elseif ( strpos( $part, '{node_id}' ) ) {
				$formatted .= preg_replace( '/{node_id}/', $node_id, $part );
			} else {
				$formatted .= $prefix . ' ' . $part;
			}

			if ( $i !== count( $parts ) - 1 ) { //phpcs:ignore WordPress.PHP.YodaConditions.NotYoda
				$formatted .= ', ';
			}
		}

		return trim( $formatted );
	}

	/**
	 * Create a single auto css rule
	 *
	 * @param string $node_id
	 * @param array $rule - Either $preview or a single rule array
	 * @param array $field - field config
	 * @param object $settings - node settings
	 * @return void
	*/
	static public function auto_css_rule( $node_id, $rule, $field, $settings ) {

		$post_id    = FLBuilderModel::get_post_id();
		$field_type = $field['type'];
		$field_name = $field['handle'];
		$enabled    = isset( $rule['enabled'] ) ? $rule['enabled'] : true;

		/**
		 * Selector
		 * This is meant to match the FLBuilderPreview js selector setup as closely as possible.
		 */
		$selector = isset( $rule['selector'] ) ? $rule['selector'] : ''; //FLBuilderConfig.postId
		$prefix   = ".fl-builder-content-{$post_id} .fl-node-{$node_id}";
		$selector = self::get_formatted_selector( $prefix, $selector, $node_id );

		// Value modifiers
		$format_val = isset( $rule['format_value'] ) ? $rule['format_value'] : null;
		$sub_vals   = isset( $rule['substitute_values'] ) ? $rule['substitute_values'] : null;

		switch ( $field_type ) {
			case 'border':
				FLBuilderCSS::border_field_rule( [
					'settings'     => $settings,
					'setting_name' => $field_name,
					'selector'     => $selector,
				] );
				break;
			case 'dimension':
				$props        = [];
				$css_property = isset( $field['preview']['property'] ) ? $field['preview']['property'] : null;

				if ( ! $css_property ) {
					return;
				}

				$keys = isset( $field['keys'] ) ? $field['keys'] : [
					'top'    => '',
					'right'  => '',
					'bottom' => '',
					'left'   => '',
				];

				foreach ( $keys as $key => $label ) {
					switch ( $css_property ) {
						case 'gap':
							$props[ "{$key}-{$css_property}" ] = "{$field_name}_{$key}";
							break;
						default:
							$props[ "{$css_property}-{$key}" ] = "{$field_name}_{$key}";
					}
				}

				FLBuilderCSS::dimension_field_rule( [
					'settings'     => $settings,
					'setting_name' => $field_name,
					'selector'     => $selector,
					'unit'         => $settings->{"{$field_name}_unit"},
					'props'        => $props,
					'enabled'      => $enabled,
				] );
				break;
			default:
				$args = [
					'settings'        => $settings,
					'setting_name'    => $field_name,
					'selector'        => $selector,
					'prop'            => $rule['property'],
					'format_value'    => $format_val,
					'substitute_vals' => $sub_vals,
					'enabled'         => $enabled,
				];

				// Support sub-values in compound fields
				if ( isset( $rule['sub_value'] ) ) {

					$args['setting_base_name'] = $field_name;
					$args['setting_name']      = $rule['sub_value'];
				}

				if ( is_array( $rule['property'] ) ) {
					foreach ( $rule['property'] as $property ) {
						$args['prop'] = $property;
						FLBuilderCSS::responsive_rule( $args );
					}
				} else {
					FLBuilderCSS::responsive_rule( $args );
				}
		}
	}

	/**
	 * Find the nearest inherited value for a particular setting from a given breakpoint.
	 *
	 * @return String | Null
	 */
	static public function get_inherited_setting_value( $setting_base_name, $current_breakpoint, $settings ) {

		// If there's a value at the breakpoint, skip the rest
		$name = '' === $current_breakpoint ? $setting_base_name : "{$setting_base_name}_{$current_breakpoint}";
		if ( isset( $settings->{$name} ) && '' !== $settings->{$name} ) {
			return $settings->{$name};
		}

		// Only want the breakpoints downstream from (and including) the specified one.
		$breakpoints = array_reverse( self::get_breakpoints() );
		$i           = array_search( $current_breakpoint, $breakpoints );
		if ( false === $i ) {
			return null;
		}
		$breakpoints = array_slice( $breakpoints, $i + 1 );

		foreach ( $breakpoints as $breakpoint ) {
			$name = '' === $breakpoint ? $setting_base_name : "{$setting_base_name}_{$breakpoint}";
			if ( isset( $settings->{$name} ) && '' !== $settings->{$name} ) {
				return $settings->{$name};
			}
		}
		return null;
	}

	/**
	 * Helper function to determine if an array is associative.
	 * PHP 8 has a builtin one but this allows backwards compact.
	 *
	 * @param Array $array
	 * @return Bool
	 */
	static public function is_array_associative( $array ) {
		$i = 0;
		foreach ( $array as $k => $v ) {
			if ( $k !== $i++ ) {
				return true;
			}
		}
		return false;
	}
}
