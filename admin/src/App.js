import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css';

// Apollo
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from "apollo-link-error";
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "react-apollo";

// Material-UIui/core/styles';
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

// Components
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'

// Views
import Dashboard from './views/dashboard/Dashboard';
import Login from './views/login/Login';
import Users from './views/users/Users';
import Paintings from './views/paintings/Paintings';
import Painters from './views/painters/Painters';
import FAQ from './views/faq/FAQ';
import NoMatch from './views/404/404';

// API URL
const link = ApolloLink.from([
  new onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  new createHttpLink({
    uri: 'http://localhost:3001/graphql',
  })
])

// Authentication token if it exists
const token = localStorage.getItem('ADMIN_AUTH_TOKEN');

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
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

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const snackbarStyle = theme => ({
  success: {
    color: '#FFFFFF',
    backgroundColor: green[600],
  },
  error: {
    color: '#FFFFFF',
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    color: '#FFFFFF',
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    color: '#FFFFFF',
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function snackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

const SnackbarContentWrapper = withStyles(snackbarStyle)(snackbarContent);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component
            {...rest}
            {...props}
          />
        ) : (
            <Redirect
              {...rest}
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

function HomeRedirect({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        true ? (
          <Redirect
            {...rest}
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        ) : null
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: '',
        aanhef: '',
        name: '',
        surname: '',
        email: '',
        admin: false
      },
      loggedIn: false,
      snackbarOpen: false,
      snackbarVariant: "",
      snackbarMessage: "",
    }
  }

  componentWillMount() {
    // Check if user data is present as a cookie
    if (localStorage.getItem('ADMIN_USER')) {
      const localUser = JSON.parse(localStorage.getItem('ADMIN_USER'));

      this.setState({
        user: {
          id: localUser.id,
          aanhef: localUser.aanhef,
          name: localUser.name,
          surname: localUser.surname,
          email: localUser.email,
          admin: true
        },
        loggedIn: true
      })
    }
  }

  setUser = (data, isLoggedIn) => {
    this.setState({
      user: {
        id: data.id,
        aanhef: data.aanhef,
        name: data.name,
        surname: data.surname,
        email: data.email,
        admin: true
      },
      loggedIn: isLoggedIn
    });

    if (isLoggedIn) {
      localStorage.setItem("ADMIN_USER", JSON.stringify({
        id: data.id,
        aanhef: data.aanhef,
        name: data.name,
        surname: data.surname,
        email: data.email,
        admin: true
      }))
    } else {
      localStorage.removeItem('ADMIN_AUTH_TOKEN')
      localStorage.removeItem('ADMIN_USER')
    }
  }

  handleSnackbarOpen = (type) => {
    switch (type) {
      case 'ADD_USER_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "De gebruiker wordt over enkele ogenblikken toegevoegd"
        });
        break;
      case 'ADD_USER_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanmaken van de gebruiker"
        });
        break;
      case 'ADD_PAINTING_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Het schilderij wordt over enkele ogenblikken toegevoegd"
        });
        break;
      case 'ADD_PAINTING_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het toevoegen van een schilderij"
        });
        break;
      case 'ADD_PAINTER_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "De schilder wordt over enkele ogenblikken toegevoegd"
        });
        break;
      case 'ADD_PAINTER_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanmaken van de schilder"
        });
        break;
      case 'ADD_FAQ_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Het item verschijnt over enkele ogenblikken"
        });
        break;
      case 'ADD_FAQ_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanmaken van de FAQ"
        });
        break;
      case 'EDIT_PAINTING_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "De aanpassinig is over enkele ogenblikken te zien"
        });
        break;
      case 'EDIT_PAINTING_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanpassen van een schilderij"
        });
        break;
      case 'EDIT_FAQ_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "De aanpassing is over enkele ogenblikken te zien"
        });
        break;
      case 'EDIT_FAQ_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanpassen van een FAQ item"
        });
        break;
      case 'EDIT_USER_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "De aanpassing is over enkele ogenblikken te zien"
        });
        break;
      case 'EDIT_USER_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanpassen van een gebruiker"
        });
        break;
      case 'EDIT_PAINTER_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "De aanpassing is over enkele ogenblikken te zien"
        });
        break;
      case 'EDIT_PAINTER_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanpassen van een schilder"
        });
        break;
      case 'DELETE_FAQ_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Item verdwijnt over enkele ogenblikken"
        });
        break;
      case 'DELETE_FAQ_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het verwijderen van een item"
        });
        break;
      case 'DELETE_USER_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Gebruiker verdwijnt over enkele ogenblikken"
        });
        break;
      case 'DELETE_USER_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het verwijderen van een gebruiker"
        });
        break;
      case 'DELETE_PAINTING_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Schilderij verdwijnt over enkele ogenblikken"
        });
        break;
      case 'DELETE_PAINTING_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het verwijderen van een schilderij"
        });
        break;
      case 'DELETE_PAINTER_SUCCESS':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Schilder verdwijnt over enkele ogenblikken"
        });
        break;
      case 'DELETE_PAINTER_ERROR':
        this.setState({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het verwijderen van een schilder"
        });
        break;
      default:
        break;
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackbarOpen: false
    });
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Header
              handleSnackbarOpen={this.handleSnackbarOpen}
              setUser={this.setUser}
            />
            <div className="sidebar-view-container">
              <Sidebar />
              <Switch>
                <HomeRedirect
                  exact
                  path="/"
                />
                <PrivateRoute
                  exact
                  path="/dashboard"
                  component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/gebruikers"
                  handleSnackbarOpen={this.handleSnackbarOpen}
                  component={Users} />
                <PrivateRoute
                  exact
                  path="/schilderijen"
                  handleSnackbarOpen={this.handleSnackbarOpen}
                  component={Paintings}
                />
                <PrivateRoute
                  exact
                  path="/schilders"
                  handleSnackbarOpen={this.handleSnackbarOpen}
                  component={Painters} />
                <PrivateRoute
                  exact
                  path="/faq"
                  handleSnackbarOpen={this.handleSnackbarOpen}
                  component={FAQ} />
                <Route
                  path="/login"
                  render={(props) => <Login
                    {...props}
                    handleSnackbarOpen={this.handleSnackbarOpen}
                    setUser={this.setUser}
                  />}
                />
                <Route component={NoMatch} />
              </Switch>
            </div>
          </div>
        </Router>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
        >
          <SnackbarContentWrapper
            onClose={this.handleSnackbarClose}
            variant={this.state.snackbarVariant}
            message={this.state.snackbarMessage}
          />
        </Snackbar>
      </ApolloProvider>
    );
  }
}

export default App;
