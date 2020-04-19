/**
 * BLOCK: Basic with ESNext
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 *
 * Using inline styles - no external stylesheet needed.  Not recommended!
 * because all of these styles will appear in `post_content`.
 */

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

// Import JS
import edit from './edit';

// Extend component
const { Component } = wp.element;

// Register alignments
const validAlignments = [ 'full' ];

export const name = 'ptam/featured-posts';

/**
 * Register Basic Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made available as an option to any
 * editor interface where blocks are implemented.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'ptam/featured-posts', { // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Featured Posts by Term', 'post-type-archive-mapping' ), // Block title.
	icon: <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 8H3V9h9v2zm0-4H3V5h9v2z"/></svg>,
	category: 'ptam-custom-query-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'featured', 'post-type-archive-mapping' ),
		__( 'post', 'poost-type-archive-mapping' ),
		__( 'posts', 'poost-type-archive-mapping' ),
		__( 'category', 'post-type-archive-mapping' ),
		__( 'term', 'post-type-archive-mapping' ),
	],
	supports: {
		align: [ 'wide', 'full', 'center' ],
		anchor: true,
		html: false,
	},
	example: {
		attributes: {
			'preview' : true,
		},
	},
	edit: edit,

	// Render via PHP
	save() {
		return null;
	},
} );