import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      message: []
    }
  }

  componentDidMount() {
    fetch('/')
      .then(res => this.setState({res}));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.state.message.map(message =>
            <p key={message.id}>{ message }</p>
          )}
        </p>
      </div>
    );
  }
}

export default App;
