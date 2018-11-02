import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "react-apollo";

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Views
import Home from './views/home/Home';
import Schilderijen from './views/schilderijen/Schilderijen';
import SchilderijDetails from './views/schilderijDetails/SchilderijDetails';
import Schilders from './views/schilders/Schilders';
import SchilderDetails from './views/schilderDetails/SchilderDetails';
import Search from './views/search/Search';
import Contact from './views/contact/Contact';
import FAQ from './views/faq/FAQ';
import Login from './views/login/Login';
import Registreren from './views/registreren/Registreren';
import NoMatch from './views/404/404';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const link = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('AUTH_TOKEN');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? (
        `Bearer ${token}`
      ) : (
        ""
      ),
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
});

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
      light: '#484848',
      dark: '#000000'
    },
    secondary: {
      main: '#fafafa',
      light: '#ffffff',
      dark: '#c7c7c7'
    }
  },
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <MuiThemeProvider theme={theme}>
              <Header />
              <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/schilderijen" component={Schilderijen}/>
                <Route path="/schilderij/:id" component={SchilderijDetails}/>
                <Route path="/schilders" component={Schilders}/>
                <Route path="/schilder/:id" component={SchilderDetails}/>
                <Route path="/zoeken" component={Search} />
                <Route path="/contact" component={Contact} />
                <Route path="/faq" component={FAQ} />
                <Route path="/login" component={Login} />
                <Route path="/registreren" component={Registreren} />
                <Route component={NoMatch} />
              </Switch>
              <Footer/>
            </MuiThemeProvider>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
