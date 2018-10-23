import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import './SchilderDetails.css';

// Components
import HeroImage from '../../components/heroimage/HeroImage';
import PainterDescription from '../../components/painterDescription/PainterDescription';
import Gallery from '../../components/gallery/Gallery';

const GET_PAINTER_DETAILS = gql`
  query Painter($id: String!){
    painterByID(id: $id){
      name
      id_number
      headerimage
      description
    }
  }
`

const GET_PAINTER_WORKS = gql`
  query Paintings($id: String!){
    workByPainter(id: $id){
      name
      id_number
      headerimage
      description
    }
  }
`

class SchilderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ''
    }
  }

  componentDidMount() {
    console.log(`Painter ID: ${this.props.match.params.id}`)
    this.setState({
      id: this.props.match.params.id
    })
  }

  render() {
    return (
      <section className="section-container">
        <Query
          query={GET_PAINTER_DETAILS}
          variables={{ id: this.state.id }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <div>
                <HeroImage
                  src={data.painterByID[0].headerimage}
                  name={data.painterByID[0].name}
                />
                <PainterDescription content={data.painterByID[0].description} />
              </div>
            )
          }}
        </Query>

        <Query
          query={GET_PAINTER_WORKS}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <div>
                {data.length ?
                  <div id="showGallery">
                    <h1>Werken van {this.state.painter.name}</h1>
                    <Gallery images={this.state.works} />
                  </div> :
                  (<h1>Geen schilderijen beschikbaar</h1>)}
              </div>
            )
          }}
        </Query>


      </section>
    );
  }
}

export default SchilderDetails;
