<?php

$active   = FLBuilderModel::is_builder_active();
$selector = $active ? 'html.fl-responsive-preview-enabled' : 'html';

?>
@media (min-width: <?php echo $global_settings->large_breakpoint + 1; ?>px) {
	<?php echo $selector; ?> .fl-visible-large:not(.fl-visible-desktop),
	<?php echo $selector; ?> .fl-visible-medium:not(.fl-visible-desktop),
	<?php echo $selector; ?> .fl-visible-mobile:not(.fl-visible-desktop) {
		display: none;
	}
}

@media (min-width: <?php echo $global_settings->medium_breakpoint + 1; ?>px) and (max-width: <?php echo $global_settings->large_breakpoint; ?>px) {
	<?php echo $selector; ?> .fl-visible-desktop:not(.fl-visible-large),
	<?php echo $selector; ?> .fl-visible-medium:not(.fl-visible-large),
	<?php echo $selector; ?> .fl-visible-mobile:not(.fl-visible-large) {
		display: none;
	}
}

@media (min-width: <?php echo $global_settings->responsive_breakpoint + 1; ?>px) and (max-width: <?php echo $global_settings->medium_breakpoint; ?>px) {
	<?php echo $selector; ?> .fl-visible-desktop:not(.fl-visible-medium),
	<?php echo $selector; ?> .fl-visible-large:not(.fl-visible-medium),
	<?php echo $selector; ?> .fl-visible-mobile:not(.fl-visible-medium) {
		display: none;
	}
}

@media (max-width: <?php echo $global_settings->responsive_breakpoint; ?>px) {
	<?php echo $selector; ?> .fl-visible-desktop:not(.fl-visible-mobile),
	<?php echo $selector; ?> .fl-visible-large:not(.fl-visible-mobile),
	<?php echo $selector; ?> .fl-visible-medium:not(.fl-visible-mobile) {
		display: none;
	}
}
