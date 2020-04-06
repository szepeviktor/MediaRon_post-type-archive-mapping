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
	 * Get web safe fonts
	 *
	 * @return array $fonts Fonts to Use
	 */
	public static function get_fonts() {
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
