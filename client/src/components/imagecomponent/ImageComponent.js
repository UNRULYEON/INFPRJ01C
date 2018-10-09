import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import Img from 'react-image'
import Loading from '../../components/loading/Loading'
import './imageComponent.css'

// Icons
import cart from '../../icons/cart.svg';

class ImageComponent extends Component {
  render() {
    function getLocal(prop) {
      return "schilderij/" + prop.photo.id;
    }

    return(
      <div className="item-container" width={this.props.photo.width}>
      <NavLink exact to={getLocal(this.props)}>
        <Img
          src={[
            this.props.photo.src
          ]}
          width={
            this.props.photo.height
          }
          height={
            this.props.photo.width
          }
          key={this.props.photo.id}
          loader={<Loading size={100} borderSize={10}/>}
          unloader={<div className="error">It seems there was a problem<br/>loading this image.<br/>Reload the page</div>}
        />
      </NavLink>
        <div className="item-details">
          <div className="item-details-text">
            <span className="item-details-title">{this.props.photo.title}</span>
            <span className="item-details-price">€{this.props.photo.price || " -"}</span>
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