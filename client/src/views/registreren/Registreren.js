import React, { Component } from 'react';
import './Registreren.css';

// Components
import PageTitle from '../../components/pageLink/PageLink';

class Registreren extends Component {
  constructor() {
    super();
    this.handleData = this.handleData.bind(this);
    this.state = {
      emailInput: '',
      pasInput: ''
    };
  }

  handleData(data) {
    this.setState({
      emailInput: data,
      pasInput: data
    });
  }

  render() {
    return (
      <div id="form">
        <section className="section-container">
          <div id="for">
            <form className="dropdown-form">
              <span className="menu-title">Account</span>
              <input id="email" placeholder="Email" type="email" />
              <input id="pas" placeholder="Wachtwoord" type="password" />
              <button id="button" type="submit" className="dropdown-button">Doorgaan</button>
            </form>

          </div>
          <div id="Waarom">
            <h1>Waarom een account?</h1>
            <p>Beheer al je bestellingen en retouren op een plek</p>
            <p>Bestel sneller met je bewaarde gegevens</p>
            <p>Je winkelmandje altijd en overal opgeslagen</p>
            <h5>Received by parent (registreren) :<br />{this.state.emailInput}<br /> {this.state.pasInput}</h5>
          </div>
        </section>
      </div>
    );
  }
}

export default Registreren;
