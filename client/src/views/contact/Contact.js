import React, { Component } from 'react';
import './Contact.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

// Icons
import logo from '../../icons/logo.svg';
import Phone from '../../icons/phone.svg'
import Email from '../../icons/mail.svg'
import Location from '../../icons/location.svg'

class Contact extends Component {
  render() {
    return (
      <section className="section-container">
        <PageTitle title="Contact"/>
        <div className="contact-container">
          <div className="contact-details">
            <span className="contact-details-title">
              <img src={logo} alt="Logo" height="32" />
              ARTIC
            </span>
            <span className="x-divider"></span>
            <div className="contact-details-container">
              <img src={Phone} alt="Phone" width="24px"/>
              <span>PHONE</span>
            </div>
            <span className="x-divider"></span>
            <div className="contact-details-container">
              <img src={Email} alt="E-mail" width="24px"/>
              <span>E-MAIL</span>
            </div>
            <span className="x-divider"></span>
            <div className="contact-details-container">
              <img src={Location} alt="Location" width="24px"/>
              <span>ADDRESS</span>
            </div>
          </div>
          <div className="contact-maps">
            <iframe className="maps" title="Maps" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1630.1806191908636!2d4.4832039758870454!3d51.9171415600555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c4335dd0e438b7%3A0xed54cfc9f8ebad3!2sRotterdam+University+Of+Applied+Science!5e0!3m2!1snl!2snl!4v1539297697696"></iframe>
          </div>
        </div>
      </section>
    );
  }
}

export default Contact;
