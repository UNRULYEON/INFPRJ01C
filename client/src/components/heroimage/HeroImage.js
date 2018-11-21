import React, { Component } from 'react';
import './HeroImage.css';

class HeroImage extends Component {
  render() {
    return (
      <div className="hero-container">
        {this.props.src ? (
          <img className="hero-image" src={this.props.src} alt="hero"/>
        ) : null}
        {this.props.src ? (
          <span className="hero-name">{this.props.name}</span>
        ) : (
          <h1 className="hero-name-without-image">{this.props.name}</h1>
        )}
      </div>
    );
  }
}

export default HeroImage;
