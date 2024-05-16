<hr />
<?php
// first check we have a download for the current version.
$plugin_data = get_plugin_data( FL_BUILDER_FILE );
$plugin_name = $plugin_data['Name'];
$themer      = false;

foreach ( $subscription->downloads as $ver ) {
	if ( stristr( $ver, 'Themer' ) ) {
		$themer = true;
	}
}

if ( '{FL_BUILDER_NAME}' !== $plugin_data['Name'] && ! in_array( $plugin_name, $subscription->downloads, true ) ) {

	$show_warning = false;
	$version      = '';

	// find available plugin Version
	foreach ( $subscription->downloads as $ver ) {
		if ( stristr( $ver, 'Beaver Builder Plugin' ) ) {
			preg_match( '#\((.*)\sVersion\)$#', $ver, $match );
			$version = ( isset( $match[1] ) ) ? $match[1] : false;
		}
	}

	switch ( $plugin_data['Name'] ) {
		// pro - show warning if standard is pnly available version
		case 'Beaver Builder Plugin (Pro Version)':
			$show_warning = ( 'Standard' === $version ) ? true : false;
			break;
		// agency show warning if available is NOT agency
		case 'Beaver Builder Plugin (Agency Version)':
			$show_warning = ( 'Agency' !== $version ) ? true : false;
			break;
	}

	if ( ! $version ) {
		$show_warning = true;
	}

	if ( $show_warning ) {
		$header_txt = __( 'Beaver Builder updates issue!!', 'fl-builder' );
		// translators: %s: Product name
		$txt = sprintf( __( 'Updates for Beaver Builder will not work as you appear to have %s activated but it is not in your available downloads.', 'fl-builder' ), '<strong>' . $plugin_name . '</strong>' );
		printf(
			'<div class="notice notice-error"><p><strong>%s</strong></p><p>%s</p></div>',
			$header_txt,
			$txt
		);
	}
}
// themer installed but no licence?
if ( ! $themer && defined( 'FL_THEME_BUILDER_VERSION' ) ) {
	echo( '<div class="notice notice-error"><p><strong>Beaver Themer updates issue!</strong></p><p>Updates for Beaver Themer will not work as you appear to have Beaver Themer activated but it is not in your available downloads</p></div>' );
}

?>
<h3><?php _e( 'Available Downloads', 'fl-builder' ); ?></h3>
<p><?php _e( 'The following downloads are currently available for remote update with the subscription(s) associated with this license.', 'fl-builder' ); ?></p>
<ul class='subscription-downloads'>
	<?php
	$downloads = apply_filters( 'fl_builder_subscription_downloads', $subscription->downloads );
	foreach ( $downloads as $download ) {
		echo '<li>' . $download . '</li>';
	}
	do_action( 'fl_builder_after_subscription_downloads' );
	?>
</ul>

<?php if ( ! $themer ) : ?>
	<div class="themer">
	<h3><?php _e( 'Take Beaver Builder Even Further', 'fl-builder' ); ?></h3>
	<h4>
		<strong>Beaver Themer</strong> - <a target="_blank" href="
		<?php
		echo FLBuilderModel::get_store_url( 'beaver-themer', array(
			'utm_medium'   => 'bb-pro',
			'utm_source'   => 'license-settings-page',
			'utm_campaign' => 'themer-upsell',
		) );
		?>
		">Click here </a> to learn more about this Add-on</h4>
		<ul>
			<li><span class="dashicons dashicons-saved"></span>Create custom headers and footer layouts that override your theme.</li>
			<li><span class="dashicons dashicons-saved"></span>Design unique page layouts for index, archive, search, single posts and 404 pages.</li>
			<li><span class="dashicons dashicons-saved"></span>Customize WooCommerce Shop, Checkout, Cart and My Account pages.</li>
			<li><span class="dashicons dashicons-saved"></span>Create layout "parts" to insert above or below headers, footers, or the content area.</li>
		</ul>
	</div>
<?php endif; ?>
