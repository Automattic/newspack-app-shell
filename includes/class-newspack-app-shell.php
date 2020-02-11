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
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_scripts_and_style' ) );
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_block_editor_assets' ) );
		add_action( 'admin_menu', array( __CLASS__, 'add_menu_item' ) );
		add_action( 'init', array( __CLASS__, 'register_cpt' ) );
		add_action( 'init', array( __CLASS__, 'register_meta' ) );
		add_action( 'wp_footer', array( __CLASS__, 'insert_persistent_content' ) );
	}

	/**
	 * Register custom post type to store persistent element.
	 */
	public static function register_cpt() {
		$cpt_args = array(
			'public'       => false,
			'show_in_menu' => false,
			'show_ui'      => true,
			'show_in_rest' => true,
			'supports'     => array( 'editor', 'custom-fields' ),
		);
		\register_post_type( self::NEWSPACK_APP_SHELL_CPT, $cpt_args );
	}

	/**
	 * Register meta fields for the CPT.
	 */
	public static function register_meta() {
		\register_meta(
			'post',
			'is_bottom_fixed',
			array(
				'object_subtype' => self::NEWSPACK_APP_SHELL_CPT,
				'show_in_rest'   => true,
				'type'           => 'boolean',
				'single'         => true,
				'auth_callback'  => '__return_true',
			)
		);
		\register_meta(
			'post',
			'is_top_fixed',
			array(
				'object_subtype' => self::NEWSPACK_APP_SHELL_CPT,
				'show_in_rest'   => true,
				'type'           => 'boolean',
				'single'         => true,
				'auth_callback'  => '__return_true',
			)
		);
	}

	/**
	 * Add menu item. If the custom post exists, link to editing. If not, link to new post.
	 */
	public static function add_menu_item() {
		$id     = self::post_id();
		$action = $id ? 'Edit' : 'Add';
		$url    = $id ? admin_url( '/post.php?post=' . $id . '&action=edit' ) : admin_url( '/post-new.php?post_type=' . self::NEWSPACK_APP_SHELL_CPT );

		add_menu_page(
			$id ? __( 'Edit Persistent element', 'newspack-app-shell' ) : __( 'Add Persistent element', 'newspack-app-shell' ),
			$id ? __( 'Edit Persistent element', 'newspack-app-shell' ) : __( 'Add Persistent element', 'newspack-app-shell' ),
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
		$posts = get_posts(
			array(
				'post_type'      => self::NEWSPACK_APP_SHELL_CPT,
				'posts_per_page' => 1,
				'fields'         => 'ids',
			)
		);
		return $posts ? $posts[0] : false;
	}

	/**
	 * Insert the persistent content
	 */
	public static function insert_persistent_content() {
		$id              = self::post_id();
		$is_top_fixed    = get_post_meta( $id, 'is_top_fixed', true );
		$is_bottom_fixed = get_post_meta( $id, 'is_bottom_fixed', true );
		$classes         = array(
			'newspack-app-shell-wrapper',
			$is_bottom_fixed ? 'newspack-app-shell-wrapper--bottom-fixed' : '',
			$is_top_fixed ? 'newspack-app-shell-wrapper--top-fixed' : '',
		);
		if ( $id ) {
			?>
			<span class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
				<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo get_the_content( null, false, $id );
				?>
			</span>
			<?php
		}
	}

	/**
	 * Load client JS script
	 */
	public static function enqueue_scripts_and_style() {
		if ( ! self::post_id() ) {
			// No persistent element set, bail.
			return;
		}

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

		self::enqueue_style();
	}

	/**
	 * Load client CSS
	 */
	public static function enqueue_style() {
		wp_register_style(
			'newspack-app-shell-client',
			plugins_url( '/newspack-app-shell' ) . '/dist/client.css',
			null,
			filemtime( dirname( NEWSPACK_APP_SHELL_PLUGIN_FILE ) . '/dist/client.css' )
		);
		wp_enqueue_style( 'newspack-app-shell-client' );
	}

	/**
	 * Load editor JS script
	 */
	public static function enqueue_block_editor_assets() {
		$screen = get_current_screen();
		if ( self::NEWSPACK_APP_SHELL_CPT !== $screen->post_type ) {
			return;
		}

		wp_register_script(
			'newspack-app-shell-editor',
			plugins_url( '/newspack-app-shell' ) . '/dist/editor.js',
			array(),
			filemtime( dirname( NEWSPACK_APP_SHELL_PLUGIN_FILE ) . '/dist/editor.js' ),
			true
		);
		wp_enqueue_script( 'newspack-app-shell-editor' );
	}
}

Newspack_App_Shell::instance();
