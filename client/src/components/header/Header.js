import React, { Component } from 'react';
import {
    Link,
    NavLink
} from 'react-router-dom';
import './Header.css';

// Icons
import logo from '../../icons/logo.svg';
import cart from '../../icons/cart.svg';
import account from '../../icons/account.svg';
import search from '../../icons/search.svg';
import arrow_down from '../../icons/arrow_down.svg';

class Header extends Component {

	render() {
		return (
			<header>
				<div id="header-container-primary">
					<div id="header-name">
						<Link to="/"><img src={logo} alt="Logo" height="32" /></Link>
						<Link to="/">ARTIC</Link>
					</div>
					<div id="header-searchbar">
						<input id="search-bar-input" placeholder="Zoeken"></input>
					</div>
					<div id="header-actions">
						<span className="pointer header-button mr-2" id="search-icon"><img src={search} alt="Search" width="32" /></span>
						<span className="pointer header-button mr-2" id="account-icon"><img src={account} alt="Search" width="32" /></span>
						<span className="flex x-center mr-2 pointer header-button" id="account-btn-big">
								Inloggen
								<img src={arrow_down} alt="ad" width="24" />
						</span>
						<span className="pointer header-button"><img src={cart} alt="Cart" width="32" /></span>
					</div>
				</div>
				<div id="header-container-secondary">
					<ul id="header-nav-lu">
						<li><NavLink exact to="/schilderijen" activeClassName="linkSelected">Schilderijen</NavLink></li>
						<li><NavLink exact to="/schilders" activeClassName="linkSelected">Schilders</NavLink></li>
						<li><NavLink exact to="/contact" activeClassName="linkSelected">Contact</NavLink></li>
					</ul>
				</div>
			</header>
		);
	}
}

export default Header;
