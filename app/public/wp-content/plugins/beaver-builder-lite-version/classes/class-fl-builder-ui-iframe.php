<?php

/**
 * Handles rendering the Beaver Builder iframe UI.
 */
class FLBuilderUIIFrame {

	/**
	 * Initialize logic for iframe support as soon as this class is loaded.
	 */
	static public function init() {
		add_action( 'wp', __CLASS__ . '::redirect' );
		add_action( 'wp', __CLASS__ . '::hooks' );
	}

	/**
	 * Redirect to the top level UI if a legacy URL is requested or redirect
	 * to legacy if disabled. Otherwise, setup the IFRAME_REQUEST constant.
	 */
	static public function redirect() {
		$ui_request     = self::is_ui_request();
		$iframe_request = self::is_iframe_request();

		if ( ! is_user_logged_in() ) {
			return;
		}
		if ( ! self::is_enabled() ) {
			if ( $ui_request || $iframe_request ) {
				wp_safe_redirect( FLBuilderModel::get_edit_url() );
				die();
			}
		} elseif ( FLBuilderModel::is_builder_active() && ! $ui_request && ! $iframe_request ) {
			wp_safe_redirect( FLBuilderModel::get_edit_url() );
			die();
		}
	}

	/**
	 * Initialize logic for iframe support after WP is setup.
	 */
	static public function hooks() {

		if ( ! FLBuilderModel::is_builder_active() || ! self::is_enabled() ) {
			return;
		}

		// Hooks that should only run in the top level UI.
		if ( self::is_ui_request() ) {

			/**
			 * Define the IFRAME_REQUEST constant for the top level UI to prevent
			 * third parties from enqueuing assets and rendering markup. Third party
			 * assets and markup should usually be rendered within the layout iframe.
			 */
			if ( ! defined( 'IFRAME_REQUEST' ) ) {
				define( 'IFRAME_REQUEST', true );
			}

			add_action( 'template_redirect', __CLASS__ . '::render' );
			add_action( 'wp_enqueue_scripts', __CLASS__ . '::enqueue_styles', PHP_INT_MAX );
			add_action( 'wp_enqueue_scripts', __CLASS__ . '::enqueue_scripts', PHP_INT_MAX );

			add_filter( 'trp_floating_ls_html', __CLASS__ . '::trp_ls_html' );
		}
	}

	/**
	 * Check if the iframe UI is enabled on this site.
	 */
	static public function is_enabled() {
		return apply_filters( 'fl_builder_iframe_ui_enabled', true );
	}

	/**
	 * Check if the current request is for the top level UI.
	 */
	static public function is_ui_request() {
		return isset( $_GET['fl_builder_ui'] );
	}

	/**
	 * Check if the current request is for the iframe content.
	 */
	static public function is_iframe_request() {
		return isset( $_GET['fl_builder_ui_iframe'] );
	}

	/**
	 * Enqueue styles that should be loaded in the top level UI only.
	 * Most UI styles should still be enqueued in the FLBuilder class
	 * for backwards compat.
	 */
	static public function enqueue_styles() {
		$ver     = FL_BUILDER_VERSION;
		$css_url = FLBuilder::plugin_url() . 'css/';

		wp_enqueue_style( 'fl-builder-ui-iframe', $css_url . 'fl-builder-ui-iframe.css', array(), $ver );

		self::dequeue_theme_styles();
	}

	/**
	 * Dequeue theme styles because we don't need them in the UI.
	 */
	static public function dequeue_theme_styles() {
		global $wp_styles;

		$template   = get_template();
		$stylesheet = get_stylesheet();
		$dir_root   = get_raw_theme_root( $stylesheet );
		$removed    = array();

		foreach ( $wp_styles->registered as $handle => $dependency ) {
			if ( isset( $dependency->src ) ) {
				if ( strstr( $dependency->src, "$dir_root/$template/" ) || strstr( $dependency->src, "$dir_root/$stylesheet/" ) ) {
					$wp_styles->queue = array_diff( $wp_styles->queue, array( $handle ) );
					$removed[]        = $handle;
				}
			}
		}
		// now remove deps...
		foreach ( $wp_styles->registered as $handle => $dependency ) {
			if ( isset( $dependency->deps ) && ! empty( $dependency->deps ) ) {
				foreach ( $dependency->deps as $dep ) {
					if ( in_array( $dep, $removed ) ) {
						$wp_styles->queue = array_diff( $wp_styles->queue, array( $handle ) );
					}
				}
			}
		}
	}

	/**
	 * Enqueue scripts that should be loaded in the top level UI only.
	 * Most UI scripts should still be enqueued in the FLBuilder class
	 * for backwards compat.
	 */
	static public function enqueue_scripts() {
		global $wp_actions;
		global $wp_scripts;

		/**
		 * Dequeue ALL scripts so only those that are whitelisted or explicitly
		 * enqueued on our action are rendered. We do this because BB loads
		 * everything in the iframe and only renders its UI to the parent window.
		 * Scripts that load in the parent can throw errors because it's not the
		 * full builder environment. We also don't need them loading twice ;)
		 */
		$wp_scripts->queue = array();

		/**
		 * Make sure all media library scripts still get enqueued since
		 * wp_enqueue_media enqueues multiple scripts.
		 */
		if ( isset( $wp_actions['wp_enqueue_media'] ) ) {
			unset( $wp_actions['wp_enqueue_media'] );
			wp_enqueue_media();
		}

		/**
		 * Whitelist of scripts to allow. Most of these only work on one
		 * document or need to render outside of the frame and are hardcoded
		 * in a way that they can only do that by enqueuing in the parent.
		 */
		$whitelist = array(
			'fl-builder-tour',
			'bootstrap-tour',
			'jquery-touch-punch',
			'ace',
			'ace-language-tools',
			'clipboard',
			'mousetrap',
			'tether',
			'jquery-validate',
			'font-awesome-official',
			'select2',
		);

		foreach ( $whitelist as $key => $handle ) {
			wp_enqueue_script( $handle );
		}

		/**
		 * Allow third parties (such as Assistant) to enqueue scripts.
		 */
		do_action( 'fl_builder_ui_enqueue_scripts' );
	}

	/**
	 * Renders the top level UI and iframe element.
	 */
	static public function render() {
		include FL_BUILDER_DIR . 'includes/ui-iframe.php';
		die();
	}

	/**
	 * Remove translatepress floating language switcher.
	 */
	static public function trp_ls_html() {
		return '';
	}
}

FLBuilderUIIFrame::init();
