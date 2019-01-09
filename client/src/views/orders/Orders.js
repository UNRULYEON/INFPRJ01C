import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import './Orders.css'

// GraphQL
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ListAccordion from '../../components/listaccordion/ListAccordion'

// Components
import PageTitle from '../../components/pageLink/PageLink'

const GET_ORDERS = gql`
  query AllOrders ($buyerId: Int!) {
    orderListSelect
    (buyerId: $buyerId){
      id
      buyerid
      purchasedate
      total
      items {
        id
        items
        status
      }
    }
  }
`;

class Orders extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false
    }
  }

  componentDidMount = () => {
    console.log(this.props.user.id)
  }

  setUserApp(user, isLoggedIn) {
    this.props.setUser(user, isLoggedIn)
    this.setState({
      redirect: true
    })
  }

  render() {
    return (
      <section className="section-container">
      <div className="details-container-list">
        <aside className="details-container-aside">
          {/* <NavLink exact to={`/user/${this.props.user.name}/kooplijst`} activeClassName="details-aside-link">Mijn gegevens</NavLink> */}
          <Link to={`/user/${this.props.user.name}/gegevens`} className="details-aside-link">Mijn gegevens</Link>
          <Link to={`/user/${this.props.user.name}/kooplijst`} className="details-aside-link">Mijn kooplijst</Link>
          <Link to={`/user/${this.props.user.name}/huurlijst`} className="details-aside-link">Mijn huurlijst</Link>
          <Link to={`/faq`} className="details-aside-link">FAQ</Link>
        </aside>
        <div style={{ width: '100%' }}>
          <PageTitle title="Kooplijst"/>
          <Query
            query={GET_ORDERS}
            variables={{ buyerId: this.props.user.id }}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading... :)</p>;
              if (error) return <p>Error :(</p>;
              return (
                <ListAccordion data={data.orderListSelect} />
              )
            }}
          </Query>
        </div>
      </div>
      </section>
    );
  }
}

export default Orders;
