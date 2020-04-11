<?php
/**
 * Terms Block.
 *
 * @package PTAM
 */

namespace PTAM\Includes\Blocks\Term_Grid;

use PTAM\Includes\Functions as Functions;

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

		// Get taxonomy.
		$taxonomy = sanitize_text_field( $attributes['taxonomy'] );

		// Get terms to exclude.
		$terms_exclude = isset( $attributes['termsExclude'] ) ? $attributes['termsExclude'] : array();
		if ( ! is_array( $terms_exclude ) ) {
			return ob_get_clean();
		}

		// Get oroder and orderby.
		$order_by = isset( $attributes['orderBy'] ) ? sanitize_text_field( $attributes['orderBy'] ) : '';
		$order    = isset( $attributes['order'] ) ? sanitize_text_field( $attributes['order'] ) : '';

		// Get All Terms again so we have a full list.
		$all_terms = get_terms(
			array(
				'taxonomy'   => isset( $attributes['taxonomy'] ) ? sanitize_text_field( $attributes['taxonomy'] ) : '',
				'hide_empty' => true,
			)
		);
		if ( is_wp_error( $all_terms ) ) {
			return ob_get_clean();
		}
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

		$attributes['align']                 = Functions::sanitize_attribute( $attributes, 'align', 'text' );
		$attributes['columns']               = Functions::sanitize_attribute( $attributes, 'columns', 'int' );
		$attributes['showTermTitle']         = Functions::sanitize_attribute( $attributes, 'showTermTitle', 'bool' );
		$attributes['showTermDescription']   = Functions::sanitize_attribute( $attributes, 'showTermDescription', 'bool' );
		$attributes['disableStyles']         = Functions::sanitize_attribute( $attributes, 'disableStyles', 'bool' );
		$attributes['linkContainer']         = Functions::sanitize_attribute( $attributes, 'linkContainer', 'bool' );
		$attributes['linkTermTitle']         = Functions::sanitize_attribute( $attributes, 'linkTermTitle', 'bool' );
		$attributes['showButton']            = Functions::sanitize_attribute( $attributes, 'showButton', 'bool' );
		$attributes['backgroundImageSource'] = Functions::sanitize_attribute( $attributes, 'backgroundImageSource', 'text' );
		$attributes['backgroundImageMeta']   = Functions::sanitize_attribute( $attributes, 'backgroundImageMeta', 'text' );
		if ( is_array( $attributes['backgroundImageFallback'] ) ) {
			if ( isset( $attributes['backgroundImageFallback']['id'] ) ) {
				$attributes['backgroundImageFallback'] = $attributes['backgroundImageFallback']['id'];
				$attributes['backgroundImageFallback'] = Functions::sanitize_attribute( $attributes, 'backgroundImageFallback', 'int' );
			} else {
				$attributes['backgroundImageFallback'] = 0;
			}
		} else {
			$attributes['backgroundImageFallback'] = 0;
		}
		$attributes['backgroundColor']                = Functions::sanitize_attribute( $attributes, 'backgroundColor', 'text' );
		$attributes['backgroundGradient']             = Functions::sanitize_attribute( $attributes, 'backgroundGradient', 'text' );
		$attributes['overlayColor']                   = Functions::sanitize_attribute( $attributes, 'overlayColor', 'text' );
		$attributes['overlayOpacity']                 = Functions::sanitize_attribute( $attributes, 'overlayOpacity', 'float' );
		$attributes['termTitleColor']                 = Functions::sanitize_attribute( $attributes, 'termTitleColor', 'text' );
		$attributes['termDescriptionColor']           = Functions::sanitize_attribute( $attributes, 'termDescriptionColor', 'text' );
		$attributes['itemBorder']                     = Functions::sanitize_attribute( $attributes, 'itemBorder', 'int' );
		$attributes['itemBorderColor']                = Functions::sanitize_attribute( $attributes, 'itemBorderColor', 'text' );
		$attributes['termTitleFont']                  = Functions::sanitize_attribute( $attributes, 'termTitleFont', 'text' );
		$attributes['termDescriptionFont']            = Functions::sanitize_attribute( $attributes, 'termDescriptionFont', 'text' );
		$attributes['termButtonText']                 = Functions::sanitize_attribute( $attributes, 'termButtonText', 'text' );
		$attributes['termButtonFont']                 = Functions::sanitize_attribute( $attributes, 'termButtonFont', 'text' );
		$attributes['termButtonTextColor']            = Functions::sanitize_attribute( $attributes, 'termButtonTextColor', 'text' );
		$attributes['termButtonTextHoverColor']       = Functions::sanitize_attribute( $attributes, 'termButtonTextHoverColor', 'text' );
		$attributes['termButtonBackgroundColor']      = Functions::sanitize_attribute( $attributes, 'termButtonBackgroundColor', 'text' );
		$attributes['termButtonBorder']               = Functions::sanitize_attribute( $attributes, 'termButtonBorder', 'int' );
		$attributes['termButtonBorderColor']          = Functions::sanitize_attribute( $attributes, 'termButtonBorderColor', 'text' );
		$attributes['termButtonBorderRadius']         = Functions::sanitize_attribute( $attributes, 'termButtonBorderRadius', 'int' );
		$attributes['columns']                        = Functions::sanitize_attribute( $attributes, 'columns', 'int' );
		$attributes['showTermTitle']                  = Functions::sanitize_attribute( $attributes, 'showTermTitle', 'bool' );
		$attributes['disableStyles']                  = Functions::sanitize_attribute( $attributes, 'disableStyles', 'bool' );
		$attributes['linkTermTitle']                  = Functions::sanitize_attribute( $attributes, 'linkTermTitle', 'bool' );
		$attributes['imageSize']                      = Functions::sanitize_attribute( $attributes, 'imageSize', 'text' );
		$attributes['containerId']                    = Functions::sanitize_attribute( $attributes, 'containerId', 'text' );
		$attributes['backgroundType']                 = Functions::sanitize_attribute( $attributes, 'backgroundType', 'text' );
		$attributes['itemBorderRadius']               = Functions::sanitize_attribute( $attributes, 'itemBorderRadius', 'int' );
		$attributes['termButtonBackgroundHoverColor'] = Functions::sanitize_attribute( $attributes, 'termButtonBackgroundHoverColor', 'text' );
		if ( ! $attributes['disableStyles'] ) :
			?>
		<style>
			<?php
			if ( 'image' === $attributes['backgroundType'] ) {
				$overlay_color = Functions::hex2rgba( $attributes['overlayColor'], $attributes['overlayOpacity'] );
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item:before {
					content: '';
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: <?php echo esc_html( $overlay_color ); ?>;
					z-index: 1;
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
			}
			if ( 'gradient' === $attributes['backgroundType'] ) {
				?>
				#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item {
					background-image: <?php echo esc_html( $attributes['backgroundGradient'] ); ?>;
				}
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
			#<?php echo esc_html( $attributes['containerId'] ); ?> .ptam-term-grid-item .ptam-term-grid-item-description {
				color: <?php echo esc_html( $attributes['termDescriptionColor'] ); ?>;
				font-family: '<?php echo esc_html( $attributes['termDescriptionFont'] ); ?>';
			}
		</style>
			<?php
		endif;
		?>
		<div id="<?php echo ! is_wp_error( $attributes['containerId'] ) ? esc_attr( $attributes['containerId'] ) : ''; ?>" class="columns-<?php echo absint( $attributes['columns'] ); ?> ptam-term-grid" >
			<?php
			foreach ( $raw_term_results as $index => $term ) {
				?>
				<div class="ptam-term-grid-item" 
					<?php
					if ( ! $attributes['disableStyles'] && 'image' === $attributes['backgroundType'] ) {
						$background_image = Functions::get_term_image( $attributes['imageSize'], $attributes['backgroundImageMeta'], $attributes['backgroundImageSource'], $taxonomy, $term->term_id );
						if ( empty( $background_image ) ) {
							$background_image = Functions::get_image( $attributes['backgroundImageFallback'], $attributes['imageSize'] );
						}
						echo 'style="background-image: url(' . esc_url( $background_image ) . ')"';
					}
					?>
					>
					<?php
					if ( $attributes['linkContainer'] ) {
						printf(
							'<a href="%s" aria-label="%s" class="ptam-term-grid-anchor-full"></a>',
							esc_url( get_term_link( $term->term_id, $term->taxonomy ) ),
							esc_attr( $term->name )
						);
					}
					?>
					<div class="ptam-term-grid-item-content">
						<?php
						if ( $attributes['showTermTitle'] ) {
							echo '<h2>';
							if ( $attributes['linkTermTitle'] && ! $attributes['linkContainer'] ) {
								$term_link = get_term_link( $term->term_id, $term->taxonomy );
								printf(
									'<a href="%s">%s</a>',
									esc_url( $term_link ),
									esc_html( $term->name )
								);
							} else {
								echo esc_html( $term->name );
							}
							echo '</h2>';
						}
						if ( $attributes['showTermDescription'] ) {
							?>
							<div class="ptam-term-grid-item-description">
								<?php echo wp_kses_post( $term->description ); ?>
							</div>
							<?php
						}
						?>
					</div>
				</div>
				<?php
			}
			?>

		</div>
		<?php
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
