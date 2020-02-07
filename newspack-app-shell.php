<?php
/**
 * Plugin Name: Newspack App Shell
 * Description: A stripped down version of PWA's App Shell architecture, with the goal of displaying elements that are persistent throughout navigation.
 * Version: 1.0.0
 * Author: Automattic
 * Author URI: https://newspack.blog/
 * License: GPL2
 * Text Domain: newspack-app-shell
 * Domain Path: /languages/
 *
 * @package Newspack_App_Shell
 */

defined( 'ABSPATH' ) || exit;

// Define NEWSPACK_APP_SHELL_PLUGIN_FILE.
if ( ! defined( 'NEWSPACK_APP_SHELL_PLUGIN_FILE' ) ) {
	define( 'NEWSPACK_APP_SHELL_PLUGIN_FILE', __FILE__ );
}

// Include the main Newspack App Shell class.
if ( ! class_exists( 'Newspack_App_Shell' ) ) {
	include_once dirname( __FILE__ ) . '/includes/class-newspack-app-shell.php';
}
