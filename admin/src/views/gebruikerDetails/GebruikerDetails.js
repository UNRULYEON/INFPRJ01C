import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import './GebruikerDetails.css';

// const GET_PAINTER_DETAILS = gql`
//   query Painter($id: String!){
//     painterByID(id: $id){
//       name
//       headerimage
//       description
//     }
//   }
// `



class GebruikerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: ''
    }
  }

  componentDidMount() {
    console.log(`Gebruiker ID: ${this.props.match.params.id}`)
    this.setState({
      id: this.props.match.params.id
    })
  }

  render() {
    return (
      <section className="section-container">
        Gebruiker: {this.state.id}


      </section>
    );
  }
}

export default GebruikerDetails;
