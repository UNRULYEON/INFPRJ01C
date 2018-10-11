import React, { Component } from 'react';
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/galley/Gallery'

class SchilderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      painters: [],
    };
  }

  componentDidMount(){
    fetch('/schilder')
      .then(res => res.json())
      .then(res => {
        this.setState({
          painters: res
        })
      })
  }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilderijen"/>
        <Gallery images={this.state.painters}/>
      </section>
    );
  }
}

export default SchilderDetails;
