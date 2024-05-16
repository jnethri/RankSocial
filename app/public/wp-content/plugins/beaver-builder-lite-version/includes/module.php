<?php $container_element = ( ! empty( $module->settings->container_element ) ? $module->settings->container_element : 'div' ); ?>
<<?php echo $container_element; ?><?php FLBuilder::render_module_attributes( $module ); ?>>
	<div class="fl-module-content fl-node-content">
		<?php include FL_BUILDER_DIR . 'includes/module-content.php'; ?>
	</div>
</<?php echo $container_element; ?>>
