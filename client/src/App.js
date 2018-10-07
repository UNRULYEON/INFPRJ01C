import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';

// Views
import Home from './views/home/Home';
import Schilderijen from './views/schilderijen/Schilderijen';
import SchilderijDetails from './views/schilderijDetails/SchilderijDetails';
import Schilders from './views/schilders/Schilders';

import NoMatch from './views/404/404';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/schilderijen" component={Schilderijen}/>
            <Route path="/schilderij/:id" component={SchilderijDetails}/>
            <Route path="/schilders" component={Schilders}/>
            <Route component={NoMatch} />
          </Switch>
          {/* TODO: make a footer */}
                {/* <Footer /> */}
                {/* <Footer />  */}
                {/* <Link */}
        </div>
      </Router>
    );
  }
}

export default App;
