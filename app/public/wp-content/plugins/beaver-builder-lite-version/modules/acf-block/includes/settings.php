<?php

$block  = FLACFBlockModule::get_block_data( $data['node_id'], $settings );
$fields = acf_get_block_fields( $block );

?>
<div class="acf-block-fields acf-fields">
	<?php echo acf_render_fields( $fields, $block['id'] ); ?>
</div>
