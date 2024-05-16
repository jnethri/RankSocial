/**
 * Custom element class that represents an array of layer objects.
 */
class FLLayerGroup extends FLElement {

	defaultStrings = {
		addNew: 'Add new TEST'
	}

	/**
	 * Array of element attributes to watch.
	 *
	 * @return Array
	 */
	static get observedAttributes() {
		return [ 'value', 'name', 'insert-position'  ]
	}

	/**
	 * Getter for name attribute
	 *
	 * @return String
	 */
	get name() {
		return this.getAttribute( 'name' )
	}

	/**
	 * Getter for value attribute
	 *
	 * @return String
	 */
	get value() {
		return this.getAttribute( 'value' )
	}

	get insertPosition() {
		if ( this.hasAttribute( 'insert-position' ) ) {
			return 'before' === this.getAttribute( 'insert-position' ) ? 'before' : 'after'
		}
		return 'after'
	}

	/**
	 * Setup Element shadowDOM and template
	 *
	 * @return void
	 */
	constructor() {
		super()
		this.attachShadow( { mode: 'open' } )
	}
	/**
	 * Set up element after connected to DOM
	 *
	 * @return void
	 */
	connectedCallback() {
		this.template.innerHTML = this.renderShadow()
		this.shadowRoot.replaceChildren( this.template.content.cloneNode( true ) )
		this.unbindEventsCallback = this.bindEvents()
	}

	/**
	 * Fires in connectedCallback() after DOM renders
	 *
	 * @return void
	 */
	bindEvents() {

		// Reorder List Items
		const onReorder = this.onReorder.bind( this )
		const ul = this.shadowRoot.querySelector( 'ul' )
		jQuery( ul ).sortable( {
			items: 'li',
			cursor: 'move',
			distance: 5,
			opacity: 0.75,
			placeholder: 'fl-layer-placeholder',
			stop: onReorder,
			tolerance: 'pointer',
			axis: "y",
			helper: 'clone',
		} )

		// Header Buttons (add, clear)
		const header = this.querySelector('fl-layer-group-heading')
		header.layerGroup = this
		const addLayer = this.addLayer.bind( this )
		const clearLayers = this.clearLayers.bind( this )
		header?.addEventListener( 'add', addLayer )
		header?.addEventListener( 'reset', clearLayers )

		// Remove Buttons (Layer Menu)
		const removeLayer = this.removeLayer.bind( this )
		this.addEventListener( 'layer-remove', removeLayer )

		// Duplicate Buttons (Layer Menu)
		const cloneLayer = this.cloneLayer.bind( this )
		this.addEventListener( 'layer-clone', cloneLayer )
		//const cloneButtons = this.shadowRoot.querySelectorAll( 'button.clone' )
		//cloneButtons.forEach( button => button.addEventListener( 'click', cloneLayer ) )

		// Listen for value changes on layer items
		const onLayerChange = this.onLayerValueChange.bind( this )
		this.addEventListener( 'layer-change', onLayerChange )

		// Watch DOM mutations (like removing items)
		const observer = new MutationObserver( ( list, observer ) => {
			for ( const mutation of list ) {
				if ( 'childList' === mutation.type ) {
					if ( mutation.removedNodes.length ) {
						this.updateValueAttribute()
					}
				}
			}
		} )
		observer.observe( ul, { childList: true } )

		// Unbind Events on disconnect
		return () => {
			jQuery( ul ).sortable( 'destroy' )

			header?.removeEventListener( 'add', addLayer )
			header?.removeEventListener( 'reset', clearLayers )

			//cloneButtons.forEach( button => button.removeEventListener( 'click', cloneLayer ) )
			this.removeEventListener( 'layer-remove', removeLayer )
			this.removeEventListener( 'layer-clone', cloneLayer )
			this.removeEventListener( 'layer-change', onLayerChange )

			observer.disconnect()
		}
	}

	supportedLayerTypes() {
		return [ 'text', 'basic-track' ]
	}

	supportsMultipleLayerTypes() {
		return this.supportedLayerTypes().length > 1
	}

	/**
	 * Get all layer items
	 *
	 * @return NodeList
	 */
	getListElements() {
		const selector = 'li:not(.ui-sortable-helper, .fl-layer-placeholder) > fl-layer-group-item'
		return this.shadowRoot.querySelectorAll( selector )
	}

	/**
	 * Reset value attribute based on values of each child layer.
	 *
	 * @return void
	 */
	updateValueAttribute() {
		const newValue = JSON.stringify( this.getLayerValues() )
		this.setAttribute( 'value', newValue )
		this.dispatchEvent( new Event( 'change' ) )
	}

	/**
	 * Handle updating value after sorting the list
	 *
	 * @return void
	 */
	onReorder() {
		this.updateValueAttribute()
	}

	/**
	 * Listen for value changes on each child layer
	 *
	 * @return void
	 */
	onLayerValueChange() {
		this.updateValueAttribute()
	}

	/**
	 * Get array of all layer objects
	 *
	 * @return Array
	 */
	getLayerValues() {
		return Array.from( this.getListElements() ).map( item => {
			return JSON.parse( item.getAttribute('value') )
		} )
	}

	getDefaultLayerProps() {
		if ( this.hasAttribute( 'default' ) && '' !== this.getAttribute( 'default' ) ) {
			return JSON.parse( this.getAttribute( 'default' ) )
		} else {
			return { type: 'text', value: '' }
		}
	}

	addLayer( e ) {
		const ul = this.shadowRoot.querySelector( 'ul' )

		const template = document.createElement( 'template' )
		template.innerHTML = this.renderLayer( e.detail )
		const node = template.content.cloneNode( true )

		if ( 'before' === this.insertPosition ) {
			ul.prepend( node )
		} else {
			ul.append( node )
		}

		this.setAttribute( 'value', JSON.stringify( this.getLayerValues() ) )
		this.dispatchEvent( new Event( 'change' ) )
	}

	cloneLayer( e ) {
		const layer = e.detail
		const template = document.createElement( 'template' )
		template.innerHTML = this.renderLayer( { ...layer.value } )
		const node = template.content.cloneNode( true )
		layer.parentElement.after( node )
		layer.parentElement.nextElementSibling?.querySelector('input')?.focus()
		this.updateValueAttribute()
	}

	removeLayer( e ) {
		const item = e.detail.closest('li')

		// Locate next item before we remove the current one
		let next = null
		if ( item?.nextElementSibling ) {
			next = item?.nextElementSibling
		} else if ( item?.previousElementSibling ) {
			next = item?.previousElementSibling
		}

		item?.remove()

		// Focus next item
		next?.querySelector('input,select')?.focus()
	}

	clearLayers() {
		const ul = this.shadowRoot.querySelector( 'ul' )
		while ( ul.firstChild ) {
			ul.removeChild( ul.firstChild )
		}

		// Empty placeholder??
		// Create new layer node
		const template = document.createElement( 'template' )
		template.innerHTML = this.renderLayer( this.getDefaultLayerProps() )
		const node = template.content.cloneNode( true )
		ul.appendChild( node )
		ul.querySelector( 'input' )?.focus()

		this.setAttribute( 'value', JSON.stringify( this.getLayerValues() ) )
		this.dispatchEvent( new Event( 'change' ) )
	}

	/**
	 * Render single list item html string
	 *
	 * @return String
	 */
	renderLayer( props ) {
		const value = JSON.stringify( props )
		const strings = JSON.stringify( this.strings )
		return `
			<li>
				<fl-layer-group-item
					value='${ value }'
					strings='${ strings }'
				>
				</fl-layer-group-item>
			</li>
		`
	}

	renderDefaultLayer() {
		return this.renderLayer( this.getDefaultLayerProps() )
	}

	/**
	 * Assemble html string to be inserted into the shadow root.
	 *
	 * @return String
	 */
	renderShadow() {

		// Value should contain a serialized array of layer objects
		let layers = []
		if ( '' !== this.value ) {
			layers = JSON.parse( this.value )
		}
		return `
			<style>
				:host {
					box-sizing: border-box;
					box-shadow: var(--fl-builder-input-shadow);
				}
				:host-context(.fl-layer-group-cluster) {
					border-radius: 0;
				}
				ul {
					display: grid;
					list-style: none;
					margin: 0;
					padding: 0;
					gap: 1px;
					background: var(--fl-builder-outline-color);
				}
				li {
					display: grid;
					position: relative;
					background: var(--fl-builder-input-bg-color);
					min-height: var(--fl-builder-target-size);
				}
				li:focus-within {
					box-shadow: var(--fl-builder-focus-shadow);
				}
				.fl-layer-placeholder {
					min-height: var(--fl-builder-target-size);
				}
				button {
					border: none;
					background: transparent;
					outline: none;
					font-size: inherit;
					color: var(--fl-builder-dim-color);
				}
				.handle {
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.handle, fl-layer-menu {
					opacity: 0;
				}
				li:hover .handle,
				li:focus-within .handle,
				li:hover fl-layer-menu,
				li:focus-within fl-layer-menu,
				fl-layer-menu[visible] {
					opacity: 1;
				}
			</style>
			<slot name="before"></slot>
			<ul>
				${ 0 >= layers.length ? this.renderDefaultLayer() : '' }
				${ 0 < layers.length ? layers.map( layer => this.renderLayer( layer ) ).join('') : '' }
			</ul>
			<slot name="after"></slot>
		`
	}
}
customElements.define( "fl-layer-group", FLLayerGroup )

const layerTypes = {
	default: {
		label: "Layer",

		bindEvents( layer ) {
			const input = layer.querySelector( 'input' )
			const onInput = this.onInput.bind( layer )
			input?.addEventListener( 'input', onInput )

			this.layer = layer
			const onKeyUp = this.onKeyUp.bind( this )
			input?.addEventListener( 'keyup', onKeyUp )

			// Track previous value for backspace
			const onKeyDown = e => this.lastValue = e.target.value
			input?.addEventListener( 'keydown', onKeyDown )

			// Cleanup
			return () => {
				input?.removeEventListener( 'input', onInput )
				input?.removeEventListener( 'keyup', onKeyUp )
				input?.removeEventListener( 'keydown', onKeyDown )
			}
		},

		onInput( e ) {
			const state = this.value
			this.value = { ...state, value: e.target.value }
		},

		onKeyUp( e ) {
			const layerGroup = this.layer.getRootNode().host

			switch( e.key ) {
				case 'Enter':
					const isCursorAtEnd = e.target.value.length === e.target.selectionStart
					if ( isCursorAtEnd && '' !== e.target.value ) {

						// Create new layer node
						const template = document.createElement( 'template' )
						template.innerHTML = layerGroup.renderLayer( { type: 'text', value: '' } )
						const node = template.content.cloneNode( true )
						this.layer.parentElement.after( node )
						this.layer.parentElement.nextElementSibling.querySelector('input')?.focus()
					}
					break;
				case 'Backspace':
					if ( '' === this.lastValue && 1 < layerGroup.getListElements().length ) {
						this.layer.delete()
					}
					break;
			}
		},

		render( props, type, strings ) {
			const placeholder = strings.addNew
			return `<input type="text" value='${ props.value }' placeholder='${ placeholder }' />`
		},
	},

	// Text type inherits all the default functionality
	text: {
		label: "Text",
	},

	// Grid Track - produces repeat( count, 1fr )
	'basic-track': {
		label: "Repeat",
		bindEvents( layer ) {
			this.layer = layer
			const stepperInput = layer.querySelector( 'input' )
			stepperInput?.addEventListener( 'change', this.onChange.bind( layer ) )
		},
		onChange( e ) {
			this.value = { ...this.value, value: e.target.value }
		},
		render( props, type ) {
			return `
				<div style="display: flex; align-items: center; font-size: 13px">
					<span>Number of Tracks:</span>
					<fl-stepper data-name="" min="0">
						<input type="hidden" name="" value="${ props.value }" />
					</fl-stepper>
				</div>
			`
		}
	},
}

class FLLayerGroupItem extends FLElement {

	defaultProps = {
		type: 'default',
		value: 'Untitled',
	}

	connectedCallback() {
		this.template.innerHTML = this.render()
		this.replaceChildren( this.template.content.cloneNode( true ) )
		this.unbindEventsCallback = this.bindEvents()
	}

	bindEvents() {

		this.layerMenu = this.querySelector( 'fl-layer-menu' )

		// Bind Layer Type Object
		const layerType = this.getType( this.getProps()?.type )
		const layerTypeUnbindCallback = layerType?.bindEvents( this )

		// Duplicate Button
		const onCloneClicked = this.onCloneClicked.bind(this)
		const cloneButton = this.querySelector( 'button.clone' )
		cloneButton?.addEventListener( 'click', onCloneClicked )

		// Remove Button
		const onRemoveClicked = this.onRemoveClicked.bind(this)
		const removeButton = this.querySelector( 'button.remove' )
		removeButton?.addEventListener( 'click', onRemoveClicked )

		return () => {

			// Handle unbinding for the item's layer type object
			if ( 'function' === typeof layerTypeUnbindCallback ) {
				layerTypeUnbindCallback()
			}

			cloneButton?.removeEventListener( 'click', onCloneClicked )
			removeButton?.removeEventListener( 'click', onRemoveClicked )
		}
	}

	onRemoveClicked() {
		this.dispatchEvent( new CustomEvent( 'layer-remove', {
			detail: this,
			bubbles: true,
			composed: true,
		} ) )
	}

	onCloneClicked() {
		this.dispatchEvent( new CustomEvent( 'layer-clone', {
			detail: this,
			bubbles: true,
			composed: true,
		} ) )
		this.layerMenu?.close()
	}

	get value() {
		return JSON.parse( this.getAttribute( 'value' ) )
	}

	set value( newValue ) {
		this.setAttribute( 'value', JSON.stringify( newValue ) )
		this.dispatchEvent( new Event( 'layer-change', {
			bubbles: true,
			composed: true,
		} ) )
	}

	getType( name ) {
		const types = layerTypes
		const defaultType = layerTypes.default

		if ( name in types ) {
			return { ...defaultType, ...types[name] }
		}
		return defaultType
	}

	getProps() {
		return { ...this.defaultProps, ...this.value }
	}

	delete() {
		const previous = this.parentElement.previousElementSibling

		// Focus previous input and place cursor at the end
		const prevInput =  previous?.querySelector(':is(input)')
		const end = prevInput?.value.length

		if ( 'hidden' !== prevInput.getAttribute('type') ) {
			prevInput?.setSelectionRange(end, end)
			prevInput?.focus()
		}

		// Remove the layer
		this.parentElement.remove()
	}

	get strings() {
		return {
			...super.strings,
			...JSON.parse( this.getAttribute( 'strings' ) )
		}
	}

	render() {
		const props = this.getProps()
		const type = this.getType( props.type )
		const strings = this.strings

		return `
			<style>
				fl-layer-group-item {
					display: grid;
					grid-template-columns: 32px 1fr 32px;
					cursor: move;
				}
				:where( input, select ) {
					color: var(--fl-builder-dim-color);
					border: none;
					background: transparent;
				}
				:where(input,select):focus {
					border: none;
					outline: none;
				}
				.handle {
					pointer-events: none;
				}
			</style>
			<button class="handle">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path d="M11.7637 3.57913C12.0439 4.00296 11.8867 4.48147 11.374 4.48147H8.64648C8.12012 4.48147 7.95605 4.01663 8.25684 3.57913L9.54883 1.67874C9.77441 1.34378 10.2666 1.3301 10.4922 1.67874L11.7637 3.57913ZM5.67969 14.4756C4.24414 14.4756 3.5332 13.7715 3.5332 12.3565V7.64651C3.5332 6.23147 4.24414 5.52737 5.67969 5.52737H14.3203C15.7559 5.52737 16.4668 6.23831 16.4668 7.64651V12.3565C16.4668 13.7647 15.7559 14.4756 14.3203 14.4756H5.67969ZM5.69336 13.375H14.3066C14.9834 13.375 15.3662 13.0059 15.3662 12.3018V7.7012C15.3662 6.99026 14.9834 6.62796 14.3066 6.62796H5.69336C5.00977 6.62796 4.63379 6.99026 4.63379 7.7012V12.3018C4.63379 13.0059 5.00977 13.375 5.69336 13.375ZM11.7637 16.417L10.4922 18.3242C10.2666 18.666 9.77441 18.6592 9.54883 18.3242L8.25684 16.417C7.95605 15.9795 8.12012 15.5215 8.64648 15.5215H11.374C11.8867 15.5215 12.0439 16 11.7637 16.417Z" fill="currentColor"/>
				</svg>
			</button>
			${ type.render( props, type, strings ) }
			<fl-layer-menu>
				<button class="clone">${strings.clone}</button>
				<button class="remove">${strings.delete}</button>
			</fl-layer-menu>
		`
	}
}
customElements.define( "fl-layer-group-item", FLLayerGroupItem )


class FLLayerGroupToolbar extends FLElement {

	defaultStrings = {
		clear: 'Clear',
		addNew: 'Add New Layer',
	}

	constructor() {
		super()
		this.attachShadow( { mode: 'open' } )
	}

	connectedCallback() {
		this.template.innerHTML = this.renderShadowRoot()
		this.shadowRoot.replaceChildren( this.template.content.cloneNode( true ) )
		this.unbindEventsCallback = this.bindEvents()
	}

	bindEvents() {
		this.addMenu = this.shadowRoot.querySelector( '.add-menu' )

		const addButton = this.shadowRoot.querySelector('.add')
		const addClicked = this.addClicked.bind(this)
		addButton?.addEventListener( 'click', addClicked )

		const clearButton = this.shadowRoot.querySelector('.clear')
		const clearClicked = this.resetClicked.bind(this)
		clearButton?.addEventListener( 'click', clearClicked )

		const menuButtonClicked = this.menuButtonClicked.bind(this)
		const menuButtons = this.shadowRoot.querySelectorAll('.add-menu button')
		menuButtons?.forEach( button => button.addEventListener( 'click', menuButtonClicked ) )

		return () => {
			addButton?.removeEventListener( 'click', addClicked )
			clearButton?.removeEventListener( 'click', clearClicked )
			menuButtons?.forEach( button => button.removeEventListener( 'click', menuButtonClicked ) )
		}
	}

	addClicked() {
		if ( this.layerGroup.supportsMultipleLayerTypes() ) {
			this.toggleMenu()
		} else {
			this.dispatchEvent( new CustomEvent( 'add', {
				detail: {
					type: 'text',
					value: ''
				}
			} ) )
		}
	}

	resetClicked() {
		this.dispatchEvent( new Event( 'reset' ) )
	}

	menuButtonClicked( e ) {
		const type = JSON.parse( e.target.getAttribute( 'data-type' ) )
		this.dispatchEvent( new CustomEvent( 'add', { detail: type } ) )
		this.hideMenu()
	}

	showMenu() {
		this.addMenu?.open()
		return
	}

	hideMenu() {
		this.addMenu?.close()
	}

	toggleMenu() {
		this.addMenu?.isOpen() ? this.addMenu?.close() : this.addMenu?.open()
	}

	renderAddMenu() {
		const items = [
			{
				label: 'Multiple Tracks',
				props: { type: 'basic-track', value: '3' },
			},
			{
				label: 'Freeform Text',
				props: { type: 'text', value: '' },
			},
			{
				label: 'Auto',
				props: { type: 'text', value: 'auto' },
			},
			{
				label: '1fr',
				props: { type: 'text', value: '1fr' },
			},
		]
		return `
			<fl-menu class="add-menu">
				${ items.map( item => {
					return `<button data-type='${ JSON.stringify( item.props ) }'>${ item.label }</button>`
				} ).join('') }
			</fl-menu>
		`
	}

	renderShadowRoot() {
		return `
			<style>
				:host {
					--height: 24px;
					display: flex;
					background: var(--fl-builder-heading-bg-color);
					height: var(--height);
					border-bottom: 1px solid var(--fl-builder-outline-color);
				}
				* {
					font-size: 12px;
					color: var(--fl-builder-dim-color);
				}
				div.label {

					flex-grow: 1;
					display: flex;
					align-items: center;
					padding: 0 10px;
				}
				:where( :host > button, .add-wrap > button ) {
					border: none;
					background: inherit;
					outline: none;
					font-size: inherit;
					display: flex;
					place-items: center;
					place-content: center;
				}
				button.add {
					min-width: 32px;
					display: flex;
				}

				:where( :host > button, .add-wrap > button ):hover,
				:where( :host > button, .add-wrap > button ):host > button:focus-visible {
					background: var(--fl-builder-platter-bg-color);
				}
				:where( :host > button, .add-wrap > button ):focus-visible {
					box-shadow: var(--fl-builder-focus-shadow);
					color: var(--fl-builder-accent-color);
				}
				:where( :host > button, .add-wrap > button ) * {
					pointer-events: none;
				}

				.add-wrap {
					position:relative;
					display: grid;
				}
				.add-wrap:hover {
					background: var(--fl-builder-input-bg-color);
				}
			</style>
			<div class="label"><slot></slot></div>
			<button class="clear">${ this.strings.clear }</button>
			<div class="add-wrap">
				<button class="add" title='${ this.strings.addNew }'>
					<svg width="15" height="20" viewBox="0 0 15 20" fill="none">
						<path d="M13.1569 10.0001H1.84315" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
						<path d="M7.5 4.34326V15.657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					</svg>
				</button>
				${ this.renderAddMenu() }
			</div>
		`
	}
}
customElements.define( "fl-layer-group-heading", FLLayerGroupToolbar )


class FLLayerMenu extends FLElement {

	// cached for adding/removeing listeners without creating new functions each time
	dismissCallback = this.maybeDismissMenu.bind(this)

	static get observedAttributes() {
		return [ 'visible' ]
	}

	constructor() {
		super()
		this.attachShadow( { mode: 'open' } )
		this.template = document.createElement( 'template' )
	}

	connectedCallback() {
		this.template.innerHTML = this.renderShadow()
		this.shadowRoot.replaceChildren( this.template.content.cloneNode( true ) )
		this.unbindEventsCallback = this.bindEvents()

		if ( this.hasAttribute( 'visible' ) ) {
			this.showMenu()
		}
	}

	attributeChangedCallback( name, oldValue, newValue ) {
		if ( 'visible' === name ) {
			null === newValue ? this.hideMenu() : this.showMenu()
		}
	}

	bindEvents() {
		this.button = this.shadowRoot.querySelector('button')
		const toggle = this.toggleVisible.bind(this)
		this.button.addEventListener( 'click', toggle )

		return () => {
			this.button.removeEventListener( 'click', toggle )
			document.removeEventListener( 'click', this.dismissCallback )
			document.removeEventListener( 'keyup', this.dismissCallback )
		}
	}

	toggleVisible() {
		this.hasAttribute( 'visible' ) ? this.close() : this.open()
	}

	close() {
		this.removeAttribute( 'visible' )
	}

	open() {
		this.setAttribute( 'visible', '' )
	}

	/**
	 * Dismiss the menu if either clicking outside or hitting escape.
	*/
	maybeDismissMenu( e ) {
		if ( ! e.composedPath().includes( this ) || 'Escape' === e.key ) {
			this.removeAttribute( 'visible' )
		}
	}

	showMenu() {
		const menuTemplate = document.createElement( 'template' )
		menuTemplate.innerHTML = this.renderMenu()
		this.shadowRoot.appendChild( menuTemplate.content.cloneNode( true ) )

		// Add listener for click away
		document.addEventListener( 'click', this.dismissCallback )
		document.addEventListener( 'keyup', this.dismissCallback )
	}

	hideMenu() {
		const menu = this.shadowRoot.querySelector( '.menu' )
		menu?.remove()

		// Remove click away listener
		document.removeEventListener( 'click', this.dismissCallback )
		document.removeEventListener( 'keyup', this.dismissCallback )
	}

	renderMenu() {
		return `
			<div class="menu">
				<slot></slot>
			</div>
		`
	}

	renderShadow() {
		return `
			<style>
				:host {
					flex-grow: 1;
					display: flex;
				}
				.label {
					flex-grow: 1;
					display: flex;
					align-items: center;
					padding: 0 10px;
				}
				button {
					border: none;
					background: inherit;
					outline: none;
					font-size: inherit;
					color: inherit;
					display: flex;
					place-items: center;
					color: var(--fl-builder-dim-color);
				}
				.menu {
					display: grid;
					grid-auto-rows: var(--fl-builder-target-size);
					gap: 1px;
					background: var(--fl-builder-input-bg-color);
					box-shadow: var(--fl-builder-input-shadow), 0 10px 20px hsla(0deg, 0%, 0%, .25);
					position: absolute;
					top: calc( 100% + 1px );
					right: 0;
					width: calc( 100% - 32px );
					max-width: 120px;
					z-index: 9;
				}
			</style>
			<button>
				<svg width="20" height="21" viewBox="0 0 20 21" fill="none">
					<path d="M10 15.2861C8.895 15.2861 8 16.1811 8 17.2861C8 18.3911 8.895 19.2861 10 19.2861C11.105 19.2861 12 18.3911 12 17.2861C12 16.1811 11.105 15.2861 10 15.2861Z" fill="currentColor"/>
					<path d="M10 1.28613C8.895 1.28613 8 2.18113 8 3.28613C8 4.39113 8.895 5.28613 10 5.28613C11.105 5.28613 12 4.39113 12 3.28613C12 2.18113 11.105 1.28613 10 1.28613Z" fill="currentColor"/>
					<path d="M10 8.28613C8.895 8.28613 8 9.18113 8 10.2861C8 11.3911 8.895 12.2861 10 12.2861C11.105 12.2861 12 11.3911 12 10.2861C12 9.18113 11.105 8.28613 10 8.28613Z" fill="currentColor"/>
				</svg>
			</button>
		`
	}
}
customElements.define( "fl-layer-menu", FLLayerMenu )
