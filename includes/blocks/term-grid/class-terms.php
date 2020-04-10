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
					'taxonomy'                => array(
						'type'    => 'string',
						'default' => 'category',
					),
					'terms'                   => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'termsExclude'            => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'order'                   => array(
						'type'    => 'string',
						'default' => 'desc',
					),
					'orderBy'                 => array(
						'type'    => 'string',
						'default' => 'name',
					),
					'align'                   => array(
						'type'    => 'string',
						'default' => 'full',
					),
					'columns'                 => array(
						'type'    => 'integer',
						'default' => 2,
					),
					'showTermTitle'           => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showTermDescription'     => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'disableStyles'           => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'linkContainer'           => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'backgroundImageSource'   => array(
						'type'    => 'string',
						'default' => 'none',
					),
					'backgroundImageMeta'     => array(
						'type'    => 'string',
						'default' => '',
					),
					'backgroundImageFallback' => array(
						'type'    => 'object',
						'default' => '',
					),
					'imageSize'               => array(
						'type'    => 'string',
						'default' => 'large',
					),
					'containerId'             => array(
						'type'    => 'string',
						'default' => 'ptam-term-grid-wrapper',
					),
					'overlayColor' => array(
						'type' => 'string',
						'default' => '#000000',
					),
					'overlayOpacity'             => array(
						'type'    => 'number',
						'default' => 0.8,
					),
				),
				'render_callback' => array( $this, 'term_grid' ),
				'editor_script'   => 'ptam-custom-posts-gutenberg',
				'editor_style'    => 'ptam-style-editor-css',
			)
		);
	}
}
