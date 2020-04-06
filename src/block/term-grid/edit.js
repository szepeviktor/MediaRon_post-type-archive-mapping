/**
 * External dependencies
 */
import dayjs from "dayjs";
import classnames from "classnames";
import axios from "axios";
import { SearchListControl } from '@woocommerce/components';
var HtmlToReactParser = require("html-to-react").Parser;

const { Component, Fragment } = wp.element;

const { __ } = wp.i18n;

const { decodeEntities } = wp.htmlEntities;

const {
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	Spinner,
	TextControl,
	TextareaControl,
	ToggleControl,
	Toolbar
} = wp.components;

const {
	MediaUpload,
	InspectorControls,
	BlockAlignmentToolbar,
	BlockControls,
	PanelColorSettings
} = wp.blockEditor;

const MAX_POSTS_COLUMNS = 6;

class PTAM_Term_Grid extends Component {
	constructor() {
		super(...arguments);

		this.state = {
			loading: true,
			fonts: [],
			taxonomy: 'category',
		};

		//this.get_latest_data();
	}

	getLatestData = ( object = {} ) => {
		const props = jQuery.extend({}, this.props.attributes, object);
		let termsList = [];
		let {
			taxonomy,
		} = props;
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_tax_terms`, {
				taxonomy: taxonomy,
			})
			.then(response => {
				if (Object.keys(response.data).length > 0) {
					termsList.push({
						id: 0,
						name: __("All", "post-type-archive-mapping")
					});
					jQuery.each(response.data, function(key, value) {
						termsList.push({ id: value.term_id, name: value.name });
					});
				}
				this.setState({
					loading: false,
					terms: termsList,
				});
			});
	}

	componentDidMount = () => {
		this.getLatestData( this.state );
	}

	render() {
		let htmlToReactParser = new HtmlToReactParser();
		const { attributes, setAttributes } = this.props;
		const {
			postType,
			terms,
			taxonomy,
			displayPostDate,
			displayPostExcerpt,
			displayPostContent,
			displayPostAuthor,
			displayPostImage,
			displayPostLink,
			displayTitleLink,
			align,
			postLayout,
			columns,
			order,
			pagination,
			orderBy,
			postsToShow,
			readMoreText,
			imageLocation,
			taxonomyLocation,
			imageType,
			imageTypeSize,
			avatarSize,
			changeCapitilization,
			displayTaxonomies,
			trimWords,
			titleAlignment,
			customFieldAlignment,
			imageAlignment,
			metaAlignment,
			contentAlignment,
			padding,
			border,
			borderRounded,
			borderColor,
			backgroundColor,
			titleColor,
			customFieldsColor,
			linkColor,
			contentColor,
			continueReadingColor,
			titleFont,
			customFieldsFont,
			metaFont,
			contentFont,
			continueReadingFont,
			displayTitle,
			displayCustomFields,
			customFields,
			removeStyles,
			titleHeadingTag,
			fallbackImg
		} = attributes;

		// Fonts
		let fontOptions = [];
		for (var key in ptam_globals.fonts) {
			fontOptions.push({ value: key, label: ptam_globals.fonts[key] });
		}

		// Taxonomies.
		let taxOptions = [];
		for (var key in ptam_globals.taxonomies) {
			taxOptions.push({ value: key, label: ptam_globals.taxonomies[key] });
		}

		// Order Params.
		const orderOptions = [
			{ value: "ASC", label: __("ASC", "post-type-archive-mapping") },
			{ value: "DESC", label: __("DESC", "post-type-archive-mapping") }
		];

		const orderByOptions = [
			{ value: "name", label: __("Term Name", "post-type-archive-mapping") },
			{ value: "slug", label: __("Term Slug", "post-type-archive-mapping") },
			{ value: "order", label: __("Term Order", "post-type-archive-mapping") },
		];

		const inspectorControls = (
			<InspectorControls>
				<PanelBody
					title={__("Query", "post-type-archive-mapping")}
				>
					<SelectControl
						label={__("Taxonomies", "post-type-archive-mapping")}
						options={taxOptions}
						value={taxonomy}
						onChange={value => {
							this.props.setAttributes({
								taxonomy: value,
							});
						}}
					/>
					<SearchListControl
						list={this.state.terms}
						selected={terms}
						onChange={value => {
							this.props.setAttributes({ terms: value });
						}}
					/>
					<SelectControl
						label={__("Order", "post-type-archive-mapping")}
						options={orderOptions}
						value={order}
						onChange={value => {
							this.props.setAttributes({ order: value });
						}}
					/>
					<SelectControl
						label={__("Order By", "post-type-archive-mapping")}
						options={orderByOptions}
						value={orderBy}
						onChange={value => {
							this.props.setAttributes({ orderBy: value });
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
						<div className="ptam-loading">
							<h1>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" />
									<path d="M0 0h24v24H0z" fill="none" />
								</svg>{" "}
								{__("Term Grid", "post-type-archive-mapping")}
							</h1>
							<h2>
								{__("Finding items...", "post-type-archive-mapping")}{" "}
								<Spinner />
							</h2>
						</div>
					</Placeholder>
				</Fragment>
			);
		}
		if ( ! this.state.loading ) {
			return (
				<Fragment>
					{inspectorControls}
					Hi
				</Fragment>
			);
		}

		const layoutControls = [
			{
				icon: "grid-view",
				title: __("Grid View", "post-type-archive-mapping"),
				onClick: () => setAttributes({ postLayout: "grid", displayPostContent: false }),
				isActive: postLayout === "grid"
			},
			{
				icon: "list-view",
				title: __("List View", "post-type-archive-mapping"),
				onClick: () => setAttributes({ postLayout: "list", displayPostContent: false }),
				isActive: postLayout === "list"
			},
		];

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
			</Fragment>
		);
	}
}

export default PTAM_Term_Grid;
