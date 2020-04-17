/**
 * External dependencies
 */
import classnames from "classnames";
import axios from "axios";
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
} = wp.components;

const {
	__experimentalGradientPickerControl,
	MediaUpload,
	InspectorControls,
	PanelColorSettings,
} = wp.blockEditor;

const MAX_POSTS_COLUMNS = 1;

class PTAM_Featured_Posts extends Component {
	constructor() {
		super(...arguments);

		this.state = {
			loading: true,
			taxonomy: "category",
			postType: 'post',
			postTypes: ptam_globals.post_types,
			imageSizes: ptam_globals.image_sizes,
		};

		//this.get_latest_data();
	}

	getTerms = (object = {}) => {
		const props = jQuery.extend({}, this.props.attributes, object);
		let termsList = [];
		let termsListExclude = [];
		let { taxonomy } = props;
		this.setState({
			loading: true,
		});
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_tax_terms`, {
				taxonomy: taxonomy,
			})
			.then((response) => {
				if (Object.keys(response.data).length > 0) {
					termsList.push({
						id: 0,
						name: __("All", "post-type-archive-mapping"),
					});
					jQuery.each(response.data, function (key, value) {
						termsListExclude.push({ id: value.term_id, name: value.name });
						termsList.push({ id: value.term_id, name: value.name });
					});
				}
				this.setState({
					loading: false,
					terms: termsList,
					termsExclude: termsListExclude,
				});
				this.displayTerms({ value: termsList });
			});
	};
	displayTerms = () => {
		const {
			order,
			orderBy,
			taxonomy,
			termsExclude,
			terms,
			backgroundImageSource,
			backgroundImageFallback,
			backgroundImageMeta,
			imageSize,
		} = this.props.attributes;
		let termsToRetrieve = [];
		let termsToExclude = [];
		terms.forEach(function (termObject) {
			termsToRetrieve.push(termObject.id);
		});
		termsExclude.forEach(function (termObject) {
			termsToExclude.push(termObject.id);
		});
		this.setState({
			termLoading: true,
		});
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_tax_term_data`, {
				terms: termsToRetrieve,
				termsExclude: termsToExclude,
				order: order,
				orderBy: orderBy,
				taxonomy: taxonomy,
				backgroundImageSource: backgroundImageSource,
				backgroundImageFallback: backgroundImageFallback,
				backgroundImageMeta: backgroundImageMeta,
			})
			.then((response) => {
				if (Object.keys(response.data).length > 0) {
					this.setState({
						termsToDisplay: response.data.term_data,
					});
				}
				this.setState({
					termLoading: false,
				});
			});
	};

	getTermHtml = () => {
		const terms = this.state.termsToDisplay;
		const htmlToReactParser = new HtmlToReactParser();
		const {
			linkContainer,
			showTermTitle,
			showTermDescription,
			disableStyles,
			backgroundType,
			termTitleColor,
			termDescriptionColor,
			itemBorder,
			itemBorderColor,
			itemBorderRadius,
			termTitleFont,
			termDescriptionFont,
			showButton,
			termButtonText,
			termButtonFont,
			termButtonTextColor,
			termButtonTextHoverColor,
			termButtonBackgroundColor,
			termButtonBackgroundHoverColor,
			termButtonBorder,
			termButtonBorderColor,
			termButtonBorderRadius,
		} = this.props.attributes;
		if (Object.keys(terms).length === 0) {
			return (
				<h2>{__("No terms could be found.", "post-type-archive-mapping")}</h2>
			);
		}
		const termTitleStyles = !disableStyles
			? {
					color: termTitleColor,
					fontFamily: `${termTitleFont}`,
			  }
			: {};
		const termDescriptionStyles = !disableStyles
			? {
					color: termDescriptionColor,
					fontFamily: `${termDescriptionFont}`,
			  }
			: {};

		const termButtonStyles = !disableStyles
			? {
					color: termButtonTextColor,
					backgroundColor: termButtonBackgroundColor,
					borderWidth: termButtonBorder + "px",
					borderColor: termButtonBorderColor,
					borderRadius: termButtonBorderRadius,
					fontFamily: `${termButtonFont}`,
					borderStyle: "solid",
			  }
			: {};
		return Object.keys(terms).map((term, i) => (
			<Fragment key={i}>
				<div
					className="ptam-term-grid-item"
					style={
						"image" === backgroundType && !disableStyles
							? {
									backgroundImage: `url(${terms[i].background_image})`,
									borderWidth: `${itemBorder}px`,
									borderColor: `${itemBorderColor}`,
									borderRadius: `${itemBorderRadius}%`,
									borderStyle: "solid",
							  }
							: !disableStyles
							? {
									borderWidth: `${itemBorder}px`,
									borderColor: `${itemBorderColor}`,
									borderRadius: `${itemBorderRadius}%`,
									borderStyle: "solid",
							  }
							: {}
					}
				>
					<div className="ptam-term-grid-item-content">
						{showTermTitle && (
							<h2 style={termTitleStyles}>
								{i in terms
									? terms[i].name
									: __("Unknown Title", "post-type-archive-mapping")}
							</h2>
						)}
						{showTermDescription && (
							<div
								className="ptam-term-grid-item-description"
								style={termDescriptionStyles}
							>
								{i in terms
									? htmlToReactParser.parse(terms[i].description)
									: ""}
							</div>
						)}
						{!linkContainer && showButton && (
							<a
								href="#"
								className="ptam-term-grid-button btn button"
								style={termButtonStyles}
							>
								{termButtonText}
							</a>
						)}
					</div>
				</div>
			</Fragment>
		));
	};

	componentDidMount = () => {
		//this.getTerms(this.state);
	};

	render() {
		let htmlToReactParser = new HtmlToReactParser();
		const { attributes, setAttributes } = this.props;
		const {
			term,
			taxonomy,
			postsInclude,
			order,
			orderBy,
			postsExclude,
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

		const inspectorControls = (
			<InspectorControls>
				<PanelBody
					initialOpen={false}
					title={__("Query", "post-type-archive-mapping")}
				></PanelBody>
			</InspectorControls>
		);
		if (this.state.loading) {
			return (
				<Fragment>
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
								{__("Featured Posts", "post-type-archive-mapping")}
							</h1>
							<h2>
								<Loading cssClass="ptam-term-grid-loading-animation" />
							</h2>
						</div>
					</Placeholder>
				</Fragment>
			);
		}
	}
}

export default PTAM_Featured_Posts;
