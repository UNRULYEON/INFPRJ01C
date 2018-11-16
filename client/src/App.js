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
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
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
import Cart from './views/cart/Cart';
import Registreren from './views/registreren/Registreren';
import Account from './views/account/Account';
import Details from './views/details/Details';
import Orders from './views/orders/Orders';
import Rentals from './views/rentals/Rentals';
import NoMatch from './views/404/404';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const link = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const token = localStorage.getItem('AUTH_TOKEN');

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
        address: '',
        city: '',
        postalcode: '',
        cellphone: ''
      },
      loggedIn: false,
      cart: {
        items: [],
        total: 0,
        timestamp: ''
      },
      current_item: '',
      snackbarOpen: false,
      snackbarVariant: "",
      snackbarMessage: ""
    }
  }

  componentWillMount() {
    // Check if user data is present as a cookie
    if (localStorage.getItem('USER')) {
      const localUser = JSON.parse(localStorage.getItem('USER'));

      this.setState({
        user: {
          id: localUser.id,
          aanhef: localUser.aanhef,
          name: localUser.name,
          surname: localUser.surname,
          email: localUser.email,
          address: localUser.address,
          city: localUser.city,
          postalcode: localUser.postalcode,
          cellphone: localUser.cellphone
        },
        loggedIn: true
      })
    }

    // Check if cart data is present as a cookie
    if (localStorage.getItem('CART')) {
      const localCart = JSON.parse(localStorage.getItem('CART'));

      this.setState({
        cart: localCart.cart
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
        address: data.address,
        city: data.city,
        postalcode: data.postalcode,
        cellphone: data.cellphone
      },
      loggedIn: isLoggedIn
    });

    if (isLoggedIn) {
      localStorage.setItem("USER", JSON.stringify({
        id: data.id,
        aanhef: data.aanhef,
        name: data.name,
        surname: data.surname,
        email: data.email,
        address: data.address,
        city: data.city,
        postalcode: data.postalcode,
        cellphone: data.cellphone
      }))
    } else {
      localStorage.removeItem('AUTH_TOKEN')
      localStorage.removeItem('USER')
    }
  }

  setCart = (data, type) => {
    switch (type){
      case 'ADD_TO_CART':
        let currCart = []
        let total = 0

        if (!this.state.cart.items.length > 0) {
          // console.log(`No items in cart, pushing recieving item to cart...`)
          currCart.push(data)
        } else {
          // console.log(`Items in cart, checking if an item needs to be incr...`)

          let amountModified = false

          for (let i = 0; i < this.state.cart.items.length; i++){
            // console.log(`Current item: ${this.state.cart.items[i].id}`)
            // console.log(`Recieving item: ${data.id}`)
            if (data.id === this.state.cart.items[i].id) {
              // console.log(`Incrementing item with ID: ${this.state.cart.items[i].id}`)

              // Creating item
              let id = data.id
              let title = data.title
              let principalmaker = data.principalmaker
              let src = data.src
              let width = data.width
              let height = data.height
              let price = data.price
              let amount = this.state.cart.items[i].amount + 1

              let item = {
                id,
                title,
                principalmaker,
                src,
                width,
                height,
                price,
                amount
              }

              // console.log(`Item to be pushed to currItem: ${item}`)
              amountModified = true
              currCart.push(item)
            } else {
              // console.log(`Item doesn't need to be incr, pushing cart-item to new cart with ID: ${this.state.cart.items[i].id}`)
              currCart.push(this.state.cart.items[i])
            }
          }

          if (!amountModified) {
            // console.log(`Amount has not been modified, it's a new item, pushing to cart...`)
            currCart.push(data)
          }
        }

        for (let i = 0; i < currCart.length; i++) {
          total = (currCart[i].price * currCart[i].amount) + total
        }

        const cart = {
          items: currCart,
          total: total,
          timestamp: String(new Date())
        }

        this.setState(({
          cart: cart
        }))

        localStorage.setItem('CART', JSON.stringify({
          cart
        }))

        this.setState({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Het item is toegevoegd aan je winkelwagen"
        });
        break;
      case 'REMOVE_FROM_CART':
        break;
      default:
        break;
    }
  }

  setCurrentItem(id) {
    this.setState({
      current_item: id
    });
    console.log(`Item set`)
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
            <MuiThemeProvider theme={theme}>
              <Header
                user={this.state.user}
                cart={this.state.cart}
                setUser={this.setUser}
                setCart={this.setCart}
                loggedIn={this.state.loggedIn}
              />
              <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/schilderijen/" component={Schilderijen}/>
                <Route
                  path="/schilderij/:id"
                  render={(props) => <SchilderijDetails
                    {...props}
                    setCart={this.setCart}
                    currentItem={this.state.current_item}
                    setCurrentItem={this.setCurrentItem}
                />} />
                <Route path="/schilders" component={Schilders}/>
                <Route
                path="/schilder/:id"
                component={SchilderDetails}/>
                <Route path="/zoeken" component={Search} />
                <Route path="/contact" component={Contact} />
                <Route path="/faq" component={FAQ} />
                <Route
                  path="/login"
                  render={(props) => <Login
                    {...props}
                    loggedIn={this.state.loggedIn}
                    setUser={this.setUser}
                  />} />
                <Route
                  path="/winkelwagen"
                  render={(props) => <Cart
                    {...props}
                    user={this.state.user}
                    cart={this.state.cart}
                    setUser={this.setUser}
                    setCart={this.setCart}
                    loggedIn={this.state.loggedIn}
                />} />
                <Route path="/registreren" component={Registreren} />
                <Route
                  exact
                  strict
                  path="/user/:user"
                  render={(props) => <Account
                    {...props}
                    user={this.state.user}
                    setUser={this.setUser}
                    loggedIn={this.state.loggedIn}
                />} />
                <Route
                  exact
                  strict
                  path="/user/:user/gegevens"
                  render={(props) => <Details
                    {...props}
                    user={this.state.user}
                    setUser={this.setUser}
                    loggedIn={this.state.loggedIn}
                />} />
                <Route
                  exact
                  strict
                  path="/user/:user/bestellijst"
                  render={(props) => <Orders
                    {...props}
                    user={this.state.user}
                    setUser={this.setUser}
                    loggedIn={this.state.loggedIn}
                />} />
                <Route
                  exact
                  strict
                  path="/user/:user/huurlijst"
                  render={(props) => <Rentals
                    {...props}
                    user={this.state.user}
                    setUser={this.setUser}
                    loggedIn={this.state.loggedIn}
                />} />
                <Route component={NoMatch} />
              </Switch>
              <Footer/>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                open={this.state.snackbarOpen}
                autoHideDuration={6000}
                onClose={this.handleSnackbarClose}
              >
                <SnackbarContentWrapper
                  onClose={this.handleSnackbarClose}
                  variant={this.state.snackbarVariant}
                  message={this.state.snackbarMessage}
                />
              </Snackbar>
            </MuiThemeProvider>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
