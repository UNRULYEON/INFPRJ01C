import React, { Component } from 'react';
import './SchilderijDetails.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

class SchilderijDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: []
    }
  }

  componentDidMount() {
    // Get data from database
    // setState(data from database)
  }

  render() {
    return (
      <section className="section-container">
        {/* <PageTitle title={this.state.imageData.id}/> */}
      </section>
    );
  }
}

export default SchilderijDetails;
