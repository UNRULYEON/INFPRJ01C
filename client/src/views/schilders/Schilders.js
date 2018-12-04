import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import './Schilders.css';

// Components
import PageTitle from '../../components/pageLink/PageLink';
import Gallery from '../../components/gallery/Gallery';

const GET_PAINTERS = gql`
  {
    paintersAll {
      id
      name
      headerimage
    }
  }
`
 
class Schilders extends Component {
  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilders"/>
        <Query
          query={GET_PAINTERS}
          pollInterval={500}
        >
          {({loading, error, data}) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
                <Gallery images={data.paintersAll} noDetails={true} />
            )
          }}
        </Query>
      </section>
    );
  }
}

export default Schilders;
