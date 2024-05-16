<#
const strings = {
	columns: '<?php _e( 'Columns', 'fl-builder' ); ?>',
	rows: '<?php _e( 'Rows', 'fl-builder' ); ?>',
	auto_columns: '<?php _e( 'Auto Columns', 'fl-builder' ); ?>',
	auto_rows: '<?php _e( 'Auto Rows', 'fl-builder' ); ?>',
	clear: '<?php _e( 'Clear', 'fl-builder' ); ?>',
	addNew: '<?php _e( 'Add New...', 'fl-builder' ); ?>',
	clone: '<?php _e( 'Duplicate', 'fl-builder' ); ?>',
	delete: '<?php _e( 'Remove', 'fl-builder' ); ?>',
}
const defaults = {
	columns: [],
	rows: [],
	auto_columns: [],
	auto_rows: []
}
const value = { ...defaults, ...data.value }
#>
<fl-grid-tracklist
	name='{{{ data.name }}}'
	value='{{{ JSON.stringify( value ) }}}'
	strings='{{{ JSON.stringify( strings ) }}}'
></fl-grid-tracklist>
