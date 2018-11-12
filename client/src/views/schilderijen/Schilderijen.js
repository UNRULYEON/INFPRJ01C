import React, { Component } from 'react';
import { Query } from "react-apollo";
import {
    Redirect
} from 'react-router-dom';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import gql from "graphql-tag";
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/gallery/Gallery'

const GET_ART = gql`
  query Paintings_pagination($page: Int!){
    paintingOrderedByPagination(page: $page){
      total
      collection {
        id_number
        title
        src
        width
        height
      }
    }
  }
`;

class Schilderijen extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 1
    }
  }

  onChange = (page) => {
    console.log(page);
    this.setState({
      page: page,
    });
  }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilderijen"/>
        <Query
          query={GET_ART}
          variables={{ page: this.state.page }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading... :)</p>;
              if (error) return <p>Error :(</p>;

              return (
                <div>
                  <Gallery images={data.paintingOrderedByPagination.collection}/>
                  <Pagination
                    showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                    total={data.paintingOrderedByPagination.total}
                    onChange={this.onChange}
                    current={this.state.page}
                  />
                </div>
              )
            }}
          </Query>
      </section>
    );
  }
}

export default Schilderijen;
