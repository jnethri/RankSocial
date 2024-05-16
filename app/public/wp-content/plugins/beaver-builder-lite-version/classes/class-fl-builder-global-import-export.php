<?php
class FLBuilderGlobalImportExport {

	function __construct() {
		add_action( 'wp_ajax_export_global_settings', array( $this, 'export_data' ) );
		add_action( 'wp_ajax_import_global_settings', array( $this, 'import_data' ) );
		add_action( 'wp_ajax_reset_global_settings', array( $this, 'reset_data' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'allow_import' ), 10, 4 );

		add_action( 'admin_enqueue_scripts', function( $hook ) {
			if ( 'settings_page_fl-builder-settings' === $hook ) {
				wp_enqueue_script( 'fl-builder-global-import-export', FLBuilder::plugin_url() . 'js/fl-builder-global-import-export.js', array( 'jquery' ), FL_BUILDER_VERSION );
				wp_localize_script( 'fl-builder-global-import-export', 'FLBuilderAdminImportExportConfig', array(
					'select' => __( 'Import Settings', 'fl-builder' ),
				));
			}
		});
	}

	/**
	 * @since 2.6
	 */
	static public function export_data() {

		check_admin_referer( 'fl_builder_import_export' );

		if ( current_user_can( 'manage_options' ) ) {

			$data = $_REQUEST['data'];

			$settings       = array();
			$admin_settings = array();

			$settings['builder_global_settings'] = FLBuilderModel::get_global_settings();

			foreach ( FLBuilderAdminSettings::registered_settings() as $setting ) {
				$admin_settings[ $setting ] = get_option( $setting );
			}

			$settings['admin_settings'] = $admin_settings;

			// global styles/colors
			if ( class_exists( 'FLBuilderGlobalStyles' ) ) {

				$globals = FLBuilderGlobalStyles::get_settings( false );
				$colors  = $globals->colors;
				unset( $globals->colors );
				$settings['global_styles'] = $globals;
				$settings['global_colors'] = $colors;
			}

			// sort data
			if ( 'false' === $data['global_all'] ) {
				if ( 'false' === $data['global'] ) {
					unset( $settings['builder_global_settings'] );
				}
				if ( 'false' === $data['admin'] ) {
					unset( $settings['admin_settings'] );
				}
				if ( 'false' === $data['colors'] ) {
					unset( $settings['global_colors'] );
				}
				if ( 'false' === $data['styles'] ) {
					unset( $settings['global_styles'] );
				}

				// prefix
				if ( isset( $settings['global_colors'] ) && isset( $globals->prefix ) ) {
					$settings['global_colors_prefix'] = $globals->prefix;
				}
			}

			if ( ! $settings ) {
				wp_send_json_error( 'No settings found' );
			}
			wp_send_json_success( array(
				'selected' => $data,
				'settings' => serialize( $settings ),
			) );
		} else {
			wp_send_json_error();
		}
	}

	public function import_data() {

		check_admin_referer( 'fl_builder_import_export' );

		if ( current_user_can( 'manage_options' ) ) {

			$id   = $_POST['importid'];
			$path = get_attached_file( $id );

			if ( ! $path ) {
				wp_send_json_error( 'Could not find file!' );
			}

			$data = file_get_contents( $path );

			if ( is_object( json_decode( $data ) ) ) {
				wp_send_json_error( 'Exports completed with versions prior to 2.8.1 are not compatible due to a change in format of export data. Import aborted.' );
			}

			if ( ! is_serialized( $data ) ) {
				wp_send_json_error( 'Could not parse file!' );
			}

			$data = maybe_unserialize( $data );

			if ( isset( $data['builder_global_settings'] ) ) {
				update_option( '_fl_builder_settings', $data['builder_global_settings'], true );
			}

			// loop through admin settings
			if ( isset( $data['admin_settings'] ) ) {
				$settings = $data['admin_settings'];

				foreach ( $settings as $key => $setting ) {
					update_option( $key, $setting, true );
				}
			}

			$globals = get_option( '_fl_builder_styles' );
			if ( isset( $data['global_styles'] ) ) {
				$backup_colors        = isset( $globals->colors ) ? $globals->colors : array();
				$new_settings         = (object) $data['global_styles'];
				$new_settings->colors = $backup_colors;
				$globals              = $new_settings;
				FLBuilderUtils::update_option( '_fl_builder_styles', $globals, true );
			}

			// global styles/colors...
			if ( isset( $data['global_colors'] ) ) {
				// get current settings and swap out colours
				$globals = $globals ? $globals : FLBuilderGlobalStyles::get_settings( false );
				$current = $globals->colors;

				$new = array_merge( (array) $current, (array) $data['global_colors'] );

				// filter out duplicates
				$serialized      = array_map( 'serialize', $new );
				$unique          = array_unique( $serialized );
				$globals->colors = array_intersect_key( $new, $unique );

				foreach ( $globals->colors as $k => $color ) {
					if ( empty( $color ) || ! $color['color'] ) {
						unset( $globals->colors[ $k ] );
					}
				}

				if ( isset( $data->global_colors_prefix ) ) {
					$globals->prefix = $data->global_colors_prefix;
				}
				FLBuilderUtils::update_option( '_fl_builder_styles', $globals, true );
			}

			wp_send_json_success();
		} else {
			wp_send_json_error();
		}
	}

	public function reset_data() {

		check_admin_referer( 'fl_builder_import_export' );

		if ( current_user_can( 'manage_options' ) ) {
			delete_option( '_fl_builder_styles' );
			delete_option( '_fl_builder_settings' );
			foreach ( FLBuilderAdminSettings::registered_settings() as $setting ) {
				delete_option( $setting );
			}
			wp_send_json_success();
		} else {
			wp_send_json_error();
		}
	}

	public function allow_import( $data, $file, $filename, $mimes ) {
		if ( isset( $_POST['fl_global_import'] ) && current_user_can( 'manage_options' ) ) {
			$wp_filetype     = wp_check_filetype( $filename, $mimes );
			$ext             = $wp_filetype['ext'];
			$type            = $wp_filetype['type'];
			$proper_filename = $data['proper_filename'];
			return compact( 'ext', 'type', 'proper_filename' );
		}
		return $data;
	}
}
new FLBuilderGlobalImportExport;
