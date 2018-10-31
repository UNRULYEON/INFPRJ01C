import React, { Component } from 'react';
import './Registreren.css';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

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

const SIGNUP = gql`
  mutation Signup($name: String!, $surname: String!, $email: String!, $password: String!) {
  signup(name: $name, surname: $surname, email: $email, password: $password)
  }
`;



/*
const CreateReviewForEpisode = gql`
	query user($name: String!, $surname: String!, $mail: String!, $password: String!){
		createReview(name: $name, surname: $surname, mail: $mail, password: $password){
			name
      surname
      mail
      password
		}
	}
`;
*/

class Registreren extends Component {
  constructor() {
    super();
    this.state = {
      mail: '',
      password: '',
      name: '',
      surname: '',
      Straat: '',
      Huisnummer: '',
      Postcode: '',
      Stad: '',
      Aanhef: '',
      isHidden: false,
      isHidden2: true,
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

  save() {
    //const data = JSON.stringify(this.state.user);
    //fetch("postgres://projectc:pc@188.166.94.83:5432/project_dev", { method: "POST", body: data });
    console.log(this.state);

  }

  onChange = (e) => {
    console.log(e.target.checked);
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
              />
              <input
                id="pas"
                placeholder="Wachtwoord"
                name="password"
                type="password"
                onChange={e => this.onChange(e)}
                value={this.state.password}
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
                          email: this.state.mail,
                          password: this.state.password
                        }
                      });
                      console.log("kech is gelukt");
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
