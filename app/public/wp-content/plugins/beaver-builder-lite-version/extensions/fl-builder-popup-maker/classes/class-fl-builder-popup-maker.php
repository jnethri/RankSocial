<?php

final class FLBuilderPopupMaker {

	static public function init() {
		register_activation_hook( FL_BUILDER_FILE, __CLASS__ . '::enable_builder_for_post_type' );

		add_action( 'activate_popup-maker/popup-maker.php', __CLASS__ . '::enable_builder_for_post_type' );
		add_action( 'plugins_loaded', __CLASS__ . '::hook' );
	}

	static public function hook() {
		if ( ! class_exists( 'Popup_Maker' ) ) {
			return;
		}

		// Actions
		add_action( 'wp', __CLASS__ . '::redirect_to_admin_edit' );
		add_action( 'wp_enqueue_scripts', __CLASS__ . '::preload_popups' );
		add_action( 'wp_enqueue_scripts', __CLASS__ . '::enqueue_scripts' );

		// Filters
		add_filter( 'register_post_type_args', __CLASS__ . '::enable_frontend_editing', 10, 2 );
		add_filter( 'single_template', __CLASS__ . '::load_frontend_editing_template' );
		add_filter( 'pum_popup_is_loadable', __CLASS__ . '::disable_popups_for_frontend_editing' );
		add_filter( 'pum_popup_content', __CLASS__ . '::render_builder_layout', 10, 2 );
		add_filter( 'fl_render_content_by_id_can_view', __CLASS__ . '::pum_can_view', 10, 2 );
		add_filter( 'get_post_metadata', __CLASS__ . '::pum_disabled_overide', 100, 4 );
	}

	static public function preload_popups() {
		if ( FLBuilderModel::is_builder_enabled() ) {
			$nodes = FLBuilderModel::get_categorized_nodes();

			foreach ( $nodes['modules'] as $module ) {
				self::preload_popups_from_settings( $module->settings );
			}
		}
	}

	static public function preload_popups_from_settings( $settings ) {
		foreach ( $settings as $key => $value ) {
			if ( is_string( $value ) && strstr( $value, '#popmake-' ) ) {
				$parts = explode( '-', $value );
				if ( isset( $parts[1] ) && is_numeric( $parts[1] ) && get_post_status( $parts[1] ) ) {
					PUM_Site_Popups::preload_popup( pum_get_popup( $parts[1] ) );
				}
			} elseif ( is_array( $value ) || is_object( $value ) ) {
				self::preload_popups_from_settings( $value );
			}
		}
	}

	static public function enqueue_scripts() {
		if ( 'popup' === get_post_type() && FLBuilderModel::is_builder_active() ) {
			$ver = FL_BUILDER_VERSION;

			wp_enqueue_script( 'fl-builder-popup-maker', FL_BUILDER_POPUP_MAKER_URL . 'js/fl-builder-popup-maker.js', [ 'jquery' ], $ver );
		}
	}

	static public function enable_builder_for_post_type() {
		$post_types = FLBuilderModel::get_post_types();

		if ( ! in_array( 'popup', $post_types ) ) {
			$post_types[] = 'popup';
			FLBuilderModel::update_admin_settings_option( '_fl_builder_post_types', $post_types, true, true );
		}
	}

	static public function redirect_to_admin_edit() {
		if ( ! isset( $_GET['post_type'] ) || ! isset( $_GET['p'] ) || 'popup' !== $_GET['post_type'] ) {
			return;
		} elseif ( ! is_admin() && ! FLBuilderModel::is_builder_active() ) {
			$id = absint( $_GET['p'] );
			if ( get_post( $id ) ) {
				wp_safe_redirect( admin_url( "/post.php?post=$id&action=edit" ) );
			}
		}
	}

	static public function enable_frontend_editing( $args, $post_type ) {
		if ( 'popup' === $post_type && ! is_admin() ) {
			$args['publicly_queryable'] = isset( $_GET['fl_builder'] );
		}
		return $args;
	}

	static public function load_frontend_editing_template( $template ) {
		if ( 'popup' === get_post_type() && FLBuilderModel::is_builder_active() ) {
			if ( current_theme_supports( 'block-templates' ) ) {
				PUM_Site_Popups::preload_popup_by_id_if_enabled( get_the_ID() );
				add_filter( 'the_content', '__return_empty_string' );
			} else {
				return FL_BUILDER_POPUP_MAKER_DIR . 'includes/edit.php';
			}
		}

		return $template;
	}

	static public function disable_popups_for_frontend_editing( $loadable ) {
		if ( FLBuilderModel::is_builder_active() ) {
			return false;
		}
		return $loadable;
	}

	static public function render_builder_layout( $content, $id ) {
		if ( FLBuilderModel::is_builder_enabled( $id ) ) {
			FLBuilder::enqueue_layout_styles_scripts_by_id( $id );
			ob_start();
			FLBuilder::render_content_by_id( $id );
			$content = ob_get_clean();
		}
		return $content;
	}

	static public function pum_can_view( $can_view, $post_id ) {
		if ( 'popup' === get_post_type( $post_id ) ) {
			$can_view = true;
		}
		return $can_view;
	}

	/**
	 * Allow disabled popups to be editible
	 */
	static public function pum_disabled_overide( $metadata, $object_id, $meta_key, $single ) {
		if ( 'enabled' === $meta_key && isset( $_GET['fl_builder'] ) ) {
			if ( 'popup' === get_post_type( $object_id ) ) {
				return true;
			}
		}
		return $metadata;
	}
}

FLBuilderPopupMaker::init();
