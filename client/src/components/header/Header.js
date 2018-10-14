import React, { Component } from 'react';
import {
    Link,
    NavLink
} from 'react-router-dom';
import posed from "react-pose";
import './Header.css';

// Components
import CartMenu from '../cartmenu/CartMenu';
import AccountMenu from '../accountmenu/AccountMenu';

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
			searchBar: false,
			accountMenuToggle: false,
			cartMenuToggle: false
		};
		this.toggleSearchBar = this.toggleSearchBar.bind(this);
		this.toggleAccount = this.toggleAccount.bind(this);
		this.toggleCart = this.toggleCart.bind(this);
	}

	toggleSearchBar() {
		this.setState(state => ({
			searchBar: !state.searchBar,
			cartMenuToggle: false,
			accountMenuToggle: false
		}))
		console.log("Search bar is now: " + !this.state.searchBar);
	}

	toggleAccount() {
		this.setState(state => ({
			accountMenuToggle: !state.accountMenuToggle,
			cartMenuToggle: false
		}))
		console.log("Account menu is now: " + !this.state.accountMenuToggle);
	}

	toggleCart() {
		this.setState(state => ({
			cartMenuToggle: !state.cartMenuToggle,
			accountMenuToggle: false
		}))
		console.log("Cart menu is now: " + !this.state.cartMenuToggle);
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
					<div className="spacer"></div>
					<div id="header-actions">
						<button onClick={this.toggleSearchBar} className="pointer header-button mr-2" id="search-icon"><img src={search} alt="Search" width="32" /></button>
						<div className="header-dropdownmenu-container">
							<button onClick={this.toggleAccount} className="pointer header-button mr-2" id="account-icon"><img src={account} alt="Search" width="32" /></button>
							<AccountMenu
								menu={this.state.accountMenuToggle}
							/>
						</div>
						<div className="header-dropdownmenu-container">
							<button onClick={this.toggleCart} className="pointer header-button"><img src={cart} alt="Cart" width="32" /></button>
							<CartMenu
								menu={this.state.cartMenuToggle}
							/>
						</div>
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
