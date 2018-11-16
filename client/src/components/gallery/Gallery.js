import React, { Component } from 'react';
import GalleryReact from 'react-photo-gallery';
import './Gallery.css'

// Components
import ImageComponent from '../imagecomponent/ImageComponent'
import ImageComponentNoDetails from '../imagecomponentnodetails/ImageComponentNoDetails'

class Gallery extends Component {
  render() {

    let ImageComponentType = this.props.noDetails ? ImageComponentNoDetails : ImageComponent;

    return(
      <GalleryReact
        photos={this.props.images}
        margin={10}
        ImageComponent={ImageComponentType}
      />
    )
  }
}

export default Gallery;
