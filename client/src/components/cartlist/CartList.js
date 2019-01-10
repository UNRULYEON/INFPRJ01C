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
        {this.props.list.items.map((item) => (
          <div key={item.id}>
            <div className="cart-item-wrapper">
              <div className="cart-item-details">
                <Link to={`/schilderij/${item.id}`} onClick={this.props.closeModal}>
                  <p className="cart-item-title">
                    { item.title }
                  </p>
                </Link>
              </div>
              <div className="cart-item-price">
                <p>
                  <Currency
                    quantity={this.props.rental ? item.priceWithDays / 20 : item.price}
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
              quantity={this.props.list.total}
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
