import React, { Component } from 'react';
import './Registreren.css';

// Components
import PageTitle from '../../components/pageLink/PageLink';

import posed from "react-pose";

const FirstStepContainer = posed.div({
  open: {
    x: '0%',
    transition: {
      x: {
        type: 'tween',
        ease: 'easeIn',
        duration: '400'
      }
    }
  },
  closed: {
    x: '100%',
    transition: {
      x: {
        type: 'tween',
        ease: 'easeIn',
        duration: '500'
      }
    }
  }
});

class Registreren extends Component {
  constructor() {
    super();
    this.state = {
      Email: '',
      Wachtwoord: '',
      Voornaam: '',
      Achternaam: '',
      Straat: '',
      Huisnummer: '',
      Postcode: '',
      Stad: '',
      Aanhef: '',
      isHidden: false,
      isHidden2: true,
      toggle: false,
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden,
      isHidden2: !this.state.isHidden2,
      toggle: !this.state.toggle
    });
  }

  save() {
    console.log(this.state);
    //show state in console log
  }

  onChange = (e) => {
    console.log(e.target.checked);
    this.setState({
      [e.target.placeholder]: e.target.value
    });
  }

  render() {
    return (
      <section className="section-container">
        <div id="form">
          {!this.state.isHidden && (<div id="een">

            <div id="for" className="dropdown-form">
              <span className="menu-title">Account</span>
              <input
                id="email"
                placeholder="Email"
                type="email"
                onChange={e => this.onChange(e)}
                value={this.state.Email}
              />
              <input
                id="pas"
                placeholder="Wachtwoord"
                type="password"
                onChange={e => this.onChange(e)}
                value={this.state.Wachtwoord}
              />
              <button
                onClick={this.toggleHidden.bind(this)}
                className="dropdown-button"
                id="button"
                type="primary">Doorgaan</button>
            </div>


            <div id="Waarom">
              <h1>Waarom een account?</h1>
              <p className="details-info">Beheer al je bestellingen en retouren op een plek</p>
              <p className="details-info">Bestel sneller met je bewaarde gegevens</p>
              <p className="details-info">Je winkelmandje altijd en overal opgeslagen</p>
            </div>

          </div>)}



          <FirstStepContainer pose={this.state.toggle ? 'open' : 'closed'}>
            {!this.state.isHidden2 && (<div id="twee">

              <div id="stappen">
                <p id="uno"><b>1</b></p>
                <h3 id="unoText">Email en wachtwoord</h3>
                <p id="dos"><b>2</b></p>
                <h3 id="dosText">Naam en adres</h3>
                <p id="tres"><b>3</b></p>
                <h3 id="tresText">Betaalwijze</h3>
              </div>


              <div id="naam" className="dropdown-form">
                <h1>Naam</h1>

                <p>Aanhef</p>

                <p><input type="radio" name="gender" placeholder="Aanhef" value="Dhr" onChange={e => this.onChange(e)} />Dhr.</p>
                <p><input type="radio" name="gender" placeholder="Aanhef" value="Mevr" onChange={e => this.onChange(e)} />Mevr.</p>

                <p id="voornaam">Voornaam <b>*</b></p>
                <input
                  type="text"
                  placeholder="Voornaam"
                  onChange={e => this.onChange(e)}
                  value={this.state.Voornaam}
                />

                <p>Achternaam <b>*</b></p>
                <input
                  type="text"
                  placeholder="Achternaam"
                  onChange={e => this.onChange(e)}
                  value={this.state.Achternaam}
                />

              </div>

              <div id="adres" className="dropdown-form">
                <h1>Adres</h1>

                <p>straat</p>
                <input
                  type="text"
                  placeholder="Straat"
                  onChange={e => this.onChange(e)}
                  value={this.state.Straat}
                />

                <p>Huisnummer</p>
                <input
                  type="text"
                  placeholder="Huisnummer"
                  onChange={e => this.onChange(e)}
                  value={this.state.Huisnummer}
                />

                <p>Postcode</p>
                <input
                  type="text"
                  placeholder="Postcode"
                  onChange={e => this.onChange(e)}
                  value={this.state.Postcode}
                />

                <p>Stad</p>
                <input
                  type="text"
                  placeholder="Stad"
                  onChange={e => this.onChange(e)}
                  value={this.state.Stad}
                />

              </div>

              <button onClick={this.toggleHidden.bind(this)} className="dropdown-button" id="button" type="primary">Terug</button>
              <button onClick={this.save.bind(this)} className="dropdown-button" id="button" type="primary">Save</button>
            </div>)}
          </FirstStepContainer>
        </div >
      </section >

    );
  }
}

export default Registreren;
