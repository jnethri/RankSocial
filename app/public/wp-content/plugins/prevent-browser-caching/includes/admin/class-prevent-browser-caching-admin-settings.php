<?php

class Prevent_Browser_Caching_Admin_Settings
{

    /**
     * Prevent_Browser_Caching_Admin_Settings Constructor.
     */
    public function __construct()
    {
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
        add_action( 'wp_ajax_pbc_update_clear_cache_time', array( $this, 'update_clear_cache_time' ) );
    }

    /**
     * Add options page.
     */
    public function add_plugin_page()
    {
        add_options_page(
            __( 'Prevent Browser Caching', 'prevent-browser-caching' ),
            __( 'Prevent Browser Caching', 'prevent-browser-caching' ),
            'manage_options',
            'prevent-browser-caching',
            array( $this, 'create_admin_page' )
        );
    }

    /**
     * Options page callback.
     */
    public function create_admin_page()
    {
        ?>
        <div class="wrap">
            <h1>Prevent Browser Caching</h1>
            <?php if ( class_exists( 'Prevent_Browser_Caching' ) ): ?>
                <div id="pbc_notices">
                    <div class="updated settings-error notice pbc-notice pbc-notice-update-caching-time" style="display: none">
                        <p><strong><?php _e( 'CSS and JS files have been updated successfully.', 'prevent-browser-caching' ); ?></strong></p>
                        <button type="button" class="notice-dismiss" onclick="pbc_close_notice(this)"><span class="screen-reader-text"><?php _e( 'Dismiss this notice.' ); ?></span></button>
                    </div>
                </div>

                <form method="post" action="<?php echo admin_url( 'options.php '); ?>">
                    <?php

                    settings_fields( 'prevent_browser_caching_options_group' );
                    do_settings_sections( 'prevent-browser-caching' );
                    submit_button();

                    ?>
                </form>
            <?php endif; ?>
            <?php if ( class_exists( 'Prevent_Browser_Caching_Function' ) ): ?>
                <?php

                $assets_version = Prevent_Browser_Caching_Function::instance()->assets_version;

                ?>
                <p>NOTE: The assets version of CSS and JS files will be always <strong><?php echo $assets_version; ?></strong>. It is set by this code:</p>
                <code style="display: block;">
                    prevent_browser_caching( array(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;'assets_version' => '<?php echo $assets_version; ?>'<br>
                    ) );
                </code>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Register and add settings.
     */
    public function page_init()
    {
        register_setting(
            'prevent_browser_caching_options_group', // Option group
            'prevent_browser_caching_options', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        add_settings_section(
            'prevent_browser_caching_settings', // ID
            null, // Title
            null, // Callback
            'prevent-browser-caching' // Page
        );

        add_settings_field(
            'always_clear_cache',
            __( 'Automatically updating CSS and JS files for a site visitor', 'prevent-browser-caching' ),
            array( $this, 'clear_cache_automatically_callback' ),
            'prevent-browser-caching',
            'prevent_browser_caching_settings'
        );
        add_settings_field(
            'update_css_js_files',
            __( 'Manually update CSS and JS files for all site visitors', 'prevent-browser-caching' ),
            array( $this, 'clear_cache_manually_callback' ),
            'prevent-browser-caching',
            'prevent_browser_caching_settings'
        );
    }

    /**
     * Sanitize each setting field as needed.
     *
     * @param $input
     * @return mixed
     */
    public function sanitize( $input )
    {
        return Prevent_Browser_Caching::instance()->filter_options( $input );
    }

    /**
     * Displays options to clear cache automatically.
     */
    public function clear_cache_automatically_callback()
    {
        $options = Prevent_Browser_Caching::instance()->get_options();
        $clear_cache_automatically = $options['clear_cache_automatically'];
        $clear_cache_automatically_minutes = $options['clear_cache_automatically_minutes'];
        ?>

        <label>
            <input type="radio" name="prevent_browser_caching_options[clear_cache_automatically]" value="every_time"<?php echo $clear_cache_automatically == 'every_time' ? ' checked' : ''; ?> />
            <?php _e( 'Every time a user loads a page', 'prevent-browser-caching' ); ?>
        </label><br>
        <label>
            <input type="radio" name="prevent_browser_caching_options[clear_cache_automatically]" value="every_period"<?php echo $clear_cache_automatically == 'every_period' ? ' checked' : ''; ?> />
            <?php _e( 'Every', 'prevent-browser-caching' ); ?> <input type="number" name="prevent_browser_caching_options[clear_cache_automatically_minutes]" value="<?php echo $clear_cache_automatically_minutes ?>" step="1" min="1" max="99999" style="width: 65px"> <?php _e( 'minutes', 'prevent-browser-caching' ); ?>
        </label><br>
        <label>
            <input type="radio" name="prevent_browser_caching_options[clear_cache_automatically]" value="never"<?php echo $clear_cache_automatically == 'never' ? ' checked' : ''; ?> />
            <?php _e( 'Do not update automatically', 'prevent-browser-caching' ); ?>
        </label><br>

        <?php
    }

    /**
     * Displays options to clear cache manually.
     */
    public function clear_cache_manually_callback()
    {
        $options = Prevent_Browser_Caching::instance()->get_options();
        $show_on_toolbar = $options['show_on_toolbar'];
        ?>

        <label>
            <input type="checkbox" name="prevent_browser_caching_options[show_on_toolbar]" value="1"<?php echo $show_on_toolbar ? ' checked' : ''; ?> />
            <?php _e( 'Show "Update CSS/JS" button on the toolbar', 'prevent-browser-caching' ); ?>
        </label><br><br>

        <button class="button" onclick="pbc_update_clear_cache_time(this)"><?php _e( 'Update CSS and JS files now', 'prevent-browser-caching' ); ?></button>

        <script>
            function pbc_close_notice(element) {
                jQuery(element).parents('.pbc-notice').fadeOut('fast');
            }

            function pbc_update_clear_cache_time( element ) {
                var update_button = jQuery( element );

                var ajax_url = '<?php echo admin_url('admin-ajax.php'); ?>';

                var data = {
                    action: 'pbc_update_clear_cache_time',
                    nonce: '<?php echo wp_create_nonce( 'pbc_update_clear_cache_time' ) ?>'
                };

                update_button.attr('disabled', true);
                jQuery.post(ajax_url, data, function() {
                    update_button.attr('disabled', false );
                    jQuery('.pbc-notice-update-caching-time').hide().addClass('is-dismissible').fadeIn('fast');
                });
            }
        </script>

        <?php
    }

    /**
     * Ajax actions to clear cache manually.
     */
    public function update_clear_cache_time()
    {
        check_ajax_referer( 'pbc_update_clear_cache_time', 'nonce' );

        update_option( 'prevent_browser_caching_clear_cache_time', Prevent_Browser_Caching::instance()->get_time_code() );

        exit;
    }

}

new Prevent_Browser_Caching_Admin_Settings();