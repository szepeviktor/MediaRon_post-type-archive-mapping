=== Custom Post Types Block ===
Contributors: ronalfy, chrislogan
Tags: custom post types, archive, mapping, gutenberg, block, taxonomy, terms
Requires at least: 5.3
Tested up to: 5.3
Stable tag: 3.1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://mediaron.com/give/

A WordPress plugin for displaying posts using a Gutenberg block. Works well with posts, pages, custom post types, taxonomies, and terms.

== Description ==

A WordPress plugin for displaying posts using a Gutenberg block. Works well with posts, pages, custom post types, taxonomies, and terms.

<h2>Gutenberg Block</h2>

This 4-minute video covers how the Gutenberg block works.

https://www.youtube.com/watch?v=YmlHOj68MeU&rel=0

<h2>Archive Mapping</h2>

This plugin also allows you to map your custom post type archive pages. Just create a page and go to Settings->Reading to set the page for your archive.

Ensure your post types have <code>has_archive</code> set to true.

The plugin has a new Gutenberg block based on Atomic Blocks that will allow you to select which posts to display on your archive page. It even supports pagination.

See below for an overview of how Archive Mapping works:

https://www.youtube.com/watch?v=QT0QIdTBrdk?rel=0

<ul>
<li>Select a Public page to use as your post type archive page.</li>
<li>View the archive and you will see the page content instead of the archive content.</li>
<li>Use page templates on your pages for flexibility.</li>
<li>Custom Gutenberg block for showing your posts.</li>
</ul>

== Installation ==

1. Just unzip and upload the "post-type-archive-mapping" folder to your '/wp-content/plugins/' directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Create a custom post type that has an archive
4. Create a page with a custom template. Use the Gutenberg block to show off posts in that Custom Post Type.
5. Go to Settings->Reading and assign the page to the custom post type archive
6. Go to the post type archive and observe the page content is now the archive

== Frequently Asked Questions ==

= Can I Add Custom Fields? =

Yes! The plugin supports regular post meta and also Advanced Custom Fields.

= I don't see the post types. What's wrong? =

Make sure your post type has <code>has_archive</code> set to true and <code>show_in_rest</code> set to true.

= Can you do posts instead of pages? =

This plugin should work for any post type.

= I need help. Can you help me? =

Yes, just post in the support forums here and I'll do my best to address your issue. For priority support, you can <a href="https://mediaron.com/support/">visit my support form</a>.

== Screenshots ==

1. Editing a page using Gutenberg
2. The resulting archive page
3. Settings->Reading option

== Changelog ==

= 3.1.0 =
* Released 2020-01-26
* Removing custom field placeholder if a custom field isn't present.
* Removing continue reading link and post link if custom post type isn't publicly queryable.
* Wrapping excerpt in paragraph tag.
* Add class to readmore paragraph tag for styling.
* Hiding styles options if override styles is present.
* Changing verbiage of remove styles to Override styles.
* Added support for Adobe fonts through https://wordpress.org/plugins/custom-typekit-fonts/

= 3.0.9 =

* Released 2019-12-08
* Added the ability to set a fallback image for the featured image.

= 3.0.7 =

* Released 2019-12-05
* Fixing pagination when a page with the Gutenberg block is set as the front page.

= 3.0.6 =

* Released 2019-12-05
* Moving featured image to its own panel in Gutenberg settings.
* Moving title to its own panel in Gutenberg settings.
* Cleaning up editor styles for headings.
* Adding ability to change the heading HTML tag.

= 3.0.5 =
* Released 2019-12-05
* Adding ability to remove styles so that you can style your own layout.

= 3.0.0 =
* Released 2019-12-03
* Adding custom field support.
* Updating REST API for faster loading.

= 2.2.2 =
* Released 2019-12-02
* Added ability to remove title from displaying.
* Added new branded loading animation.

= 2.2.1 =
* Released 2019-10-29
* Testing up to WordPress 5.3.
* Fixing JS error when jQuery is not defined as a $ variable.

= 2.2.0 =
* Released 2019-08-23
* Bug fix when in grid mode and image is placed below the title.
* Bug fix: skipping taxonomies when there are none.
* Bug fix: fixing capitalization error.
* Enhancement: You can now select fonts for your content areas.

= 2.1.2 =
* Released 2019-06-11
* Fixing pagination

= 2.1.1 =
* Released 2019-05-26
* Some users were seeing featured images twice in the back-end.

= 2.1.0 =
* Released 2019-05-25
* Fixed Gravatar sizing not saving.
* Changing the way excerpts are shown in Gutenberg.
* Added the ability to change taxonomy location.
* Content can now be centered in the Grid view.
* Added border, padding, and background style options in Gutenberg block.
* Added color options for text in Gutenberg block.

= 2.0.7 =
* Released 2019-05-24
* Added the ability to trim the excerpt length.
* Reduce the file size of the Gutenberg block script using a new build technique.

= 2.0.5 =
* Released 2019-04-21
* Conditional term filtering

= 2.0.4 =
* Released 2019-04-18
* Adding support for six columns
* Fixing undefined index error

= 2.0.3 =
* Released 2019-03-29
* Fixed term not being saved when displaying posts

= 2.0.1 =
* Released 2019-01-17
* Fixed pagination when using a page with just the block

= 2.0.1 =
* Released 2019-01-17
* Fixing bug where arguments weren't an array when switching reading types in Settings->Reading.

= 2.0.0 =
* Released 2019-01-06
* Numerous enhancements to the Gutenberg block including showing taxonomies, setting the image type (Avatar vs Regular), setting where the featured image is displayed, selecting the image size, and much more.

= 1.0.1 =
* Released 2018-11-07
* WordPress 5.0 compatibility

= 1.0.0 =
* Released 2018-09-24
* Initial release.

== Upgrade Notice ==

= 3.1.0 =
Numerous tweaks. Please see the changelog for changes.

= 3.0.9 =
Added the ability to set a fallback image for the featured image.