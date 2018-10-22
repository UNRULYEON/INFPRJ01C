import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import './HeroFeatured.css';

class HeroFeatured extends Component {

  render() {
    return (
      <div className="hero-featured">
        <NavLink to="">
          <div className="hero-featured-image-container flex row-nowrap">
            {this.props.featured.map(d =>
              <img
                className="hero-featured-image"
                key={d.title}
                src={d.src}
                alt={String(Math.random)}
              />)}
          </div>
          <div className="hero-featured-text-container">
              <div>
                <span className="hero-featured-title">Collectie van Karel Appel</span>
                <span className="hero-featured-link">Bekijk ze hier</span>
              </div>
          </div>
        </NavLink>
      </div>
    );
  }
}

export default HeroFeatured;
