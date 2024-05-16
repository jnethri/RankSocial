<?php
$settings = FLBuilderUserSettings::get()['pinned'];
$style    = '';
if ( isset( $settings['position'] ) && '' !== $settings['position'] ) {
	$style .= "margin-{$settings['position']}:{$settings['width']}px;";
}
?>
<!DOCTYPE html>
<html class="fl-builder-edit fl-builder-is-showing-toolbar">
	<head>
		<meta name='viewport' content='width=device-width, initial-scale=1.0' />
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?> <?php echo "style='{$style}'"; ?>>
		<div class="fl-builder-ui-iframe-toolbar">
			<div class="fl-builder-ui-iframe-breakpoint-text">
				<?php _e( 'Breakpoint', 'fl-builder' ); ?>
			</div>
			<select class="fl-builder-ui-iframe-breakpoint fl-builder-button">
				<option value="default"><?php _e( 'Extra Large', 'fl-builder' ); ?></option>
				<option value="large"><?php _e( 'Large', 'fl-builder' ); ?></option>
				<option value="medium"><?php _e( 'Medium', 'fl-builder' ); ?></option>
				<option value="responsive"><?php _e( 'Small', 'fl-builder' ); ?></option>
			</select>
			<div class="fl-builder-ui-iframe-size">
				<input class="fl-builder-ui-iframe-width" type="number" value="300" />
				<div>x</div>
				<input class="fl-builder-ui-iframe-height" type="number" value="500" />
				<div>px</div>
			</div>
			<select class="fl-builder-ui-iframe-scale fl-builder-button">
				<option value="100">100%</option>
				<option value="75">75%</option>
				<option value="50">50%</option>
				<option value="fit"><?php _e( 'Fit to Window', 'fl-builder' ); ?></option>
			</select>
			<button class="fl-builder-button fl-builder-button-large fl-builder-ui-iframe-exit">
				<?php _e( 'Exit', 'fl-builder' ); ?>
			</button>
		</div>
		<div class="fl-builder-ui-iframe-wrap">
			<div class="fl-builder-ui-iframe-canvas">
				<div class="fl-builder-ui-iframe-resize fl-builder-ui-iframe-resize-s ui-resizable-handle ui-resizable-s"><div></div></div>
				<div class="fl-builder-ui-iframe-resize fl-builder-ui-iframe-resize-e ui-resizable-handle ui-resizable-e"><div></div></div>
				<div class="fl-builder-ui-iframe-resize fl-builder-ui-iframe-resize-w ui-resizable-handle ui-resizable-w"><div></div></div>
				<iframe
					id="fl-builder-ui-iframe"
					class="fl-builder-ui-iframe"
					src="<?php echo FLBuilderModel::get_edit_url( false, false ); ?>"
					frameborder="0"
				></iframe>
			</div>
		</div>
		<?php do_action( 'wp_footer' ); ?>
	</body>
</html>
