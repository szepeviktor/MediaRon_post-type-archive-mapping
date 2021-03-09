/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

import './block/custom-post-one/block.js'; // Import main block.
import './block/term-grid/block.js'; // Import term grid block.
import './block/featured-posts/block.js'; // Import Featured Posts Block.

( function() {
	const customQueryBlocksSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 315.23 341.25"><polygon points="315.23 204.75 315.23 68.25 197.02 0 197.02 136.5 315.23 204.75" style={{fill: "#ffdd01",opacity:0.8}} /><polygon points="0 204.75 0 68.25 118.21 0 118.21 136.5 0 204.75" style={{fill: "#2e3192",opacity:0.8}} /><polygon points="157.62 159.25 275.83 91 157.62 22.75 39.4 91 157.62 159.25" style={{fill:"#86cedc",opacity:0.8}}/><polygon points="157.62 341.25 275.83 273 157.62 204.75 39.4 273 157.62 341.25" style={{fill:"#f07f3b", opacity:0.8}} /><polygon points="177.32 170.62 295.53 102.37 295.53 238.87 177.32 307.12 177.32 170.62" style={{fill:"#c10a26",opacity:0.8}}/><polygon points="137.91 170.62 19.7 102.37 19.7 238.87 137.91 307.12 137.91 170.62" style={{fill:"#662583",opacity:0.8}} /></svg>;
	wp.blocks.updateCategory( 'ptam-custom-query-blocks', { icon: customQueryBlocksSVG } );
} )();
