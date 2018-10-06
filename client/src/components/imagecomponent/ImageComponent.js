import React, { Component } from 'react';

// Icons
import cart from '../../icons/cart.svg';

class ImageComponent extends Component {
  render() {
    return(
      <div className="item-container" >
        <img src={this.props.photo.src} alt="foo" className="item-image" width={this.props.photo.width} heigh={this.props.photo.height}/>
        <div className="item-details">
          <div className="item-details-text">
            <span className="item-details-title">{this.props.photo.title}</span>
            <span className="item-details-price">€{this.props.photo.price}</span>
          </div>
          <div className="item-details-action">
            <button className="item-details-action-button">
              <img src={cart} alt="cart" width="24"/>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageComponent;