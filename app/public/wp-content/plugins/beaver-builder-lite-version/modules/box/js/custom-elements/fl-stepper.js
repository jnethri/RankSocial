class FLStepperInput extends HTMLElement {
	constructor() {
		super()
		this.attachShadow( { mode: 'open' } )
		this.template = document.createElement( 'template' )
	}

	connectedCallback() {
		this.template.innerHTML = this.render( this.props )
		this.shadowRoot.replaceChildren( this.template.content.cloneNode( true ) )
		this.bindEvents()
	}

	getHiddenInput() {
		const name = this.getAttribute( 'data-name' )
		const input = this.querySelector(`input[name="${name}"]`)
		return input
	}

	setHiddenInput( value ) {
		const input = this.getHiddenInput()
		input.value = value
		input.dispatchEvent( new Event( 'change' ) )
	}

	onHiddenChanged(e) {
		const value = e.target.value
		const numberInput = this.shadowRoot.querySelector('input')
		if ( value !== numberInput.value ) {
			numberInput.value = value
			numberInput.dispatchEvent( new Event( 'change' ) )
		}
	}

	bindEvents() {

		// Increment buttons
		const buttons = this.shadowRoot.querySelectorAll('button')
		buttons.forEach( button => {
			button.addEventListener( 'click', this.onStepClick.bind(this) )
		} )

		// Hidden Input
		this.getHiddenInput().addEventListener( 'change', this.onHiddenChanged.bind(this) )

		// Number Input
		this.shadowRoot.querySelector('input[type=number]').addEventListener( 'keyup', this.onNumberInputChanged.bind(this) )
	}

	onNumberInputChanged( e ) {
		const v = e.target.value
		this.setHiddenInput( v )
	}

	onStepClick( e ) {
		const hidden = this.getHiddenInput()
		const operation = e.target.getAttribute('data-operation')
		let value = this.step( hidden.value, operation )
		this.setHiddenInput( value )
	}

	step( v = 0, op = '+' ) {
		const step = this.hasAttribute('step') ? parseInt( this.getAttribute('step') ) : 1
		const min = this.hasAttribute('min') ? parseInt( this.getAttribute('min') ) : null
		const max = this.hasAttribute('max') ? parseInt( this.getAttribute('max') ) : null
		const value = ! v ? 0 : v
		const steppedValue = '-' === op ? parseInt( value ) - step : parseInt( value ) + step

		if ( null !== min && steppedValue < min ) {
			return min
		} else if ( null !== max && steppedValue > max ) {
			return max
		}
		return steppedValue
	}

	render() {
		const value = this.getHiddenInput().value
		const step = this.hasAttribute('step') ? parseInt( this.getAttribute('step') ) : 1
		const min = this.hasAttribute('min') ? parseInt( this.getAttribute('min') ) : null
		const max = this.hasAttribute('max') ? parseInt( this.getAttribute('max') ) : null
		return `
			<style>
				:host {
					flex-grow: 1;
					color: inherit;
					display: grid;
				}
				.wrap {
					display: flex;
					min-height: var(--fl-builder-target-size);
					justify-content: space-evenly;
					align-items: center;
					color: inherit;
				}
				.wrap:hover button,
				.wrap:focus-within button {
					opacity: 1;
				}
				input {
					min-width: 2ch;
					max-width: 4ch;
					border: none;
					outline: none;
					text-align: center;
					padding: 0;
					place-self: stretch;
					background: transparent;
					color: inherit;
				}
				/* Chrome, Safari, Edge, Opera */
				input::-webkit-outer-spin-button,
				input::-webkit-inner-spin-button {
				  -webkit-appearance: none;
				  margin: 0;
				}
				/* Firefox */
				input[type=number] {
				  -moz-appearance: textfield;
				}
				button {
					color: inherit;
					background: transparent;
					border: none;
					outline: none;
					width: 24px;
					height: 24px;
					display: flex;
					justify-content: center;
					align-items: center;
					opacity: 0;
					border-radius: 50%;
					padding: 0;
				}
				button > * {
					pointer-events: none;
				}
				button:hover {
					background: var(--fl-builder-platter-bg-color);
				}
			</style>
			<div class="wrap">
				<button data-operation="-">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path d="M15.6569 10.0001H4.34315" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					</svg>
				</button>
				<input
					type="number"
					min="${min}"
					max="${max}"
					step="${step}"
					value="${value}"
				/>
				<button data-operation="+">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path d="M15.6569 10.0001H4.34315" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						<path d="M10 4.34326V15.657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					</svg>
				</button>
			</div>
		`
	}
}
customElements.define( "fl-stepper", FLStepperInput )
