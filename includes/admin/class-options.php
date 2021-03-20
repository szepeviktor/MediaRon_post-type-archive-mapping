<?php
/**
 * Plugin Options.
 *
 * @package PTAM
 */

namespace PTAM\Includes\Admin;

/**
 * Class Options
 */
class Options {

	/**
	 * A list of options cached for saving.
	 *
	 * @var array $options
	 */
	private static $options = array();

	/**
	 * Get the options for Custom Query Blocks.
	 *
	 * @since 5.1.0
	 *
	 * @param bool $force true to retrieve options directly, false to use cached version.
	 *
	 * @return array $options Array of admin options.
	 */
	public static function get_options( $force = false ) {

		$options = self::$options;
		if ( ! is_array( $options ) || empty( $options ) || true === $force ) {
			$options       = get_option( 'ptam_options', array() );
			self::$options = $options;
		}
		if ( false === $options || empty( $options ) || ! is_array( $options ) ) {
			$options = self::get_defaults();
		} else {
			$options = wp_parse_args( $options, self::get_defaults() );
		}
		self::$options = $options;

		return self::$options;
	}

	/**
	 * Save options for the plugin.
	 *
	 * @param array $options array of options.
	 *
	 * @return array Options.
	 */
	public static function update_options( $options = array() ) {
		$options = array_unique( $options );

		/**
		 * Filter for saving options.
		 *
		 * @since 5.1.0
		 *
		 * @param array options.
		 *
		 * @return mixed WP_Error|array Array of options, or WP_Error on failure to save.
		 */
		$options = apply_filters( 'ptam_options_save_pre', $options );
		if ( self::sanitize_options( $options ) ) {
			update_option( 'ptam_options', $options );

			self::$options = $options;

			return $options;
		}
		return new \WP_Error(
			'ptam_update_options_fail',
			__( 'Invalid options were not able to be sanitized' )
		);
	}

	/**
	 * Get the default options for Custom Query Blocks
	 *
	 * @since 5.1.0
	 */
	private static function get_defaults() {
		$defaults = array(
			'disable_blocks'          => 'off',
			'disable_archive_mapping' => 'off',
			'disable_page_columns'    => 'off',
			'disable_term_columns'    => 'off',
			'disable_image_sizes'     => 'off',
		);

		/**
		 * Allow other plugins to add to the defaults.
		 *
		 * @since 5.1.0
		 *
		 * @param array $defaults An array of option defaults.
		 */
		$defaults = apply_filters( 'ptam_options_defaults', $defaults );
		return $defaults;
	}

	/**
	 * Sanitize options before saving.
	 *
	 * @param array $options Array of options to sanitize.
	 *
	 * @return bool true if valid, false if not.
	 */
	private function sanitize_options( $options = array() ) {
		if ( ! is_array( $options ) ) {
			return false;
		}
		foreach ( $options as $option_name => $option_value ) {
			switch ( $option_name ) {
				default:
					if ( 'off' !== $option_value && 'on' !== $option_value ) {
						return false;
					}
					break;
			}
		}
		return true;
	}
}
