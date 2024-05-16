class FLGridTrackList extends FLElement {

	defaultStrings = {
		columns: 'Columns',
		rows: 'Rows',
		auto_columns: 'Auto Columns',
		auto_rows: 'Auto Rows',
		clear: 'Clear',
		addNew: 'Add New...',
		clone: 'Duplicate',
		delete: 'Remove',
	}

	connectedCallback() {
		this.template.innerHTML = this.render()
		this.replaceChildren( this.template.content.cloneNode( true ) )
		this.unbindEventsCallback = this.bindEvents()
	}

	bindEvents() {
		this.lists = this.querySelectorAll( 'fl-layer-group' )
		const onChange = this.onChange.bind(this)
		this.lists.forEach( list => {
			list.addEventListener( 'change', () => onChange( list ) )
		} )
	}

	onChange( list ) {

		// Update hidden input for this list
		const inputName = `${this.name}[${list.name}]`
		const input = this.querySelector(`input[name="${inputName}"]`)

		input?.setAttribute( 'value', list.value )
		input?.dispatchEvent( new Event( 'change' ) )

		const cssInputName = `${this.name}[${list.name}_css]`
		const css = this.getCSS( list.value )
		const cssInput = this.querySelector(`input[name="${cssInputName}"]`)
		cssInput?.setAttribute( 'value', css )
		cssInput?.dispatchEvent( new Event( 'change' ) )
	}

	get name() {
		return this.getAttribute( 'name' )
	}

	getCSS( value ) {
		if ( '' === value ) {
			return ''
		}

		let layers = JSON.parse( value )
		if ( 'string' === typeof layers ) {
			layers = []
		}

		const tracks = layers.map( layer => {
			switch( layer.type ) {
				case 'basic-track':
					const count = layer.value
					return `repeat(${count},1fr)`
				default:
					return layer.value
			}
		} )
		return tracks.join(' ')
	}

	render() {
		const strings = this.strings
		const values = JSON.parse( this.getAttribute( 'value' ) )

		this.removeAttribute( 'value' )
		const lists = [ 'columns', 'rows' ]
		return `
			<div class="fl-layer-group-cluster" style="display: grid; gap: 1px">
				${ lists.map( list => {
						const value = Array.isArray( values[list] ) ? JSON.stringify( values[list] ) : ''
						const inputName = `${ this.name }[${list}]`
						const cssInputName = `${ this.name }[${list}_css]`

						return `
							<fl-layer-group
								name='${list}'
								value='${ value }'
								strings='${ JSON.stringify( strings ) }'
							>
								<fl-layer-group-heading
									slot='before'
									strings='${ JSON.stringify( {
										...strings,
										clear: strings.clear,
									} ) }'
								>${ strings[list] }</fl-layer-group-heading>
							</fl-layer-group>
							<input type="hidden" name='${ inputName }' value='${ value }' />
							<input type="hidden" name='${ cssInputName }' value='${ this.getCSS( value ) }' />
						`
				} ).join('') }
			</div>
		`
	}
}
customElements.define( "fl-grid-tracklist", FLGridTrackList )
