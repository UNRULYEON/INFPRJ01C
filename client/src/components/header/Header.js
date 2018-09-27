import React, { Component } from 'react';
import {
  Link,
  NavLink
} from 'react-router-dom';
import './Header.css';

class Header extends Component {

  render() {
    return (
      <header>
        <div id="header-container-primary">
          <div id="header-name">
            <Link to="/">WEBSHOP NAME</Link>
          </div>
          <div id="header-searchbar">
            <input id="search-bar-input" placeholder="Zoeken"></input>
          </div>
          <div id="header-actions">
            <span>testest</span>
          </div>
        </div>
        <div id="header-container-secondary">
          <ul id="header-nav-lu">
            <li><NavLink to="/schilderijen" activeClassName="linkSelected">Schilderijen</NavLink></li>
            <li><NavLink to="/schilders" activeClassName="linkSelected">Schilders</NavLink></li>
          </ul>
        </div>
      </header>
    );
  }
}

export default Header;
