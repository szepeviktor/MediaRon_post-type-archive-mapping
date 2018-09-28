/**
 * External dependencies
 */

import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import classnames from 'classnames';
import { stringify } from 'querystringify';
import axios from 'axios';

const { Component, Fragment } = wp.element;

const { __ } = wp.i18n;

const { decodeEntities } = wp.htmlEntities;

const { apiFetch } = wp;

const {
	registerStore,
} = wp.data;

const {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	SelectControl,
	Spinner,
	TextControl,
	ToggleControl,
	Toolbar,
	withAPIData,
} = wp.components;

const {
	InspectorControls,
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;


const MAX_POSTS_COLUMNS = 4;

class PTAM_Custom_Posts extends Component {
	constructor() {
		super( ...arguments );

		this.toggleDisplayPostDate = this.toggleDisplayPostDate.bind( this );
		this.toggleDisplayPostExcerpt = this.toggleDisplayPostExcerpt.bind( this );
		this.toggleDisplayPostAuthor = this.toggleDisplayPostAuthor.bind( this );
		this.toggleDisplayPostImage = this.toggleDisplayPostImage.bind( this );
		this.toggleDisplayPostLink = this.toggleDisplayPostLink.bind( this );
		this.get_latest_data = this.get_latest_data.bind(this);
		
		const default_post_type = 'post';
		const default_taxonomy_name = 'category';
		let taxonomies = [];
		let terms = [{'value': 0, 'label': 'All'}];
		let ptam_latest_posts = [];
		
		this.state = {
			loading: true,
			postType: 'post',
			taxonomy: 'category',
			term: 'all',
			latestPosts: [],
			postTypeList: [],
			taxonomyList: [],
			termsList: []
		};
		
		this.get_latest_data();
	}
	
	get_latest_data( object = {} ) {
		this.setState( { 'loading': true } )
		let latestPosts = [];
		let postTypeList = [];
		let taxonomyList = [];
		let termsList = [];
		const props = jQuery.extend({}, this.props.attributes, object);
		const { postType, order, orderBy, taxonomy, term, terms, postsToShow, imageCrop } = props;
		
		// Get Latest Posts and Chain Promises
		axios.get(ptam_globals.rest_url + `ptam/v1/get_posts/${postType}/${order}/${orderBy}/${taxonomy}/${term}/${postsToShow}/${imageCrop}`).then( ( response ) => { 
				latestPosts = response.data;
				
				// Get Post Types
				axios.get(ptam_globals.rest_url + 'wp/v2/types').then( ( response ) => {
					$.each( response.data, function( key, value ) {
						if( 'attachment' != key && 'wp_block' != key ) {
							postTypeList.push( { 'value': key, 'label': value.name } );
						}
					} );
					
					// Get Terms
					axios.get(ptam_globals.rest_url + 'ptam/v1/get_terms/' + taxonomy ).then( ( response ) => {
						$.each( response.data, function( key, value ) {
							termsList.push( { 'value': value.term_id, 'label': value.name } );
						} );
						
						// Get Taxonomies
						axios.get(ptam_globals.rest_url + 'wp/v2/taxonomies').then( ( response ) => {
							$.each( response.data, function( key, value ) {
								if( value.types.includes(postType)) {
									taxonomyList.push( { 'value': key, 'label': value.name } );
								}
							} );
							
							// Now Set State
							this.setState( {
								'loading': false,
								'latestPosts': latestPosts,
								'postTypeList': postTypeList,
								'taxonomyList': taxonomyList,
								'termsList': termsList	
							} );
						});
						
					});
				} );
			});
	}

	toggleDisplayPostDate() {
		const { displayPostDate } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostDate: ! displayPostDate } );
	}

	toggleDisplayPostExcerpt() {
		const { displayPostExcerpt } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostExcerpt: ! displayPostExcerpt } );
	}

	toggleDisplayPostAuthor() {
		const { displayPostAuthor } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostAuthor: ! displayPostAuthor } );
	}

	toggleDisplayPostImage() {
		const { displayPostImage } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostImage: ! displayPostImage } );
	}

	toggleDisplayPostLink() {
		const { displayPostLink } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostLink: ! displayPostLink } );
	}

	customizeReadMoreText() {
		const { readMoreText } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { readMoreText: ! readMoreText } );
	}

	render() {
		if( this.state.loading ) {
			return <div>Loading...</div>
		}
		const { attributes, setAttributes } = this.props;
		const { postType, term, taxonomy, displayPostDate, displayPostExcerpt, displayPostAuthor, displayPostImage,displayPostLink, align, postLayout, columns, order, orderBy, categories, postsToShow, width, imageCrop, readMoreText } = attributes;
		
		let latestPosts = this.state.latestPosts;
		// Thumbnail options
		const imageCropOptions = [
			{ value: 'landscape', label: __( 'Landscape' ) },
			{ value: 'square', label: __( 'Square' ) },
		];

		const isLandscape = imageCrop === 'landscape';
		
		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Post Grid Settings' ) }>
					<SelectControl
							label={ __( 'Post Type' ) }
							options={ this.state.postTypeList }
							value={ postType }
							onChange={ ( value ) => { this.props.setAttributes( { postType: value } ); this.get_latest_data({postType: value }); } } 
					/>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => { this.props.setAttributes( { order: value } ); this.get_latest_data({order: value }); } }
						onOrderByChange={ ( value ) => { this.props.setAttributes( { orderBy: value } ); this.get_latest_data({orderBy: value }); } }
						onCategoryChange={ ( value ) => this.props.setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => this.props.setAttributes( { postsToShow: value } ) }
					/>
					{ postLayout === 'grid' &&
						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 2 }
							max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, latestPosts.length ) }
						/>
					}
					<ToggleControl
						label={ __( 'Display Featured Image' ) }
						checked={ displayPostImage }
						onChange={ this.toggleDisplayPostImage }
					/>
					{ displayPostImage &&
						<SelectControl
							label={ __( 'Featured Image Style' ) }
							options={ imageCropOptions }
							value={ imageCrop }
							onChange={ ( value ) => this.props.setAttributes( { imageCrop: value } ) }
						/>
					}
					<ToggleControl
						label={ __( 'Display Post Author' ) }
						checked={ displayPostAuthor }
						onChange={ this.toggleDisplayPostAuthor }
					/>
					<ToggleControl
						label={ __( 'Display Post Date' ) }
						checked={ displayPostDate }
						onChange={ this.toggleDisplayPostDate }
					/>
					<ToggleControl
						label={ __( 'Display Post Excerpt' ) }
						checked={ displayPostExcerpt }
						onChange={ this.toggleDisplayPostExcerpt }
					/>
					<ToggleControl
						label={ __( 'Display Continue Reading Link' ) }
						checked={ displayPostLink }
						onChange={ this.toggleDisplayPostLink }
					/>
					{ displayPostLink &&
					<TextControl
						label={ __( 'Customize Read More Link' ) }
						type="text"
						value={ readMoreText }
						onChange={ ( value ) => this.props.setAttributes( { readMoreText: value } ) }
					/>
					}

				</PanelBody>
			</InspectorControls>
		);
		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon="admin-post"
						label={ __( 'Custom Posts Grid' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts;

		const layoutControls = [
			{
				icon: 'grid-view',
				title: __( 'Grid View' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
			{
				icon: 'list-view',
				title: __( 'List View' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
		];

		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ ( value ) => {
							setAttributes( { align: value } );
						} }
						controls={ [ 'center', 'wide' ] }
					/>
					<Toolbar controls={ layoutControls } />
				</BlockControls>
				<div
					className={ classnames(
						this.props.className,
						'ab-block-post-grid',
					) }
				>
					<div
						className={ classnames( {
							'is-grid': postLayout === 'grid',
							'is-list': postLayout === 'list',
							[ `columns-${ columns }` ]: postLayout === 'grid',
							'ab-post-grid-items' : 'ab-post-grid-items'
						} ) }
					>
						{ displayPosts.map( ( post, i ) =>
							<article
								key={ i }
								className={ classnames(
									post.featured_image_src && displayPostImage ? 'has-thumb' : 'no-thumb'
								) }
							>
								{
									displayPostImage && post.featured_image_src !== undefined && post.featured_image_src ? (
										<div class="ab-block-post-grid-image">
											<a href={ post.link } target="_blank" rel="bookmark">
												<img
													src={ isLandscape ? post.featured_image_src : post.featured_image_src_square }
													alt={ decodeEntities( post.post_title.trim() ) || __( '(Untitled)' ) }
												/>
											</a>
										</div>
									) : (
										null
									)
								}

								<div class="ab-block-post-grid-text">
									<h2 class="entry-title"><a href={ post.link } target="_blank" rel="bookmark">{ decodeEntities( post.post_title.trim() ) || __( '(Untitled)' ) }</a></h2>

									<div class="ab-block-post-grid-byline">
										{ displayPostAuthor && post.author_info.display_name !== 'undefined' && post.author_info.display_name &&
											<div class="ab-block-post-grid-author"><a class="ab-text-link" target="_blank" href={ post.author_info.author_link }>{ post.author_info.display_name }</a></div>
										}

										{ displayPostDate && post.date_gmt &&
											<time dateTime={ moment( post.date_gmt ).utc().format() } className={ 'ab-block-post-grid-date' }>
												{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }
											</time>
										}
									</div>

									<div class="ab-block-post-grid-excerpt">
										{ displayPostExcerpt && post.excerpt &&
											<div dangerouslySetInnerHTML={ { __html: post.excerpt } } />
										}

										{ displayPostLink &&
											<p><a class="ab-block-post-grid-link ab-text-link" href={ post.link } target="_blank" rel="bookmark">{ readMoreText }</a></p>
										}
									</div>
								</div>
							</article>
						) }
					</div>
				</div>
			</Fragment>
		);
	}
}

export default PTAM_Custom_Posts;