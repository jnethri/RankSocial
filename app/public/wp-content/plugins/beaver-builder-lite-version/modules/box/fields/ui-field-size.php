<#
const defaultValue = {
	width: {
		length: '',
		unit: '',
	},
	min_width: {
		length: '',
		unit: '',
	},
	max_width: {
		length: '',
		unit: '',
	},
	height: {
		length: '',
		unit: '',
	},
	min_height: {
		length: '',
		unit: '',
	},
	max_height: {
		length: '',
		unit: '',
	},
}
const value = { ...defaultValue, ...data.value }

const fieldConfig = name => ( {
	name: data.name + '[][' + name + '][length]',
	value: value[name].length,
	unit_name: data.name + '[][' + name + '][unit]',
	unit_value: value[name].unit,
	field: {
		units: [ 'px', '%', 'em', 'rem', 'vw', 'vh' ],
		slider: {
			min: 0,
			max: 1500,
			step: 1,
		},
	},
} );
#>
<div class="fl-builder-field-grid fl-builder-size-field-grid">
	<label>
		<?php _e( 'Min Width', 'fl-builder' ); ?>
	</label>
	<div class="fl-compound-field-setting">
		{{{ wp.template( 'fl-builder-field-unit' )( fieldConfig( 'min_width' ) ) }}}
	</div>
	<label>
		<?php _e( 'Min Height', 'fl-builder' ); ?>
	</label>
	<div class="fl-compound-field-setting">
		{{{ wp.template( 'fl-builder-field-unit' )( fieldConfig( 'min_height' ) ) }}}
	</div>

	<label>
		<?php _e( 'Width', 'fl-builder' ); ?>
	</label>
	<div class="fl-compound-field-setting">
		{{{ wp.template( 'fl-builder-field-unit' )( fieldConfig( 'width' ) ) }}}
	</div>
	<label>
		<?php _e( 'Height', 'fl-builder' ); ?>
	</label>
	<div class="fl-compound-field-setting">
		{{{ wp.template( 'fl-builder-field-unit' )( fieldConfig( 'height' ) ) }}}
	</div>

	<label>
		<?php _e( 'Max Width', 'fl-builder' ); ?>
	</label>
	<div class="fl-compound-field-setting">
		{{{ wp.template( 'fl-builder-field-unit' )( fieldConfig( 'max_width' ) ) }}}
	</div>
	<label>
		<?php _e( 'Max Height', 'fl-builder' ); ?>
	</label>
	<div class="fl-compound-field-setting">
		{{{ wp.template( 'fl-builder-field-unit' )( fieldConfig( 'max_height' ) ) }}}
	</div>
</div>
