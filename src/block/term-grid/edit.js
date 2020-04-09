/**
 * External dependencies
 */
import dayjs from "dayjs";
import classnames from "classnames";
import axios from "axios";
import { SearchListControl } from '@woocommerce/components';
import Loading from '../components/Loading';
var HtmlToReactParser = require("html-to-react").Parser;

const { Component, Fragment } = wp.element;

const { __, _n } = wp.i18n;

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
	Toolbar,
	Button,
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
			termLoading: false,
			fonts: [],
			taxonomy: 'category',
			termsToDisplay: {},
			termsToExclude: {},
			terms: [],
			termsExclude: [],
		};

		//this.get_latest_data();
	}

	getTerms = ( object = {} ) => {
		const props = jQuery.extend({}, this.props.attributes, object);
		let termsList = [];
		let termsListExclude = [];
		let {
			taxonomy,
		} = props;
		this.setState( {
			loading: true,
		} );
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
						termsListExclude.push({ id: value.term_id, name: value.name });
						termsList.push({ id: value.term_id, name: value.name });
					});
				}
				this.setState({
					loading: false,
					terms: termsList,
					termsExclude: termsListExclude,
				});
				this.displayTerms( { value: termsList } );
			});
	}
	displayTerms = () => {
		const { order, orderBy, taxonomy, termsExclude, terms } = this.props.attributes;
		let termsToRetrieve = [];
		let termsToExclude = [];
		terms.forEach( function( termObject ) {
			termsToRetrieve.push( termObject.id );
		} );
		termsExclude.forEach( function( termObject ) {
			termsToExclude.push( termObject.id );
		} );
		this.setState( {
			termLoading: true,
		} );
		axios
			.post(ptam_globals.rest_url + `ptam/v2/get_tax_term_data`, {
				terms: termsToRetrieve,
				termsExclude: termsToExclude,
				order: order,
				orderBy: orderBy,
				taxonomy: taxonomy,
			})
			.then(response => {
				if (Object.keys(response.data).length > 0) {
					this.setState( {
						termsToDisplay: response.data.term_data,
					} );
				}
				this.setState( {
					termLoading: false,
				} );
			});
	}

	getTermHtml = () => {
		const terms = this.state.termsToDisplay;
		if ( Object.keys( terms ).length === 0 ) {
			return (
				<h2>
					{ __( 'No terms could be found.', 'post-type-archive-mapping' ) }
				</h2>
			);
		}
		return ( Object.keys(terms).map( ( term, i ) =>
			<Fragment key={i}>
				<div className="ptam-term-grid-item">
					{terms[i].permalink}
				</div>
			</Fragment>
		) );
	}
	

	componentDidMount = () => {
		this.getTerms( this.state );
	}

	render() {
		let htmlToReactParser = new HtmlToReactParser();
		const { attributes, setAttributes } = this.props;
		const {
			terms,
			termsExclude,
			taxonomy,
			align,
			order,
			orderBy,
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

		// Term select messages.
		const termMessages = {
			clear: __( 'Clear all terms', 'post-type-archive-mapping' ),
			list: __( 'Terms', 'post-type-archive-mapping' ),
			noItems: __(
				"There are no terms to select.",
				'post-type-archive-mapping'
			),
			search: __(
				'Search for terms to display',
				'post-type-archive-mapping'
			),
			selected: ( n ) =>
				sprintf(
					_n(
						'%d term selected',
						'%d terms selected',
						n,
						'post-type-archive-mapping'
					),
					n
				),
			updated: __(
				'Term search results updated.',
				'post-type-archive-mapping'
			),
		};
		// Term select messages.
		const termMessagesExclude = {
			clear: __( 'Clear all terms', 'post-type-archive-mapping' ),
			list: __( 'Terms', 'post-type-archive-mapping' ),
			noItems: __(
				"There are no terms to select.",
				'post-type-archive-mapping'
			),
			search: __(
				'Search for terms to exclude',
				'post-type-archive-mapping'
			),
			selected: ( n ) =>
				sprintf(
					_n(
						'%d term selected',
						'%d terms selected',
						n,
						'post-type-archive-mapping'
					),
					n
				),
			updated: __(
				'Term search results updated.',
				'post-type-archive-mapping'
			),
		};

		// Whether to show term exclusion or not.
		let showTermExclude = false;
		terms.forEach( function( termObject ) {
			if ( 0 === termObject.id ) {
				showTermExclude = true;
				return;
			}
		} );

		const inspectorControls = (
			<InspectorControls>
				<PanelBody initialOpen={false}
					title={__("Query", "post-type-archive-mapping")}
				>
					<SelectControl
						label={__("Taxonomies", "post-type-archive-mapping")}
						options={taxOptions}
						value={taxonomy}
						onChange={value => {
							this.props.setAttributes({
								taxonomy: value,
								terms: [],
								termsExclude: [],
							});
							this.getTerms({ taxonomy: value });
						}}
					/>
					<SelectControl
						label={__("Order", "post-type-archive-mapping")}
						options={orderOptions}
						value={order}
						onChange={value => {
							this.props.setAttributes({ order: value });
							this.props.attributes.order = value;
							this.displayTerms();
						}}
					/>
					<SelectControl
						label={__("Order By", "post-type-archive-mapping")}
						options={orderByOptions}
						value={orderBy}
						onChange={value => {
							this.props.setAttributes({ orderBy: value });
							this.props.attributes.orderBy = value;
							this.displayTerms();
						}}
					/>
					<h2>{__('Terms to Include', 'post-type-archive-mapping')}</h2>
					<SearchListControl
						className="ptam-term-select"
						list={this.state.terms}
						selected={terms}
						onChange={value => {
							this.props.setAttributes({ terms: value });
						}}
						messages={termMessages}
					/>
					<Button
						isTertiary={true}
						isLink={true}
						onClick={event => {
							this.displayTerms();
						}}
					>
						{__('Apply', 'post-type-archive-mapping')}
					</Button>

					{ showTermExclude &&
						<Fragment>
							<h2>{__('Terms to Exclude', 'post-type-archive-mapping')}</h2>
							<SearchListControl
								className="ptam-term-exclude"
								list={this.state.termsExclude}
								selected={termsExclude}
								onChange={value => {
									this.props.setAttributes({ termsExclude: value });
								}}
								messages={termMessagesExclude}
							/>
							<Button
								isTertiary={true}
								isLink={true}
								onClick={event => {
									this.displayTerms();
								}}
							>
								{__('Apply', 'post-type-archive-mapping')}
							</Button>
						</Fragment>
					}
				</PanelBody>
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
								<Loading cssClass="ptam-term-grid-loading-animation" />
							</h2>
						</div>
					</Placeholder>
				</Fragment>
			);
		}
		if ( this.state.termLoading ) {
			return (
				<Fragment>
					{inspectorControls}
					<Placeholder>
						<div className="ptam-term-grid-loading">
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
								<Loading cssClass="ptam-term-grid-loading-animation" />
							</h2>
						</div>
					</Placeholder>
				</Fragment>
			);
		}
		if ( ! this.state.loading && ! this.state.termLoading ) {
			return (
				<Fragment>
					{inspectorControls}
					{this.getTermHtml()}
				</Fragment>
			);
		}

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
