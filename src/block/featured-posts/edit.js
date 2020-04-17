/**
 * External dependencies
 */
import classnames from "classnames";
import axios from "axios";
import dayjs from "dayjs";
import { SearchListControl } from "@woocommerce/components/build/search-list-control";
import Loading from "../components/Loading";
import hexToRgba from "hex-to-rgba";
var HtmlToReactParser = require("html-to-react").Parser;

const { Component, Fragment } = wp.element;

const { __, _n } = wp.i18n;

const { decodeEntities } = wp.htmlEntities;

const {
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
	Toolbar,
} = wp.components;

const {
	__experimentalGradientPickerControl,
	MediaUpload,
	InspectorControls,
	PanelColorSettings,
	BlockAlignmentToolbar,
	BlockControls,
} = wp.blockEditor;

const MAX_POSTS_COLUMNS = 1;

class PTAM_Featured_Posts extends Component {
	constructor() {
		super(...arguments);

		this.state = {
			loading: true,
			taxonomy: "category",
			postType: "post",
			postTypes: ptam_globals.post_types,
			imageSizes: ptam_globals.image_sizes,
			taxonomyList: [],
			termsList: [],
		};

		//this.get_latest_data();
	}

	get_term_list = (object = {}) => {
		let termsList = [];
		const props = jQuery.extend({}, this.props.attributes, object);
		const { postType, taxonomy } = props;
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_terms`, {
				taxonomy: taxonomy,
				post_type: postType
			})
			.then(response => {
				if (Object.keys(response.data).length > 0) {
					termsList.push({
						value: 0,
						label: __("All", "post-type-archive-mapping")
					});
					jQuery.each(response.data, function(key, value) {
						termsList.push({ value: value.term_id, label: value.name });
					});
				}
				this.setState({
					loading: false,
					termsList: termsList
				});
			});
	}

	get_latest_posts(object = {}) {
		this.setState({ loading: true });
		const props = jQuery.extend({}, this.props.attributes, object);
		let {
			postType,
			order,
			orderBy,
			avatarSize,
			imageType,
			imageTypeSize,
			taxonomy,
			term,
			postsToShow,
			imageCrop,
			fallbackImg,
		} = props;
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_posts`, {
				post_type: postType,
				order: order,
				orderby: orderBy,
				taxonomy: taxonomy,
				term: term,
				posts_per_page: postsToShow,
				image_size: imageCrop,
				avatar_size: avatarSize,
				image_type: imageType,
				image_size: imageTypeSize,
				default_image: fallbackImg
			})
			.then(response => {
				// Now Set State
				this.setState({
					loading: false,
					latestPosts: response.data.posts,
					userTaxonomies: response.data.taxonomies,
					userTerms: response.data.terms
				});
			});
	}

	get_latest_data = (object = {}) => {
		this.setState({ loading: true });
		let latestPosts = [];
		let taxonomyList = [];
		let termsList = [];
		let userTaxonomies = [];
		let userTerms = [];
		const props = jQuery.extend({}, this.props.attributes, object);
		let {
			postType,
			order,
			orderBy,
			avatarSize,
			imageType,
			imageTypeSize,
			taxonomy,
			term,
			postsToShow,
			imageCrop,
			fallbackImg,
		} = props;

		// Get Latest Posts and Chain Promises
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_featured_posts`, {
				post_type: postType,
				order: order,
				orderby: orderBy,
				taxonomy: taxonomy,
				term: term,
				posts_per_page: postsToShow,
				image_size: imageCrop,
				avatar_size: avatarSize,
				image_type: imageType,
				image_size: imageTypeSize,
				default_image: fallbackImg,
			})
			.then((response) => {
				latestPosts = response.data.posts;
				userTaxonomies = response.data.taxonomies;
				termsList = response.data.terms;

				// Get Terms
				axios
					.post(ptam_globals.rest_url + `ptam/v2/get_terms`, {
						taxonomy: taxonomy,
						post_type: postType,
					})
					.then((response) => {
						if (Object.keys(response.data).length > 0) {
							termsList.push({
								value: 0,
								label: __("All", "post-type-archive-mapping"),
							});
							jQuery.each(response.data, function (key, value) {
								termsList.push({ value: value.term_id, label: value.name });
							});
						}

						// Get Taxonomies
						axios
							.post(ptam_globals.rest_url + `ptam/v2/get_taxonomies`, {
								post_type: postType,
							})
							.then((response) => {
								if (Object.keys(response.data).length > 0) {
									taxonomyList.push({
										value: "none",
										label: __("Select a Taxonomy", "post-type-archive-mapping"),
									});
									jQuery.each(response.data, function (key, value) {
										taxonomyList.push({ value: key, label: value.label });
									});
								}

								// Now Set State
								this.setState({
									loading: false,
									latestPosts: latestPosts,
									taxonomyList: taxonomyList,
									termsList: termsList,
									userTaxonomies: userTaxonomies,
									userTerms: userTerms,
								});
							});
					});
			});
	}

	componentDidMount = () => {
		this.get_latest_data({});
	};

	getPostHtml = () => {
		const posts = this.state.latestPosts;
		const htmlToReactParser = new HtmlToReactParser();
		const {
			align,
			postType,
			avatarSize,
			imageType,
			imageTypeSize,
			postsToShow,
			imageCrop,
			fallbackImg,
			term,
			taxonomy,
			postsInclude,
			order,
			orderBy,
			postsExclude,
			postLayout,
			displayPostContent,
		} = this.props.attributes;
		if (Object.keys(posts).length === 0) {
			return (
				<h2>{__("No posts could be found.", "post-type-archive-mapping")}</h2>
			);
		}
		console.log( posts );
		return Object.keys(posts).map((term, i) => (
			<Fragment key={i}>
				<div
					className="ptam-featured-post-item"
				>
					{posts[i].featured_image_src &&
						<Fragment>
							<a href={posts[i].link}>
								<img src={posts[i].featured_image_src} />
							</a>
						</Fragment>
					}
					<div className="ptam-featured-post-meta">
						<h3 className="entry-title"><a href={posts[i].link}>{posts[i].post_title}</a></h3>
						<span className="author-name"><a href={posts[i].author_info.author_link}>{posts[i].author_info.display_name}</a></span>
						<span className-="post-date">
							<time
								dateTime={dayjs(posts[i].post_date_gmt).format()}
								className={"ptam-block-post-grid-date"}
							>
								{dayjs(posts[i].post_date_gmt).format("MMMM DD, YYYY")}
							</time>
						</span>
						<span className="post-comments">
							{posts[i].comment_count} {_n('Comment', 'Comments', posts[i].comment_count, 'post-type-archive-mapping')}
						</span>
					</div>
					<div className="ptam-featured-post-content">
						{htmlToReactParser.parse(posts[i].post_excerpt)}
					</div>
				</div>
			</Fragment>
		));
	};

	render() {
		let htmlToReactParser = new HtmlToReactParser();
		const { attributes, setAttributes } = this.props;
		const {
			align,
			postType,
			avatarSize,
			imageType,
			imageTypeSize,
			postsToShow,
			imageCrop,
			fallbackImg,
			term,
			taxonomy,
			postsInclude,
			order,
			orderBy,
			postsExclude,
			postLayout,
			displayPostContent,
		} = attributes;

		// Fonts
		let fontOptions = [];
		for (var key in ptam_globals.fonts) {
			fontOptions.push({ value: key, label: ptam_globals.fonts[key] });
		}

		// Post Types.
		let postTypeOptions = [];
		for (var key in ptam_globals.post_types) {
			postTypeOptions.push({ value: key, label: ptam_globals.post_types[key] });
		}

		// Image Sizes.
		let imageSizeOptions = [];
		let imageSizes = this.state.imageSizes;
		for (var key in imageSizes) {
			imageSizeOptions.push({ value: key, label: key });
		}

		// Order Params.
		const orderOptions = [
			{ value: "ASC", label: __("ASC", "post-type-archive-mapping") },
			{ value: "DESC", label: __("DESC", "post-type-archive-mapping") },
		];

		const orderByOptions = [
			{ value: "name", label: __("Term Name", "post-type-archive-mapping") },
			{ value: "slug", label: __("Term Slug", "post-type-archive-mapping") },
			{ value: "order", label: __("Term Order", "post-type-archive-mapping") },
		];

		const featuredImageOptions = [
			{ value: "none", label: __("None", "post-type-archive-mapping") },
			{
				value: "featured",
				label: __("Featured Image", "post-type-archive-mapping"),
			},
			{ value: "gravatar", label: __("Gravatar", "post-type-archive-mapping") },
		];

		const backgroundTypeOptions = [
			{ value: "none", label: __("None", "post-type-archive-mapping") },
			{
				value: "color",
				label: __("Background Color", "post-type-archive-mapping"),
			},
			{
				value: "gradient",
				label: __("Background Gradient", "post-type-archive-mapping"),
			},
			{
				value: "image",
				label: __("Background Image", "post-type-archive-mapping"),
			},
		];

		// Title Heading Options
		const titleHeadingOptions = [
			{ value: "h1", label: __("H1", "post-type-archive-mapping") },
			{ value: "h2", label: __("H2", "post-type-archive-mapping") },
			{ value: "h3", label: __("H3", "post-type-archive-mapping") },
			{ value: "h4", label: __("H4", "post-type-archive-mapping") },
			{ value: "h5", label: __("H5", "post-type-archive-mapping") },
			{ value: "H6", label: __("H6", "post-type-archive-mapping") },
		];

		const layoutControls = [
			{
				icon: "excerpt-view",
				title: __("Show Excerpt", "post-type-archive-mapping"),
				onClick: () => setAttributes({ postLayout: "excerpt", displayPostContent: false }),
				isActive: postLayout === "excerpt"
			},
			{
				icon: "admin-page",
				title: __("Full Content View", "post-type-archive-mapping"),
				onClick: () => setAttributes({ postLayout: "full_content", displayPostContent: true }),
				isActive: postLayout === "full_content"
			}
		];

		const inspectorControls = (
			<InspectorControls>
				<PanelBody
					initialOpen={false}
					title={__("Query", "post-type-archive-mapping")}
				>
					<SelectControl
						label={__("Post Type", "post-type-archive-mapping")}
						options={postTypeOptions}
						value={postType}
						onChange={(value) => {
							this.props.setAttributes({
								postType: value,
								taxonomy: "none",
								term: 0,
							});
							this.get_latest_data({
								postType: value,
								taxonomy: "none",
								term: 0
							});
						}}
					/>
					<SelectControl
						label={__("Taxonomy", "post-type-archive-mapping")}
						options={this.state.taxonomyList}
						value={taxonomy}
						onChange={(value) => {
							this.props.setAttributes({ taxonomy: value });
							this.get_term_list({ taxonomy: value, term: 0 });
							this.get_latest_posts({ term: value });
						}}
					/>
					<SelectControl
						label={__("Terms", "post-type-archive-mapping")}
						options={this.state.termsList}
						value={term}
						onChange={value => {
							this.props.setAttributes({ term: value });
							this.get_latest_posts({ term: value });
						}}
					/>
				</PanelBody>
			</InspectorControls>
		);
		if (this.state.loading) {
			return (
				<Fragment>
					{inspectorControls}
					<Placeholder>
						<div className="ptam-term-grid-loading">
							<h1>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24"
									viewBox="0 0 24 24"
									width="24"
								>
									<path d="M0 0h24v24H0V0z" fill="none" />
									<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 8H3V9h9v2zm0-4H3V5h9v2z" />
								</svg>{" "}
								{__("Featured Posts by Category", "post-type-archive-mapping")}
							</h1>
							<h2>
								<Loading cssClass="ptam-term-grid-loading-animation" />
							</h2>
						</div>
					</Placeholder>
				</Fragment>
			);
		}
		if ( ! term ) {
			console.log( term );
			return (
				<Fragment>
					{inspectorControls}
					<BlockControls>
						<BlockAlignmentToolbar
							value={align}
							onChange={value => {
								if (undefined == value) {
									value = "wide";
								}
								setAttributes({ align: value });
							}}
							controls={["center", "wide"]}
						/>
						<Toolbar controls={layoutControls} />
					</BlockControls>
					<h2 style={{textAlign: 'center'}}>{__('Please select a term to begin.', 'post-type-archive-mapping')}</h2>
				</Fragment>
			)
		}
		if (! this.state.loading) {
			
			return (
				<Fragment>
					{inspectorControls}
					<BlockControls>
						<BlockAlignmentToolbar
							value={align}
							onChange={value => {
								if (undefined == value) {
									value = "wide";
								}
								setAttributes({ align: value });
							}}
							controls={["center", "wide"]}
						/>
						<Toolbar controls={layoutControls} />
					</BlockControls>
					<div className="ptam-fp-wrapper">
						<h4 className="ptam-fp-term">{this.state.termsList[term].label}</h4>
						{this.getPostHtml()}
					</div>
				</Fragment>
			);
		}
	}
}

export default PTAM_Featured_Posts;
