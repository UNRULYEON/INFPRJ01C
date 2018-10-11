import React, { Component } from 'react';
import './SchilderDetails.css'

// Components
import HeroImage from '../../components/heroimage/HeroImage'
import PainterDescription from '../../components/painterDescription/PainterDescription'
import Gallery from '../../components/gallery/Gallery'

class SchilderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      painter: [],
      works: []
    };
  }

  componentDidMount(){
    let painter = this.props.match.params.id.replace(/\s/g, '_');
    console.log(painter)
    fetch('/schilder/' + painter)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({
          painter: res
        })
      })
    fetch('/werken-van/'+ painter)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({
          works: res
        })
      })
  }

  render() {
    return (
      <section className="section-container">
      <HeroImage
        src={this.state.painter.headerimage}
        name={this.state.painter.name}
      />
      <PainterDescription content={this.state.painter.description}/>
      <h1>Werken van {this.state.painter.name}</h1>
      <Gallery images={this.state.works}/>
      </section>
    );
  }
}

export default SchilderDetails;
