import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';

import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from "apollo-link-error";
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "react-apollo";

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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
import LoginRedirect from './views/loginRedirect/LoginRedirect';
import Favorite from './views/favorite/Favorite';
import Cart from './views/cart/Cart';
import Order from './views/order/Order';
import Registreren from './views/registreren/Registreren';
import Account from './views/account/Account';
import Details from './views/details/Details';
import Orders from './views/orders/Orders';
import Rentals from './views/rentals/Rentals';
import NoMatch from './views/404/404';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const link = ApolloLink.from([
  new onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
        ),
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  new createHttpLink({
    uri: 'http://localhost:3001/graphql',
  })
])

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
        housenumber: '',
        city: '',
        postalcode: '',
        paymentmethod: '',
        cellphone: ''
      },
      loggedIn: false,
      favorite: {
        items: [],
        total: 0,
        timestamp: ''
      },
      cart: {
        items: [],
        timestamp: ''
      },
      order: {
        items: [],
        total: 0,
        timestamp: ''
      },
      rental: {
        items: [],
        total: 0,
        timestamp: ''
      },
      current_item: '',
      snackbarOpen: false,
      snackbarVariant: "",
      snackbarMessage: "",
      query: '',
      page: 1
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
          housenumber: localUser.housenumber,
          city: localUser.city,
          postalcode: localUser.postalcode,
          paymentmethod: localUser.paymentmethod,
          cellphone: localUser.cellphone
        },
        loggedIn: true
      })
    }

    // Check if favorite data is present as a cookie
    if (localStorage.getItem('FAVORITE')) {
      const localCart = JSON.parse(localStorage.getItem('FAVORITE'));

      this.setState({
        favorite: localCart.favorite
      })
    }

    // Check if cart data is present as a cookie
    if (localStorage.getItem('CART')) {
      const localCart = JSON.parse(localStorage.getItem('CART'));

      this.setState({
        cart: localCart.cart
      })
    }

    // Check if order data is present as a cookie
    if (localStorage.getItem('ORDER')) {
      const localOrder = JSON.parse(localStorage.getItem('ORDER'));

      this.setState({
        order: localOrder.order
      })
    }

    // Check if rental rental is present as a cookie
    if (localStorage.getItem('RENTAL')) {
      const localRental = JSON.parse(localStorage.getItem('RENTAL'));

      let rentals = {}
      let items = []

      for (let i = 0; i < localRental.rental.items.length; i++) {
        items.push({
          id: localRental.rental.items[i].id,
          amount: localRental.rental.items[i].amount,
          price: localRental.rental.items[i].price,
          height: localRental.rental.items[i].height,
          width: localRental.rental.items[i].width,
          principalmaker: localRental.rental.items[i].principalmaker,
          src: localRental.rental.items[i].src,
          title: localRental.rental.items[i].title,
          priceWithDays: localRental.rental.items[i].priceWithDays,
          days: localRental.rental.items[i].days,
          endDate: new Date(localRental.rental.items[i].endDate),
          startDate: new Date(localRental.rental.items[i].startDate),
        })
      }

      rentals.total = localRental.rental.total
      rentals.timestamp = localRental.rental.timestamp
      rentals.items = items

      this.setState({
        rental: rentals
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
        housenumber: data.housenumber,
        city: data.city,
        postalcode: data.postalcode,
        paymentmethod: data.paymentmethod,
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
        housenumber: data.housenumber,
        city: data.city,
        postalcode: data.postalcode,
        paymentmethod: data.paymentmethod,
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
        let currCart = this.state.cart.items
        let cartArr = this.state.cart.items
        let orderArr = this.state.order.items
        let rentalArr = this.state.rental.items
        let alreadyInCart = false
        let alreadyInOrder = false
        let alreadyInRental = false
        let total = 0

        console.log(currCart.length)
        console.log(cartArr)
        console.log(orderArr)
        console.log(rentalArr)

        if (cartArr.length > 0) {
          for (let i = 0; i < cartArr.length; i++){
            console.log(`Running cart loop`)
            if (data.id === cartArr[i].id) {
              alreadyInCart = true
            }
          }
        }

        if (orderArr.length > 0) {
          for (let i = 0; i < orderArr.length; i++){
            console.log(`Running order loop`)
            if (data.id === orderArr[i].id) {
              alreadyInOrder = true
            }
          }
        }

        if (rentalArr.length > 0) {
          for (let i = 0; i < rentalArr.length; i++){
            console.log(`Running rental loop`)
            if (data.id === rentalArr[i].id) {
              alreadyInRental = true
            }
          }
        }


        if (!alreadyInCart && !alreadyInOrder && !alreadyInRental) {
          console.log(`Item pushed to cart`)
          currCart.push(data)
        }

        console.log(`Cart: ${alreadyInCart}`)
        console.log(`Order: ${alreadyInOrder}`)
        console.log(`Rental: ${alreadyInRental}`)

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

        if (alreadyInCart) {
          this.setState({
            snackbarOpen: true,
            snackbarVariant: "error",
            snackbarMessage: "Het item zit al in je lijst"
          });
        } else if (alreadyInOrder) {
          this.setState({
            snackbarOpen: true,
            snackbarVariant: "error",
            snackbarMessage: "Het item zit al in je kooplijst "
          });
        } else if (alreadyInRental) {
          this.setState({
            snackbarOpen: true,
            snackbarVariant: "error",
            snackbarMessage: "Het item zit al in je huurlijst"
          });
        } else {
          this.setState({
            snackbarOpen: true,
            snackbarVariant: "success",
            snackbarMessage: "Het item is toegevoegd aan je lijst"
          });
        }
        break;
      case 'REMOVE_FROM_CART':
        break;
      default:
        break;
    }
  }

  updateFavorite = (item, type) => {
    let favorite
    let currFav = this.state.favorite.items
    let currCart = this.state.cart.items
    let total = 0

    switch (type) {
      case 'ADD_TO_FAV':
        let alreadyInFav = false
        let alreadyInCart = false

        if (currFav.length > 0) {
          for (let i = 0; i < currFav.length; i++){
            console.log(`Running fav loop`)
            if (item.id === currFav[i].id) {
              alreadyInFav = true
            }
          }
        }

        if (currCart.length > 0) {
          for (let i = 0; i < currCart.length; i++){
            console.log(`Running fav loop`)
            if (item.id === currCart[i].id) {
              alreadyInCart = true
            }
          }
        }

        if (alreadyInCart) {
          this.setState({
            snackbarOpen: true,
            snackbarVariant: "error",
            snackbarMessage: "Het item zit al in je lijst. Ga naar je lijst om hem te verplaatsen naar je favorietenlijst"
          });
        } else if (!alreadyInFav) {
          console.log(`Item pushed to fav`)
          currFav.push(item)
          this.setState({
            snackbarOpen: true,
            snackbarVariant: "success",
            snackbarMessage: "Het item is toegevoegd aan je favorietenlijst"
          });
        }

        for (let i = 0; i < currFav.length; i++) {
          total = (currFav[i].price * currFav[i].amount) + total
        }

        favorite = {
          items: currFav,
          total: total,
          timestamp: String(new Date())
        }

        this.setState(({
          favorite: favorite
        }))

        localStorage.setItem('FAVORITE', JSON.stringify({
          favorite
        }))

        if (alreadyInFav) {
          this.setState({
            snackbarOpen: true,
            snackbarVariant: "error",
            snackbarMessage: "Het item zit al in je favorietenlijst"
          });
        }
        break;
      case 'REMOVE_FROM_FAV':
        console.log(`Removing from favorite...`)
        console.log(`Title: ${item.title}`)
        console.log(`ID: ${item.id}`)

        let newFav = []

        for (let i = 0; i < currFav.length; i++) {
          if (currFav[i].id !== item.id) {
            newFav.push(currFav[i])
          }
        }

        console.log(`New favorites list:`)
        console.log(newFav)

        for (let i = 0; i < currFav.length; i++) {
          total = (currFav[i].price * currFav[i].amount) + total
        }


        favorite = {
          items: newFav,
          total: total,
          timestamp: String(new Date())
        }

        this.setState(({
          favorite: favorite,
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Het item is uit je favorietenlijst verwijderd"
        }))

        localStorage.setItem('FAVORITE', JSON.stringify({
          favorite
        }))

        break;
      case 'ADD_TO_FAV_FROM_LIST':

        for (let i = 0; i < currFav.length; i++) {
          total = (currFav[i].price * currFav[i].amount) + total
        }

        currFav.push(item)

        favorite = {
          items: currFav,
          total: total,
          timestamp: String(new Date())
        }

        this.setState(({
          favorite: favorite,
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Het item is verplaatst naar je favorietenlijst"
        }))

        localStorage.setItem('FAVORITE', JSON.stringify({
          favorite
        }))

        break;
      default:
        break;
    }
  }

  handleSnackbar = (type) => {
    switch(type) {
      case 'EDIT_USER_SUCCESS':
        this.setState(({
          snackbarOpen: true,
          snackbarVariant: "success",
          snackbarMessage: "Je gegevens zijn succesvol gewijzigd"
        }))
        break;
      case 'EDIT_USER_ERROR':
        this.setState(({
          snackbarOpen: true,
          snackbarVariant: "error",
          snackbarMessage: "Er is een fout opgetreden bij het aanpassen van je gegevens. Probeer het later opnieuw."
        }))
        break;
      default:
        break;
    }
  }

  updateCart = (items) => {
    let total = 0

    for (let i = 0; i < items.length; i++) {
      total = (items[i].price * items[i].amount) + total
    }

    const cart = {
      items: items,
      total: total,
      timestamp: String(new Date())
    }

    this.setState(({
      cart: cart
    }))

    localStorage.setItem('CART', JSON.stringify({
      cart
    }))
  }

  updateOrder = (items) => {
    let total = 0

    for (let i = 0; i < items.length; i++) {
      total = (items[i].price * items[i].amount) + total
    }

    const order = {
      items: items,
      total: total,
      timestamp: String(new Date())
    }

    this.setState(({
      order: order
    }))

    localStorage.setItem('ORDER', JSON.stringify({
      order
    }))
  }

  updateRental = (items) => {
    let total = 0

    for (let i = 0; i < items.length; i++) {
      total = (items[i].priceWithDays * items[i].amount / 20) + total
    }

    const rental = {
      items: items,
      total: total,
      timestamp: String(new Date())
    }

    this.setState(({
      rental: rental
    }))

    localStorage.setItem('RENTAL', JSON.stringify({
      rental
    }))
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

  setQuery = (q) => {
    this.setState({
      query: q
    })
  }

  setPage = (p) => {
    this.setState({
      page: p
    })
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <MuiThemeProvider theme={theme}>
              <Header
                user={this.state.user}
                cart={this.state.cart}
                order={this.state.order}
                rental={this.state.rental}
                setUser={this.setUser}
                setCart={this.setCart}
                setQuery={this.setQuery}
                loggedIn={this.state.loggedIn}
              />
              <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/schilderijen/" component={Schilderijen}/>
                <Route
                  path="/schilderij/:id"
                  render={(props) => <SchilderijDetails
                    {...props}
                    updateFavorite={this.updateFavorite}
                    setCart={this.setCart}
                    currentItem={this.state.current_item}
                    setCurrentItem={this.setCurrentItem}
                />} />
                <Route path="/schilders" component={Schilders}/>
                <Route
                path="/schilder/:id"
                component={SchilderDetails}/>
                <Route path="/zoeken"
                  render={(props) => <Search
                    {...props}
                    query={this.state.query}
                    setQuery={this.setQuery}
                    page={this.state.page}
                    setPage={this.setPage}
                    setLastLocal={this.setLastLocal}
                />} />
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
                    path="/login-redirect"
                    render={(props) => <LoginRedirect
                      {...props}
                      loggedIn={this.state.loggedIn}
                      setUser={this.setUser}
                    />} />
                  <Route
                    path="/mijnlijst"
                    render={(props) => <Cart
                      {...props}
                      user={this.state.user}
                      cart={this.state.cart}
                      order={this.state.order}
                      rental={this.state.rental}
                      setUser={this.setUser}
                      updateFavorite={this.updateFavorite}
                      updateCart={this.updateCart}
                      updateOrder={this.updateOrder}
                      updateRental={this.updateRental}
                      loggedIn={this.state.loggedIn}
                  />} />
                  <Route
                    path="/favorieten"
                    render={(props) => <Favorite
                      {...props}
                      user={this.state.user}
                      favorite={this.state.favorite}
                      cart={this.state.cart}
                      order={this.state.order}
                      rental={this.state.rental}
                      setCart={this.setCart}
                      updateFavorite={this.updateFavorite}
                      updateCart={this.updateCart}
                      updateOrder={this.updateOrder}
                      updateRental={this.updateRental}
                      loggedIn={this.state.loggedIn}
                  />} />
                <Route
                  path="/order"
                  render={(props) => <Order
                    {...props}
                    user={this.state.user}
                    cart={this.state.cart}
                    order={this.state.order}
                    updateOrder={this.updateOrder}
                    rental={this.state.rental}
                    updateRental={this.updateRental}
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
                    handleSnackbar={this.handleSnackbar}
                    loggedIn={this.state.loggedIn}
                />} />
                <Route
                  exact
                  strict
                  path="/user/:user/kooplijst"
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
                autoHideDuration={3000}
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
