import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
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
        <span className="menu-title">Mijn lijst</span>
        <div className="cart-container">
          {this.props.cart.items.length ? (
            <CartList
              list={this.props.cart}
              closeModal={this.props.closeModal}
              />
          ) : (
            <p className="cart-no-items">Je hebt niks in je lijst!</p>
          )}
          <p className="cart-type-title">Kooplijst</p>
          {this.props.order.items.length ? (
            <CartList
              list={this.props.order}
              closeModal={this.props.closeModal}
              />
          ) : (
            <p className="cart-no-items">Je hebt niks in je kooplijst!</p>
          )}
          <p className="cart-type-title">Huurlijst</p>
          {this.props.rental.items.length ? (
            <CartList
              list={this.props.rental}
              rental={true}
              closeModal={this.props.closeModal}
              />
          ) : (
            <p className="cart-no-items">Je hebt niks in je huurlijst!</p>
          )}
        </div>
        <div className="cart-actions">
          <MuiThemeProvider theme={theme}>
            <Link to={`/mijnlijst`} onClick={this.props.closeModal}>
              <Button
                color="primary"
                className="cart-action-order"
                variant="outlined"
                fullWidth
              >
                Bekijk je lijst
              </Button>
            </Link>
          </MuiThemeProvider>
        </div>
      </Menu>
		);
	}
}

export default CartMenu;
