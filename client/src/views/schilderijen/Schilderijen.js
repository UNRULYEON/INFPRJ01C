import React, { Component } from 'react';
import setState from 'react-state-promise';
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Loading from '../../components/loading/Loading'
import Gallery from '../../components/galley/Gallery'

class Schilderijen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      loading: false
    };
  }

  componentDidMount(){
    // setState(this, {
    //   images: [
    //     {
    //       src: 'https://picsum.photos/500/400/?image=' + (Math.floor(Math.random() * 100) + 1),
    //       width: 500,                       // Width of image
    //       height: 400,                      // Height if image
    //       title: 'TITLE 1',                 // Title of image
    //       id: '1',                          // Unique ID of image
    //       price: '12,345.67',               // Price of image
    //       createdAt: new Date(2018, 11, 24) // Date added to database
    //     },
    //     {
    //       src: 'https://picsum.photos/550/375/?image=' + (Math.floor(Math.random() * 100) + 1),
    //       width: 550,
    //       height: 375,
    //       title: 'TITLE 2',
    //       id: '2',
    //       price: '12,345.67',
    //       createdAt: new Date(2018, 2, 24)
    //     },
    //     {
    //       src: 'https://picsum.photos/200/400/?image=' + (Math.floor(Math.random() * 100) + 1),
    //       width: 200,
    //       height: 400,
    //       title: 'TITLE 3',
    //       id: '3',
    //       price: '12,345.67',
    //       createdAt: new Date(2018, 2, 19)
    //     },
    //     {
    //       src: 'https://picsum.photos/300/600/?image=' + (Math.floor(Math.random() * 100) + 1),
    //       width: 300,
    //       height: 600,
    //       title: 'TITLE 4',
    //       id: '3',
    //       price: '12,345.67',
    //       createdAt: new Date(2018, 12, 4)
    //     },
    //     {
    //       src: 'https://picsum.photos/450/300/?image=' + (Math.floor(Math.random() * 100) + 1),
    //       width: 450,
    //       height: 300,
    //       title: 'TITLE 5',
    //       id: '4',
    //       price: '12,345.67',
    //       createdAt: new Date(2018, 1, 4)
    //     },
    //     {
    //       src: 'https://picsum.photos/600/600/?image=' + (Math.floor(Math.random() * 100) + 1),
    //       width: 600,
    //       height: 600,
    //       title: 'TITLE 6',
    //       id: '5',
    //       price: '12,345.67',
    //       createdAt: new Date(2017, 12, 4)
    //     }
    //   ]
    // }).then(() => {
    //   setState(this, {
    //     loading: false
    //   })
    // })

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
        {this.state.loading ? <Loading/> : null }
        <Gallery images={this.state.images}/>
      </section>
    );
  }
}

export default Schilderijen;
