( function( $ ) {

	FLBuilder.UIIFrame = {

		/**
		 * Whether the UI is being resized or not.
		 */
		resizing: false,

		/**
		 * The iframe's min width.
		 */
		minWidth: 280,

		/**
		 * The iframe's min height.
		 */
		minHeight: 280,

		/**
		 * The pixel buffer for the iframe's max width.
		 */
		maxWidthBuffer: 75,

		/**
		 * The pixel buffer for the iframe's max height.
		 */
		maxHeightBuffer: 165,

		/**
		 * Widths for breakpoint previews.
		 */
		previewBreakpoints: {
			'responsive': 360,
			'medium': 800,
			'large': 1200,
			'default': 1500
		},

		/**
		 * The current breakpoint for responsive editing mode.
		 */
		currentBreakpoint: 'default',

		/**
		 * Initialize the iframe UI.
		 */
		init: function () {
			if ( ! this.isEnabled() ) {
				return;
			}

			this.setupJQuery();
			this.setupMousetrap();
			this.setupReferences();
			this.bindEvents();
			this.initBreakpointResizing();
		},

		/**
		 * Checks to see if the iFrame UI is enabled. If this returns
		 * false, we're in the legacy UI.
		 */
		isEnabled: function() {
			return this.isUIWindow() || this.isIFrameWindow();
		},

		/**
		 * Checks to see if we're in the parent window of the iframe UI.
		 */
		isUIWindow: function() {
			var iframe = $( '#fl-builder-ui-iframe' );

			return !! iframe.length;
		},

		/**
		 * Checks to see if we're in the layout's iframe window.
		 */
		isIFrameWindow: function() {
			return window !== parent.window;
		},

		/**
		 * Returns the window object for the layout's iframe. Falls back to the
		 * current window for the legacy UI.
		 */
		getIFrameWindow: function() {
			if ( this.isUIWindow() ) {
				return $( '#fl-builder-ui-iframe' )[0].contentWindow;
			}
			return window;
		},

		/**
		 * Modify jQuery's functions at runtime to support the iFrame UI.
		 */
		setupJQuery: function () {

			/**
			 * Modify jQuery's selector function to look in the parent window for
			 * elements if it doesn't find anything within the iframe. This provides
			 * iframe UI support for third parties that aren't specifying which
			 * document to check in their module settings.js. It will also help
			 * catch times when _we_ forget which document to check in core code.
			 */
			jQuery.fn.oldInit = jQuery.fn.init;

			jQuery.fn.init = function( selector, context ) {
				var result = new jQuery.fn.oldInit( selector, context );

				if ( ! result.length && ! context && 'string' === typeof selector ) {
					result = new jQuery.fn.oldInit( selector, window.parent.document );
				}

				return result;
			};

			/**
			 * Modify jQuery's trigger function to trigger events across windows.
			 */
			window.parent.jQuery.fn.oldTrigger = window.parent.jQuery.fn.trigger;
			jQuery.fn.oldTrigger = jQuery.fn.trigger;

			window.parent.jQuery.fn.trigger = function( type, data ) {
				jQuery.fn.oldTrigger.call( this, type, data );
				return window.parent.jQuery.fn.oldTrigger.call( this, type, data );
			};

			jQuery.fn.trigger = function( type, data ) {
				window.parent.jQuery.fn.oldTrigger.call( this, type, data );
				return jQuery.fn.oldTrigger.call( this, type, data );
			};
		},

		/**
		 * Override Mousetrap functions so they are run on both the parent
		 * and child windows.
		 */
		setupMousetrap: function () {
			var bind = Mousetrap.bind,
				bindGlobal = Mousetrap.bindGlobal,
				pause = Mousetrap.pause,
				unpause = Mousetrap.unpause;

			Mousetrap.bind = function( sequence, callback ) {
				bind.call( Mousetrap, sequence, callback );
				window.parent.Mousetrap.bind.call( window.parent.Mousetrap, sequence, callback );
			};

			Mousetrap.bindGlobal = function( sequence, callback ) {
				bindGlobal.call( Mousetrap, sequence, callback );
				window.parent.Mousetrap.bindGlobal.call( window.parent.Mousetrap, sequence, callback );
			};

			Mousetrap.pause = function() {
				pause.call( Mousetrap );
				window.parent.Mousetrap.pause.call( window.parent.Mousetrap );
			};

			Mousetrap.unpause = function() {
				unpause.call( Mousetrap );
				window.parent.Mousetrap.unpause.call( window.parent.Mousetrap );
			};
		},

		/**
		 * Handles anything necessary for the iframe UI to function such as
		 * passing references between the child and parent windows.
		 */
		setupReferences: function() {

			// Core builder refs passed _to_ the parent window
			window.parent.FL = window.parent.FL || {};
			window.parent.FL.Builder = window.FL.Builder;
			window.parent.FLBuilder = window.FLBuilder;
			window.parent.FLLightbox = window.FLLightbox;
			window.parent.FLBuilderSettingsForms = window.FLBuilderSettingsForms;

			// Core builder refs passed _from_ the parent window
			FLBuilderGlobalNodeId = window.parent.FLBuilderGlobalNodeId;
			FLBuilderTour = window.parent.FLBuilderTour;

			// Themer refs passed _to_ the parent window
			window.parent.FLThemeBuilderFieldConnections = window.FLThemeBuilderFieldConnections;

			// Themer refs passed _from_ the parent window
			Tether = window.parent.Tether;

			// Media uploader refs passed _from_ the parent window
			wp.media = window.parent.wp.media;

			// Ace code editor refs passed _from_ the parent window
			ace = window.parent.ace;

			// ClipboardJS refs passed _from_ the parent window
			ClipboardJS = window.parent.ClipboardJS;

			// jQuery libraries
			jQuery.fn.select2 = window.parent.jQuery.fn.select2;
			jQuery.fn.validate = window.parent.jQuery.fn.validate;

			// Publish with refresh if in the iframe UI.
			if ( window.parent.location.href.includes( 'fl_builder_ui' ) ) {
				FLBuilderConfig.shouldRefreshOnPublish = true;
			}

			// Pass everything else up to the parent window to ensure
			// globals needed by third party settings are available.
			for ( var key in window ) {
				if ( 'undefined' === typeof parent.window[ key ] ) {
					parent.window[ key ] = window[ key ];
				}
			}
		},

		/**
		 * Bind events related to the iFrame UI.
		 */
		bindEvents: function() {
			var parentWin = $( window.parent ),
				parentBody = $( 'body', window.parent.document );

			// IFrame events
			parentBody.on( 'mouseleave', '#fl-builder-ui-iframe', this.mouseLeave );

			// Drag and drop
			FLBuilder.addHook( 'didInitDrag', this.dragInit );
			FLBuilder.addHook( 'didStopDrag', this.dragStop );
			FLBuilder.addHook( 'didCancelDrag', this.dragStop );

			// Responsive preview
			FLBuilder.addHook( 'responsive-editing-switched', this.responsiveEditingSwtiched );
			parentBody.on( 'click', '.fl-builder-ui-iframe-exit', this.exitResponsiveEditing );
			parentBody.on( 'change', '.fl-builder-ui-iframe-breakpoint', this.breakpointSelectChanged );
			parentBody.on( 'input', '.fl-builder-ui-iframe-width', this.breakpointWidthChanged );
			parentBody.on( 'input', '.fl-builder-ui-iframe-height', this.breakpointHeightChanged );
			parentBody.on( 'change', '.fl-builder-ui-iframe-scale', this.scaleSelectChanged );
		},

		/**
		 * Handle iFrame logic when the mouse leaves the frame.
		 */
		mouseLeave: function() {
			FLBuilder._removeAllOverlays();
		},

		/**
		 * Handle iFrame logic when drag is initialized.
		 */
		 dragInit: function() {
			$( 'body', window.parent.document ).on( 'mousemove.fl-builder-iframe', FLBuilder.UIIFrame.dragScroll );
			$( 'body' ).on( 'mousemove.fl-builder-iframe mouseup.fl-builder-iframe', FLBuilder.UIIFrame.dragMove );
 		},

 		/**
 		 * Handle iFrame logic when drag is stopped or canceled.
 		 */
 		dragStop: function() {
			$( 'body', window.parent.document ).off( 'mousemove.fl-builder-iframe' );
			$( 'body' ).off( 'mousemove.fl-builder-iframe mouseup.fl-builder-iframe' );
 		},

 		/**
 		 * Trigger events on the parent window when drag is moved.
 		 */
 		dragMove: function( e ) {
			var frame = $( '#fl-builder-ui-iframe', window.parent.document );
			var frameContents = frame.contents();
			var parentBody = $( 'body', window.parent.document );
			e.pageY = e.pageY - frameContents.scrollTop() + frame.offset().top; // 44px for the toolbar
			e.pageX = e.pageX + frame.offset().left;
			parentBody.trigger( e );
 		},

		/**
		 * Scrolls the iFrame when a sortable is dragging near an edge.
		 */
		dragScroll: function( e ) {
			var scrollSpeed = 20;
			var scrollSensitivity = 50;
			var frame = $( '#fl-builder-ui-iframe', window.parent.document );
			var frameContents = frame.contents();
			var frameContentsHeight = frameContents.height();
			var frameHeight = frame.height();
			var frameScrollTop = frameContents.scrollTop();
			var mouseY = e.clientY;
			var topBoundary = scrollSensitivity;
			var bottomBoundary = frameHeight - scrollSensitivity;
			var newScrollTop = 0;
			var adjustedHeight = 0;

			if ( mouseY <= topBoundary ) {
				newScrollTop = frameScrollTop - scrollSpeed;
				frameContents.scrollTop( newScrollTop < 0 ? 0 : newScrollTop );
			} else if ( mouseY >= bottomBoundary ) {
				newScrollTop = frameScrollTop + scrollSpeed;
				adjustedHeight = frameContentsHeight - frameHeight;
				frameContents.scrollTop( newScrollTop > adjustedHeight ? adjustedHeight : newScrollTop );
			}
		},

		/**
		 * Updates the breakpoint inputs and iframe size when the
		 * responsive editing mode is switched.
		 */
		responsiveEditingSwtiched: function() {
			var html = $( 'html' ).add( 'html', window.parent.document ),
				parentWin = $( window.parent ),
				parentBody = $( 'body', window.parent.document ),
				maxWidth = parentWin.width() - FLBuilder.UIIFrame.maxWidthBuffer,
				maxHeight = parentWin.height() - FLBuilder.UIIFrame.maxHeightBuffer,
				iframe = $( '.fl-builder-ui-iframe-canvas', window.parent.document ),
				breakpointSelect = $( '.fl-builder-ui-iframe-breakpoint', window.parent.document ),
				widthInput = $( '.fl-builder-ui-iframe-width', window.parent.document ),
				heightInput = $( '.fl-builder-ui-iframe-height', window.parent.document ),
				breakpoints = FLBuilder.UIIFrame.previewBreakpoints,
				responsiveWidth = breakpoints.responsive,
				mediumWidth = breakpoints.medium,
				largeWidth = breakpoints.large,
				globalMedium = FLBuilderConfig.global.medium_breakpoint,
				defaultWidth = maxWidth > globalMedium && maxWidth < breakpoints.default ? maxWidth : breakpoints.default;

			// Don't switch if this is the current breakpoint.
			if ( FLBuilderResponsiveEditing._mode === FLBuilder.UIIFrame.currentBreakpoint ) {
				return;
			}

			// Save the current breakpoint.
			FLBuilder.UIIFrame.currentBreakpoint = FLBuilderResponsiveEditing._mode;

			// Don't switch if we're resizing.
			if ( FLBuilder.UIIFrame.resizing ) {
				return;
			}

			// Use user defined values for preview instead?
			if ( '1' === FLBuilderConfig.global.responsive_preview ) {
				responsiveWidth = FLBuilderConfig.global.responsive_breakpoint;
				mediumWidth = FLBuilderConfig.global.medium_breakpoint;
				largeWidth = FLBuilderConfig.global.large_breakpoint;
			} else {

				// Make sure preview breakpoints aren't bigger than user defined.
				if ( responsiveWidth > parseInt( FLBuilderConfig.global.responsive_breakpoint ) ) {
					responsiveWidth = FLBuilderConfig.global.responsive_breakpoint
				}
				if ( mediumWidth > parseInt( FLBuilderConfig.global.medium_breakpoint ) ) {
					mediumWidth = FLBuilderConfig.global.medium_breakpoint
				}
				if ( largeWidth > parseInt( FLBuilderConfig.global.large_breakpoint ) ) {
					largeWidth = FLBuilderConfig.global.large_breakpoint
				}
			}

			// Switch...
			if ( 'responsive' === FLBuilderResponsiveEditing._mode ) {
				iframe.width( responsiveWidth );
				widthInput.val( responsiveWidth );
				breakpointSelect.val( 'responsive' );
			} else if ( 'medium' === FLBuilderResponsiveEditing._mode ) {
				iframe.width( mediumWidth );
				widthInput.val( mediumWidth );
				breakpointSelect.val( 'medium' );
			} else if ( 'large' === FLBuilderResponsiveEditing._mode ) {
				iframe.width( largeWidth );
				widthInput.val( largeWidth );
				breakpointSelect.val( 'large' );
			} else {
				iframe.width( defaultWidth );
				widthInput.val( defaultWidth );
				breakpointSelect.val( 'default' );
			}

			iframe.height( maxHeight );
			heightInput.val( maxHeight );

			html.addClass( 'fl-responsive-preview-enabled' );
			parentBody.addClass( 'fl-builder-ui-iframe-responsive-editing' );
			parentBody.attr( 'data-fl-builder-breakpoint', FLBuilderResponsiveEditing._mode );
		},

		/**
		 * Exits responsive editing mode.
		 */
		exitResponsiveEditing: function() {
			var html = $( 'html' ).add( 'html', window.parent.document ),
				parentBody = $( 'body', window.parent.document ),
				iframe = $( '.fl-builder-ui-iframe-canvas', window.parent.document );

			FLBuilderResponsiveEditing._switchAllSettingsTo( 'default' );
			FLBuilderResponsiveEditing._switchToAndScroll( 'default' );

			html.removeClass( 'fl-responsive-preview-enabled' );
			parentBody.removeClass( 'fl-builder-ui-iframe-responsive-editing' );

			iframe.width( '100%' );
			iframe.height( '100%' );
			iframe.css( 'transform', '' );
		},

		/**
		 * Initializes resizing the iframe to different breakpoints.
		 */
		initBreakpointResizing: function() {
			var iframe = $( '.fl-builder-ui-iframe-canvas', window.parent.document );

			iframe.resizable( {
				minHeight : FLBuilder.UIIFrame.minHeight,
				minWidth : FLBuilder.UIIFrame.minWidth,
				start : FLBuilder.UIIFrame.breakpointResizeStart,
				resize: FLBuilder.UIIFrame.breakpointResize,
				stop : FLBuilder.UIIFrame.breakpointResizeStop,
				handles : {
					s: $( '.fl-builder-ui-iframe-resize-s', window.parent.document ),
					e: $( '.fl-builder-ui-iframe-resize-e', window.parent.document ),
					w: $( '.fl-builder-ui-iframe-resize-w', window.parent.document ),
				},
			} );
		},

		/**
		 * Fires when breakpoint resizing starts.
		 */
		breakpointResizeStart: function() {
			$( 'body', window.parent.document ).addClass( 'fl-builder-ui-iframe-resizing' );

			FLBuilder.UIIFrame.resizing = true;
		},

		/**
		 * Fires during breakpoint resize.
		 */
		breakpointResize: function( e, ui ) {
			var parentWin = $( window.parent ),
				scale = parseInt( $( '.fl-builder-ui-iframe-scale', window.parent.document ).val() ) / 100,
				maxWidth = Math.round( ( parentWin.width() - FLBuilder.UIIFrame.maxWidthBuffer ) / scale ),
				maxHeight = Math.round( ( parentWin.height() - FLBuilder.UIIFrame.maxHeightBuffer ) / scale ),
				widthInput = $( '.fl-builder-ui-iframe-width', window.parent.document ),
				heightInput = $( '.fl-builder-ui-iframe-height', window.parent.document );

			// Double the width change to account for both sides resizing.
			ui.size.width = ( ui.size.width - ui.originalSize.width ) * 2 + ui.originalSize.width;

			// Constrain the width.
			if ( ui.size.width < FLBuilder.UIIFrame.minWidth ) {
				ui.size.width = FLBuilder.UIIFrame.minWidth;
			} else if ( ui.size.width > maxWidth ) {
				ui.size.width = maxWidth;
				ui.originalSize.width = maxWidth;
			}

			// Constrain the height.
			if ( ui.size.height > maxHeight ) {
				ui.size.height = maxHeight;
			}

			// Update the input values.
			widthInput.val( ui.size.width ).trigger( 'input' );
			heightInput.val( ui.size.height ).trigger( 'input' );

			FLBuilder.UIIFrame.resizing = true;
		},

		/**
		 * Fires when breakpoint resizing stops.
		 */
		breakpointResizeStop: function() {
			$( 'body', window.parent.document ).removeClass( 'fl-builder-ui-iframe-resizing' );

			FLBuilder.UIIFrame.resizing = false;
		},

		/**
		 * Switches the responsive editing mode when a breakpoint is selected.
		 */
		breakpointSelectChanged: function() {
			var mode = $( this ).val();

			FLBuilderResponsiveEditing._switchAllSettingsTo( mode );
			FLBuilderResponsiveEditing._switchToAndScroll( mode );
		},

		/**
		 * Resizes the iframe when the width input changes.
		 */
		breakpointWidthChanged: function () {
			var parentBody = $( 'body', window.parent.document ),
				input = $( this ),
				width = input.val(),
				iframe = $( '.fl-builder-ui-iframe-canvas', window.parent.document ),
				breakpointSelect = $( '.fl-builder-ui-iframe-breakpoint', window.parent.document );

			FLBuilder.UIIFrame.resizing = true;

			if ( width && width <= parseInt( FLBuilderConfig.global.responsive_breakpoint ) ) {
				if ( 'responsive' !== FLBuilderResponsiveEditing._mode ) {
					FLBuilderResponsiveEditing._switchAllSettingsTo( 'responsive' );
					FLBuilderResponsiveEditing._switchTo( 'responsive' );
					breakpointSelect.val( 'responsive' );
					parentBody.attr( 'data-fl-builder-breakpoint', 'responsive' );
				}
			} else if ( width && width <= parseInt( FLBuilderConfig.global.medium_breakpoint ) ) {
				if ( 'medium' !== FLBuilderResponsiveEditing._mode ) {
					FLBuilderResponsiveEditing._switchAllSettingsTo( 'medium' );
					FLBuilderResponsiveEditing._switchTo( 'medium' );
					breakpointSelect.val( 'medium' );
					parentBody.attr( 'data-fl-builder-breakpoint', 'medium' );
				}
			} else if ( width && width <= parseInt( FLBuilderConfig.global.large_breakpoint ) ) {
				if ( 'large' !== FLBuilderResponsiveEditing._mode ) {
					FLBuilderResponsiveEditing._switchAllSettingsTo( 'large' );
					FLBuilderResponsiveEditing._switchTo( 'large' );
					breakpointSelect.val( 'large' );
					parentBody.attr( 'data-fl-builder-breakpoint', 'large' );
				}
			} else if ( 'default' !== FLBuilderResponsiveEditing._mode ) {
				FLBuilderResponsiveEditing._switchAllSettingsTo( 'default' );
				FLBuilderResponsiveEditing._switchTo( 'default' );
				breakpointSelect.val( 'default' );
				parentBody.attr( 'data-fl-builder-breakpoint', 'default' );
			}

			iframe.width( width );

			FLBuilder.UIIFrame.resizing = false;
		},

		/**
		 * Resizes the iframe when the height input changes.
		 */
		breakpointHeightChanged: function () {
			var input = $( this ),
				height = input.val(),
				iframe = $( '.fl-builder-ui-iframe-canvas', window.parent.document );

			iframe.height( height );
		},

		/**
		 * Adjusts the iframe scale when the scale select changes.
		 */
		scaleSelectChanged: function () {
			var parentWin = $( window.parent ),
				maxWidth = parentWin.width() - FLBuilder.UIIFrame.maxWidthBuffer,
				maxHeight = parentWin.height() - FLBuilder.UIIFrame.maxHeightBuffer,
				iframe = $( '.fl-builder-ui-iframe-canvas', window.parent.document ),
				input = $( this ),
				value = input.val(),
				option = null;

			input.find( 'option[data-custom="1"]' ).remove();

			if ( 'fit' === value ) {
				value = Math.round( Math.min(
					100,
					maxWidth / iframe.width() * 100,
					maxHeight / iframe.height() * 100
				) );

				option = input.find( 'option[value="' + value + '"]' );

				if ( ! option.length ) {
					input.prepend( '<option value="' + value + '" data-custom="1" >' + value + '%</option>' );
				}
			}

			input.val( value );

			iframe.css( 'transform', 'scale(' + value + '%)' );
		},
	};

} )( jQuery );
