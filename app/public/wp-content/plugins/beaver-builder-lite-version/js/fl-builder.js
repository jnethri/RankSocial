(function($){

	/**
	 * The main builder interface class.
	 *
	 * @since 1.0
	 * @class FLBuilder
	 */
	FLBuilder = {

		/**
		 * An instance of FLBuilderPreview for working
		 * with the current live preview.
		 *
		 * @since 1.3.3
		 * @property {FLBuilderPreview} preview
		 */
		preview                     : null,

		/**
		 * An instance of FLLightbox for displaying a list
		 * of actions a user can take such as publish or cancel.
		 *
		 * @since 1.0
		 * @access private
		 * @property {FLLightbox} _actionsLightbox
		 */
		_actionsLightbox            : null,

		/**
		 * An array of AJAX data that needs to be requested
		 * after the current request has finished.
		 *
		 * @since 2.2
		 * @property {Array} _ajaxQueue
		 */
		_ajaxQueue                  : [],

		/**
		 * A reference to the current AJAX request object.
		 *
		 * @since 2.2
		 * @property {Object} _ajaxRequest
		 */
		_ajaxRequest                : null,

		/**
		 * An object that holds data for column resizing.
		 *
		 * @since 1.6.4
		 * @access private
		 * @property {Object} _colResizeData
		 */
		_colResizeData              : null,

		/**
		 * A flag for whether a column is being resized or not.
		 *
		 * @since 1.6.4
		 * @access private
		 * @property {Boolean} _colResizing
		 */
		_colResizing              	: false,

		/**
		 * The CSS class of the main content wrapper for the
		 * current layout that is being worked on.
		 *
		 * @since 1.0
		 * @access private
		 * @property {String} _contentClass
		 */
		_contentClass               : false,

		/**
		 * Whether dragging has been enabled or not.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Boolean} _dragEnabled
		 */
		_dragEnabled                : false,

		/**
		 * Whether an element is currently being dragged or not.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Boolean} _dragging
		 */
		_dragging                   : false,

		/**
		 * The initial scroll top of the window when a drag starts.
		 * Used to reset the scroll top when a drag is cancelled.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Boolean} _dragging
		 */
		_dragInitialScrollTop       : 0,

		/**
		 * The URL to redirect to when a user leaves the builder.
		 *
		 * @since 1.0
		 * @access private
		 * @property {String} _exitUrl
		 */
		_exitUrl                    : null,

		/**
		 * An instance of FLBuilderAJAXLayout for rendering
		 * the layout via AJAX.
		 *
		 * @since 1.7
		 * @property {FLBuilderAJAXLayout} _layout
		 */
		_layout                     : null,

		/**
		 * An array of layout data that needs to be rendered
		 * after the current rendered is finished.
		 *
		 * @since 2.2
		 * @property {Array} _layoutQueue
		 */
		_layoutQueue                 : [],

		/**
		 * A cached copy of custom layout CSS that is used to
		 * revert changes if the cancel button is clicked.
		 *
		 * @since 1.7
		 * @property {String} _layoutSettingsCSSCache
		 */
		_layoutSettingsCSSCache     : null,

		/**
		 * A timeout for throttling custom layout CSS changes.
		 *
		 * @since 1.7
		 * @property {Object} _layoutSettingsCSSTimeout
		 */
		_layoutSettingsCSSTimeout   : null,

		/**
		 * An instance of FLLightbox for displaying settings.
		 *
		 * @since 1.0
		 * @access private
		 * @property {FLLightbox} _lightbox
		 */
		_lightbox                   : null,

		/**
		 * A timeout for refreshing the height of lightbox scrollbars
		 * in case the content changes from dynamic settings.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Object} _lightboxScrollbarTimeout
		 */
		_lightboxScrollbarTimeout   : null,

		/**
		 * An array that's used to cache which module settings
		 * CSS and JS assets have already been loaded so they
		 * are only loaded once.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Array} _loadedModuleAssets
		 */
		_loadedModuleAssets         : [],

		/**
		 * An object used to store module settings helpers.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Object} _moduleHelpers
		 */
		_moduleHelpers              : {},

		/**
		 * An instance of wp.media used to select multiple photos.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Object} _multiplePhotoSelector
		 */
		_multiplePhotoSelector      : null,

		/**
		 * A jQuery reference to a group that a new column
		 * should be added to once it's finished rendering.
		 *
		 * @since 2.0
		 * @access private
		 * @property {Object} _newColParent
		 */
		_newColParent          		: null,

		/**
		 * The position a column should be added to within
		 * a group once it finishes rendering.
		 *
		 * @since 2.0
		 * @access private
		 * @property {Number} _newColPosition
		 */
		_newColPosition        		: 0,

		/**
		 * A jQuery reference to a row that a new column group
		 * should be added to once it's finished rendering.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Object} _newColGroupParent
		 */
		_newColGroupParent          : null,

		/**
		 * The position a column group should be added to within
		 * a row once it finishes rendering.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Number} _newColGroupPosition
		 */
		_newColGroupPosition        : 0,

		/**
		 * A jQuery reference to a new module's parent.
		 *
		 * @since 1.7
		 * @access private
		 * @property {Object} _newModuleParent
		 */
		_newModuleParent          	: null,

		/**
		 * The position a new module should be added at once
		 * it finishes rendering.
		 *
		 * @since 1.7
		 * @access private
		 * @property {Number} _newModulePosition
		 */
		_newModulePosition        	: 0,

		/**
		 * The position a row should be added to within
		 * the layout once it finishes rendering.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Number} _newRowPosition
		 */
		_newRowPosition             : 0,

		/**
		 * The ID of a template that the user has selected.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Number} _selectedTemplateId
		 */
		_selectedTemplateId         : null,

		/**
		 * The type of template that the user has selected.
		 * Possible values are "core" or "user".
		 *
		 * @since 1.0
		 * @access private
		 * @property {String} _selectedTemplateType
		 */
		_selectedTemplateType       : null,

		/**
		 * An instance of wp.media used to select a single photo.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Object} _singlePhotoSelector
		 */
		_singlePhotoSelector        : null,

		/**
		 * An instance of wp.media used to select a single video.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Object} _singleVideoSelector
		 */
		_singleVideoSelector        : null,

		/**
		 * An instance of wp.media used to select a multiple audio.
		 *
		 * @since 1.0
		 * @access private
		 * @property {Object} _multipleAudiosSelector
		 */
		_multipleAudiosSelector        : null,


		/**
		 * @since 2.2.5
		 */
		_codeDisabled: false,

		/**
		 * Misc data container
		 * @since 2.6
		 * @access private
		 */
		_sandbox: {},

		/**
		 * Flag whether to clear preview or not
		 * @access private
		 */
		_publishAndRemain: false,

		_shapesEdited: false,

		/**
		 * Initializes the builder interface.
		 *
		 * @since 1.0
		 * @access private
		 * @method _init
		 */
		_init: function()
		{
			FLBuilder.UIIFrame.init();

			FLBuilder._initJQueryReadyFix();
			FLBuilder._initGlobalErrorHandling();
			FLBuilder._initPostLock();
			FLBuilder._initClassNames();
			FLBuilder._initMediaUploader();
			FLBuilder._initOverflowFix();
			FLBuilder._initScrollbars();
			FLBuilder._initLightboxes();
			FLBuilder._initDropTargets();
			FLBuilder._initSortables();
			FLBuilder._initStrings();
			FLBuilder._initSanityChecks();
			FLBuilder._initTipTips();
			FLBuilder._initTinyMCE();
			FLBuilder._bindEvents();
			FLBuilder._bindOverlayEvents();
			FLBuilder._setupEmptyLayout();
			FLBuilder._highlightEmptyCols();
			FLBuilder._checkEnv();
			FLBuilder._initColorScheme();

			FLBuilder.addHook('didInitUI', FLBuilder._showTourOrTemplates.bind(FLBuilder) );
			FLBuilder.addHook('endEditingSession', FLBuilder._doStats.bind(this) );

			FLBuilder.triggerHook('init');
		},

		/**
		 * Prevent errors thrown in jQuery's ready function
		 * from breaking subsequent ready calls.
		 *
		 * @since 1.4.6
		 * @access private
		 * @method _initJQueryReadyFix
		 */
		_initJQueryReadyFix: function()
		{
			if ( FLBuilderConfig.debug ) {
				return;
			}

			jQuery.fn.oldReady = jQuery.fn.ready;

			jQuery.fn.ready = function( fn ) {
				return jQuery.fn.oldReady( function() {
					try {
						if ( 'function' == typeof fn ) {
							fn( $ );
						}
					}
					catch ( e ){
						FLBuilder.logError( e );
					}
				});
			};
		},

		_initSanityChecks: function() {
			if ( FLBuilderConfig.uploadPath && typeof FLBuilderLayout === 'undefined' ) {
				url = '<a href="' + FLBuilderConfig.uploadUrl + '">wp-admin -> Settings -> Media</a>';
				FLBuilder.alert( '<strong>Critcal Error</strong><p style="font-size:15px;">Please go to ' + url + ' and make sure uploads folder settings is blank</p>');
				$('.fl-builder-alert-close', window.parent.document).hide()
			}
		},

		/**
		 * Try to prevent errors from third party plugins
		 * from breaking the builder.
		 *
		 * @since 1.4.6
		 * @access private
		 * @method _initGlobalErrorHandling
		 */
		_initGlobalErrorHandling: function()
		{
			if ( FLBuilderConfig.debug ) {
				return;
			}

			window.onerror = function( message, file, line, col, error ) {
				FLBuilder.logGlobalError( message, file, line, col, error );
				return true;
			};
		},

		/**
		 * Send a wp.heartbeat request to lock editing of this
		 * post so it can only be edited by the current user.
		 *
		 * @since 1.0.6
		 * @access private
		 * @method _initPostLock
		 */
		_initPostLock: function()
		{
			if(typeof wp.heartbeat != 'undefined') {

				wp.heartbeat.interval(120);

				wp.heartbeat.enqueue('fl_builder_post_lock', {
					post_id: FLBuilderConfig.postId
				});
			}
		},

		/**
		 * Initializes html and body classes as well as the
		 * builder content class for this post.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initClassNames
		 */
		_initClassNames: function()
		{
			var html = $( 'html' ).add( 'html', window.parent.document ),
				body = $( 'body' ).add( 'body', window.parent.document );

			html.addClass( 'fl-builder-edit' );
			body.addClass( 'fl-builder' );

			if ( FLBuilderConfig.simpleUi ) {
				body.addClass( 'fl-builder-simple' );
			}

			FLBuilder._contentClass = '.fl-builder-content-' + FLBuilderConfig.postId;

			$( FLBuilder._contentClass ).addClass( 'fl-builder-content-editing' );
		},

		/**
		 * Initializes the WordPress media uploader so any files
		 * uploaded will be attached to the current post.
		 *
		 * @since 1.2.2
		 * @access private
		 * @method _initMediaUploader
		 */
		_initMediaUploader: function()
		{
			wp.media.model.settings.post.id = FLBuilderConfig.postId;
		},

		/**
		 * Third party themes that set their content wrappers to
		 * overflow:hidden break builder overlays. We set them
		 * to overflow:visible while editing.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initOverflowFix
		 */
		_initOverflowFix: function()
		{
			$(FLBuilder._contentClass).parents().css('overflow', 'visible');
		},

		/**
		 * Initializes Nano Scroller scrollbars for the
		 * builder interface.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initScrollbars
		 */
		_initScrollbars: function()
		{
			var scrollers = $('.fl-nanoscroller', window.parent.document).nanoScroller({
				documentContext: window.parent.document,
				alwaysVisible: false,
				preventPageScrolling: true,
				paneClass: 'fl-nanoscroller-pane',
				sliderClass: 'fl-nanoscroller-slider',
				contentClass: 'fl-nanoscroller-content'
			}),
				settingsScroller = scrollers.filter('.fl-builder-settings-fields'),
				pane = settingsScroller.find('.fl-nanoscroller-pane');

			if ( pane.length ) {
				var display = pane.get(0).style.display;
				var content = settingsScroller.find('.fl-nanoscroller-content');

				if ( display === "none" ) {
					content.removeClass('has-scrollbar');
				} else {
					content.addClass('has-scrollbar');
				}
			}
		},

		/**
		 * Initializes jQuery sortables for drag and drop.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initSortables
		 */
		_initSortables: function()
		{
			var defaults = {
				frame: null,
				appendTo: FLBuilder._contentClass,
				scroll: true,
				cursor: 'move',
				cursorAt: {
					left: 85,
					top: 20
				},
				distance: 1,
				helper: FLBuilder._blockDragHelper,
				start : FLBuilder._blockDragStart,
				sort: FLBuilder._blockDragSort,
				change: FLBuilder._blockDragChange,
				stop: FLBuilder._blockDragStop,
				placeholder: 'fl-builder-drop-zone',
				tolerance: 'intersect'
			},
			rowConnections 	  = '',
			columnConnections = '',
			moduleConnections = '';

			// Adjust defaults for the iFrame UI.
			if ( FLBuilder.UIIFrame.isEnabled() ) {
				defaults.frame = $( '#fl-builder-ui-iframe', window.parent.document );
				defaults.appendTo = $( 'body', window.parent.document );
				defaults.scroll = false;
			}

			// Module Connections.
			if ( 'row' == FLBuilderConfig.userTemplateType )  {
				moduleConnections = FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-group-drop-target, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-drop-target, ' +
							  		FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-content, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-module[data-accepts]:not(:has(> .fl-module-content)), ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-module[data-accepts] > .fl-module-content';
			}
			else if ( 'column' == FLBuilderConfig.userTemplateType ) {
				moduleConnections = FLBuilder._contentClass + ' .fl-col-group-drop-target, ' +
			                        FLBuilder._contentClass + ' .fl-col-drop-target, ' +
			                        FLBuilder._contentClass + ' .fl-col-content, ' +
									FLBuilder._contentClass + ' .fl-module[data-accepts]:not(:has(> .fl-module-content)), ' +
									FLBuilder._contentClass + ' .fl-module[data-accepts] > .fl-module-content';
			}
			else if ( 'module' == FLBuilderConfig.userTemplateType ) {
				moduleConnections = FLBuilder._contentClass + ' .fl-module[data-accepts]:not(:has(> .fl-module-content)), ' +
									FLBuilder._contentClass + ' .fl-module[data-accepts] > .fl-module-content';
			}
			else {
				moduleConnections = FLBuilder._contentClass + ' .fl-row-drop-target, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-group-drop-target, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-drop-target, ' +
							  		FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col:not(.fl-builder-node-loading):not(.fl-node-global) .fl-col-content, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-module[data-accepts]:not(:has(> .fl-module-content)):not(.fl-node-global), ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-module[data-accepts]:not(.fl-node-global) > .fl-module-content';
			}

			// Column Connections.
			if ( 'row' == FLBuilderConfig.userTemplateType )  {
				columnConnections = FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-group-drop-target, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-drop-target';
			}
			else {
				columnConnections = FLBuilder._contentClass + ' .fl-row-drop-target, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-group-drop-target, ' +
									FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-drop-target';
			}

			// Row Connections.
			if ( FLBuilderConfig.nestedColumns ) {
				rowConnections = moduleConnections;
			}
			else if ( 'row' == FLBuilderConfig.userTemplateType )  {
				rowConnections = FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-group-drop-target, ' +
								 FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-drop-target';
			}
			else {
				rowConnections = FLBuilder._contentClass + ' .fl-row-drop-target, ' +
								 FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-group-drop-target, ' +
								 FLBuilder._contentClass + ' .fl-row:not(.fl-builder-node-loading) .fl-col-drop-target';
			}

			// Row layouts from the builder panel.
			$('.fl-builder-rows', window.parent.document).sortable($.extend({}, defaults, {
				connectWith: rowConnections,
				items: '.fl-builder-block-row',
				stop: FLBuilder._rowDragStop
			}));

			// Row templates from the builder panel.
			$('.fl-builder-row-templates', window.parent.document).sortable($.extend({}, defaults, {
				connectWith: FLBuilder._contentClass + ' .fl-row-drop-target',
				items: '.fl-builder-block-row-template:not(.fl-builder-block-disabled)',
				stop: FLBuilder._nodeTemplateDragStop
			}));

			// Saved rows from the builder panel.
			$('.fl-builder-saved-rows', window.parent.document).sortable($.extend({}, defaults, {
				cancel: '.fl-builder-node-template-actions, .fl-builder-node-template-edit, .fl-builder-node-template-delete',
				connectWith: FLBuilder._contentClass + ' .fl-row-drop-target',
				items: '.fl-builder-block-saved-row',
				stop: FLBuilder._nodeTemplateDragStop
			}));

			// Saved columns from the builder panel.
			$('.fl-builder-saved-columns', window.parent.document).sortable($.extend({}, defaults, {
				cancel: '.fl-builder-node-template-actions, .fl-builder-node-template-edit, .fl-builder-node-template-delete',
				connectWith: columnConnections,
				items: '.fl-builder-block-saved-column',
				stop: FLBuilder._nodeTemplateDragStop
			}));

			// Modules from the builder panel.
			$('.fl-builder-modules, .fl-builder-widgets', window.parent.document).sortable($.extend({}, defaults, {
				connectWith: moduleConnections,
				items: '.fl-builder-block-module:not(.fl-builder-block-disabled)',
				stop: FLBuilder._moduleDragStop
			}));

			// Module templates from the builder panel.
			$('.fl-builder-module-templates', window.parent.document).sortable($.extend({}, defaults, {
				connectWith: moduleConnections,
				items: '.fl-builder-block-module-template',
				stop: FLBuilder._nodeTemplateDragStop
			}));

			// Saved modules from the builder panel.
			$('.fl-builder-saved-modules', window.parent.document).sortable($.extend({}, defaults, {
				cancel: '.fl-builder-node-template-actions, .fl-builder-node-template-edit, .fl-builder-node-template-delete',
				connectWith: moduleConnections,
				items: '.fl-builder-block-saved-module',
				stop: FLBuilder._nodeTemplateDragStop
			}));

			// Rows
			$('.fl-row-sortable-proxy', window.parent.document).sortable($.extend({}, defaults, {
				connectWith: FLBuilder._contentClass + ' .fl-row-drop-target',
				helper: FLBuilder._rowDragHelper,
				start: FLBuilder._rowDragStart,
				stop: FLBuilder._rowDragStop
			}));

			// Columns
			$('.fl-col-sortable-proxy', window.parent.document).sortable($.extend({}, defaults, {
				connectWith: moduleConnections,
				helper: FLBuilder._colDragHelper,
				start: FLBuilder._colDragStart,
				stop: FLBuilder._colDragStop
			}));

			// Modules
			$('.fl-module-sortable-proxy', window.parent.document).sortable($.extend({}, defaults, {
				connectWith: moduleConnections,
				helper: FLBuilder._moduleDragHelper,
				start: FLBuilder._moduleDragStart,
				stop: FLBuilder._moduleDragStop
			}));

			// Modules and groups in columns.
			$(FLBuilder._contentClass + ' .fl-col-content').sortable($.extend({}, defaults, {
				cancel: '.fl-module, .fl-col-group',
				handle: '.fl-module-sortable-proxy',
			}));

			// Modules and groups in container modules WITHOUT a wrapper.
			$(FLBuilder._contentClass + ' .fl-module[data-accepts]:not(:has(> .fl-module-content))').sortable($.extend({}, defaults, {
				cancel: '.fl-module, .fl-col-group',
				handle: '.fl-module-sortable-proxy',
			}));

			// Modules and groups in container modules WITH a wrapper.
			$(FLBuilder._contentClass + ' .fl-module[data-accepts] > .fl-module-content').sortable($.extend({}, defaults, {
				cancel: '.fl-module, .fl-col-group',
				handle: '.fl-module-sortable-proxy',
			}));

			// Drop targets
			$(FLBuilder._contentClass + ' .fl-row-drop-target').sortable( defaults );
			$(FLBuilder._contentClass + ' .fl-col-group-drop-target').sortable( defaults );
			$(FLBuilder._contentClass + ' .fl-col-drop-target').sortable( defaults );
		},

		/**
		 * Refreshes the items for all jQuery sortables so any
		 * new items will be recognized.
		 *
		 * @since 2.2
		 * @access private
		 * @method _refreshSortables
		 */
		_refreshSortables: function()
		{
			var sortables = $( '.ui-sortable' ).add( '.ui-sortable', window.parent.document );

			sortables.sortable( 'refresh' );
			sortables.sortable( 'refreshPositions' );
		},

		/**
		 * Initializes text translation
		 *
		 * @since 1.0
		 * @access private
		 * @method _initStrings
		 */
		_initStrings: function()
		{
			$.validator.messages.required = FLBuilderStrings.validateRequiredMessage;
		},

		/**
		 * Binds most of the events for the builder interface.
		 *
		 * @since 1.0
		 * @access private
		 * @method _bindEvents
		 */
		_bindEvents: function()
		{
			/* Links */
			$excludedLinks = $('.fl-builder-bar a, .fl-builder--content-library-panel a, .fl-page-nav .nav a'); // links in ui shouldn't be disabled.
			$('a').not($excludedLinks).on('click', FLBuilder._preventDefault);
			$('.fl-page-nav .nav a').on('click', FLBuilder._headerLinkClicked);
			$('body').on( 'click', '.fl-builder-content a', FLBuilder._preventDefault);
			$('body').on( 'mouseup', 'button.fl-builder-button', this._buttonMouseUp.bind(this) );

			/* Heartbeat */
			$(document).on('heartbeat-tick', FLBuilder._initPostLock);

			/* Unload Warning */
			$(window.parent).on('beforeunload', FLBuilder._warnBeforeUnload);

			/* Lite Version */
			$('body', window.parent.document).on( 'click', '.fl-builder-blocks-pro-expand', FLBuilder._toggleProModules);
			$('body', window.parent.document).on( 'click', '.fl-builder-upgrade-button', FLBuilder._upgradeClicked);

			/* Panel */
			$('.fl-builder-panel-actions .fl-builder-panel-close', window.parent.document).on('click', FLBuilder._closePanel);
			$('body', window.parent.document).on( 'mousedown', '.fl-builder-node-template-actions', FLBuilder._stopPropagation);
			$('body', window.parent.document).on( 'mousedown', '.fl-builder-node-template-edit', FLBuilder._stopPropagation);
			$('body', window.parent.document).on( 'mousedown', '.fl-builder-node-template-delete', FLBuilder._stopPropagation);
			$('body', window.parent.document).on( 'click', '.fl-builder-node-template-edit', FLBuilder._editNodeTemplateClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-node-template-delete', FLBuilder._deleteNodeTemplateClicked);
			$('body', window.parent.document).on( 'mousedown', '.fl-builder-block:not(.fl-builder-block-disabled)', FLBuilder._blockDragInit );
			$('body', window.parent.document).on('mouseup', FLBuilder._blockDragCancel);

			/* Actions Lightbox */
			$('body', window.parent.document).on( 'click', '.fl-builder-actions .fl-builder-cancel-button', FLBuilder._cancelButtonClicked);

			/* Layout and Global Settings */
			$('body', window.parent.document).on( 'click', '.fl-builder-layout-settings .fl-builder-settings-save', FLBuilder._saveLayoutSettingsClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-layout-settings .fl-builder-settings-cancel', FLBuilder._cancelLayoutSettingsClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-global-settings .fl-builder-settings-save', FLBuilder._saveGlobalSettingsClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-global-settings .fl-builder-settings-cancel', FLBuilder._cancelLayoutSettingsClicked);

			/* Template Panel Tab */
			$('body', window.parent.document).on( 'click', '.fl-user-template', FLBuilder._userTemplateClicked);
			$('body', window.parent.document).on( 'click', '.fl-user-template-edit', FLBuilder._editUserTemplateClicked);
			$('body', window.parent.document).on( 'click', '.fl-user-template-delete', FLBuilder._deleteUserTemplateClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-template-replace-button', FLBuilder._templateReplaceClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-template-append-button', FLBuilder._templateAppendClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-template-actions .fl-builder-cancel-button', FLBuilder._templateCancelClicked);

			/* User Template Settings */
			$('body', window.parent.document).on( 'click', '.fl-builder-user-template-settings .fl-builder-settings-save', FLBuilder._saveUserTemplateSettings);

			/* Welcome Actions */
			$('body', window.parent.document).on( 'click', '.fl-builder-no-tour-button', FLBuilder._noTourButtonClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-yes-tour-button', FLBuilder._yesTourButtonClicked);

			/* Alert Lightbox */
			$('body', window.parent.document).on( 'click', '.fl-builder-alert-close', FLBuilder._alertClose);

			/* General Overlays */
			FLBuilder._bindGeneralOverlayEvents();

			/* Node Templates */
			$('body', window.parent.document).on( 'click', '.fl-builder-settings-save-as', FLBuilder._showNodeTemplateSettings);
			$('body', window.parent.document).on( 'click', '.fl-builder-node-template-settings .fl-builder-settings-save', FLBuilder._saveNodeTemplate);

			/* Settings */
			$('body', window.parent.document).on( 'click', '.fl-builder-settings-tabs a', FLBuilder._settingsTabClicked);
			$('body', window.parent.document).on( 'show', '.fl-builder-settings-tabs a', FLBuilder._calculateSettingsTabsOverflow);
			$('body', window.parent.document).on( 'hide', '.fl-builder-settings-tabs a', FLBuilder._calculateSettingsTabsOverflow);
			$('body', window.parent.document).on( 'click', '.fl-builder-settings-cancel', FLBuilder._settingsCancelClicked);

			/* Settings Tabs Overflow menu */
			$('body', window.parent.document).on( 'click', '.fl-builder-settings-tabs-overflow-menu > a', FLBuilder._settingsTabsToOverflowMenuItemClicked.bind(this));
			$('body', window.parent.document).on( 'click', '.fl-builder-settings-tabs-more', FLBuilder._toggleTabsOverflowMenu.bind(this) );
			$('body', window.parent.document).on( 'click', '.fl-builder-settings-tabs-overflow-click-mask', FLBuilder._hideTabsOverflowMenu.bind(this));

			/* Tooltips */
			$('body', window.parent.document).on( 'mouseover', '.fl-help-tooltip-icon', FLBuilder._showHelpTooltip);
			$('body', window.parent.document).on( 'mouseout', '.fl-help-tooltip-icon', FLBuilder._hideHelpTooltip);

			/* Multiple Fields */
			$('body', window.parent.document).on( 'click', '.fl-builder-field-add', FLBuilder._addFieldClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-field-copy', FLBuilder._copyFieldClicked);
			$('body', window.parent.document).on( 'click', '.fl-builder-field-delete', FLBuilder._deleteFieldClicked);

			/* Photo Fields */
			$('body', window.parent.document).on( 'click', '.fl-photo-field .fl-photo-select', FLBuilder._selectSinglePhoto);
			$('body', window.parent.document).on( 'click', '.fl-photo-field .fl-photo-edit', FLBuilder._selectSinglePhoto);
			$('body', window.parent.document).on( 'click', '.fl-photo-field .fl-photo-replace', FLBuilder._selectSinglePhoto);
			$('body', window.parent.document).on( 'click', '.fl-photo-field .fl-photo-remove', FLBuilder._singlePhotoRemoved);

			/* Multiple Photo Fields */
			$('body', window.parent.document).on( 'click', '.fl-multiple-photos-field .fl-multiple-photos-select', FLBuilder._selectMultiplePhotos);
			$('body', window.parent.document).on( 'click', '.fl-multiple-photos-field .fl-multiple-photos-edit', FLBuilder._selectMultiplePhotos);
			$('body', window.parent.document).on( 'click', '.fl-multiple-photos-field .fl-multiple-photos-add', FLBuilder._selectMultiplePhotos);

			/* Video Fields */
			$('body', window.parent.document).on( 'click', '.fl-video-field .fl-video-select', FLBuilder._selectSingleVideo);
			$('body', window.parent.document).on( 'click', '.fl-video-field .fl-video-replace', FLBuilder._selectSingleVideo);
			$('body', window.parent.document).on( 'click', '.fl-video-field .fl-video-remove', FLBuilder._singleVideoRemoved);

			/* Multiple Audio Fields */
			$('body', window.parent.document).on( 'click', '.fl-multiple-audios-field .fl-multiple-audios-select', FLBuilder._selectMultipleAudios);
			$('body', window.parent.document).on( 'click', '.fl-multiple-audios-field .fl-multiple-audios-edit', FLBuilder._selectMultipleAudios);
			$('body', window.parent.document).on( 'click', '.fl-multiple-audios-field .fl-multiple-audios-add', FLBuilder._selectMultipleAudios);

			/* Icon Fields */
			$('body', window.parent.document).on( 'click', '.fl-icon-field .fl-icon-select', FLBuilder._selectIcon);
			$('body', window.parent.document).on( 'click', '.fl-icon-field .fl-icon-replace', FLBuilder._selectIcon);
			$('body', window.parent.document).on( 'click', '.fl-icon-field .fl-icon-remove', FLBuilder._removeIcon);

			/* Settings Form Fields */
			$('body', window.parent.document).on( 'click', '.fl-form-field .fl-form-field-edit', FLBuilder._formFieldClicked);
			$('body', window.parent.document).on( 'click', '.fl-form-field-settings .fl-builder-settings-save', FLBuilder._saveFormFieldClicked);

			/* Layout Fields */
			$('body', window.parent.document).on( 'click', '.fl-layout-field-option', FLBuilder._layoutFieldClicked);

			/* Links Fields */
			$('body', window.parent.document).on( 'click', '.fl-link-field-select', FLBuilder._linkFieldSelectClicked);
			$('body', window.parent.document).on( 'click', '.fl-link-field-search-cancel', FLBuilder._linkFieldSelectCancelClicked);

			/* Loop Settings Fields */
			$('body', window.parent.document).on( 'change', '.fl-loop-data-source-select select[name=data_source]', FLBuilder._loopDataSourceChange);
			$('body', window.parent.document).on( 'change', '.fl-custom-query select[name=post_type]', FLBuilder._customQueryPostTypeChange);
			$('body', window.parent.document).on( 'change', '.fl-custom-query select[name="post_type[]"]', FLBuilder._customQueryPostTypesChange);

			/* Text Fields - Add Predefined Value Selector */
			$('body', window.parent.document).on( 'change', '.fl-text-field-add-value', FLBuilder._textFieldAddValueSelectChange);

			/* Number Fields */
			$('body', window.parent.document).on( 'focus', '.fl-field input[type=number]', FLBuilder._onNumberFieldFocus );
			$('body', window.parent.document).on( 'blur', '.fl-field input[type=number]', FLBuilder._onNumberFieldBlur );

			// Live Preview
			FLBuilder.addHook( 'didCompleteAJAX', FLBuilder._refreshSettingsPreviewReference );
			FLBuilder.addHook( 'didRenderLayoutComplete', FLBuilder._refreshSettingsPreviewReference );
		},

		/**
		 * Remove events when ending the edit session
		 * @since 2.0
		 * @access private
		 */
		_unbindEvents: function() {
			$('a').off('click', FLBuilder._preventDefault);
			$('.fl-page-nav .nav a').off('click', FLBuilder._headerLinkClicked);
			$('body').undelegate('.fl-builder-content a', 'click', FLBuilder._preventDefault);
		},

		/**
		 * Rebind events when restarting the edit session
		 * @since 2.1.2.3
		 * @access private
		 */
		_rebindEvents: function() {
			$('a').on('click', FLBuilder._preventDefault);
			$('.fl-page-nav .nav a').on('click', FLBuilder._headerLinkClicked);
			$('body').on( 'click', '.fl-builder-content a', FLBuilder._preventDefault);
		},

		/**
		 * Prevents the default action for an event.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _preventDefault
		 * @param {Object} e The event object.
		 */
		_preventDefault: function( e )
		{
			e.preventDefault();
		},

		/**
		 * Prevents propagation of an event.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _stopPropagation
		 * @param {Object} e The event object.
		 */
		_stopPropagation: function( e )
		{
			e.stopPropagation();
		},

		/**
		 * Launches the builder for another page if a link in the
		 * builder theme header is clicked.
		 *
		 * @since 1.3.9
		 * @access private
		 * @method _headerLinkClicked
		 * @param {Object} e The event object.
		 */
		_headerLinkClicked: function(e)
		{
			var link = $(this),
				href = link.attr('href');

			// ignore links with a #hash
			if( this.hash ) {
				return;
			}

			e.preventDefault();

			if ( FLBuilderConfig.isUserTemplate )  {
				return;
			}

			FLBuilder._exitUrl = href.indexOf('?') > -1 ? href : href + '?fl_builder';
			FLBuilder.triggerHook('triggerDone');
		},

		/**
		 * Warns the user that their changes won't be saved if
		 * they leave the page while editing settings.
		 *
		 * @since 1.0.6
		 * @access private
		 * @method _warnBeforeUnload
		 * @return {String} The warning message.
		 */
		_warnBeforeUnload: function()
		{
			var rowSettings     = $('.fl-builder-row-settings', window.parent.document).length > 0,
				colSettings     = $('.fl-builder-col-settings', window.parent.document).length > 0,
				moduleSettings  = $('.fl-builder-module-settings', window.parent.document).length > 0;

			if(rowSettings || colSettings || moduleSettings) {
				return FLBuilderStrings.unloadWarning;
			}
		},

		/* Lite Version
		----------------------------------------------------------*/

		/**
		 * Opens a new window with the upgrade URL when the
		 * upgrade button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _upgradeClicked
		 */
		_upgradeClicked: function()
		{
			window.parent.open(FLBuilderConfig.upgradeUrl);
		},

		/**
		 * Toggles the pro module section in lite.
		 *
		 * @since 2.4
		 */
		_toggleProModules: function()
		{
			var button = $( '.fl-builder-blocks-pro-expand', window.parent.document ),
				closed = $( '.fl-builder-blocks-pro-closed', window.parent.document ),
				open = $( '.fl-builder-blocks-pro-open', window.parent.document );

			button.toggleClass( 'fl-builder-blocks-pro-expand-rotate' );

			if ( closed.length ) {
				closed.removeClass( 'fl-builder-blocks-pro-closed' );
				closed.addClass( 'fl-builder-blocks-pro-open' );
			} else {
				open.removeClass( 'fl-builder-blocks-pro-open' );
				open.addClass( 'fl-builder-blocks-pro-closed' );
			}
		},

		/**
		 * Shows the the pro message lightbox.
		 *
		 * @since 2.4
		 */
		_showProMessage: function( feature )
		{
			if ( ! FLBuilderConfig.lite ) {
				return
			}

			var alert = new FLLightbox({
					className: 'fl-builder-pro-lightbox',
					destroyOnClose: true
				}),
				template = wp.template( 'fl-pro-lightbox' );

			alert.open( template( { feature : feature } ) );
		},

		/* TipTips
		----------------------------------------------------------*/

		/**
		 * Initializes tooltip help messages.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _initTipTips
		 */
		_initTipTips: function()
		{
			var classname = '.fl-tip:not(.fl-has-tip)',
				tips = $( classname ).add( classname, window.parent.document );

			tips.each( function(){
				var ele = $( this );
				ele.addClass( 'fl-has-tip' );
				if ( undefined == ele.attr( 'data-title' ) ) {
					ele.attr( 'data-title', ele.attr( 'title' ) );
				}
			} )

			if ( ! FLBuilderLayout._isTouch() ) {
				tips.tipTip( {
					defaultPosition : 'top',
					delay           : 300,
					maxWidth        : 'auto'
				} );
			}
		},

		/**
		 * Removes all tooltip help messages from the screen.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _hideTipTips
		 */
		_hideTipTips: function()
		{
			$('#tiptip_holder').stop().hide();
			$('#tiptip_holder', window.parent.document).stop().hide();
		},

		/* Submenus
		----------------------------------------------------------*/

		/**
		 * Callback for when the parent of a submenu is clicked.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _submenuParentClicked
		 * @param {Object} e The event object.
		 */
		_submenuParentClicked: function( e )
		{
			var body    = $( 'body' ),
				parent  = $( this ),
				submenu = parent.find( '.fl-builder-submenu' );

			if ( parent.hasClass( 'fl-builder-submenu-open' ) ) {
				body.removeClass( 'fl-builder-submenu-open' );
				parent.removeClass( 'fl-builder-submenu-open' );
				parent.removeClass( 'fl-builder-submenu-right' );
			} else {
				if( parent.offset().left + submenu.width() > $( window ).width() ) {
					parent.addClass( 'fl-builder-submenu-right' );
				}

				body.addClass( 'fl-builder-submenu-open' );
				parent.addClass( 'fl-builder-submenu-open' );
			}

			submenu.closest('.fl-row-overlay').addClass('fl-row-menu-active');

			FLBuilder._hideTipTips();
			e.preventDefault();
			e.stopPropagation();
		},

		/**
		 * Callback for when the parent of a submenu is hovered.
		 *
		 * @since 2.6
		 * @access private
		 * @method _hoverMenuParentMouseEnter
		 * @param {Object} e The event object.
		 */
		_hoverMenuParentMouseEnter: function (e) {
			e.stopPropagation();

			var body    = $('body'),
				parent  = $(this),
				submenu = parent.find('.fl-builder-submenu');

			$( '.fl-builder-submenu' ).each( function() {
				var timeout = $( this ).data( 'timeout' );
				if ( 'undefined' !== typeof timeout ) {
					clearTimeout( timeout );
				}
			} );

			// remove classes first
			$('.fl-builder-submenu-right').removeClass('fl-builder-submenu-right');
			$('.fl-builder-submenu-open').removeClass('fl-builder-submenu-open');
			$('.fl-row-menu-active').removeClass('fl-row-menu-active');

			// determine align
			if (parent.offset().left + submenu.width() > $(window).width()) {
				parent.addClass('fl-builder-submenu-right');
			}

			// add classes
			parent.closest('.fl-row-overlay').addClass('fl-row-menu-active');
			body.addClass('fl-builder-submenu-open');
			parent.addClass('fl-builder-submenu-open');
		},

		/**
		 * Callback for when the parent of a submenu is unhovered.
		 *
		 * @since 2.6
		 * @access private
		 * @method _hoverMenuParentMouseLeave
		 * @param {Object} e The event object.
		 */
		_hoverMenuParentMouseLeave: function (e) {
			var parent  = $(this);
			var submenu = parent.find('.fl-builder-submenu');
			var timeout = setTimeout( function() {
				$('.fl-builder-submenu-right').removeClass('fl-builder-submenu-right');
				$('.fl-builder-submenu-open').removeClass('fl-builder-submenu-open');
				$('.fl-row-menu-active').removeClass('fl-row-menu-active');
			}, 500 );

			submenu.data( 'timeout', timeout );
		},

		/**
		 * Callback for when the child of a submenu is clicked.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _submenuChildClicked
		 * @param {Object} e The event object.
		 */
		_submenuChildClicked: function( e )
		{
			var body   = $( 'body' ),
				parent = $( this ).parents( '.fl-builder-has-submenu' );

			if ( ! parent.parents( '.fl-builder-has-submenu' ).length ) {
				body.removeClass( 'fl-builder-submenu-open' );
				parent.removeClass( 'fl-builder-submenu-open' );
			}
		},

		/**
		 * Callback for when the mouse enters a submenu.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _submenuMouseenter
		 * @param {Object} e The event object.
		 */
		_submenuMouseenter: function( e )
		{
			if ($(this).parent().hasClass('fl-builder-submenu-hover')) {
				return;
			}

			var menu 	= $( this ),
				timeout = menu.data( 'timeout' );

			if ( 'undefined' != typeof timeout ) {
				clearTimeout( timeout );
			}
		},

		/**
		 * Callback for when the mouse leaves a submenu.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _submenuMouseleave
		 * @param {Object} e The event object.
		 */
		_submenuMouseleave: function( e )
		{
			if ($(this).parent().hasClass('fl-builder-submenu-hover')) {
				return;
			}

			var body    = $( 'body' ),
				menu 	= $( this ),
				timeout = setTimeout( function() {
					body.removeClass( 'fl-builder-submenu-open' );
					menu.closest( '.fl-builder-has-submenu' ).removeClass( 'fl-builder-submenu-open' );
				}, 500 );

			menu.closest('.fl-row-overlay').removeClass('fl-row-menu-active');
			menu.data( 'timeout', timeout );
		},

		/**
		 * Callback for when the mouse enters the parent
		 * of a nested submenu.
		 *
		 * @since 1.9
		 * @access private
		 * @method _submenuNestedParentMouseenter
		 * @param {Object} e The event object.
		 */
		_submenuNestedParentMouseenter: function( e )
		{
			var parent = $( this );
			var submenu = parent.find( '> .fl-builder-submenu' );
			var winWidth = $( window ).width();
			var leftSpace = parent.offset().left;
			var rightSpace = winWidth - ( parent.width() + leftSpace );
			var menusWidth = parent.width() + leftSpace + submenu.width();

			if ( menusWidth > winWidth && submenu.width() < leftSpace ) {
				parent.addClass( 'fl-builder-submenu-right' );
			} else if ( submenu.width() > rightSpace ) {
				var left = parent.width() - ( submenu.width() - rightSpace );
				submenu.css( 'left', left );
			}
		},

		/**
		 * Closes all open submenus.
		 *
		 * @since 1.9
		 * @access private
		 * @method _closeAllSubmenus
		 */
		_closeAllSubmenus: function()
		{
			$( '.fl-builder-submenu-open' ).removeClass( 'fl-builder-submenu-open' );
		},

		/* Bar
		----------------------------------------------------------*/

		/**
		 * Fires blur on mouse up to avoid focus ring when clicked with mouse.
		 *
		 * @since 2.0
		 * @access private
		 * @method _buttonMouseUp
		 * @param {Event} e
		 * @return void
		 */
		_buttonMouseUp: function(e) {
			$(e.currentTarget).blur();
		},

		/* Panel
		----------------------------------------------------------*/

		/**
		 * Closes the builder's content panel.
		 *
		 * @since 1.0
		 * @access private
		 * @method _closePanel
		 */
		_closePanel: function()
		{
			FLBuilder.triggerHook('hideContentPanel');
		},

		/**
		 * Opens the builder's content panel.
		 *
		 * @since 1.0
		 * @access private
		 * @method _showPanel
		 */
		_showPanel: function()
		{
			FLBuilder.triggerHook('showContentPanel');
		},

		/**
		 * Toggle the panel open or closed.
		 *
		 * @since 2.0
		 * @access private
		 * @method _togglePanel
		 */
		_togglePanel: function()
		{
			FLBuilder.triggerHook('toggleContentPanel');
		},

		/* Save Actions
		----------------------------------------------------------*/

		/**
		* Publish the current layout
		*
		* @since 2.0
		* @access private
		* @method _publishLayout
		* @param {Boolean} shouldExit Whether or not builder should exit after publish
		* @param {Boolean} openLightbox Whether or not to keep the lightboxes open.
		* @return void
		*/
		_publishLayout: function( shouldExit, openLightbox ) {
			// Save existing settings first if any exist. Don't proceed if it fails.
			if ( ! FLBuilder._triggerSettingsSave( openLightbox, true ) ) {
				return;
			}

			if ( _.isUndefined( shouldExit ) ) {
				var shouldExit = true;
			}

			const actions = FL.Builder.data.getLayoutActions()
			const callback = FLBuilder._onPublishComplete.bind( FLBuilder, shouldExit )
			actions.saveLayout( true, shouldExit, callback )
		},

		/**
		 * Publishes the layout when the publish button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @param bool whether or not builder should exit after publish
		 * @method _publishButtonClicked
		 */
		_publishButtonClicked: function( shouldExit )
		{
			FLBuilder._publishLayout( shouldExit );
		},

		/**
		 * Fires on successful ajax publish.
		 *
		 * @since 2.0
		 * @access private
		 * @param bool whether or not builder should exit after publish
		 * @return void
		 */
		_onPublishComplete: function( shouldExit ) {
			if ( shouldExit ) {
				if ( FLBuilderConfig.shouldRefreshOnPublish ) {
					FLBuilder._exit();
				} else {
					FLBuilder._exitWithoutRefresh();
				}
			}

			// Change the admin bar status dot to green if it isn't already
			$('#wp-admin-bar-fl-builder-frontend-edit-link .fl-builder-admin-bar-status-dot').css('color', '#6bc373');

			FLBuilder.triggerHook( 'didPublishLayout', {
				shouldExit: shouldExit,
			} );
		},

		/**
		 * Exits the builder when the save draft button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _draftButtonClicked
		 */
		_draftButtonClicked: function()
		{
			FLBuilder.showAjaxLoader();

			const actions = FL.Builder.data.getLayoutActions()
			actions.saveDraft()
		},

		/**
		 * Clears changes to the layout when the discard draft button
		 * is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _discardButtonClicked
		 */
		_discardButtonClicked: function()
		{
			var result = confirm(FLBuilderStrings.discardMessage);

			if(result) {

				FLBuilder.showAjaxLoader();

				const actions = FL.Builder.data.getLayoutActions()
				actions.discardDraft()
			} else {
				FLBuilder.triggerHook('didCancelDiscard');
			}
		},

		/**
		 * Closes the actions lightbox when the cancel button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _cancelButtonClicked
		 */
		_cancelButtonClicked: function()
		{
			FLBuilder._exitUrl = null;
			FLBuilder._actionsLightbox.close();
		},

		/**
		 * Redirects the user to the _exitUrl if defined, otherwise
		 * it redirects the user to the current post without the
		 * builder active.
		 *
		 * @since 1.0
		 * @since 1.5.7 Closes the window if we're in a child window.
		 * @access private
		 * @method _exit
		 */
		_exit: function()
		{
			var href = window.parent.location.href;

			try {
				var flbuilder = typeof window.parent.opener.FLBuilder != 'undefined'
			}
			catch(err) {
				var flbuilder = false
			}

			if ( FLBuilderConfig.isUserTemplate && typeof window.parent.opener != 'undefined' && window.parent.opener ) {

				if ( flbuilder ) {
					if ( 'undefined' === typeof FLBuilderGlobalNodeId ) {
						window.parent.opener.FLBuilder._updateLayout();
					} else {
						window.parent.opener.FLBuilder._updateNode( FLBuilderGlobalNodeId );
					}
				}

				window.parent.close();
			}
			else {

				if ( FLBuilder._exitUrl ) {
					href = FLBuilder._exitUrl;
				}
				else {
					href = href.replace( '&fl_builder_ui', '' );
					href = href.replace( '?fl_builder&', '?' );
					href = href.replace( '?fl_builder', '' );
					href = href.replace( '&fl_builder', '' );
				}

				if ( window.parent.location.host === 'playground.wordpress.net' ) {
					const meta = '<meta http-equiv="refresh" content="0; URL=\'' + href + '\'" />';
					$( 'head', window.parent.document ).append( meta );
				} else {
					window.parent.location.href = href;
				}
			}
		},

		/**
		 * Allow the editing session to end but don't redirect to any url.
		 *
		 * @since 2.0
		 * @return void
		 */
		_exitWithoutRefresh: function() {
			var href = window.parent.location.href;

			try {
				var flbuilder = typeof window.parent.opener.FLBuilder != 'undefined'
			}
			catch(err) {
				var flbuilder = false
			}

			if ( FLBuilderConfig.isUserTemplate && flbuilder && window.opener ) {

				if ( flbuilder ) {
					if ( 'undefined' === typeof FLBuilderGlobalNodeId ) {
						window.parent.opener.FLBuilder._updateLayout();
					} else {
						window.parent.opener.FLBuilder._updateNode( FLBuilderGlobalNodeId );
					}
				}

				window.parent.close();
			}
			else {
				FLBuilder.triggerHook('endEditingSession');
			}
		},

		/* Tools Actions
		----------------------------------------------------------*/

		/**
		 * Duplicates the current post and builder layout.
		 *
		 * @since 1.0
		 * @access private
		 * @method _duplicateLayoutClicked
		 */
		_duplicateLayoutClicked: function()
		{
			FLBuilder.showAjaxLoader();

			FLBuilder.ajax({
				action: 'duplicate_post'
			}, FLBuilder._duplicateLayoutComplete);
		},

		/**
		 * Redirects the user to the post edit screen of a
		 * duplicated post when duplication is complete.
		 *
		 * @since 1.0
		 * @access private
		 * @method _duplicatePageComplete
		 * @param {Number} The ID of the duplicated post.
		 */
		_duplicateLayoutComplete: function(response)
		{
			var adminUrl = FLBuilderConfig.adminUrl;

			window.parent.location.href = adminUrl + 'post.php?post='+ response +'&action=edit';
		},


		/* Layout Settings
		----------------------------------------------------------*/

		/**
		 * Shows the layout settings lightbox when the layout
		 * settings button is clicked.
		 *
		 * @since 1.7
		 * @access private
		 * @method _layoutSettingsClicked
		 */
		_layoutSettingsClicked: function()
		{
			FLBuilderSettingsForms.render( {
				id        : 'layout',
				className : 'fl-builder-layout-settings',
				settings  : FLBuilderSettingsConfig.settings.layout
			}, function() {
				FLBuilder._layoutSettingsInitCSS();
			} );
		},

		/**
		 * Initializes custom layout CSS for live preview.
		 *
		 * @since 1.7
		 * @access private
		 * @method _layoutSettingsInitCSS
		 */
		_layoutSettingsInitCSS: function()
		{
			var css = $( '.fl-builder-settings #fl-field-css textarea:not(.ace_text-input)', window.parent.document );

			css.on( 'change', FLBuilder._layoutSettingsCSSChanged );

			FLBuilder._layoutSettingsCSSCache = css.val();
		},

		/**
		 * Sets a timeout for throttling custom layout CSS changes.
		 *
		 * @since 1.7
		 * @access private
		 * @method _layoutSettingsCSSChanged
		 */
		_layoutSettingsCSSChanged: function()
		{
			if ( FLBuilder._layoutSettingsCSSTimeout ) {
				clearTimeout( FLBuilder._layoutSettingsCSSTimeout );
			}

			FLBuilder._layoutSettingsCSSTimeout = setTimeout( $.proxy( FLBuilder._layoutSettingsCSSDoChange, this ), 600 );
		},

		/**
		 * Updates the custom layout CSS when changes are made in the editor.
		 *
		 * @since 1.7
		 * @access private
		 * @method _layoutSettingsCSSDoChange
		 */
		_layoutSettingsCSSDoChange: function()
		{
			var form	 = $( '.fl-builder-settings', window.parent.document ),
				textarea = $( this ),
				field    = textarea.parents( '#fl-field-css' );

			if ( field.find( '.ace_error' ).length > 0 ) {
				return;
			}
			else if ( form.hasClass( 'fl-builder-layout-settings' ) ) {
				$( '#fl-builder-layout-css' ).html( textarea.val() );
			}
			else {
				$( '#fl-builder-global-css' ).html( textarea.val() );
			}

			FLBuilder._layoutSettingsCSSTimeout = null;
		},

		/**
		 * Saves the layout settings when the save button is clicked.
		 *
		 * @since 1.7
		 * @access private
		 * @method _saveLayoutSettingsClicked
		 */
		_saveLayoutSettingsClicked: function()
		{
			var form     = $( this ).closest( '.fl-builder-settings' ),
				data     = form.serializeArray(),
				settings = {},
				i        = 0;

			for( ; i < data.length; i++) {
				settings[ data[ i ].name ] = data[ i ].value;
			}

			FLBuilder.showAjaxLoader();
			FLBuilder._lightbox.close();
			FLBuilder._layoutSettingsCSSCache = null;

			const actions = FL.Builder.data.getLayoutActions()
			actions.saveLayoutSettings( settings )
		},

		/**
		 * Reverts changes made when the cancel button for the layout
		 * settings has been clicked.
		 *
		 * @since 1.7
		 * @access private
		 * @method _cancelLayoutSettingsClicked
		 */
		_cancelLayoutSettingsClicked: function()
		{
			var form = $( '.fl-builder-settings', window.parent.document );

			if ( form.hasClass( 'fl-builder-layout-settings' ) ) {
				$( '#fl-builder-layout-css' ).html( FLBuilder._layoutSettingsCSSCache );
			}
			else {
				$( '#fl-builder-global-css' ).html( FLBuilder._layoutSettingsCSSCache );
			}

			FLBuilder._layoutSettingsCSSCache = null;
		},

		/**
		 * Completes the ajax call for saving layout settings.
		 *
		 * @since 2.5
		 * @access private
		 * @method _saveLayoutSettingsComplete
		 * @param {Object} the settings object
		 */
		_saveLayoutSettingsComplete: function( settings )
		{
			FLBuilder.triggerHook( 'didSaveLayoutSettingsComplete', settings )
			FLBuilder._updateLayout()
		},

		/* Global Settings
		----------------------------------------------------------*/

		/**
		 * Shows the global builder settings lightbox when the global
		 * settings button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _globalSettingsClicked
		 */
		_globalSettingsClicked: function()
		{
			const settings = FLBuilderSettingsConfig.settings.global
			settings.color_scheme = FL.Builder.data.getSystemState().colorScheme

			FLBuilderSettingsForms.render( {
				id        : 'global',
				className : 'fl-builder-global-settings',
				settings  : settings
			}, function() {
				FLBuilder._layoutSettingsInitCSS();
				FLBuilder.original_shapes = FLBuilderSettingsConfig.settings.global.shape_form;

			} );
		},

		/**
		 * Saves the global settings when the save button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _saveGlobalSettingsClicked
		 */
		_saveGlobalSettingsClicked: function()
		{
			var form     = $(this).closest('.fl-builder-settings'),
				valid    = form.validate().form(),
				settings = FLBuilder._getSettings( form );

			if(valid) {

				FLBuilder.showAjaxLoader();
				FLBuilder._layoutSettingsCSSCache = null;

				const actions = FL.Builder.data.getLayoutActions()
				actions.saveGlobalSettings( settings )

				FLBuilder._lightbox.close();

				// if number of global shapes has changed then refresh.
				if ( 'undefined' != typeof FLBuilder.original_shapes && FLBuilder.original_shapes.length !== settings.shape_form?.length ) {
					FLBuilder._shapesEdited = true;
				}
			}
		},

		/**
		 * Saves the global settings when the save button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _saveGlobalSettingsComplete
		 * @param {String} response
		 */
		_saveGlobalSettingsComplete: function( response )
		{
			FLBuilder.triggerHook( 'didSaveGlobalSettingsComplete', FLBuilder._jsonParse( response ) );

			FLBuilder._updateLayout();

			if ( FLBuilder._shapesEdited === true ) {
				window.parent.location.reload(true);
			}
		},

		/* Global Styles - See extensions for global styles code.
		----------------------------------------------------------*/

		/**
		 * Shows the global builder styles lightbox when the global
		 * styles button is clicked.
		 *
		 * @since 2.8
		 */
		_globalStylesClicked: function()
		{
			if ( FLBuilderConfig.lite ) {
				FLBuilder._showProMessage( 'Global Styles' );
			} else if ( 'undefined' !== typeof FLBuilderGlobalStyles ) {
				FLBuilderGlobalStyles._showPanel();
			}
		},

		/* Template Selector
		----------------------------------------------------------*/

		/**
		 * Shows the template selector when the builder is launched
		 * if the current layout is empty.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initTemplateSelector
		 */
		_initTemplateSelector: function()
		{
			var rows = $(FLBuilder._contentClass).find('.fl-row'),
				layoutHasContent = ( rows.length > 0 );

			if( ! layoutHasContent ) {
				FLBuilder.ContentPanel.show('modules');
			}
		},

		/**
		* Show options for inserting or appending a template when a template is selected.
		* This logic was moved from `_templateClicked` to unbind it from the specific event.
		*
		* @since 2.0
		* @access private
		* @method _requestTemplateInsert
		*/
		_requestTemplateInsert: function(index, type) {

			// if there are existing rows in the layout
			if( FLBuilder.layoutHasContent() ) {

				// If the template is blank, no need to ask
				if(index == 0) {
					if( confirm( FLBuilderStrings.changeTemplateMessage ) ) {
						FLBuilder._lightbox._node.hide();
						FLBuilder._applyTemplate(0, false, type);
					}
				}
				// present options Replace or Append
				else {
					FLBuilder._selectedTemplateId = index;
					FLBuilder._selectedTemplateType = type;
					FLBuilder._showTemplateActions();
					FLBuilder._lightbox._node.hide();
				}
			}
			// if there are no rows, just insert the template.
			else {
				FLBuilder._applyTemplate(index, false, type);
			}
		},

		/**
		 * Shows the actions lightbox for replacing and appending templates.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _showTemplateActions
		 */
		_showTemplateActions: function()
		{
			var buttons = [];

			buttons[ 10 ] = {
				'key': 'template-replace',
				'label': FLBuilderStrings.templateReplace
			};

			buttons[ 20 ] = {
				'key': 'template-append',
				'label': FLBuilderStrings.templateAppend
			};

			FLBuilder._showActionsLightbox({
				'className': 'fl-builder-template-actions',
				'title': FLBuilderStrings.actionsLightboxTitle,
				'buttons': buttons
			});
		},

		/**
		 * Replaces the current layout with a template when the replace
		 * button is clicked.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _templateReplaceClicked
		 */
		_templateReplaceClicked: function()
		{
			if(confirm(FLBuilderStrings.changeTemplateMessage)) {
				FLBuilder._actionsLightbox.close();
				FLBuilder._applyTemplate(FLBuilder._selectedTemplateId, false, FLBuilder._selectedTemplateType);
			}
		},

		/**
		 * Append a template to the current layout when the append
		 * button is clicked.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _templateAppendClicked
		 */
		_templateAppendClicked: function()
		{
			FLBuilder._actionsLightbox.close();
			FLBuilder._applyTemplate(FLBuilder._selectedTemplateId, true, FLBuilder._selectedTemplateType);
		},

		/**
		 * Shows the template selector when the cancel button of
		 * the template actions lightbox is clicked.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _templateCancelClicked
		 */
		_templateCancelClicked: function()
		{
			FLBuilder.triggerHook( 'showContentPanel' );
		},

		/**
		 * Applys a template to the current layout by either appending
		 * it or replacing the current layout with it.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _applyTemplate
		 * @param {Number} id The template id.
		 * @param {Boolean} append Whether the new template should be appended or not.
		 * @param {String} type The type of template. Either core or user.
		 */
		_applyTemplate: function( id, append, type )
		{
			append  = typeof append === 'undefined' || ! append ? '0' : '1'
			type    = typeof type === 'undefined' ? 'core' : type

			FLBuilder._lightbox.close();
			FLBuilder.showAjaxLoader();

			const actions = FL.Builder.data.getLayoutActions()
			actions.applyTemplate( id, append, type )

			FLBuilder.triggerHook('didApplyTemplate');
		},

		/**
		 * Callback for when applying a template completes.

		 * @since 2.0
		 * @access private
		 * @method _applyTemplateComplete
		 * @param  {String} response
		 */
		_applyTemplateComplete:  function( response )
		{
			var data = FLBuilder._jsonParse( response );

			FLBuilder._renderLayout( data.layout );
			FLBuilder.triggerHook( 'didApplyTemplateComplete', data.config );
		},

		/**
		 * Callback for when applying a user template completes.

		 * @since 1.9.5
		 * @access private
		 * @method _applyUserTemplateComplete
		 * @param  {string} response
		 */
		_applyUserTemplateComplete: function( response )
		{
			var data = FLBuilder._jsonParse( response );

			if ( null !== data.layout_css ) {
				$( '#fl-builder-layout-css' ).html( data.layout_css );
			}

			FLBuilder._renderLayout( data.layout );
			FLBuilder.triggerHook( 'didApplyTemplateComplete', data.config );
		},

		/* User Template Settings
		----------------------------------------------------------*/

		/**
		 * Shows the settings for saving a user defined template
		 * when the save template button is clicked.
		 *
		 * @since 1.1.3
		 * @access private
		 * @method _saveUserTemplateClicked
		 */
		_saveUserTemplateClicked: function()
		{
			if ( FLBuilderConfig.lite ) {
				FLBuilder._showProMessage( 'Saving Templates' );
				return;
			}

			FLBuilderSettingsForms.render( {
				id        : 'user_template',
				className : 'fl-builder-user-template-settings',
				rules 	  : {
					name: {
						required: true
					}
				}
			} );
		},

		/**
		 * Saves user template settings when the save button is clicked.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _saveUserTemplateSettings
		 */
		_saveUserTemplateSettings: function()
		{
			var form     = $(this).closest('.fl-builder-settings'),
				valid    = form.validate().form(),
				settings = FLBuilder._getSettings(form);

			if(valid) {

				const actions = FL.Builder.data.getLayoutActions()
				actions.saveUserTemplateSettings( settings )

				FLBuilder._lightbox.close();
			}
		},

		/**
		 * Shows a success alert when user template settings have saved.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _saveUserTemplateSettingsComplete
		 */
		_saveUserTemplateSettingsComplete: function(data)
		{
			if ( !data ) return;
			var data = FLBuilder._jsonParse(data);

			FLBuilderConfig.contentItems.template.push(data);
			FLBuilder.triggerHook('contentItemsChanged');
		},

		/**
		 * Callback for when a user clicks a user defined template in
		 * the template selector.
		 *
		 * @since 1.1.3
		 * @access private
		 * @method _userTemplateClicked
		 */
		_userTemplateClicked: function()
		{
			var id = $(this).attr('data-id');

			if($(FLBuilder._contentClass).children('.fl-row').length > 0) {

				if(id == 'blank') {
					if(confirm(FLBuilderStrings.changeTemplateMessage)) {
						FLBuilder._lightbox._node.hide();
						FLBuilder._applyTemplate('blank', false, 'user');
					}
				}
				else {
					FLBuilder._selectedTemplateId = id;
					FLBuilder._selectedTemplateType = 'user';
					FLBuilder._showTemplateActions();
					FLBuilder._lightbox._node.hide();
				}
			}
			else {
				FLBuilder._applyTemplate(id, false, 'user');
			}
		},

		/**
		 * Launches the builder in a new tab to edit a user
		 * defined template when the edit link is clicked.
		 *
		 * @since 1.1.3
		 * @access private
		 * @method _editUserTemplateClicked
		 * @param {Object} e The event object.
		 */
		_editUserTemplateClicked: function(e)
		{
			e.preventDefault();
			e.stopPropagation();

			window.parent.open($(this).attr('href'));
		},

		/**
		 * Deletes a user defined template when the delete link is clicked.
		 *
		 * @since 1.1.3
		 * @access private
		 * @method _deleteUserTemplateClicked
		 * @param {Object} e The event object.
		 */
		_deleteUserTemplateClicked: function(e)
		{
			var template = $( this ).closest( '.fl-user-template' ),
				id		 = template.attr( 'data-id' ),
				all		 = $( '.fl-user-template[data-id=' + id + ']', window.parent.document ),
				parent   = null,
				index    = null,
				i        = null,
				item     = null;

			if ( confirm( FLBuilderStrings.deleteTemplate ) ) {

				const actions = FL.Builder.data.getLayoutActions()
				actions.deleteUserTemplate( id )

				// Remove the item from library
				for(i in FLBuilderConfig.contentItems.template) {
					item = FLBuilderConfig.contentItems.template[i];
					if (item.postId == id) {
						index = i;
					}
				}
				if (!_.isNull(index)) {
					FLBuilderConfig.contentItems.template.splice(index, 1);
					FLBuilder.triggerHook('contentItemsChanged');
				}
			}

			e.stopPropagation();
		},

		/* Help Tour
		----------------------------------------------------------*/

		/**
		 * Shows the help tour or template selector when the builder
		 * is launched.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _showTourOrTemplates
		 */
		_showTourOrTemplates: function()
		{
			if ( ! FLBuilderConfig.simpleUi && ! FLBuilderConfig.isUserTemplate ) {

				if ( FLBuilderConfig.help.tour && FLBuilderConfig.newUser ) {
					FLBuilder._showTourLightbox();
				}
				else {
					FLBuilder._initTemplateSelector();
				}
			}
		},

		/**
		 * Save browser stats when builder is loaded.
		 * @since 2.1.6
		 */
		_doStats: function() {
			if( 1 == FLBuilderConfig.statsEnabled ) {

				args = {
					'screen-width': screen.width,
					'screen-height': screen.height,
					'pixel-ratio': window.devicePixelRatio,
					'user-agent': window.navigator.userAgent,
					'isrtl': FLBuilderConfig.isRtl
				}

				FLBuilder.ajax({
					action: 'save_browser_stats',
					browser_data: args
				});
			}
		},

		/**
		 * Shows the actions lightbox with a welcome message for new
		 * users asking if they would like to take the tour.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _showTourLightbox
		 */
		_showTourLightbox: function()
		{
			var template = wp.template( 'fl-tour-lightbox' );

			FLBuilder._actionsLightbox.open( template() );
		},

		/**
		 * Closes the actions lightbox and shows the template selector
		 * if a new user declines the tour.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _noTourButtonClicked
		 */
		_noTourButtonClicked: function()
		{
			FLBuilder._actionsLightbox.close();
			FLBuilder._initTemplateSelector();
		},

		/**
		 * Closes the actions lightbox and starts the tour when a new user
		 * decides to take the tour.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _yesTourButtonClicked
		 */
		_yesTourButtonClicked: function()
		{
			FLBuilder._actionsLightbox.close();
			FLBuilderTour.start();
		},

		/**
		 * Starts the help tour.
		 *
		 * @since 1.4.9
		 * @access private
		 * @method _startHelpTour
		 */
		_startHelpTour: function()
		{
			FLBuilder._actionsLightbox.close();
			FLBuilderTour.start();
		},

		/* Layout
		----------------------------------------------------------*/

		/**
		 * Shows a message to drop a row or module to get started
		 * if the layout is empty.
		 *
		 * @since 1.0
		 * @access private
		 * @method _setupEmptyLayout
		 */
		_setupEmptyLayout: function()
		{
			var content = $(FLBuilder._contentClass);

			if ( FLBuilderConfig.isUserTemplate && 'module' == FLBuilderConfig.userTemplateType ) {
				return;
			}
			else if ( FLBuilderConfig.isUserTemplate && 'column' == FLBuilderConfig.userTemplateType ) {
				return;
			}
			else {
				content.removeClass('fl-builder-empty');
				content.find('.fl-builder-empty-message').remove();

				if ( ! content.find( '.fl-row, .fl-builder-block' ).length ) {
					content.addClass('fl-builder-empty');
					content.append('<span class="fl-builder-empty-message">'+ FLBuilderStrings.emptyMessage +'</span>');
					FLBuilder._initSortables();
				}
			}
		},

		/**
		 * Sends an AJAX request to re-render a single node.
		 *
		 * @since 2.0
		 * @access private
		 * @method _updateNode
		 * @param {String} nodeId
		 * @param {Function} callback
		 */
		_updateNode: function( nodeId, callback )
		{
			if ( ! $( '.fl-node-' + nodeId ).length ) {
				return;
			}

			FLBuilder._showNodeLoading( nodeId );

			const actions = FL.Builder.data.getLayoutActions()
			actions.renderNode( nodeId, callback )
		},

		/**
		 * Sends an AJAX request to render the layout and is typically
		 * used as a callback to many of the builder's save operations.
		 *
		 * @since 1.0
		 * @access private
		 * @method _updateLayout
		 */
		_updateLayout: function()
		{
			FLBuilder.showAjaxLoader();

			const actions = FL.Builder.data.getLayoutActions()
			actions.renderLayout()

			// Refresh Node Data
			actions.fetchLayout()
		},

		/**
		 * Removes the current layout and renders a new layout using
		 * the provided data. Will render a node instead of the layout
		 * if data.partial is true.
		 *
		 * @since 1.0
		 * @access private
		 * @method _renderLayout
		 * @param {Object} data The layout data. May also be a JSON encoded string.
		 * @param {Function} callback A function to call when the layout has finished rendering.
		 */
		_renderLayout: function( data, callback )
		{
			if ( FLBuilder._layout ) {
				FLBuilder._layoutQueue.push( {
					data: data,
					callback: callback,
				} );
			} else {
				FLBuilder._layout = new FLBuilderAJAXLayout( data, callback );
			}
		},

		/**
		 * Called by the layout's JavaScript file once it's loaded
		 * to finish rendering the layout.
		 *
		 * @since 1.0
		 * @access private
		 * @method _renderLayoutComplete
		 */
		_renderLayoutComplete: function()
		{
			if ( FLBuilder._layout ) {
				FLBuilder._layout._complete();
				FLBuilder._layout = null;
			}

			if ( FLBuilder._layoutQueue.length ) {
				var item = FLBuilder._layoutQueue.shift();
				FLBuilder._layout = new FLBuilderAJAXLayout( item.data, item.callback );
			}
		},

		/**
		 * Trigger the resize event on the window so elements
		 * in the layout that rely on JavaScript know to resize.
		 *
		 * @since 1.0
		 * @access private
		 * @method _resizeLayout
		 */
		_resizeLayout: function()
		{
			$(window).trigger('resize');

			if(typeof YUI !== 'undefined') {
				YUI().use('node-event-simulate', function(Y) {
					Y.one(window).simulate("resize");
				});
			}
		},

		/**
		 * Checks to see if any rows exist in the layout, or if it is blank.
		 *
		 * @since 2.0
		 * @method layoutHasContent
		 * @return {Boolean}
		 */
		layoutHasContent: function()
		{
            if( $(FLBuilder._contentClass).children('.fl-row').length > 0) {
                return true;
            } else {
                return false;
            }
        },

		/**
		 * Initializes MediaElements.js audio and video players.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initMediaElements
		 */
		_initMediaElements: function()
		{
			var settings = {};

			if(typeof $.fn.mediaelementplayer != 'undefined') {

				if(typeof _wpmejsSettings !== 'undefined') {
					settings.pluginPath = _wpmejsSettings.pluginPath;
				}

				$('.wp-audio-shortcode, .wp-video-shortcode').not('.mejs-container').mediaelementplayer(settings);
			}
		},

		/* Generic Drag and Drop
		----------------------------------------------------------*/

		/**
		 * Inserts drop targets for nodes such as rows, columns
		 * and column groups since making those all sortables
		 * makes sorting really jumpy.
		 *
		 * @since 1.9
		 * @access private
		 * @method _initDropTargets
		 */
		_initDropTargets: function()
		{
			var notGlobal  = 'row' == FLBuilderConfig.userTemplateType ? '' : ':not(.fl-node-global)',
				rows       = $( FLBuilder._contentClass + ' .fl-row' ),
				row        = null,
				groups     = $( FLBuilder._contentClass + ' .fl-row' + notGlobal ).find( '.fl-col-group' ),
				group      = null,
				cols       = null,
				rootCol    = 'column' == FLBuilderConfig.userTemplateType ? $( FLBuilder._contentClass + '> .fl-col' ).eq(0) : null,
				modules    = $( FLBuilder._contentClass + ' .fl-row' + notGlobal ).find( '.fl-row-content > .fl-module' ),
				i          = 0;

			// Remove old drop targets.
			$( '.fl-col-drop-target' ).remove();
			$( '.fl-col-group-drop-target' ).remove();
			$( '.fl-row-drop-target' ).remove();

			// Row drop targets.
			$( FLBuilder._contentClass ).append( '<div class="fl-drop-target fl-row-drop-target"></div>' );
			rows.prepend( '<div class="fl-drop-target fl-row-drop-target"></div>' );
			rows.append( '<div class="fl-drop-target fl-drop-target-last fl-row-drop-target fl-row-drop-target-last"></div>' );

			// Add drop targets to empty rows.
			rows.find( '.fl-row-content' ).prepend( '<div class="fl-drop-target fl-col-group-drop-target fl-col-group-drop-target-empty"></div>' );
			FLBuilder._initEmptyRowDropTargets();

			// Add drop targets to container modules.
			modules.append( '<div class="fl-drop-target fl-col-group-drop-target"></div>' );
			modules.append( '<div class="fl-drop-target fl-drop-target-last fl-col-group-drop-target fl-col-group-drop-target-last"></div>' );

			// Add drop targets to column groups and columns.
			for ( i = 0; i < groups.length; i++ ) {

				group = groups.eq( i );
				cols  = group.find( '> .fl-col' );

				// Column group drop targets.
				if ( ! group.hasClass( 'fl-col-group-nested' ) ) {
					group.append( '<div class="fl-drop-target fl-col-group-drop-target"></div>' );
					group.append( '<div class="fl-drop-target fl-drop-target-last fl-col-group-drop-target fl-col-group-drop-target-last"></div>' );
				}

				// Column drop targets.
				cols.append( '<div class="fl-drop-target fl-col-drop-target"></div>' );
				cols.append( '<div class="fl-drop-target fl-drop-target-last fl-col-drop-target fl-col-drop-target-last"></div>' );
			}

			// Add drop targets to root column of a column template.
			if ( rootCol && 0 === groups.length ) {
				groups = rootCol.find( '.fl-col-group' );

				rootCol.append( '<div class="fl-drop-target fl-col-drop-target"></div>' );
				rootCol.append( '<div class="fl-drop-target fl-drop-target-last fl-col-drop-target fl-col-drop-target-last"></div>' );
			}
		},

		/**
		 * Shows drop targets in empty rows with no content.
		 *
		 * @method _initEmptyRowDropTargets
		 * @return void
		 */
		_initEmptyRowDropTargets: function()
		{
			var emptyRows = $( FLBuilder._contentClass + ' .fl-row-content:not(:has(*:visible))' );

			$( '.fl-row-content-empty' ).removeClass( '.fl-row-content-empty' );

			if ( emptyRows.length ) {
				emptyRows.addClass( 'fl-row-content-empty' );
			}
		},

		/**
		 * Returns a helper element for a drag operation.
		 *
		 * @since 1.0
		 * @access private
		 * @method _blockDragHelper
		 * @param {Object} e The event object.
		 * @param {Object} item The item being dragged.
		 * @return {Object} The helper element.
		 */
		_blockDragHelper: function (e, item)
		{
			var helper = item.clone();

			item.clone().insertAfter(item);
			helper.addClass('fl-builder-block-drag-helper');

			return helper;
		},

		/**
		 * Initializes a drag operation.
		 *
		 * @since 1.0
		 * @access private
		 * @method _blockDragInit
		 * @param {Object} e The event object.
		 */
		_blockDragInit: function( e )
		{
			var target        = $( e.currentTarget ),
				node          = null,
				scrollTop     = $( window ).scrollTop(),
				initialPos    = 0;

			// Set the _dragEnabled flag.
			FLBuilder._dragEnabled = true;

			// Save the initial scroll position.
			FLBuilder._dragInitialScrollTop = scrollTop;

			// Get the node to scroll to once the node highlights have affected the body height.
			if ( target.closest( '[data-node]' ).length > 0 ) {

				// Set the node to a node instance being dragged.
				node = target.closest( '[data-node]' );

				// Mark this node as initialized for dragging.
				node.addClass( 'fl-node-drag-init' );
			}
			else if ( target.hasClass( 'fl-builder-block' ) ) {

				// Set the node to the first visible row instance.
				$( '.fl-row' ).each( function() {
					if ( node === null && $( this ).offset().top - scrollTop > 0 ) {
						node = $( this );
					}
				} );
			}

			// Get the initial scroll position of the node.
			if ( node !== null ) {
				initialPos = node.offset().top - scrollTop;
			}

			// Setup the UI for dragging.
			FLBuilder._highlightRowsAndColsForDrag( target );
			FLBuilder._adjustColHeightsForDrag();
			FLBuilder._disableGlobalNodes();
			FLBuilder._destroyOverlayEvents();
			FLBuilder._initSortables();
			$( 'body' ).addClass( 'fl-builder-dragging' );
			$( 'body', window.parent.document ).addClass( 'fl-builder-dragging' );
			$( '.fl-builder-empty-message' ).hide();
			$( '.fl-sortable-disabled' ).removeClass( 'fl-sortable-disabled' );

			// Remove all action overlays if this isn't a touch for a proxy item.
			if ( 'touchstart' !== e.type && ! $( e.target ).hasClass( 'fl-sortable-proxy-item ' ) ) {
				FLBuilder._removeAllOverlays();
			}

			// Scroll to the node that is dragging.
			if ( initialPos > 0 ) {
				scrollTo( 0, node.offset().top - initialPos );
			}

			FLBuilder.triggerHook('didInitDrag');
		},

		/**
		 * Callback that fires when dragging starts.
		 *
		 * @since 1.0
		 * @access private
		 * @method _blockDragStart
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_blockDragStart: function(e, ui)
		{
			// Let the builder know dragging has started.
			FLBuilder._dragging = true;

			// Removed the drag init class as we're done with that.
			$( '.fl-node-drag-init' ).removeClass( 'fl-node-drag-init' );

			FLBuilder.triggerHook('didStartDrag');
		},

		/**
		 * Callback that fires when an element that is being
		 * dragged is sorted.
		 *
		 * @since 1.0
		 * @access private
		 * @method _blockDragSort
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_blockDragSort: function(e, ui)
		{
			var parent = ui.placeholder.parent(),
				title  = FLBuilderStrings.insert;

			// Prevent sorting?
			if ( FLBuilder._blockPreventSort( ui.item, parent ) ) {
				return;
			}

			// Reset flex items with a fixed width.
			$( '.fl-sortable-fixed-width' ).css( 'max-width', '' ).removeClass( 'fl-sortable-fixed-width' );

			// Find the placeholder title.
			if(parent.hasClass('fl-col-content') || parent.hasClass('fl-module') || parent.hasClass('fl-module-content')) {

				// Make flex items fixed width while sorting.
				if ((/flex/).test(parent.css('display'))) {
					ui.placeholder.hide();
					parent.css('max-width', '');
					parent.css('max-width', parent.outerWidth());
					parent.addClass( 'fl-sortable-fixed-width' );
					ui.placeholder.show();
				}

				if ((/flex/).test(parent.css('display')) && (/row|row-reverse/).test(parent.css( "flex-direction" ))) {
					title = '';
				}
				else if(ui.item.hasClass('fl-builder-block-row')) {
					title = ui.item.find('.fl-builder-block-title').text();
				}
				else if(ui.item.hasClass('fl-col-sortable-proxy-item')) {
					title = FLBuilderStrings.column;
				}
				else if(ui.item.hasClass('fl-builder-block-module')) {
					title = ui.item.find('.fl-builder-block-title').text();
				}
				else if(ui.item.hasClass('fl-builder-block-saved-module') || ui.item.hasClass('fl-builder-block-module-template')) {
					title = ui.item.find('.fl-builder-block-title').text();
				}
				else {
					title = ui.item.data('name');
				}
			}
			else if(parent.hasClass('fl-col-drop-target')) {
				title = '';
			}
			else if (parent.hasClass('fl-col-group-drop-target')) {
				title = '';
			}
			else if(parent.hasClass('fl-row-drop-target')) {
				if(ui.item.hasClass('fl-builder-block-row')) {
					title = ui.item.find('.fl-builder-block-title').text();
				}
				else if(ui.item.hasClass('fl-builder-block-saved-row')) {
					title = ui.item.find('.fl-builder-block-title').text();
				}
				else if(ui.item.hasClass('fl-builder-block-saved-column')) {
					title = ui.item.find('.fl-builder-block-title').text();
				}
				else if(ui.item.hasClass('fl-row-sortable-proxy-item')) {
					title = FLBuilderStrings.row;
				}
				else {
					title = FLBuilderStrings.newRow;
				}
			}

			// Set the placeholder title.
			ui.placeholder.html(title);

			// Add the global class?
			if ( ui.item.hasClass( 'fl-node-global' ) ||
				 ui.item.hasClass( 'fl-builder-block-global' ) ||
				 $( '.fl-node-dragging' ).hasClass( 'fl-node-global' )
			) {
				ui.placeholder.addClass( 'fl-builder-drop-zone-global' );
			}
			else {
				ui.placeholder.removeClass( 'fl-builder-drop-zone-global' );
			}
		},

		/**
		 * Callback that fires when an element that is being
		 * dragged position changes.
		 *
		 * What we're doing here keeps it from appearing jumpy when draging
		 * between columns. Without this you'd see the placeholder jump into
		 * a column position briefly when you didn't intend for it to.
		 *
		 * @since 1.9
		 * @access private
		 * @method _blockDragChange
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_blockDragChange: function( e, ui )
		{
			FLBuilder._initEmptyRowDropTargets();

			ui.placeholder.css( 'opacity', '0' );
			ui.placeholder.animate( { 'opacity': '1' }, 100 );
		},

		/**
		 * Prevents sorting of items that shouldn't be sorted into
		 * specific areas.
		 *
		 * @since 1.9
		 * @access private
		 * @method _blockPreventSort
		 * @param {Object} item The item being sorted.
		 * @param {Object} parent The new parent.
		 */
		_blockPreventSort: function( item, parent )
		{
			var prevent              = false,
				isRowBlock           = item.hasClass( 'fl-builder-block-row' ),
				isCol                = item.hasClass( 'fl-col-sortable-proxy-item' ),
				isModule         	 = item.hasClass( 'fl-builder-block-module' ) || item.hasClass( 'fl-module-sortable-proxy-item' ),
				isContainerModule	 = parent.data( 'accepts' ),
				isParentColGlobal    = parent.closest('.fl-col[data-template-url]').hasClass('fl-node-global'),
				isParentCol          = parent.hasClass( 'fl-col-content' ),
				isColTarget          = parent.hasClass( 'fl-col-drop-target' ),
				group                = parent.parents( '.fl-col-group:not(.fl-col-group-nested)' ),
				nestedGroup          = parent.parents( '.fl-col-group-nested' ),
				parentType			 = parent.data( 'type' ),
				itemType			 = item.data( 'type' );

			// Handle container modules.
			if ( isContainerModule ) {

				const { accepts } = FLBuilderConfig.contentItems.module.filter( config => parentType === config.slug ).pop();

				// Prevent rows and columns in container modules.
				if ( isRowBlock || isCol ) {
					prevent = true;
				}
				// Prevent unaccepted nodes in container modules.
				else if ( 'object' === typeof accepts && accepts.length && ! accepts.includes( itemType ) ) {
					prevent = true;
				}
			}

			// Prevent modules in unaccepted parents.
			// if ( isModule && 'widget' !== itemType ) {
			// 	const { parents } = FLBuilderConfig.contentItems.module.filter( config => itemType === config.slug ).pop();
			//
			// 	if ( 'object' === typeof parents && ! parents.includes( parentType ) ) {
			// 		prevent = true;
			// 	}
			// }

			// Prevent columns in nested columns.
			if ( ( isRowBlock || isCol ) && isParentCol && nestedGroup.length > 0 ) {
				prevent = true;
			}

			// Prevent 1 column from being nested in an empty column.
			if ( isParentCol && ! parent.find( '.fl-module, .fl-col' ).length ) {

				if ( isRowBlock && '1-col' == item.data( 'cols' ) ) {
					prevent = true;
				}
				else if ( isCol ) {
					prevent = true;
				}
			}

			// Prevent 5 or 6 columns from being nested.
			if ( isRowBlock && isParentCol && $.inArray( item.data( 'cols' ), [ '5-cols', '6-cols' ] ) > -1 ) {
				prevent = true;
			}

			// Prevent columns with nested columns from being dropped in nested columns.
			if ( isCol && $( '.fl-node-dragging' ).find( '.fl-col-group-nested' ).length > 0 ) {

				if ( isParentCol || ( isColTarget && nestedGroup.length > 0 ) ) {
					prevent = true;
				}
			}

			// Prevent more than 12 columns.
			if ( isColTarget && group.length > 0 && 0 === nestedGroup.length && group.find( '> .fl-col:visible' ).length > 11 ) {
				prevent = true;
			}

			// Prevent more than 4 nested columns.
			if ( isColTarget && nestedGroup.length > 0 && nestedGroup.find( '.fl-col:visible' ).length > 3 ) {
				prevent = true;
			}

			// Prevent module from being dropped to a Global Col except when editing a saved column.
			if ( isModule && isParentColGlobal && 'column' !== FLBuilderConfig.userTemplateType ) {
				prevent = true;
			}

			// Prevent dropping into layouts rendered via shortcode.
			if ( parent.closest( '.fl-builder-shortcode-mask-wrap' ).length ) {
				prevent = true;
			}

			// Add the disabled class if we are preventing a sort.
			if ( prevent ) {
				parent.addClass( 'fl-sortable-disabled' );
			}

			return prevent;
		},

		/**
		 * Cleans up when a drag operation has stopped.
		 *
		 * @since 1.0
		 * @access private
		 * @method _blockDragStop
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_blockDragStop: function( e, ui )
		{
			var scrollTop  = $( window ).scrollTop(),
				parent     = ui.item.parent(),
				initialPos = null;

			// Get the node to scroll to once removing the node highlights affects the body height.
			if ( parent.hasClass( 'fl-drop-target' ) && parent.closest( '[data-node]' ).length ) {
				parent = parent.closest( '[data-node]' );
				initialPos = parent.offset().top - scrollTop;
			}
			else {
				initialPos = parent.offset().top - scrollTop;
			}

			// Show the panel if a block was dropped back in.
			if ( parent.hasClass( 'fl-builder-blocks-section-content' ) ) {
				FLBuilder._showPanel();
			}

			// Finish dragging.
			FLBuilder._dragEnabled = false;
			FLBuilder._dragging = false;
			FLBuilder._bindOverlayEvents();
			FLBuilder._removeEmptyRowAndColHighlights();
			FLBuilder._highlightEmptyCols();
			FLBuilder._enableGlobalNodes();
			FLBuilder._setupEmptyLayout();
			$( 'body' ).removeClass( 'fl-builder-dragging' );
			$( 'body', window.parent.document ).removeClass( 'fl-builder-dragging' );

			// Scroll the page back to where it was.
			scrollTo( 0, parent.offset().top - initialPos );

			FLBuilder.triggerHook('didStopDrag');
		},

		/**
		 * Cleans up when a drag operation has canceled.
		 *
		 * @since 1.0
		 * @access private
		 * @method _blockDragCancel
		 */
		_blockDragCancel: function()
		{
			if ( FLBuilder._dragEnabled && ! FLBuilder._dragging ) {
				FLBuilder._dragEnabled = false;
				FLBuilder._dragging = false;
				FLBuilder._bindOverlayEvents();
				FLBuilder._removeEmptyRowAndColHighlights();
				FLBuilder._highlightEmptyCols();
				FLBuilder._enableGlobalNodes();
				FLBuilder._setupEmptyLayout();
				$( 'body' ).removeClass( 'fl-builder-dragging' );
				$( 'body', window.parent.document ).removeClass( 'fl-builder-dragging' );
				$( '.fl-node-drag-init' ).removeClass( 'fl-node-drag-init' );
				$( '.fl-node-dragging' ).removeClass( 'fl-node-dragging' );
				scrollTo( 0, FLBuilder._dragInitialScrollTop );
				FLBuilder.triggerHook('didCancelDrag');
			}
		},

		/**
		 * Reorders a node within its parent.
		 *
		 * @since 1.9
		 * @access private
		 * @method _reorderNode
		 * @param {String} nodeId The node ID of the node.
		 * @param {Number} position The new position.
		 */
		_reorderNode: function( nodeId, position )
		{
			const actions = FL.Builder.getActions()
			actions.moveNode( nodeId, position )
		},

		/**
		 * Handle completion after reorder ajax.
		 *
		 * @since 2.5
		 * @access private
		 * @method _reorderNodeComplete
		 * @param Object ajax response
		 */
		_reorderNodeComplete: function( response ) {
			var data = FLBuilder._jsonParse( response );
			var hook = 'didMove' + data.nodeType.charAt(0).toUpperCase() + data.nodeType.slice(1);
			FLBuilder.triggerHook( 'didMoveNode', data );
			FLBuilder.triggerHook( hook, data );
		},

		/**
		 * Moves a node up a position within its parent.
		 *
		 * @since 2.8
		 */
		_moveNodeUpClicked: function( e )
		{
			var node = $( e.target ).closest( '[data-node]' );
			var nodeId = node.attr( 'data-node' );
			var data = FL.Builder.data.getNode( nodeId );
			var position = data.position - 1;
			var upBtn = node.find( '.fl-block-move-up' ).first();
			var downBtn = node.find( '.fl-block-move-down' ).first();

			if ( position <= 0 ) {
				upBtn.addClass( 'fl-builder-submenu-disabled' );
			} else {
				upBtn.removeClass( 'fl-builder-submenu-disabled' );
			}

			downBtn.removeClass( 'fl-builder-submenu-disabled' );

			FLBuilder._reorderNode( nodeId, position );
			FLBuilder._selectNodeOverlay( node, false );
			FL.Builder.data.updateNode( nodeId, { ...data, position } );
		},

		/**
		 * Moves a node down a position within its parent.
		 *
		 * @since 2.8
		 */
		_moveNodeDownClicked: function( e )
		{
			var node = $( e.target ).closest( '[data-node]' );
			var nodeId = node.attr( 'data-node' );
			var data = FL.Builder.data.getNode( nodeId );
			var position = data.position + 1;
			var upBtn = node.find( '.fl-block-move-up' ).first();
			var downBtn = node.find( '.fl-block-move-down' ).first();
			var parentChildren = node.parent().find( '> [data-node]' );

			if ( position >= parentChildren.length - 1 ) {
				downBtn.addClass( 'fl-builder-submenu-disabled' );
			} else {
				downBtn.removeClass( 'fl-builder-submenu-disabled' );
			}

			upBtn.removeClass( 'fl-builder-submenu-disabled' );

			FLBuilder._reorderNode( nodeId, position );
			FLBuilder._selectNodeOverlay( node, false );
			FL.Builder.data.updateNode( nodeId, { ...data, position } );
		},

		/**
		 * Moves a node to a new parent.
		 *
		 * @since 1.9
		 * @access private
		 * @method _moveNode
		 * @param {String} newParent The node ID of the new parent.
		 * @param {String} nodeId The node ID of the node.
		 * @param {Number} position The new position.
		 */
		_moveNode: function( newParent, nodeId, position )
		{
			const actions = FL.Builder.getActions()
			actions.moveNode( nodeId, position, newParent )
		},

		/**
		 * Finishes a move node operation.
		 *
		 * @since 2.5
		 * @access private
		 * @method _moveNodeComplete
		 * @param Object ajax response
		 */
		_moveNodeComplete: function( response )
		{
			const data = FLBuilder._jsonParse( response );
			const hook = 'didMove' + data.nodeType.charAt( 0 ).toUpperCase() + data.nodeType.slice( 1 );
			FLBuilder.triggerHook( 'didMoveNode', data );
			FLBuilder.triggerHook( hook, data );
		},

		/* Generic Node Methods
		----------------------------------------------------------*/

		/**
		 * Returns a JQuery reference to the HTMLElement for particular node.
		 *
		 * @since 2.5
		 * @access private
		 * @method _getjQueryElement
		 * @return {JQuery} dom reference.
		 */
		_getJQueryElement: function( id ) {
			return $( FLBuilder._contentClass ).find( '[data-node="' + id + '"]' )
		},

		/**
		 * Returns whether a node lays its children out
		 * horizontally, vertically, or layered.
		 *
		 * @since 2.8
		 * @param {Object} node
		 */
		_getNodeLayoutDirection: function( node )
		{
			var isFlex = ( /flex/ ).test( node.parent().css( 'display' ) );
			var isFlexRow = ( /row|row-reverse/ ).test( node.parent().css( 'flex-direction' ) );
			var isGrid = ( /grid/ ).test( node.parent().css( 'display' ) );
			var isLayeredGrid = isGrid && '1 / 1 / -1 / -1' === node.css( 'grid-area' );
			var isSingleColumnGrid = 1 === window.getComputedStyle( node.parent()[0] ).getPropertyValue( 'grid-template-columns' ).split( ' ' ).length;

			if ( isFlex && isFlexRow ) {
				return 'horizontal';
			} else if ( isGrid ) {
				if ( isLayeredGrid ) {
					return 'layered';
				} else if ( ! isSingleColumnGrid ) {
					return 'horizontal';
				}
			}

			return 'vertical';
		},

		/**
		 * Checks if a node requires a confirmation message before deleting.
		 *
		 * @since 2.5
		 * @access private
		 * @method _needsDeleteConfirmation
		 * @return bool
		 */
		_needsDeleteConfirmation: function( node ) {
			if ( 'module' === node.type ) {
				return true
			}

			// Otherwise check if the container has modules
			const el = FLBuilder._getJQueryElement( node.node )
			return el.find( '.fl-module' ).length > 0
		},

		/**
		 * Disables global nodes during drag.
		 *
		 * @since 2.8
		 */
		_disableGlobalNodes: function()
		{
			if ( 'row' !== FLBuilderConfig.userTemplateType ) {
				$( '.fl-row.fl-node-global' ).addClass( 'fl-node-disabled' );
			}

			if ( 'column' !== FLBuilderConfig.userTemplateType ) {
				$( '.fl-row:not(.fl-node-global) .fl-col.fl-node-global' ).addClass( 'fl-node-disabled' );
			}

			if ( 'module' !== FLBuilderConfig.userTemplateType ) {
				$( '.fl-row:not(.fl-node-global) .fl-module.fl-node-global[data-accepts]' ).addClass( 'fl-node-disabled' );
			}
		},

		/**
		 * Remove disabled global node class after drag.
		 *
		 * @since 2.8
		 */
		_enableGlobalNodes: function()
		{
			$( '.fl-node-disabled' ).removeClass( 'fl-node-disabled' );
		},

		/**
		 * Called when the node settings overlay action is clicked.
		 *
		 * @since 2.8
		 */
		_nodeSettingsClicked: function( e )
		{
			var button = $( this );
			var nodeId = button.attr( 'data-target-node' );
			var actions = FL.Builder.getActions();

			if ( ! nodeId ) {
				nodeId = button.parents( '[data-node]' ).attr( 'data-node' );
			}

			actions.openSettings( nodeId );
			e.stopPropagation();
		},

		/**
		 * Called when the node duplicate overlay action is clicked.
		 *
		 * @since 2.8
		 */
		_nodeDuplicateClicked: function( e )
		{
			var button = $( this );
			var nodeId = button.attr( 'data-target-node' );
			var actions = FL.Builder.getActions();

			if ( ! nodeId ) {
				nodeId = button.parents( '[data-node]' ).attr( 'data-node' );
			}

			actions.copyNode( nodeId );
			e.stopPropagation();
		},

		/**
		 * Called when the node remove overlay action is clicked.
		 *
		 * @since 2.8
		 */
		_nodeRemoveClicked: function( e )
		{
			var button = $( this );
			var nodeId = button.attr( 'data-target-node' );
			var actions = FL.Builder.getActions();

			if ( ! nodeId ) {
				nodeId = button.parents( '[data-node]' ).attr( 'data-node' );
			}

			actions.deleteNode( nodeId );
			e.stopPropagation();
		},

		/* Rows
		----------------------------------------------------------*/

		/**
		 * Returns a helper element for row drag operations.
		 *
		 * @since 1.0
		 * @access private
		 * @method _rowDragHelper
		 * @return {Object} The helper element.
		 */
		_rowDragHelper: function()
		{
			return $('<div class="fl-builder-block-drag-helper">' + FLBuilderStrings.row + '</div>');
		},

		/**
		 * Initializes dragging for row. Rows themselves aren't sortables
		 * as nesting that many sortables breaks down quickly and draggable by
		 * itself is slow. Instead, we are programmatically triggering the drag
		 * of our helper div that isn't a nested sortable but connected to the
		 * sortables in the main layout.
		 *
		 * @since 1.9
		 * @access private
		 * @method _rowDragInit
		 * @param {Object} e The event object.
		 */
		_rowDragInit: function( e )
		{
			var handle = $( e.target ),
				helper = $( '.fl-row-sortable-proxy-item', window.parent.document ),
				row    = handle.closest( '.fl-row' );

			if ( handle.closest( '.fl-block-move-menu' ).length ) {
				return;
			}

			row.addClass( 'fl-node-dragging' );

			FLBuilder._blockDragInit( e );

			e.target = helper[ 0 ];

			helper.trigger( e );
		},

		/**
		 * @method _rowDragInitTouch
		 * @param {Object} e The event object.
		 */
		_rowDragInitTouch: function( startEvent )
		{
			var handle = $( startEvent.target ),
				helper = $( '.fl-row-sortable-proxy-item', window.parent.document ),
				row    = handle.closest( '.fl-row' ),
				moved  = false;

			handle.on( 'touchmove', function( moveEvent ) {
				if ( ! moved ) {
					startEvent.currentTarget = row[0];
					FLBuilder._rowDragInit( startEvent );
					moved = true;
				}
				moveEvent.target = helper[0];
				helper.trigger( moveEvent );
			} );

			handle.on( 'touchend', function( endEvent ) {
				endEvent.target = helper[0];
		        helper.trigger( endEvent );
		        endEvent.stopPropagation();
			} );
		},

		/**
		 * Callback that fires when dragging starts for a row.
		 *
		 * @since 1.9
		 * @access private
		 * @method _rowDragStart
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_rowDragStart: function( e, ui )
		{
			var rows = $( FLBuilder._contentClass + ' .fl-row' ),
				row  = $( '.fl-node-dragging' );

			if ( 1 === rows.length ) {
				$( FLBuilder._contentClass ).addClass( 'fl-builder-empty' );
			}

			row.hide();

			FLBuilder._blockDragStart( e, ui );
		},

		/**
		 * Callback for when a row drag operation completes.
		 *
		 * @since 1.0
		 * @access private
		 * @method _rowDragStop
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_rowDragStop: function( e, ui )
		{
			var item     = ui.item,
				parent   = item.parent(),
				row      = null,
				group    = null,
				position = 0;

			FLBuilder._blockDragStop( e, ui );

			// A row was dropped back into the row list.
			if ( parent.hasClass( 'fl-builder-rows' ) ) {
				item.remove();
				return;
			}
			// A row was dropped back into the sortable proxy.
			else if ( parent.hasClass( 'fl-row-sortable-proxy' ) ) {
				$( '.fl-node-dragging' ).removeClass( 'fl-node-dragging' ).show();
				return;
			}
			// Add a new row.
			else if ( item.hasClass( 'fl-builder-block' ) ) {

				// Cancel the drop if the sortable is disabled?
				if ( parent.hasClass( 'fl-sortable-disabled' ) ) {
					item.remove();
					FLBuilder._showPanel();
					return;
				}
				// A new row was dropped into column.
				else if ( parent.hasClass( 'fl-col-content' ) ) {
					FLBuilder._addColGroup(
						item.closest( '.fl-col' ).attr( 'data-node' ),
						item.attr( 'data-cols' ),
						parent.find( '> .fl-module, .fl-col-group, .fl-builder-block' ).index( item )
					);
				}
				// A new row was dropped next to a column.
				else if ( parent.hasClass( 'fl-col-drop-target' ) ) {
					FLBuilder._addCols(
						parent.closest( '.fl-col' ),
						parent.hasClass( 'fl-col-drop-target-last' ) ? 'after' : 'before',
						item.attr( 'data-cols' ),
						parent.closest( '.fl-col-group-nested' ).length > 0
					);
				}
				// A new row was dropped into a column group position.
				else if ( parent.hasClass( 'fl-col-group-drop-target' ) ) {

					group    = item.closest( '.fl-col-group, .fl-module' );
					position = item.closest( '.fl-row' ).find( '.fl-row-content' ).find( '> .fl-col-group, > .fl-module' ).index( group );

					FLBuilder._addColGroup(
						item.closest( '.fl-row' ).attr( 'data-node' ),
						item.attr( 'data-cols' ),
						parent.hasClass( 'fl-drop-target-last' ) ? position + 1 : position
					);
				}
				// A row was dropped into a row position.
				else {

					row = item.closest( '.fl-row' );
					position = ! row.length ? 0 : $( FLBuilder._contentClass + ' > .fl-row' ).index( row );

					FLBuilder._addRow(
						item.attr('data-cols'),
						parent.hasClass( 'fl-drop-target-last' ) ? position + 1 : position
					);
				}

				// Remove the helper.
				item.remove();

				// Show the builder panel.
				FLBuilder._showPanel();
			}
			// Reorder a row.
			else {

				row = $( '.fl-node-dragging' ).removeClass( 'fl-node-dragging' ).show();

				// Make sure a single row wasn't dropped back into the main layout.
				if ( ! parent.parent().hasClass( 'fl-builder-content' ) ) {

					// Move the row in the UI.
					if ( parent.hasClass( 'fl-drop-target-last' ) ) {
						parent.parent().after( row );
					}
					else {
						parent.parent().before( row );
					}

					// Reorder the row.
					FLBuilder._reorderNode(
						row.attr('data-node'),
						row.index()
					);
				}

				// Revert the proxy to its parent.
				$( '.fl-row-sortable-proxy', window.parent.document ).append( ui.item );
			}
		},

		/**
		 * Adds a new row to the layout.
		 *
		 * @since 1.0
		 * @access private
		 * @method _addRow
		 * @param {String} cols The type of column layout to use.
		 * @param {Number} position The position of the new row.
		 * @param {String} module Optional. The node ID of an existing module to move to this row.
		 */
		_addRow: function(cols, position, module)
		{
			FLBuilder._showNodeLoadingPlaceholder( $( FLBuilder._contentClass ), position );

			FLBuilder._newRowPosition = position;

			const actions = FL.Builder.data.getLayoutActions()
			actions.addRow( cols, position, module )
		},

		/**
		 * Adds the HTML for a new row to the layout when the AJAX
		 * add operation is complete.
		 *
		 * @since 1.0
		 * @access private
		 * @method _addRowComplete
		 * @param {String} response The JSON response with the HTML for the new row.
		 */
		_addRowComplete: function(response)
		{
			var data 	= 'object' === typeof response ? response : FLBuilder._jsonParse(response),
				content = $(FLBuilder._contentClass),
				rowId   = $(data.html).data('node');

			// Add new row info to the data.
			data.nodeParent 	= content;
			data.nodePosition 	= FLBuilder._newRowPosition;

			// Render the layout.
			FLBuilder._renderLayout( data, function(){
				FLBuilder._removeNodeLoadingPlaceholder( $( '.fl-node-' + rowId ) );
				FLBuilder.triggerHook( 'didAddRow', rowId );
			} );
		},

		/**
		 * Callback for when the delete row button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _deleteRowClicked
		 * @param {Object} e The event object.
		 */
		_deleteRowClicked: function( e )
		{
			var id    = $( e.target ).closest( '.fl-row' ).data( 'node' );
			var actions = FL.Builder.getActions()
			actions.deleteNode( id )

			e.stopPropagation();
		},

		/**
		 * Deletes a row.
		 *
		 * @since 1.0
		 * @access private
		 * @method _deleteRow
		 * @param {Object} row A jQuery reference of the row to delete.
		 */
		_deleteRow: function(row)
		{
			var nodeId = row.attr('data-node');

			const actions = FL.Builder.data.getLayoutActions()
			actions.deleteNode( nodeId )

			row.empty();
			row.remove();
			FLBuilder._setupEmptyLayout();
			FLBuilder._removeRowOverlays();
			FLBuilder.triggerHook( 'didDeleteRow', nodeId );
		},

		/**
		 * Listen for duplicate click.
		 *
		 * @since 1.3.8
		 * @access private
		 * @method _rowCopyClicked
		 * @param {Object} e The event object.
		 */
		_rowCopyClicked: function(e)
		{
			var id = $( this ).closest( '.fl-row' ).attr( 'data-node' );
			FLBuilder._copyRow( id );

			e.stopPropagation();
		},

		/**
		 * Copy settings of a row.
		 *
		 * @since 2.6
		 * @access private
		 * @method _rowCopySettingsClicked
		 */
		_rowCopySettingsClicked: function () {
			const menuEl = $(this);
			const nodeId = menuEl.closest('.fl-row').data('node');

			// bind copy to the el
			FLBuilderSettingsCopyPaste._bindCopyToElement(menuEl, 'row', nodeId, true);
		},

		/**
		 * Paste settings of a row.
		 *
		 * @since 2.6
		 * @access private
		 * @method _rowPasteSettingsClicked
		 */
		_rowPasteSettingsClicked: function () {
			const menuEl   = $(this);
			const menuText = menuEl.text();
			const nodeId   = menuEl.closest('.fl-row').data('node');
			const success  = FLBuilderSettingsCopyPaste._importFromClipboard('row', nodeId);

			if (!success) {
				// set button text
				menuEl.text(FLBuilderStrings.module_import.error);

				// restore button text
				setTimeout(() => {
					menuEl.text(menuText)
				}, 1000);
			}
		},

		/**
		 * Duplicate a row.
		 *
		 * @since 2.5
		 * @access private
		 * @method _copyRow
		 * @param String id of node
		 * @return void
		 */
		_copyRow: function( nodeId ) {
			var row      	= FLBuilder._getJQueryElement( nodeId ),
				clone    	= row.clone(),
				form	 	= $( '.fl-builder-settings[data-node]', window.parent.document ),
				formNodeId 	= form.attr( 'data-node' ),
				formNode	= ( formNodeId === nodeId ) ? row : row.find( '[data-node="' + formNodeId + '"]' ),
				settings 	= null;

			if ( form.length && formNode.length ) {
				settings = FLBuilder._getSettings( form );
				FLBuilderSettingsConfig.nodes[ formNodeId ] = settings;
			}

			clone.addClass( 'fl-node-' + nodeId + '-clone fl-builder-node-clone' );
			clone.find( '.fl-block-overlay' ).remove();
			clone.removeAttr( 'data-node' );
			row.after( clone );
			FLBuilder._showNodeLoading( nodeId + '-clone' );

			// Animate scroll to new element
			const el  = clone.get(0);
			el.scrollIntoView( {
				behavior: 'smooth',
				block: 'center',
			} );

			const actions = FL.Builder.data.getLayoutActions()
			const callback = function( response ) {
				var data = FLBuilder._jsonParse( response );
				data.nodeParent = $( FLBuilder._contentClass );
				data.nodePosition = $( FLBuilder._contentClass + ' > .fl-row' ).index( clone );
				data.duplicatedRow = nodeId;
				data.onAddNewHTML = function() { clone.remove() };
				FLBuilder._rowCopyComplete( data );
			}
			actions.copyRow( nodeId, settings, formNodeId, callback )
		},

		/**
		 * Callback for when a row has been duplicated.
		 *
		 * @since 1.7
		 * @access private
		 * @method _rowCopyComplete
		 * @param {Object} data
		 */
		_rowCopyComplete: function( data )
		{
			FLBuilder._renderLayout( data, function() {
				FLBuilder.triggerHook( 'didDuplicateRow', {
					newNodeId : data.nodeId,
					oldNodeId : data.duplicatedRow
				} );
			} );
		},

		/**
		 * Shows the settings lightbox and loads the row settings
		 * when the row settings button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _rowSettingsClicked
		 */
		_rowSettingsClicked: function( e )
		{
			var button = $( this),
				nodeId = $( this ).closest( '.fl-row' ).attr( 'data-node' ),
				global = button.closest( '.fl-block-overlay-global' ).length > 0;

			const actions = FL.Builder.getActions()
			actions.openSettings( nodeId )

			e.stopPropagation()
		},

		/**
		 * Show settings for a row node
		 *
		 * @since 2.?
		 * @access private
		 * @method _showRowSettings
		 */
		_showRowSettings: function( nodeId, global )
		{
			let win = null;

			// If we're on a global row template page
			if ( global && 'row' != FLBuilderConfig.userTemplateType ) {
				if ( FLBuilderConfig.userCanEditGlobalTemplates ) {
					win = window.parent.open( $( '.fl-row[data-node="' + nodeId + '"]' ).attr( 'data-template-url' ) );
					win.FLBuilderGlobalNodeId = nodeId;
				}
			} else {
				FLBuilderSettingsForms.render( {
					id        : 'row',
					nodeId    : nodeId,
					className : 'fl-builder-row-settings',
					attrs     : 'data-node="' + nodeId + '"',
					buttons   : ! global && ! FLBuilderConfig.lite && ! FLBuilderConfig.simpleUi ? ['save-as'] : [],
					badges    : global ? [ FLBuilderStrings.global ] : [],
					settings  : FLBuilderSettingsConfig.nodes[ nodeId ],
					preview	  : {
						type: 'row'
					}
				}, function() {
					$( '#fl-field-width select', window.parent.document ).on( 'change', FLBuilder._rowWidthChanged );
					$( '#fl-field-content_width select', window.parent.document ).on( 'change', FLBuilder._rowWidthChanged );
				} );
			}
		},

		/**
		 * Shows or hides the row max-width setting when the
		 * row or row content width is changed.
		 *
		 * @since 2.0
		 * @access private
		 * @method _rowWidthChanged
		 */
		_rowWidthChanged: function()
		{
			var rowWidth     = $( '#fl-field-width select', window.parent.document ).val(),
				contentWidth = $( '#fl-field-content_width select', window.parent.document ).val(),
				maxWidth     = $( '#fl-field-max_content_width', window.parent.document );

			if ( 'fixed' == rowWidth || ( 'full' == rowWidth && 'fixed' == contentWidth ) ) {
				maxWidth.show();
			} else {
				maxWidth.hide();
			}
		},

		/**
		 * Resets the max-width of a row.
		 *
		 * @since 2.0
		 * @access private
		 * @method _resetRowWidthClicked
		 */
		_resetRowWidthClicked: function( e )
		{
			var button   = $( this ),
				row      = button.closest( '.fl-row' ),
				nodeId   = row.attr( 'data-node' ),
				content  = row.find( '.fl-row-content' ),
				width    = FLBuilderConfig.global.row_width + 'px',
				settings = $( '.fl-builder-row-settings', window.parent.document );

			if ( row.hasClass( 'fl-row-fixed-width' ) ) {
				row.css( 'max-width', width );
			}

			content.css( 'max-width', width );

			if ( settings.length ) {
				settings.find( '[name=max_content_width]' ).val( '' );
			}

			const actions = FL.Builder.data.getLayoutActions()
			actions.resetRowWidth( nodeId )

			FLBuilder._closeAllSubmenus();
			FLBuilder.triggerHook( 'didResetRowWidth', nodeId );

			e.stopPropagation();
		},

		/* Columns
		----------------------------------------------------------*/

		/**
		 * Adds a dashed border to empty columns.
		 *
		 * @since 1.0
		 * @access private
		 * @method _highlightEmptyCols
		 */
		_highlightEmptyCols: function()
		{
			var notGlobal = FLBuilderConfig.userTemplateType ? '' : ':not(.fl-node-global)',
				cols 	  = $(FLBuilder._contentClass + ' .fl-col' + notGlobal),
				modules   = $( FLBuilder._contentClass + ' .fl-module[data-accepts]' + notGlobal );

			cols.removeClass('fl-col-highlight').find('.fl-col-content').css( 'min-height', '' );
			modules.removeClass('fl-module-highlight');

			cols.each(function(){
				var col = $(this);
				if(!col.find('.fl-module, .fl-col').length && !col.closest('.fl-builder-shortcode-mask-wrap').length) {
					col.addClass('fl-col-highlight');
				}
			});

			modules.each(function(){
				var module = $(this);
				if(!module.find('.fl-module').length && !module.closest('.fl-builder-shortcode-mask-wrap').length) {
					module.addClass('fl-module-highlight');
				}
			});
		},

		/**
		 * Sets up dashed borders to show where things can
		 * be dropped in rows and columns.
		 *
		 * @since 1.9
		 * @access private
		 * @method _highlightRowsAndColsForDrag
		 * @param {Object} target The event target for the drag.
		 */
		_highlightRowsAndColsForDrag: function( target )
		{
			var notGlobal = 'row' == FLBuilderConfig.userTemplateType ? '' : ':not(.fl-node-global)';

			// Do not highlight root parent column.
			if ( 'column' == FLBuilderConfig.userTemplateType ) {
				notGlobal = ':not(:first)';
			}

			// Highlight rows.
			$( FLBuilder._contentClass + ' > .fl-row' ).addClass( 'fl-row-highlight' );

			// Highlight columns.
			if ( ! target || ! target.closest( '.fl-row-overlay' ).length ) {
				$( FLBuilder._contentClass + ' .fl-col' + notGlobal ).each( function() {
					if ( ! $( this ).closest( '.fl-builder-shortcode-mask-wrap' ).length ) {
						$( this ).addClass( 'fl-col-highlight' );
					}
				} );
			}

			// Highlight container modules.
			$( FLBuilder._contentClass + ' .fl-module[data-accepts]' ).each( function() {
				if ( ! $( this ).closest( '.fl-builder-shortcode-mask-wrap' ).length ) {
					$( this ).addClass( 'fl-module-highlight' );
				}
			} );
		},

		/**
		 * Remove any column highlights
		 *
		 * @since 2.0
		 * @access private
		 * @method _removeEmptyRowAndColHighlights
		 */
		_removeEmptyRowAndColHighlights: function() {
			$( '.fl-row-highlight' ).removeClass('fl-row-highlight');
			$( '.fl-col-highlight' ).removeClass('fl-col-highlight');
			$( '.fl-module-highlight' ).removeClass('fl-module-highlight');
			$( '.fl-sortable-fixed-width' ).css( 'max-width', '' ).removeClass( 'fl-sortable-fixed-width' );
		},

		/**
		 * Adjust the height of columns with modules in them
		 * to account for the drop zone and keep the layout
		 * from jumping around.
		 *
		 * @since 1.9
		 * @access private
		 * @method _adjustColHeightsForDrag
		 */
		_adjustColHeightsForDrag: function()
		{
			var notGlobalRow = 'row' == FLBuilderConfig.userTemplateType ? '' : '.fl-row:not(.fl-node-global) ',
				notGlobalCol = 'column' == FLBuilderConfig.userTemplateType ? '' : '.fl-col:not(.fl-node-global) ',
				content      = $( FLBuilder._contentClass ),
				notNested    = content.find( notGlobalRow + '.fl-col-group:not(.fl-col-group-nested) > ' + notGlobalCol + '> .fl-col-content' ),
				nested       = content.find( notGlobalRow + '.fl-col-group-nested ' + notGlobalCol + '.fl-col-content' ),
				col          = null,
				i            = 0;

			$( '.fl-node-drag-init' ).hide();

			for ( ; i < nested.length; i++ ) {
				if ( ! nested.eq( i ).closest( '.fl-builder-shortcode-mask-wrap' ).length ) {
					FLBuilder._adjustColHeightForDrag( nested.eq( i ) );
				}
			}

			for ( i = 0; i < notNested.length; i++ ) {
				if ( ! notNested.eq( i ).closest( '.fl-builder-shortcode-mask-wrap' ).length ) {
					FLBuilder._adjustColHeightForDrag( notNested.eq( i ) );
				}
			}

			$( '.fl-node-drag-init' ).show();
		},

		/**
		 * Adjust the height of a single column for dragging.
		 *
		 * @since 1.9
		 * @access private
		 * @method _adjustColHeightForDrag
		 */
		_adjustColHeightForDrag: function( col )
		{
			if ( col.find( '.fl-module:visible, .fl-col:visible' ).length ) {
				col.css( 'min-height', col.height() + 45 );
			}
		},

		/**
		 * Returns a helper element for column drag operations.
		 *
		 * @since 1.9
		 * @access private
		 * @method _colDragHelper
		 * @return {Object} The helper element.
		 */
		_colDragHelper: function()
		{
			return $('<div class="fl-builder-block-drag-helper">' + FLBuilderStrings.column + '</div>');
		},

		/**
		 * Initializes dragging for columns. Columns themselves aren't sortables
		 * as nesting that many sortables breaks down quickly and draggable by
		 * itself is slow. Instead, we are programmatically triggering the drag
		 * of our helper div that isn't a nested sortable but connected to the
		 * sortables in the main layout.
		 *
		 * @since 1.9
		 * @access private
		 * @method _colDragInit
		 * @param {Object} e The event object.
		 */
		_colDragInit: function( e )
		{
			var handle = $( e.target ),
				helper = $( '.fl-col-sortable-proxy-item', window.parent.document ),
				col    = handle.closest( '.fl-col' );

			if ( handle.closest( '.fl-block-move-menu' ).length ) {
				return;
			} else if ( handle.hasClass( 'fl-block-col-move-parent' ) ) {
				col = col.parents( '.fl-col' );
			} else if ( handle.data( 'target-node' ) ) {
				col = $( '.fl-col[data-node=' + handle.data( 'target-node' ) + ']' );
			}

			col.addClass( 'fl-node-dragging' );

			FLBuilder._blockDragInit( e );

			e.target = helper[ 0 ];

			helper.trigger( e );
		},

		/**
		 * @method _colDragInitTouch
		 * @param {Object} e The event object.
		 */
		_colDragInitTouch: function( startEvent )
		{
			var handle = $( startEvent.target ),
				helper = $( '.fl-col-sortable-proxy-item', window.parent.document ),
				col    = handle.closest( '.fl-col' ),
				moved  = false;

			if ( handle.data( 'target-node' ) ) {
				col = $( '.fl-col[data-node=' + handle.data( 'target-node' ) + ']' );
			}

			handle.on( 'touchmove', function( moveEvent ) {
				if ( ! moved ) {
					startEvent.currentTarget = col[0];
					FLBuilder._colDragInit( startEvent );
					moved = true;
				}
				moveEvent.target = helper[0];
				helper.trigger( moveEvent );
			} );

			handle.on( 'touchend', function( endEvent ) {
				endEvent.target = helper[0];
		        helper.trigger( endEvent );
		        endEvent.stopPropagation();
			} );
		},

		/**
		 * Callback that fires when dragging starts for a column.
		 *
		 * @since 1.9
		 * @access private
		 * @method _colDragStart
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_colDragStart: function( e, ui )
		{
			var col = $( '.fl-node-dragging' );

			col.hide();

			FLBuilder._resetColumnWidths( col.parent() );
			FLBuilder._blockDragStart( e, ui );
		},

		/**
		 * Callback that fires when dragging stops for a column.
		 *
		 * @since 1.9
		 * @access private
		 * @method _colDragStop
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_colDragStop: function( e, ui )
		{
			FLBuilder._blockDragStop( e, ui );

			var col        = $( '.fl-node-dragging' ).removeClass( 'fl-node-dragging' ).show(),
				colId      = col.attr( 'data-node' ),
				newParent  = ui.item.parent(),
				oldGroup   = col.parent(),
				oldGroupId = oldGroup.attr( 'data-node' )
				newGroup   = newParent.closest( '.fl-col-group' ),
				newGroupId = newGroup.attr( 'data-node' ),
				newRow     = newParent.closest('.fl-row'),
				position   = 0,
				actions    = FL.Builder.data.getLayoutActions();

			// Cancel if a column was dropped into itself.
			if ( newParent.closest( '[data-node="' + colId + '"]' ).length ) {
				FLBuilder._resetColumnWidths( oldGroup );
			}
			// Cancel the drop if the sortable is disabled?
			else if ( newParent.hasClass( 'fl-sortable-disabled' ) ) {
				FLBuilder._resetColumnWidths( oldGroup );
			}
			// A column was dropped back into the sortable proxy.
			else if ( newParent.hasClass( 'fl-col-sortable-proxy' ) ) {
				FLBuilder._resetColumnWidths( oldGroup );
			}
			// A column was dropped into a column.
			else if ( newParent.hasClass( 'fl-col-content' ) ) {

				// Remove the column.
				col.remove();

				// Remove empty old groups (needs to be done here for correct position).
				if ( 0 === oldGroup.find( '.fl-col' ).length ) {
					actions.removeNode( oldGroup.attr( 'data-node' ) );
					oldGroup.remove();
				}

				// Find the new group position.
				position = newParent.find( '> .fl-module, .fl-col-group, .fl-col-sortable-proxy-item' ).index( ui.item );

				// Add the new group.
				FLBuilder._addColGroup( newParent.closest( '.fl-col' ).attr('data-node'), colId, position );
			}
			// A column was dropped into a column position.
			else if ( newParent.hasClass( 'fl-col-drop-target' ) ) {

				// Move the column in the UI.
				if ( newParent.hasClass( 'fl-col-drop-target-last' ) ) {
					newParent.parent().after( col );
				}
				else {
					newParent.parent().before( col );
				}

				// Reset the UI column widths.
				FLBuilder._resetColumnWidths( newGroup );

				// Save the column move via AJAX.
				const actions = FL.Builder.data.getLayoutActions()

				if ( oldGroupId == newGroupId ) {

					FL.Builder.getActions().moveNode( colId, col.index() )
				}
				else {

					FL.Builder.getActions().moveNode( colId, col.index(), newGroupId, [ oldGroupId, newGroupId ] )
				}

				// Trigger a layout resize.
				FLBuilder._resizeLayout();
			}
			// A column was dropped into a column group position.
			else if ( newParent.hasClass( 'fl-col-group-drop-target' ) ) {

				// Remove the column.
				col.remove();

				// Remove empty old groups (needs to be done here for correct position).
				if ( 0 === oldGroup.find( '.fl-col' ).length ) {
					actions.removeNode( oldGroup.attr( 'data-node' ) );
					oldGroup.remove();
				}

				// Find the new group position.
				position = newRow.find( '.fl-row-content' ).find( ' > .fl-col-group,  > .fl-module' ).index( newGroup );
				position = newParent.hasClass( 'fl-drop-target-last' ) ? position + 1 : position;

				// Add the new group.
				FLBuilder._addColGroup( newRow.attr('data-node'), colId, position );
			}
			// A column was dropped into a row position.
			else if ( newParent.hasClass( 'fl-row-drop-target' ) ) {

				// Remove the column.
				col.remove();

				// Find the new row position.
				position = newParent.closest( '.fl-builder-content' ).find( '.fl-row' ).index( newRow );
				position = newParent.hasClass( 'fl-drop-target-last' ) ? position + 1 : position;

				// Add the new row.
				FLBuilder._addRow( colId, position );
			}

			// Remove empty old groups.
			if ( 0 === oldGroup.find( '.fl-col' ).length ) {
				actions.removeNode( oldGroup.attr( 'data-node' ) );
				oldGroup.remove();
			}

			// Revert the proxy to its parent.
			$( '.fl-col-sortable-proxy', window.parent.document ).append( ui.item );

			// Finish the drag.
			FLBuilder._highlightEmptyCols();
			FLBuilder._initDropTargets();
			FLBuilder._initSortables();
			FLBuilder._closeAllSubmenus();
		},

		/**
		 * Shows the settings lightbox and loads the column settings
		 * when the column settings button is clicked.
		 *
		 * @since 1.1.9
		 * @access private
		 * @method _colSettingsClicked
		 * @param {Object} e The event object.
		 */
		_colSettingsClicked: function(e)
		{
			var button = $( this ),
				col    = button.closest('.fl-col'),
				id     = col.attr( 'data-node' ),
				global = button.closest( '.fl-block-overlay-global' ).length > 0;

			if ( FLBuilder._colResizing ) {
				return;
			}
			if ( global && ! FLBuilderConfig.userCanEditGlobalTemplates ) {
				return;
			}

			// If we clicked the edit parent button
			if ( button.hasClass( 'fl-block-col-edit-parent' ) ) {
				id = col.parents( '.fl-col' ).attr( 'data-node' )
			}

			const actions = FL.Builder.data.getLayoutActions()
			actions.displaySettings( id )

			e.stopPropagation();
		},

		/**
		 * Copy settings of a column.
		 *
		 * @since 2.6
		 * @access private
		 * @method _colCopySettingsClicked
		 */
		_colCopySettingsClicked: function () {
			const menuEl = $(this);
			const nodeId = menuEl.closest('.fl-col').data('node');

			// bind copy to the el
			FLBuilderSettingsCopyPaste._bindCopyToElement(menuEl, 'column', nodeId);
		},

		/**
		 * Paste settings of a column.
		 *
		 * @since 2.6
		 * @access private
		 * @method _colPasteSettingsClicked
		 */
		_colPasteSettingsClicked: function () {
			const menuEl   = $(this);
			const menuText = menuEl.text();
			const nodeId   = menuEl.closest('.fl-col').data('node');
			const success  = FLBuilderSettingsCopyPaste._importFromClipboard('column', nodeId);

			if (!success) {
				// set button text
				menuEl.text(FLBuilderStrings.module_import.error);

				// restore button text
				setTimeout(() => {
					menuEl.text(menuText)
				}, 1000);
			}
		},

		/**
		 * Show Column Settings Form
		 *
		 * @since 2.?
		 * @access private
		 * @method _showColSettings
		 */
		_showColSettings: function( nodeId, global, isNodeTemplate ) {

			if ( global && isNodeTemplate && 'row' !== FLBuilderConfig.userTemplateType ) {
				if ( FLBuilderConfig.userCanEditGlobalTemplates ) {
					let win = window.parent.open( $( '.fl-col[data-node="' + nodeId + '"]' ).attr( 'data-template-url' ) );
					win.FLBuilderGlobalNodeId = nodeId;
				}
			}
			else {
				FLBuilderSettingsForms.render( {
					id        : 'col',
					nodeId    : nodeId,
					className : 'fl-builder-col-settings',
					attrs     : 'data-node="' + nodeId + '"',
					buttons   : ! global && ! FLBuilderConfig.lite && ! FLBuilderConfig.simpleUi ? ['save-as'] : [],
					badges    : global ? [ FLBuilderStrings.global ] : [],
					settings  : FLBuilderSettingsConfig.nodes[ nodeId ],
					preview   : {
						type: 'col'
					}
				}, function() {
					var col = $('.fl-col.fl-node-' + nodeId )
					if ( col.siblings( '.fl-col' ).length === 0  ) {
						$( '#fl-field-equal_height, #fl-field-content_alignment', window.parent.document ).hide();
					}
				} );
			}
		},

		/**
		 * Callback for when the copy column button is clicked.
		 *
		 * @since 2.0
		 * @access private
		 * @method _copyColClicked
		 * @param {Object} e The event object.
		 */
		_copyColClicked: function( e )
		{
			var id = $( this ).closest( '.fl-col' ).attr( 'data-node' );
			FLBuilder._copyColumn( id );

			e.stopPropagation();
		},

		/**
		 * Handle Column Duplication
		 *
		 * @since 2.5
		 * @access private
		 * @method _copyColumn
		 * @param String id of node
		 * @return void
		 */
		_copyColumn: function( nodeId ) {
			var col         = FLBuilder._getJQueryElement( nodeId ),
				clone  		= col.clone(),
				group  		= col.parent(),
				form	 	= $( '.fl-builder-settings[data-node]', window.parent.document ),
				formNodeId 	= form.attr( 'data-node' ),
				formNode	= ( formNodeId === nodeId ) ? col : col.find( '[data-node="' + formNodeId + '"]' ),
				settings 	= null;

			if ( form.length && formNode.length ) {
				settings = FLBuilder._getSettings( form );
				FLBuilderSettingsConfig.nodes[ formNodeId ] = settings;
			}

			clone.addClass( 'fl-node-' + nodeId + '-clone fl-builder-node-clone' );
			clone.find( '.fl-block-overlay' ).remove();
			clone.removeAttr( 'data-node' );
			col.after( clone );

			FLBuilder._showNodeLoading( nodeId + '-clone' );
			FLBuilder._resetColumnWidths( group );

			const actions = FL.Builder.data.getLayoutActions()
			const callback = function( response ) {
				var data = FLBuilder._jsonParse( response );
				data.nodeParent = group;
				data.nodePosition = clone.index();
				data.duplicatedColumn = nodeId;
				data.onAddNewHTML = function() { clone.remove() };
				FLBuilder._copyColComplete( data );
			}
			actions.copyColumn( nodeId, settings, formNodeId, callback )
		},

		/**
		 * Callback for when a column has been duplicated.
		 *
		 * @since 2.0
		 * @access private
		 * @method _copyColComplete
		 * @param {Object} data
		 */
		_copyColComplete: function( data )
		{
			FLBuilder._renderLayout( data, function(){
				FLBuilder._resetColumnWidths( data.nodeParent );
				FLBuilder.triggerHook( 'didDuplicateColumn', {
					newNodeId : data.nodeId,
					oldNodeId : data.duplicatedColumn
				} );
			} );
		},

		/**
		 * Callback for when the delete column button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _deleteColClicked
		 * @param {Object} e The event object.
		 */
		_deleteColClicked: function( e )
		{
			var id = $( e.target ).closest( '.fl-col' ).data( 'node' );
			var actions = FL.Builder.getActions();
			actions.deleteNode( id );

			e.stopPropagation();
		},

		/**
		 * Handle selecting the proper dom node to delete in nested column situations.
		 */
		_getColToDelete: function( initialCol ) {
			var col            = initialCol,
			parentGroup        = col.closest( '.fl-col-group' ),
			parentCol          = col.parents( '.fl-col' ),
			hasParentCol       = parentCol.length > 0,
			parentChildren     = parentCol.find( '> .fl-col-content > .fl-module, > .fl-col-content > .fl-col-group' ),
			siblingCols        = col.siblings( '.fl-col' );

			// Handle deleting of nested columns.
			if ( hasParentCol && 1 === parentChildren.length ) {

				if ( 0 === siblingCols.length ) {
					col = parentCol;
				}
				else if ( 1 === siblingCols.length && ! siblingCols.find( '.fl-module' ).length ) {
					col = parentGroup;
				}
			}
			return col
		},

		/**
		 * Deletes a column.
		 *
		 * @since 1.0
		 * @access private
		 * @method _deleteCol
		 * @param {Object} col A jQuery reference of the column to delete (can also be a group).
		 */
		_deleteCol: function(col)
		{
			var nodeId = col.attr('data-node'),
				row    = col.closest('.fl-row'),
				group  = col.closest('.fl-col-group'),
				cols   = null,
				width  = 0;

			col.remove();
			rowCols   = row.find('.fl-row-content > .fl-col-group > .fl-col, .fl-row-content > .fl-module');
			groupCols = group.find(' > .fl-col');

			if(0 === rowCols.length && 'row' != FLBuilderConfig.userTemplateType && 'column' != FLBuilderConfig.userTemplateType) {
				FLBuilder._deleteRow(row);
			}
			else {

				if(0 === groupCols.length) {
					group.remove();
				}
				else {

					if ( 6 === groupCols.length ) {
						width = 16.65;
					}
					else if ( 7 === groupCols.length ) {
						width = 14.28;
					}
					else {
						width = Math.round( 100 / groupCols.length * 100 ) / 100;
					}

					groupCols.css('width', width + '%');

					FLBuilder.triggerHook( 'didResetColumnWidths', {
						cols : groupCols
					} );
				}

				const actions = FL.Builder.data.getLayoutActions()
				actions.deleteColumn( nodeId, width )

				FLBuilder._initDropTargets();
				FLBuilder._initSortables();
				FLBuilder.triggerHook( 'col-deleted' );
				FLBuilder.triggerHook( 'didDeleteColumn', nodeId );
			}
		},

		/**
		 * Deletes a column group.
		 *
		 * @since 2.8
		 * @param {Object} group A jQuery reference of the group to delete.
		 */
		_deleteColGroup: function( group )
		{
			var nodeId = group.attr( 'data-node' );

			const actions = FL.Builder.data.getLayoutActions()
			actions.deleteNode( nodeId )

			group.empty();
			group.remove();
			FLBuilder.triggerHook( 'didDeleteColumnGroup', nodeId );
		},

		/**
		 * Inserts a column (or columns) before or after another column.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _addCols
		 * @param {Object|String} col A jQuery reference of the column to insert before or after.
		 * @param {String} insert Either before or after.
		 * @param {String} type The type of column(s) to insert.
		 * @param {Boolean} nested Whether these columns are nested or not.
		 * @param {String} module Optional. The node ID of an existing module to move to this group.
		 */
		_addCols: function( col, insert, type, nested, module )
		{
			var col      = 'string' === typeof col ? $( '.fl-node-' + col ) : col,
				parent   = col.closest( '.fl-col-group' ),
				position = parent.find( '.fl-col' ).index( col ),
				id       = col.attr('data-node');

			type   = typeof type == 'undefined' ? '1-col' : type;
			nested = typeof nested == 'undefined' ? false : nested;
			nested = nested ? 1 : 0

			if ( 'after' == insert ) {
				position++;
			}

			FLBuilder._showNodeLoadingPlaceholder( parent, position );
			FLBuilder._removeAllOverlays();

			const actions = FL.Builder.data.getLayoutActions()
			actions.addColumns( id, insert, type, nested, module )
		},

		/**
		 * Adds the HTML for columns to the layout when the AJAX add
		 * operation is complete. Adds a module if one is queued to
		 * go in a new column.
		 *
		 * @since 1.9
		 * @access private
		 * @method _addColsComplete
		 * @param {Object|String} response The JSON response with the HTML for the new column(s).
		 */
		_addColsComplete: function( response )
		{
			var data = 'object' === typeof response ? response : FLBuilder._jsonParse( response ),
				col = null;

			data.nodeParent   = FLBuilder._newColParent;
			data.nodePosition = FLBuilder._newColPosition;

			// Render the layout.
			FLBuilder._renderLayout( data, function() {
				FLBuilder._removeNodeLoadingPlaceholder( $( '.fl-node-' + data.nodeId ) );
				FLBuilder.triggerHook( 'didAddColumn', data.nodeId );
				FLBuilder.triggerHook( 'didResetColumnWidths', {
					cols : $( '.fl-node-' + data.nodeId ).find( '> .fl-col' )
				} );
			} );
		},

		/**
		 * Adds a new column group to the layout.
		 *
		 * @since 1.0
		 * @access private
		 * @method _addColGroup
		 * @param {String} nodeId The node ID of the parent row.
		 * @param {String} cols The type of column layout to use.
		 * @param {Number} position The position of the new column group.
		 * @param {String} module Optional. The node ID of an existing module to move to this group.
		 */
		_addColGroup: function( nodeId, cols, position, module )
		{
			var parent = $( '.fl-node-' + nodeId );

			// Save the new column group info.
			FLBuilder._newColGroupPosition = position;

			if ( parent.hasClass( 'fl-col' ) ) {
				FLBuilder._newColGroupParent = parent.find( ' > .fl-col-content' );
			}
			else {
				FLBuilder._newColGroupParent = parent.find( '.fl-row-content' );
			}

			// Show the loader.
			FLBuilder._showNodeLoadingPlaceholder( FLBuilder._newColGroupParent, position );

			const actions = FL.Builder.data.getLayoutActions()
			actions.addColumnGroup( nodeId, cols, position, module )
		},

		/**
		 * Adds the HTML for a new column group to the layout when
		 * the AJAX add operation is complete. Adds a module if one
		 * is queued to go in the new column group.
		 *
		 * @since 1.0
		 * @access private
		 * @method _addColGroupComplete
		 * @param {String} response The JSON response with the HTML for the new column group.
		 */
		_addColGroupComplete: function(response)
		{
			var data    = FLBuilder._jsonParse(response),
				html    = $(data.html),
				groupId = html.data('node'),
				colId   = html.find('.fl-col').data('node');

			// Add new column group info to the data.
			data.nodeParent 	= FLBuilder._newColGroupParent;
			data.nodePosition 	= FLBuilder._newColGroupPosition;

			// Render the layout.
			FLBuilder._renderLayout( data, function(){

				// Added the nested columns class if needed.
				if ( data.nodeParent.hasClass( 'fl-col-content' ) ) {
					data.nodeParent.parents( '.fl-col' ).addClass( 'fl-col-has-cols' );
				}

				// Remove the loading placeholder.
				FLBuilder._removeNodeLoadingPlaceholder( $( '.fl-node-' + groupId ) );
				FLBuilder.triggerHook( 'didAddColumnGroup', groupId );
			} );
		},

		/**
		 * Initializes draggables for column resizing.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _initColDragResizing
		 */
		_initColDragResizing: function()
		{
			$( '.fl-block-col-resize' ).not( '.fl-block-row-resize' ).draggable( {
				axis 	: 'x',
				start 	: FLBuilder._colDragResizeStart,
				drag	: FLBuilder._colDragResize,
				stop 	: FLBuilder._colDragResizeStop
			} );
		},

		/**
		 * Fires when dragging for a column resize starts.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _colDragResizeStart
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_colDragResizeStart: function( e, ui )
		{
			// Setup resize vars.
			var handle 		   = $( ui.helper ),
				direction 	   = '',
				resizeParent   = handle.hasClass( 'fl-block-col-resize-parent' ),
				parentCol      = resizeParent ? handle.closest( '.fl-col' ).parents( '.fl-col' ) : null,
				group		   = resizeParent ? parentCol.parents( '.fl-col-group' ) : handle.closest( '.fl-col-group' ),
				cols 		   = group.find( '> .fl-col' ),
				col 		   = resizeParent ? parentCol : handle.closest( '.fl-col' ),
				colId		   = col.attr( 'data-node' ),
				colSetting	   = $( '[data-node=' + colId + '] #fl-field-size input', window.parent.document ),
				sibling 	   = null,
				siblingId 	   = null,
				siblingSetting = null,
				availWidth     = 100,
				i 			   = 0,
				setting		   = null,
				settingType    = null;

			// Find the direction and sibling.
			if ( handle.hasClass( 'fl-block-col-resize-e' ) ) {
				direction = 'e';
				sibling   = col.nextAll( '.fl-col' ).first();
			}
			else {
				direction = 'w';
				sibling   = col.prevAll( '.fl-col' ).first();
			}

			siblingId 	   = sibling.attr( 'data-node' );
			siblingSetting = $( '[data-node=' + siblingId + '] #fl-field-size input', window.parent.document );

			// Find the available width.
			for ( ; i < cols.length; i++ ) {

				if ( cols.eq( i ).data( 'node' ) == col.data( 'node' ) ) {
					continue;
				}
				if ( cols.eq( i ).data( 'node' ) == sibling.data( 'node' ) ) {
					continue;
				}

				availWidth -= parseFloat( cols.eq( i )[ 0 ].style.width );
			}

			// Find the setting if a column form is open.
			if ( colSetting.length ) {
				setting = colSetting;
				settingType = 'col';
			} else if ( siblingSetting.length ) {
				setting = siblingSetting;
				settingType = 'sibling';
			}

			// Build the resize data object.
			FLBuilder._colResizeData = {
				handle			: handle,
				feedbackLeft	: handle.find( '.fl-block-col-resize-feedback-left' ),
				feedbackRight	: handle.find( '.fl-block-col-resize-feedback-right' ),
				direction		: direction,
				groupWidth		: group.outerWidth(),
				col 			: col,
				id				: col.attr( 'data-node' ),
				colWidth 		: parseFloat( col[ 0 ].style.width ) / 100,
				sibling 		: sibling,
				siblingId		: sibling.attr( 'data-node' ),
				offset  		: ui.position.left,
				availWidth		: availWidth,
				setting			: setting,
				settingType		: settingType,
				layoutActions	: FL.Builder.data.getLayoutActions()
			};

			// Set the resizing flag.
			FLBuilder._colResizing = true;

			// Add the body col resize class.
			$( 'body' ).addClass( 'fl-builder-col-resizing' );

			// Close the builder panel and destroy overlay events.
			FLBuilder._closePanel();
			FLBuilder._destroyOverlayEvents();

			// Trigger the col-resize-start hook.
			FLBuilder.triggerHook( 'col-resize-start' );
		},

		/**
		 * Fires when dragging for a column resize is in progress.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _colDragResize
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_colDragResize: function( e, ui )
		{
			// Setup resize vars.
			var data 			= FLBuilder._colResizeData,
				directionRef	= FLBuilderConfig.isRtl ? 'w' : 'e',
				overlay 		= data.handle.closest( '.fl-block-overlay' ),
				change 			= ( data.offset - ui.position.left ) / data.groupWidth,
				colWidth 		= directionRef == data.direction ? ( data.colWidth - change ) * 100 : ( data.colWidth + change ) * 100,
				colRound 		= Math.round( colWidth * 100 ) / 100,
				siblingWidth	= data.availWidth - colWidth,
				siblingRound	= Math.round( siblingWidth * 100 ) / 100,
				minRound		= 8,
				maxRound		= Math.round( ( data.availWidth - minRound ) * 100 ) / 100;

			// Set the min/max width if needed.
			if ( colRound < minRound ) {
				colRound 		= minRound;
				siblingRound 	= maxRound;
			}
			else if ( siblingRound < minRound ) {
				colRound 		= maxRound;
				siblingRound 	= minRound;
			}

			// Show the feedback divs. Race condition with requestAnimationFrame
			// and drag stop requires it to be done here.
			data.feedbackLeft.show();
			data.feedbackRight.show();

			requestAnimationFrame( () => {

				// rapid DOM manipulations should generally happen inside a requestAnimationFrame

				// Set the feedback values.
				if ( directionRef == data.direction ) {
					data.feedbackLeft.html( colRound.toFixed( 1 ) + '%'  );
					data.feedbackRight.html( siblingRound.toFixed( 1 ) + '%'  );
				}
				else {
					data.feedbackLeft.html( siblingRound.toFixed( 1 ) + '%'  );
					data.feedbackRight.html( colRound.toFixed( 1 ) + '%'  );
				}

				// Set the width attributes.
				data.col.css( 'width', colRound + '%' );
				data.sibling.css( 'width', siblingRound + '%' );

				// Update the setting if the col or sibling's settings are open.
				if ( data.setting ) {
					if ( 'col' === data.settingType ) {
						data.setting.val( parseFloat( data.col[ 0 ].style.width ) );
					} else if ( 'sibling' === data.settingType ) {
						data.setting.val( parseFloat( data.sibling[ 0 ].style.width ) );
					}
				}

				// Dispatch to store
				data.layoutActions.resizeColumn( data.id, colRound, data.siblingId, siblingRound, false );

				// Build the overlay overflow menu if needed.
				FLBuilder._buildOverlayOverflowMenu( overlay );
			} )

			// Trigger the col-resize-drag hook.
			FLBuilder.triggerHook( 'col-resize-drag' );
		},

		/**
		 * Fires when dragging for a column resize stops.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _colDragResizeStop
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_colDragResizeStop: function( e, ui )
		{
			var data      	 = FLBuilder._colResizeData,
				overlay   	 = FLBuilder._colResizeData.handle.closest( '.fl-block-overlay' ),
				colId     	 = data.id,
				colWidth  	 = parseFloat( data.col[ 0 ].style.width ),
				siblingId 	 = data.sibling.data( 'node' ),
				siblingWidth = parseFloat( data.sibling[ 0 ].style.width );

			// Hide the feedback divs.
			FLBuilder._colResizeData.feedbackLeft.hide();
			FLBuilder._colResizeData.feedbackRight.hide();

			// Update layout store
			const actions = FL.Builder.data.getLayoutActions()
			actions.resizeColumn( colId, colWidth, siblingId, siblingWidth )

			// Build the overlay overflow menu if needed.
			FLBuilder._buildOverlayOverflowMenu( overlay );

			// Reset the resize data.
			FLBuilder._colResizeData = null;

			// Remove the body col resize class.
			$( 'body' ).removeClass( 'fl-builder-col-resizing' );

			// Rebind overlay events.
			FLBuilder._bindOverlayEvents();

			// Set the resizing flag to false with a timeout so other events get the right value.
			setTimeout( function() { FLBuilder._colResizing = false; }, 50 );

			// Trigger the col-resize-stop hook.
			FLBuilder.triggerHook( 'col-resize-stop' );

			FLBuilder.triggerHook( 'didResizeColumn', {
				colId			: colId,
				colWidth		: colWidth,
				siblingId		: siblingId,
				siblingWidth	: siblingWidth
			} );
		},

		/**
		 * Resets the widths of all columns in a row when the
		 * Reset Column Widths button is clicked.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _resetColumnWidthsClicked
		 * @param {Object} e The event object.
		 */
		_resetColumnWidthsClicked: function( e )
		{
			var button   = $( this ),
				isRow    = !! button.closest( '.fl-row-overlay' ).length,
				group    = null,
				groups   = null,
				groupIds = [],
				children = null,
				i        = 0,
				settings = $( '.fl-builder-col-settings', window.parent.document ),
				col		 = null;

			if ( isRow ) {
				groups = button.closest( '.fl-row' ).find( '.fl-row-content > .fl-col-group' );
			} else {
				groups = button.parents( '.fl-col-group' ).last();
			}

			groups.each( function() {

				group = $( this );
				children = group.find( '.fl-col-group' );
				groupIds.push( group.data( 'node' ) );
				FLBuilder._resetColumnWidths( group );

				for ( i = 0; i < children.length; i++ ) {
					FLBuilder._resetColumnWidths( children.eq( i ) );
					groupIds.push( children.eq( i ).data( 'node' ) );
				}
			} );

			if ( settings.length ) {
				col = $( '.fl-node-' + settings.attr( 'data-node' ) );
				settings.find( '#fl-field-size input' ).val( parseFloat( col[ 0 ].style.width ) );
			}

			const actions = FL.Builder.data.getLayoutActions()
			actions.resetColWidths( groupIds )

			FLBuilder.triggerHook( 'col-reset-widths' );
			FLBuilder._closeAllSubmenus();

			e.stopPropagation();
		},

		/**
		 * Resets the widths of all columns in a group.
		 *
		 * @since 1.6.4
		 * @access private
		 * @method _resetColumnWidths
		 * @param {Object} jQuery|HTMLElement - the column group node.
		 */
		_resetColumnWidths: function( group )
		{
			// Check jQuery object first. This allows passing a plain HTMLElement in.
			var isJQueryObject = group instanceof jQuery
			var colGroup = group
			if ( ! isJQueryObject ){
				colGroup = $( group );
			}

			var cols  = colGroup.find( ' > .fl-col:visible' ),
				width = 0;

			if ( 6 === cols.length ) {
				width = 16.65;
			}
			else if ( 7 === cols.length ) {
				width = 14.28;
			}
			else {
				width = Math.round( 100 / cols.length * 100 ) / 100;
			}

			cols.css( 'width', width + '%' );

			FLBuilder.triggerHook( 'didResetColumnWidths', {
				cols : cols
			} );
		},

		/* Modules
		----------------------------------------------------------*/

		/**
		 * Returns a helper element for module drag operations.
		 *
		 * @since 1.0
		 * @access private
		 * @method _moduleDragHelper
		 * @param {Object} e The event object.
		 * @param {Object} item The element being dragged.
		 * @return {Object} The helper element.
		 */
		_moduleDragHelper: function(e, item)
		{
			var module = $( '.fl-node-' + item.data( 'node' ) )

			return $('<div class="fl-builder-block-drag-helper">' + module.attr('data-name') + '</div>');
		},

		/**
		 * @method _moduleDragInit
		 * @param {Object} e The event object.
		 */
		_moduleDragInit: function( e )
		{
			var handle = $( e.target ),
				helper = $( '.fl-module-sortable-proxy-item', window.parent.document ),
				module = handle.closest( '.fl-module' );

			if ( handle.closest( '.fl-block-move-menu' ).length ) {
				return;
			} else if ( handle.data( 'target-node' ) ) {
				module = $( '.fl-module[data-node=' + handle.data( 'target-node' ) + ']' );
			}

			helper.data( 'type', module.data('type' ) );
			module.addClass( 'fl-node-dragging' );

			FLBuilder._blockDragInit( e );

			e.target = helper[ 0 ];

			helper.data( 'node', module.data( 'node' ) )
			helper.data( 'name', module.data( 'name' ) )
			helper.data( 'type', module.data('type' ) )
			helper.trigger( e );
		},

		/**
		 * @method _moduleDragInitTouch
		 * @param {Object} e The event object.
		 */
		_moduleDragInitTouch: function( startEvent )
		{
			var handle = $( startEvent.target ),
				helper = $( '.fl-module-sortable-proxy-item', window.parent.document ),
				module = handle.closest( '.fl-module' ),
				moved  = false;

			if ( handle.data( 'target-node' ) ) {
				module = $( '.fl-module[data-node=' + handle.data( 'target-node' ) + ']' );
			}

			handle.on( 'touchmove', function( moveEvent ) {
				if ( ! moved ) {
					startEvent.currentTarget = module[0];
					FLBuilder._moduleDragInit( startEvent );
					moved = true;
				}
				moveEvent.target = helper[0];
				helper.trigger( moveEvent );
			} );

			handle.on( 'touchend', function( endEvent ) {
				endEvent.target = helper[0];
				helper.trigger( endEvent );
				endEvent.stopPropagation();
			} );
		},

		/**
		 * Callback that fires when dragging starts for a module.
		 *
		 * @since 1.9
		 * @access private
		 * @method _moduleDragStart
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_moduleDragStart: function( e, ui )
		{
			var module = $( '.fl-node-dragging' );

			module.hide();

			FLBuilder._removeRowOverlays();
			FLBuilder._blockDragStart( e, ui );
		},

		/**
		 * Callback for when a module drag operation completes.
		 *
		 * @since 1.0
		 * @access private
		 * @method _moduleDragStop
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_moduleDragStop: function(e, ui)
		{
			FLBuilder._blockDragStop( e, ui );

			var module	 = $( '.fl-node-dragging' ).removeClass( 'fl-node-dragging' ),
				item     = ui.item,
				parent   = ui.item.parent(),
				node     = null,
				position = 0,
				parentId = 0,
				cols     = null;

			// A module was dropped back into the module list.
			if ( parent.hasClass( 'fl-builder-modules' ) || parent.hasClass( 'fl-builder-widgets' ) ) {
				item.remove();
				return;
			}
			// A new module was dropped.
			else if ( item.hasClass( 'fl-builder-block' ) ) {

				// Cancel the drop if the sortable is disabled?
				if ( parent.hasClass( 'fl-sortable-disabled' ) ) {
					item.remove();
					FLBuilder._showPanel();
					return;
				}
				// A new module was dropped into a row position.
				else if ( parent.hasClass( 'fl-row-drop-target' ) ) {
					parent   = item.closest('.fl-builder-content');
					parentId = 0;
					node     = item.closest('.fl-row');
					position = parent.find( '.fl-row' ).index( node );
				}
				// A new module was dropped into a column group position.
				else if ( parent.hasClass( 'fl-col-group-drop-target' ) ) {
					parent   = item.closest( '.fl-row-content' );
					parentId = parent.closest( '.fl-row' ).attr( 'data-node' );
					node     = item.closest( '.fl-col-group, .fl-module' );
					position = parent.find( '> .fl-col-group, > .fl-module' ).index( node );
				}
				// A new module was dropped into a column position.
				else if ( parent.hasClass( 'fl-col-drop-target' ) ) {
					parent   = item.closest( '.fl-col-group' );
					parentId = parent.attr( 'data-node' );
					node     = item.closest( '.fl-col' );
					position = parent.find( ' > .fl-col' ).index( node );
				}
				// A new module was dropped into a container module WITHOUT a wrapper.
				else if ( parent.hasClass( 'fl-module' ) ) {
					var layoutDirection = FLBuilder._getNodeLayoutDirection( item );
					if ( 'layered' === layoutDirection ) {
						// Drop as top most item in layers.
						position = parent.find( '> .fl-module' ).length;
					} else {
						position = parent.find( '> .fl-module, .fl-builder-block' ).index( item );
					}
					parentId = parent.attr( 'data-node' );
				}
				// A new module was dropped into a container module WITH a wrapper.
				else if ( parent.hasClass( 'fl-module-content' ) ) {
					position = parent.find( '> .fl-module, .fl-builder-block' ).index( item );
					parentId = item.closest( '.fl-module' ).attr( 'data-node' );
				}
				// A new module was dropped into a column.
				else {
					position = parent.find( '> .fl-module, .fl-col-group, .fl-builder-block' ).index( item );
					parentId = item.closest( '.fl-col' ).attr( 'data-node' );
				}

				// Increment the position?
				if ( item.closest( '.fl-drop-target-last' ).length ) {
					position += 1;
				}

				// Add the new module.
				FLBuilder._addModule( parent, parentId, item.attr( 'data-type' ), position, item.attr( 'data-widget' ), item.attr( 'data-alias' ) );

				// Remove the drag helper.
				item.remove();
			}
			// An existing module was dropped.
			else {

				// Cancel the drop if the sortable is disabled?
				if ( parent.hasClass( 'fl-sortable-disabled' ) ) {
					FLBuilder._highlightEmptyCols();
					module.show();
				}
				// A module was dropped into a row position.
				else if ( parent.hasClass( 'fl-row-drop-target' ) ) {
					node     = item.closest( '.fl-row' );
					position = item.closest( '.fl-builder-content' ).children( '.fl-row' ).index( node );
					position = item.closest( '.fl-drop-target-last' ).length ? position + 1 : position;
					cols     = module.attr( 'data-accepts' ) ? null : '1-col';
					FLBuilder._addRow( cols, position, module.attr( 'data-node' ) );
					module.remove();
				}
				// A module was dropped into a column group position.
				else if ( parent.hasClass( 'fl-col-group-drop-target' ) ) {
					node     = item.closest( '.fl-col-group, .fl-module' );
					position = item.closest( '.fl-row-content ').find( ' > .fl-col-group, > .fl-module' ).index( node );
					position = item.closest( '.fl-drop-target-last' ).length ? position + 1 : position;
					parentId = item.closest( '.fl-row' ).attr( 'data-node' );
					if ( module.attr( 'data-accepts' ) ) {
						FLBuilder._moveNode( parentId, module.attr( 'data-node' ), position );
						module.show();
					} else {
						FLBuilder._addColGroup( parentId, '1-col', position, module.attr( 'data-node' ) );
						module.remove();
					}
				}
				// A module was dropped into a column position.
				else if ( parent.hasClass( 'fl-col-drop-target' ) ) {
					node     = item.closest( '.fl-col' );
					position = item.closest( '.fl-col-drop-target-last' ).length ? 'after' : 'before';
					FLBuilder._addCols( node, position, '1-col', item.closest( '.fl-col-group-nested' ).length > 0, module.attr( 'data-node' ) );
					module.remove();
				}
				// A module was dropped into another column or container module.
				else {
					var isContainer = item.closest( '[data-accepts]' ).length;
					var layoutDirection = FLBuilder._getNodeLayoutDirection( item );

					if ( isContainer && 'layered' === layoutDirection ) {
						// Drop as top most item in layers.
						item.parent().append( module );
					} else {
						item.after( module );
					}

					item.remove();
					module.show();
					FLBuilder._reorderModule( module );
				}

				// Revert the proxy to its parent.
				$( '.fl-module-sortable-proxy', window.parent.document ).append( item );
			}

			FLBuilder._resizeLayout();
			FLBuilder._initDropTargets();
		},

		/**
		 * Reorders a module within a column.
		 *
		 * @since 1.0
		 * @access private
		 * @method _reorderModule
		 * @param {Object} module The module element being dragged.
		 */
		_reorderModule: function(module)
		{
			var newParent = module.parents('.fl-row, .fl-col, .fl-module').eq(0).attr('data-node'),
				oldParent = module.attr('data-parent'),
				nodeId    = module.attr('data-node'),
				position  = module.index();

			if(newParent == oldParent) {
				FLBuilder._reorderNode( nodeId, position );
			}
			else {
				module.attr('data-parent', newParent);
				FLBuilder._moveNode( newParent, nodeId, position );
			}
		},

		/**
		 * Callback for when the delete module button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _deleteModuleClicked
		 * @param {Object} e The event object.
		 */
		_deleteModuleClicked: function(e)
		{
			var id = $( e.target ).closest('.fl-module').data( 'node' );
			var actions = FL.Builder.getActions()
			actions.deleteNode( id )

			e.stopPropagation();
		},

		/**
		 * Deletes a module.
		 *
		 * @since 1.0
		 * @access private
		 * @method _deleteModule
		 * @param {Object} module A jQuery reference of the module to delete.
		 */
		_deleteModule: function(module)
		{
			var row    = module.closest('.fl-row'),
				rowNodes = row.find( '[data-node]' ),
				nodeId = module.attr('data-node'),
				acceptsChildren = module.attr('data-accepts');

			const actions = FL.Builder.data.getLayoutActions()
			actions.deleteNode( nodeId )

			// Delete the row if this is the last node in it.
			if ( acceptsChildren && 1 === rowNodes.length ) {
				FLBuilder._deleteRow( row );
			}

			module.empty();
			module.remove();
			row.removeClass('fl-block-overlay-muted');
			FLBuilder._highlightEmptyCols();
			FLBuilder._removeAllOverlays();
			FLBuilder.triggerHook( 'didDeleteModule', {
				nodeId: nodeId,
				moduleType: module.attr( 'data-type' ),
			} );
		},

		/**
		 * Duplicates a module.
		 *
		 * @since 1.0
		 * @access private
		 * @method _moduleCopyClicked
		 * @param {Object} e The event object.
		 */
		_moduleCopyClicked: function(e)
		{
			const id = $( this ).closest( '.fl-module' ).data( 'node' );
			const actions = FL.Builder.getActions()
			actions.copyNode( id );

			e.stopPropagation();
		},

		/**
		  * Duplicate a module for a given id.
		  */
		_copyModule: function( id )
		{
			var module   = FLBuilder._getJQueryElement( id ),
				clone    = module.clone(),
				parent   = module.parent(),
				form	 = $( '.fl-builder-module-settings[data-node=' + id + ']', window.parent.document ),
				settings = {};

			if ( form.length ) {
				settings = FLBuilder._getSettings( form );
				FLBuilderSettingsConfig.nodes[ id ] = settings;
			}

			// Setup clone
			clone.addClass( 'fl-node-' + id + '-clone fl-builder-node-clone' );
			clone.find( '.fl-block-overlay' ).remove();
			clone.removeAttr( 'data-node' );
			module.after( clone );

			// Show Loader
			FLBuilder._showNodeLoading( id + '-clone' );

			// Animate scroll to new element
			const el  = clone.get(0);
			el.scrollIntoView( {
				behavior: 'smooth',
				block: 'center',
			} );

			const actions = FL.Builder.data.getLayoutActions()
			const callback = function( response ) {
				var data = FLBuilder._jsonParse( response );
				data.nodeParent   = parent;
				data.nodePosition = parent.find( ' > .fl-col-group, > .fl-module' ).index( clone );
				data.duplicatedModule = id;
				data.onAddNewHTML = function() { clone.remove() };
				FLBuilder._moduleCopyComplete( data );
			}
			actions.copyModule( id, settings, callback )
		},

		/**
		 * Callback for when a module has been duplicated.
		 *
		 * @since 1.7
		 * @access private
		 * @method _moduleCopyComplete
		 * @param {Object}
		 */
		_moduleCopyComplete: function( data )
		{
			FLBuilder._renderLayout( data, function(){
				FLBuilder.triggerHook( 'didDuplicateModule', {
					newNodeId  : data.nodeId,
					oldNodeId  : data.duplicatedModule,
					moduleType : data.moduleType,
				} );
			} );
		},

		/**
		 * Shows the settings lightbox and loads the module settings
		 * when the module settings button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _moduleSettingsClicked
		 * @param {Object} e The event object.
		 */
		_moduleSettingsClicked: function(e)
		{
			var button   = $( this ),
				overlay  = button.closest( '.fl-block-overlay' ),
				type     = button.closest( '.fl-module' ).attr( 'data-type' ),
				nodeId   = button.closest( '.fl-module' ).attr( 'data-node' ),
				parentId = button.closest( '.fl-col' ).attr( 'data-node' ),
				global 	 = button.closest( '.fl-block-overlay-global' ).length > 0;

			e.stopPropagation();

			if ( FLBuilder._colResizing ) {
				return;
			}
			if ( global && ! FLBuilderConfig.userCanEditGlobalTemplates ) {
				return;
			}

			// Show module settings
			const actions = FL.Builder.getActions();
			actions.openSettings( nodeId );
		},

		/**
		 * Copy settings of a module.
		 *
		 * @since 2.6
		 * @access private
		 * @method _moduleCopySettingsClicked
		 */
		_moduleCopySettingsClicked: function () {
			const menuEl = $(this);
			const nodeId = menuEl.closest('.fl-module').data('node');
			const type   = menuEl.closest('.fl-module').data('type');

			// bind copy to the el
			FLBuilderSettingsCopyPaste._bindCopyToElement(menuEl, type, nodeId);
		},

		/**
		 * Copy settings of a module.
		 *
		 * @since 2.6
		 * @access private
		 * @method _modulePasteSettingsClicked
		 */
		_modulePasteSettingsClicked: function () {
			const menuEl   = $(this);
			const menuText = menuEl.text();
			const nodeId   = menuEl.closest('.fl-module').data('node');
			const type     = menuEl.closest('.fl-module').data('type');
			const success  = FLBuilderSettingsCopyPaste._importFromClipboard(type, nodeId);

			if (!success) {
				// set button text
				menuEl.text(FLBuilderStrings.module_import.error);

				// restore button text
				setTimeout(() => {
					menuEl.text(menuText)
				}, 1000);
			}
		},

		/**
		 * Shows the lightbox and loads the settings for a module.
		 *
		 * @since 1.0
		 * @access private
		 * @method _showModuleSettings
		 * @param {Object} data
		 * @param {Function} callback
		 */
		_showModuleSettings: function( data, callback )
		{
			if ( ! FLBuilderSettingsConfig.modules ) {
				return;
			}

			var config   = FLBuilderSettingsConfig.modules[ data.type ],
				settings = data.settings ? data.settings : FLBuilderSettingsConfig.nodes[ data.nodeId ],
				head 	 = $( 'head', window.parent.document ),
				module   = $( '.fl-module[data-node="' + data.nodeId + '"]' ),
				layout   = null;

			if ( data.global && ! FLBuilderConfig.userTemplateType && module.attr( 'data-accepts' ) ) {
				if ( FLBuilderConfig.userCanEditGlobalTemplates ) {
					win = window.parent.open( module.attr( 'data-template-url' ) );
					win.FLBuilderGlobalNodeId = data.nodeId;
				}
			} else {

				// Add settings CSS and JS.
				if ( -1 === $.inArray( data.type, FLBuilder._loadedModuleAssets ) ) {
					if ( '' !== config.assets.css ) {
						head.append( config.assets.css );
					}
					if ( '' !== config.assets.js ) {
						head.append( config.assets.js );
					}
					FLBuilder._loadedModuleAssets.push( data.type );
				}

				// Render the form.
				FLBuilderSettingsForms.render( {
					type	  : 'module',
					id        : data.type,
					nodeId    : data.nodeId,
					className : 'fl-builder-module-settings fl-builder-' + data.type + '-settings',
					attrs     : 'data-node="' + data.nodeId + '" data-parent="' + data.parentId + '" data-type="' + data.type + '"',
					buttons   : ! data.global && ! FLBuilderConfig.lite && ! FLBuilderConfig.simpleUi ? ['save-as'] : [],
					badges    : data.global ? [ FLBuilderStrings.global ] : [],
					settings  : settings,
					legacy    : data.legacy,
					helper    : FLBuilder._moduleHelpers[ data.type ],
					rules     : FLBuilder._moduleHelpers[ data.type ] ? FLBuilder._moduleHelpers[ data.type ].rules : null,
					messages  : FLBuilder._moduleHelpers[ data.type ] ? FLBuilder._moduleHelpers[ data.type ].messages : null,
					hide      : ( ! FLBuilderConfig.userCanEditGlobalTemplates && data.global ) ? true : false,
					preview   : {
						type     : 'module',
						layout   : data.layout,
						callback : function() {
							FLBuilder.triggerHook( 'didAddModule', {
								nodeId: data.nodeId,
								moduleType: settings.type,
								settings: settings
							} );
						}
					}
				}, callback );
			}
		},
		/**
		 * Validates the module settings and saves them if
		 * the form is valid.
		 *
		 * @since 1.0
		 * @access private
		 * @method _saveModuleClicked
		 */
		_saveModuleClicked: function()
		{
			var form      = $(this).closest('.fl-builder-settings'),
				type      = form.attr('data-type'),
				id        = form.attr('data-node'),
				helper    = FLBuilder._moduleHelpers[type],
				valid     = true;

			if(typeof helper !== 'undefined') {

				form.find('label.error').remove();
				form.validate().hideErrors();
				valid = form.validate().form();

				if(valid) {
					valid = helper.submit();
				}
			}
			if(valid) {
				FLBuilder._saveSettings();
			}
			else {
				FLBuilder._toggleSettingsTabErrors();
			}
		},

		/**
		 * Adds a new module to a column and loads the settings.
		 *
		 * @since 1.0
		 * @access private
		 * @method _addModule
		 * @param {Object} parent A jQuery reference to the new module's parent.
		 * @param {String} parentId The node id of the new module's parent.
		 * @param {String} type The type of module to add.
		 * @param {Number} position The position of the new module within its parent.
		 * @param {String} widget The type of widget if this module is a widget.
		 * @param {String} alias A module alias key if this module is an alias to another module.
		 */
		_addModule: function( parent, parentId, type, position, widget, alias )
		{
			// Show the loader.
			FLBuilder._showNodeLoadingPlaceholder( parent, position );

			// Save the new module data.
			if ( parent.hasClass( 'fl-col-group' ) ) {
				FLBuilder._newModuleParent 	 = null;
				FLBuilder._newModulePosition = 0;
			}
			else {
				FLBuilder._newModuleParent 	 = parent;
				FLBuilder._newModulePosition = position;
			}

			// Dispatch to layout store
			const actions = FL.Builder.data.getLayoutActions()
			actions.addModule( type, parentId, position, {
				widget: typeof widget === 'undefined' ? '' : widget,
				alias: typeof alias === 'undefined' ? '' : alias,
				nodePreview: 1
			} )
		},

		/**
		 * Shows the settings lightbox and sets the content when
		 * the module settings have finished loading.
		 *
		 * @since 1.0
		 * @access private
		 * @method _addModuleComplete
		 * @param {String} response The JSON encoded response.
		 */
		_addModuleComplete: function( response )
		{
			var data             = FLBuilder._jsonParse( response ),
			    showSettingsForm = false;

			// Setup a preview layout if we have one.
			if ( data.layout ) {
				if ( FLBuilder._newModuleParent ) {
					FLBuilder._newModuleParent.find( '.fl-builder-node-loading-placeholder' ).hide();
				}
				data.layout.nodeParent 	 = FLBuilder._newModuleParent;
				data.layout.nodePosition = FLBuilder._newModulePosition;
			}

			// Make sure we have settings before rendering the form.
			if ( ! data.settings ) {
				data.settings = FLBuilderSettingsConfig.defaults.modules[ data.type ];
			}

			// Render the module if a settings form is already open.
			if ( $( 'form.fl-builder-settings', window.parent.document ).length ) {
				if ( data.layout ) {
					FLBuilder._renderLayout( data.layout );
					showSettingsForm = true;
				}
			} else {
				showSettingsForm = true;
			}

			if ( showSettingsForm ) {
				FLBuilder._showModuleSettings( data, function() {
					$( '.fl-builder-module-settings', window.parent.document ).data( 'new-module', '1' );
				} );
			}
		},

		/**
		 * Registers a helper class for a module's settings.
		 *
		 * @since 1.0
		 * @method registerModuleHelper
		 * @param {String} type The type of module.
		 * @param {Object} obj The module helper.
		 */
		registerModuleHelper: function(type, obj)
		{
			var defaults = {
				node: null,
				form: null,
				rules: {},
				init: function(){},
				submit: function(){ return true; },
				preview: function(){},
				getForm: function() {
					if ( ! this.form ) {
						this.form = $( 'form.fl-builder-settings:visible', window.parent.document ).get(0)
					}
					return this.form
				},
				getSettings: function() { return FLBuilder._getSettings( $( this.form ) ) },
				getNodeID: function() { return this.getForm().dataset.node },
				getNode: function() {
					if ( ! this.node ) {
						this.node = document.querySelector( `${FLBuilder._contentClass} .fl-module[data-node="${this.getNodeID()}"]` )
					}
					return this.node
				},
			};

			FLBuilder._moduleHelpers[type] = $.extend({}, defaults, obj);
		},

		/**
		 * Deprecated. Use the public method registerModuleHelper instead.
		 *
		 * @since 1.0
		 * @access private
		 * @method _registerModuleHelper
		 * @param {String} type The type of module.
		 * @param {Object} obj The module helper.
		 */
		_registerModuleHelper: function(type, obj)
		{
			FLBuilder.registerModuleHelper(type, obj);
		},

		/**
		 * Update the margin placeholders for modules inside containers
		 * such as the box module that set different default margins.
		 *
		 * @since 2.8
		 * @return void
		 */
		_initModuleMarginPlaceholders: function()
		{
			var form = $( '.fl-builder-module-settings:visible', window.parent.document );
			var nodeId = form.data( 'node' );
			var node = $( '.fl-node-' + nodeId );
			var content = node.find( '.fl-node-content' );
			var sides = [ 'top', 'right', 'bottom', 'left' ];

			if ( ! form.length ) {
				return;
			} else if ( ! node.closest( '.fl-module[data-accepts]' ).length ) {
				return;
			} else if ( ! content.length ) {
				content = node;
			}

			for ( var key in sides ) {
				var input = form.find( 'input[name="margin_' + sides[ key ] + '"]' );
				var value = input.val();

				node.removeClass( 'fl-node-' + nodeId );
				input.attr( 'placeholder', parseInt( content.css( 'margin-' + sides[ key ] ) ) );
				node.addClass( 'fl-node-' + nodeId );
			}
		},

		/* Node Templates
		----------------------------------------------------------*/

		/**
		 * Saves a node's settings and shows the node template settings
		 * when the Save As button is clicked.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _showNodeTemplateSettings
		 * @param {Object} e An event object.
		 */
		_showNodeTemplateSettings: function( e )
		{
			var form     = $( '.fl-builder-settings-lightbox .fl-builder-settings', window.parent.document ),
				nodeId   = form.attr( 'data-node' ),
				title    = FLBuilderStrings.saveModule;

			if ( form.hasClass( 'fl-builder-row-settings' ) ) {
				title = FLBuilderStrings.saveRow;
			}
			else if ( form.hasClass( 'fl-builder-col-settings' ) ) {
				title = FLBuilderStrings.saveColumn;
			}

			if ( ! FLBuilder._triggerSettingsSave( false, false, false ) ) {
				return false;
			}

			FLBuilderSettingsForms.render( {
				id        : 'node_template',
				nodeId    : nodeId,
				title     : title,
				attrs     : 'data-node="' + nodeId + '"',
				className : 'fl-builder-node-template-settings',
				rules     : {
					name: {
						required: true
					}
				}
			}, function() {
				var form = $( '.fl-builder-settings:visible' );
				var cats = FLBuilderConfig.nodeCategoies;
				select = form.find('#fl-field-categories').find('select');
				desc   = select.parent().find( '.fl-field-description' ).hide();

				$.each(cats, function (i, item) {
					select.append($('<option>', {
						value: item.id,
						text : item.name
					}
					));
				});
				select.on('change', function(){
					if ( 'add_new' === $(this).val() ) {
						$( '<input type="text" name="categories" value="" class="text text-full">' ).insertBefore(select);
						select.remove();
						desc.show();
					}
				});
				if ( ! FLBuilderConfig.userCanEditGlobalTemplates ) {
					$( '#fl-field-global', window.parent.document ).hide();
				}
			} );
		},

		/**
		 * Saves a node as a template when the save button is clicked.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _saveNodeTemplate
		 */
		_saveNodeTemplate: function()
		{
			var form   = $( '.fl-builder-node-template-settings', window.parent.document ),
				nodeId = form.attr( 'data-node' ),
				valid  = form.validate().form();

			if ( valid ) {

				FLBuilder._showNodeLoading( nodeId );

				const actions = FL.Builder.data.getLayoutActions()
				actions.saveNodeTemplate( nodeId, FLBuilder._getSettings( form ) )

				FLBuilder._lightbox.close();
			}
		},

		/**
		 * Callback for when a node template has been saved.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _saveNodeTemplateComplete
		 */
		_saveNodeTemplateComplete: function( response )
		{
			var data 		   = FLBuilder._jsonParse( response ),
				panel 		   = $( '.fl-builder-saved-' + data.type + 's', window.parent.document ),
				blocks 		   = panel.find( '.fl-builder-block' ),
				block   	   = null,
				text    	   = '',
				name    	   = data.name.toLowerCase(),
				i			   = 0,
				template 	   = wp.template( 'fl-node-template-block' ),
				newLibraryItem = {
					name: data.name,
					isGlobal: data.global,
					content: data.type,
					id: data.id,
					postID: data.postID,
					kind: "template",
					type: "user",
					link: data.link,
					category: {
						uncategorized: FLBuilderStrings.uncategorized
					}
				};

			FLBuilderConfig.contentItems.template.push(newLibraryItem);
			FLBuilder.triggerHook('contentItemsChanged');

			// Update the layout for global templates.
			if ( data.layout ) {
				FLBuilder._renderLayout( data.layout );
				FLBuilder.triggerHook( 'didSaveGlobalNodeTemplate', data.config );
			}

			// Add the new template to the builder panel.
			if ( 0 === blocks.length ) {
				panel.append( template( data ) );
			}
			else {

				for ( ; i < blocks.length; i++ ) {

					block = blocks.eq( i );
					text  = block.text().toLowerCase().trim();

					if ( 0 === i && name < text ) {
						panel.prepend( template( data ) );
						break;
					}
					else if ( name < text ) {
						block.before( template( data ) );
						break;
					}
					else if ( blocks.length - 1 === i ) {
						panel.append( template( data ) );
						break;
					}
				}
			}

			// Remove the no templates placeholder.
			panel.find( '.fl-builder-block-no-node-templates' ).remove();
		},

		/**
		 * Callback for when a node template drag from the
		 * builder panel has stopped.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _nodeTemplateDragStop
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_nodeTemplateDragStop: function( e, ui )
		{
			FLBuilder._blockDragStop( e, ui );

			var item   		= ui.item,
				parent 		= item.parent(),
				parentId	= null,
				position 	= 0,
				node        = null,
				action 		= '',
				callback	= null;

			// A node template was dropped back into the templates list.
			if ( parent.hasClass( 'fl-builder-blocks-section-content' ) ) {
				item.remove();
				return;
			}
			// A saved row was dropped.
			else if ( item.hasClass( 'fl-builder-block-saved-row' ) || item.hasClass( 'fl-builder-block-row-template' ) ) {
				node     = item.closest( '.fl-row' );
				position = ! node.length ? 0 : $( FLBuilder._contentClass + ' .fl-row' ).index( node );
				position = parent.hasClass( 'fl-drop-target-last' ) ? position + 1 : position;
				parentId = null;
				action	 = 'render_new_row_template';
				callback = FLBuilder._addRowComplete;
				FLBuilder._newRowPosition = position;
				FLBuilder._showNodeLoadingPlaceholder( $( FLBuilder._contentClass ), position );
			}
			// A saved column was dropped.
			else if ( item.hasClass( 'fl-builder-block-saved-column' ) ) {
				node       = item.closest( '.fl-col' ),
				colGroup   = parent.closest( '.fl-col-group' ),
				colGroupId = colGroup.attr( 'data-node' );

				action	 = 'render_new_col_template';
				callback = FLBuilder._addColsComplete;

				// Cancel the drop if the sortable is disabled?
				if ( parent.hasClass( 'fl-sortable-disabled' ) ) {
					item.remove();
					FLBuilder._showPanel();
					return;
				}
				// A column was dropped into a row position.
				else if ( parent.hasClass( 'fl-row-drop-target' ) ) {
					node     = item.closest( '.fl-row' ),
					parentId = 0;
					parent   = $( FLBuilder._contentClass );
					position = ! node.length ? 0 : parent.find( '.fl-row' ).index( node );
				}
				// A column was dropped into a column group position.
				else if ( parent.hasClass( 'fl-col-group-drop-target' ) ) {
					parent   = item.closest( '.fl-row-content' );
					parentId = item.closest( '.fl-row' ).attr( 'data-node' );
					position = item.closest( '.fl-row' ).find( '.fl-row-content' ).find( ' > .fl-col-group,  > .fl-module' ).index( item.closest( '.fl-col-group, .fl-module' ) );
				}
				// A column was dropped into a column position.
				else if ( parent.hasClass( 'fl-col-drop-target' ) ) {
				    parent   = item.closest('.fl-col-group');
				    position = parent.children('.fl-col').index( item.closest('.fl-col') );
				    parentId = parent.attr('data-node');
				}

				// Increment the position?
				if ( item.closest( '.fl-drop-target-last' ).length ) {
					position += 1;
				}

				if ( parent.hasClass( 'fl-col-group' ) ) {
					FLBuilder._newColParent   = null;
				}
				else {
					FLBuilder._newColParent   = parent;
				}

				FLBuilder._newColPosition = position;

				// Show the loader.
				FLBuilder._showNodeLoadingPlaceholder( parent, position );
			}
			// A saved module was dropped.
			else if ( item.hasClass( 'fl-builder-block-saved-module' ) || item.hasClass( 'fl-builder-block-module-template' ) ) {

				action	 = 'render_new_module';
				callback = FLBuilder._addModuleComplete;

				// Cancel the drop if the sortable is disabled?
				if ( parent.hasClass( 'fl-sortable-disabled' ) ) {
					item.remove();
					FLBuilder._showPanel();
					return;
				}
				// Dropped into a row position.
				else if ( parent.hasClass( 'fl-row-drop-target' ) ) {
					parent   = item.closest('.fl-builder-content');
					parentId = 0;
					position = parent.find( '.fl-row' ).index( item.closest('.fl-row') );
				}
				// Dropped into a column group position.
				else if ( parent.hasClass( 'fl-col-group-drop-target' ) ) {
					parent   = item.closest( '.fl-row-content' );
					parentId = parent.closest( '.fl-row' ).attr( 'data-node' );
					position = parent.find( ' > .fl-col-group, > .fl-module' ).index( item.closest( '.fl-col-group, .fl-module' ) );
				}
				// Dropped into a column position.
				else if ( parent.hasClass( 'fl-col-drop-target' ) ) {
					parent   = item.closest('.fl-col-group');
					position = parent.children('.fl-col').index( item.closest('.fl-col') );
					parentId = parent.attr('data-node');
				}
				// Dropped into a container module WITHOUT a wrapper.
				else if ( parent.hasClass( 'fl-module' ) ) {
					var layoutDirection = FLBuilder._getNodeLayoutDirection( item );
					if ( 'layered' === layoutDirection ) {
						// Drop as top most item in layers.
						position = parent.find( '> .fl-module' ).length;
					} else {
						position = parent.find( '> .fl-module, .fl-builder-block' ).index( item );
					}
					parentId = parent.attr( 'data-node' );
				}
				// Dropped into a container module WITH a wrapper.
				else if ( parent.hasClass( 'fl-module-content' ) ) {
					position = parent.find( '> .fl-module, .fl-builder-block' ).index( item );
					parentId = item.closest( '.fl-module' ).attr( 'data-node' );
				}
				// Dropped into a column.
				else {
					position = parent.children( '.fl-module, .fl-builder-block' ).index( item );
					parentId = item.closest( '.fl-col' ).attr( 'data-node' );
				}

				// Increment the position?
				if ( item.closest( '.fl-drop-target-last' ).length ) {
					position += 1;
				}

				// Save the new module data.
				if ( parent.hasClass( 'fl-col-group' ) ) {
					FLBuilder._newModuleParent 	 = null;
					FLBuilder._newModulePosition = 0;
				}
				else {
					FLBuilder._newModuleParent 	 = parent;
					FLBuilder._newModulePosition = position;
				}

				// Show the loader.
				FLBuilder._showNodeLoadingPlaceholder( parent, position );
			}

			const templateId = item.attr( 'data-id' )
			const templateType = item.attr( 'data-type' )
			const ajaxCallback = function( response ) {
				if ( action.indexOf( 'row' ) > -1 ) {
					var data = FLBuilder._jsonParse( response );
					FLBuilder.triggerHook( 'didApplyRowTemplateComplete', data.config );
					callback( data.layout );
				} else if ( action.indexOf( 'col' ) > -1 ) {
					var data = FLBuilder._jsonParse( response );
					FLBuilder.triggerHook( 'didApplyColTemplateComplete', data.config );
					callback( data.layout );
				} else {
					callback( response );
				}
			}

			let type = 'module'
			if ( 'render_new_col_template' === action ) {
				type = 'column'
			}
			if ( 'render_new_row_template' === action ) {
				type = 'row'
			}

			// Dispatch to layout store
			const actions = FL.Builder.data.getLayoutActions()
			actions.addNodeTemplate( type, templateId, templateType, parentId, position, ajaxCallback )

			// Remove the helper.
			item.remove();
		},

		/**
		 * Launches the builder in a new tab to edit a user
		 * defined node template when the edit link is clicked.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _editUserTemplateClicked
		 * @param {Object} e The event object.
		 */
		_editNodeTemplateClicked: function( e )
		{
			e.preventDefault();
			e.stopPropagation();

			window.parent.open( $( this ).attr( 'href' ) );
		},

		/**
		 * Fires when the delete node template icon is clicked in the builder's panel.
		 *
		 * @since 1.6.3
		 * @access private
		 * @method _deleteNodeTemplateClicked
		 * @param {Object} e The event object.
		 */
		_deleteNodeTemplateClicked: function( e )
		{
			var button 		= $( e.target ),
				section 	= button.closest( '.fl-builder-blocks-section' ),
				panel   	= section.find( '.fl-builder-blocks-section-content' ),
				blocks  	= panel.find( '.fl-builder-block' ),
				block  		= button.closest( '.fl-builder-block' ),
				global 		= block.hasClass( 'fl-builder-block-global' ),
				message     = global ? FLBuilderStrings.deleteGlobalTemplate : FLBuilderStrings.deleteTemplate,
				index       = null,
				id          = block.attr( 'data-id' );

			if ( confirm( message ) ) {

				// Delete the UI block.
				block.remove();

				// Add the no templates placeholder?
				if ( 1 === blocks.length ) {
					if ( block.hasClass( 'fl-builder-block-saved-row' ) ) {
						panel.append( '<span class="fl-builder-block-no-node-templates">' + FLBuilderStrings.noSavedRows + '</span>' );
					}
					else {
						panel.append( '<span class="fl-builder-block-no-node-templates">' + FLBuilderStrings.noSavedModules + '</span>' );
					}
				}

				// Show the loader?
				if ( block.hasClass( 'fl-builder-block-global' ) ) {
					FLBuilder.showAjaxLoader();
				}

				// Delete the template.
				const actions = FL.Builder.data.getLayoutActions()
				actions.deleteNodeTemplate( id, global )

				// Remove the item from library
				index = _.findIndex(FLBuilderConfig.contentItems.template, {
					id: block.attr('data-id'),
					type: 'user'
				});

				FLBuilderConfig.contentItems.template.splice(index, 1);
				FLBuilder.triggerHook('contentItemsChanged');
			}
		},

		/* Settings
		----------------------------------------------------------*/

		/**
		 * Initializes logic for settings forms.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initSettingsForms
		 */
		_initSettingsForms: function()
		{
			FLBuilder._initSettingsSections();
			FLBuilder._initButtonGroupFields();
			FLBuilder._initCompoundFields();
			FLBuilder._CodeFieldSSLCheck();
			FLBuilder._initCodeFields();
			FLBuilder._initColorPickers();
			FLBuilder._initGradientPickers();
			FLBuilder._initIconFields();
			FLBuilder._initPhotoFields();
			FLBuilder._initSelectFields();
			FLBuilder._initEditorFields();
			FLBuilder._initMultipleFields();
			FLBuilder._initAutoSuggestFields();
			FLBuilder._initLinkFields();
			FLBuilder._initFontFields();
			FLBuilder._initPostTypeFields();
			FLBuilder._initOrderingFields();
			FLBuilder._initTimezoneFields();
			FLBuilder._initDimensionFields();
			FLBuilder._initFieldPopupSliders();
			FLBuilder._initPresetFields();
			FLBuilder._initModuleMarginPlaceholders();
			FLBuilder._focusFirstSettingsControl();
			FLBuilder._calculateSettingsTabsOverflow();
			FLBuilder._lightbox._resizeEditors();

			$( '.fl-builder-settings-fields', window.parent.document ).css( 'visibility', 'visible' );
			$( '.fl-builder-settings button', window.parent.document ).on( 'click', function( e ) { e.preventDefault() } )
			/**
		     * Hook for settings form init.
		     */
		    FLBuilder.triggerHook('settings-form-init');
		},

		/**
		 * Destroys all active settings forms.
		 *
		 * @since 2.0
		 * @access private
		 * @method _destroySettingsForms
		 */
		_destroySettingsForms: function()
		{
			FLBuilder._destroyEditorFields();
		},

		/**
		 * Inserts settings forms rendered with PHP. This method is only around for
		 * backwards compatibility with third party settings forms that are
		 * still being rendered via AJAX. Going forward, all settings forms
		 * should be rendered on the frontend using FLBuilderSettingsForms.render.
		 *
		 * @since 1.0
		 * @access private
		 * @method _setSettingsFormContent
		 * @param {String} html
		 */
		_setSettingsFormContent: function( html )
		{
			$( '.fl-legacy-settings', window.parent.document ).remove();
			$( 'body', window.parent.document ).append( html );
		},

		/**
		 * Shows the content for a settings form tab when it is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _settingsTabClicked
		 * @param {Object} e The event object.
		 */
		_settingsTabClicked: function(e)
		{
			var tab  = $( this ),
				form = tab.closest( '.fl-builder-settings' ),
				id   = tab.attr( 'href' ).split( '#' ).pop();

			FLBuilder._resetSettingsTabsState();

			form.find( '.fl-builder-settings-tab' ).removeClass( 'fl-active' );
			form.find( '#' + id ).addClass( 'fl-active' );
			form.find( '.fl-builder-settings-tabs .fl-active' ).removeClass( 'fl-active' );
			form.find( 'a[href*=' + id + ']' ).addClass( 'fl-active' );

			if ( FLBuilderConfig.rememberTab ) {
				localStorage.setItem( 'fl-builder-settings-tab', id );
			} else {
				localStorage.setItem( 'fl-builder-settings-tab', '' );
			}

			FLBuilder._focusFirstSettingsControl();

			e.preventDefault();
		},

		_resetSettingsTabsState: function() {
			var $lightbox = $('.fl-lightbox:visible', window.parent.document);

			FLBuilder._hideTabsOverflowMenu();

			$lightbox.find('.fl-builder-settings-tabs .fl-active').removeClass('fl-active');
			$lightbox.find('.fl-builder-settings-tabs-overflow-menu .fl-active').removeClass('fl-active');
			$lightbox.find('.fl-contains-active').removeClass('fl-contains-active');
		},

		/**
		* Measures tabs and adds extra items to overflow menu.
		*
		* @since 2.0
		* @access private
		* @return void
		* @method _settingsTabsToOverflowMenu
		*/
		_calculateSettingsTabsOverflow: function() {

			var $lightbox = $('.fl-lightbox:visible', window.parent.document),
				lightboxWidth = $lightbox.outerWidth(),
				isSlim = $lightbox.hasClass('fl-lightbox-width-slim'),
				$tabWrap = $lightbox.find('.fl-builder-settings-tabs'),
				$overflowMenu = $lightbox.find('.fl-builder-settings-tabs-overflow-menu'),
				$overflowMenuBtn = $lightbox.find('.fl-builder-settings-tabs-more'),
				$tabs = $tabWrap.find('a'),
				shouldEjectRemainingTabs = false,
				tabsAreaWidth = lightboxWidth - 44, /* 60 is size of "more" btn */
				tabsWidthTotal = 0,
				tabPadding = isSlim ? ( 5 * 2 ) : ( 10 * 2 );

			// Reset the menu
			$overflowMenu.html('');
			FLBuilder._hideTabsOverflowMenu();

			$tabs.removeClass('fl-overflowed');

			// Measure each tab
			$tabs.each(function() {

				if ( !$(this).is(":visible") ) {
					return true;
				}

				// Calculate size until too wide for tab area.
				if ( !shouldEjectRemainingTabs ) {

					// Width of text + padding + bumper space
						var currentTabWidth = $(this).textWidth() + tabPadding + 12;
					tabsWidthTotal += currentTabWidth;

					if ( tabsWidthTotal >= tabsAreaWidth ) {
						shouldEjectRemainingTabs = true;
					} else {
					}
				}

				if ( shouldEjectRemainingTabs ) {

					var label = $(this).html(),
						handle = $(this).attr('href'),
						classAttr = "";

					if ( $(this).hasClass('fl-active') ) {
						classAttr = 'fl-active';
					}
					if ( $(this).hasClass('error') ) {
						classAttr += ' error';
					}
					if ( classAttr !== '' ) {
						classAttr = 'class="' + classAttr + '"';
					}

					var $item = $('<a href="' + handle + '" ' + classAttr + '>' + label + '</a>');

					$overflowMenu.append( $item );
					$(this).addClass('fl-overflowed');
				} else {

					$(this).removeClass('fl-overflowed');
				}

			});

			if ( shouldEjectRemainingTabs ) {
				$lightbox.addClass('fl-lightbox-has-tab-overflow');
			} else {
				$lightbox.removeClass('fl-lightbox-has-tab-overflow');
			}

			if ( $overflowMenu.find('.fl-active').length > 0 ) {
				$overflowMenuBtn.addClass('fl-contains-active');
			} else {
				$overflowMenuBtn.removeClass('fl-contains-active');
			}

			if ( $overflowMenu.find('.error').length > 0 ) {
				$overflowMenuBtn.addClass('fl-contains-errors');
			} else {
				$overflowMenuBtn.removeClass('fl-contains-errors');
			}
		},

		/**
		* Trigger the orignal tab when a menu item is clicked.
		*
		* @since 2.0
		* @var {Event} e
		* @return void
		*/
		_settingsTabsToOverflowMenuItemClicked: function(e) {
			var $item = $(e.currentTarget, window.parent.document),
				handle = $item.attr('href'),
				$tabsWrap = $item.closest('.fl-lightbox-header-wrap').find('.fl-builder-settings-tabs'),
				$tab = $tabsWrap.find('a[href="' + handle + '"]'),
				$moreBtn = $tabsWrap.find('.fl-builder-settings-tabs-more');

			FLBuilder._resetSettingsTabsState();
			$tab.trigger('click');
			$item.addClass('fl-active');
			$moreBtn.addClass('fl-contains-active');
			FLBuilder._hideTabsOverflowMenu();
			e.preventDefault();
		},

		/**
		* Check if overflow menu contains any tabs
		*
		* @since 2.0
		* @return bool
		*/
		_hasOverflowTabs: function() {
			var $lightbox = $('.fl-lightbox:visible', window.parent.document),
				$tabs = $lightbox.find('.fl-builder-settings-tabs-overflow-menu a');

			if ( $tabs.length > 0 ) {
				return true;
			} else {
				return false;
			}
		},

		/**
		* Show the overflow menu
		*
		*/
		_showTabsOverflowMenu: function() {

			if ( ! FLBuilder._hasOverflowTabs() ) return;

			var $lightbox = $('.fl-lightbox:visible', window.parent.document);
			$lightbox.find('.fl-builder-settings-tabs-overflow-menu').css('display', 'flex');
			$lightbox.find('.fl-builder-settings-tabs-overflow-click-mask').show();
			this.isShowingSettingsTabsOverflowMenu = true;
		},

		/**
		* Hide the overflow menu
		*/
		_hideTabsOverflowMenu: function() {
			var $lightbox = $('.fl-lightbox:visible', window.parent.document);
			$lightbox.find('.fl-builder-settings-tabs-overflow-menu').css('display', 'none');
			$lightbox.find('.fl-builder-settings-tabs-overflow-click-mask').hide();
			this.isShowingSettingsTabsOverflowMenu = false;
		},

		/**
		* Toggle the overflow menu
		*/
		_toggleTabsOverflowMenu: function( e ) {
			if ( FLBuilder.isShowingSettingsTabsOverflowMenu ) {
				FLBuilder._hideTabsOverflowMenu();
			} else {
				FLBuilder._showTabsOverflowMenu();
			}
			e.stopPropagation();
		},

		/**
		 * Setup section toggling for all sections
		 *
		 * @since 2.2
		 * @access private
		 * @method _initSettingsSections
		 * @return void
		 */
		_initSettingsSections: function() {
			$( '.fl-builder-settings:visible', window.parent.document ).find( '.fl-builder-settings-section' ).each( FLBuilder._initSection );
		},

		/**
		 * Reverts an active preview and hides the lightbox when
		 * the cancel button of a settings lightbox is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _settingsCancelClicked
		 * @param {Object} e The event object.
		 */
		_settingsCancelClicked: function(e)
		{
			var nestedLightbox = $( '.fl-builder-lightbox[data-parent]', window.parent.document ),
				moduleSettings = $( '.fl-builder-module-settings', window.parent.document ),
				existingNodes  = null,
				previewModule  = null,
				previewContainer = null,
				previewCol     = null,
				existingCol    = null,
				isRootCol      = 'column' == FLBuilderConfig.userTemplateType;

			// Close a nested settings lightbox.
			if ( nestedLightbox.length > 0 ) {
				FLBuilder._closeNestedSettings();
				return;
			}
			// Delete a new module preview?
			else if(moduleSettings.length > 0 && typeof moduleSettings.data('new-module') != 'undefined') {

				existingNodes = $(FLBuilder.preview.state.html);
				previewModule = $('.fl-node-' + moduleSettings.data('node'));
				previewContainer = previewModule.parents('.fl-module[data-accepts]');
				previewCol    = previewModule.closest('.fl-col');
				existingCol   = existingNodes.find('.fl-node-' + previewCol.data('node'));

				if(previewContainer.length > 0 || existingCol.length > 0 || isRootCol) {
					FLBuilder._deleteModule(previewModule);
				}
				else {
					FLBuilder._deleteCol(previewCol);
				}
			}
			// Do a standard preview revert.
			else if( FLBuilder.preview ) {
				FLBuilder.preview.revert();
			}

			const actions = FL.Builder.data.getLayoutActions()
			actions.cancelDisplaySettings()

			FLBuilder.preview = null;
			FLLightbox.closeParent(this);
			FLBuilder.triggerHook( 'didCancelNodeSettings' );
		},

		/**
		 * Focus the first visible control in a settings panel
		 *
		 * @since 2.0
		 */
		_focusFirstSettingsControl: function() {
			var form   = $( '.fl-builder-settings:visible', window.parent.document ),
				tab    = form.find( '.fl-builder-settings-tab.fl-active' ),
				nodeId = form.data( 'node' ),
				field  = tab.find('.fl-field').first(),
				input  = field.find( 'input:not([type="hidden"]), textarea, select, button, a, .fl-editor-field' ).first();

			// Don't focus fields that have an inline editor.
			if ( nodeId && $( '.fl-node-' + nodeId + ' .fl-inline-editor' ).length ) {
				return;
			}

			if ( 'undefined' !== typeof window.parent.tinyMCE && input.hasClass('fl-editor-field') ) {
				// TinyMCE fields
				var id = input.find('textarea.wp-editor-area').attr('id');
				window.parent.tinyMCE.get( id ).focus();
			} else {
				// Everybody else
				setTimeout(function() {
					input.focus().css('animation-name', 'fl-grab-attention');
				}, 300 );
			}

			// Grab attention
			field.css('animation-name', 'fl-grab-attention');
			field.on('animationend', function() {
				field.css('animation-name', '');
			});
		},

		/**
		 * Initializes validation logic for a settings form.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initSettingsValidation
		 * @param {Object} rules The validation rules object.
		 * @param {Object} messages Custom messages to show for invalid fields.
		 */
		_initSettingsValidation: function(rules, messages)
		{
			var form = $('.fl-builder-settings', window.parent.document).last();

			if ( ! messages ) {
				messages = {}
			}

			form.validate({
				ignore: '.fl-ignore-validation',
				rules: rules,
				messages: messages,
				errorPlacement: FLBuilder._settingsErrorPlacement
			});
		},

		/**
		 * Places a validation error after the invalid field.
		 *
		 * @since 1.0
		 * @access private
		 * @method _settingsErrorPlacement
		 * @param {Object} error The error element.
		 * @param {Object} element The invalid field.
		 */
		_settingsErrorPlacement: function(error, element)
		{
			error.appendTo(element.parent());
		},

		/**
		 * Resets all tab error icons and then shows any for tabs
		 * that have fields with errors.
		 *
		 * @since 1.0
		 * @access private
		 * @method _toggleSettingsTabErrors
		 */
		_toggleSettingsTabErrors: function()
		{
			var form      = $('.fl-builder-settings:visible', window.parent.document),
				tabs      = form.find('.fl-builder-settings-tab'),
				tab       = null,
				tabErrors = null,
				i         = 0;

			for( ; i < tabs.length; i++) {

				tab = tabs.eq(i);
				tabErrors = tab.find('label.error');
				tabLink = form.find('.fl-builder-settings-tabs a[href*='+ tab.attr('id') +']');
				tabLink.find('.fl-error-icon').remove();
				tabLink.removeClass('error');

				if(tabErrors.length > 0) {
					tabLink.append('<span class="fl-error-icon"></span>');
					tabLink.addClass('error');
				}
			}

			FLBuilder._calculateSettingsTabsOverflow();
		},

		/**
		 * Returns an object with key/value pairs for all fields
		 * within a settings form.
		 *
		 * @since 1.0
		 * @access private
		 * @method _getSettings
		 * @param {Object} form The settings form element.
		 * @return {Object} The settings object.
		 */
		_getSettings: function( form )
		{
			FLBuilder._updateEditorFields();

			var data     	= form.serializeArray(),
				i        	= 0,
				k        	= 0,
				value	 	= '',
				key      	= '',
				keys      	= [],
				setting		= null,
				settings 	= {};

			// Loop through the form data.
			for ( i = 0; i < data.length; i++ ) {

				value = data[ i ].value.replace( /\r/gm, '' ).replace( /&#39;/g, "'" );

				// Don't save fields without a name.
				if ( 'undefined' === data[ i ].name ) {
					continue;
				}

				// Don't save text editor textareas.
				if ( data[ i ].name.indexOf( 'flrich' ) > -1 ) {
					continue;
				}

				// Support foo[]... setting keys.
				if ( data[ i ].name.indexOf( '[' ) > -1 ) {

					// Get the top level settings key and subkeys.
					key = data[ i ].name.replace( /\[(.*)\]/, '' );
					keys = data[ i ].name.replace( key, '' ).replace( '[', '' ).replaceAll( ']', '' ).split( '[' );

					// Set the top level settings key.
					if ( 'undefined' === typeof settings[ key ] ) {
						if ( 1 === keys.length && '' === keys[ 0 ] ) {
							settings[ key ] = [];
						} else {
							settings[ key ] = {};
						}
					}

					// Reference to use in the keys loop below.
					setting = settings[ key ];

					// Set the subkeys and value.
					for ( k = 0; k < keys.length; k++ ) {

						// Handle foo[] arrays otherwise ignore empty keys.
						if ( '' === keys[ k ] ) {
							if ( 1 === keys.length ) {
								setting.push( value );
								break;
							} else {
								continue;
							}
						}

						// Handle foo[][bar][] or foo[][bar][][baz][] style arrays.
						if ( keys.length - 2 === k && '' === keys[ keys.length - 1 ] ) {
							if ( $.inArray( typeof setting[ keys[ k ] ], [ 'undefined', 'string' ] ) > -1 ) {
								setting[ keys[ k ] ] = [];
							}
							setting[ keys[ k ] ].push( value );
							break;
						}

						// Handle everything else as objects like foo[bar], foo[][bar] or foo[bar][baz].
						if ( keys.length - 1 === k ) {
							setting[ keys[ k ] ] = value;
						} else {
							if ( $.inArray( typeof setting[ keys[ k ] ], [ 'undefined', 'string' ] ) > -1 ) {
								setting[ keys[ k ] ] = {};
							}
							setting = setting[ keys[ k ] ];
						}
					}
				}
				// Standard name/value pair.
				else {
					settings[ data[ i ].name ] = value;
				}
			}

			// Update auto suggest values.
			for ( key in settings ) {

				if ( 'undefined' !== typeof settings[ 'as_values_' + key ] ) {

					settings[ key ] = $.grep(
						settings[ 'as_values_' + key ].split( ',' ),
						function( n ) {
							return n !== '';
						}
					).join( ',' );

					try {
						delete settings[ 'as_values_' + key ];
					}
					catch( e ) {}
				}
			}

			// In the case of multi-select or checkboxes we need to put the blank setting back in.
			$.each( form.find( '[name]' ), function( key, input ) {
				var name = $( input ).attr( 'name' ).replace( /\[(.*)\]/, '' );
				if ( ! ( name in settings ) && 'undefined' !== name ) {
					settings[ name ] = '';
				}
			});

			// Merge in the original settings in case legacy fields haven't rendered yet.
			settings = $.extend( {}, FLBuilder._getOriginalSettings( form ), settings );

			// Return the settings.
			return settings;
		},

		/**
		 * Returns JSON encoded settings to be used in HTML form elements.
		 *
		 * @since 2.0
		 * @access private
		 * @method _getSettingsJSONForHTML
		 * @param {Object} settings The settings object.
		 * @return {String} The settings JSON.
		 */
		_getSettingsJSONForHTML: function( settings )
		{
			return JSON.stringify( settings ).replace( /\'/g, '&#39;' ).replace( '<wbr \/>', '<wbr>' );
		},

		/**
		 * Returns the original settings for a settings form. This is only
		 * used to work with legacy PHP settings fields.
		 *
		 * @since 2.0
		 * @access private
		 * @method _getOriginalSettings
		 * @param {Object} form The settings form element.
		 * @param {Boolean} all Whether to include all of the settings or just those with fields.
		 * @return {Object} The settings object.
		 */
		_getOriginalSettings: function( form, all )
		{
			var formJSON = form.find( '.fl-builder-settings-json' ),
				nodeId	 = form.data( 'node' ),
				config   = FLBuilderSettingsConfig.nodes,
				original = null,
				settings = {};

			if ( nodeId && config[ nodeId ] ) {
				original = config[ nodeId ];
			} else if ( formJSON.length ) {
				original = FLBuilder._jsonParse( formJSON.val().replace( /&#39;/g, "'" ) );
			}

			if ( original ) {
				for ( key in original ) {
					if ( key.match( /[a-z0-9-_]+$/ ) && $( '#fl-field-' + key ).length || all ) {
						settings[ key ] = original[ key ];
					}
				}
			}

			return settings;
		},

		/**
		 * Gets the settings that are saved to see if settings
		 * have changed when saving or canceling.
		 *
		 * @since 2.1
		 * @method getSettingsForChangedCheck
		 * @param {Object} form
		 * @return {Object}
		 */
		_getSettingsForChangedCheck: function( nodeId, form ) {
			var settings = FLBuilder._getSettings( form );

			// Make sure we're getting the original setting if even it
			// was changed by inline editing before the form loaded.
			if ( nodeId ) {
				var node = $( '.fl-node-' + nodeId );

				if ( node.hasClass( 'fl-module' ) ) {
					var type = node.data( 'type' );
					var config = FLBuilderSettingsConfig.editables[ type ];

					if ( config && FLBuilderSettingsConfig.nodes[ nodeId ] ) {
						for ( var key in config ) {
							settings[ key ] = FLBuilderSettingsConfig.nodes[ nodeId ][ key ]
						}
					}
				}
			}

			return settings;
		},

		/**
		 * Saves the settings for the current settings form, shows
		 * the loader and hides the lightbox.
		 *
		 * @since 1.0
		 * @access private
		 * @method _saveSettings
		 * @param {Boolean} render Whether the layout should render after saving.
		 */
		_saveSettings: function( render )
		{
			var form      = $( '.fl-builder-settings-lightbox .fl-builder-settings', window.parent.document ),
				newModule = form.data( 'new-module' ),
				nodeId    = form.attr( 'data-node' ),
				settings  = FLBuilder._getSettings( form ),
				preview   = FLBuilder.preview;

			// Default to true for render.
			if ( FLBuilder.isUndefined( render ) || ! FLBuilder.isBoolean( render ) ) {
				render = true;
			}

			// Only proceed if the settings have changed.
			if ( preview && ! preview._settingsHaveChanged() && FLBuilder.isUndefined( newModule ) ) {
				preview.clear();
				FLBuilder._lightbox.close();
				return;
			}

			function finishSavingSettings() {

				// Show the loader.
				FLBuilder._showNodeLoading( nodeId );

				// Update the settings config object.
				FLBuilderSettingsConfig.nodes[ nodeId ] = settings;

				// Dispatch to store
				const actions = FL.Builder.data.getLayoutActions()
				const callback = FLBuilder._saveSettingsComplete.bind( this, render )
				actions.updateNodeSettings( nodeId, settings, callback )

				// Trigger the hook.
				FLBuilder.triggerHook( 'didSaveNodeSettings', {
					nodeId   : nodeId,
					settings : settings
				} );

				// Close the lightbox.
				FLBuilder._lightbox.close();
			}

			if ( FLBuilderConfig.userCaps.unfiltered_html ) {
				finishSavingSettings()
			} else {
				FLBuilderSettingsForms.showLightboxLoader()
				FLBuilder.ajax( {
					action          : 'verify_settings',
					settings        : settings,
				}, function( response ) {
					if ( 'true' === response ) {
						finishSavingSettings()
					} else {
						msg = '<p style="font-weight:bold;text-align:center;">' + FLBuilderStrings.noScriptWarn.heading + '</p>';
						if ( FLBuilderConfig.userCaps.global_unfiltered_html ) {
							msg += '<p>' + FLBuilderStrings.noScriptWarn.global + '</p>';
						} else {
							msg += '<p>' + FLBuilderStrings.noScriptWarn.message + '</p>';
						}

						msg += '<p><div class="fl-diff"></div></p>';
						msg += '<p>' + FLBuilderStrings.noScriptWarn.footer + '</p>';
						FLBuilderSettingsForms.hideLightboxLoader()
						FLBuilder.alert( msg );
						data = $.parseJSON(response);
						if ( '' !== data.diff  ) {
							$('.fl-diff', window.parent.document).html( data.diff );
							$('.fl-diff', window.parent.document).prepend( '<p>' + FLBuilderStrings.codeErrorDetected + '</p>');
							$('.fl-diff .diff-deletedline', window.parent.document).each(function(){
								if ( $(this).find('del').length < 1 ) {
									$(this).css('background-color', 'rgb(255, 192, 203, 0.7)').css('padding', '10px').css('border', '1px solid pink');
								} else {
									$(this).find('del').css('background-color', 'rgb(255, 192, 203, 0.7)').css('border', '1px solid pink');
								}
							});
							console.log( '============' );
							console.log( 'key: ' + data.key );
							console.log( 'value: ' + data.value );
							console.log( 'parsed: ' + data.parsed );
							console.log( '============' );
						}

					}
				} );
			}
		},

		/**
		 * Renders a new layout when the settings for the current
		 * form have finished saving.
		 *
		 * @since 1.0
		 * @access private
		 * @method _saveSettingsComplete
		 * @param {Boolean} render Whether the layout should render after saving.
		 * @param {String} response The layout data from the server.
		 */
		_saveSettingsComplete: function( render, response )
		{
			var data 	 	= FLBuilder._jsonParse( response ),
				type	 	= data.layout.nodeType,
				moduleType	= data.layout.moduleType,
				hook	 	= 'didSave' + type.charAt(0).toUpperCase() + type.slice(1) + 'SettingsComplete',
				preview		= FLBuilder.preview,
				callback 	= function() {
					var clearPreview = preview && data.layout.partial && data.layout.nodeId === preview.nodeId && !FLBuilder._publishAndRemain;

					if ( clearPreview ) {
						preview.clear();
						FLBuilder.preview = null;
					}

					FLBuilder._publishAndRemain = false;
				};

			if ( true === render ) {
				FLBuilder._renderLayout( data.layout, callback );
			} else {
				callback();
			}

			FLBuilder.triggerHook( 'didSaveNodeSettingsComplete', {
				nodeId   	: data.node_id,
				nodeType 	: type,
				moduleType	: moduleType,
				settings 	: data.settings
			} );

			FLBuilder.triggerHook( hook, {
				nodeId   	: data.node_id,
				nodeType 	: type,
				moduleType	: moduleType,
				settings 	: data.settings
			} );
		},

		/**
		 * Triggers a click on the settings save button so all save
		 * logic runs for any form that is currently in the lightbox.
		 *
		 * @since 2.0
		 * @access private
		 * @method _triggerSettingsSave
		 * @param {Boolean} disableClose
		 * @param {Boolean} showAlert
		 * @param {Boolean} destroy
		 * @return {Boolean}
		 */
		_triggerSettingsSave: function( disableClose, showAlert, destroy )
		{
			var form	   = FLBuilder._lightbox._node.find( 'form.fl-builder-settings' ),
				lightboxId = FLBuilder._lightbox._node.data( 'instance-id' ),
				lightbox   = FLLightbox._instances[ lightboxId ],
				nested     = $( '.fl-lightbox-wrap[data-parent]:visible', window.parent.document ),
				changed    = false,
				valid	   = true;

			disableClose = _.isUndefined( disableClose ) ? false : disableClose;
			showAlert 	 = _.isUndefined( showAlert ) ? false : showAlert;
			destroy 	 = _.isUndefined( destroy ) ? ! disableClose : destroy;

			// prevent clearing preview.
			if (!destroy) {
				FLBuilder._publishAndRemain = true;
			}

			if ( form.length ) {

				// Save any nested settings forms.
				if ( nested.length ) {

					// Save the form.
					nested.find( '.fl-builder-settings-save' ).trigger( 'click' );

					// Don't proceed if not saved.
					if ( nested.find( 'label.error' ).length || $( '.fl-builder-alert-lightbox:visible', window.parent.document ).length ) {
						valid = false;
					}
				}

				// Do a validation check of the main form to see if we should save.
				if ( valid && ! form.validate({ignore: '.fl-ignore-validation'}).form() ) {
					valid = false;
				}

				// Check to see if the main settings have changed.
				changed = FLBuilderSettingsForms.settingsHaveChanged();

				// Save the main settings form if it has changes.
				if ( valid && changed ) {

					// Disable lightbox close?
					if ( disableClose ) {
						lightbox.disableClose();
					}

					// Save the form.
					form.find( '.fl-builder-settings-save' ).trigger( 'click' );

					// Enable lightbox close if it was disabled.
					if ( disableClose ) {
						lightbox.enableClose();
					}

					// Don't proceed if not saved.
					if ( form.find( 'label.error' ).length || $( '.fl-builder-alert-lightbox:visible', window.parent.document ).length ) {
						valid = false;
					}
				}

				// Destroy the settings form?
				if ( destroy ) {
					FLBuilder._destroySettingsForms();

					// Destroy the preview if settings don't have changes.
					if ( ! changed && FLBuilder.preview ) {
						FLBuilder.preview.clear();
						FLBuilder.preview = null;
					}
				} else {
					// cache current settings
					FLBuilderSettingsForms.cacheCurrentSettings();
				}

				// Close the main lightbox if it doesn't have changes and closing isn't disabled.
				if ( ! changed && ! disableClose ) {
					lightbox.close();
				}
			}

			if ( ! valid ) {
				FLBuilder._publishAndRemain = false; // Reset preview clearing
				FLBuilder.triggerHook( 'didFailSettingsSave' );
				FLBuilder._toggleSettingsTabErrors();
				if ( showAlert && ! $( '.fl-builder-alert-lightbox:visible', window.parent.document ).length ) {
					FLBuilder.alert( FLBuilderStrings.settingsHaveErrors );
				}
			} else {
				FLBuilder.triggerHook( 'didTriggerSettingsSave' );
			}

			return valid;
		},

		/**
		 * Refreshes preview references for a node's settings panel
		 * in case they have been broken by work in the layout.
		 *
		 * @since 2.0
		 * @access private
		 * @method _refreshSettingsPreviewReference
		 */
		_refreshSettingsPreviewReference: function()
		{
			if ( FLBuilder.preview ) {
				FLBuilder.preview._initElementsAndClasses();
			}
		},

		/* Nested Settings Forms
		----------------------------------------------------------*/

		/**
		 * Opens a nested settings lightbox.
		 *
		 * @since 1.10
		 * @access private
		 * @method _openNestedSettings
		 * @return object The settings lightbox object.
		 */
		_openNestedSettings: function( settings )
		{
			if ( settings.className && -1 === settings.className.indexOf( 'fl-builder-settings-lightbox' ) ) {
				settings.className += ' fl-builder-settings-lightbox';
			}

			settings = $.extend( {
				className: 'fl-builder-lightbox  fl-builder-settings-lightbox',
				destroyOnClose: true,
				resizable: true
			}, settings );

			var parentBoxWrap  = $( '.fl-lightbox-wrap:visible', window.parent.document ),
				parentBox      = parentBoxWrap.find( '.fl-lightbox' ),
				nestedBoxObj   = new FLLightbox( settings ),
				nestedBoxWrap  = nestedBoxObj._node,
				nestedBox      = nestedBoxWrap.find( '.fl-lightbox' );

			parentBoxWrap.hide();
			nestedBoxWrap.attr( 'data-parent', parentBoxWrap.attr( 'data-instance-id' ) );
			nestedBox.attr( 'style', parentBox.attr( 'style' ) );
			nestedBoxObj.on( 'resized', FLBuilder._calculateSettingsTabsOverflow );
			nestedBoxObj.open( '<div class="fl-builder-lightbox-loading"></div>' );

			return nestedBoxObj;
		},

		/**
		 * Opens the active nested settings lightbox.
		 *
		 * @since 1.10
		 * @access private
		 * @method _closeNestedSettings
		 */
		_closeNestedSettings: function()
		{
			var nestedBoxWrap = $( '.fl-builder-lightbox[data-parent]:visible', window.parent.document ),
				nestedBox     = nestedBoxWrap.find( '.fl-lightbox' ),
				nestedBoxId   = nestedBoxWrap.attr( 'data-instance-id' ),
				nestedBoxObj  = FLLightbox._instances[ nestedBoxId ],
				parentBoxId   = nestedBoxWrap.attr( 'data-parent' ),
				parentBoxWrap = $( '[data-instance-id="' + parentBoxId + '"]', window.parent.document ),
				parentBox     = parentBoxWrap.find( '.fl-lightbox' ),
				parentBoxForm = parentBoxWrap.find('form'),
				parentBoxObj  = FLLightbox._instances[ parentBoxId ];

			if ( ! nestedBoxObj ) {
				return
			}

			nestedBoxObj.on( 'close', function() {
				parentBox.attr( 'style', nestedBox.attr( 'style' ) );
				parentBoxWrap.show();
				parentBoxObj._resize();
				parentBoxWrap.find( 'label.error' ).remove();
				parentBoxForm.validate().hideErrors();
				FLBuilder._toggleSettingsTabErrors();
				FLBuilder._initMultipleFields();
			} );

			nestedBoxObj.close();
		},

		/* Tooltips
		----------------------------------------------------------*/

		/**
		 * Shows a help tooltip in the settings lightbox.
		 *
		 * @since 1.0
		 * @access private
		 * @method _showHelpTooltip
		 */
		_showHelpTooltip: function()
		{
			$(this).siblings('.fl-help-tooltip-text').fadeIn();
		},

		/**
		 * Hides a help tooltip in the settings lightbox.
		 *
		 * @since 1.0
		 * @access private
		 * @method _hideHelpTooltip
		 */
		_hideHelpTooltip: function()
		{
			$(this).siblings('.fl-help-tooltip-text').fadeOut();
		},

		/**
		 * Setup section toggling
		 *
		 * @since 2.2
		 * @access private
		 * @method _initSection
		 * @return void
		 */
		_initSection: function() {
			var wrap = $(this),
				button = wrap.find('.fl-builder-settings-section-header');

			button.on('click', function() {
				wrap.toggleClass('fl-builder-settings-section-collapsed')
			});
		},

		/* Align Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all button group fields within a settings form.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initButtonGroupFields
		 */
		_initButtonGroupFields: function()
		{
			$( '.fl-builder-settings:visible', window.parent.document )
				.find( '.fl-button-group-field' ).each( FLBuilder._initButtonGroupField );
		},

		/**
		 * Initializes a button group field within a settings form.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initButtonGroupField
		 */
		_initButtonGroupField: function()
		{
			var wrap = $( this ),
				options    = wrap.find( '.fl-button-group-field-option' ),
				multiple   = wrap.data( 'multiple' ),
				min        = wrap.data( 'min' ),
				max        = wrap.data( 'max' ),
				input      = wrap.find( 'input:not(.fl-preview-ignore)' ),
				allowEmpty = !! wrap.data( 'allowEmpty' ),
				value      = function( format ) {
					var val = [];

					options.each(function(i, option) {
						if ($(option).attr('data-selected') === '1') {
							val.push($(option).attr('data-value'));
						}
					})

					if ( 'array' == format ) {
						return val;
					}

					return val.join(',');
				};

			options.on( 'click', function() {
				var option = $( this ),
					length = value( 'array' ).length,
					isSelected = '1' === option.attr( 'data-selected' );

				if ( ! allowEmpty && isSelected ) {
					return;
				}

				if ( isSelected ) {
					if ( false == min ) {
						option.attr( 'data-selected', '0' );
					} else {
						if ( length - 1 >= min ) {
							option.attr( 'data-selected', '0' );
						}
					}
				} else {
					// Unset other options
					if ( multiple !== true ) {
						options.attr( 'data-selected', '0' );
					}

					if ( false == max ) {
						option.attr( 'data-selected', '1' );
					} else {
						if ( length + 1 <= max ) {
							option.attr( 'data-selected', '1' );
						}
					}
				}

				input.val( value( '' ) ).trigger( 'change' );
			} );

			// Handle value being changed externally
			input.on( 'change', function( e ) {
				var value = input.val().split(',');

				// Unset other options
				if (multiple !== true) {
					options.attr('data-selected', '0' );
				}

				$.each(value, function(i, val) {
					var option = options.filter( '[data-value="' + val + '"]' );

					// Set the matching one.
					option.attr( 'data-selected', '1' );
				});
			});
		},

		/* Compound Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all compound fields within a settings form.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initCompoundFields
		 */
		_initCompoundFields: function()
		{
			$( '.fl-builder-settings:visible', window.parent.document )
				.find( '.fl-compound-field' ).each( FLBuilder._initCompoundField );
		},

		/**
		 * Initializes a compound field within a settings form.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initCompoundField
		 */
		_initCompoundField: function()
		{
			var wrap = $( this ),
				sections = wrap.find( '.fl-compound-field-section' ),
				toggles = wrap.find( '.fl-compound-field-section-toggle' ),
				dimensions = wrap.find( '.fl-compound-field-setting' ).has( '.fl-dimension-field-units' );

			sections.each( function() {
				var section = $( this );
				if ( ! section.find( '.fl-compound-field-section-toggle' ).length ) {
					section.addClass( 'fl-compound-field-section-visible' );
				}
			} );

			toggles.on( 'click', function() {
				var toggle = $( this ),
					field = toggle.closest( '.fl-field' ),
					section = toggle.closest( '.fl-compound-field-section' ),
					className = '.' + section.attr( 'class' ).split( ' ' ).join( '.' );

				field.find( className ).toggleClass( 'fl-compound-field-section-visible' );
			} );

			// Init linking for compound dimension fields.
			dimensions.each( function() {
				var field = $( this ),
					label = field.find( '.fl-compound-field-label' ),
					icon = '<i class="fl-dimension-field-link fl-tip dashicons dashicons-admin-links" title="Link Values"></i>';

				if ( ! label.length || field.find( '.fl-shadow-field' ).length ) {
					return;
				}

				label.append( icon );
			} );
		},

		/* Auto Suggest Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all auto suggest fields within a settings form.
		 *
		 * @since 1.2.3
		 * @access private
		 * @method _initAutoSuggestFields
		 */
		_initAutoSuggestFields: function()
		{
			var fields = $('.fl-builder-settings:visible .fl-suggest-field', window.parent.document),
				field  = null,
				values = null,
				name   = null,
				data   = [];

			fields.each( function() {
				field = $( this );
				if ( '' !== field.attr( 'data-value' ) ) {
					FLBuilderSettingsForms.showFieldLoader( field );
					data.push( {
						name   : field.attr( 'name' ),
						value  : field.attr( 'data-value' ),
						action : field.attr( 'data-action' ),
						data   : field.attr( 'data-action-data' ),
					} );
				}
			} );

			if ( data.length ) {
				FLBuilder.ajax( {
					action: 'get_autosuggest_values',
					fields: data
				}, function( response ) {
					values = FLBuilder._jsonParse( response );
					for ( name in values ) {
						$( '.fl-suggest-field[name="' + name + '"]', window.parent.document )
							.attr( 'data-value', values[ name ] );
					}
					fields.each( FLBuilder._initAutoSuggestField );
				} );
			} else {
				fields.each( FLBuilder._initAutoSuggestField );
			}
		},

		/**
		 * Initializes a single auto suggest field.
		 *
		 * @since 1.2.3
		 * @access private
		 * @method _initAutoSuggestField
		 */
		_initAutoSuggestField: function()
		{
			var field = $(this);

			field.autoSuggest(FLBuilder._ajaxUrl({
				'fl_action'         : 'fl_builder_autosuggest',
				'fl_as_action'      : field.data('action'),
				'fl_as_action_data' : field.data('action-data'),
				'_wpnonce'			: FLBuilderConfig.ajaxNonce
			}), $.extend({}, {
				asHtmlID                    : field.attr('name'),
				selectedItemProp            : 'name',
				searchObjProps              : 'name',
				minChars                    : 2,
				keyDelay                    : 1000,
				fadeOut                     : false,
				usePlaceholder              : true,
				emptyText                   : FLBuilderStrings.noResultsFound,
				showResultListWhenNoMatch   : true,
				preFill                     : field.data('value'),
				queryParam                  : 'fl_as_query',
				afterSelectionAdd           : FLBuilder._updateAutoSuggestField,
				afterSelectionRemove        : FLBuilder._updateAutoSuggestField,
				selectionLimit              : field.data('limit'),
				canGenerateNewSelections    : false
			}, field.data( 'args' )));

			FLBuilderSettingsForms.hideFieldLoader( field );
		},

		/**
		 * Updates the value of an auto suggest field.
		 *
		 * @since 1.2.3
		 * @access private
		 * @method _initAutoSuggestField
		 * @param {Object} element The auto suggest field.
		 * @param {Object} item The current selection.
		 * @param {Array} selections An array of selected values.
		 */
		_updateAutoSuggestField: function(element, item, selections)
		{
			var that = this;

			$(this).siblings('.as-values').val(selections.join(',')).trigger('change');

			// sortable stuff.
			$(this).parents( '.as-selections').sortable({
				items : ':not(.as-original)',
				'update': function( event, ui ) {
					var selected = [];
					set = that.parents( '.as-selections').find('li.as-selection-item');
					$.each(set, function(i,n) {
						selected.push($(n).attr('data-value'));
					});
					$(that).siblings('.as-values').val(selected.join(',')).trigger('change');
				}
			})
		},

		/* Code Fields
		----------------------------------------------------------*/

		/**
		 * SiteGround ForceSSL fix
		 */
		 _CodeFieldSSLCheck: function() {
			 $('body').append('<div class="sg-test" style="display:none"><svg xmlns="http://www.w3.org/2000/svg"></svg></div>');

			 if ( 'https://www.w3.org/2000/svg' === $('.sg-test').find('svg').attr('xmlns') ) {
				 FLBuilder._codeDisabled = true;
			 }
			 $('.sg-test').remove()
		 },

		/**
		 * Initializes all code fields in a settings form.
		 *
		 * @since 2.0
		 * @access private
		 * @method _initCodeFields
		 */
		_initCodeFields: function()
		{
			if ( ! FLBuilder._codeDisabled ) {
				$( '.fl-builder-settings:visible', window.parent.document )
					.find( '.fl-code-field' ).each( FLBuilder._initCodeField );
			}
		},

		/**
		 * Initializes a single code field in a settings form.
		 *
		 * @since 2.0
		 * @access private
		 * @method _initCodeField
		 */
		_initCodeField: function()
		{
			var field    = $( this ),
				settings = field.closest( '.fl-builder-settings' ),
				textarea = field.find( 'textarea' ),
				editorId = textarea.attr( 'id' ),
				mode     = textarea.data( 'editor' ),
				wrap     = textarea.data( 'wrap' ),
				editDiv  = $( '<div>', {
					position:   'absolute',
					height:     parseInt( textarea.attr( 'rows' ), 10 ) * 20
				} ),
				editor = null,
				global_layout = ( settings.hasClass('fl-builder-global-settings') || settings.hasClass('fl-builder-layout-settings' ) ) ? true : false;

			editDiv.insertBefore( textarea );
			editDiv.attr('contentEditable', true );
			editDiv.addClass('fl-ignore-validation');
			textarea.css( 'display', 'none' );
			ace.require( 'ace/ext/language_tools' );
			editor = ace.edit( editDiv[0] );
			editor.$blockScrolling = Infinity;
			editor.getSession().setValue( textarea.val() );
			editor.getSession().setMode( 'ace/mode/' + mode );

			if ( wrap ) {
				editor.getSession().setUseWrapMode( true );
			}

			editor.setOptions( FLBuilderConfig.AceEditorSettings );

			editor.getSession().on( 'change', function( e ) {
				textarea.val( editor.getSession().getValue() ).trigger( 'change' );
			} );

			/**
			 * Watch the editor for annotation changes and let the
			 * user know if there are any errors.
			 */
			editor.getSession().on( 'changeAnnotation', function() {
				var annot = editor.getSession().getAnnotations();
				var saveBtn = settings.find( '.fl-builder-settings-save' );
				var errorBtn = settings.find( '.fl-builder-settings-error' );
				var hasError = false;

				for ( var i = 0; i < annot.length; i++ ) {
					if ( annot[ i ].text.indexOf( 'DOCTYPE' ) > -1 ) {
						continue;
					}
					if ( annot[ i ].text.indexOf( 'Named entity expected' ) > -1 ) {
						continue;
					}
					if ( annot[ i ].text.indexOf( '@supports' ) > -1 ) {
						continue;
					}

					if ( 'error' === annot[ i ].type ) {
						hasError = true;
						break;
					}
				}

				val = editor.getSession().getValue();

				if( global_layout && hasError && null !== val.match( /<\/iframe>|<\/script>|<meta/gm ) ) {
					saveBtn.addClass( 'fl-builder-settings-error' );
					saveBtn.on( 'click', FLBuilder._showCodeFieldCriticalError );
				}
				if ( hasError && settings.find( '#fl-builder-settings-section-bb_js_code' ).length > 0 && 'fl-field-bb_js_code' === field.closest( '.fl-field' ).attr('ID') ) {
					saveBtn.addClass( 'fl-builder-settings-error' );
					saveBtn.on( 'click', FLBuilder._showCodeFieldCriticalError );
				}
				if ( hasError && ! saveBtn.hasClass( 'fl-builder-settings-error' ) && errorBtn.length && FLBuilderConfig.CheckCodeErrors ) {
					saveBtn.addClass( 'fl-builder-settings-error' );
					saveBtn.on( 'click', FLBuilder._showCodeFieldError );
				}
				if ( ! hasError ) {
					errorBtn.removeClass( 'fl-builder-settings-error' );
					errorBtn.off( 'click', FLBuilder._showCodeFieldError );
					errorBtn.off( 'click', FLBuilder._showCodeFieldCriticalError );
				}
			});
			textarea.closest( '.fl-field' ).data( 'editor', editor );
		},

		/**
		 * Shows the code error alert when a code field
		 * has an error.
		 *
		 * @since 2.1
		 * @access private
		 * @method _showCodeFieldError
		 */
		_showCodeFieldError: function( e ) {
			e.stopImmediatePropagation();
			FLBuilder.confirm( {
			    message: FLBuilderStrings.codeError,
			    cancel: function(){
					var saveBtn = $( '.fl-builder-settings:visible .fl-builder-settings-save', window.parent.document );
					saveBtn.removeClass( 'fl-builder-settings-error' );
					saveBtn.off( 'click', FLBuilder._showCodeFieldError );
					saveBtn.trigger( 'click' );
				},
			    strings: {
			        ok: FLBuilderStrings.codeErrorFix,
			        cancel: FLBuilderStrings.codeErrorIgnore
			    }
			} );
		},

		_showCodeFieldCriticalError: function( e ) {
			e.stopImmediatePropagation();
			FLBuilder.alert( FLBuilderStrings.codeerrorhtml );
		},

		/* Multiple Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all multiple fields in a settings form.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initMultipleFields
		 */
		_initMultipleFields: function()
		{
			$('.fl-builder-settings:visible .fl-builder-field-multiples', window.parent.document).each(function(){
				var multiples = $(this),
				multiple  = null,
				fields    = null,
				i         = 0,
				cursorAt  = FLBuilderConfig.isRtl ? { left: 10 } : { right: 10 },
				limit     = multiples.attr( 'data-limit' ) || 0,
				count     = multiples.find('tr').length || 0

				if( parseInt(limit) > 0 && count -1 >= parseInt( limit ) ) {
					multiples.find('.fl-builder-field-copy').hide()
					multiples.find('.fl-builder-field-add').fadeOut()
				} else {
					multiples.find('.fl-builder-field-copy, .fl-builder-field-add').show()
				}

				for( ; i < multiples.length; i++) {

					multiple = multiples.eq(i);
					fields = multiple.find('.fl-builder-field-multiple');

					if(fields.length === 1) {
						fields.eq(0).find('.fl-builder-field-actions').addClass('fl-builder-field-actions-single');
					}
					else {
						fields.find('.fl-builder-field-actions').removeClass('fl-builder-field-actions-single');
					}
				}

				$('.fl-builder-field-multiples', window.parent.document).sortable({
					items: '.fl-builder-field-multiple',
					cursor: 'move',
					cursorAt: cursorAt,
					distance: 5,
					opacity: 0.5,
					placeholder: 'fl-builder-field-dd-zone',
					stop: FLBuilder._fieldDragStop,
					tolerance: 'pointer',
					axis: "y"
				});
			}); // end loop
		},

		/**
		 * Adds a new multiple field to the list when the add
		 * button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _addFieldClicked
		 */
		_addFieldClicked: function()
		{
			var button      = $(this),
				fieldName   = button.attr('data-field'),
				fieldRow    = button.closest('tr').siblings('tr[data-field='+ fieldName +']').last(),
				clone       = fieldRow.clone(),
				form   		= clone.find( '.fl-form-field' ),
				formType	= null,
				defaultVal  = null,
				index       = parseInt(fieldRow.find('label span.fl-builder-field-index').html(), 10) + 1;

			clone.find('th label span.fl-builder-field-index').html(index);
			clone.find('.fl-form-field-preview-text').html('');
			clone.find('.fl-form-field-before').remove();
			clone.find('.fl-form-field-after').remove();
			clone.find('input, textarea, select').val('');

			// clear color
			clone.find('.fl-color-picker-color').css('background-color', 'transparent');
			clone.find('.fl-color-picker-color').addClass('fl-color-picker-empty');

			fieldRow.after(clone);
			FLBuilder._initMultipleFields();

			if ( form.length ) {
				formType = form.find( '.fl-form-field-edit' ).data( 'type' );
				form.find( 'input' ).val( JSON.stringify( FLBuilderSettingsConfig.defaults.forms[ formType ] ) );
			}
			else {
				form = button.closest('form.fl-builder-settings');
				formType = form.data( 'type' );

				if ( formType && form.hasClass( 'fl-builder-module-settings' ) ) {
					defaultVal = FLBuilderSettingsConfig.defaults.modules[ formType ][ fieldName ][0];
					clone.find('input, textarea, select').val( defaultVal );
				} else {
					button.parents( '.fl-field' ).find('input').trigger('change');
				}

				FLBuilder._renumberFields( clone.closest( '.fl-field' ) );
			}
		},

		/**
		 * Copies a multiple field and adds it to the list when
		 * the copy button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _copyFieldClicked
		 */
		_copyFieldClicked: function()
		{
			var row     = $(this).closest('tr'),
				parent  = row.parent(),
				clone   = row.clone(),
				index   = parseInt(row.find('label span.fl-builder-field-index').html(), 10) + 1;

			clone.find('th label span.fl-builder-field-index').html(index);
			row.after(clone);
			parent.find('input').trigger('change');
			FLBuilder._renumberFields(row.parent());
			FLBuilder._initMultipleFields();
			if ( FLBuilder.preview ) {
				FLBuilder.preview.delayPreview();
			}
		},

		/**
		 * Deletes a multiple field from the list when the
		 * delete button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _deleteFieldClicked
		 */
		_deleteFieldClicked: function()
		{
			var row     = $(this).closest('tr'),
				parent  = row.parent(),
				global  = parent.closest('.fl-builder-settings').hasClass('fl-builder-global-styles'),
				result  = confirm(global ? FLBuilderStrings.deleteGlobalColorsWarning : FLBuilderStrings.deleteFieldMessage);

			if(result) {
				row.remove();
				FLBuilder._renumberFields(parent);
				FLBuilder._initMultipleFields();
				if ( FLBuilder.preview ) {
					FLBuilder.preview.delayPreview();
				}
			}
		},

		/**
		 * Renumbers the labels for a list of multiple fields.
		 *
		 * @since 1.0
		 * @access private
		 * @method _renumberFields
		 * @param {Object} table A table element with multiple fields.
		 */
		_renumberFields: function( table )
		{
			var rows = table.find( '.fl-builder-field-multiple' );

			rows.each( function( i, row ) {
				$( row ).find( 'th label span.fl-builder-field-index' ).html( i + 1 );
				FLBuilder._renumberFieldAttr( row, 'name', i );
				FLBuilder._renumberFieldAttr( row, 'id', i );
				FLBuilder._renumberFieldAttr( row, 'for', i );
			} );
		},

		/**
		 * @since 2.5
		 * @access private
		 * @method _renumberFieldAttr
		 * @param {String} value
		 */
		_renumberFieldAttr: function( row, key, i )
		{
			$( row ).find( '[' + key + ']' ).each( function( k, ele ) {
				var value = $( ele ).attr( key );
				value = value.replace( /\[(\d+)\]/, '[' + ( i ) + ']' );
				$( ele ).attr( key, value );
			} );
		},

		/**
		 * Returns an element for multiple field drag operations.
		 *
		 * @since 1.0
		 * @access private
		 * @method _fieldDragHelper
		 * @return {Object} The helper element.
		 */
		_fieldDragHelper: function()
		{
			return $('<div class="fl-builder-field-dd-helper"></div>');
		},

		/**
		 * Renumbers and triggers a preview when a multiple field
		 * has finished dragging.
		 *
		 * @since 1.0
		 * @access private
		 * @method _fieldDragStop
		 * @param {Object} e The event object.
		 * @param {Object} ui An object with additional info for the drag.
		 */
		_fieldDragStop: function(e, ui)
		{
			FLBuilder._renumberFields(ui.item.parent());

			if ( FLBuilder.preview ) {
				FLBuilder.preview.delayPreview();
			}
		},

		/* Select Fields
		----------------------------------------------------------*/

		/**
		 * Initializes select fields for a settings form.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initSelectFields
		 */
		_initSelectFields: function()
		{
			var selects = $( '.fl-builder-settings:visible', window.parent.document )
				.find( 'select:not(.fl-preview-ignore)' );

			selects.on( 'change', FLBuilder._settingsSelectChanged );
			selects.trigger( 'change' );
			selects.on( 'change', FLBuilder._calculateSettingsTabsOverflow );

			// Button groups use the same options and toggling behavior as selects.
			var buttonGroups = $( '.fl-builder-settings:visible', window.parent.document )
				.find( '.fl-button-group-field input[type=hidden]:not(.fl-preview-ignore)' );

			buttonGroups.on( 'change', FLBuilder._settingsSelectChanged );
			buttonGroups.trigger( 'change' );
			buttonGroups.on( 'change', FLBuilder._calculateSettingsTabsOverflow );

			// Remove hook first, just in case.
			FLBuilder.removeHook('settings-form-init', FLBuilder._initSelectFieldSetFields );
			FLBuilder.addHook('settings-form-init', FLBuilder._initSelectFieldSetFields );
		},

		/**
		 * Callback for when a settings form select has been changed.
		 * If toggle data is present, other fields will be toggled
		 * when this select changes.
		 *
		 * @since 1.0
		 * @access private
		 * @method _settingsSelectChanged
		 */
		_settingsSelectChanged: function( e )
		{
			var select  = $(this),
				name    = select.attr('data-root-name'),
				toggle  = select.attr('data-toggle'),
				hide    = select.attr('data-hide'),
				trigger = select.attr('data-trigger'),
				set     = select.attr('data-set'),
				val     = select.val(),
				rawVal  = val,
				i       = 0,
				mode = FLBuilderResponsiveEditing._mode,
				responsive = select.closest( '.fl-field-responsive-setting' ),
				modeClass = 'fl-field-responsive-setting-' + mode,
				allowToggle = false;

			if ( '' === val && name ) {
				const field = FLBuilderSettingsForms.getField( name )
				const inheritedVal = field?.getInheritedValue( mode )
				val = inheritedVal ? inheritedVal : val
			}

			if ( responsive.length ) {
				if(
					! select.parent().hasClass( modeClass ) &&
					! select.parent().parent().hasClass( modeClass )
				) {
					return;
				}
			}

 			// TOGGLE sections, fields or tabs.
			if( typeof toggle !== 'undefined' ) {

				toggle = FLBuilder._jsonParse(toggle);
				allowToggle = true;

				for(i in toggle) {
					if ( allowToggle ){
						FLBuilder._settingsSelectToggle(toggle[i].fields, 'hide', '#fl-field-');
						FLBuilder._settingsSelectToggle(toggle[i].sections, 'hide', '#fl-builder-settings-section-');
						FLBuilder._settingsSelectToggle(toggle[i].tabs, 'hide', 'a[href*=fl-builder-settings-tab-', ']');
					}
				}

				if(typeof toggle[val] !== 'undefined') {
					if ( allowToggle ){
						FLBuilder._settingsSelectToggle(toggle[val].fields, 'show', '#fl-field-');
						FLBuilder._settingsSelectToggle(toggle[val].sections, 'show', '#fl-builder-settings-section-');
						FLBuilder._settingsSelectToggle(toggle[val].tabs, 'show', 'a[href*=fl-builder-settings-tab-', ']');
					}
				}
			}

			// HIDE sections, fields or tabs.
			if( typeof hide !== 'undefined' ) {

				hide = FLBuilder._jsonParse(hide);

				for(i in hide) {
					FLBuilder._settingsSelectToggle(hide[i].fields, 'show', '#fl-field-');
					FLBuilder._settingsSelectToggle(hide[i].sections, 'show', '#fl-builder-settings-section-');
					FLBuilder._settingsSelectToggle(hide[i].tabs, 'show', 'a[href*=fl-builder-settings-tab-', ']');
				}

				if(typeof hide[val] !== 'undefined') {
					FLBuilder._settingsSelectToggle(hide[val].fields, 'hide', '#fl-field-');
					FLBuilder._settingsSelectToggle(hide[val].sections, 'hide', '#fl-builder-settings-section-');
					FLBuilder._settingsSelectToggle(hide[val].tabs, 'hide', 'a[href*=fl-builder-settings-tab-', ']');
				}
			}

			// TRIGGER select inputs.
			if( typeof trigger !== 'undefined' ) {

				trigger = FLBuilder._jsonParse(trigger);

				if(typeof trigger[val] !== 'undefined') {
					if(typeof trigger[val].fields !== 'undefined') {
						for(i = 0; i < trigger[val].fields.length; i++) {
							$('#fl-field-' + trigger[val].fields[i]).find('select').trigger('change');
						}
					}
				}
			}
		},

		/**
		 * @since 1.0
		 * @access private
		 * @method _settingsSelectToggle
		 * @param {Array} inputArray
		 * @param {Function} func
		 * @param {String} prefix
		 * @param {String} suffix
		 */
		_settingsSelectToggle: function(inputArray, func, prefix, suffix)
		{
			var i = 0;

			suffix = 'undefined' == typeof suffix ? '' : suffix;

			if(typeof inputArray !== 'undefined') {

				for( ; i < inputArray.length; i++) {

					$('.fl-builder-settings:visible', window.parent.document).find(prefix + inputArray[i] + suffix)[func]();

					// Resize code editor fields.
					$( prefix + inputArray[i] + suffix ).parent().find( '.fl-field[data-type="code"]' ).each( function() {
						if ( ! FLBuilder._codeDisabled && $( this ).data( 'editor' ) ) {
							$( this ).data( 'editor' ).resize();
						}
					} );
				}
			}
		},

		/**
		 * Setup field 'set' configuration. Sets other fields when the value of a selector button group changes.
		 * This is set up after the form is done rendering to avoid initial change event.
		 *
		 * @since 2.8
		 * @access private
		 * @method _initSelectFieldSetFields
		 * @return void
		 */
		_initSelectFieldSetFields: function()
		{
			var selects = $( '.fl-builder-settings:visible', window.parent.document )
			.find( 'select:not(.fl-preview-ignore)' );
			var buttonGroups = $( '.fl-builder-settings:visible', window.parent.document )
			.find( '.fl-button-group-field input[type=hidden]:not(.fl-preview-ignore)' );

			selects.on( 'change', FLBuilder._settingsSelectSetFields );
			buttonGroups.on( 'change', FLBuilder._settingsSelectSetFields );
		},

		_settingsSelectSetFields: function()
		{
			var select = $(this),
				name   = select.attr('data-root-name'),
				set    = select.attr('data-set'),
				val    = select.val(),
				mode = FLBuilderResponsiveEditing._mode;

			// SET other fields based on value
			if ( undefined !== set ) {
				set = FLBuilder._jsonParse(set)

				if ( typeof set[val] !== 'undefined' ) {

					// Handle setting fields
					for( let name in set[val] ) {
						const field = FLBuilderSettingsForms.getField( name )
						const value = set[val][name]

						if ( 'object' === typeof value ) {
							for( let key in value ) {
								field.setSubValue( key, value[key], mode )
							}
						} else {
							field.setValue( value, mode )
						}
					}
				}
			}
		},

		_toggleForm: function() {
			const form = $( '.fl-builder-settings:visible', window.parent.document )
			const fields = form.find('select:visible, .fl-button-group-field:visible input[type=hidden]:not(.fl-preview-ignore)')

			fields.each( function() {
				if ( this.hasAttribute('data-toggle') ) {
					const toggle = FLBuilder._jsonParse( this.getAttribute('data-toggle') )
					const hide = FLBuilder._jsonParse( this.getAttribute('data-hide') )
					const name = this.getAttribute('data-root-name')
					let val = this.value

					if ( '' === val && name ) {
						const field = FLBuilderSettingsForms.getField( name )
						const inheritedVal = field?.getInheritedValue( FLBuilderResponsiveEditing._mode )
						val = inheritedVal ? inheritedVal : val
					}

					// Hide everything
					if ( toggle ) {
						for( let i in toggle ) {
							FLBuilder._settingsSelectToggle(toggle[i].fields, 'hide', '#fl-field-');
							FLBuilder._settingsSelectToggle(toggle[i].sections, 'hide', '#fl-builder-settings-section-');
							FLBuilder._settingsSelectToggle(toggle[i].tabs, 'hide', 'a[href*=fl-builder-settings-tab-', ']');
						}

						// Toggle things on
						if( typeof toggle[val] !== 'undefined' ) {
							FLBuilder._settingsSelectToggle(toggle[val].fields, 'show', '#fl-field-');
							FLBuilder._settingsSelectToggle(toggle[val].sections, 'show', '#fl-builder-settings-section-');
							FLBuilder._settingsSelectToggle(toggle[val].tabs, 'show', 'a[href*=fl-builder-settings-tab-', ']');
						}
					}

					if ( hide ) {
						for( let i in hide ) {
							FLBuilder._settingsSelectToggle(hide[i].fields, 'show', '#fl-field-');
							FLBuilder._settingsSelectToggle(hide[i].sections, 'show', '#fl-builder-settings-section-');
							FLBuilder._settingsSelectToggle(hide[i].tabs, 'show', 'a[href*=fl-builder-settings-tab-', ']');
						}

						if( typeof hide[val] !== 'undefined' ) {
							FLBuilder._settingsSelectToggle(hide[val].fields, 'hide', '#fl-field-');
							FLBuilder._settingsSelectToggle(hide[val].sections, 'hide', '#fl-builder-settings-section-');
							FLBuilder._settingsSelectToggle(hide[val].tabs, 'hide', 'a[href*=fl-builder-settings-tab-', ']');
						}
					}
				}
			} )

		},

		/* Color Pickers
		----------------------------------------------------------*/

		/**
		 * Initializes color picker fields for a settings form.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initColorPickers
		 */
		_initColorPickers: function()
		{
			if ( FLBuilder.colorPicker ) {
				FLBuilder.colorPicker._init();
				return;
			}

			FLBuilder.colorPicker  = new FLBuilderColorPicker({
				mode: 'hsv',
				elements: '.fl-color-picker .fl-color-picker-value',
				presets: FLBuilderConfig.colorPresets ? FLBuilderConfig.colorPresets : [],
				globals: function () {
					var styles = FLBuilderConfig.styles;
					var themeJSON = FLBuilderConfig.themeJSON;
					return {
							bb: styles ? styles.colors : [],
							wp: themeJSON && themeJSON.color.palette.default ? themeJSON.color.palette.default : [],
							theme: themeJSON && themeJSON.color.palette.theme ? themeJSON.color.palette.theme : []
					}
				},
				labels: {
					colorPresets 		: FLBuilderStrings.colorPresets,
					colorPicker 		: FLBuilderStrings.colorPicker,
					placeholder			: FLBuilderStrings.placeholder,
					removePresetConfirm	: FLBuilderStrings.removePresetConfirm,
					noneColorSelected	: FLBuilderStrings.noneColorSelected,
					alreadySaved		: FLBuilderStrings.alreadySaved,
					noPresets			: FLBuilderStrings.noPresets,
					presetAdded			: FLBuilderStrings.presetAdded,
				}
			});

			$( FLBuilder.colorPicker ).on( 'presetRemoved presetAdded presetSorted', function( event, data ) {
				FLBuilder.ajax({
					action: 'save_color_presets',
					presets: data.presets
				});
			});

		},

		/* Color Pickers
		----------------------------------------------------------*/

		/**
		 * Initializes gradient picker fields for a settings form.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initGradientPickers
		 */
		_initGradientPickers: function()
		{
			$( '.fl-builder-settings:visible .fl-gradient-picker', window.parent.document )
				.each( FLBuilder._initGradientPicker );
		},

		/**
		 * Initializes a single gradient picker field.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initGradientPicker
		 */
		_initGradientPicker: function()
		{
			var picker = $( this ),
				type = picker.find( '.fl-gradient-picker-type-select' ),
				angle = picker.find( '.fl-gradient-picker-angle-wrap' ),
				position = picker.find( '.fl-gradient-picker-position' );

			type.on( 'change', function() {
				if ( 'linear' === $( this ).val() ) {
					angle.show();
					position.hide();
				} else {
					angle.hide();
					position.show();
				}
			} );
		},

		/* Single Photo Fields
		----------------------------------------------------------*/

		/**
		 * Initializes photo fields for a settings form.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initPhotoFields
		 */
		_initPhotoFields: function()
		{
			var selects = $( '.fl-builder-settings:visible', window.parent.document )
				.find( '.fl-photo-field select' );

			selects.on( 'change', FLBuilder._toggleSettingsOnIconChange );
			selects.trigger( 'change' );
		},

		/**
		 * Initializes the single photo selector.
		 *
		 * @since 1.8.6
		 * @access private
		 * @method _initSinglePhotoSelector
		 */
		_initSinglePhotoSelector: function()
		{
			if(FLBuilder._singlePhotoSelector === null) {
				FLBuilder._singlePhotoSelector = wp.media({
					title: FLBuilderStrings.selectPhoto,
					button: { text: FLBuilderStrings.selectPhoto },
					library : { type : FLBuilderConfig.uploadTypes.image },
					multiple: false
				});
				FLBuilder._singlePhotoSelector.on( 'open', FLBuilder._wpmedia_reset_errors );
				window.parent._wpPluploadSettings['defaults']['multipart_params']['fl_upload_type']= 'photo';
			}
		},

		/**
		 * Shows the single photo selector.
		 *
		 * @since 1.0
		 * @access private
		 * @method _selectSinglePhoto
		 */
		_selectSinglePhoto: function()
		{
			FLBuilder._initSinglePhotoSelector();
			FLBuilder._singlePhotoSelector.once('open', $.proxy(FLBuilder._singlePhotoOpened, this));
			FLBuilder._singlePhotoSelector.once('select', $.proxy(FLBuilder._singlePhotoSelected, this));
			FLBuilder._singlePhotoSelector.open();
		},

		/**
		 * Callback for when the single photo selector is shown.
		 *
		 * @since 1.0
		 * @access private
		 * @method _singlePhotoOpened
		 */
		_singlePhotoOpened: function()
		{
			var selection   = FLBuilder._singlePhotoSelector.state().get('selection'),
				wrap        = $(this).closest('.fl-photo-field'),
				photoField  = wrap.find('input[type=hidden]'),
				photo       = photoField.val(),
				attachment  = null;

			if($(this).hasClass('fl-photo-replace')) {
				selection.reset();
				wrap.addClass('fl-photo-empty');
				photoField.val('');
			}
			else if(photo !== '') {
				attachment = wp.media.attachment(photo);
				attachment.fetch();
				selection.add(attachment ? [attachment] : []);
			}
			else {
				selection.reset();
			}
		},

		/**
		 * Callback for when a single photo is selected.
		 *
		 * @since 1.0
		 * @access private
		 * @method _singlePhotoSelected
		 */
		_singlePhotoSelected: function()
		{
			var photo      = FLBuilder._singlePhotoSelector.state().get('selection').first().toJSON(),
				wrap       = $(this).closest('.fl-photo-field'),
				photoField = wrap.find('input[type=hidden]'),
				preview    = wrap.find('.fl-photo-preview img'),
				srcSelect  = wrap.find('select');

			if ( photo.url && photo.url.endsWith( '.svg' ) ) {
				photo.sizes = {
					full: {
						url: photo.url,
						filename: photo.url.split( '/' ).pop(),
						height: '',
						width: ''
					}
				}
			}

			photoField.val(photo.id);
			preview.attr('src', FLBuilder._getPhotoSrc(photo));
			wrap.removeClass('fl-photo-empty').removeClass('fl-photo-no-attachment');
			wrap.find('label.error').remove();
			srcSelect.show();
			srcSelect.html(FLBuilder._getPhotoSizeOptions(photo,srcSelect.val()));
			srcSelect.trigger('change');
			FLBuilderSettingsConfig.attachments[ photo.id ] = photo;
		},

		/**
		 * Clears a photo that has been selected in a single photo field.
		 *
		 * @since 1.6.4.3
		 * @access private
		 * @method _singlePhotoRemoved
		 */
		_singlePhotoRemoved: function()
		{
			FLBuilder._initSinglePhotoSelector();

			var state       = FLBuilder._singlePhotoSelector.state(),
				selection   = 'undefined' != typeof state ? state.get('selection') : null,
				wrap        = $(this).closest('.fl-photo-field'),
				photoField  = wrap.find('input[type=hidden]'),
				srcSelect   = wrap.find('select');

			if ( selection ) {
				selection.reset();
			}

			wrap.addClass('fl-photo-empty');
			photoField.val('');
			srcSelect.html('<option value="" selected></option>');
			srcSelect.trigger('change');
		},

		/**
		 * Returns the src URL for a photo.
		 *
		 * @since 1.0
		 * @access private
		 * @method _getPhotoSrc
		 * @param {Object} photo A photo data object.
		 * @return {String} The src URL for a photo.
		 */
		_getPhotoSrc: function(photo)
		{
			if(typeof photo.sizes === 'undefined') {
				return photo.url;
			}
			else if(typeof photo.sizes.thumbnail !== 'undefined') {
				return photo.sizes.thumbnail.url;
			}
			else {
				return photo.sizes.full.url;
			}
		},

		/**
		 * Builds the options for a photo size select.
		 *
		 * @since 1.0
		 * @access private
		 * @method _getPhotoSizeOptions
		 * @param {Object} photo A photo data object.
		 * @param {String} selectedSize The selected photo size if one is set.
		 * @return {String} The HTML for the photo size options.
		 */
		_getPhotoSizeOptions: function( photo, selectedSize )
		{
			var html     = '',
				size     = null,
				selected = null,
				check    = null,
				doneselected = false,
				title    = '',
				titleSize = '',
				titles = {
					full      : FLBuilderStrings.fullSize,
					large     : FLBuilderStrings.large,
					medium    : FLBuilderStrings.medium,
					thumbnail : FLBuilderStrings.thumbnail
				};

			if(typeof photo.sizes === 'undefined' || 0 === photo.sizes.length) {
				html += '<option value="' + photo.url + '">' + FLBuilderStrings.fullSize + '</option>';
			}
			else {

				// Check the selected value without the protocol so we get a match if
				// a site has switched to HTTPS since selecting this photo (#641).
				if ( selectedSize ) {
					selectedSize = selectedSize.split(/[\\/]/).pop();
				}

				/**
				 * We need to make a check here to be sure that the selectedSize
				 * is actually the image we selected, or the previous image
				 * otherwise it will default to the 1st in the select (thumbnail)
				 */
				selectedverified = false;
				for(sizecheck in photo.sizes) {
					if ( photo.sizes[ sizecheck ].url.split(/[\\/]/).pop() === selectedSize ) {
						selectedverified = true;
						break;
					}
				}

				if ( ! selectedverified ) {
					selectedSize = false;
				}


				for(size in photo.sizes) {

					selected = '';

					if ( 'undefined' != typeof titles[ size ] ) {
						title = titles[ size ];
					}
					else if ( 'undefined' != typeof FLBuilderConfig.customImageSizeTitles[ size ] ) {
						title = FLBuilderConfig.customImageSizeTitles[ size ];
					}
					else {
						title = '';
					}

					if ( ! selectedSize ) {

						if ( typeof FLBuilderConfig.photomodulesize !== 'undefined' && size === FLBuilderConfig.photomodulesize && ! doneselected ) {
							selected = ' selected="selected"';
							doneselected = true;
						} else if( size == FLBuilderConfig.defaultImageSize && ! doneselected ){
							selected = ' selected="selected"';
							doneselected = true;
						}

					} else if( selectedSize === photo.sizes[ size ].url.split(/[\\/]/).pop() && ! doneselected ) {
						selected = ' selected="selected"';
						doneselected = true;
					}

					if ( photo.sizes[size].width && photo.sizes[size].height ) {
						title = title ? title + ' - ' : title
						titleSize = photo.sizes[size].width + ' x ' + photo.sizes[size].height
					}

					html += '<option data-size="' + size + '" value="' + photo.sizes[size].url + '"' + selected + '>' + title + titleSize + '</option>';
				}
			}
			return html;
		},

		/* Multiple Photo Fields
		----------------------------------------------------------*/

		/**
		 * Shows the multiple photo selector.
		 *
		 * @since 1.0
		 * @access private
		 * @method _selectMultiplePhotos
		 */
		_selectMultiplePhotos: function()
		{
			var wrap           = $(this).closest('.fl-multiple-photos-field'),
				photosField    = wrap.find('input[type=hidden]'),
				photosFieldVal = photosField.val(),
				parsedVal      = photosFieldVal === '' ? '' : FLBuilder._jsonParse(photosFieldVal),
				defaultPostId  = wp.media.gallery.defaults.id,
				content        = '[gallery ids="-1"]',
				shortcode      = null,
				attachments    = null,
				selection      = null,
				i              = null,
				ids            = [];

			// Builder the gallery shortcode.
			if ( 'object' == typeof parsedVal ) {
				for ( i in parsedVal ) {
					ids.push( parsedVal[ i ] );
				}
				content = '[gallery ids="'+ ids.join() +'"]';
			}

			shortcode = wp.shortcode.next('gallery', content).shortcode;

			if(_.isUndefined(shortcode.get('id')) && !_.isUndefined(defaultPostId)) {
				shortcode.set('id', defaultPostId);
			}

			// Get the selection object.
			attachments = wp.media.gallery.attachments(shortcode);

			selection = new wp.media.model.Selection(attachments.models, {
				props: attachments.props.toJSON(),
				multiple: true
			});

			selection.gallery = attachments.gallery;

			// Fetch the query's attachments, and then break ties from the
			// query to allow for sorting.
			selection.more().done(function() {

				if ( ! selection.length ) {
					FLBuilder._multiplePhotoSelector.setState( 'gallery-library' );
				}

				// Break ties with the query.
				selection.props.set({ query: false });
				selection.unmirror();
				selection.props.unset('orderby');
			});

			// Destroy the previous gallery frame.
			if(FLBuilder._multiplePhotoSelector) {
				FLBuilder._multiplePhotoSelector.dispose();
			}
			window.parent._wpPluploadSettings['defaults']['multipart_params']['fl_upload_type']= 'photo';
			// Store the current gallery frame.
			FLBuilder._multiplePhotoSelector = wp.media({
				frame:     'post',
				state:     $(this).hasClass('fl-multiple-photos-edit') ? 'gallery-edit' : 'gallery-library',
				title:     wp.media.view.l10n.editGalleryTitle,
				editing:   true,
				multiple:  true,
				selection: selection
			}).open();

			$(FLBuilder._multiplePhotoSelector.views.view.el).addClass('fl-multiple-photos-lightbox');
			FLBuilder._multiplePhotoSelector.once('update', $.proxy(FLBuilder._multiplePhotosSelected, this));
		},

		/**
		 * Callback for when multiple photos have been selected.
		 *
		 * @since 1.0
		 * @access private
		 * @method _multiplePhotosSelected
		 * @param {Object} data The photo data object.
		 */
		_multiplePhotosSelected: function(data)
		{
			var wrap        = $(this).closest('.fl-multiple-photos-field'),
				photosField = wrap.find('input[type=hidden]'),
				count       = wrap.find('.fl-multiple-photos-count'),
				photos      = [],
				i           = 0;

			for( ; i < data.models.length; i++) {
				photos.push(data.models[i].id);
			}

			if(photos.length == 1) {
				count.html('1 ' + FLBuilderStrings.photoSelected);
			}
			else {
				count.html(photos.length + ' ' + FLBuilderStrings.photosSelected);
			}

			wrap.removeClass('fl-multiple-photos-empty');
			wrap.find('label.error').remove();
			photosField.val(JSON.stringify(photos)).trigger('change');
		},

		/* Single Video Fields
		----------------------------------------------------------*/

		/**
		 * Initializes the single video selector.
		 *
		 * @since 1.10.8
		 * @access private
		 * @method _initSingleVideoSelector
		 */
		_initSingleVideoSelector: function()
		{
			if(FLBuilder._singleVideoSelector === null) {
				var defaultFileExtensions = window.parent._wpPluploadSettings.defaults.filters.mime_types[0].extensions;

				window.parent._wpPluploadSettings['defaults']['multipart_params']['fl_upload_type'] = 'video';
				window.parent._wpPluploadSettings.defaults.filters.mime_types[0].extensions         = FLBuilderConfig.uploadTypes.videoTypes;

				FLBuilder._singleVideoSelector = wp.media({
					title: FLBuilderStrings.selectVideo,
					button: { text: FLBuilderStrings.selectVideo },
					library: { type: [ 'video/mp4', 'video/webm' ] },
					multiple: false
				});

				FLBuilder._singleVideoSelector.on( 'open', FLBuilder._wpmedia_reset_errors );

				FLBuilder._singleVideoSelector.on( 'close', function () {
					window.parent._wpPluploadSettings.defaults.filters.mime_types[0].extensions = defaultFileExtensions;
				});
			}
		},

		/**
		 * Shows the single video selector.
		 *
		 * @since 1.0
		 * @access private
		 * @method _selectSingleVideo
		 */
		_selectSingleVideo: function()
		{
			FLBuilder._initSingleVideoSelector();
			FLBuilder._singleVideoSelector.once('select', $.proxy(FLBuilder._singleVideoSelected, this));
			FLBuilder._singleVideoSelector.open();
		},

		/**
		 * Callback for when a single video is selected.
		 *
		 * @since 1.0
		 * @access private
		 * @method _singleVideoSelected
		 */
		_singleVideoSelected: function()
		{
			var video      = FLBuilder._singleVideoSelector.state().get('selection').first().toJSON(),
				wrap       = $(this).closest('.fl-video-field'),
				image      = wrap.find('.fl-video-preview-img'),
				filename   = wrap.find('.fl-video-preview-filename'),
				videoField = wrap.find('input[type=hidden]');

			image.html('<span class="dashicons dashicons-media-video"></span>');
			filename.html(video.filename);
			wrap.removeClass('fl-video-empty');
			wrap.find('label.error').remove();
			videoField.val(video.id).trigger('change');
			FLBuilderSettingsConfig.attachments[ video.id ] = video;
		},

		/**
		 * Clears a video that has been selected in a single video field.
		 *
		 * @since 2.1
		 * @access private
		 * @method _singleVideoRemoved
		 */
		_singleVideoRemoved: function()
		{
			FLBuilder._initSingleVideoSelector();
			var state       = FLBuilder._singleVideoSelector.state(),
				selection   = 'undefined' != typeof state ? state.get('selection') : null,
				wrap        = $(this).closest('.fl-video-field'),
				image      	= wrap.find('.fl-video-preview-img img'),
				filename   	= wrap.find('.fl-video-preview-filename'),
				videoField  = wrap.find('input[type=hidden]');

			if ( selection ) {
				selection.reset();
			}

			image.attr('src', '');
			filename.html('');
			wrap.addClass('fl-video-empty');
			videoField.val('').trigger('change');
		},

		/* Multiple Audios Field
		----------------------------------------------------------*/

		/**
		 * Shows the multiple audio selector.
		 *
		 * @since 1.0
		 * @access private
		 * @method _selectMultipleAudios
		 */
		_selectMultipleAudios: function()
		{
			var wrap           = $(this).closest('.fl-multiple-audios-field'),
				audiosField    = wrap.find('input[type=hidden]'),
				audiosFieldVal = audiosField.val(),
				content        = audiosFieldVal == '' ? '[playlist ids="-1"]' : '[playlist ids="'+ FLBuilder._jsonParse(audiosFieldVal).join() +'"]',
				shortcode      = wp.shortcode.next('playlist', content).shortcode,
				defaultPostId  = wp.media.playlist.defaults.id,
				attachments    = null,
				selection      = null;

			if(_.isUndefined(shortcode.get('id')) && !_.isUndefined(defaultPostId)) {
				shortcode.set('id', defaultPostId);
			}

			attachments = wp.media.playlist.attachments(shortcode);

			selection = new wp.media.model.Selection(attachments.models, {
				props: attachments.props.toJSON(),
				multiple: true
			});

			selection.playlist = attachments.playlist;

			// Fetch the query's attachments, and then break ties from the
			// query to allow for sorting.
			selection.more().done(function() {
				// Break ties with the query.
				selection.props.set({ query: false });
				selection.unmirror();
				selection.props.unset('orderby');
			});

			// Destroy the previous frame.
			if(FLBuilder._multipleAudiosSelector) {
				FLBuilder._multipleAudiosSelector.dispose();
			}

			// Store the current frame.
			FLBuilder._multipleAudiosSelector = wp.media({
				frame:     'post',
				state:     $(this).hasClass('fl-multiple-audios-edit') ? 'playlist-edit' : 'playlist-library',
				title:     wp.media.view.l10n.editPlaylistTitle,
				editing:   true,
				multiple:  true,
				selection: selection
			}).open();

			// Hide the default playlist settings since we have them added in the audio settings
			FLBuilder._multipleAudiosSelector.content.get('view').sidebar.unset('playlist');
			FLBuilder._multipleAudiosSelector.on( 'content:render:browse', function( browser ) {
			    if ( !browser ) return;
			    // Hide Playlist Settings in sidebar
			    browser.sidebar.on('ready', function(){
			        browser.sidebar.unset('playlist');
			    });
			});


			FLBuilder._multipleAudiosSelector.once('update', $.proxy(FLBuilder._multipleAudiosSelected, this));

		},

		/**
		 * Callback for when a single/multiple audo is selected.
		 *
		 * @since 1.0
		 * @access private
		 * @method _multipleAudiosSelected
		 */
		_multipleAudiosSelected: function(data)
		{
			var wrap       		= $(this).closest('.fl-multiple-audios-field'),
				count      		= wrap.find('.fl-multiple-audios-count'),
				audioField 		= wrap.find('input[type=hidden]'),
				audios     		= [],
				i          		= 0;

			for( ; i < data.models.length; i++) {
				audios.push(data.models[i].id);
			}

			if(audios.length == 1) {
				count.html('1 ' + FLBuilderStrings.audioSelected);
			}
			else {
				count.html(audios.length + ' ' + FLBuilderStrings.audiosSelected);
			}

			audioField.val(JSON.stringify(audios)).trigger('change');
			wrap.removeClass('fl-multiple-audios-empty');
			wrap.find('label.error').remove();

		},

		/* Icon Fields
		----------------------------------------------------------*/

		/**
		 * Initializes icon fields for a settings form.
		 *
		 * @since 2.2
		 * @access private
		 * @method _initIconFields
		 */
		_initIconFields: function()
		{
			var inputs = $( '.fl-builder-settings:visible', window.parent.document )
				.find( '.fl-icon-field input' );

			inputs.on( 'change', FLBuilder._toggleSettingsOnIconChange );
			inputs.trigger( 'change' );
		},

		/**
		 * Callback for when an icon field changes. If the field
		 * isn't empty the specified elements (if any) will be shown.
		 *
		 * @since 2.2
		 * @access private
		 * @method _toggleSettingsOnIconChange
		 */
		_toggleSettingsOnIconChange: function()
		{
			var input  = $( this ),
				val    = input.val(),
				show   = input.attr( 'data-show' ),
				i      = 0;

			if ( typeof show === 'undefined' ) {
				return;
			}

			show = FLBuilder._jsonParse( show );

			FLBuilder._settingsSelectToggle( show.fields, 'hide', '#fl-field-' );
			FLBuilder._settingsSelectToggle( show.sections, 'hide', '#fl-builder-settings-section-' );
			FLBuilder._settingsSelectToggle( show.tabs, 'hide', 'a[href*=fl-builder-settings-tab-', ']' );

			if ( val ) {
				FLBuilder._settingsSelectToggle( show.fields, 'show', '#fl-field-' );
				FLBuilder._settingsSelectToggle( show.sections, 'show', '#fl-builder-settings-section-' );
				FLBuilder._settingsSelectToggle( show.tabs, 'show', 'a[href*=fl-builder-settings-tab-', ']' );
				FLBuilder._calculateSettingsTabsOverflow();
			}
		},

		/**
		 * Shows the icon selector.
		 *
		 * @since 1.0
		 * @access private
		 * @method _selectIcon
		 */
		_selectIcon: function()
		{
			var self = this;

			FLIconSelector.open(function(icon){
				FLBuilder._iconSelected.apply(self, [icon]);
			});
		},

		/**
		 * Callback for when an icon is selected.
		 *
		 * @since 1.0
		 * @access private
		 * @method _iconSelected
		 * @param {String} icon The selected icon's CSS classname.
		 */
		_iconSelected: function(icon)
		{
			var wrap       = $(this).closest('.fl-icon-field'),
				iconField  = wrap.find('input[type=hidden]'),
				iconTag    = wrap.find('i'),
				oldIcon    = iconTag.attr('data-icon');

			iconField.val(icon).trigger('change');
			iconTag.removeClass(oldIcon);
			iconTag.addClass(icon);
			iconTag.attr('data-icon', icon);
			wrap.removeClass('fl-icon-empty');
			wrap.find('label.error').remove();
		},

		/**
		 * Callback for when a selected icon is removed.
		 *
		 * @since 1.0
		 * @access private
		 * @method _removeIcon
		 */
		_removeIcon: function()
		{
			var wrap       = $(this).closest('.fl-icon-field'),
				iconField  = wrap.find('input[type=hidden]'),
				iconTag    = wrap.find('i');

			iconField.val('').trigger('change');
			iconTag.removeClass();
			iconTag.attr('data-icon', '');
			wrap.addClass('fl-icon-empty');
		},

		/* Settings Form Fields
		----------------------------------------------------------*/

		/**
		 * Shows the settings for a nested form field when the
		 * edit link is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _formFieldClicked
		 */
		_formFieldClicked: function()
		{
			var link      = $( this ),
				form      = link.closest( '.fl-builder-settings' ),
				type      = link.attr( 'data-type' ),
				settings  = link.siblings( 'input' ).val(),
				helper    = FLBuilder._moduleHelpers[ type ],
				config    = FLBuilderSettingsConfig.forms[ type ],
				lightbox  = FLBuilder._openNestedSettings( { className: 'fl-builder-lightbox fl-form-field-settings' } );

			if ( '' === settings ) {
				settings = JSON.stringify( FLBuilderSettingsConfig.forms[ type ] );
			}

			// Trigger refresh preview
			FLBuilder.preview?.preview()

			FLBuilderSettingsForms.render( {
				id        		: type,
				nodeId    		: form.attr( 'data-node' ),
				nodeSettings	: FLBuilder._getSettings( form ),
				settings  		: FLBuilder._jsonParse( settings.replace( /&#39;/g, "'" ) ),
				lightbox		: lightbox,
				rules 			: helper ? helper.rules : null,
				helper			: {
					init: function () {
						if ( helper ) {
							helper.init();
						}
						FLBuilder._initFormFieldSettingsPreview();
					}
				},
			}, function() {
				link.attr( 'id', 'fl-' + lightbox._node.attr( 'data-instance-id' ) );
				lightbox._node.find( 'form.fl-builder-settings' ).attr( 'data-type', type );
				FLBuilderResponsiveEditing._switchAllSettingsToCurrentMode();
			} );
		},

		/**
		 * Saves the settings for a nested form field when the
		 * save button is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _saveFormFieldClicked
		 * @return {Boolean} Whether the save was successful or not.
		 */
		_saveFormFieldClicked: function()
		{
			var form = $( this ).closest( '.fl-builder-settings' );
			var saved = FLBuilder._saveFormFieldSettings( form );

			if ( saved ) {
				FLBuilder._closeNestedSettings();
			} else {
				FLBuilder._toggleSettingsTabErrors();
			}
		},

		/**
		 * Initialize settings preview for a form field.
		 *
		 * @since 2.5
		 * @access private
		 * @method _initFormFieldSettingsPreview
		 * @param {Object} lightbox
		 */
		_initFormFieldSettingsPreview: function()
		{
			var form = $( '.fl-builder-settings:visible' );
			var fields = form.find( '.fl-field' );
			var editors = form.find( 'textarea.wp-editor-area' );

			form.on( 'input', 'input:not([type=hidden]), textarea', FLBuilder._previewFormFieldSettings );
			form.on( 'change', 'input[type=hidden], select', FLBuilder._previewFormFieldSettings );

			var shapename = fields.find('input[name=shape_name]');
			var shapeorig = fields.find('input[name=shape_original]');

			if ( shapename.length > 0 ) {
				shapeorig.hide();
				shapename.on( 'keyup', function() {
					FLBuilder._shapesEdited = true;
				});
				if ( shapename.val().length > 0 && shapeorig.val().length < 1 ) {
					shapeorig.val( shapename.val() );
				}
			}

			if ( 'undefined' !== typeof window.parent.tinyMCE ) {
				editors.each( function ( i, editor ) {
					editor = window.parent.tinyMCE.get( $( editor ).attr( 'id' ) );
					editor.on( 'change', FLBuilder._previewFormFieldSettings );
					editor.on( 'keyup', FLBuilder._previewFormFieldSettings );
				} );
			}
		},

		/**
		 * Previews the settings for a nested form field when
		 * a setting is changed.
		 *
		 * @since 2.5
		 * @access private
		 * @method _previewFormFieldSettings
		 */
		_previewFormFieldSettings: function()
		{
			var ele = this.formElement ? this.formElement : this;
			var form = $( ele ).closest( '.fl-builder-settings' );
			var timeout = form.data( 'timeout' );

			if ( timeout ) {
				clearTimeout( timeout );
			}

			timeout = setTimeout( function () {
				FLBuilder._saveFormFieldSettings( form );
			}, 1000 );

			form.data( 'timeout', timeout );
		},

		/**
		 * Saves the settings for a nested form field.
		 *
		 * @since 2.5
		 * @access private
		 * @method _saveFormFieldSettings
		 * @param {Object} form
		 * @return {Boolean} Whether the save was successful or not.
		 */
		_saveFormFieldSettings: function( form )
		{
			var lightboxId    = form.closest( '.fl-lightbox-wrap' ).attr( 'data-instance-id' ),
				type          = form.attr( 'data-type' ),
				settings      = FLBuilder._getSettings( form ),
				oldSettings   = {},
				helper        = FLBuilder._moduleHelpers[ type ],
				link          = $( '.fl-builder-settings #fl-' + lightboxId, window.parent.document ),
				preview       = link.parent().attr( 'data-preview-text' ),
				previewOptions = [],
				activePreview = '',
				previewField  = null,
				previewText   = '',
				selectPreview = null,
				tmp           = document.createElement( 'div' ),
				valid         = true;

			if ( preview ) {
				previewOptions = preview.split(',');
			}

			// Handle 'preview_text' fields
			for ( var i = 0; i < previewOptions.length; i++ ) {
				if ( settings[ previewOptions[i] ] ) {
					activePreview = previewOptions[i];
					previewText = settings[ activePreview ];
					previewField = form.find( '#fl-field-' + activePreview );
					selectPreview = $( 'select[name="' + activePreview + '"]', window.parent.document )
					break;
				}
			}


			if ( selectPreview && selectPreview.length > 0 ) {
				previewText = selectPreview.find( 'option[value="' + previewText + '"]' ).text();
			}

			if ( typeof helper !== 'undefined' ) {
				form.find('label.error').remove();
				form.validate().hideErrors();
				valid = form.validate().form();
				if ( valid ) {
					valid = helper.submit();
				}
			}

			if ( valid ) {
				if ( typeof preview !== 'undefined' && typeof previewText !== 'undefined' ) {
					if ( 'icon' === previewField?.data( 'type' ) ) {
						previewText = '<i class="' + previewText + '"></i>';
					}
					else if ( previewText.length > 35 ) {
						tmp.innerHTML = previewText;
						previewText = ( tmp.textContent || tmp.innerText || '' ).replace( /^(.{35}[^\s]*).*/, "$1" ) + '...';
					}
					if( 'filter_meta_label' == preview && ! previewText ) {
						previewText = settings[ 'filter_meta_key' ];
					}
					link.siblings( '.fl-form-field-preview-text' ).html( previewText );
				}

				if ( link.length > 0 ) {
					oldSettings = link.siblings( 'input' ).val().replace( /&#39;/g, "'" );

					if ( '' != oldSettings ) {
						settings = $.extend( FLBuilder._jsonParse( oldSettings ), settings );
					}

					link.siblings( 'input' ).val( JSON.stringify( settings ) ).trigger( 'change' );
				}

				return true;
			}

			return false;
		},

		/* Layout Fields
		----------------------------------------------------------*/

		/**
		 * Callback for when the item of a layout field is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _layoutFieldClicked
		 */
		_layoutFieldClicked: function()
		{
			var option = $(this);

			option.siblings().removeClass('fl-layout-field-option-selected');
			option.addClass('fl-layout-field-option-selected');
			option.siblings('input').val(option.attr('data-value'));
		},

		/* Link Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all link fields in a settings form.
		 *
		 * @since 1.3.9
		 * @access private
		 * @method _initLinkFields
		 */
		_initLinkFields: function()
		{
			$('.fl-builder-settings:visible .fl-link-field', window.parent.document)
				.each(FLBuilder._initLinkField);
		},

		/**
		 * Initializes a single link field in a settings form.
		 *
		 * @since 1.3.9
		 * @access private
		 * @method _initLinkFields
		 */
		_initLinkField: function()
		{
			var wrap        = $(this),
				searchInput = wrap.find('.fl-link-field-search-input'),
				checkboxes	= wrap.find( '.fl-link-field-options-wrap input[type=checkbox]' );

			searchInput.autoSuggest(FLBuilder._ajaxUrl({
				'fl_action'         : 'fl_builder_autosuggest',
				'fl_as_action'      : 'fl_as_links',
				'_wpnonce'			: FLBuilderConfig.ajaxNonce
			}), {
				asHtmlID                    : searchInput.attr('name'),
				selectedItemProp            : 'name',
				searchObjProps              : 'name',
				minChars                    : 3,
				keyDelay                    : 1000,
				fadeOut                     : false,
				usePlaceholder              : true,
				emptyText                   : FLBuilderStrings.noResultsFound,
				showResultListWhenNoMatch   : true,
				queryParam                  : 'fl_as_query',
				selectionLimit              : 1,
				afterSelectionAdd           : FLBuilder._updateLinkField,
				formatList: function(data, elem){
					var new_elem = elem.html(data.name + '<span class="type">[' + data.type + ']</span>');
					return new_elem;
				}
			});

			checkboxes.on( 'click', FLBuilder._linkFieldCheckboxClicked );
		},

		/**
		 * Updates the value of a link field when a link has been
		 * selected from the auto suggest menu.
		 *
		 * @since 1.3.9
		 * @access private
		 * @method _updateLinkField
		 * @param {Object} element The auto suggest field.
		 * @param {Object} item The current selection.
		 * @param {Array} selections An array of selected values.
		 */
		_updateLinkField: function(element, item, selections)
		{
			var wrap        = element.closest('.fl-link-field'),
				search      = wrap.find('.fl-link-field-search'),
				searchInput = wrap.find('.fl-link-field-search-input'),
				field       = wrap.find('.fl-link-field-input');

			field.val(item.value).trigger('keyup');
			searchInput.autoSuggest('remove', item.value);
			search.hide();
		},

		/**
		 * Shows the auto suggest input for a link field.
		 *
		 * @since 1.3.9
		 * @access private
		 * @method _linkFieldSelectClicked
		 */
		_linkFieldSelectClicked: function()
		{
			var $el = $(this).closest('.fl-link-field').find('.fl-link-field-search');
			$el.show();
			$el.find('input').focus();
		},

		/**
		 * Hides the auto suggest input for a link field.
		 *
		 * @since 1.3.9
		 * @access private
		 * @method _linkFieldSelectCancelClicked
		 */
		_linkFieldSelectCancelClicked: function()
		{
			var $button = $(this);
			$button.parent().hide();
			$button.closest('.fl-link-field').find('input.fl-link-field-input').focus();
		},

		/**
		 * Handles when a link field checkbox option is clicked.
		 *
		 * @since 2.2
		 * @access private
		 * @method _linkFieldCheckboxClicked
		 */
		_linkFieldCheckboxClicked: function()
		{
			var checkbox = $( this ),
				checked = checkbox.is( ':checked' ),
				input = checkbox.siblings( 'input[type=hidden]' ),
				value = '';

			if ( checkbox.hasClass( 'fl-link-field-target-cb' ) ) {
				value = checked ? '_blank' : '_self';
			} else {
				value = checked ? 'yes' : 'no';
			}

			input.val( value );
		},

		/* Font Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all font fields in a settings form.
		 *
		 * @since  1.6.3
		 * @access private
		 * @method _initFontFields
		 */
		_initFontFields: function(){
			$('.fl-builder-settings:visible .fl-font-field', window.parent.document)
				.each( FLBuilder._initFontField );
		},

		/**
		 * Initializes a single font field in a settings form.
		 *
		 * @since  1.6.3
		 * @access private
		 * @method _initFontFields
		 */
		_initFontField: function(){
			var wrap   = $( this ),
				value  = wrap.attr( 'data-value' ),
				font   = wrap.find( '.fl-font-field-font' ),
				weight = wrap.find( '.fl-font-field-weight' );

			if ( FLBuilderConfig.select2Enabled ) {
				font.select2({width:'100%'})
					.on('select2:open', function(e){
						$('.select2-search__field').attr('placeholder', FLBuilderStrings.placeholderSelect2);
					})
			}

			$('body', window.parent.document).on({
					mouseenter: function () {
						var highlighted_item = jQuery(this).text(),
						group = jQuery(this).parent().parent().attr("aria-label"),
						head = jQuery("head", window.parent.document),
						url = 'https://fonts.googleapis.com/css?family=' + highlighted_item,
						link_id = highlighted_item.toLowerCase().replaceAll( ' ', '-' ),
						parent_id = $(this).parent().parent().parent().attr('id');
						if ( ! parent_id ) {
							return false;
						}
						if( parent_id.indexOf('typographyfont_family') < 0 ) {
							return false;
						}
						if ( 'Google' === group ) {
							linkElement = "<link id='" + link_id + "' rel='stylesheet' href='" + url + "' type='text/css' media='screen'>";
							jQuery(this).css('font-family', '"' + highlighted_item + '"' );
							if ( jQuery( '#' + link_id ).length > 0 ) {
								return false;
							}
							head.append(linkElement);
						}
					}
				}, '.select2-results__option.select2-results__option--highlighted');

			font.on( 'change', function(){
				FLBuilder._getFontWeights( font );
			} );

			if ( value.indexOf( 'family' ) > -1 ) {

				var value = FLBuilder._jsonParse( value );
				var valid = false;

				fonts = FLBuilderFontFamilies;

				Object.keys(fonts.system).forEach(function(name){
					if ( name === value.family ) {
						valid = true
					}
				});

				Object.keys(fonts.google).forEach(function(name){
					if ( name === value.family ) {
						valid = true
					}
				});

				if ( ! valid && 'Default' !== value.family ) {
					value = {
						'family' : 'Default',
						'weight' : '400'
					};
				}

				font.val( value.family );
				font.trigger( 'change' );

				if ( weight.find( 'option[value=' + value.weight + ']' ).length ) {
					weight.val( value.weight );
				}
			}
		},

		/**
		 * Renders the correct weights list for a respective font.
		 *
		 * @since  1.6.3
		 * @acces  private
		 * @method _getFontWeights
		 * @param  {Object} currentFont The font field element.
		 */
		_getFontWeights: function( currentFont ){
			var selectWeight = currentFont.closest( '.fl-font-field' ).find( '.fl-font-field-weight' ),
				font         = currentFont.val(),
				weight 	 	 = selectWeight.val(),
				weightMap    = FLBuilderConfig.FontWeights,
				weights      = {},
				recentList   = currentFont.closest( '.fl-font-field' ).find( '.recent-fonts option' )

			selectWeight.html( '' );

			if( recentList.length > 0 ) {
				var exists = $(recentList)
					.filter(function (i, o) { return o.value === font; })
					.length > 0;

				if ( false === exists && 'Default' !== font ) {
						currentFont.closest( '.fl-font-field' ).find( '.recent-fonts' ).append( $('<option>', {
							value: font,
							text: font
						}));
				}
			}


			if ( 'undefined' != typeof FLBuilderFontFamilies.system[ font ] ) {
				weights = FLBuilderFontFamilies.system[ font ].weights;
			} else if ( 'undefined' != typeof FLBuilderFontFamilies.google[ font ] ) {
				weights = FLBuilderFontFamilies.google[ font ];
			} else {
				weights = FLBuilderFontFamilies.default[ font ];
			}

			$.each( weights, function( key, value ){
				var selected = weight === value ? ' selected' : '';
				selectWeight.append( '<option value="' + value + '"' + selected + '>' + weightMap[ value ] + '</option>' );
			} );
		},

		/* Editor Fields
		----------------------------------------------------------*/

		/**
		 * InitializeS TinyMCE when the builder is first loaded.
		 *
		 * @since  2.0
		 * @access private
		 * @method _initEditorFields
		 */
		_initTinyMCE: function()
		{
			if ( typeof tinymce === 'object' && typeof tinymce.ui.FloatPanel !== 'undefined' ) {
				tinymce.ui.FloatPanel.zIndex = 100100; // Fix zIndex issue in wp 4.8.1
			}

			$( '.fl-builder-hidden-editor', window.parent.document ).each( function() {
				FLBuilder._initEditorField.call( this, window.parent );
			} );

			if ( FLBuilder.UIIFrame.isEnabled() ) {
				$( '.fl-builder-hidden-editor' ).each( function() {
					FLBuilder._initEditorField.call( this, window );
				} );
			}

			if ( 'undefined' !== typeof window.parent.acf ) {
				window.parent.acf.add_filter( 'wysiwyg_tinymce_settings', function( mceInit, id ) {
					return $.extend( {}, tinyMCEPreInit.mceInit.flbuildereditor, mceInit );
				} )
			}
		},

		/**
		 * Initialize all TinyMCE editor fields.
		 *
		 * @since  1.10
		 * @access private
		 * @method _initEditorFields
		 */
		_initEditorFields: function()
		{
			$( '.fl-builder-settings:visible .fl-editor-field', window.parent.document )
				.each( function() {
					FLBuilder._initEditorField.call( this, window.parent );
				} );
		},

		/**
		 * Initialize a single TinyMCE editor field.
		 *
		 * @since 2.0
		 * @method _initEditorField
		 * @param {Object} The window object to init on.
		 */
		_initEditorField: function( win )
		{
			var field	 = $( this ),
				textarea = field.find( 'textarea' ),
				name 	 = field.attr( 'data-name' ),
				editorId = 'flrich' + new Date().getTime() + '_' + name,
				html 	 = FLBuilderConfig.wp_editor,
				config	 = win.tinyMCEPreInit,
				buttons  = Number( field.attr( 'data-buttons' ) ),
				rows  	 = field.attr( 'data-rows' ),
				init     = null,
				wrap     = null;

			html = html.replace( /flbuildereditor/g , editorId );
			config = FLBuilder._jsonParse( JSON.stringify( config ).replace( /flbuildereditor/g , editorId ) );
			config = JSONfn.parse( JSONfn.stringify( config ).replace( /flbuildereditor/g , editorId ) );

			textarea.after( html ).remove();
			$( 'textarea#' + editorId, win.document ).val( textarea.val() )

			if ( undefined !== typeof win.tinymce && undefined !== config.mceInit[ editorId ] ) {

				init = config.mceInit[ editorId ];

				init.setup = function (editor) {
					editor.on('SaveContent', function (e) {
						e.content = e.content.replace(/<a href="(\.\.\/){1,2}/g, '<a href="' + FLBuilderConfig.homeUrl + '/' );
						e.content = e.content.replace(/src="(\.\.\/){1,2}/g, 'src="' + FLBuilderConfig.homeUrl + '/' );
					});
				}

				wrap = $( '#wp-' + editorId + '-wrap', win.document );
				wrap.find( 'textarea' ).attr( 'rows', rows );
				wrap.find( 'textarea' ).attr( 'contentEditable', true );

				if ( ! buttons ) {
					wrap.find( '.wp-media-buttons' ).remove();
				}

				if ( ( wrap.hasClass( 'tmce-active' ) || ! config.qtInit.hasOwnProperty( editorId ) ) && ! init.wp_skip_init ) {
					win.tinymce.init( init );
				}
			}

			if ( undefined !== typeof win.quicktags ) {
				win.quicktags( config.qtInit[ editorId ] );
			}

			win.wpActiveEditor = editorId;
		},

		/**
		 * Reinitialize all TinyMCE editor fields.
		 *
		 * @since  2.0
		 * @access private
		 * @method _reinitEditorFields
		 */
		_reinitEditorFields: function()
		{
			if ( ! $( '.fl-lightbox-resizable:visible', window.parent.document ).length ) {
				return;
			}

			// Do this on a timeout so TinyMCE doesn't hold up other operations.
			setTimeout( function() {

				var i, id;

				if ( 'undefined' === typeof window.parent.tinymce ) {
					return;
				}

				for ( i = window.parent.tinymce.editors.length - 1; i > -1 ; i-- ) {
					if ( ! window.parent.tinymce.editors[ i ].inline ) {
						id = window.parent.tinymce.editors[ i ].id;
						window.parent.tinyMCE.execCommand( 'mceRemoveEditor', true, id );
						window.parent.tinyMCE.execCommand( 'mceAddEditor', true, id );
					}
				}

				if ( FLBuilder.preview ) {
					var fields = $( '.fl-field[data-type="editor"]', window.parent.document );
					FLBuilder.preview._initDefaultFieldPreviews( fields );
				}

			}, 1 );
		},

		/**
		 * Destroy all TinyMCE editors.
		 *
		 * @since 1.10.8
		 * @method _destroyEditorFields
		 */
		_destroyEditorFields: function()
		{
			var i, id;

			if ( 'undefined' === typeof window.parent.tinymce ) {
				return;
			}

			for ( i = window.parent.tinymce.editors.length - 1; i > -1 ; i-- ) {
				if ( ! window.parent.tinymce.editors[ i ].inline ) {
					window.parent.tinyMCE.execCommand( 'mceRemoveEditor', true, window.parent.tinymce.editors[ i ].id );
				}
			}

			$( '.wplink-autocomplete', window.parent.document ).remove();
			$( '.ui-helper-hidden-accessible', window.parent.document ).remove();
		},

		/**
		 * Updates all editor fields within a settings form.
		 *
		 * @since 1.0
		 * @access private
		 * @method _updateEditorFields
		 */
		_updateEditorFields: function()
		{
			var wpEditors = $('.fl-builder-settings:visible textarea.wp-editor-area', window.parent.document);

			wpEditors.each(FLBuilder._updateEditorField);
		},

		/**
		 * Updates a single editor field within a settings form.
		 * Creates a hidden textarea with the editor content so
		 * this field can be saved.
		 *
		 * @since 1.0
		 * @access private
		 * @method _updateEditorField
		 */
		_updateEditorField: function()
		{
			var textarea  = $( this ),
				field     = textarea.closest( '.fl-editor-field' ),
				form      = textarea.closest( '.fl-builder-settings' ),
				wrap      = textarea.closest( '.wp-editor-wrap' ),
				id        = textarea.attr( 'id' ),
				setting   = field.attr( 'data-name' ),
				editor    = typeof window.parent.tinymce == 'undefined' ? false : window.parent.tinymce.get( id ),
				hidden    = textarea.siblings( 'textarea[name="' + setting + '"]' ),
				wpautop   = field.data( 'wpautop' );

			// Add a hidden textarea if we don't have one.
			if ( 0 === hidden.length ) {
				hidden = $( '<textarea name="' + setting + '"></textarea>', window.parent.document ).hide();
				textarea.after( hidden );
			}

			// Save editor content.
			if ( wpautop ) {

				if ( editor && wrap.hasClass( 'tmce-active' ) ) {
					hidden.val( editor.getContent() );
				}
				else if ( 'undefined' != typeof window.parent.switchEditors ) {
					hidden.val( window.parent.switchEditors.wpautop( textarea.val() ) );
				}
				else {
					hidden.val( textarea.val() );
				}
			}
			else {

				if ( editor && wrap.hasClass( 'tmce-active' ) ) {
					editor.save();
				}

				hidden.val( textarea.val() );
			}
		},

		/* Loop Settings Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all post type fields in a settings form.
		 *
		 * @since  2.6
		 * @access private
		 * @method _initPostTypeFields
		 */
		_initPostTypeFields: function(){
			$('.fl-builder-settings:visible #fl-field-post_type').each( FLBuilder._initPostTypeField );
		},

		/**
		 * @since 2.6
		 */
		_initPostTypeField: function() {
			var wrap   = $( this ),
			postType = wrap.find('select');
			if ( FLBuilderConfig.select2Enabled ) {
				postType.select2({width:'50%'});
			}
		},

		/**
		 * Callback for the data source of loop settings changes.
		 *
		 * @since 1.10
		 * @access private
		 * @method _loopDataSourceChange
		 */
		_loopDataSourceChange: function()
		{
			var val = $( this ).val();

			$('.fl-loop-data-source', window.parent.document).hide();
			$('.fl-loop-data-source[data-source="' + val + '"]', window.parent.document).show();
		},

		/**
		 * Callback for when the post types of a custom query changes.
		 *
		 * @since 2.6.2
		 * @access private
		 * @method _customQueryPostTypesChange
		 */
		_customQueryPostTypesChange: function()
		{
			var postTypes = $(this).val();
			$('.fl-custom-query-filter').hide();
			for ( val of postTypes ) {
				$('.fl-custom-query-' + val + '-filter').show();
			}
		},

		/**
		 * Callback for when the post type of a custom query changes.
		 *
		 * @since 1.2.3
		 * @access private
		 * @method _customQueryPostTypeChange
		 */
		_customQueryPostTypeChange: function()
		{
			var val = $(this).val();

			$('.fl-custom-query-filter', window.parent.document).hide();
			$('.fl-custom-query-' + val + '-filter', window.parent.document).show();
		},

		/* Ordering Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all ordering fields in a settings form.
		 *
		 * @since  1.10
		 * @access private
		 * @method _initOrderingFields
		 */
		_initOrderingFields: function()
		{
			$( '.fl-builder-settings:visible .fl-ordering-field-options', window.parent.document )
				.each( FLBuilder._initOrderingField );
		},

		/**
		 * Initializes a single ordering field in a settings form.
		 *
		 * @since  1.10
		 * @access private
		 * @method _initOrderingField
		 */
		_initOrderingField: function()
		{
			$( this ).sortable( {
				items: '.fl-ordering-field-option',
				containment: 'parent',
				tolerance: 'pointer',
				stop: FLBuilder._updateOrderingField
			} );
		},

		/**
		 * Updates an ordering field when dragging stops.
		 *
		 * @since  1.10
		 * @access private
		 * @method _updateOrderingField
		 * @param {Object} e The event object.
		 */
		_updateOrderingField: function( e )
		{
			var options = $( e.target ),
				input   = options.siblings( 'input[type=hidden]' ),
				value   = [];

			options.find( '.fl-ordering-field-option' ).each( function() {
				value.push( $( this ).attr( 'data-key' ) );
			} );

			input.val( JSON.stringify( value ) ).trigger( 'change' );
		},

		/* Text Fields - Add Predefined Value Selector
		----------------------------------------------------------*/

		/**
		 * Callback for when "add value" selectors for text fields changes.
		 *
		 * @since  1.6.5
		 * @access private
		 * @method _textFieldAddValueSelectChange
		 */
		_textFieldAddValueSelectChange: function()
		{
			var dropdown     = $( this ),
			    textField    = $( 'input[name="' + dropdown.data( 'target' ) + '"]', window.parent.document ),
			    currentValue = textField.val(),
			    addingValue  = dropdown.val(),
			    newValue     = '';

			// Adding selected value to target text field only once
			if ( -1 == currentValue.indexOf( addingValue ) ) {

				newValue = ( currentValue.trim() + ' ' + addingValue.trim() ).trim();

				textField
					.val( newValue )
					.trigger( 'change' )
					.trigger( 'keyup' );
			}

			// Resetting the selector
			dropdown.val( '' );
		},

		/* Number Fields
		----------------------------------------------------------*/

		/**
		 * @since  2.0
		 * @access private
		 * @method _onNumberFieldFocus
		 */
		_onNumberFieldFocus: function(e) {
			var $input = $(e.currentTarget);
			$input.addClass('mousetrap');

			Mousetrap.bind('up', function() {
				$input.attr('step', 1);
			});
			Mousetrap.bind('down', function() {
				$input.attr('step', 1);
			});
			Mousetrap.bind('shift+up', function() {
				$input.attr('step', 10);
			});
			Mousetrap.bind('shift+down', function() {
				$input.attr('step', 10);
			});
		},

		/**
		 * @since  2.0
		 * @access private
		 * @method _onNumberFieldBlur
		 */
		_onNumberFieldBlur: function(e) {
			var $input = $(e.currentTarget);
			$input.attr('step', 'any').removeClass('mousetrap');
		},

		/* Timezone Fields
		----------------------------------------------------------*/

		/**
		 * @since  2.0
		 * @access private
		 * @method _initTimezoneFields
		 */
		_initTimezoneFields: function() {
			$( '.fl-builder-settings:visible .fl-field[data-type=timezone]', window.parent.document )
				.each( FLBuilder._initTimezoneField );
		},

		/**
		 * @since  2.0
		 * @access private
		 * @method _initTimezoneField
		 */
		_initTimezoneField: function() {
			var select = $( this ).find( 'select' ),
				value  = select.attr( 'data-value' );

			select.find( 'option[value="' + value + '"]' ).prop('selected', true);
		},

		/* Dimension Fields
		----------------------------------------------------------*/

		/**
		 * Initializes all dimension fields in a form.
		 *
		 * @since  2.2
		 * @access private
		 * @method _initDimensionFields
		 */
		_initDimensionFields: function() {
			var form = $( '.fl-builder-settings:visible', window.parent.document );

			form.find( '.fl-field[data-type=dimension]' ).each( FLBuilder._initDimensionField );
			form.find( '.fl-dimension-field-link' ).on( 'click', FLBuilder._dimensionFieldLinkClicked );
			FLBuilder.addHook( 'responsive-editing-switched', this._initResponsiveDimensionFieldLinking );

			form.find( '.fl-compound-field-setting' ).has( '.fl-dimension-field-link' ).each( FLBuilder._initDimensionFieldLinking );
		},

		/**
		 * Initializes a single dimension field.
		 *
		 * @since  2.2
		 * @access private
		 * @method _initDimensionField
		 */
		_initDimensionField: function() {
			var field = $( this ),
				label = field.find( '.fl-field-label label' ),
				wrap = field.find( '.fl-field-control-wrapper' ),
				icon = '<i class="fl-dimension-field-link fl-tip dashicons dashicons-admin-links" title="Link Values"></i>';

			label.append( icon );
			wrap.prepend( icon );

			FLBuilder._initTipTips();
			FLBuilder._initDimensionFieldLinking.apply( this );
		},

		/**
		 * Initializes input linking for a dimension field by
		 * linking inputs if they all have the same value.
		 *
		 * @since  2.2
		 * @access private
		 * @method _initDimensionFieldLinking
		 */
		_initDimensionFieldLinking: function() {
			var field = $( this ),
				icon = field.find( '.fl-dimension-field-link' ),
				inputs = FLBuilder._getDimensionFieldLinkingInputs( field ),
				equal = FLBuilder._dimensionFieldInputsAreEqual( inputs );

			if ( equal ) {
				icon.removeClass( 'dashicons-admin-links' );
				icon.addClass( 'dashicons-editor-unlink' );
				inputs.off( 'input', FLBuilder._dimensionFieldLinkedValueChange );
				inputs.on( 'input', FLBuilder._dimensionFieldLinkedValueChange );
			} else {
				icon.addClass( 'dashicons-admin-links' );
				icon.removeClass( 'dashicons-editor-unlink' );
			}
		},

		/**
		 * Initializes input linking for responsive dimension fields
		 * when the responsive mode is switched.
		 *
		 * @since  2.2
		 * @access private
		 * @method _initDimensionFieldLinking
		 */
		_initResponsiveDimensionFieldLinking: function() {
			var form = $( '.fl-builder-settings:visible', window.parent.document );
			form.find( '.fl-field[data-type=dimension]' ).each( FLBuilder._initDimensionFieldLinking );
		},

		/**
		 * Handles logic for when dimension fields are linked
		 * or unlinked from each other.
		 *
		 * @since  2.2
		 * @access private
		 * @method _dimensionFieldLinkClicked
		 */
		_dimensionFieldLinkClicked: function() {
			var target = $( this ),
				compound = target.closest( '.fl-compound-field-setting' ),
				field = compound.length ? compound : target.closest( '.fl-field' ),
				icon = field.find( '.fl-dimension-field-link' ),
				linked = icon.hasClass( 'dashicons-editor-unlink' ),
				inputs = FLBuilder._getDimensionFieldLinkingInputs( field );

			icon.toggleClass( 'dashicons-admin-links' );
			icon.toggleClass( 'dashicons-editor-unlink' );

			if ( linked ) {
				inputs.off( 'input', FLBuilder._dimensionFieldLinkedValueChange );
			} else {
				inputs.val( inputs.eq( 0 ).val() ).trigger( 'input' );
				inputs.on( 'input', FLBuilder._dimensionFieldLinkedValueChange );
			}
		},

		/**
		 * Updates dimension inputs when a linked input changes.
		 *
		 * @since  2.2
		 * @access private
		 * @method _dimensionFieldLinkedValueChange
		 */
		_dimensionFieldLinkedValueChange: function() {
			var input = $( this ),
				name = input.attr( 'name' ),
				wrap = input.closest( '.fl-dimension-field-units' ),
				inputs = wrap.find( 'input:not([name="' + name + '"])' );

			inputs.off( 'input', FLBuilder._dimensionFieldLinkedValueChange );
			inputs.val( input.val() ).trigger( 'input' );
			inputs.on( 'input', FLBuilder._dimensionFieldLinkedValueChange );
		},

		/**
		 * Returns the inputs for dimension field linking. If this field
		 * is responsive, then only returns inputs for the current mode.
		 *
		 * @since  2.2
		 * @access private
		 * @method _getDimensionFieldLinkingInputs
		 * @param {Object} field
		 * @return {Object}
		 */
		_getDimensionFieldLinkingInputs: function( field ) {
			var responsive = field.find( '.fl-field-responsive-setting' ).length ? true : false,
				mode = FLBuilderResponsiveEditing._mode,
				inputs = null;

			if ( responsive ) {
				inputs = field.find( '.fl-field-responsive-setting-' + mode + ' input' );
			} else {
				inputs = field.find( '.fl-dimension-field-unit input' );
			}

			return inputs;
		},

		/**
		 * Checks to see if all inputs for a dimension field have
		 * the same value or not.
		 *
		 * @since  2.2
		 * @access private
		 * @method _dimensionFieldInputsAreEqual
		 * @param {Object} inputs
		 * @return {Boolean}
		 */
		_dimensionFieldInputsAreEqual: function( inputs ) {
			var first = inputs.eq( 0 ).val();

			if ( '' === first ) {
				return false;
			}

			for ( var i = 1; i < 4; i++ ) {
				if ( inputs.eq( i ).val() !== first ) {
					return false;
				}
			}

			return true;
		},

		/* Field Popup Sliders
		----------------------------------------------------------*/

		/**
		 * Initializes unit and dimension field popup slider controls.
		 *
		 * @since  2.2
		 * @access private
		 * @method _initFieldPopupSliders
		 */
		_initFieldPopupSliders: function() {
			var form = $( '.fl-builder-settings:visible', window.parent.document ),
				sliders = form.find( '.fl-field-popup-slider' );

			sliders.each( FLBuilder._initFieldPopupSlider );
		},

		/**
		 * Initializes a single popup slider control.
		 *
		 * @since  2.2
		 * @access private
		 * @method _initFieldPopupSlider
		 */
		_initFieldPopupSlider: function() {
			var body = $( 'body', window.parent.document ),
				wrapper = $( this ),
				slider = wrapper.find( '.fl-field-popup-slider-input' ),
				arrow = wrapper.find( '.fl-field-popup-slider-arrow' ),
				name = wrapper.data( 'input' ),
				input = $( 'input[name="' + name + '"]', window.parent.document );

			input.on( 'click', function() {

				if ( ! slider.hasClass( 'fl-field-popup-slider-init' ) ) {
					slider.slider( {
						value: input.val(),
						slide: function( e, ui ) {
							input.val( ui.value ).trigger( 'input' );
						},
					} );

					input.on( 'input', function() {
						slider.slider( 'value', $( this ).val() );
					} );

					slider.addClass( 'fl-field-popup-slider-init' );
					slider.find( '.ui-slider-handle' ).removeAttr( 'tabindex' );
				}

				FLBuilder._setFieldPopupSliderMinMax( slider );
				FLBuilder._hideFieldPopupSliders();
				body.on( 'mousedown', FLBuilder._hideFieldPopupSliders );
				input.addClass( 'fl-field-popup-slider-focus' );
				wrapper.show();

				var tab = $( '.fl-builder-settings:visible .fl-builder-settings-tab.fl-active', window.parent.document ),
					tabOffset = tab.offset(),
					inputOffset = input.offset(),
					inputWidth = input.width(),
					wrapperOffset = wrapper.offset();

				if ( wrapperOffset.top + wrapper.outerHeight() > tabOffset.top + tab.outerHeight() ) {
					wrapper.addClass( 'fl-field-popup-slider-top' );
				}

				arrow.css( 'left', ( 2 + inputOffset.left - wrapperOffset.left + inputWidth / 2 ) + 'px' );
			} );

			input.on( 'focus', function() {
				FLBuilder._hideFieldPopupSliders();
			} );
		},

		/**
		 * Hides all single slider controls.
		 *
		 * @since  2.2
		 * @access private
		 * @param {Object} e
		 * @method _hideFieldPopupSliders
		 */
		_hideFieldPopupSliders: function( e ) {
			var target = e ? $( e.target ) : null,
				body = $( 'body', window.parent.document ),
				sliders = $( '.fl-field-popup-slider:visible', window.parent.document ),
				inputs = $( '.fl-field-popup-slider-focus', window.parent.document );

			if ( target ) {
				if ( target.closest( '.fl-field-popup-slider' ).length ) {
					return;
				} else if ( target.closest( '.fl-field-popup-slider-focus' ).length ) {
					return;
				}
			}

			body.off( 'mousedown', FLBuilder._hideFieldPopupSliders );
			inputs.removeClass( 'fl-field-popup-slider-focus' );
			sliders.hide();
		},

		/**
		 * Sets the min/max/step config for a popup slider.
		 *
		 * @since  2.2
		 * @access private
		 * @method _setFieldPopupSliderMinMax
		 * @param {Object} slider
		 */
		_setFieldPopupSliderMinMax: function( slider ) {
			var wrapper = slider.parent(),
				parent = wrapper.parent().parent(),
				select = parent.find( 'select.fl-field-unit-select' ),
				unit = select.val(),
				data = wrapper.data( 'slider' ),
				min = 0,
				max = 100,
				step = 1;

			if ( '' === unit || 'em' === unit || 'rem' === unit ) {
				max = 10;
				step = .1;
			}

			if ( 'object' === typeof data ) {
				min = data.min ? parseFloat( data.min ) : min;
				max = data.max ? parseFloat( data.max ) : max;
				step = data.step ? parseFloat( data.step ) : step;

				if ( select.length && data[ unit ] ) {
					min = data[ unit ].min ? parseFloat( data[ unit ].min ) : min;
					max = data[ unit ].max ? parseFloat( data[ unit ].max ) : max;
					step = data[ unit ].step ? parseFloat( data[ unit ].step ) : step;
				}
			}

			slider.slider( {
				min: min,
				max: max,
				step: step,
			} );
		},


		/* Preset Fields
		---------------------------------------------------- */
		_initPresetFields: function() {
			var form = $( '.fl-builder-settings:visible', window.parent.document ),
				fields = form.find( '.fl-preset-select-controls' );

			fields.each( FLBuilder._initPresetField );
		},

		_initPresetField: function() {
			var field = $( this ),
				select = field.find('select'),
				presetType = field.data('presets'),
				prefix = field.data('prefix');

			select.on( 'change', FLBuilder._setFormPreset.bind( this, presetType, prefix ) );
		},

		_setFormPreset: function( type, prefix, e ) {
			var value = $( e.currentTarget ).val();
				presetLists = FLBuilderConfig.presets,
				presets = presetLists[type],
				form = $( '.fl-builder-settings:visible', window.parent.document );

			if ( 'undefined' !== presets && 'undefined' !== presets[value] ) {
				var settings = presets[value].settings;

				for( var name in settings ) {
					var value = settings[name],
						input;
					if ( 'undefined' !== typeof prefix && '' !== prefix ) {
						// Prefix setting name
						input = form.find('[name="' + prefix + name + '"]');
					} else {
						input = form.find('[name="' + name + '"]');
					}
					input.val(value).trigger('change').trigger('input');
				}
			}
		},


		/* AJAX
		----------------------------------------------------------*/

		/**
		 * Frontend AJAX for the builder interface.
		 *
		 * @since 1.0
		 * @method ajax
		 * @param {Object} data The data for the AJAX request.
		 * @param {Function} callback A function to call when the request completes.
		 */
		ajax: function(data, callback)
		{
			var prop;

			// Queue this request if one is already in progress.
			if ( FLBuilder._ajaxRequest ) {
				FLBuilder._ajaxQueue.push( {
					data: data,
					callback: callback,
				} );
				return;
			}

			FLBuilder.triggerHook('didBeginAJAX', data );

			// Undefined props don't get sent to the server, so make them null.
			for ( prop in data ) {
				if ( 'undefined' == typeof data[ prop ] ) {
					data[ prop ] = null;
				}
			}

			// Add the ajax nonce to the data.
			data._wpnonce = FLBuilderConfig.ajaxNonce;

			// Send the post id to the server.
			data.post_id = FLBuilderConfig.postId;

			// Tell the server that the builder is active.
			data.fl_builder = 1;

			data.safemode = FLBuilderConfig.safemode

			// Append the builder namespace to the action.
			data.fl_action = data.action;

			// Prevent ModSecurity false positives if our fix is enabled.
			if ( 'undefined' != typeof data.settings ) {
				data.settings = FLBuilder._ajaxModSecFix( $.extend( true, {}, data.settings ) );
				data.settings = FLBuilder._inputVarsCheck( data.settings );
			}
			if ( 'undefined' != typeof data.node_settings ) {
				data.node_settings = FLBuilder._ajaxModSecFix( $.extend( true, {}, data.node_settings ) );
				data.node_settings = FLBuilder._inputVarsCheck( data.node_settings );
			}

			if ( 'undefined' != typeof data.node_preview ) {
				data.node_preview = FLBuilder._ajaxModSecFix( $.extend( true, {}, data.node_preview ) );
				data.node_preview = FLBuilder._inputVarsCheck( data.node_preview );
			}

			if ( 'error' === data.settings || 'error' === data.node_settings || 'error' === data.node_preview ) {
				return 0;
			}

			// Store the data in a single variable to avoid conflicts.
			data = { fl_builder_data: data };

			// Do the ajax call.
			FLBuilder._ajaxRequest = $.post(FLBuilder._ajaxUrl(), data, function(response) {
				if(typeof callback !== 'undefined') {
					callback.call(this, response);
				}

				FLBuilder.triggerHook('didCompleteAJAX', data );

			})
			.always( FLBuilder._ajaxComplete )
			.fail( function( xhr, status, error ){
				msg = false;
				switch(xhr.status) {
					case 403:
					case 409:
					case 418: // Dreamhost trying to be funny
						msg  = 'Something you entered has triggered a ' + xhr.status + ' error.<br /><br />This is nearly always due to mod_security settings from your hosting provider.'
						if ( ! window.crash_vars.white_label ) {
							msg += '<br /><br />See this <a target="_blank" style="color: #428bca;font-size:inherit" href="https://docs.wpbeaverbuilder.com/beaver-builder/troubleshooting/common-issues/403-forbidden-or-blocked-error">Knowledge Base</a> article for more info.</br />'
						}
					break;
				}
				if ( msg ) {
					console.log(xhr)
					console.log(error)
					FLBuilder.alert(msg)
				}
			})


			return FLBuilder._ajaxRequest;
		},

		_inputVarsCheck: function( o ) {

			let maxInput = FLBuilderConfig.MaxInputVars || 0;
			let debug    = FLBuilderConfig.debug || false;
			let data     = JSON.stringify(o).match(/[^\\]":/g) || {};
			let count    = data.length;

			if ( 'undefined' != typeof count ) {
				if ( debug ) {
					console.log('Debug: Input Vars ' + count + '/' + maxInput );
				}
				if ( count > maxInput ) {
					FLBuilder.alert( '<h1 style="font-size:2em;text-align:center">Critical Issue</h1><br />The number of settings being saved (' + count + ') exceeds the PHP Max Input Vars setting (' + maxInput + ').<br />Please contact your host to have this value increased, the default is 1000.' );
					console.log( 'Vars Count: ' + count );
					console.log( 'Max Input: ' + maxInput );
					return 'error';
				}
			}
			return o;
		},

		/**
		 * Callback for when an AJAX request is complete.
		 *
		 * @since 1.0
		 * @access private
		 * @method _ajaxComplete
		 */
		_ajaxComplete: function()
		{
			FLBuilder._ajaxRequest = null;
			FLBuilder.hideAjaxLoader();

			if ( FLBuilder._ajaxQueue.length ) {
				var item = FLBuilder._ajaxQueue.shift();
				FLBuilder.ajax( item.data, item.callback );
			}
		},

		/**
		 * Returns a URL for an AJAX request.
		 *
		 * @since 1.0
		 * @access private
		 * @method _ajaxUrl
		 * @param {Object} params An object with key/value pairs for the AJAX query string.
		 * @return {String} The AJAX URL.
		 */
		_ajaxUrl: function(params)
		{
			var config  = FLBuilderConfig,
				url     = config.shortlink,
				param   = null;

			if(typeof params !== 'undefined') {

				for(param in params) {
					url += url.indexOf('?') > -1 ? '&' : '?';
					url += param + '=' + params[param];
				}
			}
			return url;
		},

		/**
		 * Shows the AJAX loading overlay.
		 *
		 * @since 1.0
		 * @method showAjaxLoader
		 */
		showAjaxLoader: function()
		{
			if( 0 === $( '.fl-builder-lightbox-loading', window.parent.document ).length ) {
				$( '.fl-builder-loading', window.parent.document ).show();
			}
		},

		/**
		 * Hides the AJAX loading overlay.
		 *
		 * @since 1.0
		 * @method hideAjaxLoader
		 */
		hideAjaxLoader: function()
		{
			$( '.fl-builder-loading', window.parent.document ).hide();
		},

		/**
		 * Fades a node when it is being loaded.
		 *
		 * @since 1.10
		 * @access private
		 * @param {String} nodeId
		 * @method _showNodeLoading
		 */
		_showNodeLoading: function( nodeId )
		{
			var node = $( '.fl-node-' + nodeId );

			node.addClass( 'fl-builder-node-loading' );

			FLBuilder._removeAllOverlays();
			FLBuilder.triggerHook( 'didStartNodeLoading', node );
		},

		/**
		 * Brings a node back to 100% opacity when it's done loading.
		 *
		 * @since 2.0
		 * @access private
		 * @param {String} nodeId
		 * @method _hideNodeLoading
		 */
		_hideNodeLoading: function( nodeId )
		{
			var node = $( '.fl-node-' + nodeId );

			node.removeClass( 'fl-builder-node-loading' );
		},

		/**
		 * Inserts a placeholder in place of where a node will be
		 * that is currently loading.
		 *
		 * @since 1.10
		 * @access private
		 * @param {Object} parent
		 * @param {Number} position
		 * @method _showNodeLoadingPlaceholder
		 */
		_showNodeLoadingPlaceholder: function( parent, position )
		{
			var placeholder = $( '<div class="fl-builder-node-loading-placeholder"></div>' );

			// Make sure we only have one placeholder at a time.
			$( '.fl-builder-node-loading-placeholder' ).remove();

			// Get sibling rows.
			if ( parent.hasClass( 'fl-builder-content' ) ) {
				siblings = parent.find( ' > .fl-row' );
			}
			// Get sibling column groups.
			else if ( parent.hasClass( 'fl-row-content' ) ) {
				siblings = parent.find( ' > .fl-col-group, > .fl-module' );
			}
			// Get sibling columns.
			else if ( parent.hasClass( 'fl-col-group' ) ) {
				parent.addClass( 'fl-col-group-has-child-loading' );
				siblings = parent.find( ' > .fl-col' );
			}
			// Get sibling modules.
			else {
				siblings = parent.find( ' > .fl-col-group, > .fl-module' );
			}

			// Add the placeholder.
			if ( 0 === siblings.length || siblings.length == position) {
				parent.append( placeholder );
			}
			else {
				siblings.eq( position ).before( placeholder );
			}
		},

		/**
		 * Removes the node loading placeholder for a node.
		 *
		 * @since 1.10
		 * @access private
		 * @param {Object} node
		 * @method _removeNodeLoadingPlaceholder
		 */
		_removeNodeLoadingPlaceholder: function( node )
		{
			var prev = node.prev( '.fl-builder-node-loading-placeholder' ),
				next = node.next( '.fl-builder-node-loading-placeholder' );

			if ( prev.length ) {
				prev.remove();
			} else {
				next.remove();
			}
		},

		/**
		 * Base64 encode settings to prevent ModSecurity false
		 * positives if our fix is enabled.
		 *
		 * @since 1.8.4
		 * @access private
		 * @method _ajaxModSecFix
		 */
		_ajaxModSecFix: function( settings )
		{
			var prop;

			if ( FLBuilderConfig.modSecFix && 'undefined' != typeof btoa ) {

				if ( 'string' == typeof settings ) {
					settings = FLBuilder._btoa( settings );
				}
				else {

					for ( prop in settings ) {
						type = typeof settings[ prop ]

						if ( 'string' == type || 'number' == type ) {
							settings[ prop ] = FLBuilder._btoa( settings[ prop ] );
						}
						else if( 'object' == type ) {
							settings[ prop ] = FLBuilder._ajaxModSecFix( settings[ prop ] );
						}
					}
				}
			}

			return settings;
		},

		/**
		 * Helper function for _ajaxModSecFix
		 * btoa() does not handle utf8/16 characters
		 * See: https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
		 *
		 * @since 1.10.7
		 * @access private
		 * @method _btoa
		 */
		_btoa: function(str) {
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
		},

		/**
		 * @since 1.10.8
		 * @access private
		 * @method _wpmedia_reset_errors
		 */
		_wpmedia_reset_errors: function() {
			$( '.upload-error', window.parent.document ).remove()
			$( '.media-uploader-status', window.parent.document ).removeClass( 'errors' ).hide()
		},

		/* Lightboxes
		----------------------------------------------------------*/

		/**
		 * Initializes the lightboxes for the builder interface.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initLightboxes
		 */
		_initLightboxes: function()
		{
			/* Main builder lightbox */
			FLBuilder._lightbox = new FLLightbox({
				className: 'fl-builder-lightbox fl-builder-settings-lightbox',
				resizable: true
			});

			FLBuilder._lightbox.on('resized', FLBuilder._calculateSettingsTabsOverflow);
			FLBuilder._lightbox.on('close', FLBuilder._lightboxClosed);
			FLBuilder._lightbox.on('beforeCloseLightbox', FLBuilder._destroyEditorFields);

			/* Actions lightbox */
			FLBuilder._actionsLightbox = new FLLightbox({
				className: 'fl-builder-actions-lightbox'
			});
		},

		/**
		 * Shows the settings lightbox.
		 *
		 * @since 1.0
		 * @access private
		 * @method _showLightbox
		 */
		_showLightbox: function( content )
		{
			if ( ! content ) {
				content = '<div class="fl-builder-lightbox-loading"></div>';
			}

			FLBuilder._lightbox.open( content );
			FLBuilder._initLightboxScrollbars();
		},

		/**
		 * Set the content for the settings lightbox.
		 *
		 * @since 1.0
		 * @access private
		 * @method _setLightboxContent
		 * @param {String} content The HTML content for the lightbox.
		 */
		_setLightboxContent: function(content)
		{
			FLBuilder._lightbox.setContent(content);
		},

		/**
		 * Initializes the scrollbars for the settings lightbox.
		 *
		 * @since 1.0
		 * @access private
		 * @method _initLightboxScrollbars
		 */
		_initLightboxScrollbars: function()
		{
			FLBuilder._initScrollbars();
			clearTimeout( FLBuilder._lightboxScrollbarTimeout );
			FLBuilder._lightboxScrollbarTimeout = setTimeout(FLBuilder._initLightboxScrollbars, 500);
		},

		/**
		 * Callback to clean things up when the settings lightbox
		 * is closed.
		 *
		 * @since 1.0
		 * @access private
		 * @method _lightboxClosed
		 */
		_lightboxClosed: function()
		{
			FL.Builder.data.getOutlinePanelActions().setActiveNode( false );
			FLBuilder.triggerHook( 'settings-lightbox-closed' );
			FLBuilder._lightbox.empty();
			clearTimeout( FLBuilder._lightboxScrollbarTimeout );
			FLBuilder._lightboxScrollbarTimeout = null;
		},

		/**
		 * Shows the actions lightbox.
		 *
		 * @since 1.0
		 * @access private
		 * @method _showActionsLightbox
		 * @param {Object} settings An object with settings for the lightbox buttons.
		 */
		_showActionsLightbox: function(settings)
		{
			var template = wp.template( 'fl-actions-lightbox' );

			// Allow extensions to modify the settings object.
			FLBuilder.triggerHook( 'actions-lightbox-settings', settings );

			// Open the lightbox.
			FLBuilder._actionsLightbox.open( template( settings ) );
		},

		/* Alert Lightboxes
		----------------------------------------------------------*/

		_checkEnv: function() {
			if ( 'svg' === FLBuilderConfig.fontAwesome ) {
				FLBuilder.alert( FLBuilderStrings.fontAwesome)
			}
		},
		/**
		 * Shows the alert lightbox with a message.
		 *
		 * @since 1.0
		 * @method alert
		 * @param {String} message The message to show.
		 */
		alert: function(message)
		{
			var alert = new FLLightbox({
					className: 'fl-builder-alert-lightbox',
					destroyOnClose: true
				}),
				template = wp.template( 'fl-alert-lightbox' );

			alert.open( template( { message : message } ) );
		},

		crashMessage: function(debug)
		{
			FLLightbox.closeAll();
			var alert = new FLLightbox({
					className: 'fl-builder-alert-lightbox fl-builder-crash-lightbox',
					destroyOnClose: true
				}),
				template  = wp.template( 'fl-crash-lightbox' ),
				product   = window.crash_vars.product,
				labeled   = window.crash_vars.white_label,
				label_txt = window.crash_vars.labeled_txt,
				info      = '';



				message  = product + ' ' + window.crash_vars.strings.intro;

				info    += "<h3 style='font-size:26px;line-height:26px;'>" + window.crash_vars.strings.try + "</h3>";
				info    += "<p>" + window.crash_vars.strings.troubleshoot + "</p>";
				info    += "<h3 style='font-size:22px;line-height:22px;padding-top:20px;border-top:1px solid black;'>" + window.crash_vars.strings.hand + "</h3>";
				info    += "<h3 style='font-size:18px;line-height:18px;'>" + window.crash_vars.strings.step_one + "</h3>";
				info    += "<p>" + window.crash_vars.strings.if_contact + "</p>";
				info     +="<div><div style='width:49%;float:left;'>"
				info     +="<p>MacOS Users:<br />Chrome: View > Developer > JavaScript Console<br />Firefox: Tools > Web Developer > Browser Console<br />Safari: Develop > Show JavaScript console</p>"
				info     +="</div>"

				info     +="<div style='width:49%;float:right;'>"
				info     +="<p>Windows Users:<br />Chrome: Settings > More Tools > Developer > Console<br />Firefox: Menu/Settings > Web Developer > Web Console<br />Edge: Settings and More > More Tools > Console</p>"
				info     +="</div></div>"

				info    += "<h3 style='font-size:18px;line-height:18px;display:inline-block'>" + window.crash_vars.strings.step_two + "</h3>";

				info     +="<p style='display:inline-block;'>" + window.crash_vars.strings.contact + "</p>"

				if ( FLBuilderConfig.MaxInputVars <= 3000 ) {
					info += '<br /><br />The PHP config value max_input_vars is only set to ' + FLBuilderConfig.MaxInputVars + '. If you are using 3rd party addons this could very likely be the cause of this error. [<a class="link" href="https://docs.wpbeaverbuilder.com/beaver-builder/troubleshooting/common-issues/exceeds-php-max-input-vars">doc link</a>].'
				}

				debug    = false
				if ( labeled ) {
					info = label_txt
				}
				alert.open( template( { message : message, info: info, debug: debug } ) );
		},

		/**
		 * Closes the alert lightbox when a child element is clicked.
		 *
		 * @since 1.0
		 * @access private
		 * @method _alertClose
		 */
		_alertClose: function()
		{
			FLLightbox.closeParent(this);
		},

		/**
		 * Shows the confirm lightbox with a message.
		 *
		 * @since 1.10
		 * @method confirm
		 * @param {Object} o The config object that overrides the defaults.
		 */
		confirm: function( o )
		{
			var defaults = {
					cssClass: '',
					message : '',
					ok      : function(){},
					cancel  : function(){},
					strings : {
						'ok'     : FLBuilderStrings.ok,
						'cancel' : FLBuilderStrings.cancel
					}
				},
				config = $.extend( {}, defaults, ( 'undefined' == typeof o ? {} : o ) )
				lightbox = new FLLightbox({
					className: 'fl-builder-confirm-lightbox fl-builder-alert-lightbox' + config.cssClass,
					destroyOnClose: true
				}),
				template = wp.template( 'fl-confirm-lightbox' );

			lightbox.open( template( config ) );
			lightbox._node.find( '.fl-builder-confirm-ok' ).on( 'click', config.ok );
			lightbox._node.find( '.fl-builder-confirm-cancel' ).on( 'click', config.cancel );
		},

		/* Simple JS hooks similar to WordPress PHP hooks.
		----------------------------------------------------------*/

		/**
		 * Trigger a hook.
		 *
		 * @since 1.8
		 * @method triggerHook
		 * @param {String} hook The hook to trigger.
		 * @param {Array} args An array of args to pass to the hook.
		 */
		triggerHook: function( hook, args )
		{
			$( 'body' ).trigger( 'fl-builder.' + hook, args );
		},

		/**
		 * Add a hook.
		 *
		 * @since 1.8
		 * @method addHook
		 * @param {String} hook The hook to add.
		 * @param {Function} callback A function to call when the hook is triggered.
		 */
		addHook: function( hook, callback )
		{
			$( 'body' ).on( 'fl-builder.' + hook, callback );
		},

		/**
		 * Remove a hook.
		 *
		 * @since 1.8
		 * @method removeHook
		 * @param {String} hook The hook to remove.
		 * @param {Function} callback The callback function to remove.
		 */
		removeHook: function( hook, callback )
		{
			$( 'body' ).off( 'fl-builder.' + hook, callback );
		},

		/* Console Logging
		----------------------------------------------------------*/

		/**
		 * Logs a message in the console if the console is available.
		 *
		 * @since 1.4.6
		 * @method log
		 * @param {String} message The message to log.
		 */
		log: function( message )
		{
			if ( 'undefined' == typeof window.console || 'undefined' == typeof window.console.log ) {
				return;
			}

			console.log( message );
		},

		/**
		 * Logs an error in the console if the console is available.
		 *
		 * @since 1.4.6
		 * @method logError
		 * @param {String} error The error to log.
		 */
		logError: function( error, data )
		{
			var message = null;

			if ( 'undefined' == typeof error ) {
				return;
			}
			else if ( 'undefined' != typeof error.stack ) {
				message = error.stack;
			}
			else if ( 'undefined' != typeof error.message ) {
				message = error.message;
			}

			if ( message ) {
				FLBuilder.log( '************************************************************************' );
				FLBuilder.log( FLBuilderStrings.errorMessage );
				FLBuilder.log( message );
				if ( 'undefined' != typeof data && data ) {
						FLBuilder.log( "Debug Info" );
						console.log( data );
				}
				// Show debug data in console.
				$.each( window.crash_vars.vars, function(i,t) {
					console.log(i + ': ' + t)
				})
				FLBuilder.log( '************************************************************************' );
				if ( 'undefined' != typeof data && data ) {
					message = data + "\n" + message
				}
				FLBuilder.crashMessage(message)
			}
		},

		/**
		 * Logs a global error in the console if the console is available.
		 *
		 * @since 1.4.6
		 * @method logGlobalError
		 * @param {String} message
		 * @param {String} file
		 * @param {String} line
		 * @param {String} col
		 * @param {String} error
		 */
		logGlobalError: function( message, file, line, col, error )
		{
			FLBuilder.log( '************************************************************************' );
			FLBuilder.log( FLBuilderStrings.errorMessage );
			FLBuilder.log( FLBuilderStrings.globalErrorMessage.replace( '{message}', message ).replace( '{line}', line ).replace( '{file}', file ) );

			if ( 'undefined' != typeof error && 'undefined' != typeof error.stack ) {
				FLBuilder.log( error.stack );
			}
			FLBuilder.log( '************************************************************************' );
		},

		/**
		 * Parse JSON with try/catch and print useful debug info on error.
		 * @since 2.2.2
		 * @param {string} data JSON data
		 */
		_jsonParse: function( data ) {
			try {
					data = JSON.parse( data );
					} catch (e) {
						FLBuilder.logError( e, FLBuilder._parseError( data ) );
					}
					return data;
		},

		/**
		 * Parse data for php error on 1st line.
		 * @since 2.2.2
		 * @param {string} data the JSON containing error(s)
		 */
		_parseError: function( data ) {
			if( data.indexOf('</head>') ) {
				return 'AJAX returned HTML page instead of data. (Possible 404 or max_input_vars)';
			}
			php = data.match(/^<.*/gm) || false;
			if ( php && php.length > 0 ) {
				var txt = '';
				$.each( php, function(i,t) {
					txt += t
				})
				return $(txt).text();
			}
			return false;
		},
		/**
		 * Helper taken from lodash
		 * @since 2.2.2
		 */
		isUndefined: function(obj) {
			return obj === void 0;
		},

		/**
		 * Helper taken from lodash
		 * @since 2.2.2
		 */
		isBoolean: function(value) {
			return value === true || value === false
		},

		/**
		 * Check if the operating system is set to dark mode.
		 *
		 * @since 2.6
		 * @return bool
		 */
		_isSystemColorSchemeDark: function() {
			return window.matchMedia && window.matchMedia( '( prefers-color-scheme: dark )' ).matches
		},

		/**
		 * Get the static color scheme value even if matching the operating system.
		 *
		 * @since 2.6
		 * @return string (light|dark)
		 */
		_getComputedColorScheme: function() {
			const colorScheme = FL.Builder.data.getSystemState().colorScheme
			if ( 'auto' === colorScheme ) {
				return FLBuilder._isSystemColorSchemeDark() ? 'dark' : 'light'
			}
			return colorScheme
		},

		/**
		 * Setup color scheme handling
		 *
		 * @since 2.6
		 * @param {string} key
		 * @param {any} data
		 * @return void
		 */
		_initColorScheme: function() {
			FLBuilder._setColorSchemeBodyClasses( FLBuilder._getComputedColorScheme() )

			// Listen for system color scheme changes
			window.matchMedia( '(prefers-color-scheme: dark)' )
				.addEventListener( 'change', FLBuilder._systemColorSchemeChanged )
		},

		/**
		 * Listen for changes to the operating system color scheme value.
		 *
		 * @since 2.6
		 * @param MediaQueryListEvent e
		 * @param {any} data
		 * @return void
		 */
		_systemColorSchemeChanged: function( e ) {
			const colorScheme = FL.Builder.data.getSystemState().colorScheme

			if ( 'auto' !== colorScheme ) {
				return
			}
			if ( e.matches ) {
				FLBuilder._setColorSchemeBodyClasses( 'dark' )
			} else {
				FLBuilder._setColorSchemeBodyClasses( 'light' )
			}
		},

		/**
		 * Add/Remove appropriate color scheme body classes.
		 *
		 * @since 2.6
		 * @param String name (light|dark|auto)
		 * @return void
		 */
		_setColorSchemeBodyClasses: function( name ) {
			const parentClasses = window.parent.document.body.classList
			const childClasses = document.body.classList
			let add = name

			// Handle 'auto' value
			if ( 'auto' === name ) {
				add = FLBuilder._getComputedColorScheme()
			}

			const remove = 'dark' === add ? 'light' : 'dark'

			parentClasses.remove( `fl-builder-ui-skin--${remove}`, `fluid-color-scheme-${remove}` );
			childClasses.remove( `fl-builder-ui-skin--${remove}`, `fluid-color-scheme-${remove}` );
			parentClasses.add( `fl-builder-ui-skin--${add}`, `fluid-color-scheme-${add}` );
			childClasses.add( `fl-builder-ui-skin--${add}`, `fluid-color-scheme-${add}` );
		},

		/**
		 * Get sandbox data.
		 * @since 2.6
		 * @param {string} data the JSON containing error(s)
		 */
		getSandbox: function (key) {
			if (key in this._sandbox) {
				return this._sandbox[key];
			}
			return false;
		},

		/**
		 * Set sandbox data.
		 * @since 2.6
		 * @param {string} key
		 * @param {any} data
		 * @return {void}
		 */
		setSandbox: function (key, data) {
			this._sandbox[key] = data;
		},

		/**
		 * Delete sandbox data.
		 * @since 2.6
		 * @param {string} key
		 * @param {any} data
		 * @return {void}
		 */
		deleteSandbox: function (key) {
			delete this._sandbox[key];
		},
	};

	/* Start the party!!! */
	$(function(){
		FLBuilder._init();
	});

})(jQuery);
