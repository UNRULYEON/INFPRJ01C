import React, { Component } from 'react';
import {
  Link,
  NavLink
} from 'react-router-dom';
import './LoginOrRegister.css';

class LoginOrRegister extends Component {
  render() {
    return (
      <div id="inloggen">
        <div className="section-container">
          <span className="menu-title">Account</span>
          <form className="dropdown-form">
            <input id="email" placeholder="Email" type="email"></input>
            <input id="pas" placeholder="Wachtwoord" type="password"></input>
            {this.props === null ? <p></p> : <input id="pass" placeholder="Herhaal wachtwoord" type="Password"></input>}
          </form>
          <button id="inloggen-button" className="dropdown-button">Inloggen</button>
        </div>
      </div>
    );
  }
}

export default LoginOrRegister;