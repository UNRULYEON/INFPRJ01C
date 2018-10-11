import React, { Component } from 'react';

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/gallery/Gallery'
import HeroFeatured from '../../components/herofeatured/HeroFeatured'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      loading: false
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
      <div>
      <section className="section-container">
        <PageTitle title="Herfst" subtitle="De stijl van de dag"/>
        <Gallery images={this.state.images}/>
      </section>
      <section>
        <HeroFeatured/>
      </section>
      <section className="section-container">
        <PageTitle title="Vind je favoriete schilderij ❤️" subtitle="Iets voor jou?"/>
        <Gallery images={this.state.images}/>
      </section>
      </div>
    );
  }
}

export default Home;
