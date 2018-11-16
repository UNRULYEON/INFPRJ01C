import React, { Component } from 'react';
// import {
//     Link,
//     NavLink
// } from 'react-router-dom';
import posed from "react-pose";
import './CartMenu.css';

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Components
import CartList from '../cartlist/CartList'

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
    type: 'dark'
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        color: 'white', // Some CSS
      },
    },
  },
});

const Menu = posed.div({
  open: {
    opacity: 1,
    transition: {
      duration: '200'
    },
    applyAtStart: { display: 'flex', margin: '10px 0 0 -360px'}
  },
  closed: {
    opacity: 0,
    transition: {
      duration: '200'
    },
    applyAtEnd: { display: 'none', margin: '0 0 0 0' },
  }
})


class CartMenu extends Component {
	render() {
		return (
      <Menu
        pose={this.props.menu ? 'open' : 'closed'}
        className="dropdown-cart"
      >
        <span className="menu-title">Winkelwagen</span>
        <div className="cart-container">
          {this.props.cart.items.length ? (
            <CartList cart={this.props.cart} />
          ) : (
            <p className="cart-no-items">Je hebt niks in je winkelwagen!</p>
          )}
        </div>
        <div className="cart-actions">
          <MuiThemeProvider theme={theme}>
            <Button
              color="primary"
              className="cart-action-order"
              variant="outlined"
            >
              Bekijk je winkelwagen
            </Button>
          </MuiThemeProvider>
        </div>
      </Menu>
		);
	}
}

export default CartMenu;
