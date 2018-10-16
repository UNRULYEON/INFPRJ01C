import React, { Component } from 'react';
import './Registreren.css';

// Components
import PageTitle from '../../components/pageLink/PageLink'
import LoginOrRegister from '../../components/loginorregister/LoginOrRegister'

class Registreren extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="section-container">
        <LoginOrRegister />
        <div id="Waarom">
          <h1>Waarom een account?</h1>
          <p>Beheer al je bestellingen en retouren op een plek</p>
          <p>Bestel sneller met je bewaarde gegevens</p>
          <p>Je winkelmandje altijd en overal opgeslagen</p>
        </div>
      </section>
    );
  }
}

export default Registreren;
