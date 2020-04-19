<?php
/**
 * Featured Posts Block.
 *
 * @package PTAM
 */

namespace PTAM\Includes\Blocks\Featured_Posts;

use PTAM\Includes\Functions as Functions;

/**
 * Featured Posts Block
 */
class Posts {

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
	public function output( $attributes ) {
		ob_start();

		// Get taxonomy.
		$taxonomy = sanitize_text_field( $attributes['taxonomy'] );
		$term     = absint( $attributes['term'] );

		// Get oroder and orderby.
		$orderby = isset( $attributes['orderBy'] ) ? sanitize_text_field( $attributes['orderBy'] ) : '';
		$order   = isset( $attributes['order'] ) ? sanitize_text_field( $attributes['order'] ) : '';

		// Get post type.
		$post_type = isset( $attributes['postType'] ) ? sanitize_text_field( $attributes['postType'] ) : 'post';

		// Get posts per page.
		$posts_per_page = isset( $attributes['postsToShow'] ) ? absint( $attributes['postsToShow'] ) : 2;

		// Build Query.
		$post_args = array(
			'post_type'      => $post_type,
			'post_status'    => 'publish',
			'order'          => $order,
			'orderby'        => $orderby,
			'posts_per_page' => $posts_per_page,
		);
		if ( 'all' !== $term && 0 !== absint( $term ) && 'none' !== $taxonomy ) {
			$post_args['tax_query'] = array( // phpcs:ignore
			array(
				'taxonomy' => $taxonomy,
				'terms'    => $term,
			),
			);
		}

		$attributes['taxonomy']           = Functions::sanitize_attribute( $attributes, 'align', 'text' );
		$attributes['postType']           = Functions::sanitize_attribute( $attributes, 'postType', 'text' );
		$attributes['postLayout']         = Functions::sanitize_attribute( $attributes, 'postLayout', 'text' );
		$attributes['displayPostContent'] = Functions::sanitize_attribute( $attributes, 'displayPostContent', 'bool' );
		$attributes['term']               = Functions::sanitize_attribute( $attributes, 'term', 'int' );
		$attributes['order']              = Functions::sanitize_attribute( $attributes, 'order', 'text' );
		$attributes['orderBy']            = Functions::sanitize_attribute( $attributes, 'orderBy', 'text' );
		$attributes['align']              = Functions::sanitize_attribute( $attributes, 'align', 'text' );
		$attributes['imageTypeSize']      = Functions::sanitize_attribute( $attributes, 'imageTypeSize', 'text' );
		$attributes['postsToShow']        = Functions::sanitize_attribute( $attributes, 'postsToShow', 'int' );
		if ( is_array( $attributes['fallbackImg'] ) ) {
			if ( isset( $attributes['fallbackImg']['id'] ) ) {
				$attributes['fallbackImg'] = $attributes['fallbackImg']['id'];
				$attributes['fallbackImg'] = Functions::sanitize_attribute( $attributes, 'fallbackImg', 'int' );
			} else {
				$attributes['fallbackImg'] = 0;
			}
		} else {
			$attributes['fallbackImg'] = 0;
		}
		$attributes['termDisplayPaddingLeft']             = Functions::sanitize_attribute( $attributes, 'termDisplayPaddingLeft', 'int' );
		$attributes['termDisplayPaddingRight']            = Functions::sanitize_attribute( $attributes, 'termDisplayPaddingRight', 'int' );
		$attributes['termDisplayPaddingBottom']           = Functions::sanitize_attribute( $attributes, 'termDisplayPaddingBottom', 'int' );
		$attributes['termBackgroundColor']                = Functions::sanitize_attribute( $attributes, 'termBackgroundColor', 'text' );
		$attributes['termTextColor']                      = Functions::sanitize_attribute( $attributes, 'termTextColor', 'text' );
		$attributes['termFont']                           = Functions::sanitize_attribute( $attributes, 'termFont', 'text' );
		$attributes['termTitle']                          = Functions::sanitize_attribute( $attributes, 'termTitle', 'text' );
		$attributes['titleFont']                          = Functions::sanitize_attribute( $attributes, 'titleFont', 'text' );
		$attributes['titleFontSize']                      = Functions::sanitize_attribute( $attributes, 'titleFontSize', 'int' );
		$attributes['titleColor']                         = Functions::sanitize_attribute( $attributes, 'titleColor', 'text' );
		$attributes['titleColorHover']                    = Functions::sanitize_attribute( $attributes, 'titleColorHover', 'text' );
		$attributes['containerId']                        = Functions::sanitize_attribute( $attributes, 'containerId', 'text' );
		$attributes['disableStyles']                      = Functions::sanitize_attribute( $attributes, 'disableStyles', 'bool' );
		$attributes['showMeta']                           = Functions::sanitize_attribute( $attributes, 'showMeta', 'bool' );
		$attributes['showMetaAuthor']                     = Functions::sanitize_attribute( $attributes, 'showMetaAuthor', 'bool' );
		$attributes['showMetaDate']                       = Functions::sanitize_attribute( $attributes, 'showMetaDate', 'bool' );
		$attributes['showMetaComments']                   = Functions::sanitize_attribute( $attributes, 'showMetaComments', 'bool' );
		$attributes['showFeaturedImage']                  = Functions::sanitize_attribute( $attributes, 'showFeaturedImage', 'bool' );
		$attributes['showReadMore']                       = Functions::sanitize_attribute( $attributes, 'showReadMore', 'bool' );
		$attributes['showExcerpt']                        = Functions::sanitize_attribute( $attributes, 'showExcerpt', 'bool' );
		$attributes['excerptFont']                        = Functions::sanitize_attribute( $attributes, 'excerptFont', 'text' );
		$attributes['excerptFontSize']                    = Functions::sanitize_attribute( $attributes, 'excerptFontSize', 'int' );
		$attributes['excerptTextColor']                   = Functions::sanitize_attribute( $attributes, 'excerptTextColor', 'text' );
		$attributes['readMoreButtonText']                 = Functions::sanitize_attribute( $attributes, 'readMoreButtonText', 'text' );
		$attributes['readMoreButtonFont']                 = Functions::sanitize_attribute( $attributes, 'readMoreButtonFont', 'text' );
		$attributes['readMoreButtonTextColor']            = Functions::sanitize_attribute( $attributes, 'readMoreButtonTextColor', 'text' );
		$attributes['readMoreButtonTextHoverColor']       = Functions::sanitize_attribute( $attributes, 'readMoreButtonTextHoverColor', 'text' );
		$attributes['readMoreButtonBackgroundColor']      = Functions::sanitize_attribute( $attributes, 'readMoreButtonBackgroundColor', 'text' );
		$attributes['readMoreButtonBackgroundHoverColor'] = Functions::sanitize_attribute( $attributes, 'readMoreButtonBackgroundHoverColor', 'text' );
		$attributes['readMoreButtonBorder']               = Functions::sanitize_attribute( $attributes, 'readMoreButtonBorder', 'int' );
		$attributes['readMoreButtonBorderColor']          = Functions::sanitize_attribute( $attributes, 'readMoreButtonBorderColor', 'text' );
		$attributes['readMoreButtonBorderRadius']         = Functions::sanitize_attribute( $attributes, 'readMoreButtonBorderRadius', 'int' );

		/**
		 * Filter the post query.
		 *
		 * @since 4.5.0
		 *
		 * @param array  $post_args  The post arguments.
		 * @param array  $attributes The passed attributes.
		 * @param string $post_type  The post type.
		 * @param int    $term       The term ID.
		 * @parma string $taxonomy   The taxonomy.
		 */
		$post_args = apply_filters( 'ptam_featured_post_by_term_query', $post_args, $attributes, $post_type, $term, $taxonomy );
		$posts     = get_posts( $post_args );
		/*
		if ( ! $attributes['disableStyles'] ) :
			
			?>
		<style>
			<?php
			if ( 'image' === $attributes['backgroundType'] ) {
				$overlay_color       = Functions::hex2rgba( $attributes['overlayColor'], $attributes['overlayOpacity'] );
				$overlay_color_hover = Functions::hex2rgba( $attributes['overlayColorHover'], $attributes['overlayOpacityHover'] );
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:before {
					content: '';
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: <?php echo esc_html( $overlay_color ); ?>;
					z-index: 1;
				}
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:hover:before {
					background-color: <?php echo esc_html( $overlay_color_hover ); ?>;
				}
				<?php
			}
			if ( 'none' === $attributes['backgroundType'] ) {
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item {
					background: transparent;
				}
				<?php
			}
			if ( 'color' === $attributes['backgroundType'] ) {
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item {
					background-color: <?php echo esc_html( $attributes['backgroundColor'] ); ?>;
				}
				<?php
				if ( $attributes['linkContainer'] ) :
					?>
					#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:hover {
						background-color: <?php echo esc_html( $attributes['backgroundColorHover'] ); ?>;
					}
					<?php
				endif;
				?>
				<?php
			}
			if ( 'gradient' === $attributes['backgroundType'] ) {
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item {
					background-image: <?php echo esc_html( $attributes['backgroundGradient'] ); ?>;
				}
				<?php
				if ( $attributes['linkContainer'] ) :
					?>
					#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:hover {
						background-image: <?php echo esc_html( $attributes['backgroundGradientHover'] ); ?>;
					}
					<?php
				endif;
				?>
				<?php
			}
			?>
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item {
				border-color: <?php echo esc_html( $attributes['itemBorderColor'] ); ?>;
				border-width: <?php echo absint( $attributes['itemBorder'] ); ?>px;
				border-radius: <?php echo absint( $attributes['itemBorderRadius'] ); ?>%;
				border-style: solid;
			}
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item h2,
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item h2 a,
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item h2 a:hover {
				color: <?php echo esc_html( $attributes['termTitleColor'] ); ?>;
				text-decoration: none;
				font-family: '<?php echo esc_html( $attributes['termTitleFont'] ); ?>';
			}
			<?php
			if ( $attributes['linkContainer'] ) :
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:hover h2,
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:hover h2 a,
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:hover h2 a:hover {
					color: <?php echo esc_html( $attributes['termTitleColorHover'] ); ?>;
				}
				<?php
			endif;
			?>
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item .ptam-term-grid-item-description {
				color: <?php echo esc_html( $attributes['termDescriptionColor'] ); ?>;
				font-family: '<?php echo esc_html( $attributes['termDescriptionFont'] ); ?>';
			}
			<?php
			if ( $attributes['linkContainer'] ) :
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:hover .ptam-term-grid-item-description {
					color: <?php echo esc_html( $attributes['termDescriptionColorHover'] ); ?>;
				}
				<?php
			endif;
			?>
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item .ptam-term-grid-button {
				color: <?php echo esc_html( $attributes['termButtonTextColor'] ); ?>;
				background-color: <?php echo esc_html( $attributes['termButtonBackgroundColor'] ); ?>;
				border-width: <?php echo absint( $attributes['termButtonBorder'] ); ?>px;
				border-color: <?php echo esc_html( $attributes['termButtonBorderColor'] ); ?>;
				border-radius: <?php echo absint( $attributes['termButtonBorderRadius'] ); ?>px;
				font-family: '<?php echo esc_html( $attributes['termButtonFont'] ); ?>';
				border-style: solid;
			}
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item .ptam-term-grid-button:hover {
				background-color: <?php echo esc_html( $attributes['termButtonBackgroundHoverColor'] ); ?>;
				color: <?php echo esc_html( $attributes['termButtonTextHoverColor'] ); ?>;
				text-decoration: none;
			}
		</style>
			<?php
			endif;
		?>
		*/

		$term_name = _x( 'All', 'All Terms', 'post-type-archive-mapping' );
		$term_object = get_term_by( 'id', $term, $taxonomy );
		if ( ! is_wp_error( $term_object ) ) {
			$term_name = sanitize_text_field( $term_object->name );
			if ( ! empty( $attributes['termTitle'] ) ) {
				$term_name = $attributes['termTitle'];
			}
		}
		?>
		<div className="ptam-fp-wrapper" id="<?php echo esc_attr( $attributes['containerId'] ); ?>">
			<h4 className="ptam-fp-term"><span><?php echo esc_html( $term_name ); ?></span></h4>
		</div><!-- .ptam-fp-wrapper -->

		<?php
		return ob_get_clean();
		foreach ( $posts as &$post ) {
			$thumbnail = get_the_post_thumbnail( $post->ID, $attributes['imageTypeSize'] );
			if ( empty( $thumbnail ) ) {
				$thumbnail = wp_get_attachment_image( $attributes['fallbackImg'], $attributes['imageTypeSize'] );
			}
			$post->featured_image_src = $thumbnail;

			// Get author information.
			$display_name = get_the_author_meta( 'display_name', $post->post_author );
			$author_url   = get_author_posts_url( $post->post_author );

			$post->author_info               = new \stdClass();
			$post->author_info->display_name = $display_name;
			$post->author_info->author_link  = $author_url;

			$post->link = get_permalink( $post->ID );

			if ( empty( $post->post_excerpt ) ) {
				$post->post_excerpt = apply_filters( 'the_excerpt', wp_strip_all_tags( strip_shortcodes( $post->post_content ) ) );
			}

			if ( ! $post->post_excerpt ) {
				$post->post_excerpt = null;
			}

			$post->post_excerpt = wp_kses_post( $post->post_excerpt );
			$post->post_content = apply_filters( 'ptam_the_content', $post->post_content );
		}
		/**
		 * Override the Featured Posts Output.
		 *
		 * @since 4.5.0
		 *
		 * @param string $html             The grid HTML.
		 * @param array  $attributes       The passed and sanitized attributes.
		 */
		return apply_filters( 'ptam_featured_posts_by_term_output', ob_get_clean(), $attributes );
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
			'ptam/featured-posts',
			array(
				'attributes'      => array(
					'taxonomy'                           => array(
						'type'    => 'string',
						'default' => 'category',
					),
					'postType'                           => array(
						'type'    => 'string',
						'default' => 'post',
					),
					'postLayout'                         => array(
						'type'    => 'string',
						'default' => 'excerpt',
					),
					'displayPostContent'                 => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'term'                               => array(
						'type'    => 'string',
						'default' => '0',
					),
					'postsInclude'                       => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'postsExclude'                       => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'order'                              => array(
						'type'    => 'string',
						'default' => 'DESC',
					),
					'orderBy'                            => array(
						'type'    => 'string',
						'default' => 'date',
					),
					'align'                              => array(
						'type'    => 'string',
						'default' => 'wide',
					),
					'avatarSize'                         => array(
						'type'    => 'integer',
						'default' => 500,
					),
					'imageType'                          => array(
						'type'    => 'string',
						'default' => 'regular',
					),
					'imageTypeSize'                      => array(
						'type'    => 'string',
						'default' => 'thumbnail',
					),
					'imageCrop'                          => array(
						'type'    => 'string',
						'default' => 'landscape',
					),
					'fallbackImg'                        => array(
						'type'    => 'object',
						'default' => '',
					),
					'postsToShow'                        => array(
						'type'    => 'integer',
						'default' => 2,
					),
					'termDisplayPaddingLeft'             => array(
						'type'    => 'integer',
						'default' => 20,
					),
					'termDisplayPaddingRight'            => array(
						'type'    => 'integer',
						'default' => 20,
					),
					'termDisplayPaddingTop'              => array(
						'type'    => 'integer',
						'default' => 10,
					),
					'termDisplayPaddingBottom'           => array(
						'type'    => 'integer',
						'default' => 10,
					),
					'termBackgroundColor'                => array(
						'type'    => 'string',
						'default' => '#128c20',
					),
					'termTextColor'                      => array(
						'type'    => 'string',
						'default' => '#FFFFFF',
					),
					'termFont'                           => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'termFontSize'                       => array(
						'type'    => 'integer',
						'default' => 20,
					),
					'termTitle'                          => array(
						'type'    => 'string',
						'default' => '',
					),
					'titleFont'                          => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'titleFontSize'                      => array(
						'type'    => 'integer',
						'default' => 24,
					),
					'titleColor'                         => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'titleColorHover'                    => array(
						'type'    => 'string',
						'default' => '#128c20',
					),
					'containerId'                        => array(
						'type'    => 'string',
						'default' => 'ptam-featured-post-list',
					),
					'disableStyles'                      => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'showMeta'                           => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showMetaAuthor'                     => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showMetaDate'                       => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showMetaComments'                   => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'showFeaturedImage'                  => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showReadMore'                       => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showExcerpt'                        => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'excerptFont'                        => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'excerptFontSize'                    => array(
						'type'    => 'integer',
						'default' => 18,
					),
					'excerptTextColor'                   => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'readMoreButtonText'                 => array(
						'type'    => 'string',
						'default' => __( 'Read More', 'post-type-archive-mapping' ),
					),
					'readMoreButtonFont'                 => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'readMoreButtonTextColor'            => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'readMoreButtonTextHoverColor'       => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'readMoreButtonBackgroundColor'      => array(
						'type'    => 'string',
						'default' => '#CCCCCC',
					),
					'readMoreButtonBackgroundHoverColor' => array(
						'type'    => 'string',
						'default' => '#adadad',
					),
					'readMoreButtonBorder'               => array(
						'type'    => 'integer',
						'default' => 0,
					),
					'readMoreButtonBorderColor'          => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'readMoreButtonBorderRadius'         => array(
						'type'    => 'integer',
						'default' => 10,
					),
				),
				'render_callback' => array( $this, 'output' ),
				'editor_script'   => 'ptam-custom-posts-gutenberg',
				'editor_style'    => 'ptam-style-editor-css',
			)
		);
	}
}
