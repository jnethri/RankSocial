( function( $ ) {

	/**
	 * @since 2.6
	 * @class FLBuilderGlobalImportExport
	 */
	FLBuilderGlobalImportExport = {

		_settingsUploader: null,

		/**
		 * Initializes custom exports for the builder.
		 *
		 * @since 1.8
		 * @access private
		 * @method _init
		 */
		_init: function()
		{
			$('body').on( 'click', '#fl-import-export-form input.export', FLBuilderGlobalImportExport._exportClicked);
			$('body').on( 'click', '#fl-import-export-form input.import', FLBuilderGlobalImportExport._importClicked);
			$('body').on( 'click', '#fl-import-export-form input.reset', FLBuilderGlobalImportExport._resetClicked);
			FLBuilderGlobalImportExport.bindChecks();
		},

		_exportClicked: function() {

			nonce = $('#fl-import-export-form').find('#_wpnonce').val();

			data = {
				global_all: $('#fl-import-export-form input.global_all').prop('checked'),
				admin: $('#fl-import-export-form input.admin').prop('checked'),
				global: $('#fl-import-export-form input.global').prop('checked'),
				styles: $('#fl-import-export-form input.styles').prop('checked'),
				colors: $('#fl-import-export-form input.colors').prop('checked'),
			}

			// generate data file.
			FLBuilderGlobalImportExport.ajax( {
				action: 'export_global_settings',
				data: data,
				_wpnonce: nonce,
			}, function ( response ) {

				switch( response.success ) {
					case false:
						break;
					case true:
						data     = response.data;
						settings = data.settings;
						var filename = '';

						$.each( data.selected, function( e,i ) {
							if ( 'global_all' === e && 'true' === i ) {
								filename += 'all-';
								return false;
							}
							if ( 'true' === i ) {
								filename += e + '-';
							}
						});
						date  = new Date();
						day   = date.getDate();
						month = date.getMonth() + 1;
						year  = date.getFullYear();
						filename = 'bb-settings-' + filename + `${year}-${month}-${day}` + '.txt';
						var blob = new Blob( [settings], { type: "application/octetstream" } );

						//Check the Browser type and download the File.
						var isIE = false || !!document.documentMode;
						if (isIE) {
							 window.navigator.msSaveBlob(blob, filename);
						} else {
							 var url = window.URL || window.webkitURL;
							 link = url.createObjectURL(blob);
							 var a = $("<a />");
							 a.attr("download", filename);
							 a.attr("href", link);
							 $("body").append(a);
							 a[0].click();
							 $("body").remove(a);
						}
						break;
				}
			});
		},
		_importClicked: function() {
			if(FLBuilderGlobalImportExport._settingsUploader === null) {
				FLBuilderGlobalImportExport._settingsUploader = wp.media({
					title: 'Import Settings',
					button: { text: FLBuilderAdminImportExportConfig.select },
					library : { type : 'text/plain' },
					multiple: false
				});

				_wpPluploadSettings['defaults']['multipart_params']['fl_global_import']= 'json';

				FLBuilderGlobalImportExport._settingsUploader.on( 'select', function() {
					var selection = FLBuilderGlobalImportExport._settingsUploader.state().get('selection');
					var attachment_id = selection.map( function( attachment ) {
						attachment = attachment.toJSON();
						return attachment.id;
					}).join();

					txt = 'Are you sure you want to import settings?';

					if ( confirm( txt ) ) {
						FLBuilderGlobalImportExport._importSettings(attachment_id);
					}
				});
			}
			FLBuilderGlobalImportExport._settingsUploader.open();
		},
		_importSettings: function(attachment_id) {
			nonce = $('#fl-import-export-form').find('#_wpnonce').val();
			FLBuilderGlobalImportExport.ajax( {
				action: 'import_global_settings',
				_wpnonce: nonce,
				importid: attachment_id
			}, function ( response ) {
				switch( response.success ) {
					case false:
						if ( 'undefined' != typeof response.data ) {
							alert( response.data )
						} else {
							alert( 'Something went wrong' );
						}
						break;
					case true:
						alert( 'Success!');
						location.reload();
						break;
				};
			});
		},
		_resetClicked: function() {
			nonce = $('#fl-import-export-form').find('#_wpnonce').val();
			txt = 'Are you sure you want to reset all settings?';
			if ( confirm(txt) ) {
				FLBuilderGlobalImportExport.ajax( {
					action: 'reset_global_settings',
					_wpnonce: nonce,
				}, function ( response ) {
					switch( response.success ) {
						case false:
							alert( 'There was an error :(')
							break;
						case true:
							alert( 'Success!');
							location.reload();
							break;
					};
				});
			}
		},
		/**
		 * Makes an AJAX request.
		 *
		 * @since 1.0
		 * @method ajax
		 * @param {Object} data An object with data to send in the request.
		 * @param {Function} callback A function to call when the request is complete.
		 */
		ajax: function(data, callback) {
			// Send the request.
			$.post(ajaxurl, data, function(response) {
				if(typeof callback !== 'undefined') {
					callback.call(this, response);
				}
			});
		},
		bindChecks: function() {
			$('body').on( 'change', '#fl-import-export-form input.global_all', function(){
				checked = $(this).prop('checked')
				if ( ! checked ) {
					$('#fl-import-export-form .extra').fadeIn();
				} else {
					$('#fl-import-export-form .extra').fadeOut();
				}
			});
		}
	}
	$( FLBuilderGlobalImportExport._init );
} )( jQuery );
