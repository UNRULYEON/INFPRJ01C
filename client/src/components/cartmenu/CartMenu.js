import React, { Component } from 'react';
// import {
//     Link,
//     NavLink
// } from 'react-router-dom';
import posed from "react-pose";
import './CartMenu.css';

const Menu = posed.div({
  open: {
    opacity: 1,
    transition: {
      duration: '200'
    },
    applyAtStart: { display: 'flex', margin: '10px 0 0 -260px'}
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
        className="dropdown"
      >
        <span className="menu-title">Winkelwagen</span>
        <div className="cart-container">
          {this.props.cart ? (
            <p>d</p>
          ) : (
            <p className="cart-no-items">Je hebt niks in je winkelwagen!</p>
          )}
        </div>
        <div className="cart-actions">
          <button className="cart-action-order">Bekijk winkelwagen</button>
        </div>
      </Menu>
		);
	}
}

export default CartMenu;
