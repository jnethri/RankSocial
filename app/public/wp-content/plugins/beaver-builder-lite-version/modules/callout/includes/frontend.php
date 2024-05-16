<div class="<?php echo $module->get_classname(); ?>">
	<?php

	// Image left
	$module->render_image( 'left' );

	?>
	<div class="fl-callout-content">
		<?php

		// Image above title
		$module->render_image( 'above-title' );

		// Title
		$module->render_title();

		// Image below title
		$module->render_image( 'below-title' );

		// Text Content
		$module->render_text_content();

		?>
	</div>
	<?php

	// Image right
	$module->render_image( 'right' );

	?>
</div>
