import React, { Component } from 'react';
import MDSpinner from "react-md-spinner";
import './Loading.css';

// https://github.com/tsuyoshiwada/react-md-spinner

class Loading extends Component {
  render() {
    return (
      <div className="spinner" style={this.props.style}>
        <MDSpinner
          size={this.props.size || 40}
          borderSize={this.props.borderSize || 5}
          duration={this.props.duration || 1333}
          color1={this.props.color1}
          color2={this.props.color2}
          color3={this.props.color3}
          color4={this.props.color4}
          singleColor={this.props.singleColor || "rgb(0, 0, 0)"}
        />
      </div>
    );
  }
}

export default Loading;
