import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import Currency from 'react-currency-formatter';
import './CartList.css';


class CartList extends Component {
	render() {
		return (
      <div className="cart-item-container">
        {this.props.cart.items.map((item) => (
          <div key={item.id}>
            <div className="cart-item-wrapper">
              <div className="cart-item-details">
                {/* <p className="cart-item-title">
                  { item.title }
                </p> */}
                <Link to={`/schilderij/${item.id}`}>
                  <p className="cart-item-title">
                    { item.title }
                  </p>
                </Link>
              </div>
              <div className="cart-item-price">
                <p>
                  <Currency
                    quantity={item.price * item.amount}
                    symbol="€ "
                    decimal=","
                    group="."
                  />
                </p>
              </div>
            </div>
            <div className="cart-item-divider"></div>
          </div>
        ))}
        <div className="cart-item-shipping">
          <div>Verzendkosten</div>
          <div>Gratis</div>
        </div>
        <div className="cart-item-total">
          <div>Totaal</div>
          <div>
            <Currency
              quantity={this.props.cart.total}
              symbol="€ "
              decimal=","
              group="."
            />
          </div>
        </div>
      </div>
		);
	}
}

export default CartList;
