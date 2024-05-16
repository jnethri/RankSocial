class FLElement extends HTMLElement {

	/**
	 * Property to store a template element
	 */
	template = null

	/**
 	* Function to unbind event listeners. Meant to be replaced by returning a function from bindEvents().
 	*/
	unbindEventsCallback = () => {}

	/**
	 * A collection of defaults for localized strings to be merged with the strings attribute.
	 */
	defaultStrings = {}

	/**
	 * Array of attributes to watch for changes
	 *
	 * @return Array
	 */
	static get observedAttributes() {
		return [ 'strings' ]
	}

	/*
	 * Sets up a template element for use later.
	 *
	 * @return void
	 */
	constructor() {
		super()
		this.template = document.createElement( 'template' )
	}

	/**
	 * This is a stub to be overridden in subclasses
	 *
	 * @return Function
	 */
	bindEvents() {
		return this.unbindEventsCallback
	}

	/**
	 * Override to assign unbind callback
	 */
	connectedCallback() {

		/**
		 * To enable a cleanup callback in bindEvents()
		 * you need to assign it when the element is connected to the DOM.
		 * This allows you to return a function from bindEvents() that will
		 * be called on disconnect. Use it to remove any event listeners you added.
		 */
		this.unbindEventsCallback = this.bindEvents()
	}

	/**
	 * Fires when element is disconnected from DOM
	 *
	 * @return void
	 */
	disconnectedCallback() {
		if ( 'function' === typeof this.unbindEventsCallback ) {
			this.unbindEventsCallback()
		}
	}

	/**
	 * Getter for strings property. Merges defaults with strings attribute
	 *
	 * @return Object
	 */
	get strings() {
		return {
			...this.defaultStrings,
			...JSON.parse( this.getAttribute( 'strings' ) )
		}
	}
}
