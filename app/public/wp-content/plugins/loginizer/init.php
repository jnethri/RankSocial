<?php

if(!function_exists('add_action')){
	echo 'You are not allowed to access this page directly.';
	exit;
}

define('LOGINIZER_VERSION', '1.8.4');
define('LOGINIZER_DIR', dirname(LOGINIZER_FILE));
define('LOGINIZER_URL', plugins_url('', LOGINIZER_FILE));
define('LOGINIZER_PRO_URL', 'https://loginizer.com/features#compare');
define('LOGINIZER_PRICING_URL', 'https://loginizer.com/pricing');
define('LOGINIZER_DOCS', 'https://loginizer.com/docs/');

include_once(LOGINIZER_DIR.'/functions.php');

// Ok so we are now ready to go
register_activation_hook(LOGINIZER_FILE, 'loginizer_activation');

// Is called when the ADMIN enables the plugin
function loginizer_activation(){

	global $wpdb;

	$sql = array();
	
	$sql[] = "DROP TABLE IF EXISTS `".$wpdb->prefix."loginizer_logs`";
	
	$sql[] = "CREATE TABLE `".$wpdb->prefix."loginizer_logs` (
				`username` varchar(255) NOT NULL DEFAULT '',
				`time` int(10) NOT NULL DEFAULT '0',
				`count` int(10) NOT NULL DEFAULT '0',
				`lockout` int(10) NOT NULL DEFAULT '0',
				`ip` varchar(255) NOT NULL DEFAULT '',
				`url` varchar(255) NOT NULL DEFAULT '',
				UNIQUE KEY `ip` (`ip`)
			) DEFAULT CHARSET=utf8;";

	foreach($sql as $sk => $sv){
		$wpdb->query($sv);
	}
	
	add_option('loginizer_version', LOGINIZER_VERSION);
	add_option('loginizer_options', array());
	add_option('loginizer_last_reset', 0);
	add_option('loginizer_whitelist', array());
	add_option('loginizer_blacklist', array());
	add_option('loginizer_2fa_whitelist', array());

}

/**
 * Updates the database structure for Loginizer
 *
 * If the plugin files are updated but database structure is not updated
 * this function will update the database structure as per the plugin version
 * NOTE: This does not update plugin files it just updates the database structure
 */
function loginizer_update_check(){

global $wpdb;

	$sql = array();
	$current_version = get_option('loginizer_version');
	
	// It must be the 1.0 pre stuff
	if(empty($current_version)){
		$current_version = get_option('lz_version');
	}
	
	$version = (int) str_replace('.', '', $current_version);
	
	// No update required
	if($current_version == LOGINIZER_VERSION){
		return true;
	}
	
	// Is it first run ?
	if(empty($current_version)){
		
		// Reinstall
		loginizer_activation();
		
		// Trick the following if conditions to not run
		$version = (int) str_replace('.', '', LOGINIZER_VERSION);
		
	}
	
	// Is it less than 1.0.1 ?
	if($version < 101){
		
		// TODO : GET the existing settings
	
		// Get the existing settings		
		$lz_failed_logs = lz_selectquery("SELECT * FROM `".$wpdb->prefix."lz_failed_logs`;", 1);
		$lz_options = lz_selectquery("SELECT * FROM `".$wpdb->prefix."lz_options`;", 1);
		$lz_iprange = lz_selectquery("SELECT * FROM `".$wpdb->prefix."lz_iprange`;", 1);
				
		// Delete the three tables
		$sql = array();
		$sql[] = "DROP TABLE IF EXISTS ".$wpdb->prefix."lz_failed_logs;";
		$sql[] = "DROP TABLE IF EXISTS ".$wpdb->prefix."lz_options;";
		$sql[] = "DROP TABLE IF EXISTS ".$wpdb->prefix."lz_iprange;";

		foreach($sql as $sk => $sv){
			$wpdb->query($sv);
		}
		
		// Delete option
		delete_option('lz_version');
	
		// Reinstall
		loginizer_activation();
	
		// TODO : Save the existing settings

		// Update the existing failed logs to new table
		if(is_array($lz_failed_logs)){
			foreach($lz_failed_logs as $fk => $fv){
				$insert_data = array('username' => $fv['username'], 
									'time' => $fv['time'], 
									'count' => $fv['count'], 
									'lockout' => $fv['lockout'], 
									'ip' => $fv['ip']);
									
				$format = array('%s','%d','%d','%d','%s');
				
				$wpdb->insert($wpdb->prefix.'loginizer_logs', $insert_data, $format);
			}			
		}

		// Update the existing options to new structure
		if(is_array($lz_options)){
			foreach($lz_options as $ok => $ov){
				
				if($ov['option_name'] == 'lz_last_reset'){
					update_option('loginizer_last_reset', $ov['option_value']);
					continue;
				}
				
				$old_option[str_replace('lz_', '', $ov['option_name'])] = $ov['option_value'];
			}
			// Save the options
			update_option('loginizer_options', $old_option);
		}

		// Update the existing iprange to new structure
		if(is_array($lz_iprange)){
			
			$old_blacklist = array();
			$old_whitelist = array();
			$bid = 1;
			$wid = 1;
			foreach($lz_iprange as $ik => $iv){
				
				if(!empty($iv['blacklist'])){
					$old_blacklist[$bid] = array();
					$old_blacklist[$bid]['start'] = long2ip($iv['start']);
					$old_blacklist[$bid]['end'] = long2ip($iv['end']);
					$old_blacklist[$bid]['time'] = strtotime($iv['date']);
					$bid = $bid + 1;
				}
				
				if(!empty($iv['whitelist'])){
					$old_whitelist[$wid] = array();
					$old_whitelist[$wid]['start'] = long2ip($iv['start']);
					$old_whitelist[$wid]['end'] = long2ip($iv['end']);
					$old_whitelist[$wid]['time'] = strtotime($iv['date']);
					$wid = $wid + 1;
				}
			}
			
			if(!empty($old_blacklist)) update_option('loginizer_blacklist', $old_blacklist);
			if(!empty($old_whitelist)) update_option('loginizer_whitelist', $old_whitelist);
		}
		
	}
	
	// Is it less than 1.3.9 ?
	if($version < 139){
		
		$wpdb->query("ALTER TABLE ".$wpdb->prefix."loginizer_logs  ADD `url` VARCHAR(255) NOT NULL DEFAULT '' AFTER `ip`;");
	
	}
	
	// Save the new Version
	update_option('loginizer_version', LOGINIZER_VERSION);
	
	// In Sitepad Math Captcha is enabled by default
	if(defined('SITEPAD') && get_option('loginizer_captcha') === false){
		$option['captcha_no_google'] = 1;
		add_option('loginizer_captcha', $option);
	}
	
}

// Add the action to load the plugin 
add_action('plugins_loaded', 'loginizer_load_plugin');

// The function that will be called when the plugin is loaded
function loginizer_load_plugin(){
	
	global $loginizer;
	
	// Check if the installed version is outdated
	loginizer_update_check();
	
	// Set the array
	$loginizer = array();
	
	$loginizer['prefix'] = !defined('SITEPAD') ? 'Loginizer ' : 'SitePad ';
	$loginizer['app'] = !defined('SITEPAD') ? 'WordPress' : 'SitePad';
	$loginizer['login_basename'] = !defined('SITEPAD') ? 'wp-login.php' : 'login.php';
	$loginizer['wp-includes'] = !defined('SITEPAD') ? 'wp-includes' : 'site-inc';
	
	// The IP Method to use
	$loginizer['ip_method'] = get_option('loginizer_ip_method');
	if($loginizer['ip_method'] == 3){
		$loginizer['custom_ip_method'] = get_option('loginizer_custom_ip_method');
	}
	
	// Load settings
	$options = get_option('loginizer_options');
	$loginizer['max_retries'] = empty($options['max_retries']) ? 3 : $options['max_retries'];
	$loginizer['lockout_time'] = empty($options['lockout_time']) ? 900 : $options['lockout_time']; // 15 minutes
	$loginizer['max_lockouts'] = empty($options['max_lockouts']) ? 5 : $options['max_lockouts'];
	$loginizer['lockouts_extend'] = empty($options['lockouts_extend']) ? 86400 : $options['lockouts_extend']; // 24 hours
	$loginizer['reset_retries'] = empty($options['reset_retries']) ? 86400 : $options['reset_retries']; // 24 hours
	$loginizer['notify_email'] = empty($options['notify_email']) ? 0 : $options['notify_email'];
	$loginizer['notify_email_address'] = lz_is_multisite() ? get_site_option('admin_email') : get_option('admin_email');
	$loginizer['trusted_ips'] = empty($options['trusted_ips']) ? false : true;
	$loginizer['blocked_screen'] = empty($options['blocked_screen']) ? false : true;

	
	if(!empty($options['notify_email_address'])){
		$loginizer['notify_email_address'] = $options['notify_email_address'];
		$loginizer['custom_notify_email'] = 1;
	}
	
	// Login Success Email Notification.
	$loginizer['login_mail'] = get_option('loginizer_login_mail', []);
	$loginizer['login_mail_default_sub'] = __('Login Successful at $sitename', 'loginizer');
	$loginizer['login_mail_default_msg'] = __('Hello $user_login,

Your account was recently logged in from the IP : $ip
Time : $date 
If it was not you who logged in then please report this to us immediately.

Regards,
$sitename','loginizer');

	$loginizer['login_mail_subject'] = empty($loginizer['login_mail']['subject']) ? $loginizer['login_mail_default_sub']: $loginizer['login_mail']['subject'];
	$loginizer['login_mail_body'] = empty($loginizer['login_mail']['body']) ? $loginizer['login_mail_default_msg'] : $loginizer['login_mail']['body'];
	
	// Default messages
	$loginizer['d_msg']['inv_userpass'] = __('Incorrect Username or Password', 'loginizer');
	$loginizer['d_msg']['ip_blacklisted'] = __('Your IP has been blacklisted', 'loginizer');
	$loginizer['d_msg']['attempts_left'] = __('attempt(s) left', 'loginizer');
	$loginizer['d_msg']['lockout_err'] = __('You have exceeded maximum login retries<br /> Please try after', 'loginizer');
	$loginizer['d_msg']['minutes_err'] = __('minute(s)', 'loginizer');
	$loginizer['d_msg']['hours_err'] = __('hour(s)', 'loginizer');
	
	// Message Strings
	$loginizer['msg'] = get_option('loginizer_msg', []);
	
	foreach($loginizer['d_msg'] as $lk => $lv){
		if(empty($loginizer['msg'][$lk])){
			$loginizer['msg'][$lk] = $loginizer['d_msg'][$lk];
		}
	}
	
	$loginizer['2fa_d_msg']['otp_app'] = __('Please enter the OTP as seen in your App', 'loginizer');
	$loginizer['2fa_d_msg']['otp_email'] = __('Please enter the OTP emailed to you', 'loginizer');
	$loginizer['2fa_d_msg']['otp_field'] = __('One Time Password', 'loginizer');
	$loginizer['2fa_d_msg']['otp_question'] = __('Please answer your security question', 'loginizer');
	$loginizer['2fa_d_msg']['otp_answer'] = __('Your Answer', 'loginizer');
	
	// Message Strings
	$loginizer['2fa_msg'] = get_option('loginizer_2fa_msg', []);
	
	foreach($loginizer['2fa_d_msg'] as $lk => $lv){
		if(empty($loginizer['2fa_msg'][$lk])){
			$loginizer['2fa_msg'][$lk] = $loginizer['2fa_d_msg'][$lk];
		}
	}
		
	// Load the blacklist and whitelist
	$loginizer['blacklist'] = get_option('loginizer_blacklist', []);
	$loginizer['whitelist'] = get_option('loginizer_whitelist', []);
	$loginizer['2fa_whitelist'] = get_option('loginizer_2fa_whitelist');
	
	// It should not be false
	if(empty($loginizer['2fa_whitelist'])){
		$loginizer['2fa_whitelist'] = array();
	}
	
	// When was the database cleared last time
	$loginizer['last_reset']  = get_option('loginizer_last_reset');
	
	//print_r($loginizer);
	
	// Clear retries
	if((time() - $loginizer['last_reset']) >= $loginizer['reset_retries']){
		loginizer_reset_retries();
	}
	
	$ins_time = get_option('loginizer_ins_time');
	if(empty($ins_time)){
		$ins_time = time();
		update_option('loginizer_ins_time', $ins_time);
	}
	$loginizer['ins_time'] = $ins_time;
	
	// Set the current IP
	$loginizer['current_ip'] = lz_getip();
	
	// Is Brute Force Disabled ?
	$loginizer['disable_brute'] = get_option('loginizer_disable_brute');

	// Filters and actions
	if(empty($loginizer['disable_brute'])){
	
		// Use this to verify before WP tries to login
		// Is always called and is the first function to be called
		//add_action('wp_authenticate', 'loginizer_wp_authenticate', 10, 2);// Not called by XML-RPC
		add_filter('authenticate', 'loginizer_wp_authenticate', 10001, 3);// This one is called by xmlrpc as well as GUI
		
		// Is called when a login attempt fails
		// Hence Update our records that the login failed
		add_action('wp_login_failed', 'loginizer_login_failed');
		
		// Is called before displaying the error message so that we dont show that the username is wrong or the password
		// Update Error message
		add_action('wp_login_errors', 'loginizer_error_handler', 10001, 2);
		add_action('woocommerce_login_failed', 'loginizer_woocommerce_error_handler', 10001);
		add_action('wp_login', 'loginizer_login_success', 10, 2);
	
	}
	
	// ----------------
	// PRO INIT
	// ----------------
	
	// Email to Login
	$options = get_option('loginizer_epl');
	$loginizer['pl_d_sub'] = __('Login at $site_name','loginizer');
	$loginizer['pl_d_msg'] = __('Hi,

A login request was submitted for your account $email at :
$site_name - $site_url

Login at $site_name by visiting this url : 
$login_url

If you have not requested for the Login URL, please ignore this email.

Regards,
$site_name','loginizer');
	$loginizer['email_pass_less'] = empty($options['email_pass_less']) ? 0 : $options['email_pass_less'];
	$loginizer['passwordless_sub'] = empty($options['passwordless_sub']) ? $loginizer['pl_d_sub'] : $options['passwordless_sub'];
	$loginizer['passwordless_msg'] = empty($options['passwordless_msg']) ? $loginizer['pl_d_msg'] : $options['passwordless_msg'];
	$loginizer['passwordless_msg_is_custom'] = empty($options['passwordless_msg']) ? 0 : 1;
	$loginizer['passwordless_html'] = empty($options['passwordless_html']) ? 0 : $options['passwordless_html'];
	$loginizer['passwordless_redirect'] = empty($options['passwordless_redirect']) ? 0 : $options['passwordless_redirect'];
	$loginizer['passwordless_redirect_for'] = empty($options['passwordless_redirect_for']) ? 0 : $options['passwordless_redirect_for'];

	// 2FA OTP Email to Login
	$options = get_option('loginizer_2fa_email_template');
	$loginizer['2fa_email_d_sub'] = 'OTP : Login at $site_name';
	$loginizer['2fa_email_d_msg'] = 'Hi,

A login request was submitted for your account $email at :
$site_name - $site_url

Please use the following One Time password (OTP) to login : 
$otp

Note : The OTP expires after 10 minutes.

If you haven\'t requested for the OTP, please ignore this email.

Regards,
$site_name';

	$loginizer['2fa_email_sub'] = empty($options['2fa_email_sub']) ? $loginizer['2fa_email_d_sub'] : $options['2fa_email_sub'];
	$loginizer['2fa_email_msg'] = empty($options['2fa_email_msg']) ? $loginizer['2fa_email_d_msg'] : $options['2fa_email_msg'];
	
	// For SitePad its always on
	if(defined('SITEPAD')){
		$loginizer['email_pass_less'] = 1;
	}
	
	// Captcha
	$options = get_option('loginizer_captcha');
	$loginizer['captcha_type'] = empty($options['captcha_type']) ? '' : $options['captcha_type'];
	$loginizer['captcha_key'] = empty($options['captcha_key']) ? '' : $options['captcha_key'];
	$loginizer['captcha_secret'] = empty($options['captcha_secret']) ? '' : $options['captcha_secret'];
	$loginizer['captcha_theme'] = empty($options['captcha_theme']) ? 'light' : $options['captcha_theme'];
	$loginizer['captcha_size'] = empty($options['captcha_size']) ? 'normal' : $options['captcha_size'];
	$loginizer['captcha_lang'] = empty($options['captcha_lang']) ? '' : $options['captcha_lang'];
	$loginizer['turn_captcha_key'] = empty($options['turn_captcha_key']) ? '' : $options['turn_captcha_key'];
	$loginizer['turn_captcha_secret'] = empty($options['turn_captcha_secret']) ? '' : $options['turn_captcha_secret'];
	$loginizer['turn_captcha_theme'] = empty($options['turn_captcha_theme']) ? 'light' : $options['turn_captcha_theme'];
	$loginizer['turn_captcha_size'] = empty($options['turn_captcha_size']) ? 'normal' : $options['turn_captcha_size'];
	$loginizer['turn_captcha_lang'] = empty($options['turn_captcha_lang']) ? '' : $options['turn_captcha_lang'];
	$loginizer['captcha_user_hide'] = !isset($options['captcha_user_hide']) ? 0 : $options['captcha_user_hide'];
	$loginizer['captcha_no_css_login'] = !isset($options['captcha_no_css_login']) ? 0 : $options['captcha_no_css_login'];
	$loginizer['captcha_no_js'] = 1;
	$loginizer['captcha_login'] = !isset($options['captcha_login']) ? 1 : $options['captcha_login'];
	$loginizer['captcha_lostpass'] = !isset($options['captcha_lostpass']) ? 1 : $options['captcha_lostpass'];
	$loginizer['captcha_resetpass'] = !isset($options['captcha_resetpass']) ? 1 : $options['captcha_resetpass'];
	$loginizer['captcha_register'] = !isset($options['captcha_register']) ? 1 : $options['captcha_register'];
	$loginizer['captcha_comment'] = !isset($options['captcha_comment']) ? 1 : $options['captcha_comment'];
	$loginizer['captcha_wc_checkout'] = !isset($options['captcha_wc_checkout']) ? 1 : $options['captcha_wc_checkout'];
	
	$loginizer['captcha_no_google'] =  !isset($options['captcha_no_google']) ? 0 : $options['captcha_no_google'];
	$loginizer['captcha_domain'] = empty($options['captcha_domain']) ? 'www.google.com' : $options['captcha_domain'];
	
	$loginizer['captcha_text'] =  empty($options['captcha_text']) ? __('Math Captcha', 'loginizer') : $options['captcha_text'];
	$loginizer['captcha_time'] =  empty($options['captcha_time']) ? 300 : $options['captcha_time'];
	$loginizer['captcha_words'] =  !isset($options['captcha_words']) ? 0 : $options['captcha_words'];
	$loginizer['captcha_add'] =  !isset($options['captcha_add']) ? 1 : $options['captcha_add'];
	$loginizer['captcha_subtract'] =  !isset($options['captcha_subtract']) ? 1 : $options['captcha_subtract'];
	$loginizer['captcha_multiply'] =  !isset($options['captcha_multiply']) ? 0 : $options['captcha_multiply'];
	$loginizer['captcha_divide'] =  !isset($options['captcha_divide']) ? 0 : $options['captcha_divide'];
	$loginizer['captcha_status'] =  !isset($options['captcha_status']) ? 0 : $options['captcha_status'];

	// hcaptcha
	$loginizer['hcaptcha_secretkey'] =  !isset($options['hcaptcha_secretkey']) ? '' : $options['hcaptcha_secretkey'];
	$loginizer['hcaptcha_sitekey'] =  !isset($options['hcaptcha_sitekey']) ? '' : $options['hcaptcha_sitekey'];
	$loginizer['hcaptcha_theme'] = empty($options['hcaptcha_theme']) ? 'light' : $options['hcaptcha_theme'];
	$loginizer['hcaptcha_lang'] = empty($options['hcaptcha_lang']) ? '' : $options['hcaptcha_lang'];
	$loginizer['hcaptcha_size'] = empty($options['hcaptcha_size']) ? 'normal' : $options['hcaptcha_size'];

	// 2fa/question
	$options = get_option('loginizer_2fa');
	$loginizer['2fa_app'] = !isset($options['2fa_app']) ? 0 : $options['2fa_app'];
	$loginizer['2fa_email'] = !isset($options['2fa_email']) ? 0 : $options['2fa_email'];
	$loginizer['2fa_email_force'] = !isset($options['2fa_email_force']) ? 0 : $options['2fa_email_force'];
	$loginizer['2fa_sms'] = !isset($options['2fa_sms']) ? 0 : $options['2fa_sms'];
	$loginizer['question'] = !isset($options['question']) ? 0 : $options['question'];
	$loginizer['2fa_default'] = empty($options['2fa_default']) ? 'question' : $options['2fa_default'];
	$loginizer['2fa_roles'] = empty($options['2fa_roles']) ? array() : $options['2fa_roles'];
	
	// Security Settings
	$options = get_option('loginizer_security');
	$loginizer['login_slug'] = empty($options['login_slug']) ? '' : $options['login_slug'];
	$loginizer['rename_login_secret'] = empty($options['rename_login_secret']) ? '' : $options['rename_login_secret'];
	$loginizer['xmlrpc_slug'] = empty($options['xmlrpc_slug']) ? '' : $options['xmlrpc_slug'];
	$loginizer['xmlrpc_disable'] = empty($options['xmlrpc_disable']) ? '' : $options['xmlrpc_disable'];// Disable XML-RPC
	$loginizer['pingbacks_disable'] = empty($options['pingbacks_disable']) ? '' : $options['pingbacks_disable'];// Disable Pingbacks
	
	// Admin Slug Settings
	$options = get_option('loginizer_wp_admin');
	$loginizer['admin_slug'] = empty($options['admin_slug']) ? '' : $options['admin_slug'];
	$loginizer['restrict_wp_admin'] = empty($options['restrict_wp_admin']) ? '' : $options['restrict_wp_admin'];
	$loginizer['wp_admin_msg'] = empty($options['wp_admin_msg']) ? '' : $options['wp_admin_msg'];
	
	// Checksum Settings
	$options = get_option('loginizer_checksums');
	$loginizer['disable_checksum'] = empty($options['disable_checksum']) ? '' : $options['disable_checksum'];
	$loginizer['checksum_time'] = empty($options['checksum_time']) ? '' : $options['checksum_time'];
	$loginizer['checksum_frequency'] = empty($options['checksum_frequency']) ? 7 : $options['checksum_frequency'];
	$loginizer['no_checksum_email'] = empty($options['no_checksum_email']) ? '' : $options['no_checksum_email'];
	$loginizer['checksums_last_run'] = get_option('loginizer_checksums_last_run');
	
	// Auto Blacklist Usernames
	$loginizer['username_blacklist'] = get_option('loginizer_username_blacklist');
	
	$loginizer['domains_blacklist'] = get_option('loginizer_domains_blacklist');
	
	$loginizer['wp_admin_d_msg'] = __('LZ : Not allowed via WP-ADMIN. Please access over the new Admin URL', 'loginizer');
	
	// CSRF Protection
	$loginizer['enable_csrf_protection'] = get_option('loginizer_csrf_protection');
	$loginizer['2fa_custom_login_redirect'] = get_option('loginizer_2fa_custom_redirect');
	$loginizer['limit_session'] = get_option('loginizer_limit_session');

	if((function_exists('wp_doing_ajax') && wp_doing_ajax()) || (defined( 'DOING_AJAX' ) && DOING_AJAX)){
		include_once LOGINIZER_DIR . '/main/ajax.php';
	}

	if(is_admin()){
		include_once LOGINIZER_DIR . '/main/admin.php';
	}

	// ----------------
	// PRO INIT END
	// ----------------
	
	// Is the premium features there ?
	if(file_exists(LOGINIZER_DIR.'/premium.php')){
		
		// Include the file
		include_once(LOGINIZER_DIR.'/premium.php');
		
		loginizer_security_init();
	
	// Its the free version
	}else{
		
		if(current_user_can('activate_plugins')){
			// The promo time
			$loginizer['promo_time'] = get_option('loginizer_promo_time');
			if(empty($loginizer['promo_time'])){
				$loginizer['promo_time'] = time();
				update_option('loginizer_promo_time', $loginizer['promo_time']);
			}
			
			// Are we to show the loginizer promo
			if(!empty($loginizer['promo_time']) && $loginizer['promo_time'] > 0 && $loginizer['promo_time'] < (time() - (30*24*3600))){
			
				add_action('admin_notices', 'loginizer_promo');
			
			}
			
			if(!file_exists(LOGINIZER_DIR.'/premium.php') && current_user_can('activate_plugins') && !empty($loginizer['csrf_promo']) && $loginizer['csrf_promo'] > 0 && $loginizer['csrf_promo'] < (time() - 86400)){
				
				add_action('admin_notices', 'loginizer_csrf_promo');
				
			}
			
			// Are we to disable the promo
			if(isset($_GET['loginizer_promo']) && (int)$_GET['loginizer_promo'] == 0){
				update_option('loginizer_promo_time', (0 - time()) );
				die('DONE');
			}
			
			$loginizer['backuply_promo'] = get_option('loginizer_backuply_promo_time');
			
			if(empty($loginizer['backuply_promo'])){
				$loginizer['backuply_promo'] = abs($loginizer['promo_time']);
				update_option('loginizer_backuply_promo_time', $loginizer['backuply_promo']);
			}
			
			// Setting CSRF Promo time
			$loginizer['csrf_promo'] = get_option('loginizer_csrf_promo_time');
			
			if(empty($loginizer['csrf_promo'])){
				$loginizer['csrf_promo'] = abs($loginizer['promo_time']);
				update_option('loginizer_csrf_promo_time', $loginizer['csrf_promo']);
			}
		}
	}

}

// Should return NULL if everything is fine
function loginizer_wp_authenticate($user, $username, $password){
	
	global $loginizer, $lz_error, $lz_cannot_login, $lz_user_pass;
	
	if(!empty($username) && !empty($password)){
		$lz_user_pass = 1;
	}
	
	// Are you whitelisted ?
	if(loginizer_is_whitelisted()){
		$loginizer['ip_is_whitelisted'] = 1;
		return $user;

	} else if (!empty($loginizer['trusted_ips'])){
		$lz_cannot_login = 1;

		// This is used by WP Activity Log
		apply_filters( 'wp_login_blocked', $username );
		
		// Shows a blocked screen
		if(!empty($loginizer['blocked_screen'])){
			$lz_error['trusted_ip'] = __('You are restricted from logging in as your IP is not whitelisted.', 'loginizer');
			loginizer_blocked_page($lz_error);
		}
		
		return new WP_Error('ip_blacklisted', __('You are restricted from logging in as your IP is not whitelisted.', 'loginizer'));
	}
	
	// Are you blacklisted ?
	if(loginizer_is_blacklisted()){
		$lz_cannot_login = 1;
		
		// This is used by WP Activity Log
		apply_filters( 'wp_login_blocked', $username );
		
		// Shows a blocked screen
		if(!empty($loginizer['blocked_screen'])){
			loginizer_blocked_page($lz_error);
		}
		
		return new WP_Error('ip_blacklisted', implode('', $lz_error), 'loginizer');
	}
	
	// Is the username blacklisted ?
	if(function_exists('loginizer_user_blacklisted')){
		if(loginizer_user_blacklisted($username)){
			$lz_cannot_login = 1;
		
			// This is used by WP Activity Log
			apply_filters( 'wp_login_blocked', $username );

			return new WP_Error('user_blacklisted', implode('', $lz_error), 'loginizer');
		}
	}
	
	if(loginizer_can_login()){
		return $user;
	}
	
	$lz_cannot_login = 1;

	// This is used by WP Activity Log
	apply_filters( 'wp_login_blocked', $username );
	
	// Shows a blocked screen
	if(!empty($loginizer['blocked_screen'])){
		loginizer_blocked_page($lz_error);
	}
	
	return new WP_Error('ip_blocked', implode('', $lz_error), 'loginizer');

}

function loginizer_can_login(){
	
	global $wpdb, $loginizer, $lz_error;
	
	// Get the logs
	$sel_query = $wpdb->prepare("SELECT * FROM `".$wpdb->prefix."loginizer_logs` WHERE `ip` = %s", $loginizer['current_ip']);
	$result = lz_selectquery($sel_query);
	
	if(!empty($result['count']) && ($result['count'] % $loginizer['max_retries']) == 0){

		// Has he reached max lockouts ?
		if($result['lockout'] >= $loginizer['max_lockouts']){
			$loginizer['lockout_time'] = $loginizer['lockouts_extend'];
		}
		
		// Is he in the lockout time ?
		if($result['time'] >= (time() - $loginizer['lockout_time'])){
			$banlift = ceil((($result['time'] + $loginizer['lockout_time']) - time()) / 60);
			
			//echo 'Current Time '.date('d/M/Y H:i:s P', time()).'<br />';
			//echo 'Last attempt '.date('d/M/Y H:i:s P', $result['time']).'<br />';
			//echo 'Unlock Time '.date('d/M/Y H:i:s P', $result['time'] + $loginizer['lockout_time']).'<br />';
			
			$_time = $banlift.' '.$loginizer['msg']['minutes_err'];
			
			if($banlift > 60){
				$banlift = ceil($banlift / 60);
				$_time = $banlift.' '.$loginizer['msg']['hours_err'];
			}
			
			$lz_error['ip_blocked'] = $loginizer['msg']['lockout_err'].' '.$_time;
			
			return false;
		}
	}
	
	return true;
}

function loginizer_is_blacklisted(){
	
	global $wpdb, $loginizer, $lz_error;
	
	$blacklist = $loginizer['blacklist'];
	
	if(empty($blacklist)){
		return false;
	}
	  
	foreach($blacklist as $k => $v){
		
		// Is the IP in the blacklist ?
		if(inet_ptoi($v['start']) <= inet_ptoi($loginizer['current_ip']) && inet_ptoi($loginizer['current_ip']) <= inet_ptoi($v['end'])){
			$result = 1;
			break;
		}
		
		// Is it in a wider range ?
		if(inet_ptoi($v['start']) >= 0 && inet_ptoi($v['end']) < 0){
			
			// Since the end of the RANGE (i.e. current IP range) is beyond the +ve value of inet_ptoi, 
			// if the current IP is <= than the start of the range, it is within the range
			// OR
			// if the current IP is <= than the end of the range, it is within the range
			if(inet_ptoi($v['start']) <= inet_ptoi($loginizer['current_ip'])
				|| inet_ptoi($loginizer['current_ip']) <= inet_ptoi($v['end'])){				
				$result = 1;
				break;
			}
			
		}
		
	}
		
	// You are blacklisted
	if(!empty($result)){
		$lz_error['ip_blacklisted'] = $loginizer['msg']['ip_blacklisted'];
		return true;
	}
	
	return false;
	
}

function loginizer_is_whitelisted(){
	
	global $wpdb, $loginizer, $lz_error;
	
	$whitelist = $loginizer['whitelist'];
			
	if(empty($whitelist)){
		return false;
	}
	  
	foreach($whitelist as $k => $v){
		
		// Is the IP in the blacklist ?
		if(inet_ptoi($v['start']) <= inet_ptoi($loginizer['current_ip']) && inet_ptoi($loginizer['current_ip']) <= inet_ptoi($v['end'])){
			$result = 1;
			break;
		}
		
		// Is it in a wider range ?
		if(inet_ptoi($v['start']) >= 0 && inet_ptoi($v['end']) < 0){
			
			// Since the end of the RANGE (i.e. current IP range) is beyond the +ve value of inet_ptoi, 
			// if the current IP is <= than the start of the range, it is within the range
			// OR
			// if the current IP is <= than the end of the range, it is within the range
			if(inet_ptoi($v['start']) <= inet_ptoi($loginizer['current_ip'])
				|| inet_ptoi($loginizer['current_ip']) <= inet_ptoi($v['end'])){				
				$result = 1;
				break;
			}
			
		}
		
	}
		
	// You are whitelisted
	if(!empty($result)){
		return true;
	}
	
	return false;
	
}

// When the login fails, then this is called
// We need to update the database
function loginizer_login_failed($username, $is_2fa = ''){
	
	global $wpdb, $loginizer, $lz_cannot_login;
	
	// Some plugins are changing the value for username as null so we need to handle it before using it for the INSERT OR UPDATE query
	if(empty($username) || is_null($username)){
		$username = '';
	}
	
	$fail_type = 'Login';
	
	if(!empty($is_2fa)){
		$fail_type = '2FA';
	}

	if(empty($lz_cannot_login) && empty($loginizer['ip_is_whitelisted']) && empty($loginizer['no_loginizer_logs'])){
		
		$url = @addslashes((!empty($_SERVER['HTTPS']) ? 'https://' : 'http://').$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
		$url = esc_url($url);
		
		$sel_query = $wpdb->prepare("SELECT * FROM `".$wpdb->prefix."loginizer_logs` WHERE `ip` = %s", $loginizer['current_ip']);
		$result = lz_selectquery($sel_query);
		
		if(!empty($result)){
			$lockout = floor((($result['count']+1) / $loginizer['max_retries']));
			
			$update_data = array('username' => $username, 
								'time' => time(), 
								'count' => $result['count']+1, 
								'lockout' => $lockout, 
								'url' => $url);
			
			$where_data = array('ip' => $loginizer['current_ip']);
			
			$format = array('%s','%d','%d','%d','%s');
			$where_format = array('%s');
			
			$wpdb->update($wpdb->prefix.'loginizer_logs', $update_data, $where_data, $format, $where_format);
			
			// Do we need to email admin ?
			if(!empty($loginizer['notify_email']) && $lockout >= $loginizer['notify_email']){
				
				$lockout_time = $loginizer['lockout_time'];
				
				if($lockout >= $loginizer['max_lockouts']){
					// extended lockout is in hours so we have to convert to minute
					$lockout_time = $loginizer['lockouts_extend'];
				}
				
				$sitename = lz_is_multisite() ? get_site_option('site_name') : get_option('blogname');
				$mail = array();
				$mail['to'] = $loginizer['notify_email_address'];	
				$mail['subject'] = 'Failed '.$fail_type.' Attempts from IP '.$loginizer['current_ip'].' ('.$sitename.')';
				$mail['message'] = 'Hi,

'.($result['count']+1).' failed '.strtolower($fail_type).' attempts and '.$lockout.' lockout(s) from IP '.$loginizer['current_ip'].' on your site :
'.home_url().'

Last '.$fail_type.' Attempt : '.date('d/M/Y H:i:s P', time()).'
Last User Attempt : '.$username.'
IP has been blocked until : '.date('d/M/Y H:i:s P', time() + $lockout_time).'

Regards,
Loginizer';

				@wp_mail($mail['to'], $mail['subject'], $mail['message']);
			}
		}else{
			$result = array();
			$result['count'] = 0;
			
			$insert_data = array('username' => $username, 
								'time' => time(), 
								'count' => 1, 
								'ip' => $loginizer['current_ip'], 
								'lockout' => 0, 
								'url' => $url);
								
			$format = array('%s','%d','%d','%s','%d','%s');
			
			$wpdb->insert($wpdb->prefix.'loginizer_logs', $insert_data, $format);
		}
	
		// We need to add one as this is a failed attempt as well
		$result['count'] = $result['count'] + 1;
		loginizer_update_attempt_stats(0);
		$loginizer['retries_left'] = ($loginizer['max_retries'] - ($result['count'] % $loginizer['max_retries']));
		$loginizer['retries_left'] = $loginizer['retries_left'] == $loginizer['max_retries'] ? 0 : $loginizer['retries_left'];
		
	}
}

function loginizer_login_success($user_login, $user) {
	global $loginizer;

	loginizer_update_attempt_stats(1);

	if(empty($loginizer['login_mail']['enable'])){
		return;
	}

	if(empty($user_login) && empty($user)){
		error_log('Loginizer: No user information to send email');
		return;
	}

	if(empty($user)){
		$user = get_user_by('login', $user_login);
	}

	if(empty($user)){
		error_log('Loginizer: Unable to get the user');
		return;
	}

	if(empty($loginizer['login_mail']['roles']) || !is_array($loginizer['login_mail']['roles'])){
		return;
	}

	// Check if the user role is enabled for email notification.
	if(!array_intersect($user->roles, $loginizer['login_mail']['roles'])){
		return;
	}

	// Setting up data variables.
	$date = date("Y-m-d H:i:s", time()) . ' ' . date_default_timezone_get();
	$sitename = lz_is_multisite() ? get_site_option('site_name') : get_option('blogname');
	$email = $user->data->user_email;

	$vars = array(
		'date' => $date,
		'ip' => esc_html($loginizer['current_ip']),
		'sitename' => $sitename,
		'user_login' => $user_login
	);

	$message = lz_lang_vars_name($loginizer['login_mail_body'], $vars);
	$subject = lz_lang_vars_name($loginizer['login_mail_subject'], $vars);

	// Sending notification
	if(empty(wp_mail($email, $subject, $message))){
		error_log(__('There was a problem sending your email.', 'loginizer'));
		return;
	}
}

function loginizer_update_attempt_stats($type){

	$stats = get_option('loginizer_login_attempt_stats', []);
	$time = strtotime(date('Y-m-d H:00:00'));
	
	if(empty($stats[$time][$type])){
		$stats[$time][$type] = 0;
	}

	$stats[$time][$type] += 1;

	update_option('loginizer_login_attempt_stats', $stats, false);
}

// Handles the error of the password not being there
function loginizer_error_handler($errors, $redirect_to){
	
	global $wpdb, $loginizer, $lz_user_pass, $lz_cannot_login;
	
	//echo 'loginizer_error_handler :';print_r($errors->errors);echo '<br>';
	if(is_null($errors) || empty($errors)){
		return true;
	}

	// Remove the empty password error
	if(is_wp_error($errors)){
		
		$codes = $errors->get_error_codes();
		
		foreach($codes as $k => $v){
			if($v == 'invalid_username' || $v == 'incorrect_password'){
				$show_error = 1;
			}
		}
		
		$errors->remove('invalid_username');
		$errors->remove('incorrect_password');
	
		// Add the error
		if(!empty($lz_user_pass) && !empty($show_error) && empty($lz_cannot_login)){
			$errors->add('invalid_userpass', '<b>ERROR:</b> ' . $loginizer['msg']['inv_userpass']);
		}
		
		// Add the number of retires left as well
		if(count($errors->get_error_codes()) > 0 && isset($loginizer['retries_left'])){
			$errors->add('retries_left', loginizer_retries_left());
		}

	}
	
	return $errors;
	
}

// Handles the error of the password not being there
function loginizer_woocommerce_error_handler(){
	
	global $wpdb, $loginizer, $lz_user_pass, $lz_cannot_login;
	
	if(function_exists('wc_add_notice')){
		wc_add_notice( loginizer_retries_left(), 'error' );
	}
	
}

// Returns a string with the number of retries left
function loginizer_retries_left(){
	
	global $wpdb, $loginizer, $lz_user_pass, $lz_cannot_login;
	
	// If we are to show the number of retries left
	if(isset($loginizer['retries_left'])){
		$retries_left = apply_filters('loginizer_retries_left_num', $loginizer['retries_left']);
		
		return '<b>'.esc_html($retries_left).'</b> '.$loginizer['msg']['attempts_left'];
	}
	
}

function loginizer_reset_retries(){
	
	global $wpdb, $loginizer;
	
	$deltime = time() - $loginizer['reset_retries'];
	
	$del_query = $wpdb->prepare("DELETE FROM `".$wpdb->prefix."loginizer_logs` WHERE `time` <= %d", $deltime);
	$result = $wpdb->query($del_query);
	
	update_option('loginizer_last_reset', time());
	
}

// Sorry to see you going
register_uninstall_hook(LOGINIZER_FILE, 'loginizer_deactivation');

function loginizer_deactivation(){

global $wpdb;

	$sql = array();
	$sql[] = "DROP TABLE ".$wpdb->prefix."loginizer_logs;";

	foreach($sql as $sk => $sv){
		$wpdb->query($sv);
	}

	delete_option('loginizer_version');
	delete_option('loginizer_options');
	delete_option('loginizer_last_reset');
	delete_option('loginizer_whitelist');
	delete_option('loginizer_blacklist');
	delete_option('loginizer_msg');
	delete_option('loginizer_2fa_msg');
	delete_option('loginizer_2fa_email_template');
	delete_option('loginizer_security');
	delete_option('loginizer_wp_admin');
	delete_option('loginizer_csrf_promo_time');
	delete_option('loginizer_backuply_promo_time');
	delete_option('loginizer_promo_time');
	delete_option('loginizer_ins_time');
	delete_option('loginizer_2fa_whitelist');
	delete_option('loginizer_checksums_last_run');
	delete_option('loginizer_checksums_diff');
	delete_option('loginizer_ip_method');
	delete_option('loginizer_2fa_custom_redirect');
	delete_option('external_updates-loginizer-security');
	delete_option('loginizer_login_attempt_stats');

}