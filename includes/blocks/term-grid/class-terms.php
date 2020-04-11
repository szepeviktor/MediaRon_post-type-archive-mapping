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
		ob_start();

		// Get terms to include.
		$terms = isset( $attributes['terms'] ) ? $attributes['terms'] : array();
		if ( ! is_array( $terms ) || empty( $terms ) ) {
			return ob_get_clean();
		}

		// Get terms to exclude.
		$terms_exclude = isset( $attributes['termsExclude'] ) ? $attributes['termsExclude'] : array();
		if ( ! is_array( $terms_exclude ) ) {
			return ob_get_clean();
		}

		// Get oroder and orderby.
		$order_by = isset( $attributes['orderBy'] ) ? sanitize_text_field( $attributes['orderBy'] ) : '';
		$order    = isset( $attributes['order'] ) ? sanitize_text_field( $attributes['order'] ) : '';

		// Get All Terms again so we have a full list.
		$all_terms    = get_terms(
			array(
				'taxonomy'   => isset( $attributes['taxonomy'] ) ? sanitize_text_field( $attributes['taxonomy'] ) : '',
				'hide_empty' => true,
			)
		);
		$all_term_ids = array();
		foreach ( $all_terms as $index => $term ) {
			$all_term_ids[] = $term->term_id;
		}

		// Populate terms to display.
		$display_all_terms = false;
		$terms_to_include  = array();
		foreach ( $terms as $index => $term_data ) {
			if ( 0 === $term_data['id'] ) {
				$display_all_terms = true;
				$terms_to_include  = $all_term_ids;
				break;
			} else {
				$terms_to_include[] = absint( $term_data['id'] );
			}
		}

		$terms_to_exclude = array();
		foreach ( $terms_exclude as $index => $term_data ) {
			if ( isset( $term_data['id'] ) ) {
				$terms_to_exclude[] = absint( $term_data['id'] );
			}
		}

		// Now let's get terms to exclude.
		if ( $display_all_terms ) {
			foreach ( $terms_to_include as $index => $term_id ) {
				if ( in_array( $term_id, $terms_to_exclude, true ) ) {
					unset( $terms_to_include[ $index ] );
				}
			}
		}

		// Build Query.
		$query = array();
		switch ( $order_by ) {
			case 'slug':
				$query = array(
					'orderby'    => 'slug',
					'order'      => $order,
					'hide_empty' => true,
					'include'    => $terms_to_include,
					'taxonomy'   => $taxonomy,
				);
				break;
			case 'order':
				$query = array(
					'orderby'    => 'meta_value_num',
					'order'      => $order,
					'meta_query' => array( // phpcs:ignore
						'relation' => 'OR',
						array(
							'key'     => 'post_order',
							'compare' => 'NOT EXISTS',
						),
						array(
							'key'     => 'post_order',
							'value'   => 0,
							'compare' => '>=',
						),
					),
					'hide_empty' => true,
					'include'    => $terms_to_include,
					'taxonomy'   => $taxonomy,
				);
				break;
			default:
				$query = array(
					'orderby'    => 'name',
					'order'      => $order,
					'hide_empty' => true,
					'include'    => $terms_to_include,
					'taxonomy'   => $taxonomy,
				);
				break;
		}

		// Retrieve the terms in order.
		$raw_term_results = get_terms( $query );
		if ( is_wp_error( $raw_term_results ) ) {
			return ob_get_clean();
		}

		// Sanitize variables.
		$text_vars = array(
			'backgroundImageSource',
			'backgroundImageMeta',
			'backgroundGradient',
			'backgroundType',
			'termTitleColor',
			'termDescriptionColor',
			'itemBorderColor',
			'termTitleFont',
			'termDescriptionFont',
			'termButtonText',
			'termButtonFont',
			'termButtonTextColor',
			'termButtonTextHoverColor',
			'termButtonBackgroundColor',
			'termButtonBackgroundHoverColor',
			'termButtonBorderColor',
			'overlayColor',
		);
		$int_vars  = array(
			'itemBorder',
			'itemBorderRadius',
			'termButtonBorder',
			'termButtonBorderRadius',
			'overlayOpacity',
		);
		$bool_vars = array(
			'linkContainer',
			'showTermTitle',
			'showTermDescription',
			'disableStyles',
			'showButton',
		);
		foreach ( $text_vars as $index => $attribute ) {
			if ( isset( $attributes[ $attribute ] ) ) {
				$attributes[ $attribute ] = sanitize_text_field( $attributes[ $attribute ] );
			}
		}
		foreach ( $int_vars as $index => $attribute ) {
			if ( isset( $attributes[ $attribute ] ) ) {
				$attributes[ $attribute ] = filter_var( $attributes[ $attribute ] );
			}
		}
		/*
		foreach ( $int as $index => $attribute ) {
			if ( in_array( $attribute, $attributes, true ) ) {
				$attributes[ $attribute ] = intval( $attributes[ $attribute ] );
			}
		}*/

		echo '<pre>' . print_r( $attributes, true ) . '</pre>';
		/*
		// Get data for each term.
		foreach ( $raw_term_results as &$term ) {
			$term->permalink        = get_term_link( $term );
			$term->background_image = Functions::get_term_image(
				$background_image_size,
				$background_image_meta_key,
				$background_image_source,
				$taxonomy,
				$term->term_id
			);
			if ( empty( $term->background_image ) ) {
				$term->background_image = isset( $background_fallback_image['id'] ) ? absint( $background_fallback_image['id'] ) : 0;
				$fallback_image         = wp_get_attachment_url( $term->background_image );
				if ( $fallback_image ) {
					$term->background_image = $fallback_image;
				}
			}
		}
		?>
		<div id="<?php echo isset( $attributes['containerId'] ) ? esc_attr( $attributes['containerId'] ) : ''; ?>">

		</div>

		*/
		return ob_get_clean();
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
					'taxonomy'                       => array(
						'type'    => 'string',
						'default' => 'category',
					),
					'terms'                          => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'termsExclude'                   => array(
						'type'    => 'array',
						'default' => array( '' ),
					),
					'order'                          => array(
						'type'    => 'string',
						'default' => 'desc',
					),
					'orderBy'                        => array(
						'type'    => 'string',
						'default' => 'name',
					),
					'align'                          => array(
						'type'    => 'string',
						'default' => 'full',
					),
					'columns'                        => array(
						'type'    => 'integer',
						'default' => 2,
					),
					'showTermTitle'                  => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showTermDescription'            => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'disableStyles'                  => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'linkContainer'                  => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'linkTermTitle'                  => array(
						'type'    => 'boolean',
						'default' => true,
					),
					'showButton'                     => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'backgroundImageSource'          => array(
						'type'    => 'string',
						'default' => 'none',
					),
					'backgroundImageMeta'            => array(
						'type'    => 'string',
						'default' => '',
					),
					'backgroundImageFallback'        => array(
						'type'    => 'object',
						'default' => '',
					),
					'imageSize'                      => array(
						'type'    => 'string',
						'default' => 'large',
					),
					'containerId'                    => array(
						'type'    => 'string',
						'default' => 'ptam-term-grid-wrapper',
					),
					'backgroundType'                 => array(
						'type'    => 'string',
						'default' => 'color',
					),
					'backgroundColor'                => array(
						'type'    => 'string',
						'default' => '#CCCCCC',
					),
					'backgroundGradient'             => array(
						'type'    => 'string',
						'default' => '',
					),
					'overlayColor'                   => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'overlayOpacity'                 => array(
						'type'    => 'number',
						'default' => 0.3,
					),
					'termTitleColor'                 => array(
						'type'    => 'string',
						'default' => '#FFFFFF',
					),
					'termDescriptionColor'           => array(
						'type'    => 'string',
						'default' => '#FFFFFF',
					),
					'itemBorder'                     => array(
						'type'    => 'integer',
						'default' => 0,
					),
					'itemBorderColor'                => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'itemBorderRadius'               => array(
						'type'    => 'integer',
						'default' => 0,
					),
					'termTitleFont'                  => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'termDescriptionFont'            => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'termButtonText'                 => array(
						'type'    => 'string',
						'default' => __( 'Learn More...', 'post-type-archive-mapping' ),
					),
					'termButtonFont'                 => array(
						'type'    => 'string',
						'default' => 'inherit',
					),
					'termButtonTextColor'            => array(
						'type'    => 'string',
						'default' => '#FFFFFF',
					),
					'termButtonTextHoverColor'       => array(
						'type'    => 'string',
						'default' => '#FFFFFF',
					),
					'termButtonBackgroundColor'      => array(
						'type'    => 'string',
						'default' => '#32373c',
					),
					'termButtonBackgroundHoverColor' => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'termButtonBorder'               => array(
						'type'    => 'integer',
						'default' => 0,
					),
					'termButtonBorderColor'          => array(
						'type'    => 'string',
						'default' => '#000000',
					),
					'termButtonBorderRadius'         => array(
						'type'    => 'integer',
						'default' => 28,
					),

				),
				'render_callback' => array( $this, 'term_grid' ),
				'editor_script'   => 'ptam-custom-posts-gutenberg',
				'editor_style'    => 'ptam-style-editor-css',
			)
		);
	}
}
