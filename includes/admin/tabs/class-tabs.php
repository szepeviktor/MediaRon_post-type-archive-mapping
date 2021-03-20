<?php
/**
 * Abstract class for tabs.
 *
 * @package PTAM
 */

namespace PTAM\Includes\Admin\Tabs;

/**
 * Tabs boilerplate.
 */
abstract class Tabs {

	/**
	 * Tab to run actions against.
	 *
	 * @var $tab Current tab.
	 */
	protected $tab;

	/**
	 * Get tab content.
	 */
	abstract protected function add_tab();

	/**
	 * Add a sub tab for settings.
	 */
	abstract protected function add_sub_tab();

	/**
	 * Output admin content.
	 */
	abstract protected function output_settings();
}
