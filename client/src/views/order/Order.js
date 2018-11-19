import React, { Component } from 'react';
// import {
//     Link,
//     Redirect
// } from 'react-router-dom';
import './Order.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

class Orders extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false
    }
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
        <PageTitle title="Bestellijst"/>
      </section>
    );
  }
}

export default Orders;
