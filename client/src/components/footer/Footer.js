import React, { Component } from 'react';
import './Footer.css';

// Images
import postnl from '../../images/postnl.svg'
import pm from '../../images/payment-method.svg'
import tw from '../../images/thuiswinkel-waarborg.svg'

class Footer extends Component {

  render() {
    return (
      <footer>
        <div className="footer-container">
          <div className="x-center">
            <span className="mt-4">Wij versturen met</span>
            <img src={postnl} width="75px" alt="postnl"/>
          </div>
          <div className="x-center">
            <span className="mt-4">Betaalwijzen</span>
            <div className="payment-methods">
              <img src={pm} alt="payment-methods" width="100%"/>
            </div>
          </div>
          <div className="x-center">
            <span className="mt-4">Makkelijk online shoppen</span>
            <ul>
              <li>Gratis levering</li>
              <li>Gartis retour</li>
              <li>100 dagen retourrecht</li>
            </ul>
          </div>
          <div className="x-center">
            <span className="mt-4">Verified service</span>
            <img src={tw} width="100px" alt="tw"/>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
