import React, { Component } from 'react';

import { Query } from "react-apollo";
import gql from "graphql-tag";

import './Search.css'

// Components
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

// const GET_ART_PAGE = gql`
//   query Pagination($page: Int!){
//     paintingOrderedByPagination(page: $page){
//       title
//     }
//   }
// `;



class Search extends Component {
  render() {
    return (
      <section className="section-container">
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

export default Search;
