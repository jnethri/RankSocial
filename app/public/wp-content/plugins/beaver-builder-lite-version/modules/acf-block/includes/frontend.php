<?php

$block = FLACFBlockModule::get_block_data( $module->node, $settings );

echo acf_rendered_block( $block, '', true, get_the_ID(), null, $block['_acf_context'] );
