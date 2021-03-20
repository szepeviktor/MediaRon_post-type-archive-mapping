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

export const name = 'ptam/term-grid';

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
registerBlockType( 'ptam/term-grid', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Term Grid', 'post-type-archive-mapping' ), // Block title.
	icon: (
		<svg
			aria-hidden="true"
			focusable="false"
			data-prefix="fad"
			data-icon="th-large"
			className="svg-inline--fa fa-th-large fa-w-16"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
		>
			<g className="fa-group">
				<path
					className="fa-secondary"
					fill="#585aa8"
					d="M488 272H296a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V296a24 24 0 0 0-24-24zm-272 0H24a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V296a24 24 0 0 0-24-24z"
					opacity="0.4"
				></path>
				<path
					className="fa-primary"
					fill="#585aa8"
					d="M488 32H296a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24zm-272 0H24A24 24 0 0 0 0 56v160a24 24 0 0 0 24 24h192a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24z"
				></path>
			</g>
		</svg>
	),
	category: 'ptam-custom-query-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	description: __(
		'Show off your terms (categories) in a beautiful and customizable grid.',
		'post-type-archive-mapping'
	),
	keywords: [
		__( 'category', 'post-type-archive-mapping' ),
		__( 'term', 'poost-type-archive-mapping' ),
		__( 'grid', 'post-type-archive-mapping' ),
	],
	supports: {
		align: [ 'wide', 'full', 'center' ],
		anchor: true,
		html: false,
	},
	example: {
		attributes: {
			preview: true,
		},
	},
	edit,

	// Render via PHP
	save() {
		return null;
	},
} );
