import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import './Details.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

class Details extends Component {
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
      <div className="details-container">
        <aside className="details-container-aside">
          <Link to={`/user/${this.props.user.name}/gegevens`} className="details-aside-link">Mijn gegevens</Link>
          <Link to={`/user/${this.props.user.name}/kooplijst`} className="details-aside-link">Mijn kooplijst</Link>
          <Link to={`/user/${this.props.user.name}/huurlijst`} className="details-aside-link">Mijn huurlijst</Link>
          <Link to={`/faq`} className="details-aside-link">FAQ</Link>
        </aside>
        <div>
          <PageTitle title="Gegevens"/>
        </div>
      </div>
      </section>
    );
  }
}

export default Details;
