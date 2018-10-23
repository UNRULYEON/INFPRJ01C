import React, { Component } from 'react';
import './PainterDescription.css'

class PainterDescription extends Component {
  render() {
    return (
      <div>
        <h1 className="title-biograpy">Biografie</h1>
        <p className="content-biograpy">{this.props.content}</p>
      </div>
    );
  }
}

export default PainterDescription;
