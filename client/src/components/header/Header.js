import React, { Component } from 'react';
import {
    Link,
    NavLink
} from 'react-router-dom';
import posed from "react-pose";
import './Header.css';

// Icons
import logo from '../../icons/logo.svg';
import cart from '../../icons/cart.svg';
import account from '../../icons/account.svg';
import search from '../../icons/search.svg';
import arrow_down from '../../icons/arrow_down.svg';
import close from '../../icons/close.svg';

const SearchbarContainer = posed.div({
	open: {
		y: '0%',
		transition: {
			y: {
				type: 'tween',
				ease: 'easeOut',
				duration: '250'
			}
		}
	},
	closed: {
		y: '-100%',
		transition: {
			y: {
				type: 'tween',
				ease: 'easeIn',
				duration: '200'
			}
		}
	}
})

class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			searchBar: false
		};
		this.toggleSearchBar = this.toggleSearchBar.bind(this);
	}

	toggleSearchBar() {
		this.setState(state => ({
			searchBar: !state.searchBar
		}))
		console.log("Search bar is now: " + !this.state.searchBar);
	}

	render() {
		return (
			<header>
				<SearchbarContainer
					className="searchbar-container"
					pose={this.state.searchBar ? 'open' : 'closed'}
				>
					<input id="searchbar-input" placeholder="Waar bent u naar opzoek?"></input>
					<button id="searchbar-close" onClick={this.toggleSearchBar} className="pointer header-button ml-3"><img src={close} alt="Close" width="32" /></button>
				</SearchbarContainer>
				<div id="header-container-primary">
					<div id="header-name">
						<Link to="/"><img src={logo} alt="Logo" height="32" /></Link>
						<Link to="/">ARTIC</Link>
					</div>
					<div id="header-searchbar">
						<input id="search-bar-input" placeholder="Waar bent u naar opzoek?"></input>
					</div>
					<div id="header-actions">
						<button onClick={this.toggleSearchBar} className="pointer header-button mr-2" id="search-icon"><img src={search} alt="Search" width="32" /></button>
						<button className="pointer header-button mr-2" id="account-icon"><img src={account} alt="Search" width="32" /></button>
						<button className="flex x-center mr-2 pointer header-button" id="account-btn-big">
								Inloggen
								<img src={arrow_down} alt="ad" width="24" />
						</button>
						<button className="pointer header-button"><img src={cart} alt="Cart" width="32" /></button>
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
