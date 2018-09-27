<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package Post Type Archive Mapping
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue assets for frontend and backend
 *
 * @since 1.0.0
 */
function ptam_blocks_block_assets() {
	
	// Load the compiled styles
	wp_enqueue_style(
		'ptam-style-css',
		PostTypeArchiveMapping::get_plugin_url( 'assets/dist/css/gutenberg.css'),
		array( 'wp-blocks' ),
		'20180927' );

	// Load the FontAwesome icon library
	wp_enqueue_style(
		'ptam-fontawesome',
		PostTypeArchiveMapping::get_plugin_url( 'assets/dist/fontawesome/css/all.css'),
		array( 'wp-blocks' ),
		'20180927' );
} 
add_action( 'enqueue_block_assets', 'ptam_blocks_block_assets' );


/**
 * Enqueue assets for backend editor
 *
 * @since 1.0.0
 */
function ptam_blocks_editor_assets() {

	// Load the compiled blocks into the editor
	wp_enqueue_script(
		'ptam-custom-posts-gutenberg',
		PostTypeArchiveMapping::get_plugin_url( 'assets/dist/js/gutenberg.js'),
		array( 'wp-blocks', 'wp-element' )
	);

	// Pass in REST URL
	wp_localize_script(
		'ptam-custom-posts-gutenberg',
		'ptam_globals',
		array( 
			'rest_url' => esc_url( rest_url() )
		)
	);
}
add_action( 'enqueue_block_editor_assets', 'ptam_blocks_editor_assets' );