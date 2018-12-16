import React, { Component } from 'react';
import {
		Link,
		Route,
		NavLink,
		Redirect
} from 'react-router-dom';
import posed from "react-pose";
import OutsideClickHandler from 'react-outside-click-handler';
// import Pagination from 'rc-pagination';
// import nl_NL from 'rc-pagination/lib/locale/nl_NL';
// import { Query } from "react-apollo";
import gql from "graphql-tag";
import './Header.css';

// Material-UI
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

// Components
import CartMenu from '../cartmenu/CartMenu';
import AccountMenu from '../accountmenu/AccountMenu';
// import Gallery from '../../components/gallery/Gallery'

// Icons
import logo from '../../icons/logo.svg';
import search from '../../icons/search.svg';
import close from '../../icons/close.svg';
import list from '../../icons/list.svg';
import favorite from '../../icons/favorite.svg';

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
});

class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			searchBar: false,
			accountMenuToggle: false,
			cartMenuToggle: false,
			query: '',
			page: 1,
			redirectSearch: false
		};
		this.toggleSearchBar = this.toggleSearchBar.bind(this);
		this.toggleAccount = this.toggleAccount.bind(this);
		this.toggleCart = this.toggleCart.bind(this);
    this.searchbarInput = React.createRef();
	}

	toggleSearchBar() {
		this.setState(state => ({
			searchBar: !state.searchBar,
			cartMenuToggle: false,
			accountMenuToggle: false
		}));
		this.searchbarInput.current.focus();
	}

	toggleAccount() {
		this.setState(state => ({
			accountMenuToggle: !state.accountMenuToggle,
			cartMenuToggle: false
		}))
		// console.log("Account menu is now: " + !this.state.accountMenuToggle);
	}

	toggleAccountMobile() {
		this.setState(state => ({
			accountMenuToggle: !state.accountMenuToggle,
			cartMenuToggle: false
		}))
		// console.log("Account menu is now: " + !this.state.accountMenuToggle);
	}

	toggleCart() {
		this.setState(state => ({
			cartMenuToggle: !state.cartMenuToggle,
			accountMenuToggle: false
		}))
		// console.log("Cart menu is now: " + !this.state.cartMenuToggle);
	}

  componentDidMount(){
    document.addEventListener("keydown", (event) => {
			if (event.keyCode === 27) {
				this.setState(state => ({
					searchBar: false,
					cartMenuToggle: false,
					accountMenuToggle: false
				}))
			}
		}, false);
	}

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
	};

	keyPress = e => {
		if(e.keyCode === 13){
			console.log('value', e.target.value);
			this.props.setQuery(e.target.value)
			this.setState({
				redirectSearch: true
			})
			this.toggleSearchBar()
		}
	}

	render() {

		const searchInputProps = {
			ref: this.searchbarInput
		}

		return (
			<header>
				{this.state.redirectSearch ? (
					<Redirect to={`/zoeken?q=${this.state.query}`} push />
				) : null}
				<SearchbarContainer
					className="searchbar-container"
					pose={this.state.searchBar ? 'open' : 'closed'}
				>
					<div className="searchbar-input-container">
						<TextField
							id="searchbar-input"
							label="Waar bent u naar opzoek?"
							inputProps={searchInputProps}
							value={this.state.query}
							onChange={this.handleChange('query')}
							onKeyDown={this.keyPress}
							fullWidth
							type="search"
							margin="normal"
							variant="outlined"
						/>
						<button id="searchbar-close" onClick={this.toggleSearchBar} className="pointer header-button ml-3"><img src={close} alt="Close" width="32" /></button>
					</div>
				</SearchbarContainer>
				<div id="header-container-primary">
					<div id="header-name">
						<Link to="/"><img src={logo} alt="Logo" height="32" /></Link>
						<Link to="/">ARTIC</Link>
					</div>
					<div className="spacer"></div>
					<div id="header-actions">
						<Tooltip title="Zoeken" enterDelay={500} leaveDelay={200}>
							<button onClick={this.toggleSearchBar} className="pointer header-button mr-2" id="search-icon"><img src={search} alt="Search" width="32" /></button>
						</Tooltip>
						<div className="header-dropdownmenu-container">
							<Tooltip title="Account" enterDelay={500} leaveDelay={200}>
								<button onClick={this.toggleAccount} className="pointer header-button mr-2" id="account-icon">
									<svg id="account-icon-svg" className={this.props.loggedIn ? "account-icon-svg-loggedIn" : "account-icon-svg-loggedOut"} width="32" height="32" viewBox="0 0 24 24"><path fill="transparent" d="M0 0h24v24H0V0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/></svg>
								</button>
							</Tooltip>
							<Route render={({ history }) => (
								<Tooltip title="Favorietenlijst" enterDelay={500} leaveDelay={200}>
									<button onClick={() => history.push(`/favorieten`)} className="pointer header-button mr-2" id="search-icon"><img src={favorite} alt="Favorietenlijst" width="32" /></button>
								</Tooltip>
							)} />
							<Route render={({ history }) => (
								<button onClick={() => this.props.loggedIn ? history.push(`/user/${this.props.user.name}`) : history.push('/login')} className="pointer header-button mr-2" id="account-icon-mobile">
									<svg id="account-icon-svg" className={this.props.loggedIn ? "account-icon-svg-loggedIn" : "account-icon-svg-loggedOut"} width="32" height="32" viewBox="0 0 24 24"><path fill="transparent" d="M0 0h24v24H0V0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/></svg>
								</button>
							)} />
							<OutsideClickHandler
								onOutsideClick={() => {
									this.setState({
										accountMenuToggle: false
									})
									//console.log("Clicked outside of account menu. State: " + !this.state.accountMenuToggle);
								}}
							>
								<AccountMenu
									menu={this.state.accountMenuToggle}
									setUser={this.props.setUser}
									user={this.props.user}
									loggedIn={this.props.loggedIn}
									closeModal={this.toggleAccount}
								/>
							</OutsideClickHandler>
						</div>
						<div className="header-dropdownmenu-container">
							<Tooltip title="Mijn lijst" enterDelay={500} leaveDelay={200}>
								<button onClick={this.toggleCart} className="pointer header-button" id="cart-icon">
									<img src={list} alt="Cart" width="32" />
								</button>
							</Tooltip>
							<Route render={({ history }) => (
								<button onClick={() => { history.push('/mijnlijst') }} className="pointer header-button" id="cart-icon-mobile">
									<img src={list} alt="Cart" width="32" />
								</button>
							)} />
							<OutsideClickHandler
								onOutsideClick={() => {
									this.setState({
										cartMenuToggle: false
									})
									//console.log("Clicked outside of cart menu. State: " + !this.state.cartMenuToggle);
								}}
							>
								<CartMenu
									menu={this.state.cartMenuToggle}
									cart={this.props.cart}
									order={this.props.order}
									rental={this.props.rental}
									setCart={this.props.setCart}
									closeModal={this.toggleCart}
								/>
							</OutsideClickHandler>
						</div>
					</div>
				</div>
				<div id="header-container-secondary">
					<ul id="header-nav-lu">
						<li><NavLink exact to="/schilderijen" activeClassName="linkSelected">Schilderijen</NavLink></li>
						<li><NavLink exact to="/schilders" activeClassName="linkSelected">Schilders</NavLink></li>
						<li><NavLink exact to="/contact" activeClassName="linkSelected">Contact</NavLink></li>
						<li><NavLink exact to="/faq" activeClassName="linkSelected">FAQ</NavLink></li>
					</ul>
				</div>
			</header>
		);
	}
}

export default Header;
