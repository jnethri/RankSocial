<?php

$button_node_id = "fl-node-$id";

if ( isset( $settings->id ) && ! empty( $settings->id ) ) {
	$button_node_id = esc_attr( $settings->id );
}

?>
<div class="<?php echo $module->get_classname(); ?>">
	<?php if ( isset( $settings->click_action ) && 'lightbox' == $settings->click_action ) : ?>
		<a href="<?php echo 'video' == $settings->lightbox_content_type ? esc_url( do_shortcode( $settings->lightbox_video_link ) ) : '#'; ?>" class="fl-button <?php echo $button_node_id; ?> fl-button-lightbox<?php echo ( 'enable' == $settings->icon_animation ) ? ' fl-button-icon-animation' : ''; ?>"<?php echo $module->get_role(); ?>>
	<?php else : ?>
		<a href="<?php echo esc_url( do_shortcode( $settings->link ) ); ?>"<?php echo ( isset( $settings->link_download ) && 'yes' === $settings->link_download ) ? ' download' : ''; ?> target="<?php echo esc_attr( $settings->link_target ); ?>" class="fl-button<?php echo ( 'enable' == $settings->icon_animation ) ? ' fl-button-icon-animation' : ''; ?>"<?php echo $module->get_role(); ?><?php echo $module->get_rel(); ?>>
	<?php endif; ?>
		<?php
		if ( ! empty( $settings->icon ) && ( 'before' == $settings->icon_position || ! isset( $settings->icon_position ) ) ) :
			?>
		<i class="fl-button-icon fl-button-icon-before <?php echo $settings->icon; ?>" aria-hidden="true"></i>
		<?php endif; ?>
		<?php if ( ! empty( $settings->text ) ) : ?>
		<span class="fl-button-text"><?php echo $settings->text; ?></span>
		<?php endif; ?>
		<?php
		if ( ! empty( $settings->icon ) && 'after' == $settings->icon_position ) :
			?>
		<i class="fl-button-icon fl-button-icon-after <?php echo $settings->icon; ?>" aria-hidden="true"></i>
		<?php endif; ?>
	</a>
</div>
<?php if ( 'lightbox' == $settings->click_action && 'html' == $settings->lightbox_content_type && isset( $settings->lightbox_content_html ) ) : ?>
	<div class="<?php echo $button_node_id; ?> fl-button-lightbox-content mfp-hide">
		<?php echo $settings->lightbox_content_html; ?>
	</div>
<?php endif; ?>
