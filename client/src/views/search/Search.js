import React, { Component } from 'react';
import Pagination from 'rc-pagination';
import nl_NL from 'rc-pagination/lib/locale/nl_NL';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import './Search.css'

// Material-UI
import TextField from '@material-ui/core/TextField';

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
	keyPress = e => {
		if(e.keyCode === 13){
			console.log('value', e.target.value);
			this.props.setQuery(e.target.value)
			this.setState({
				redirectSearch: true
			})
			this.toggleSearchBar()
		}
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <section className="section-container">
        <Query
          query={SEARCH}
          variables={{ query: this.props.query, page: this.props.page }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading... :)</p>;
              if (error) return <p>Error :(</p>;

              return (
                <div className="searchbar-results-wrapper">
                  <Pagination
                    showTotal={(total, range) => `${range[0]} - ${range[1]} van ${total} items`}
                    pageSize={12}
                    total={data.searchbar.total}
                    onChange={this.onChange}
                    current={this.props.page}
                    locale={nl_NL}
                  />
                  <Gallery images={data.searchbar.paintings}/>
                  <Pagination
                    showTotal={(total, range) => `${range[0]} - ${range[1]} van ${total} items`}
                    pageSize={12}
                    total={data.searchbar.total}
                    onChange={this.onChange}
                    current={this.props.page}
                    locale={nl_NL}
                  />
                </div>
              )
            }}
          </Query>
      </section>
    );
  }
}

export default Search;
