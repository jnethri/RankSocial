<?php
/**
 * Plugin Name: Prevent Browser Caching
 * Description: Updates the assets version of all CSS and JS files. Shows the latest changes on the site without asking the client to clear browser cache.
 * Version: 2.3.5
 * Author: Kostya Tereshchuk
 * Author URI: https://tutori.org/kostya/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: prevent-browser-caching
 * Domain Path: /lang/
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! function_exists( 'prevent_browser_caching_plugin_actions' ) ) {
    /**
     * Add settings to plugin links.
     * @param $actions
     * @return mixed
     */
    function prevent_browser_caching_plugin_actions( $actions )
    {
        array_unshift( $actions, "<a href=\"" . menu_page_url( 'prevent-browser-caching', false ) . "\">" . esc_html__( "Settings" ) . "</a>" );
        return $actions;
    }
    add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'prevent_browser_caching_plugin_actions', 10, 1 );
}

if ( ! function_exists( 'prevent_browser_caching_load_textdomain' ) ) {
    /**
     * Set languages directory.
     */
    function prevent_browser_caching_load_textdomain()
    {
        load_plugin_textdomain( 'prevent-browser-caching', false, dirname( plugin_basename( __FILE__ ) ) . '/lang/' );
    }
    add_action( 'plugins_loaded', 'prevent_browser_caching_load_textdomain' );
}

if ( ! function_exists( 'prevent_browser_caching' ) ) {
    /**
     * Changes the version of CSS and JS files.
     * Disables loading Prevent_Browser_Caching class if this function is used before setup theme.
     *
     * @param array $args
     */
    function prevent_browser_caching( $args = array() ) {
        if ( ! class_exists( 'Prevent_Browser_Caching_Function' ) ) {
            include_once 'includes/class-prevent-browser-caching-function.php';
        }

        Prevent_Browser_Caching_Function::instance( $args );
    }
}

if ( ! function_exists( 'maybe_load_class_prevent_browser_caching' ) ) {
    /**
     * Load Prevent_Browser_Caching class if the function prevent_browser_caching is not used before setup theme.
     */
    function maybe_load_class_prevent_browser_caching()
    {
        if ( ! class_exists( 'Prevent_Browser_Caching' ) && ! class_exists( 'Prevent_Browser_Caching_Function' ) ) {
            include_once 'includes/class-prevent-browser-caching.php';
        }
    }

    add_action( 'after_setup_theme', 'maybe_load_class_prevent_browser_caching' );
}

if ( is_admin() ) {
    include_once 'includes/admin/class-prevent-browser-caching-admin-settings.php';
}