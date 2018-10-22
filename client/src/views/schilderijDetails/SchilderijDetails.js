import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import './SchilderijDetails.css'

// Components
import Img from 'react-image'
import Loading from '../../components/loading/Loading'
import Tabs from '../../components/tabs/Tabs';

const GET_ART_DETAILS = gql`
	query Painting($id: String!){
		paintingByID(id: $id){
			id_number
			title
			releasedate
			period
			description
			physicalmedium
			amountofpaintings
			principalmaker
			bigsrc
			width
			height
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

	componentDidMount() {
		console.log(`Painting ID: ${this.props.match.params.id}`)
		this.setState({
				id: this.props.match.params.id
		})
	}

	getMakerLink(maker) {
		if (maker !== "anoniem") {
			return (
				<NavLink to={"/schilder/" + maker}>{maker}</NavLink>
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
									{this.getMakerLink(data.paintingByID[0].principalmaker)}
								</span>
								<span className="details-price">{data.paintingByID[0].price || "€ PRICE"}</span>
								<div className="details-buttons flex row-nowrap">
									<button>Bestel nu</button>
									<button>Huren</button>
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
