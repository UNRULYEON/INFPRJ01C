import React, { Component } from 'react';
import {
    Link,
    NavLink
} from 'react-router-dom';
import './Header.css';

// Icons
import cart from '../../icons/cart.svg';
import search_icon from '../../icons/search_icon.svg';
import sign_in from '../../icons/sign_in.svg';
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
                    <div id="header-searchIcon">
                        <img src={search_icon} alt="Search" width="32" />
                    </div>
                    <div id="header-actions">
                        <span className="flex x-center mr-2 pointer header-button">
                            Inloggen
                            <img src={arrow_down} alt="ad" width="24" />
                        </span>
                        <span className="pointer header-button"><img src={cart} alt="Cart" width="32" /></span>
                    </div>
                    <div id="sign_in_icon">
                        <img src={sign_in} alt="sign_in" width="32" />
                    </div>
                </div>
                <div id="header-container-secondary">
                    <ul id="header-nav-lu">
                        <li><NavLink exact to="/schilderijen" activeClassName="linkSelected">Schilderijen</NavLink></li>
                        <li><NavLink exact to="/schilders" activeClassName="linkSelected">Schilders</NavLink></li>
                    </ul>
                </div>
            </header>
        );
    }
}

export default Header;
