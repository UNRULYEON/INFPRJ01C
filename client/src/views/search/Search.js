import React, { Component } from 'react';
import Pagination from 'rc-pagination';
import nl_NL from 'rc-pagination/lib/locale/nl_NL';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import './Search.css'

// Components
import Gallery from '../../components/gallery/Gallery'

const SEARCH = gql`
  query Searchbar($query: String!, $page: Int!) {
    searchbar(query: $query, page: $page) {
      total
      paintings{
        id_number
        title
        src
        width
        height
        price
      }
    }
  }
`;


class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 1,
      query: ''
    }
  }

  componentDidMount = () => {
    let q = this.props.location.search
    this.setState({
      query: q.slice(3)
    })
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      query: nextProps.query
    })
  }

  onChange = (page) => {
    this.setState({
      page: page,
    });
    window.scroll(0,0)
  }

  render() {
    return (
      <section className="section-container">
        <Query
          query={SEARCH}
          variables={{ query: this.state.query, page: this.state.page }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading... :)</p>;
              if (error) return <p>Error :(</p>;

              return (
                <div className="searchbar-results-wrapper">
                  {data.searchbar.paintings.length > 0 ? (
                    <div>
                      <Pagination
                        showTotal={(total, range) => `${range[0]} - ${range[1]} van ${total} items`}
                        pageSize={12}
                        total={data.searchbar.total}
                        onChange={this.onChange}
                        current={this.state.page}
                        locale={nl_NL}
                      />
                      <Gallery images={data.searchbar.paintings}/>
                      <Pagination
                        showTotal={(total, range) => `${range[0]} - ${range[1]} van ${total} items`}
                        pageSize={12}
                        total={data.searchbar.total}
                        onChange={this.onChange}
                        current={this.state.page}
                        locale={nl_NL}
                      />
                    </div>
                  ) : (
                    <div className="no-search-res">
                      <span className="no-search-res-big">Geen resultaten</span>
                      <span className="no-search-res-small">Probeer een andere zoekopdracht</span>
                    </div>
                  )}
                </div>
              )
            }}
          </Query>
      </section>
    );
  }
}

export default Search;
