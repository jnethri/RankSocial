<?php

if(!defined('ABSPATH')){
	die('Hacking Attempt!');
}


// HOOKS
add_action('admin_menu', 'loginizer_admin_menu');
//add_filter("plugin_action_links_plugin_loginizer", 'loginizer_plugin_action_links');


// Add settings link on plugin page
function loginizer_plugin_action_links($links) {
	
	if(!defined('LOGINIZER_PREMIUM')){
		 $links[] = '<a href="'.LOGINIZER_PRO_URL.'" style="color:#3db634;" target="_blank">'._x('Upgrade', 'Plugin action link label.', 'loginizer').'</a>';
	}

	$settings_link = '<a href="admin.php?page=loginizer">Settings</a>';	
	array_unshift($links, $settings_link); 
	
	return $links;
}

function loginizer_newsletter_subscribe(){
	
	$newsletter_dismiss = get_option('loginizer_dismiss_newsletter');
	
	if(!empty($newsletter_dismiss)){
		return;
	}
	
	$env['url'] = 'https://loginizer.com/';
	
	echo '
	<style>
	.newsletter_container{
		color: #000000;
		background: #FFFFFF;
		text-align:center;
	}
	.subscribe_form_row{
		color: #000000;
		padding-bottom:0px !important;
	}
	.subscribe_heading{
		font-size:22px;
	}
	</style>
				
	<div class="notice my-loginizer-dismiss-notice is-dismissible" style="background:#FFF;padding:15px; border: 1px solid #ccd0d4; width:80%;margin-left:0px;margin:auto;">
		<div class="container">
			<div class="col-md-6 col-md-offset-3 text-center newsletter_container">
				<h2 style="font-weight:100; margin-bottom:20px; margin-top:5px;" class="subscribe_heading">Subscribe to our Newsletter</h2>
				<form class="form-inline" action="" method="POST">
					<div class="row subscribe_form_row">
						<div class="col-md-12">
							<input type="email" name="email" size="40" id="subscribe_email" class="" placeholder="email@example.com" value="">&nbsp;
							<input type="button" name="subscribe" id="subscribe_button" class="button button-primary" value="Subscribe" onclick="loginizer_email_subscribe();" style="margin-top:0px;">
						</div>
						<div class="col-md-3">
						</div>
					</div>
				</form>
				<p><b>Note :</b> If a Loginizer account does not exist it will be created.</p>
			</div>
		</div>
	</div><br />
	
	<script type="text/javascript">
		function loginizer_dismiss_newsletter(){
	
			var data = new Object();
			data["action"] = "loginizer_dismiss_newsletter";
			data["nonce"]	= "'.wp_create_nonce('loginizer_admin_ajax').'";
			
			var admin_url = "'.admin_url().'"+"admin-ajax.php";
			jQuery.post(admin_url, data, function(response){
				
			});
			
		}
		
		function loginizer_email_subscribe(){
			var subs_location = "'.$env['url'].'?email="+encodeURIComponent(jQuery("#subscribe_email").val());
			window.open(subs_location, "_blank");
		}
		jQuery(document).on("click", ".my-loginizer-dismiss-notice .notice-dismiss", loginizer_dismiss_newsletter);
	</script>';
	
	return true;
}

function loginizer_backuply_promo(){
	
	$plugins = get_plugins();
	
	// Dont show Backuply Promo if its already installed
	if(array_key_exists('backuply-pro/backuply-pro.php', $plugins) || array_key_exists('backuply/backuply.php', $plugins)){
		return;
	}
	
	if(isset($_REQUEST['install_backuply'])){
		if(!wp_verify_nonce($_REQUEST['security'], 'loginizer_install_backuply') || !current_user_can('activate_plugins')){
			die('Only Admin can access it');
		}

		loginizer_backuply_install();
		return;
	}

	echo '<div class="notice is-dismissible lz-welcome-panel lz-backuply-dismissible" style="padding:20px; margin:0;">
			<table>
				<tr>
					<th width="25%">
						<img src="'.LOGINIZER_URL.'\assets\images\backuply-square.png" height="150px" width="150px"/>
					</th>
					<td width="75%">
						<div class="inside" style="margin-left: 20px;">
							<strong><i>'.__('Backups are the best form of security. Secure your WordPress site by creating backups with Backuply','loginizer').'</i>:</strong><br>
							<ul class="lz-right-ul">
								<li>'.__('Backup to remote locations like FTP, FTPS, SFTP, WebDAV, Google Drive, OneDrive, Dropbox, Amazon S3','loginizer').'</li>
								<li>'.__('Auto Backups','loginizer').'</li>
								<li>'.__('Easy One-Click restores','loginizer').'</li>
								<li>'.__('Stress Free Migrations','loginizer').'</li>
							</ul>
								<a class="button button-primary" href="'.esc_url(admin_url('admin.php?page=loginizer&install_backuply=1&security='.wp_create_nonce('loginizer_install_backuply'))).'">'.__('Install Backuply', 'loginizer').'</a>&nbsp;&nbsp;<a class="button button-secondary" target="_blank" href="https://wordpress.org/plugins/backuply/">'.__('Visit Backuply','loginizer').'</a>
						</div>
					</td>
				</tr>
			</table>
	</div><br />
	<script type="text/javascript">
		function loginizer_dismiss_backuply(){
	
			var data = new Object();
			data["action"] = "loginizer_dismiss_backuply";
			data["nonce"]	= "'.wp_create_nonce('loginizer_admin_ajax').'";
			
			var admin_url = "'.admin_url().'"+"admin-ajax.php";
			jQuery.post(admin_url, data, function(response){
				
			});
			
		}
	
		jQuery(document).on("click", ".lz-backuply-dismissible .notice-dismiss", loginizer_dismiss_backuply);
	</script>';
	
	return true;
}

function loginizer_csrf_promo(){

	echo '<div class="notice notice-success is-dismissible lz-csrf-dismissible"><p>Secure your WordPress site from CSRF attacks with our new feature <strong>CSRF Protection</strong> <a href="https://loginizer.com/docs/configuration-and-settings/how-to-enable-csrf-protection/" target="_blank" class="button button-primary">Read More</a></p></div>';
	
	echo'<script type="text/javascript">
		function loginizer_dismiss_csrf(){
	
			var data = new Object();
			data["action"] = "loginizer_dismiss_csrf";
			data["nonce"]	= "'.wp_create_nonce('loginizer_admin_ajax').'";
			
			var admin_url = "'.admin_url().'"+"admin-ajax.php";
			jQuery.post(admin_url, data, function(response){
				
			});
			
		}
	
		jQuery(document).on("click", ".lz-csrf-dismissible", loginizer_dismiss_csrf);
	</script>';
}

// Install Backuply
function loginizer_backuply_install(){
	
	// Include the necessary stuff
	include_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );

	// Includes necessary for Plugin_Upgrader and Plugin_Installer_Skin
	include_once( ABSPATH . 'wp-admin/includes/file.php' );
	include_once( ABSPATH . 'wp-admin/includes/misc.php' );
	include_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

	// Filter to prevent the activate text
	add_filter('install_plugin_complete_actions', 'loginizer_backuply_install_complete_actions', 10, 3);

	$upgrader = new Plugin_Upgrader( new Plugin_Installer_Skin() );
	$installed = $upgrader->install('https://downloads.wordpress.org/plugin/backuply.zip');
	
	if ( !is_wp_error( $installed ) && $installed ) {
		echo 'Activating Backuply !';
		$activate = activate_plugin('backuply/backuply.php');
		
		if ( is_null($activate) ) {
			echo '<div id="message" class="updated"><p>'. esc_html__('Done! Backuply is now installed and activated.', 'loginizer'). '</p></div><br /><br><br><b>'. esc_html__('Done! Backuply is now installed and activated.', 'loginizer').'</b>';
		}
	}
	
	return $installed;
}

// Prevent pro activate text for installer
function loginizer_backuply_install_complete_actions($install_actions, $api, $plugin_file){
	
	if($plugin_file == 'backuply/backuply.php'){
		return array();
	}
	
	return $install_actions;
}

// The Loginizer Theme footer
function loginizer_page_footer(){
	
	if(!loginizer_is_premium()){
		echo '<script>
		jQuery("[loginizer-premium-only]").each(function(index) {
			jQuery(this).find( "input, textarea, select" ).attr("disabled", true);
		});
		</script>';
	}
	
	echo '</td>
	<td width="200" valign="top" id="loginizer-right-bar">';
			
	if(!defined('SITEPAD')){
	
		if(!defined('LOGINIZER_PREMIUM')){
		
			echo '
		<div class="postbox" style="min-width:0px !important;">
			<div class="postbox-header">
				<h2 class="hndle ui-sortable-handle">
					<span>'.__('Premium Version','loginizer').'</span>
				</h2>
			</div>
			
			<div class="inside">
				<i>'.__('Upgrade to the premium version and get the following features','loginizer').' </i>:<br>
				<ul class="lz-right-ul">
					<li>'.__('PasswordLess Login','loginizer').'</li>
					<li>'.__('Two Factor Auth - Email','loginizer').'</li>
					<li>'.__('Two Factor Auth - App','loginizer').'</li>
					<li>'.__('Login Challenge Question','loginizer').'</li>
					<li>'.__('reCAPTCHA','loginizer').'</li>
					<li>'.__('Rename Login Page','loginizer').'</li>
					<li>'.__('Disable XML-RPC','loginizer').'</li>
					<li>'.__('And many more ...','loginizer').'</li>
				</ul>
				<center><a class="button button-primary" target="_blank" href="'.LOGINIZER_PRICING_URL.'">Upgrade</a></center>
			</div>
		</div>';
		
		}else{
	
			echo '
		<div class="postbox" style="min-width:0px !important;">
			<div class="postbox-header">
			<h2 class="hndle ui-sortable-handle">
				<span>'.__('Recommendations','loginizer').'</span>
			</h2>
			</div>
			<div class="inside">
				<i>'.__('We recommed that you enable atleast one of the following security features','loginizer').'</i>:<br>
				<ul class="lz-right-ul">
					<li>'.__('Rename Login Page','loginizer').'</li>
					<li>'.__('Login Challenge Question','loginizer').'</li>
					<li>'.__('reCAPTCHA','loginizer').'</li>
					<li>'.__('Two Factor Auth - Email','loginizer').'</li>
					<li>'.__('Two Factor Auth - App','loginizer').'</li>
					<li>'.__('Change \'admin\' Username','loginizer').'</li>
				</ul>
			</div>
		</div>';
		}
		
		echo '
		<div class="postbox" style="min-width:0px !important;">
			<div class="postbox-header">
			<h2 class="hndle ui-sortable-handle">
				<span><a target="_blank" href="https://backuply.com/?from=loginizer-plugin"><img src="'.LOGINIZER_URL.'/assets/images/backuply-black.png" width="100%" /></a></span>
			</h2>
			</div>
			<div class="inside">
				<i>'.__('Secure your WordPress site by creating backups with Backuply', 'loginizer').'</i>:<br>
				<ul class="lz-right-ul">
					<li>'.__('Remote Backup to 8 location','loginizer').'</li>
					<li>'.__('Auto Backups', 'loginizer').'</li>
					<li>'.__('Backup Rotation', 'loginizer').'</li>
					<li>'.__('One-Click Restore', 'loginizer').'</li>
					<li>'.__('Stress-free Migration', 'loginizer').'</li>
					<li>'.__('Backup to Google Drive', 'loginizer').'</li>
					<li>'.__('Backup to Amazon S3', 'loginizer').'</li>
					<li>'.__('Backup to Dropbox', 'loginizer').'</li>
					<li>'.__('Backup to FTP,FTPS and many more ...','loginizer').'</li>
				</ul>
				<center><a class="button button-primary" target="_blank" href="https://wordpress.org/plugins/backuply/">'.__('Visit Backuply','loginizer').'</a></center>
			</div>
		</div>';
		
		echo '
		<div class="postbox" style="min-width:0px !important;">
			<div class="postbox-header">
			<h2 class="hndle ui-sortable-handle">
				<span><a target="_blank" href="https://pagelayer.com/?from=loginizer-plugin"><img src="'.LOGINIZER_URL.'/assets/images/pagelayer_product.png" width="100%" /></a></span>
			</h2>
			</div>
			<div class="inside">
				<i>'.__('Easily manage and make professional pages and content with our Pagelayer builder','loginizer').'</i>:<br>
				<ul class="lz-right-ul">
					<li>'.__('30+ Free Widgets','loginizer').'</li>
					<li>'.__('60+ Premium Widgets','loginizer').'</li>
					<li>'.__('400+ Premium Sections','loginizer').'</li>
					<li>'.__('Theme Builder','loginizer').'</li>
					<li>'.__('WooCommerce Builder','loginizer').'</li>
					<li>'.__('Theme Creator and Exporter','loginizer').'</li>
					<li>'.__('Form Builder','loginizer').'</li>
					<li>'.__('Popup Builder','loginizer').'</li>
					<li>'.__('And many more ...','loginizer').'</li>
				</ul>
				<center><a class="button button-primary" target="_blank" href="https://wordpress.org/plugins/pagelayer/">'.__('Visit Pagelayer','loginizer').'</a></center>
			</div>
		</div>';
		
		echo '
		<div class="postbox" style="min-width:0px !important;">
			<div class="postbox-header">
			<h2 class="hndle ui-sortable-handle">
				<span><a target="_blank" href="https://wpcentral.co/?from=loginizer-plugin"><img src="'.LOGINIZER_URL.'/assets/images/wpcentral_product.png" width="100%" /></a></span>
			</h2>
			</div>
			<div class="inside">
				<i>'.__('Manage all your WordPress sites from <b>1 dashboard</b> ','loginizer').'</i>:<br>
				<ul class="lz-right-ul">
					<li>'.__('1-click Admin Access','loginizer').'</li>
					<li>'.__('Update WordPress','loginizer').'</li>
					<li>'.__('Update Themes','loginizer').'</li>
					<li>'.__('Update Plugins','loginizer').'</li>
					<li>'.__('Backup your WordPress Site','loginizer').'</li>
					<li>'.__('Plugins & Theme Management','loginizer').'</li>
					<li>'.__('Post Management','loginizer').'</li>
					<li>'.__('And many more ...','loginizer').'</li>
				</ul>
				<center><a class="button button-primary" target="_blank" href="https://wpcentral.co/?from=loginizer-plugin">'.__('Visit wpCentral','loginizer').'</a></center>
			</div>
		</div>';
	
	}
	
	echo '</td>
	</tr>
	</table>';
	
	if(!defined('SITEPAD')){
	
		echo '<br />
	<div style="width:45%;background:#FFF;padding:15px; margin:auto">
		<b>'.__('Let your friends know that you have secured your website :','loginizer').'</b>
		<form method="get" action="https://twitter.com/intent/tweet" id="tweet" onsubmit="return dotweet(this);">
			<textarea name="text" cols="45" row="3" style="resize:none;">'.__('I just secured my @WordPress site against #bruteforce using @loginizer','loginizer').'</textarea>
			&nbsp; &nbsp; <input type="submit" value="Tweet!" class="button button-primary" onsubmit="return false;" id="twitter-btn" style="margin-top:20px;"/>
		</form>
		
	</div>
	<br />
	
	<script>
	function dotweet(ele){
		window.open(jQuery("#"+ele.id).attr("action")+"?"+jQuery("#"+ele.id).serialize(), "_blank", "scrollbars=no, menubar=no, height=400, width=500, resizable=yes, toolbar=no, status=no");
		return false;
	}
	</script>
	
	<hr />
	<a href="http://loginizer.com" target="_blank">Loginizer</a> '.__('v'.LOGINIZER_VERSION.'. You can report any bugs ','loginizer').'<a href="http://wordpress.org/support/plugin/loginizer" target="_blank">'.__('here','loginizer').'</a>.';
	
	}
	
	echo '
</div>	
</div>
</div>
</div>';

}

// The Loginizer Admin Options Page
function loginizer_page_header($title = 'Loginizer'){
	
	global $loginizer;

?>
<style>
.lz-right-ul{
	padding-left: 10px !important;
}

.lz-right-ul li{
	list-style: circle !important;
}
</style>
<?php
	
	echo '<div style="margin: 10px 20px 0 2px;">	
<div class="metabox-holder columns-2">
<div class="postbox-container">	
<div id="top-sortables" class="meta-box-sortables ui-sortable">
	
	<table cellpadding="2" cellspacing="1" width="100%" class="fixed" border="0">
		<tr>
			<td valign="top"><h3>'.$loginizer['prefix'].$title.'</h3></td>';
			
	if(!defined('SITEPAD')){
			
		echo '<td align="right"><a href="https://www.softaculous.com/clients?ca=affiliate" class="button button-primary" target="_blank">'. __('Refer and Earn', 'loginizer'). '</a> <a target="_blank" class="button button-primary" href="https://wordpress.org/support/view/plugin-reviews/loginizer">'.__('Review Loginizer', 'loginizer').'</a></td>
			<td align="right" width="40"><a target="_blank" href="https://twitter.com/loginizer"><img src="'.LOGINIZER_URL.'/assets/images/twitter.png" /></a></td>
			<td align="right" width="40"><a target="_blank" href="https://www.facebook.com/Loginizer-815504798591884"><img src="'.LOGINIZER_URL.'/assets/images/facebook.png" /></a></td>';
			
	}
			
		echo '
		</tr>
	</table>
	<hr />
	
	<!--Main Table-->
	<table cellpadding="8" cellspacing="1" width="100%" class="fixed">
	<tr>
		<td valign="top">';
		
	if(file_exists(LOGINIZER_DIR.'/premium.php') && !empty($loginizer['enable_csrf_protection']) && !loginizer_is_csrf_prot_mod_set()){

		$lz_error['csrf_mod'] = esc_html__('You have enabled CSRF protection but the .htaccess file has not been updated', 'loginizer');
		
		if(!empty($lz_error)){
			lz_report_error($lz_error);echo '<br />';
		}
	}

}

// Shows the admin menu of Loginizer
function loginizer_admin_menu() {
	
	global $wp_version, $loginizer;
	
	if(!defined('SITEPAD')){
	
		// Add the menu page
		add_menu_page(__('Loginizer Dashboard', 'loginizer'), __('Loginizer Security', 'loginizer'), 'activate_plugins', 'loginizer', 'loginizer_dashboard');
	
		// Dashboard
		add_submenu_page('loginizer', __('Loginizer Dashboard', 'loginizer'), __('Dashboard', 'loginizer'), 'activate_plugins', 'loginizer', 'loginizer_dashboard');
	
	}else{
	
		// Add the menu page
		add_menu_page(__('Security', 'loginizer'), __('Security', 'loginizer'), 'activate_plugins', 'loginizer', 'loginizer_security_settings', 'dashicons-shield', 85);
	
		// Rename Login
		add_submenu_page('loginizer', __('Security Settings', 'loginizer'), __('Rename Login', 'loginizer'), 'activate_plugins', 'loginizer', 'loginizer_security_settings');
		
	}
	
	// Brute Force
	add_submenu_page('loginizer', __('Brute Force Settings', 'loginizer'), __('Brute Force', 'loginizer'), 'activate_plugins', 'loginizer_brute_force', 'loginizer_brute_force_settings');
	
	// PasswordLess
	add_submenu_page('loginizer', __($loginizer['prefix'].'PasswordLess Settings', 'loginizer'), __('PasswordLess', 'loginizer'), 'activate_plugins', 'loginizer_passwordless', 'loginizer_passwordless_settings');
	
	// Security Settings
	if(!defined('SITEPAD')){
	
		// Two Factor Auth
		add_submenu_page('loginizer', __($loginizer['prefix'].' Two Factor Authentication', 'loginizer'), __('Two Factor Auth', 'loginizer'), 'activate_plugins', 'loginizer_2fa', 'loginizer_2fa_settings');
	
	}
	
	// reCaptcha
	add_submenu_page('loginizer', __($loginizer['prefix'].'reCAPTCHA Settings', 'loginizer'), __('reCAPTCHA', 'loginizer'), 'activate_plugins', 'loginizer_recaptcha', 'loginizer_recaptcha_settings');
	
	// Temporary Login
	add_submenu_page('loginizer', __($loginizer['prefix'].'SSO', 'loginizer'), __('Single Sign On', 'loginizer'). ((time() < strtotime('30 November 2023')) ? ' <span style="color:yellow;">Update</span>' : ''), 'activate_plugins', 'loginizer_sso', 'loginizer_sso_settings');
	
	// Security Settings
	if(!defined('SITEPAD')){
	
		// Security Settings
		add_submenu_page('loginizer', __($loginizer['prefix'].'Security Settings', 'loginizer'), __('Security Settings', 'loginizer'), 'activate_plugins', 'loginizer_security', 'loginizer_security_settings');
		
		// File Checksums
		add_submenu_page('loginizer', __('Loginizer File Checksums', 'loginizer'), __('File Checksums', 'loginizer'), 'activate_plugins', 'loginizer_checksums', 'loginizer_checksums_settings');
	
	}
	
	if(!defined('LOGINIZER_PREMIUM') && !empty($loginizer['ins_time']) && $loginizer['ins_time'] < (time() - (30*24*3600))){
		
		// Go Pro link
		add_submenu_page('loginizer', __('Loginizer Go Pro', 'loginizer'), __('Go Pro', 'loginizer'), 'activate_plugins', LOGINIZER_PRO_URL);
		
	}
	
}

// Show the promo
function loginizer_promo(){
	
	echo '
<style>
.lz_button {
background-color: #4CAF50; /* Green */
border: none;
color: white;
padding: 8px 16px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
-webkit-transition-duration: 0.4s; /* Safari */
transition-duration: 0.4s;
cursor: pointer;
}

.lz_button:focus{
border: none;
color: white;
}

.lz_button1 {
color: white;
background-color: #4CAF50;
border:3px solid #4CAF50;
}

.lz_button1:hover {
box-shadow: 0 6px 8px 0 rgba(0,0,0,0.24), 0 9px 25px 0 rgba(0,0,0,0.19);
color: white;
border:3px solid #4CAF50;
}

.lz_button2 {
color: white;
background-color: #0085ba;
}

.lz_button2:hover {
box-shadow: 0 6px 8px 0 rgba(0,0,0,0.24), 0 9px 25px 0 rgba(0,0,0,0.19);
color: white;
}

.lz_button3 {
color: white;
background-color: #365899;
}

.lz_button3:hover {
box-shadow: 0 6px 8px 0 rgba(0,0,0,0.24), 0 9px 25px 0 rgba(0,0,0,0.19);
color: white;
}

.lz_button4 {
color: white;
background-color: rgb(66, 184, 221);
}

.lz_button4:hover {
box-shadow: 0 6px 8px 0 rgba(0,0,0,0.24), 0 9px 25px 0 rgba(0,0,0,0.19);
color: white;
}

.loginizer_promo-close{
float:right;
text-decoration:none;
margin: 5px 10px 0px 0px;
}

.loginizer_promo-close:hover{
color: red;
}
</style>	

<script>
jQuery(document).ready( function() {
	(function($) {
		$("#loginizer_promo .loginizer_promo-close").click(function(){
			var data;
			
			// Hide it
			$("#loginizer_promo").hide();
			
			// Save this preference
			$.post("'.admin_url('?loginizer_promo=0').'", data, function(response) {
				//alert(response);
			});
		});
	})(jQuery);
});
</script>

<div class="notice notice-success" id="loginizer_promo" style="min-height:120px">
	<a class="loginizer_promo-close" href="javascript:" aria-label="Dismiss this Notice">
		<span class="dashicons dashicons-dismiss"></span> Dismiss
	</a>
	<img src="'.LOGINIZER_URL.'/assets/images/loginizer-200.png" style="float:left; margin:10px 20px 10px 10px" width="100" />
	<p style="font-size:16px">We are glad you like Loginizer and have been using it since the past few days. It is time to take the next step </p>
	<p>
		<a class="lz_button lz_button1" target="_blank" href="https://loginizer.com/features">Upgrade to Pro</a>
		<a class="lz_button lz_button2" target="_blank" href="https://wordpress.org/support/view/plugin-reviews/loginizer">Rate it 5★\'s</a>
		<a class="lz_button lz_button3" target="_blank" href="https://www.facebook.com/Loginizer-815504798591884/">Like Us on Facebook</a>
		<a class="lz_button lz_button4" target="_blank" href="https://twitter.com/home?status='.rawurlencode('I use @loginizer to secure my #WordPress site - https://loginizer.com').'">Tweet about Loginizer</a>
	</p>
</div>';

}


function loginizer_recaptcha_settings(){
	include_once LOGINIZER_DIR . '/main/settings/recaptcha.php';
	loginizer_page_recaptcha();
}

function loginizer_2fa_settings(){
	include_once LOGINIZER_DIR . '/main/settings/2fa.php';
	loginizer_page_2fa();
}

function loginizer_passwordless_settings(){
	include_once LOGINIZER_DIR . '/main/settings/passwordless.php';
	loginizer_page_passwordless();
}

function loginizer_security_settings(){
	include_once LOGINIZER_DIR . '/main/settings/security.php';
	loginizer_page_security();
}

function loginizer_brute_force_settings(){
	include_once LOGINIZER_DIR . '/main/settings/brute-force.php';
	loginizer_page_brute_force();
}

function loginizer_checksums_settings(){
	include_once LOGINIZER_DIR . '/main/settings/checksum.php';
	loginizer_page_checksums();
}

function loginizer_dashboard(){
	include_once LOGINIZER_DIR . '/main/settings/dashboard.php';
	
	loginizer_page_dashboard();
}

function loginizer_sso_settings(){
	loginizer_enqueue_admin_script();
	include_once LOGINIZER_DIR . '/main/settings/sso.php';
	
	loginizer_sso();
}

function loginizer_enqueue_admin_script(){
	wp_enqueue_script('loginizer-admin', LOGINIZER_URL . '/assets/js/loginizer-admin.js', LOGINIZER_VERSION, true);
	
	$loginizer_script_data = array(
		'nonce' => wp_create_nonce('loginizer_nonce'),
		'ajax_url' => admin_url('admin-ajax.php'),
	);
	
	wp_localize_script('loginizer-admin', 'lz_obj', $loginizer_script_data);
}
