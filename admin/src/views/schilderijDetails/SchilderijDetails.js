import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import './SchilderijDetails.css';

const GET_ART_DETAILS = gql`
	query Painting($id: String!){
		paintingByID(id: $id){
			id
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
            id: this.props.match.params.id,
            title: '',
            principalmaker: '',
        }
    }

    setID(id) {
        this.setState({
            id: id
        })
    }

    componentDidMount() {
        this.setID(this.props.match.params.id)
    }

    getMakerLink(id, maker) {
        if (maker !== "anoniem") {
            return (
                maker
            )
        } else {
            return (
                "Anoniem"
            )
        }
    }

    //handles change of the MAIL state
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        })
    }

    render() {
        return (


            <Query query={GET_ART_DETAILS} variables={{ id: this.state.id }}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading... :)</p>;
                    if (error) return <p>Error :(</p>;
                    return (
                        <section className="section-container">
                            Schilderij ID: {this.state.id}
                            {this.getMakerLink(data.paintingByID[0].painter, data.paintingByID[0].principalmaker)}
                        </section>
                    )


                }}
            </Query>
        )
    }

}

export default SchilderijDetails;