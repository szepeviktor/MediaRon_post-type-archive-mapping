<?php
/**
 * Terms Block.
 *
 * @package PTAM
 */

namespace PTAM\Includes\Blocks\Term_Grid;

/**
 * Custom Post Types Block helper methods.
 */
class Terms {

	/**
	 * Initialize hooks/actions for class.
	 */
	public function run() {
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Retrieve a list of terms for display.
	 *
	 * @param array $attributes Array of passed attributes.
	 *
	 * @return string HTML of the custom posts.
	 */
	public function term_grid( $attributes ) {
		return 'hello world';
	}

	/**
	 * Registers the block on server.
	 */
	public function register_block() {

		// Check if the register function exists.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type(
			'ptam/term-grid',
			array(
				'attributes'      => array(
					'taxonomy' => array(
						'type'    => 'string',
						'default' => 'category',
					),
					'terms'    => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'termsExclude'    => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'order'    => array(
						'type'    => 'string',
						'default' => 'desc',
					),
					'orderBy'  => array(
						'type'    => 'string',
						'default' => 'name',
					),
					'align'                  => array(
						'type'    => 'string',
						'default' => 'full',
					),
				),
				'render_callback' => array( $this, 'term_grid' ),
				'editor_script'   => 'ptam-custom-posts-gutenberg',
				'editor_style'    => 'ptam-style-editor-css',
			)
		);
	}
}
