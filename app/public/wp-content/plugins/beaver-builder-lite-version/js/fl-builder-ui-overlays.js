( function( $ ) {

	$.extend( FLBuilder, {

		/**
		 * Node ID for the currently selected node, if any.
		 *
		 * @since 2.8
		 * @property {String} _selectedNode
		 */
		_selectedNode: null,

		/**
		 * Binds general overlay events that don't get removed.
		 *
		 * @since 2.8
		 */
		_bindGeneralOverlayEvents: function()
		{
			var isTouch = FLBuilderLayout._isTouch();
			var body = $( 'body' );
			var parentBody = $( 'body', window.parent.document );

			/* Context Menu */
			body.on( 'contextmenu', '.fl-block-overlay', FLBuilder._onOverlayContextMenu );

			/* Selected Overlays */
			FLBuilder.addHook( 'didInitDrag', FLBuilder._deselectNodeOverlay );
			$( document ).add( window.parent.document ).on( 'keyup', FLBuilder._deselectNodeOverlayOnEsc );
			body.on( 'click', '.fl-block-overlay', FLBuilder._deselectNodeOverlayOnClick );
			body.on( 'click', '.fl-block-overlay-actions *', FLBuilder._deselectNodeOverlayOnActionsClick );
			parentBody.on( 'click', '.fl-builder-module-settings .fl-lightbox-footer button', FLBuilder._deselectNodeOverlay );
			parentBody.on( 'click', '.fl-builder-col-settings .fl-lightbox-footer button', FLBuilder._deselectNodeOverlay );
			parentBody.on( 'click', '.fl-builder-row-settings .fl-lightbox-footer button', FLBuilder._deselectNodeOverlay );
			parentBody.on( 'click', FLBuilder._deselectNodeOverlay );
			body.on( 'click', FLBuilder._deselectNodeOverlay );
			body.on( 'click', '.fl-block-overlay .fl-block-select-parent', FLBuilder._selectNodeParentOnIconClick);
			body.on( 'click', '.fl-block-overlay .fl-block-select-parent-menu > li > a', FLBuilder._selectNodeParentOnMenuClick);
			body.on( 'mouseenter', '.fl-block-overlay .fl-block-select-parent-menu a', FLBuilder._highlightNodeParentOnMenuHover);
			body.on( 'mouseleave', '.fl-block-overlay .fl-block-select-parent-menu a', FLBuilder._removeNodeParentHighlight);
			body.on( 'mousedown', '.fl-block-overlay .fl-block-select-parent-menu a', FLBuilder._removeNodeParentHighlight);

			/* Overlay Submenus */
			body.on( 'click touchend', '.fl-builder-has-submenu', FLBuilder._submenuParentClicked);
			body.on( 'mouseenter', '.fl-builder-submenu-hover', FLBuilder._hoverMenuParentMouseEnter);
			body.on( 'mouseleave', '.fl-builder-submenu-hover', FLBuilder._hoverMenuParentMouseLeave);
			body.on( 'click touchend', '.fl-builder-has-submenu a', FLBuilder._submenuChildClicked);
			body.on( 'mouseenter', '.fl-builder-submenu', FLBuilder._submenuMouseenter);
			body.on( 'mouseleave', '.fl-builder-submenu', FLBuilder._submenuMouseleave);
			body.on( 'mouseenter', '.fl-builder-submenu .fl-builder-has-submenu', FLBuilder._submenuNestedParentMouseenter);

			/* Generic Actions */
			body.on( 'click touchend', '.fl-block-overlay .fl-block-move-up', FLBuilder._moveNodeUpClicked);
			body.on( 'click touchend', '.fl-block-overlay .fl-block-move-down', FLBuilder._moveNodeDownClicked);
			body.on( 'click touchend', '.fl-block-overlay .fl-block-settings', FLBuilder._nodeSettingsClicked);
			body.on( 'click touchend', '.fl-block-overlay .fl-block-copy', FLBuilder._nodeDuplicateClicked);
			body.on( 'click touchend', '.fl-block-overlay .fl-block-remove', FLBuilder._nodeRemoveClicked);

			/* Rows */
			body.on( 'mousedown', '.fl-row-overlay .fl-block-move, .fl-row-move', FLBuilder._rowDragInit);
			body.on( 'touchstart', '.fl-row-overlay .fl-block-move, .fl-row-move', FLBuilder._rowDragInitTouch);
			body.on( 'click touchend', '.fl-row-quick-copy', FLBuilder._rowCopySettingsClicked);
			body.on( 'click touchend', '.fl-row-quick-paste', FLBuilder._rowPasteSettingsClicked);
			parentBody.on( 'click', '.fl-builder-row-settings .fl-builder-settings-save', FLBuilder._saveSettings);

			// Row touch or mouse specific events.
			if ( isTouch ) {
				body.on( 'touchend', '.fl-row-overlay', FLBuilder._rowSettingsClicked);
			} else {
				body.on( 'click', '.fl-row-overlay', FLBuilder._rowSettingsClicked);
			}

			/* Rows Submenu */
			body.on( 'click touchend', '.fl-builder-submenu .fl-block-row-reset', FLBuilder._resetRowWidthClicked);

			/* Columns */
			body.on( 'mousedown', '.fl-col-overlay .fl-block-move, .fl-col-move', FLBuilder._colDragInit);
			body.on( 'touchstart', '.fl-col-overlay .fl-block-move, .fl-col-move', FLBuilder._colDragInitTouch);
			body.on( 'click touchend', '.fl-col-quick-copy', FLBuilder._colCopySettingsClicked);
			body.on( 'click touchend', '.fl-col-quick-paste', FLBuilder._colPasteSettingsClicked);
			body.on( 'click touchend', '.fl-builder-submenu .fl-block-col-reset', FLBuilder._resetColumnWidthsClicked);
			parentBody.on( 'click', '.fl-builder-col-settings .fl-builder-settings-save', FLBuilder._saveSettings);

			// Column touch or mouse specific events.
			if ( isTouch ) {
				body.on( 'touchend', '.fl-col-overlay', FLBuilder._colSettingsClicked);
			} else {
				body.on( 'click', '.fl-col-overlay', FLBuilder._colSettingsClicked);
			}

			/* Modules */
			body.on( 'mousedown', '.fl-module-overlay .fl-block-move, .fl-module-move', FLBuilder._moduleDragInit);
			body.on( 'touchstart', '.fl-module-overlay .fl-block-move, .fl-module-move', FLBuilder._moduleDragInitTouch);
			body.on( 'click touchend', '.fl-module-quick-copy', FLBuilder._moduleCopySettingsClicked);
			body.on( 'click touchend', '.fl-module-quick-paste', FLBuilder._modulePasteSettingsClicked);
			body.on( 'click touchend', '.fl-module-overlay .fl-block-col-settings', FLBuilder._colSettingsClicked);
			parentBody.on( 'click', '.fl-builder-module-settings .fl-builder-settings-save', FLBuilder._saveModuleClicked);

			// Module touch or mouse specific events.
			if ( isTouch ) {
				body.on( 'touchend', '.fl-module-overlay', FLBuilder._moduleSettingsClicked);
			} else {
				body.on( 'click', '.fl-module-overlay', FLBuilder._moduleSettingsClicked);
			}
		},

		/**
		 * Binds the events for overlays that appear when
		 * mousing over a row, column or module.
		 *
		 * @since 1.0
		 */
		_bindOverlayEvents: function()
		{
			var content = $( FLBuilder._contentClass );

			content.on( 'mouseenter touchstart', '.fl-row', FLBuilder._rowMouseenter );
			content.on( 'mouseleave', '.fl-row', FLBuilder._rowMouseleave );
			content.on( 'mouseenter touchstart', '.fl-col', FLBuilder._colMouseenter );
			content.on( 'mouseleave', '.fl-col', FLBuilder._colMouseleave );
			content.on( 'mouseenter touchstart', '.fl-module', FLBuilder._moduleMouseenter );
			content.on( 'mouseleave', '.fl-module', FLBuilder._moduleMouseleave );
		},

		/**
		 * Unbinds the events for overlays that appear when
		 * mousing over a row, column or module.
		 *
		 * @since 1.0
		 */
		_destroyOverlayEvents: function()
		{
			var content = $( FLBuilder._contentClass );

			content.undelegate( '.fl-row', 'mouseenter touchstart', FLBuilder._rowMouseenter );
			content.undelegate( '.fl-row', 'mouseleave', FLBuilder._rowMouseleave );
			content.undelegate( '.fl-col', 'mouseenter touchstart', FLBuilder._colMouseenter );
			content.undelegate( '.fl-col', 'mouseleave', FLBuilder._colMouseleave );
			content.undelegate( '.fl-module', 'mouseenter touchstart', FLBuilder._moduleMouseenter );
			content.undelegate( '.fl-module', 'mouseleave', FLBuilder._moduleMouseleave );
		},

		/**
		 * Hides overlays when the contextmenu event is fired on them.
		 * This allows us to inspect the actual node in the console
		 * instead of getting the overlay.
		 *
		 * @since 2.2
		 * @param {Object} e The event object.
		 */
		_onOverlayContextMenu: function( e )
		{
			$( this ).hide();
		},

		/**
		 * Selects the overlay for the specified node.
		 *
		 * @since 2.8
		 * @param {Object} node
		 * @param {Boolean} openSettings
		 */
		_selectNodeOverlay: function( node, openSettings = true )
		{
			var body = $( 'body' );
			var selected = $( '.fl-node-selected' );

			if ( ! node.length ) {
				return;
			}

			selected.removeClass( 'fl-node-selected' );
			node.addClass( 'fl-node-selected' );
			body.removeClass( 'fl-block-overlay-muted' );

			FLBuilder._selectedNode = node.data( 'node' );
			FLBuilder._removeModuleOverlays();
			FLBuilder._removeColOverlays();
			FLBuilder._hideTipTips();

			node.trigger( 'mouseover' );

			if ( openSettings ) {
				node.find( '> .fl-block-overlay a.fl-block-settings' ).eq(0).trigger( 'click' );
			}
		},

		/**
		 * Selects the parent node for the current node overlay.
		 *
		 * @since 2.8
		 * @param {Object} e The event object.
		 */
		_selectNodeParentOnIconClick: function( e )
		{
			var node = $( this ).closest( '[data-node]' );
			var parent = node.parents( '[data-node]:not(.fl-col-group)' ).eq( 0 );

			FLBuilder._selectNodeOverlay( parent );

			e.stopPropagation();
		},

		/**
		 * Selects a parent node from the parent select menu.
		 *
		 * @since 2.8
		 * @param {Object} e The event object.
		 */
		_selectNodeParentOnMenuClick: function( e )
		{
			var nodeId = $( this ).data( 'target-node' );
			var node = $( `[data-node=${ nodeId }]` );

			FLBuilder._selectNodeOverlay( node );
			FLBuilder._removeNodeParentHighlight();

			e.stopPropagation();
		},

		/**
		 * Highlights a parent node when hovered in the select menu.
		 *
		 * @since 2.8
		 */
		_highlightNodeParentOnMenuHover: function()
		{
			var nodeId = $( this ).data( 'target-node' );
			var node = $( `[data-node=${ nodeId }]` );

			FLBuilder._removeNodeParentHighlight();

			if ( node.hasClass( 'fl-block-overlay-active' ) ) {
				node.addClass( 'fl-overlay-highlight' );
			} else {
				node.addClass( 'fl-node-highlight' );
			}
		},

		/**
		 * Removes all parent node highlights.
		 *
		 * @since 2.8
		 */
		_removeNodeParentHighlight: function()
		{
			$( '.fl-node-highlight' ).removeClass( 'fl-node-highlight' );
			$( '.fl-overlay-highlight' ).removeClass( 'fl-overlay-highlight' );
		},

		/**
		 * Gets the menu data for the parent select menu.
		 *
		 * @since 2.8
		 * @param {Object} node
		 * @return {Array}
		 */
		_getNodeParentMenuData: function( node )
		{
			var selector = '.fl-row, .fl-col, .fl-module';
			var parents = node.parentsUntil( FLBuilder._contentClass, selector ).add( node );
			var data = [];

			if ( ! parents.length ) {
				return null;
			}

			parents.each( function( i ) {
				var parent = $( this );

				data[ i ] = {
					node: parent.data( 'node' )
				};

				if ( parent.hasClass( 'fl-row' ) ) {
					data[ i ].name = FLBuilderStrings.row;
					data[ i ].type = 'row';
				} else if ( parent.hasClass( 'fl-col' ) ) {
					data[ i ].name = FLBuilderStrings.column;
					data[ i ].type = 'col';
				} else {
					data[ i ].name = parent.data( 'name' );
					data[ i ].type = 'module';
				}
			} );

			return data;
		},

		/**
		 * Deselect the currently selected overlay.
		 *
		 * @since 2.8
		 */
		_deselectNodeOverlay: function()
		{
			var selected = $( '.fl-node-selected' );

			selected.removeClass( 'fl-node-selected' );
			selected.removeClass( 'fl-block-overlay-active' );
			selected.find( '> .fl-block-overlay' ).remove();

			FLBuilder._selectedNode = null;
		},

		/**
		 * Deselect the currently selected overlay on the esc key.
		 * Doing it like this because Mousetrap doesn't support multiple
		 * callbacks for the same key.
		 *
		 * @since 2.8
		 * @param {Object} e The event object.
		 */
		_deselectNodeOverlayOnEsc: function( e )
		{
			if ( e.key === 'Escape' ) {
				FLBuilder._deselectNodeOverlay();
			}
		},

		/**
		 * Deselect the currently selected overlay an overlay is clicked.
		 *
		 * @since 2.8
		 * @param {Object} e The event object.
		 */
		_deselectNodeOverlayOnClick: function( e )
		{
			var overlay = $( this );
			var node = overlay.closest( '[data-node]' );

			if ( node.hasClass( 'fl-node-selected' ) ) {
				e.stopImmediatePropagation();
			}

			FLBuilder._deselectNodeOverlay();
		},

		/**
		 * Deselect the currently selected overlay an overlay actions are clicked.
		 *
		 * @since 2.8
		 * @param {Object} e The event object.
		 */
		_deselectNodeOverlayOnActionsClick: function( e )
		{
			var overlay = $( this );
			var node = overlay.closest( '[data-node]' );

			if ( node.hasClass( 'fl-node-selected' ) ) {
				return;
			}

			FLBuilder._deselectNodeOverlay();
		},

		/**
		 * Removes all node overlays and hides any tooltip helpies.
		 *
		 * @since 1.0
		 */
		_removeAllOverlays: function()
		{
			FLBuilder._removeRowOverlays();
			FLBuilder._removeColOverlays();
			FLBuilder._removeModuleOverlays();
			FLBuilder._hideTipTips();
			FLBuilder._closeAllSubmenus();
		},

		/**
		 * Removes all row overlays from the page.
		 *
		 * @since 1.0
		 */
		_removeRowOverlays: function()
		{
			var rows = $('.fl-row:not(.fl-node-selected)');

			rows.removeClass('fl-block-overlay-active');
			rows.find('.fl-row-overlay').remove();
			rows.find('.fl-module').removeClass('fl-module-adjust-height');
			$('body').removeClass( 'fl-builder-row-resizing' );
			FLBuilder._closeAllSubmenus();
			FL.Builder.data.getOutlinePanelActions().setFocusNode( false );
		},

		/**
		 * Shows an overlay with actions when the mouse enters a row.
		 *
		 * @since 1.0
		 */
		_rowMouseenter: function()
		{
			if ( 'undefined' == typeof FLBuilderSettingsConfig.nodes ) {
				return;
			}
			var row        	= $( this ),
				id			= row.attr('data-node'),
                rowTop     	= row.offset().top,
                childTop   	= null,
                overlay    	= null,
                template   	= wp.template( 'fl-row-overlay' ),
				mode 		= FLBuilderResponsiveEditing._mode,
				settings 	= FLBuilderSettingsConfig.nodes[ id ],
				selected    = id === FLBuilder._selectedNode,
				parentChildren = row.parent().find( '> .fl-row' ),
				isFirst		= 0 === parentChildren.index( row ),
				isLast		= parentChildren.index( row ) === parentChildren.length - 1;

			if ( selected ) {
				FLBuilder._removeRowOverlays();
				return;
			}
			else if ( row.closest( '.fl-builder-node-loading' ).length ) {
				return;
			}
			else if ( row.find( '.fl-row-overlay' ).length ) {
				return;
			}
            else if ( ! row.hasClass( 'fl-block-overlay-active' ) ) {

				// Remove existing overlays.
				FLBuilder._removeRowOverlays();

                // Append the overlay.
                overlay = FLBuilder._appendOverlay( row, template( {
                    node : id,
	                global : row.hasClass( 'fl-node-global' ),
					hasRules : row.hasClass( 'fl-node-has-rules' ),
					rulesTextRow : row.attr('data-rules-text'),
					rulesTypeRow : row.attr('data-rules-type'),
					nodeLabel : settings?.node_label,
					isFirst: isFirst,
					isLast: isLast,
                } ) );

                // Adjust the overlay position if covered by negative margin content.
                row.find( '.fl-node-content:visible' ).each( function(){
                    var top = $( this ).offset().top;
                    childTop = ( null === childTop || childTop > top ) ? top : childTop;
                } );

                if ( null !== childTop && childTop < rowTop ) {
	                overlay.css( 'top', ( childTop - rowTop - 30 ) + 'px' );
                }

                // Put action headers on the bottom if they're hidden.
                if ( ( 'default' === mode && overlay.offset().top < 43 ) || ( 'default' !== mode && 0 === row.index() ) ) {
                    overlay.addClass( 'fl-row-overlay-header-bottom' );
                }

                // Adjust the height of modules if needed.
                row.find( '.fl-module' ).each( function(){
                    var module = $( this );
                    if ( module.outerHeight( true ) < 20 ) {
                        module.addClass( 'fl-module-adjust-height' );
                    }
                } );

				// Add the muted class if we have a select node in the row.
				if ( row.find( '.fl-node-selected' ).length ) {
					$('body').addClass('fl-block-overlay-muted');
				}

                // Build the overlay overflow menu if needed.
				if ( ! row.hasClass( 'fl-node-has-rules' ) ) {
					FLBuilder._buildOverlayOverflowMenu( overlay );
				}
            }
		},

		/**
		 * Removes overlays when the mouse leaves a row.
		 *
		 * @since 1.0
		 * @param {Object} e The event object.
		 */
		_rowMouseleave: function(e)
		{
			var target			= $( e.target ),
				toElement       = $(e.toElement) || $(e.relatedTarget),
				isOverlay       = toElement.hasClass('fl-row-overlay'),
				isOverlayChild  = toElement.closest('.fl-row-overlay').length > 0,
				isTipTip        = toElement.is('#tiptip_holder'),
				isTipTipChild   = toElement.closest('#tiptip_holder').length > 0;

			if ( target.closest( '.fl-block-col-resize' ).length ) {
				return;
			}
			if ( isOverlay || isOverlayChild || isTipTip || isTipTipChild ) {
				return;
			}

			FLBuilder._removeRowOverlays();
		},

		/**
		 * Removes all column overlays from the page.
		 *
		 * @since 1.6.4
		 */
		_removeColOverlays: function()
		{
			var cols = $( '.fl-col:not(.fl-node-selected)' );

			cols.removeClass('fl-block-overlay-active');
			cols.find('> .fl-col-overlay').remove();
			FLBuilder._closeAllSubmenus();
			FL.Builder.data.getOutlinePanelActions().setFocusNode( false );
		},

		/**
		 * Shows an overlay with actions when the mouse enters a column.
		 *
		 * @since 1.1.9
		 */
		_colMouseenter: function( e )
		{
			if ( 'undefined' == typeof FLBuilderSettingsConfig.nodes ) {
				return;
			}
			var col 	 	  	= $( this ),
				group           = col.closest( '.fl-col-group' ),
				id				= group.attr( 'data-node' ),
				groupLoading    = group.hasClass( 'fl-col-group-has-child-loading' ),
				global		  	= col.hasClass( 'fl-node-global' ),
				parentGlobal  	= col.parents( '.fl-node-global' ).length > 0,
				numCols		  	= col.closest( '.fl-col-group' ).find( '> .fl-col' ).length,
				index           = group.find( '> .fl-col' ).index( col ),
				isFirst   		= 0 === index,
				isLast    		= numCols === index + 1,
				hasChildCols    = col.find( '.fl-col' ).length > 0,
				hasModules      = col.find('.fl-module').length > 0,
				parentCol       = col.parents( '.fl-col' ),
				parentGroup     = parentCol.closest( '.fl-col-group' ),
				hasParentCol    = parentCol.length > 0,
				isColTemplate   = 'undefined' !== typeof col.data('template-url'),
				isRootCol       = 'column' == FLBuilderConfig.userTemplateType && ! hasParentCol,
				numParentCols	= hasParentCol ? parentGroup.find( '> .fl-col' ).length : 0,
				parentIndex     = parentGroup.find( '> .fl-col' ).index( parentCol ),
				parentFirst     = hasParentCol ? 0 === parentIndex : false,
				parentLast      = hasParentCol ? numParentCols === parentIndex + 1 : false,
				row				= col.closest('.fl-row'),
				rowIsFixedWidth = !! row.find('.fl-row-fixed-width').addBack('.fl-row-fixed-width').length,
				userCanResizeRows = FLBuilderConfig.rowResize.userCanResizeRows,
				hasRules		= col.hasClass( 'fl-node-has-rules' ),
				template 		= wp.template( 'fl-col-overlay' ),
				overlay			= null,
				colNode 		= col.attr( 'data-node' ),
				settings 		= FLBuilderSettingsConfig.nodes[ colNode ],
				selected		= col.hasClass( 'fl-node-selected' ),
				parentMenu    	= FLBuilder._getNodeParentMenuData( col );

			if ( FLBuilderConfig.simpleUi && ! global ) {
				return;
			}
			else if ( $( e.relatedTarget ).closest( '.fl-block-move-dir' ).length ) {
				return;
			}
			else if ( global && ! selected && parentGlobal && hasModules && ! isColTemplate ) {
				return;
			}
			else if ( global && ! selected && 'column' == FLBuilderConfig.userTemplateType && hasModules ) {
				return;
			}
			else if ( ! global && ! selected && col.find( '.fl-module' ).length > 0 ) {
				return;
			}
			else if ( col.find( '.fl-builder-node-loading-placeholder' ).length > 0 ) {
				return;
			}
			else if ( ! hasModules && hasChildCols && ! selected ) {
				return;
			}
			else if ( parentGlobal && hasChildCols && ! isColTemplate ) {
				return;
			}
			else if ( col.closest( '.fl-builder-node-loading' ).length ) {
				return;
			}
			else if ( col.parents( '.fl-node-selected' ).length ) {
				return;
			}
			else if ( ! col.hasClass( 'fl-block-overlay-active' ) ) {

				// Remove existing overlays.
				FLBuilder._removeColOverlays();
				FLBuilder._removeModuleOverlays();

				// Append the template.
				overlay = FLBuilder._appendOverlay( col, template( {
					global	      		: global,
					groupLoading  		: groupLoading,
					numCols	      		: numCols,
					isFirst         	: isFirst,
					isLast   	      	: isLast,
					isRootCol     		: isRootCol,
					hasChildCols  		: hasChildCols,
					hasParentCol  		: hasParentCol,
					parentFirst   		: parentFirst,
					parentLast    		: parentLast,
					numParentCols 		: numParentCols,
					rowIsFixedWidth 	: rowIsFixedWidth,
					userCanResizeRows 	: userCanResizeRows,
					hasRules			: hasRules,
					nodeLabel 			: settings?.node_label,
					parentMenu			: parentMenu
				} ) );

				// Build the overlay overflow menu if needed.
				FLBuilder._buildOverlayOverflowMenu( overlay );

				// Init column resizing.
				FLBuilder._initColDragResizing();
			}

			if ( ! col.closest( '.fl-row.fl-node-selected' ).length ) {
				$('body').addClass('fl-block-overlay-muted');
			}
		},

		/**
		 * Removes overlays when the mouse leaves a column.
		 *
		 * @since 1.1.9
		 * @param {Object} e The event object.
		 */
		_colMouseleave: function(e)
		{
			var col             = $(this),
				toElement       = $(e.toElement) || $(e.relatedTarget),
				hasModules      = col.find('.fl-module').length > 0,
				global			= col.hasClass( 'fl-node-global' ),
				isColTemplate	= 'undefined' !== typeof col.data('template-url'),
				isTipTip        = toElement.is('#tiptip_holder'),
				isTipTipChild   = toElement.closest('#tiptip_holder').length > 0,
				selected		= col.hasClass( 'fl-node-selected' );

			if( isTipTip || isTipTipChild ) {
				return;
			}
			if( hasModules && ! isColTemplate ) {
				return;
			}

			if ( selected ) {
				return;
			} else {
				$('body').removeClass('fl-block-overlay-muted');
			}

			FLBuilder._removeColOverlays();
			FLBuilder._removeNodeParentHighlight();
			FLBuilder._closeAllSubmenus();
		},

		/**
		 * Removes all module overlays from the page.
		 *
		 * @since 1.6.4
		 */
		_removeModuleOverlays: function()
		{
			var modules = $('.fl-module:not(.fl-node-selected)');

			modules.removeClass('fl-block-overlay-active');
			modules.find('> .fl-module-overlay').remove();
			FLBuilder._closeAllSubmenus();
			FL.Builder.data.getOutlinePanelActions().setFocusNode( false );
		},

		/**
		 * Shows an overlay with actions when the mouse enters a module.
		 *
		 * @since 1.0
		 */
		_moduleMouseenter: function( e )
		{
			if ( 'undefined' == typeof FLBuilderSettingsConfig.nodes ) {
				return;
			}
			var module = $( this ),
				id       = module.attr( 'data-node' ),
				settings = FLBuilderSettingsConfig.nodes[ id ],
				moduleType = module.attr( 'data-type' ),
				moduleName    = module.attr( 'data-name' ),
				global		  = module.hasClass( 'fl-node-global' ),
				parent		  = module.parent(),
				parentGlobal  = module.parents( '.fl-node-global' ).length > 0,
				group         = module.parents( '.fl-col-group' ).last(),
				groupLoading  = group.hasClass( 'fl-col-group-has-child-loading' ),
				numCols		  = module.closest( '.fl-col-group' ).find( '> .fl-col' ).length,
				col           = module.closest( '.fl-col' ),
				colFirst      = col.index() <= 0,
				colNode 	  = col.attr( 'data-node' ),
				colLast       = numCols === col.index() + 1,
				parentCol     = col.parents( '.fl-col' ),
				hasParentCol  = parentCol.length > 0,
				numParentCols = hasParentCol ? parentCol.closest( '.fl-col-group' ).find( '> .fl-col' ).length : 0,
				parentFirst   = hasParentCol ? 0 === parentCol.index() : false,
				parentLast    = hasParentCol ? numParentCols === parentCol.index() + 1 : false,
				row			  = module.closest('.fl-row'),
				isGlobalRow   = row.hasClass( 'fl-node-global' ),
				rowIsFixedWidth = !! row.find('.fl-row-fixed-width').addBack('.fl-row-fixed-width').length,
				userCanResizeRows = FLBuilderConfig.rowResize.userCanResizeRows,
				hasRules	  = module.hasClass( 'fl-node-has-rules' ),
				rulesTextModule = module.attr('data-rules-text'),
				rulesTypeModule = module.attr('data-rules-type'),
				rulesTextCol    = col.attr('data-rules-text'),
				rulesTypeCol    = col.attr('data-rules-type'),
				colHasRules	  = col.hasClass( 'fl-node-has-rules' ),
				parentMenu    = FLBuilder._getNodeParentMenuData( module ),
				hasParentModule = module.parents( '.fl-module' ).length > 0,
				isRootModule  = 'module' === FLBuilderConfig.userTemplateType && ! hasParentModule,
				hasChildren   = module.find( '[data-parent="' + id +'"]' ).length > 0,
				selected      = id === FLBuilder._selectedNode,
				parentChildren = parent.find( '> [data-node]' ),
				isFirst		  = 0 === parentChildren.index( module ),
				isLast		  = parentChildren.index( module ) === parentChildren.length - 1,
				layoutDirection = FLBuilder._getNodeLayoutDirection( module ),
				template	  = wp.template( 'fl-module-overlay' ),
				overlay       = null;

			if ( $( e.relatedTarget ).closest( '.fl-block-move-dir' ).length ) {
				return;
			}
			else if ( global && parentGlobal && ! FLBuilderConfig.userTemplateType ) {
				return;
			}
			else if ( ( ! global || FLBuilderConfig.userTemplateType ) && hasChildren && ! selected ) {
				return;
			}
			else if ( module.parents( '.fl-node-selected' ).length ) {
				return;
			}
			else if ( module.closest( '.fl-builder-node-loading' ).length ) {
				return;
			}
			else if ( module.find( '.fl-inline-editor:visible' ).length ) {
				return;
			}
			else if ( ! module.hasClass( 'fl-block-overlay-active' ) ) {

				// Remove existing overlays.
				FLBuilder._removeColOverlays();
				FLBuilder._removeModuleOverlays();

				// Append the template.
				overlay = FLBuilder._appendOverlay( module, template( {
					global 		  		: global,
					moduleType	  		: moduleType,
					moduleName	  		: moduleName,
					nodeLabel			: settings?.node_label,
					groupLoading  		: groupLoading,
					numCols		  		: numCols,
					colFirst      		: colFirst,
					colLast       		: colLast,
					hasParentCol  		: hasParentCol,
					numParentCols 		: numParentCols,
					parentFirst   		: parentFirst,
					parentLast    		: parentLast,
					rowIsFixedWidth 	: rowIsFixedWidth,
					userCanResizeRows : userCanResizeRows,
					hasRules          : hasRules,
					rulesTextModule   : rulesTextModule,
					rulesTypeModule   : rulesTypeModule,
					rulesTextCol      : rulesTextCol,
					rulesTypeCol      : rulesTypeCol,
					colHasRules       : colHasRules,
					parentMenu		  : parentMenu,
					isRootModule	  : isRootModule,
					isFirst			  : isFirst,
					isLast			  : isLast,
					layoutDirection	  : layoutDirection,
				} ) );

				// Build the overlay overflow menu if necessary.
				FLBuilder._buildOverlayOverflowMenu( overlay );

				// Init column resizing.
				FLBuilder._initColDragResizing();
			}

			if ( ! module.closest( '.fl-row.fl-node-selected' ).length ) {
				$('body').addClass('fl-block-overlay-muted');
			}
		},

		/**
		 * Removes overlays when the mouse leaves a module.
		 *
		 * @since 1.0
		 * @param {Object} e The event object.
		 */
		_moduleMouseleave: function(e)
		{
			var module          = $(this),
				isGlobalChild   = module.parents( '.fl-module.fl-node-global' ).length > 0,
				toElement       = $(e.toElement) || $(e.relatedTarget),
				isTipTip        = toElement.is('#tiptip_holder'),
				isTipTipChild   = toElement.closest('#tiptip_holder').length > 0,
				selected		= module.hasClass( 'fl-node-selected' );

			if(isGlobalChild || isTipTip || isTipTipChild) {
				return;
			}

			if (selected) {
				return;
			} else {
				$('body').removeClass('fl-block-overlay-muted');
			}

			FLBuilder._removeModuleOverlays();
			FLBuilder._removeNodeParentHighlight();
		},

		/**
		 * Appends a node action overlay to the layout.
		 *
		 * @since 1.6.3.3
		 * @param {Object} node A jQuery reference to the node this overlay is associated with.
		 * @param {Object} template A rendered wp.template.
		 * @return {Object} The overlay element.
		 */
		_appendOverlay: function( node, template )
		{
			var overlayPos 	= 0,
				overlay 	= null,
				isRow		= node.hasClass( 'fl-row' ),
				nodeId = node.attr('data-node'),
				content		= isRow ? node.find( '> .fl-row-content-wrap' ) : node.find( '> .fl-node-content' ),
				margins 	= {
					'top' 		: parseInt( content.css( 'margin-top' ), 10 ),
					'bottom' 	: parseInt( content.css( 'margin-bottom' ), 10 )
				};

			// Append the template.
			node.append( template );

			// Add the active class to the node.
			node.addClass( 'fl-block-overlay-active' );

			FL.Builder.data.getOutlinePanelActions().setFocusNode( nodeId );

			// Init TipTips
			FLBuilder._initTipTips();

			// Get a reference to the overlay.
			overlay = node.find( '> .fl-block-overlay' );

			// Adjust the overlay positions to account for negative margins.
			if ( margins.top < 0 ) {
				overlayPos = parseInt( overlay.css( 'top' ), 10 );
				overlayPos = isNaN( overlayPos ) ? 0 : overlayPos;
				overlay.css( 'top', ( margins.top + overlayPos ) + 'px' );
			}
			if ( margins.bottom < 0 ) {
				overlayPos = parseInt( overlay.css( 'bottom' ), 10 );
				overlayPos = isNaN( overlayPos ) ? 0 : overlayPos;
				overlay.css( 'bottom', ( margins.bottom + overlayPos ) + 'px' );
			}

			return overlay;
		},

		/**
		 * Resize an overlay for flex layouts if there is enough
		 * space next to the module. This prevents the overflow menu
		 * from showing when it is not necessary.
		 *
		 * @since 2.8
		 * @param {Object} overlay
		 */
		_resizeOverlay: function( overlay ) {
			if ( ! overlay.hasClass( 'fl-module-overlay' ) ) {
				return;
			}

			var module = overlay.closest( '.fl-module' );
			var parentModule = module.parents( '.fl-module' );
			var layoutDirection = FLBuilder._getNodeLayoutDirection( module );

			// Only continue if a horizontal container and over the last child.
			if ( ! parentModule.length || 'horizontal' !== layoutDirection ) {
				return;
			} else if ( module.next( '.fl-module' ).length ) {
				return;
			}

			// Adjust the overlay based on sibling width.
			var siblings = module.siblings( '.fl-module' );
			var siblingsWidth = 0;

			siblings.each( function() {
				siblingsWidth += $( this ).outerWidth( true );
			} );

			overlay.width( parentModule.width() - siblingsWidth );

			// Adjust the overlay if it overflows the parent.
			var overlayRect = overlay[0].getBoundingClientRect();
			var parentRect = parentModule[0].getBoundingClientRect();

			if ( overlayRect.right > parentRect.right ) {
				overlay.width( overlayRect.width - ( overlayRect.right - parentRect.right ) )
			}

			// Adjust the overlay if it's smaller than the module.
			if ( overlay.width() < module.width() ) {
				overlay.width( module.width() )
			}
		},

		/**
		 * Builds the overflow menu for an overlay if necessary.
		 *
		 * @since 1.9
		 * @param {Object} overlay The overlay object.
		 */
		_buildOverlayOverflowMenu: function( overlay )
		{
			var header        = overlay.find( '.fl-block-overlay-header' ),
				actions       = overlay.find( '.fl-block-overlay-actions' ),
				hasRules	  = overlay.find( '.fl-block-has-rules' ),
				original      = actions.data( 'original' ),
				actionsWidth  = 0,
				actionsLeft   = 0,
				actionsRight  = 0,
				items         = null,
				itemsWidth    = 0,
				item          = null,
				i             = 0,
				visibleItems  = [],
				overflowItems = [],
				menuData      = [],
				template	  = wp.template( 'fl-overlay-overflow-menu' );

			// Resize the overlay if there is enough space.
			FLBuilder._resizeOverlay( overlay );

			// Use the original copy if we have one.
			if ( undefined != original ) {
				actions.after( original );
				actions.remove();
				actions = original;
			}

			// Save a copy of the original actions.
			actions.data( 'original', actions.clone() );

			// Get the actions width and items.
			actionsLeft   = parseInt( actions.css( 'padding-left' ) );
			actionsRight  = parseInt( actions.css( 'padding-right' ) );
			actionsWidth  = actions.outerWidth() - actionsLeft - actionsRight;
			items         = actions.find( ' > i, > span' );

			// Add the width of the visibility rules indicator if there is one.
			if ( hasRules.length && actionsWidth + hasRules.outerWidth() > header.outerWidth() ) {
				itemsWidth += hasRules.outerWidth();
			}

			// Remove the max-width to calculate true item width.
			actions.css( 'max-width', 'none' );

			// Find visible and overflow items.
			for( ; i < items.length; i++ ) {

				item        = items.eq( i );
				itemsWidth += Math.floor(item[0].getBoundingClientRect().width);

				if ( itemsWidth > actionsWidth ) {
					overflowItems.push( item );
					item.remove();
				}
				else {
					visibleItems.push( item );
				}
			}

			// Add the max-width back.
			actions.css( 'max-width', '100%' );

			// Build the menu if we have overflow items.
			if ( overflowItems.length > 0 ) {

				if( visibleItems.length > 0 ) {
					overflowItems.unshift( visibleItems.pop().remove() );
				}

				for( i = 0; i < overflowItems.length; i++ ) {

					if ( overflowItems[ i ].is( '.fl-builder-has-submenu' ) ) {
						menuData.push( {
							type    : 'submenu',
							label   : overflowItems[ i ].find( '.fa, .fas, .far, svg' ).data( 'title' ),
							submenu : overflowItems[ i ].find( '.fl-builder-submenu' )[0].outerHTML,
							className : overflowItems[ i ].find( '> i, > svg' ).removeClass( function( i, c ) {
											return c.replace( /fl-block-([^\s]+)/, '' );
										} ).attr( 'class' )
						} );
					}
					else {
						menuData.push( {
							type      : 'action',
							label     : overflowItems[ i ].data( 'title' ),
							className : overflowItems[ i ].removeClass( function( i, c ) {
											return c.replace( /fl-block-([^\s]+)/, '' );
										} ).attr( 'class' )
						} );
					}
				}

				actions.append( template( menuData ) );
				FLBuilder._initTipTips();
			}
		},
	} );

} )( jQuery );
