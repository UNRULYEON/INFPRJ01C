import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {

  render() {
    return (
      <footer>
        <div className="y-center">
          <span className="mt-4">Wij versturen met</span>
        </div>
        <span className="y-divider"></span>
        <div className="y-center">
          <span className="mt-4">Betaalwijzen</span>
        </div>
        <span className="y-divider"></span>
        <div className="y-center">
          <span className="mt-4">Makkelijk online shoppen</span>
          <ul>
            <li>Gratis levering</li>
            <li>Gartis retour</li>
            <li>100 dagen retourrecht</li>
          </ul>
        </div>
        <span className="y-divider"></span>
        <div className="y-center">
          <span className="mt-4">Verified service</span>
        </div>
      </footer>
    );
  }
}

export default Footer;
