=== Post Type Archive Mapping ===
Contributors: ronalfy, bigwing
Tags: post types, archive, mapping
Requires at least: 4.7
Tested up to: 4.9
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://mediaron.com/give/

A WordPress plugin for mapping post type archives to pages.

== Description ==

A WordPress plugin for mapping post type archives to pages.

<ul>
<li>Select a Private or Public page to use as your post type archive page.</li>
<li>View the archive and you will see the page content instead of the archive content.</li>
<li>Use page templates on your pages for flexibility.</li>
</ul>

== Installation ==

1. Just unzip and upload the "post-type-archive-mapping" folder to your '/wp-content/plugins/' directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Create a custom post type that has an archive
4. Create a page with a custom template
5. Go to Settings->Reading and assign the page to the custom post type archive
6. Go to the post type archive and observe the page content is now the archive

== Frequently Asked Questions ==

= I don't see the post types. What's wrong? =

Make sure your post type has <code>has_archive</code> set to true.

= Can you do posts instead of pages? =

Not at this time.

== Changelog ==

= 1.0.0 =
* Released 2018-09-24
* Initial release.
