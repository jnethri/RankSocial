<#
var atts       = "",
	field      = data.field,
	tooltip    = field.tooltip ? field.tooltip : {},
	multiple   = false,
	min        = false,
	max        = false,
	fillSpace  = !! data.field.fill_space,
	appearance = data.field.appearance ? data.field.appearance : ''
	icons      = data.field.icons ? data.field.icons : null,
	iconsOnly  = data.field.icons_only ?? false,
	alignIcons = 'vertical' === field.align_icons ? 'vertical' : 'horizontal',
	allowEmpty = undefined === field.allow_empty ? true : !! field.allow_empty,
	cssClass   = 'fl-button-group-field';

// Toggle data
if ( field.toggle ) {
	atts += " data-toggle='" + JSON.stringify( field.toggle ) + "'";
}

// Hide data
if ( field.hide ) {
	atts += " data-hide='" + JSON.stringify( field.hide ) + "'";
}

// Trigger data
if ( field.trigger ) {
	atts += " data-trigger='" + JSON.stringify( field.trigger ) + "'";
}

// Set data
if ( field.set ) {
	atts += " data-set='" + JSON.stringify( field.set ) + "'";
}

if ( true == field['multi-select'] || 'object' == typeof field['multi-select'] ) {
	multiple = true
}

if ( 'object' == typeof field['multi-select'] && 'min' in field['multi-select'] ) {
	min = field['multi-select'].min
}

if ( 'object' == typeof field['multi-select'] && 'max' in field['multi-select'] ) {
	max = field['multi-select'].max
}

if ( Object.keys(tooltip).length > 0 ) {
	cssClass += ' fl-button-group-field-tooltip'
}

if ( fillSpace ) {
	cssClass += ' fl-flex-grow'
}
if ( appearance ) {
	cssClass += ` fl-appearance-${appearance}`
}

// align icons
cssClass += ' fl-align-icons-' + alignIcons

// Include root name (name without breakpoint suffix) on input.
atts += " data-root-name='" + data.rootName + "'";

// Ensure value if allowEmpty is false
if ( ! allowEmpty && ! data.value ) {
	data.value = Object.keys(field.options)[0]
}

#>
<div class="{{{cssClass}}}" data-multiple="{{{multiple}}}" data-min="{{{min}}}" data-max="{{{max}}}" data-allow-empty="{{{allowEmpty}}}" data-root-name="{{{data.rootName}}}">
	<div class="fl-button-group-field-options fl-dividers">
		<# for ( var option in field.options ) {
			var selected = option === data.value ? 1 : 0;
		#>
		<# if ( option in tooltip ) { #>
			<div class="fl-button-group-tooltip-wrap">
		<# } #>
		<button
			class="fl-button-group-field-option"
			data-value="{{option}}"
			data-selected="{{selected}}"
		>
			<# if ( icons && icons[option] ) { #>
				<span class="fl-button-group-field-option-icon">{{{ icons[option] }}}</span>
			<# } #>
			{{{ iconsOnly ? null : field.options[ option ] }}}
		</button>
			<# if ( option in tooltip ) { #>
					<span class="fl-button-group-tooltip">
						<span class="fl-button-group-tooltip-text">{{{tooltip[option]}}}</span>
					</span>
				</div>
			<# } #>
		<# } #>
	</div>
	<input type="hidden" name="{{data.name}}" value="{{data.value}}" {{{atts}}} />
	<div class="fl-clear"></div>
</div>
