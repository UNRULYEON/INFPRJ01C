import React, { Component } from 'react';
import './PageLink.css';

class PageLink extends Component {

  render() {
    return (
      <div>
        <h1 className={this.props.center ? 'page-title-center' :  null}>{this.props.title}</h1>
        {this.props.subtitle ? (<h2>{this.props.subtitle}</h2>) : null}
      </div>
    );
  }
}

export default PageLink;