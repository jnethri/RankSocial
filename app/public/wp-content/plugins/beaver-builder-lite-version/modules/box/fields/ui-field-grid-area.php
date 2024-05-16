<#
const defaultValue = {
	start: '',
	span: '',
	end: '',
}
const value = { ...defaultValue, ...data.value }

const formatCSSValue = ( start = null, span = null, end = null ) => {
	let string = []

	if ( '' !== start ) {
		string.push(start)
	}
	if ( '' !== span ) {
		string.push(`span ${span}`)
	}
	if ( end && ( !start || !span ) ) {
		string.push(end)
	}
	return string.join(' / ')
}
const cssString = formatCSSValue( value.start, value.span, value.end )
#>
<fl-grid-area-field class="fl-builder-field-grid" data-name="{{{data.name}}}">
	<label><?php _e( 'Start', 'fl-builder' ); ?></label>
	<div class="fl-compound-field-setting">
		<fl-stepper data-name="{{{data.name}}}[start]">
			<input type="hidden" name="{{{data.name}}}[start]" value="{{{value.start}}}" />
		</fl-stepper>
	</div>
	<label><?php _e( 'Span', 'fl-builder' ); ?></label>
	<div class="fl-compound-field-setting">
		<fl-stepper data-name="{{{data.name}}}[span]" min="1">
			<input type="hidden" name="{{{data.name}}}[span]" value="{{{value.span}}}" />
		</fl-stepper>
	</div>

	<?php // in the middle on purpose - long story ?>
	<input type="hidden" name="{{{data.name}}}[css]" value="{{{cssString}}}" />

	<label><?php _e( 'End', 'fl-builder' ); ?></label>
	<div class="fl-compound-field-setting">
		<fl-stepper data-name="{{{data.name}}}[end]">
			<input type="hidden" name="{{{data.name}}}[end]" value="{{{value.end}}}" />
		</fl-stepper>
	</div>
</fl-grid-area-field>
