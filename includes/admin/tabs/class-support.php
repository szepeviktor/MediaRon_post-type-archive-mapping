<?php
/**
 * Register the Settings tab and any sub-tabs.
 *
 * @package user-profile-picture
 */

namespace PTAM\Includes\Admin\Tabs;

use PTAM\Includes\Functions as Functions;
use PTAM\Includes\Admin\Options as Options;

/**
 * Output the settings tab and content.
 */
class Support extends Tabs {

	/**
	 * Tab to run actions against.
	 *
	 * @var $tab Settings tab.
	 */
	protected $tab = 'support';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'ptam_admin_tabs', array( $this, 'add_tab' ), 1, 1 );
		add_filter( 'ptam_admin_sub_tabs', array( $this, 'add_sub_tab' ), 1, 3 );
		add_action( 'ptam_output_' . $this->tab, array( $this, 'output_settings' ), 1, 3 );
	}

	/**
	 * Add the settings tab and callback actions.
	 *
	 * @param array $tabs Array of tabs.
	 *
	 * @return array of tabs.
	 */
	public function add_tab( $tabs ) {
		$tabs[] = array(
			'get'    => $this->tab,
			'action' => 'ptam_output_' . $this->tab,
			'url'    => Functions::get_settings_url( $this->tab ),
			'label'  => _x( 'Support', 'Tab label as support', 'post-type-archive-mapping' ),
			'icon'   => 'home-heart',
		);
		return $tabs;
	}

	/**
	 * Add the settings main tab and callback actions.
	 *
	 * @param array  $tabs        Array of tabs.
	 * @param string $current_tab The current tab selected.
	 * @param string $sub_tab     The current sub-tab selected.
	 *
	 * @return array of tabs.
	 */
	public function add_sub_tab( $tabs, $current_tab, $sub_tab ) {
		if ( ( ! empty( $current_tab ) || ! empty( $sub_tab ) ) && $this->tab !== $current_tab ) {
			return $tabs;
		}
		return $tabs;
	}

	/**
	 * Begin settings routing for the various outputs.
	 *
	 * @param string $tab     Current tab.
	 * @param string $sub_tab Current sub tab.
	 */
	public function output_settings( $tab, $sub_tab = '' ) {
		if ( $this->tab === $tab ) {
			if ( empty( $sub_tab ) || $this->tab === $sub_tab ) {
				?>
				<svg width="0" height="0" class="hidden" aria-hidden="true">
					<symbol aria-hidden="true" data-prefix="fas" data-icon="hands-helping" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" id="ptam-support-icon">
						<path fill="currentColor" d="M488 192H336v56c0 39.7-32.3 72-72 72s-72-32.3-72-72V126.4l-64.9 39C107.8 176.9 96 197.8 96 220.2v47.3l-80 46.2C.7 322.5-4.6 342.1 4.3 357.4l80 138.6c8.8 15.3 28.4 20.5 43.7 11.7L231.4 448H368c35.3 0 64-28.7 64-64h16c17.7 0 32-14.3 32-32v-64h8c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24zm147.7-37.4L555.7 16C546.9.7 527.3-4.5 512 4.3L408.6 64H306.4c-12 0-23.7 3.4-33.9 9.7L239 94.6c-9.4 5.8-15 16.1-15 27.1V248c0 22.1 17.9 40 40 40s40-17.9 40-40v-88h184c30.9 0 56 25.1 56 56v28.5l80-46.2c15.3-8.9 20.5-28.4 11.7-43.7z"></path>
					</symbol>
				</svg>
				<div class="ptam-admin-panel-area">
					<h3 class="ptam-panel-heading">
						<?php esc_html_e( 'Get Support On the WordPress Plugin Directory', 'post-type-archive-mapping' ); ?>
					</h3>
					<div class="ptam-panel-row">
						<p class="description">
							<?php esc_html_e( 'The best way to receive support is via the official WordPress Plugin Directory support forum.', 'post-type-archive-mapping' ); ?>
						</p>
					</div>
					<div class="ptam-panel-row">
						<a class="ptam-button ptam-button-info" href="https://wordpress.org/support/plugin/post-type-archive-mapping/" target="_blank"><svg class="ptam-icon"><use xlink:href="#ptam-support-icon"></use></svg>&nbsp;<?php esc_html_e( 'Open a Support Topic', 'post-type-archive-mapping' ); ?></a>
					</div>
				</div>
				<?php
			}
		}
	}
}
