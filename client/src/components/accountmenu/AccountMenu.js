import React, { Component } from 'react';
import {
    Link,
    NavLink
} from 'react-router-dom';
import posed from "react-pose";
import './AccountMenu.css';

const Menu = posed.div({
  open: {
    opacity: 1,
    transition: {
      duration: '200'
    },
    applyAtStart: { display: 'flex', margin: '10px 0 0 -260px' }
  },
  closed: {
    opacity: 0,
    transition: {
      duration: '200'
    },
    applyAtEnd: { display: 'none', margin: '0 0 0 0' },
  }
})


class AccountMenu extends Component {
  render() {
    return (
      <Menu
        pose={this.props.menu ? 'open' : 'closed'}
        className="dropdown"
      >
        <span className="menu-title">Account</span>
        <form className="dropdown-form">
          <input placeholder="Email" type="email"></input>
          <input placeholder="Wachtwoord" type="password"></input>
        </form>
        <button className="dropdown-button">Inloggen</button>
        <div className="onboarding-container">
          <span>Nieuw bij ARTIC?</span>
          <Link to={"/registreren"} className="onboarding-link">Maak een account aan</Link>
        </div>
      </Menu>
    );
  }
}

export default AccountMenu;
