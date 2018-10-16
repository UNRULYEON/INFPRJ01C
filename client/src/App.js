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
import SchilderDetails from './views/schilderDetails/SchilderDetails';
import Contact from './views/contact/Contact';
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
            <Route path="/schilder/:id" component={SchilderDetails}/>
            <Route path="/contact" component={Contact}/>
            <Route component={NoMatch} />
            </Switch>
                <Footer/>
        </div>
      </Router>
    );
  }
}

export default App;
