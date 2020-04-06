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
					'postType'             => array(
						'type'    => 'string',
						'default' => 'post',
					),
					'imageLocation'        => array(
						'type'    => 'string',
						'default' => 'regular',
					),
					'changeCapitilization' => array(
						'type'  => 'boolean',
						'value' => false,
					),
					'imageSize'            => array(
						'type'    => 'string',
						'default' => 'ptam-block-post-grid-landscape',
					),
					'imageTypeSize'        => array(
						'type'    => 'string',
						'default' => 'thumbnail',
					),
					'imageType'            => array(
						'type'    => 'string',
						'default' => 'regular',
					),
					'avatarSize'           => array(
						'type'    => 'int',
						'default' => 500,
					),
					'taxonomy'             => array(
						'type'    => 'string',
						'default' => 'category',
					),
					'displayTaxonomies'    => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'taxonomyLocation'     => array(
						'type'    => 'string',
						'default' => 'regular',
					),
					'term'                 => array(
						'type'    => 'int',
						'default' => 0,
					),
					'terms'                => array(
						'type'    => 'string',
						'default' => 'all',
					),
					'context'              => array(
						'type'    => 'string',
						'default' => 'view',
					),
					'className'            => array(
						'type' => 'string',
					),
					'postsToShow'          => array(
						'type'    => 'number',
						'default' => 6,
					),
					'pagination'           => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'displayTitle'         => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayTitleLink'     => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayCustomFields'  => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'displayPostDate'      => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayPostContent'   => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'displayPostExcerpt'   => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayPostAuthor'    => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayPostImage'     => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'displayPostLink'      => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'postLayout'           => array(
						'type'    => 'string',
						'default' => 'grid',
					),
					'columns'              => array(
						'type'    => 'int',
						'default' => 2,
					),
					'align'                => array(
						'type'    => 'string',
						'default' => 'center',
					),
					'width'                => array(
						'type'    => 'string',
						'default' => 'wide',
					),
					'order'                => array(
						'type'    => 'string',
						'default' => 'desc',
					),
					'orderBy'              => array(
						'type'    => 'string',
						'default' => 'date',
					),
					'imageCrop'            => array(
						'type'    => 'string',
						'default' => 'landscape',
					),
					'readMoreText'         => array(
						'type'    => 'string',
						'default' => 'Continue Reading',
					),
					'trimWords'            => array(
						'type'    => 'int',
						'default' => 55,
					),
					'titleAlignment'       => array(
						'type'    => 'string',
						'default' => 'left',
					),
					'customFieldAlignment' => array(
						'type'    => 'string',
						'default' => 'left',
					),
					'imageAlignment'       => array(
						'type'    => 'string',
						'default' => 'left',
					),
					'metaAlignment'        => array(
						'type'    => 'string',
						'default' => 'left',
					),
					'contentAlignment'     => array(
						'type'    => 'string',
						'default' => 'left',
					),
					'padding'              => array(
						'type'    => 'int',
						'default' => 0,
					),
					'border'               => array(
						'type'    => 'int',
						'default' => 0,
					),
					'borderRounded'        => array(
						'type'    => 'number',
						'default' => 0,
					),
					'borderColor'          => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'backgroundColor'      => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'titleColor'           => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'customFieldsColor'    => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'linkColor'            => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'contentColor'         => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'continueReadingColor' => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'titleFont'            => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'customFieldsFont'     => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'metaFont'             => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'contentFont'          => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'continueReadingFont'  => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'customFields'         => array(
						'type'    => 'string',
						'default' => '',
					),
					'removeStyles'         => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'titleHeadingTag'      => array(
						'type'    => 'string',
						'default' => 'h2',
					),
					'fallbackImg'          => array(
						'type'    => 'object',
						'default' => '',
					),
				),
				'render_callback' => array( $this, 'term_grid' ),
				'editor_script'   => 'ptam-custom-posts-gutenberg',
				'editor_style'    => 'ptam-style-editor-css',
			)
		);
	}
}
