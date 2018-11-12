import React, { Component } from 'react';
import './Registreren.css';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

// Components
import PageTitle from '../../components/pageLink/PageLink';

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        color: 'white', // Some CSS
      },
    },
  },
});

// const SIGNUP = gql`
//   mutation Signup($name: String!, $surname: String!, $mail: String!, $password: String!, $aanhef: String!, $adres: String!, $city: String!, $postalcode: String!) {
//   signup(name: $name, surname: $surname, mail: $mail, password: $password, aanhef: $aanhef, adres: $adres, city: $city, postalcode: $postalcode)
//   }
// `;

const SIGNUP = gql `
mutation Signup($name: String!, $surname: String!, $mail: String!, $password: String!, $aanhef: String!, $adres: String!, $city: String, $postalcode: String!) {
  signup(name: $name, surname: $surname, mail: $mail, password: $password, aanhef: $aanhef, adres: $adres, city: $city, postalcode: $postalcode) {
    id
    name
    surname
    email
    address
    city
    postalcode
    password
    aanhef
    token
  }
}
  `;

class Registreren extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      surname: '',
      mail: '',
      password: '',
      aanhef: 'Dhr',
      adres: '',
      city: '',
      postalcode: '',
      isHidden: false,
      isHidden2: true,
      isHidden3: false,
      toggle: false
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden,
      isHidden2: !this.state.isHidden2,
      toggle: !this.state.toggle
    });
  }

  toggleHiddenAgain() {
    this.setState({
      isHidden2: !this.state.isHidden2,
      isHidden3: !this.state.isHidden3,
      toggle: !this.state.toggle
    });
    this.save();
  }

  save() {
    //const data = JSON.stringify(this.state.user);
    //fetch("postgres://projectc:pc@188.166.94.83:5432/project_dev", { method: "POST", body: data });
    console.log(this.state);

  }

  onChange = (e) => {
  //   console.log(e.target.checked);
    this.setState({
      [e.target.name]: e.target.value
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
                name="mail"
                type="email"
                onChange={e => this.onChange(e)}
                value={this.state.mail}
                className="login-input"
              />
              <input                
                id="pas"
                placeholder="Wachtwoord"
                name="password"
                type="password"
                onChange={e => this.onChange(e)}
                value={this.state.password}
                className="login-input"
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

                <p><input type="radio" name="aanhef"  value={this.state.aanhef} onChange={e => this.onChange(e)} />Dhr.</p>
                <p><input type="radio" name="aanhef"  value={this.state.aanhef} onChange={e => this.onChange(e)} />Mevr.</p>

                <p id="voornaam">Voornaam <b>*</b></p>
                <input
                  type="text"
                  placeholder="Naam"
                  name="name"
                  onChange={e => this.onChange(e)}
                  value={this.state.name}
                />

                <p>Achternaam <b>*</b></p>
                <input
                  type="text"
                  placeholder="Achternaam"
                  name="surname"
                  onChange={e => this.onChange(e)}
                  value={this.state.surname}
                />

              </div>

              <div id="adres" className="dropdown-form">
                <h1>Adres</h1>

                <p>straat</p>
                <input
                  type="text"
                  placeholder="Straat"
                  name="adres"
                  onChange={e => this.onChange(e)}
                  value={this.state.adres}
                />

                <p>Huisnummer</p>
                <input
                  type="text"
                  placeholder="Huisnummer"
                />

                <p>Postcode</p>
                <input
                  type="text"
                  placeholder="Postcode"
                  name="postalcode"
                  onChange={e => this.onChange(e)}
                  value={this.state.postalcode}
                />

                <p>Stad</p>
                <input
                  type="text"
                  placeholder="Stad"
                  name="city"
                  onChange={e => this.onChange(e)}
                  value={this.state.city}
                />

              </div>

              <button onClick={this.toggleHidden.bind(this)} className="dropdown-button" id="button" type="primary">Terug</button>
              <button onClick={this.toggleHiddenAgain.bind(this)} className="dropdown-button" id="button" type="primary">Doorgaan</button>

              </div>)}
              </FirstStepContainer>

              <FirstStepContainer pose={!this.state.toggle ? 'open' : 'closed'}>
              {this.state.isHidden3 && (<div id="drie">
              <div id="stappen">
                <p id="uno"><b>1</b></p>
                <h3 id="unoText">Email en wachtwoord</h3>
                <p id="dosTwee"><b>2</b></p>
                <h3 id="dosText">Naam en adres</h3>
                <p id="tres"><b>3</b></p>
                <h3 id="tresText">Betaalwijze</h3>
              </div>

              <div id="betalen">
                <h1>Betaalwijze</h1>
                <p>Betaalmethode</p>
                <form>
                  <select name="Betaalmethode">
                    <option value="IDEAL">IDEAL</option>
                    <option value="Achteraf">Achteraf betalen</option>
                    <option value="Creditcard">Creditcard</option>
                    <option value="Paypal">Paypal</option>
                  </select>
                </form>
              </div>

              <button onClick={this.toggleHiddenAgain.bind(this)} className="dropdown-button" id="button" type="primary">Terug</button>

                <Mutation mutation={SIGNUP}>
                {(signup, { data }) => (
                  <button
                    className="dropdown-button"
                    id="button"
                    type="primary"
                    onClick={e => {
                      e.preventDefault();
                      signup({
                        variables: {
                          name: this.state.name,
                          surname: this.state.surname,
                          mail: this.state.mail,
                          password: this.state.password,
                          aanhef: this.state.aanhef,
                          adres: this.state.adres,
                          city: this.state.city,
                          postalcode: this.state.postalcode
                        }
                      });
                    }}
                  >registreren</button>
                )}
              </Mutation>
            </div>)}
          </FirstStepContainer>
        </div >
      </section >

    );
  }
}

export default Registreren;
