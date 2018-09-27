import React, { Component } from 'react';
import './PageLink.css';

class PageLink extends Component {

  render() {
    return (
      <h1>{this.props.title}</h1>
    );
  }
}

export default PageLink;