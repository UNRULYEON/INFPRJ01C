import React, { Component } from 'react';
import './HeroImage.css';

// https://github.com/tsuyoshiwada/react-md-spinner

class HeroImage extends Component {
  render() {
    return (
      <div className="hero-container">
        <img className="hero-image" src={this.props.src} alt="hero"/>
        {this.props.name ? (
          <span className="hero-name">{this.props.name}</span>
        ) : null}
      </div>
    );
  }
}

export default HeroImage;
