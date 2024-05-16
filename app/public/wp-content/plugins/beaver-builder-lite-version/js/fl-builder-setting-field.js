/**
 * Controller class for working with fields in the current form.
 */
class FLBuilderSettingField {

	rootName = ''

	form = null

	field = null

	inputs = {}

	constructor( rootName, config = {} ) {
		this.rootName = rootName
		const selector = `form[data-form-id="${config.id}"]`
		this.form = FLBuilder._lightbox._node.find( selector ).get(0)
		this.field = this.form?.querySelector(`.fl-field#fl-field-${rootName}`)

		if ( ! this.field ) {
			return
		}
		this.inputs = this.getInputs( this.rootName )
	}

	getInputs() {
		const name = this.rootName
		const modes = [ 'default', 'large', 'medium', 'responsive' ]
		const inputs = {}

		if ( this.field ) {
			modes.map( mode => {
				const key = 'default' !== mode ? `${name}_${mode}` : name
				inputs[ mode ] = this.field?.querySelector(`[name="${key}"]`)
			} )
		}
		return inputs
	}

	getValues() {
		let values = {}
		for ( const key in this.inputs ) {
			values[key] = this.inputs[key] ? this.inputs[key].value : null
		}
		return values
	}

	isResponsive() {
		return !! this.field?.querySelector('.fl-field-responsive-setting')
	}

	getInheritedValue( mode = '' ) {
		const isDefaultMode = 'default' === mode || '' === mode
		let modes = []
		const values = this.getValues()

		if ( ! this.isResponsive() || isDefaultMode ) {
			return values.default
		} else {

			// Check for upstream values from the current breakpoint
			// responsive -> medium -> large -> default

			if ( 'large' === mode ) {
				if ( '' !== values.default ) {
					return values.default
				}
			} else if ( 'medium' === mode ) {
				if ( '' !== values.large ) {
					return values.large
				} else if ( '' !== values.default ) {
					return values.default
				}
			} else {
				if ( '' !== values.medium ) {
					return values.medium
				} else if ( '' !== values.large ) {
					return values.large
				} else if ( '' !== values.default ) {
					return values.default
				}
			}
		}
	}

	setValue( value, mode = '' ) {
		const input = this.inputs[mode]
		if ( input ) {
			this.setInputAndTrigger( input, value )
		}
	}

	setSubValue( subKey, value, mode = '' ) {
		const key = 'default' !== mode && '' !== mode ? `${this.rootName}_${mode}` : this.rootName
		const inputs = this.field?.querySelectorAll(`[name="${key}[${subKey}]"]`)

		if ( 0 < inputs.length ) {
			inputs.forEach( input => {

				this.setInputAndTrigger( input, value )
			} )
		}
	}

	setInputAndTrigger( input, value ) {
		if ( 'radio' === input.getAttribute('type') ) {
			if ( value === input.value ) {
				input.setAttribute( 'checked', '' )
				jQuery( input ).trigger( 'change' )
				input.dispatchEvent( new Event( 'change' ) )
			} else {
				input.removeAttribute( 'checked' )
			}
		} else {
			input.value = value
			jQuery( input ).trigger( 'change' )
			input.dispatchEvent( new Event( 'change' ) )
		}
	}
}
