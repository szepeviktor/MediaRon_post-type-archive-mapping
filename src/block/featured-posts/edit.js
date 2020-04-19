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
			itemNumberTimer: 0,
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
			disableStyles,
			titleFont,
			titleFontSize,
			titleColor,
			showMeta,
			showMetaAuthor,
			showMetaDate,
			showMetaComments,
			showFeaturedImage,
			showReadMore,
			showExcerpt,
			excerptFont,
			excerptFontSize,
			excerptTextColor,
		} = this.props.attributes;
		if (Object.keys(posts).length === 0) {
			return (
				<h2>{__("No posts could be found.", "post-type-archive-mapping")}</h2>
			);
		}
		let titleStyles = {
			fontFamily: titleFont,
			fontSize: titleFontSize + 'px',
			color: titleColor,
		};
		let excerptStyles = {
			fontFamily: excerptFont,
			fontSize: excerptFontSize + 'px',
			color: excerptTextColor,
		};
		if ( disableStyles ) {
			titleStyles = {};
			excerptStyles = {};
		}
		return Object.keys(posts).map((term, i) => (
			<Fragment key={i}>
				<div
					className="ptam-featured-post-item"
				>
					<div className="ptam-featured-post-meta">
						<h3 className="entry-title"><a style={titleStyles} href={posts[i].link}>{posts[i].post_title}</a></h3>
						{showMeta &&
							<Fragment>
								<div className="entry-meta">
								{showMetaAuthor &&
									<span className="author-name"><a href={posts[i].author_info.author_link}>{posts[i].author_info.display_name}</a></span>
								}
								{showMetaDate &&
									<span className="post-date">
										<time
											dateTime={dayjs(posts[i].post_date_gmt).format()}
											className={"ptam-block-post-grid-date"}
										>
											{dayjs(posts[i].post_date_gmt).format("MMMM DD, YYYY")}
										</time>
									</span>
								}
								{showMetaComments &&
									<span className="post-comments">
										{posts[i].comment_count} {_n('Comment', 'Comments', posts[i].comment_count, 'post-type-archive-mapping')}
									</span>
								}
								</div>
							</Fragment>
						}
					</div>
					{posts[i].featured_image_src && showFeaturedImage &&
						<Fragment>
							<div className="ptam-featured-post-image">
								<a href={posts[i].link}>
									{htmlToReactParser.parse(posts[i].featured_image_src)}
								</a>
							</div>
						</Fragment>
					}
					{showExcerpt &&
						<div className="ptam-featured-post-content" style={excerptStyles}>
							{htmlToReactParser.parse(posts[i].post_excerpt)}
						</div>
					}
					{showReadMore &&
						<div className="ptam-featured-post-button">
							<a className="btn btn-primary" href={posts[i].link}>{__('Read More', 'post-type-archive-mapping' )}</a>
						</div>
					}
				</div>
			</Fragment>
		));
	};

	itemNumberRender = ( value ) => {
		const postsToShow = value;
		if ( this.state.itemNumberTimer ) {
			clearTimeout(this.state.itemNumberTimer);
		}
		this.setState( {
			itemNumberTimer: setTimeout( () => {
				this.get_latest_data( { postsToShow: postsToShow });
			}, 1000 ),
		});
	}
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
			termDisplayPaddingBottom,
			termDisplayPaddingTop,
			termDisplayPaddingLeft,
			termDisplayPaddingRight,
			termBackgroundColor,
			termTextColor,
			termFont,
			termFontSize,
			termTitle,
			titleFont,
			titleFontSize,
			titleColor,
			titleColorHover,
			containerId,
			disableStyles,
			showMeta,
			showMetaAuthor,
			showMetaDate,
			showMetaComments,
			showFeaturedImage,
			showReadMore,
			showExcerpt,
			excerptFont,
			excerptFontSize,
			excerptTextColor,
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
			{ value: "ID", label: __("ID", "post-type-archive-mapping") },
			{
				value: "menu_order",
				label: __("Menu Order", "post-type-archive-mapping")
			},
			{
				value: "author",
				label: __("Post Author", "post-type-archive-mapping")
			},
			{ value: "date", label: __("Date", "post-type-archive-mapping") },
			{
				value: "modified",
				label: __("Date Modified", "post-type-archive-mapping")
			},
			{ value: "name", label: __("Post Slug", "post-type-archive-mapping") },
			{ value: "title", label: __("Title", "post-type-archive-mapping") },
			{ value: "rand", label: __("Random", "post-type-archive-mapping") }
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

		// Get the term label.
		let selectedTerm = 0;
		for ( let key in this.state.termsList ) {
			if ( this.state.termsList[key].value == term ) {
				selectedTerm = this.state.termsList[key].label;
				break;
			}
		}
		if ( termTitle !== '' ) {
			selectedTerm = termTitle;
		}

		// Term Styles
		let termContainerStyles = {
			borderBottom: `2px solid ${termBackgroundColor}`,
			marginBottom: '20px',
		};
		let termButtonStyles = {
			paddingBottom: termDisplayPaddingBottom + 'px',
			paddingTop: termDisplayPaddingTop + 'px',
			paddingLeft: termDisplayPaddingLeft + 'px',
			paddingRight: termDisplayPaddingRight + 'px',
			backgroundColor: termBackgroundColor,
			color: termTextColor,
			fontFamily: termFont,
			fontSize: termFontSize + 'px',
		};

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
					<SelectControl
						label={__("Order", "post-type-archive-mapping")}
						options={orderOptions}
						value={order}
						onChange={(value) => {
							this.props.setAttributes({ order: value });
							this.get_latest_posts({ order: value });
						}}
					/>
					<SelectControl
						label={__("Order By", "post-type-archive-mapping")}
						options={orderByOptions}
						value={orderBy}
						onChange={(value) => {
							this.props.setAttributes({ orderBy: value });
							this.get_latest_posts({ orderBy: value });
						}}
					/>
					<RangeControl
						label={__("Number of Items", "post-type-archive-mapping")}
						value={postsToShow}
						onChange={value => {
							this.props.setAttributes({ postsToShow: value });
							this.itemNumberRender( value );
						}}
						min={1}
						max={100}
					/>
				</PanelBody>
				<PanelBody
					initialOpen={true}
					title={__("Container", "post-type-archive-mapping")}
				>
					<TextControl
						label={__("Container ID", "post-type-archive-mapping")}
						help={__(
							"Unique CSS ID for styling if you have more than one featured category on the same page.",
							"post-type-archive-mapping"
						)}
						type="text"
						value={containerId}
						onChange={(value) =>
							this.props.setAttributes({ containerId: value })
						}
					/>
					<ToggleControl
						label={__("Show Post Meta", "post-type-archive-mapping")}
						checked={showMeta}
						onChange={(value) => {
							this.props.setAttributes({
								showMeta: value,
							});
						}}
					/>
					{
						showMeta &&
						<Fragment>
							<ToggleControl
								label={__("Show Author", "post-type-archive-mapping")}
								checked={showMetaAuthor}
								onChange={(value) => {
									this.props.setAttributes({
										showMetaAuthor: value,
									});
								}}
							/>
							<ToggleControl
								label={__("Show Date", "post-type-archive-mapping")}
								checked={showMetaDate}
								onChange={(value) => {
									this.props.setAttributes({
										showMetaDate: value,
									});
								}}
							/>
							<ToggleControl
								label={__("Show Comments", "post-type-archive-mapping")}
								checked={showMetaComments}
								onChange={(value) => {
									this.props.setAttributes({
										showMetaComments: value,
									});
								}}
							/>
						</Fragment>
					}
					<ToggleControl
						label={__("Show Featured Image", "post-type-archive-mapping")}
						checked={showFeaturedImage}
						onChange={(value) => {
							this.props.setAttributes({
								showFeaturedImage: value,
							});
						}}
					/>
					<ToggleControl
						label={__("Show The Excerpt", "post-type-archive-mapping")}
						checked={showExcerpt}
						onChange={(value) => {
							this.props.setAttributes({
								showExcerpt: value,
							});
						}}
					/>
					<ToggleControl
						label={__("Show Read More Button", "post-type-archive-mapping")}
						checked={showReadMore}
						onChange={(value) => {
							this.props.setAttributes({
								showReadMore: value,
							});
						}}
					/>
				</PanelBody>
				<PanelBody
					initialOpen={false}
					title={__("Term Display", "post-type-archive-mapping")}
				>
					<TextControl
						label={__("Term Title", "post-type-archive-mapping")}
						type="text"
						value={termTitle}
						onChange={(value) =>
							this.props.setAttributes({ termTitle: value })
						}
					/>
					<RangeControl
						label={__("Padding Top", "post-type-archive-mapping")}
						value={termDisplayPaddingTop}
						onChange={(value) => this.props.setAttributes({ termDisplayPaddingTop: value })}
						min={1}
						max={100}
					/>
					<RangeControl
						label={__("Padding Right", "post-type-archive-mapping")}
						value={termDisplayPaddingRight}
						onChange={(value) => this.props.setAttributes({ termDisplayPaddingRight: value })}
						min={1}
						max={100}
					/>
					<RangeControl
						label={__("Padding Bottom", "post-type-archive-mapping")}
						value={termDisplayPaddingBottom}
						onChange={(value) => this.props.setAttributes({ termDisplayPaddingBottom: value })}
						min={1}
						max={100}
					/>
					<RangeControl
						label={__("Padding Left", "post-type-archive-mapping")}
						value={termDisplayPaddingLeft}
						onChange={(value) => this.props.setAttributes({ termDisplayPaddingLeft: value })}
						min={1}
						max={100}
					/>
					<PanelColorSettings
						title={__("Term Colors", "post-type-archive-mapping")}
						initialOpen={true}
						colorSettings={[
							{
								value: termBackgroundColor,
								onChange: (value) => {
									setAttributes({ termBackgroundColor: value });
								},
								label: __("Background Color", "post-type-archive-mapping"),
							},
							{
								value: termTextColor,
								onChange: (value) => {
									setAttributes({ termTextColor: value });
								},
								label: __(
									"Text Color",
									"post-type-archive-mapping"
								),
							},
						]}
					></PanelColorSettings>
					<SelectControl
						label={__("Term Typography", "post-type-archive-mapping")}
						options={fontOptions}
						value={termFont}
						onChange={(value) => {
							this.props.setAttributes({ termFont: value });
						}}
					/>
					<RangeControl
						label={__("Font Size", "post-type-archive-mapping")}
						value={termFontSize}
						onChange={(value) => this.props.setAttributes({ termFontSize: value })}
						min={10}
						max={60}
					/>
				</PanelBody>
				<PanelBody
					initialOpen={false}
					title={__("Post Title", "post-type-archive-mapping")}
				>
					<PanelColorSettings
						title={__("Title Colors", "post-type-archive-mapping")}
						initialOpen={true}
						colorSettings={[
							{
								value: titleColor,
								onChange: (value) => {
									setAttributes({ titleColor: value });
								},
								label: __("Title Color", "post-type-archive-mapping"),
							},
							{
								value: titleColorHover,
								onChange: (value) => {
									setAttributes({ titleColorHover: value });
								},
								label: __(
									"Title Color on Hover",
									"post-type-archive-mapping"
								),
							},
						]}
					></PanelColorSettings>
					<SelectControl
						label={__("Title Typography", "post-type-archive-mapping")}
						options={fontOptions}
						value={titleFont}
						onChange={(value) => {
							this.props.setAttributes({ titleFont: value });
						}}
					/>
					<RangeControl
						label={__("Title Font Size", "post-type-archive-mapping")}
						value={titleFontSize}
						onChange={(value) => this.props.setAttributes({ titleFontSize: value })}
						min={10}
						max={60}
					/>
				</PanelBody>
				{showFeaturedImage &&
					<PanelBody
						initialOpen={false}
						title={__("Featured Image", "post-type-archive-mapping")}
					>
						<Fragment>
							<MediaUpload
								onSelect={imageObject => {
									this.props.setAttributes({ fallbackImg: imageObject });
									this.get_latest_posts({ fallbackImg: imageObject });
								}}
								type="image"
								value={fallbackImg.url}
								render={({ open }) => (
									<Fragment>
										<button
											className="ptam-media-alt-upload components-button is-button secondary"
											onClick={open}
										>
											{__(
												"Fallback Featured Image",
												"post-type-archive-mapping"
											)}
										</button>
										{fallbackImg && (
											<Fragment>
												<div>
													<img
														src={fallbackImg.url}
														alt={__(
															"Featured Image",
															"post-type-archive-mapping"
														)}
														width="250"
														height="250"
													/>
												</div>
												<div>
													<button
														className="ptam-media-alt-reset components-button is-button secondary"
														onClick={event => {
															this.props.setAttributes({ fallbackImg: "" });
															this.get_latest_posts({ fallbackImg: 0 });
														}}
													>
														{__("Reset Image", "post-type-archive-mapping")}
													</button>
												</div>
											</Fragment>
										)}
									</Fragment>
								)}
							/>
							<SelectControl
								label={__(
									"Featured Image Size",
									"post-type-archive-mapping"
								)}
								options={imageSizeOptions}
								value={imageTypeSize}
								onChange={value => {
									this.props.setAttributes({ imageTypeSize: value });
									this.get_latest_posts({ imageTypeSize: value });
								}}
							/>
						</Fragment>
					</PanelBody>
				}
				{showExcerpt &&
					<PanelBody
						initialOpen={false}
						title={__("Post Excerpt", "post-type-archive-mapping")}
					>
						<PanelColorSettings
							title={__("Excerpt Colors", "post-type-archive-mapping")}
							initialOpen={true}
							colorSettings={[
								{
									value: excerptTextColor,
									onChange: (value) => {
										setAttributes({ excerptTextColor: value });
									},
									label: __("Text Color", "post-type-archive-mapping"),
								},
							]}
						></PanelColorSettings>
						<SelectControl
							label={__("Excerpt Typography", "post-type-archive-mapping")}
							options={fontOptions}
							value={excerptFont}
							onChange={(value) => {
								this.props.setAttributes({ excerptFont: value });
							}}
						/>
						<RangeControl
							label={__("Excerpt Font Size", "post-type-archive-mapping")}
							value={excerptFontSize}
							onChange={(value) => this.props.setAttributes({ excerptFontSize: value })}
							min={10}
							max={60}
						/>
					</PanelBody>
				}
				
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
					{!disableStyles && (
						<style
							dangerouslySetInnerHTML={{
								__html: `
							#${containerId} .entry-title a:hover {
								color: ${titleColorHover} !important;
							}
							`,
							}}
						></style>
					)}
					<div className="ptam-fp-wrapper" id={containerId}>
						<h4 className="ptam-fp-term" style={termContainerStyles}><span style={termButtonStyles}>{selectedTerm}</span></h4>
						{this.getPostHtml()}
					</div>
				</Fragment>
			);
		}
	}
}

export default PTAM_Featured_Posts;
