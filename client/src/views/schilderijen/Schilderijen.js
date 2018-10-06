import React, { Component } from 'react';
import './Schilderijen.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'
import Gallery from '../../components/galley/Gallery'

class Schilderijen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesJSON: []
    };
  }

  componentDidMount(){
    this.setState({
      imagesJSON: [
        {
          src: 'https://picsum.photos/500/400/?image=' + (Math.floor(Math.random() * 100) + 1),
          width: 500,
          height: 400,
          title: 'TITLE 1',
          id: '1',
          price: '12,345.67',
          createdAt: new Date(2018, 11, 24)
        },
        {
          src: 'https://picsum.photos/550/375/?image=' + (Math.floor(Math.random() * 100) + 1),
          width: 550,
          height: 375,
          title: 'TITLE 2',
          id: '2',
          price: '12,345.67',
          createdAt: new Date(2018, 2, 24)
        },
        {
          src: 'https://picsum.photos/200/400/?image=' + (Math.floor(Math.random() * 100) + 1),
          width: 200,
          height: 400,
          title: 'TITLE 3',
          id: '3',
          price: '12,345.67',
          createdAt: new Date(2018, 2, 19)
        },
        {
          src: 'https://picsum.photos/300/600/?image=' + (Math.floor(Math.random() * 100) + 1),
          width: 300,
          height: 600,
          title: 'TITLE 3',
          id: '3',
          price: '12,345.67',
          createdAt: new Date(2018, 12, 4)
        },
        {
          src: 'https://picsum.photos/450/300/?image=' + (Math.floor(Math.random() * 100) + 1),
          width: 450,
          height: 300,
          title: 'TITLE 4',
          id: '4',
          price: '12,345.67',
          createdAt: new Date(2018, 1, 4)
        },
        {
          src: 'https://picsum.photos/600/600/?image=' + (Math.floor(Math.random() * 100) + 1),
          width: 600,
          height: 600,
          title: 'TITLE 5',
          id: '5',
          price: '12,345.67',
          createdAt: new Date(2017, 12, 4)
        }
      ]
    })
  }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Schilderijen"/>
        <Gallery images={this.state.imagesJSON}/>
      </section>
    );
  }
}

export default Schilderijen;
