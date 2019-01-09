import React, { Component } from 'react';
import { Query } from "react-apollo";
import Pagination from 'rc-pagination';
import Select from 'rc-select';
import 'rc-select/assets/index.css';
import nl_NL from 'rc-pagination/lib/locale/nl_NL';
import gql from "graphql-tag";
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/gallery/Gallery'

const GET_ART = gql`
  query Paintings_pagination($page: Int!, $amount: Int!){
    paintingOrderedByPagination(page: $page, amount: $amount){
      total
      collection {
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

class Schilderijen extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 1,
      pageSize: 20,
    }
  }

  onChange = (page) => {
    this.setState({
      page: page,
    });
    window.scroll(0,0)
  }

  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
  }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilderijen"/>
        <Query
          query={GET_ART}
          variables={{ page: this.state.page, amount: this.state.pageSize }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading... :)</p>;
              if (error) return <p>Error :(</p>;

              return (
                <div>
                  <Pagination
                    showTotal={(total, range) => `${range[0]} - ${range[1]} van ${total} schilderijen`}
                    pageSize={this.state.pageSize}
                    total={data.paintingOrderedByPagination.total}
                    onShowSizeChange={this.onShowSizeChange}
                    selectComponentClass={Select}
                    showSizeChanger
                    onChange={this.onChange}
                    current={this.state.page}
                    locale={nl_NL}
                  />
                  <Gallery images={data.paintingOrderedByPagination.collection}/>
                  <Pagination
                    showTotal={(total, range) => `${range[0]} - ${range[1]} van ${total} schilderijen`}
                    pageSize={this.state.pageSize}
                    total={data.paintingOrderedByPagination.total}
                    onShowSizeChange={this.onShowSizeChange}
                    selectComponentClass={Select}
                    showSizeChanger
                    onChange={this.onChange}
                    current={this.state.page}
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

export default Schilderijen;
