class FLGridAreaField extends HTMLElement {
	connectedCallback() {
		this.bindEvents()
	}

	getHiddenInput() {
		const name = this.getAttribute( 'data-name' )
		const input = this.querySelector(`input[name="${name}[css]"]`)
		return input
	}

	setHiddenInput( value ) {
		const input = this.getHiddenInput()
		if ( input ) {
			input.value = value
			input.dispatchEvent( new Event( 'change' ) )
		}
	}

	getInputs() {
		let keyed = {}
		const inputs = this.querySelectorAll('input[type="hidden"]')
		inputs.forEach( input => {
			const name = input.getAttribute('name').split('[')[1].replace(']', '').trim()
			keyed[name] = input
		} )
		return keyed
	}

	getValues() {
		const inputs = this.getInputs()
		let values = {
			css: '',
			start: null,
			span: null,
			end: null,
		}
		for( let name in inputs ) {
			values[name] = inputs[name].value
		}
		return values
	}

	bindEvents() {
		const inputs = this.getInputs()
		for( let name in inputs ) {
			if ( 'css' === name ) {
				continue
			}
			inputs[name].addEventListener( 'change', this.onNumberChanged.bind(this) )
		}
	}

	onNumberChanged() {
		const values = this.getValues()
		const css = this.formatCSSValue( values.start, values.span, values.end )
		this.setHiddenInput( css )
	}

	formatCSSValue( start = null, span = null, end = null ) {
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
}
customElements.define( "fl-grid-area-field", FLGridAreaField )
