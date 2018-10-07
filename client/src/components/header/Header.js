import React, { Component } from 'react';
import {
  Link,
  NavLink
} from 'react-router-dom';
import './Header.css';

// Icons
import cart from '../../icons/cart.svg';
import arrow_down from '../../icons/arrow_down.svg';

class Header extends Component {

  render() {
    return (
      <header>
        <div id="header-container-primary">
          <div id="header-name">
            <Link to="/">ARTIC</Link>
          </div>
          <div id="header-searchbar">
            <input id="search-bar-input" placeholder="Zoeken"></input>
          </div>
          <div id="header-actions">
                    <span>
                        <button onClick={() => alert("clicked")}>Inloggen</button>

              <img src={arrow_down} alt="ad" width="24"/>
            </span>
            <span><img src={cart} alt="Cart" width="44"/></span>
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



