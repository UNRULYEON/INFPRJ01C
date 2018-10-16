import React, { Component } from 'react';
import './Schilders.css';

// Components
import PageTitle from '../../components/pageLink/PageLink';
import Gallery from '../../components/gallery/Gallery';

class Schilders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      painters: [],
    };
  }

  componentDidMount(){
    fetch('/schilders')
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
        <PageTitle title="Schilders"/>
        <Gallery images={this.state.painters} noDetails={true} />
      </section>
    );
  }
}

export default Schilders;
