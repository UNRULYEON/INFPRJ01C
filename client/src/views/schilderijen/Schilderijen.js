import React, { Component } from 'react';
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

class Schilderijen extends Component {

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilderijen"/>
      </section>
    );
  }
}

export default Schilderijen;
