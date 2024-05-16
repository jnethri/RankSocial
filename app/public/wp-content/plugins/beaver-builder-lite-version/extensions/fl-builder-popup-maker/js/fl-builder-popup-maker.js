( function( $ ) {

	var FLBuilderPopupMaker = {

		init: function() {
			if ( ! FLBuilder.UIIFrame.isEnabled() ) {
				FLBuilder.addHook( 'didPinContentPanel', this.resizeForLegacyUI );
				FLBuilder.addHook( 'didUnpinContentPanel', this.resizeForLegacyUI );
				this.adjustStackingForLegacyUI();
			}

			// Force popups to be "open"
			$( '.pum-overlay' ).addClass( 'pum-open' );
		},

		adjustStackingForLegacyUI: function () {
			$( '.pum-overlay' ).css( 'z-index', '10000' );
		},

		resizeForLegacyUI: function () {
			var body = $( 'body' );

			$( '.pum-overlay' ).css( {
				left: body.css( 'margin-left' ),
				right: body.css( 'margin-right' ),
				width: 'auto'
			} );
		}
	}

	$( function() {
		FLBuilderPopupMaker.init();
	} );

} )( jQuery );
