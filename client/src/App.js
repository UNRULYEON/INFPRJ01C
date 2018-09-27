import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import './App.css';

// Views
import Home from './views/home/Home';
import Schilderijen from './views/schilderijen/Schilderijen';
import Schilders from './views/schilders/Schilders';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Header/>
          <Route exact path="/" component={Home}/>
          <Route path="/schilderijen" component={Schilderijen}/>
          <Route path="/schilders" component={Schilders}/>
          {/* TODO: make a footer */}
                <Footer />
                {/* <Footer />  */}
                {/* <Link */}
        </div>
      </Router>
    );
  }
}

export default App;
