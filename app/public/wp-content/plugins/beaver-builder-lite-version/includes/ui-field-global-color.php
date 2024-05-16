<#

var names = data.names;

if ( ! names ) {
	if ( data.isMultiple ) {
		names = {
			uid: data.name + '[' + data.index + '][uid]',
			label: data.name + '[' + data.index + '][label]',
			color: data.name + '[' + data.index + '][color]',
		};
	} else {
		names = {
			uid: data.name + '[][uid]',
			label: data.name + '[][label]',
			color: data.name + '[][color]',
		};
	}
}

var color = wp.template( 'fl-builder-field-color' )({
	name: names.color,
	value: ( ( 'undefined' != typeof data.value.color ) ? data.value.color : '' ),
	field: {
		className: 'fl-global-color-field-color',
		show_reset: true,
		show_alpha: true,
	},
});

#>
<div class="fl-global-color-field">
	<div class="fl-global-color-row">
		<div class="fl-global-color-field-wrapper">
			<label for="{{names.label}}" class="fl-global-color-field-label"><?php _e( 'Name', 'fl-builder' ); ?></label>
			<input type="text" name="{{names.label}}" id="{{names.label}}" class="fl-global-color-field-input text text-full" value="{{data.value.label}}" placeholder="" />
		</div>
	</div>
	<div class="fl-global-color-row">
		<div class="fl-global-color-field-wrapper">
			<label class="fl-global-color-field-label"><?php _e( 'Color', 'fl-builder' ); ?></label>
			{{{color}}}
		</div>
	</div>
	<div class="fl-global-color-row">
		<div class="fl-global-color-field-controls">
			<i class="fl-global-color-copy far fa-clipboard" title="<?php _e( 'Copy Color Code', 'fl-builder' ); ?>"></i>
		</div>
	</div>
	<input type="hidden" class="fl-global-color-field-uid" name="{{names.uid}}" value="{{data.value.uid}}" />
</div>
