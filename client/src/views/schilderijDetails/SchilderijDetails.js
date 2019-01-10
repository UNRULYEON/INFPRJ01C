import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Currency from 'react-currency-formatter';
import './SchilderijDetails.css'

// Material-UI
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

// Components
import Img from 'react-image'
import Loading from '../../components/loading/Loading'
import Tabs from '../../components/tabs/Tabs';

// Icons
import favorite from '../../icons/favorite.svg';

const GET_ART_DETAILS = gql`
	query Painting($id: String!){
		paintingByID(id: $id){
			title
			releasedate
			period
			description
			physicalmedium
			amountofpaintings
			principalmaker
			bigsrc
			src
			width
			height
			price
			painter
		}
	}
`;

class SchilderijDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: ''
		}
	}

	setCart = (data) => {
		this.props.setCart(data, 'ADD_TO_CART')
	}

	updateFavorite = (data) => {
		this.props.updateFavorite(data, 'ADD_TO_FAV')
	}

	setID(id) {
		// console.log(`Painting ID: ${id}`)
		this.setState({
				id: id
		})
	}

	componentDidMount() {
		this.setID(this.props.match.params.id)
	}

	componentWillReceiveProps(nextProps) {
		this.setID(nextProps.match.params.id)
	}

	getMakerLink(id ,maker) {
		if (maker !== "anoniem") {
			return (
				<NavLink to={"/schilder/" + id}>{maker}</NavLink>
			)
		} else {
			return (
				"Anoniem"
			)
		}
	}

	render() {
		return (
			<Query
				query={GET_ART_DETAILS}
				variables={{ id: this.state.id }}
			>
				{({loading, error, data}) => {
					if (loading) return <p>Loading...</p>;
					if (error) return <p>Error :(</p>;

					return (
						<section className="section-container">
						{/* Image and details container */}
						<div className="flex row-nowrap">
							<div className="image-container flex center">
								<Img
									src={[
										data.paintingByID[0].bigsrc
									]}
									width={
										data.paintingByID[0].width
									}
									key={data.paintingByID[0].id}
									loader={<Loading size={100} borderSize={10} />}
									unloader={<div className="error">It seems there was a problem<br />loading this image.<br />Reload the page</div>}
								/>
							</div>
							<div className="details-container flex column-nowrap y-center">
								<span className="details-title">{data.paintingByID[0].title || "TITLE"}</span>
									<span className="details-author">
										{this.getMakerLink(data.paintingByID[0].painter, data.paintingByID[0].principalmaker)}
									</span>
								<span className="details-price">
									<Currency
										quantity={data.paintingByID[0].price}
										symbol="€ "
										decimal=","
										group="."
									/>
								</span>
								<div className="details-buttons flex row-nowrap">
									<Tooltip title="Voeg toe aan je lijst" enterDelay={500} leaveDelay={200}>
										<IconButton
											color="primary"
											aria-label="Add to shopping cart"
											onClick={() => {
												const id = this.props.match.params.id
												const title = data.paintingByID[0].title
												const principalmaker = data.paintingByID[0].principalmaker
												const src = data.paintingByID[0].src
												const width = data.paintingByID[0].width
												const height = data.paintingByID[0].height
												const price = data.paintingByID[0].price
												const amount = 1
												const priceWithDays = data.paintingByID[0].price
												const days = 1
												const startDate = new Date()
												let endDate = new Date()
												endDate.setDate(endDate.getDate() + 1)

												const item = {
													id,
													title,
													principalmaker,
													src,
													width,
													height,
													price,
													amount,
													priceWithDays,
													days,
													startDate,
													endDate
												}
												this.setCart(item)
											}}
											>
											<Icon>
												playlist_add
											</Icon>
										</IconButton>
									</Tooltip>
									<Tooltip title="Voeg toe aan je favorietenlijst" enterDelay={500} leaveDelay={200}>
										<IconButton
											color="primary"
											aria-label="Voeg toe aan je favorietenlijst"
											onClick={() => {
												const id = this.props.match.params.id
												const title = data.paintingByID[0].title
												const principalmaker = data.paintingByID[0].principalmaker
												const src = data.paintingByID[0].src
												const width = data.paintingByID[0].width
												const height = data.paintingByID[0].height
												const price = data.paintingByID[0].price
												const amount = 1
												const startDate = new Date()
												let endDate = new Date()
												endDate.setDate(endDate.getDate() + 1)

												const item = {
													id,
													title,
													principalmaker,
													src,
													width,
													height,
													price,
													amount,
													startDate,
													endDate
												}
												this.updateFavorite(item)
											}}
											>
											<Icon>
												favorite
											</Icon>
										</IconButton>
									</Tooltip>
								</div>
								<span className="divider my-3"></span>
								<span className="details-info">Gratis levering</span>
								<span className="details-info">100 dagen retourrecht</span>
							</div>
						</div>
						{/* Info and "people also bought" container */}
						<div className="flex row-nowrap mt-5">
							<div className="info-container">
								<Tabs
									data={[
										{
											title: "Beschrijving",
											content: data.paintingByID[0].description
										},
										{
											title: "Datum",
											content: "Jaar uitgebracht: " + data.paintingByID[0].releasedate
										},
										{
											title: "Materiaal",
											content: data.paintingByID[0].physicalmedium
										}
									]}
									key={data.paintingByID[0].id}
								/>
							</div>
							<div className="more-container">
							</div>
						</div>
					</section>
					)
				}}
			</Query>
		);
	}
}

export default SchilderijDetails;
