<?php
/**
 * Helper fuctions.
 *
 * @package PTAM
 */

namespace PTAM\Includes;

/**
 * Class functions
 */
class Functions {
	/**
	 * Get all the registered image sizes along with their dimensions
	 *
	 * @global array $_wp_additional_image_sizes
	 *
	 * @link http://core.trac.wordpress.org/ticket/18947 Reference ticket
	 *
	 * @return array $image_sizes The image sizes
	 */
	public static function get_all_image_sizes() {
		global $_wp_additional_image_sizes;

		$default_image_sizes = get_intermediate_image_sizes();

		foreach ( $default_image_sizes as $size ) {
			$image_sizes[ $size ]['width']  = intval( get_option( "{$size}_size_w" ) );
			$image_sizes[ $size ]['height'] = intval( get_option( "{$size}_size_h" ) );
			$image_sizes[ $size ]['crop']   = get_option( "{$size}_crop" ) ? get_option( "{$size}_crop" ) : false;
		}

		if ( isset( $_wp_additional_image_sizes ) && count( $_wp_additional_image_sizes ) ) {
			$image_sizes = array_merge( $image_sizes, $_wp_additional_image_sizes );
		}

		return $image_sizes;
	}

	/**
	 * Sanitize an attribute based on type.
	 *
	 * @param array  $attributes Array of attributes.
	 * @param string $attribute  The attribute to sanitize.
	 * @param string $type       The type of sanitization you need (values can be int, text, float, bool, url).
	 *
	 * @return mixed Sanitized attribute. wp_error on failure.
	 */
	public static function sanitize_attribute( $attributes, $attribute, $type = 'text' ) {
		if ( isset( $attributes[ $attribute ] ) ) {
			switch ( $type ) {
				case 'text':
					return sanitize_text_field( $attributes[ $attribute ] );
				case 'bool':
					return filter_var( $attributes[ $attribute ], FILTER_VALIDATE_BOOLEAN );
				case 'int':
					return absint( $attributes[ $attribute ] );
				case 'float':
					if ( is_float( $attributes[ $attribute ] ) ) {
						return $attributes[ $attribute ];
					}
					return 0;
				case 'url':
					return esc_url( $attributes[ $attribute ] );
				case 'default':
					return new \WP_Error( 'ptam_unknown_type', __( 'Unknown type.', 'post-type-archive-mapping' ) );
			}
		}
		return new \WP_Error( 'ptam_attribute_not_found', __( 'Attribute not found.', 'post-type-archive-mapping' ) );
	}

	/**
	 * Convert Hex to RGBA
	 *
	 * @param string $color   The color to convert.
	 * @param int    $opacity The opacity.
	 *
	 * @return string rgba attribute.
	 */
	public static function hex2rgba( $color, $opacity = false ) {

		$default = 'rgb(0,0,0)';

		// Return default if no color provided.
		if ( empty( $color ) ) {
			return $default;
		}

		// Sanitize $color if "#" is provided.
		if ( '#' === $color[0] ) {
			$color = substr( $color, 1 );
		}

		// Check if color has 6 or 3 characters and get values.
		if ( strlen( $color ) === 6 ) {
				$hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
		} elseif ( strlen( $color ) === 3 ) {
				$hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
		} else {
				return $default;
		}

		// Convert hexadec to rgb.
		$rgb = array_map( 'hexdec', $hex );

		// Check if opacity is set(rgba or rgb).
		if ( $opacity ) {
			if ( abs( $opacity ) > 1 ) {
				$opacity = 1.0;
			}
			$output = 'rgba(' . implode( ',', $rgb ) . ',' . $opacity . ')';
		} else {
			$output = 'rgb(' . implode( ',', $rgb ) . ')';
		}

		// Return rgb(a) color string.
		return $output;
	}

	/**
	 * Return an image URL.
	 *
	 * @param int    $attachment_id The attachment ID.
	 * @param string $size          The image size to retrieve.
	 *
	 * @return string Image URL or empty string if not found.
	 */
	public static function get_image( $attachment_id = 0, $size = 'large' ) {
		$maybe_image = wp_get_attachment_image_src( $attachment_id, $size );
		if ( ! $maybe_image ) {
			return '';
		}
		if ( isset( $maybe_image[0] ) ) {
			return esc_url( $maybe_image[0] );
		}
		return '';
	}

	/**
	 * Get an image from term meta.
	 *
	 * @param string $size       The image size.
	 * @param string $meta_field The meta field to query.
	 * @param string $type       The type of meta to retrieve (meta, acf, pods).
	 * @param string $taxonomy   The taxonomy slug to retrieve images for.
	 * @param int    $term_id    The term to retrieve data for.
	 *
	 * @return string Image URL or blank if not found.
	 */
	public static function get_term_image( $size = 'large', $meta_field = '', $type = 'meta', $taxonomy = 'category', $term_id = 0 ) {
		if ( 'none' === $type ) {
			return '';
		}
		if ( 'acf' === $type && function_exists( 'get_field' ) ) {
			$acf_term_id    = $taxonomy . '_' . $term_id;
			$acf_term_value = get_field( $meta_field, $acf_term_id );
			if ( ! $acf_term_value ) {
				return '';
			}
			if ( is_numeric( $acf_term_value ) ) {
				$image = self::get_image( $acf_term_value, $size );
				return $image;
			} elseif ( is_array( $acf_term_value ) && isset( $acf_term_value['url'] ) ) {
				return esc_url( $acf_term_value['url'] );
			} elseif ( is_string( $acf_term_value ) ) {
				return esc_url( $acf_term_value );
			} else {
				return '';
			}
		}
		if ( 'meta' === $type ) {
			$term_value = get_term_meta( $term_id, $meta_field, true );
			if ( is_numeric( $term_value ) ) {
				$image = self::get_image( $term_value, $size );
				return $image;
			} elseif ( is_array( $term_value ) && isset( $term_value['url'] ) ) {
				return esc_url( $term_value['url'] );
			} elseif ( is_string( $term_value ) ) {
				return esc_url( $term_value );
			} else {
				return '';
			}
		}
		if ( 'pods' === $type ) {
			$term_value = get_term_meta( $term_id, $meta_field, true );
			if ( is_numeric( $term_value ) ) {
				$image = self::get_image( $term_value, $size );
				return $image;
			} elseif ( is_array( $term_value ) && isset( $term_value['ID'] ) ) {
				return self::get_image( $term_value['ID'], $size );
			} elseif ( is_string( $term_value ) ) {
				return esc_url( $term_value );
			} else {
				return '';
			}
		}
		return '';
	}

	/**
	 * Get web safe fonts
	 *
	 * @return array $fonts Fonts to Use
	 */
	public static function get_fonts() {
		/**
		 * Filter the fonts that are available.
		 *
		 * @since 3.5.0
		 *
		 * @param array  associative array of key/value pairs of fonts.
		 */
		$fonts     = apply_filters(
			'ptam_fonts',
			array(
				'inherit'         => 'Default',
				'arial'           => 'Arial',
				'helvetica'       => 'Helvetica',
				'times new roman' => 'Times New Roman',
				'times'           => 'Times',
				'courier new'     => 'Courier New',
				'courier'         => 'Courier',
				'verdana'         => 'Verdana',
				'georgia'         => 'Georgia',
				'palatino'        => 'Palatino',
				'garamond'        => 'Garamond',
				'bookman'         => 'Bookman',
				'trebuchet ms'    => 'Trebuchet MS',
				'arial black'     => 'Arial Black',
				'impact'          => 'Impact',
			)
		);
		$pro_fonts = array();
		// Add Typekit Fonts.
		if ( defined( 'CUSTOM_TYPEKIT_FONTS_FILE' ) ) {
			$adobe_fonts = get_option( 'custom-typekit-fonts', array() );
			if ( isset( $adobe_fonts['custom-typekit-font-details'] ) ) {
				foreach ( $adobe_fonts['custom-typekit-font-details'] as $font_name => $font_details ) {
					$pro_fonts[ $font_details['slug'] ] = $font_details['family'];
				}
			}
		}
		$fonts = array_merge( $fonts, $pro_fonts );
		return $fonts;
	}
}
