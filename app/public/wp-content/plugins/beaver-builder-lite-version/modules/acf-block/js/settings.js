( function( $ ) {

	FLBuilder.registerModuleHelper( 'acf-block', {

		init: function() {
			acf.doAction( 'append' );

			this.initPreview();
		},

		initPreview: function() {
			var form = $( '.fl-builder-settings:visible .acf-block-fields' );
			var callback = $.proxy( FLBuilder.preview.delayPreview, FLBuilder.preview );

			form.on( 'input', 'input, textarea', callback );
			form.on( 'change', 'input[type="hidden"], select', callback );
		},

		submit: function() {
			acf.unload.reset();

			return true;
		}
	} );

} )( jQuery );
