import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {

  render() {
    return (
      <footer>
        <div className="footer-container">
          <div id="post">
            <p>Wij versturen met</p>
            <p>*img*</p>
          </div>

          <div id="betaalwijzen">
            <p>Betaalwijzen</p>
            <ul id="uno">
            <li>*img*</li>
            <li>*img*</li>
            </ul><ul id="dos">
            <li>*img*</li>
            <li>*img*</li>
            </ul>
          </div>

          <div id="mos">
            <p>Makkelijk online shoppen</p>
            <ul id="footerMosList">
                <li>Gratis levering</li>
                <li>Gratis retour</li>
                <li>100 dagen retourrecht</li>
            </ul>
          </div>
          <div id="vs">
            <p>Verified service</p>
            <p>*img*</p>
            <b>thuiswinkel</b>
            <p>waarborg</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
