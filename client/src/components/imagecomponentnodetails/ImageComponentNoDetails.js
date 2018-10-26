import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import Img from 'react-image'
import Loading from '../../components/loading/Loading'
import './ImageComponentNoDetails.css'

class ImageComponentNoDetails extends Component {
  render() {
    function getLocal(prop) {
      return "/schilder/" + prop.photo.id;
    }

    return(
      <div>
        <div>
          {this.props.photo.headerimage ? (
            <div className="item-container" width={200} key={this.props.photo.name}>
            <NavLink exact to={getLocal(this.props)}>
              <Img
                id="painter-cover"
                src={[
                  this.props.photo.headerimage
                ]}
                width={625}
                height={400}
                key={this.props.photo.name}
                loader={<Loading size={100} borderSize={10}/>}
                unloader={<div className="error">It seems there was a problem<br/>loading this image.<br/>Reload the page</div>}
              />
              <div className="cover-details">
                <span>{this.props.photo.name}</span>
              </div>
            </NavLink>
          </div>
          ) : null}
          </div>
        </div>
    );
  }
}

export default ImageComponentNoDetails;