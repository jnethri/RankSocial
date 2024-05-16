class FLMenu extends FLElement {

	static observedAttributes = [ 'open' ]

	constructor() {
		super()
		this.attachShadow( { mode: 'open' } )
	}

	connectedCallback() {
		this.template.innerHTML = this.render()
		this.shadowRoot.replaceChildren( this.template.content.cloneNode( true ) )
		this.unbindEventsCallback = this.bindEvents()
	}

	bindEvents() {

		/**
		 * Cached callback to be used on attribute change.
		 */
		this.dismissCallback = this.maybeDismissMenu.bind(this)
	}

	attributeChangedCallback( name, prevValue, value ) {
		switch( name ) {
			case 'open':
				this.isOpen() ? this.onOpen() : this.onClose()
				break
		}
	}

	open() {
		this.setAttribute( 'open', '' )
	}

	close() {
		this.removeAttribute( 'open' )
	}

	onOpen() {
		//document.addEventListener( 'click', this.dismissCallback )
	}

	onClose() {
		document.removeEventListener( 'click', this.dismissCallback )
	}

	maybeDismissMenu( e ) {

		const isClickOutside = this.isOpen() && ! e.composedPath().includes( this )
		console.log( 'maybe dismiss', isClickOutside, this )

		if ( isClickOutside ) {
			this.close()
		}
	}

	isOpen() {
		return !! this.hasAttribute( 'open' )
	}

	render() {
		return `
			<style>
				:host {
					--item-size: 30px;
					--width: 150px;
					--radius: var(--fl-builder-radius);
					background: var(--fl-builder-input-bg-color);
					min-height: 36px;
					display: none;
					grid-auto-rows: var(--fl-builder-target-size);
					gap: 1px;
					box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px,
								rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,
								rgba(0, 0, 0, 0.12) 0px 3px 14px 2px;
					border-radius: var(--radius);
					position: absolute;
					top: calc( 100% + 1px );
					width: var(--width);
					right: 0;
					z-index: 9;
				}
				:host( [open] ) {
					display: grid;
				}
				::slotted( * ) {
					border: none;
					background: var(--fl-builder-input-bg-color);
					color: var(--fl-builder-input-color);
					outline: none;
					font-size: inherit;
					display: flex;
					place-items: center;
					place-content: start;
					padding: 0 20px;
					text-align: left;
					min-height: var(--item-size);
				}
				::slotted( *:hover ) {
					filter: brightness( 96% );
				}
				::slotted( :first-child ) {
					border-top-left-radius: var(--radius);
					border-top-right-radius: var(--radius);
				}
				::slotted( :last-child ) {
					border-bottom-left-radius: var(--radius);
					border-bottom-right-radius: var(--radius);
				}
			</style>
			<slot></slot>
		`
	}
}
customElements.define( "fl-menu", FLMenu )
