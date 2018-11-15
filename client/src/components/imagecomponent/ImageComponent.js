import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import Img from 'react-image'
import Loading from '../../components/loading/Loading'
import './imageComponent.css'

// Material-UI
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

class ImageComponent extends Component {
  render() {

    function getLocal(prop) {
      return "/schilderij/" + prop.photo.id_number;
    }

    return(
      <div className="item-container" width={this.props.photo.width} key={this.props.photo.id}>
        <NavLink to={getLocal(this.props)}>
          <Img
            src={[
              this.props.photo.src
            ]}
            width={
              this.props.photo.width
            }
            height={
              this.props.photo.height
            }
            key={this.props.photo.id}
            loader={<Loading size={100} borderSize={10}/>}
            unloader={<div className="error">It seems there was a problem<br/>loading this image.<br/>Reload the page</div>}
          />
        </NavLink>
        {this.props.noIC ? null : (
          <div className="item-details" style={{width: this.props.photo.width}}>
            <div className="item-details-text">
              <span className="item-details-title">{this.props.photo.title}</span>
              <span className="item-details-price">€{this.props.photo.price || " -"}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ImageComponent;