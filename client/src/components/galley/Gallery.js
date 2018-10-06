import React, { Component } from 'react';
import GalleryReact from 'react-photo-gallery';

// Components
import ImageComponent from '../imagecomponent/ImageComponent'

class Gallery extends Component {
  render() {
    return(
      <GalleryReact
        photos={this.props.images}
        margin={10}
        ImageComponent={ImageComponent}
      />
    )
  }
}

export default Gallery;
