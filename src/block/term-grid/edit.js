/**
 * External dependencies
 */
import dayjs from "dayjs";
import classnames from "classnames";
import axios from "axios";
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
		};

		//this.get_latest_data();
	}

	render() {
		let htmlToReactParser = new HtmlToReactParser();
		const { attributes, setAttributes } = this.props;
		const {
			postType,
			term,
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
		let fonts = this.state.fonts;
		for (var key in fonts) {
			fontOptions.push({ value: key, label: fonts[key] });
		}

		const inspectorControls = (
			<InspectorControls>
				<PanelBody
					title={__("Term Grid Settings", "post-type-archive-mapping")}
				>
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
