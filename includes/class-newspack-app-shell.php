<?php
/**
 * Newspack App Shell
 *
 * @package Newspack_App_Shell
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main Newspack App Shell Class.
 */
final class Newspack_App_Shell {
	const NEWSPACK_APP_SHELL_CPT = 'app_shell_cpt';

	/**
	 * The single instance of the class.
	 *
	 * @var Newspack_App_Shell
	 */
	protected static $instance = null;

	/**
	 * Main Newspack App Shell Instance.
	 * Ensures only one instance of Newspack App Shell is loaded or can be loaded.
	 *
	 * @return Newspack App Shell - Main instance.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register WP hooks.
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_script' ) );
		add_action( 'admin_menu', array( __CLASS__, 'add_menu_item' ) );
		add_action( 'init', array( __CLASS__, 'register_cpt' ) );
		add_action( 'wp_footer', array( __CLASS__, 'insert_persistent_content' ) );
	}

	/**
	 * Register custom post type to store persistent element.
	 */
	public static function register_cpt() {
		$cpt_args = array(
			'labels'       => array(),
			'public'       => false,
			'show_ui'      => true,
			'show_in_rest' => true,
			'supports'     => array( 'editor' ),
		);
		\register_post_type( self::NEWSPACK_APP_SHELL_CPT, $cpt_args );
	}


	/**
	 * Add menu item. If the custom post exists, link to editing. If not, link to new post.
	 */
	public static function add_menu_item() {
		$id     = self::post_id();
		$action = $id ? 'Edit' : 'Add';
		$url    = $id ? admin_url( '/post.php?post=' . $id . '&action=edit' ) : admin_url( '/post-new.php?post_type=' . self::NEWSPACK_APP_SHELL_CPT );

		add_menu_page(
			$action . ' Persistent element',
			$action . ' Persistent element',
			'manage_options',
			$url,
			'',
			'',
			26
		);
	}

	/**
	 * Check if there is a post to store the persistent content.
	 */
	public static function post_id() {
		$query = new WP_Query(
			array(
				'post_type' => self::NEWSPACK_APP_SHELL_CPT,
			)
		);
		if ( $query->have_posts() ) {
			return $query->posts[0]->ID;
		}
	}

	/**
	 * Insert the persistent content
	 */
	public static function insert_persistent_content() {
		$id = self::post_id();
		if ( $id ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo get_post( $id )->post_content;
		}
	}

	/**
	 * Load client JS script
	 */
	public static function enqueue_script() {
		wp_register_script(
			'newspack-app-shell',
			plugins_url( '/newspack-app-shell' ) . '/dist/client.js',
			array(),
			filemtime( dirname( NEWSPACK_APP_SHELL_PLUGIN_FILE ) . '/dist/client.js' ),
			true
		);
		wp_enqueue_script( 'newspack-app-shell' );

		$exports = array(
			'homeUrl'  => home_url( '/' ),
			'adminUrl' => admin_url( '/' ),
		);
		wp_add_inline_script(
			'newspack-app-shell',
			sprintf( 'var APP_SHELL_WP_DATA = %s;', wp_json_encode( $exports ) ),
			'before'
		);
	}
}

Newspack_App_Shell::instance();
