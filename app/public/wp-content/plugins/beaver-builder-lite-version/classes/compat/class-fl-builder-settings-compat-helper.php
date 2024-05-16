<?php

/**
 * Base class that settings compatibility helpers
 * should extend.
 *
 * @since 2.2
 */
class FLBuilderSettingsCompatHelper {

	/**
	 * Filter a node's settings object.
	 *
	 * @since 2.2
	 * @param object $settings
	 * @return object
	 */
	public function filter_settings( $settings ) {
		return $settings;
	}

	/**
	 * Filters the settings for a module that is rendered within another
	 * module. An example of this would be the button module within the
	 * callout module. This is done so the filtering logic for the button
	 * module doesn't need to be duplicated in the callout module.
	 *
	 * @since 2.2
	 * @param object $slug The child module's slug.
	 * @param object $settings The parent module's settings object.
	 * @param array $key_map An array matching the parent setting keys to the child setting keys.
	 * @return void
	 */
	public function filter_child_module_settings( $slug, &$settings, $key_map ) {

		// Get a generic instance of the child module.
		if ( isset( FLBuilderModel::$modules[ $slug ] ) ) {
			$module = FLBuilderModel::$modules[ $slug ];
		} else {
			return;
		}

		// Make sure the child module has a settings filter method.
		if ( ! method_exists( $module, 'filter_settings' ) ) {
			return;
		}

		// Build the child settings object from the parent settings and key map.
		$child_settings = new stdClass;

		foreach ( $key_map as $parent_key => $child_key ) {
			if ( isset( $settings->{ $parent_key } ) ) {
				$child_settings->{ $child_key } = $settings->{ $parent_key };
				unset( $settings->{ $parent_key } );
			}
		}

		// Filter the child settings.
		$child_settings = $module->filter_settings( $child_settings, $this );

		// Add the child settings back to the parent settings using the key map.
		foreach ( $key_map as $parent_key => $child_key ) {
			if ( isset( $child_settings->{ $child_key } ) ) {
				$settings->{ $parent_key } = $child_settings->{ $child_key };
			}
		}
	}

	/**
	 * Handle old animation inputs that were removed in favor of
	 * a single animation field.
	 *
	 * @since 2.2
	 * @param object $settings
	 * @return void
	 */
	public function handle_animation_inputs( &$settings ) {

		if ( ! isset( $settings->animation ) || is_array( $settings->animation ) || ! isset( $settings->animation_delay ) ) {
			return;
		}

		$keys = array(
			'slide-left'  => 'fade-right',
			'slide-right' => 'fade-left',
			'slide-up'    => 'fade-up',
			'slide-down'  => 'fade-down',
		);

		if ( isset( $keys[ $settings->animation ] ) ) {
			$settings->animation = $keys[ $settings->animation ];
		}

		$settings->animation = array(
			'style' => $settings->animation,
			'delay' => $settings->animation_delay,
		);

		unset( $settings->animation_delay );
	}

	/**
	 * Handle old opacity inputs that were removed in favor of
	 * the alpha slider in the color picker.
	 *
	 * @since 2.2
	 * @param object $settings
	 * @return void
	 */
	public function handle_opacity_inputs( &$settings, $opacity_key, $color_key ) {

		if ( ! isset( $settings->$opacity_key ) || ! is_numeric( $settings->$opacity_key ) || empty( $settings->$color_key ) ) {
			return;
		}

		if ( (int) $settings->$opacity_key < 100 && ! stristr( $settings->$color_key, 'rgb' ) ) {
			$settings->$color_key = 'rgba(' . implode( ',', FLBuilderColor::hex_to_rgb( $settings->$color_key ) ) . ',' . $settings->$opacity_key / 100 . ')';
		}

		unset( $settings->$opacity_key );
	}

	/**
	 * Handle old border inputs that were removed in favor of
	 * the new border setting.
	 *
	 * @since 2.2
	 * @param object $settings
	 * @return void
	 */
	public function handle_border_inputs( &$settings ) {

		if ( isset( $settings->border ) && is_array( $settings->border ) ) {
			return;
		}
		if ( ! isset( $settings->border_type ) ) {
			return;
		}

		foreach ( array( '', '_large', '_medium', '_responsive' ) as $breakpoint ) {

			if ( isset( $settings->{ "border_top$breakpoint" } ) ) {

				$settings->{ "border$breakpoint" } = array(
					'style' => isset( $settings->{ "border_type$breakpoint" } ) ? $settings->{ "border_type$breakpoint" } : '',
					'color' => isset( $settings->{ "border_color$breakpoint" } ) ? $settings->{ "border_color$breakpoint" } : '',
					'width' => array(
						'top'    => $settings->{ "border_top$breakpoint" },
						'right'  => $settings->{ "border_right$breakpoint" },
						'bottom' => $settings->{ "border_bottom$breakpoint" },
						'left'   => $settings->{ "border_left$breakpoint" },
					),
				);

				unset( $settings->{ "border_type$breakpoint" } );
				unset( $settings->{ "border_color$breakpoint" } );
				unset( $settings->{ "border_top$breakpoint" } );
				unset( $settings->{ "border_right$breakpoint" } );
				unset( $settings->{ "border_bottom$breakpoint" } );
				unset( $settings->{ "border_left$breakpoint" } );
			}
		}
	}

	/**
	 * Handle old visibility settings for responsive breakpoints
	 *
	 * @since 2.6
	 * @param object $settings
	 * @return void
	 */
	public function filter_responsive_display_settings( &$settings ) {
		if ( ! isset( $settings->responsive_display ) ) {
			return;
		}

		if ( isset( $settings->responsive_display_filtered ) && true === $settings->responsive_display_filtered ) {
			return;
		}

		if ( '' == $settings->responsive_display ) {
			$settings->responsive_display = 'desktop,large,medium,mobile';
		} elseif ( 'xl' === $settings->responsive_display ) {
			$settings->responsive_display = 'desktop';
		} elseif ( 'desktop' === $settings->responsive_display ) {
			$settings->responsive_display = 'desktop,large';
		} elseif ( 'desktop-medium' === $settings->responsive_display ) {
			$settings->responsive_display = 'desktop,large,medium';
		} elseif ( 'large-medium' === $settings->responsive_display ) {
			$settings->responsive_display = 'large,medium';
		} elseif ( 'medium-mobile' === $settings->responsive_display ) {
			$settings->responsive_display = 'medium,mobile';
		}

		$settings->responsive_display_filtered = true;

		return;
	}

	/**
	 * Handle old visibility settings for responsive breakpoints
	 *
	 * @since 2.7
	 * @param object $settings
	 * @return void
	 */
	public function filter_responsive_order_settings( &$settings ) {
		if ( ! isset( $settings->responsive_order ) ) {
			return;
		}

		if ( 'default' === $settings->responsive_order ) {
			$settings->responsive_order = '';
		} elseif ( 'reversed' === $settings->responsive_order ) {
			$settings->responsive_order = 'mobile';
		}

		return $settings;
	}
}
