import React, { Component } from 'react';
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/galley/Gallery'

class Schilderijen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  componentDidMount(){
    fetch('/collection')
      .then(res => res.json())
      .then(res => {
        this.setState({
          images: res
        })
      })
  }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilderijen"/>
        <Gallery images={this.state.images}/>
      </section>
    );
  }
}

export default Schilderijen;
