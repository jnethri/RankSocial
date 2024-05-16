<?php

final class FLBuilderNodeCodeSettings {

	public static function init() {
		add_action( 'plugins_loaded', __CLASS__ . '::setup_hooks' );
	}

	public static function setup_hooks() {
		// Don't load if the code settings plugin is active or BB is not active.
		if ( class_exists( 'BB_Code_Settings' ) ) {
			return;
		} elseif ( ! class_exists( 'FLBuilder' ) ) {
			return;
		}

		// Are these settings disabled?
		if ( ! apply_filters( 'fl_builder_enable_node_code_settings', true ) ) {
			return;
		}

		add_action( 'wp_enqueue_scripts', __CLASS__ . '::enqueue_builder_scripts' );

		add_filter( 'fl_builder_register_settings_form', __CLASS__ . '::filter_settings_fields', 10, 2 );
		if ( ! isset( $_GET['safemode'] ) ) {
			add_filter( 'fl_builder_render_css', __CLASS__ . '::filter_layout_css', 10, 2 );
			add_filter( 'fl_builder_render_js', __CLASS__ . '::filter_layout_js', 10, 2 );
			add_filter( 'fl_builder_ajax_layout_response', __CLASS__ . '::filter_ajax_layout_js' );
		}
	}

	public static function enqueue_builder_scripts() {
		if ( FLBuilderModel::is_builder_active() ) {
			wp_enqueue_style( 'fl-builder-node-code-settings', FLBuilder::plugin_url() . 'css/fl-builder-node-code-settings.css', array(), FL_BUILDER_VERSION );
			wp_enqueue_script( 'fl-builder-node-code-settings', FLBuilder::plugin_url() . 'js/fl-builder-node-code-settings.js', array( 'jquery' ), FL_BUILDER_VERSION );
		}
	}


	public static function filter_settings_fields( $form, $slug ) {
		if ( 'row' === $slug || 'col' === $slug && ( current_user_can( 'delete_others_posts' ) || FLBuilderModel::user_has_unfiltered_html() ) ) {
			$form['tabs']['advanced']['sections']['bb_css_code'] = self::get_css_field_config();
			$form['tabs']['advanced']['sections']['bb_js_code']  = self::get_js_field_config();
		}
		if ( 'module_advanced' === $slug && ( current_user_can( 'delete_others_posts' ) || FLBuilderModel::user_has_unfiltered_html() ) ) {
			$form['sections']['bb_css_code'] = self::get_css_field_config();
			$form['sections']['bb_js_code']  = self::get_js_field_config();
		}
		return $form;
	}

	public static function get_css_field_config() {
		return array(
			'title'     => __( 'CSS', 'fl-builder' ),
			'collapsed' => true,
			'fields'    => array(
				'bb_css_code' => array(
					'label'   => '',
					'type'    => 'code',
					'editor'  => 'css',
					'rows'    => '18',
					'preview' => array(
						'type' => 'none',
					),
				),
			),
		);
	}

	public static function get_js_field_config() {
		return array(
			'title'     => __( 'JavaScript', 'fl-builder' ),
			'collapsed' => true,
			'fields'    => array(
				'bb_js_code' => array(
					'label'   => '',
					'type'    => 'code',
					'editor'  => 'javascript',
					'rows'    => '18',
					'preview' => array(
						'type' => 'none',
					),
				),
			),
		);
	}

	public static function filter_layout_css( $css, $nodes ) {
		$all_nodes = array_merge( $nodes['rows'], $nodes['columns'], $nodes['modules'] );

		foreach ( $all_nodes as $node_id => $node ) {
			if ( isset( $node->settings ) ) {
				if ( isset( $node->settings->bb_css_code ) && ! empty( $node->settings->bb_css_code ) ) {

					// Load scssphp libs
					require_once FL_BUILDER_DIR . 'includes/vendor/sass/autoload.php';
					$code     = ".fl-node-$node_id {\n";
					$code    .= FLBuilder::maybe_do_shortcode( $node->settings->bb_css_code );
					$code    .= '}';
					$compiler = new ScssPhp\ScssPhp\Compiler();
					try {
						$css .= $compiler->compileString( $code )->getCSS();
					} catch ( Exception $e ) {
						$name = isset( $node->name ) ? $node->name : $node->type;
						$css .= "\n/*\n!!bb-code-settings compile error!!\nNode: {$node->node}\nType: {$name}\n{$e->getMessage()}\n*/\n";
					}
					$css = apply_filters( 'fl_builder_node_code_css', $css, $node );
				}
			}
		}
		return $css;
	}

	public static function filter_layout_js( $js, $nodes ) {
		$all_nodes = array_merge( $nodes['rows'], $nodes['columns'], $nodes['modules'] );
		foreach ( $all_nodes as $node ) {
			$js .= FLBuilder::maybe_do_shortcode( self::get_node_js( $node ) );
		}
		return $js;
	}

	public static function filter_ajax_layout_js( $response ) {
		if ( $response['partial'] ) {
			$node            = FLBuilderModel::get_node( $response['nodeId'] );
			$response['js'] .= self::get_node_js( $node );
		}
		return $response;
	}

	public static function get_node_js( $node ) {
		if ( isset( $node->settings ) ) {
			if ( isset( $node->settings->bb_js_code ) && ! empty( $node->settings->bb_js_code ) ) {
				return $node->settings->bb_js_code;
			}
		}
		return '';
	}
}

FLBuilderNodeCodeSettings::init();
