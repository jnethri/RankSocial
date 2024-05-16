<?php

/**
 * Settings compatibility helper for all module nodes.
 *
 * @since 2.2
 */
class FLBuilderSettingsCompatModule extends FLBuilderSettingsCompatHelper {

	/**
	 * Filter settings for modules.
	 *
	 * @since 2.2
	 * @param object $settings
	 * @return object
	 */
	public function filter_settings( $settings ) {
		$this->handle_animation_inputs( $settings );
		$this->filter_responsive_display_settings( $settings );

		return $settings;
	}
}
