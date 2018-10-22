import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/gallery/Gallery'

const GET_ART = gql`
  {
    collection {
      id_number
      title
      src
      width
      height
    }
  }
`;

class Schilderijen extends Component {

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilderijen"/>
        <Query query={GET_ART}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
                <Gallery images={data.collection}/>
              )
            }}
          </Query>
      </section>
    );
  }
}

export default Schilderijen;
