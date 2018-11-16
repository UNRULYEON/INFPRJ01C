import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import './Cart.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

class Cart extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  // setUserApp(user, isLoggedIn) {
  //   this.props.setUser(user, isLoggedIn)
  //   this.setState({
  //     redirect: true
  //   })
  // }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Winkelwagen"/>
      </section>
    );
  }
}

export default Cart;
