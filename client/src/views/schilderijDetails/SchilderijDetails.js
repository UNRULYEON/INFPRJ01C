import React, { Component } from 'react';
import './SchilderijDetails.css'

// Components
import Img from 'react-image'
import Loading from '../../components/loading/Loading'
import Tabs from '../../components/tabs/Tabs';

class SchilderijDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: [],
      current: 0,
      horizontal: false,
      swipe: true,
      wheel: true,
      animate: true,
      factor: 0.3,
      loop: true,
      index: 0
    }
  }

  change(event) {
    let target = event.target;
    let index = Array.prototype.indexOf.call(target.parentElement.children, target);

    this.setState({
      current: index
    });
  }

  componentDidMount() {
    // Get data from database
    console.log(this.props.match.params.id)
    fetch('/schilderij/' + this.props.match.params.id)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({
          imageData: res
        })
      })
    // setState(data from database)
  }

  render() {
    var tabData = [
      {
        title: "Tab 1",
        content: "Content tab 1"
      },
      {
        title: "Tab 2",
        content: "Content tab 2"
      },
      {
        title: "Tab 3",
        content: "Content tab 3"
      }
    ]
    return (
      <section className="section-container">
        {/* Image and details container */}
        <div className="flex row-nowrap">
          <div className="image-container flex center">
            <Img
              src={[
                this.state.imageData.bigsrc
              ]}
              width={
                this.state.imageData.width
              }
              key={this.state.imageData.id}
              loader={<Loading size={100} borderSize={10}/>}
              unloader={<div className="error">It seems there was a problem<br/>loading this image.<br/>Reload the page</div>}
            />
          </div>
          <div className="details-container flex column-nowrap y-center">
            <span className="details-title">{this.state.imageData.title || "TITLE"}</span>
            <span className="details-author">{this.state.imageData.principalmaker || "AUTHOR"}</span>
            <span className="details-price">{this.state.imageData.price || "€ PRICE"}</span>
            <div className="details-buttons flex row-nowrap">
              <button>Bestel nu</button>
              <button>Huren</button>
            </div>
            <span className="divider my-3"></span>
            <span className="details-info">Gratis levering</span>
            <span className="details-info">100 dagen retourrecht</span>
          </div>
        </div>
        {/* Info and "people also bought" container */}
        <div className="flex row-nowrap mt-5">
          <div className="info-container">
            <Tabs
              data={tabData}
            />
          </div>
          <div className="more-container">
          </div>
        </div>
      </section>
    );
  }
}

export default SchilderijDetails;
