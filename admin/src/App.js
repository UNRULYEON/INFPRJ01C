import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css';

// Apollo
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
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
import NoMatch from './views/404/404';

// API URL
const link = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

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
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
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
          <Component {...props} />
        ) : (
          <Redirect
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

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      user: {
        id: '',
        aanhef: '',
        name: '',
        surname: '',
        email: '',
        address: '',
        housenumber: '',
        city: '',
        postalcode: '',
        paymentmethod: '',
        cellphone: ''
      },
      loggedIn: false,
      snackbarOpen: false,
      snackbarVariant: "",
      snackbarMessage: "",
    }
  }

  componentDidMount = () => {
    localStorage.setItem('ADMIN_AUTH_TOKEN', true)
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
            <Header/>
            <div className="sidebar-view-container">
              <Sidebar/>
              <Switch>
                <PrivateRoute
                  exact
                  path="/"
                  component={Dashboard}/>
                <PrivateRoute
                  exact
                  path="/gebruikers"
                  component={Users}/>
                <PrivateRoute
                  exact
                  path="/schilderijen"
                  component={Paintings}/>
                <PrivateRoute
                  exact
                  path="/schilders"
                  component={Painters}/>
                <Route path="/login" component={Login} />
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
