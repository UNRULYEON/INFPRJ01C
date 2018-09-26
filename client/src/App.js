import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import './App.css';

import Home from './views/home/Home';
import Schilderijen from './views/schilderijen/Schilderijen';
import Schilders from './views/schilders/Schilders';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to React</h1>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/schilderijen">About</Link></li>
              <li><Link to="/schilders">Topics</Link></li>
            </ul>
          </header>
          <Route exact path="/" component={Home}/>
          <Route path="/schilderijen" component={Schilderijen}/>
          <Route path="/schilders" component={Schilders}/>
        </div>
      </Router>
    );
  }
}

export default App;
