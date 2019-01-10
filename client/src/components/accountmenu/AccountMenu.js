import React, { Component } from 'react';
import {
    Link,
    Redirect
} from 'react-router-dom';

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import posed from "react-pose";

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import './AccountMenu.css';

const Menu = posed.div({
  open: {
    opacity: 1,
    transition: {
      duration: '200'
    },
    applyAtStart: { display: 'flex', margin: '10px 0 0 -260px' }
  },
  closed: {
    opacity: 0,
    transition: {
      duration: '200'
    },
    applyAtEnd: { display: 'none', margin: '0 0 0 0' },
  }
})

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
    type: 'dark'
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        color: 'white', // Some CSS
      },
    },
  },
});

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      aanhef
      name
      surname
      email
      address
      housenumber
      city
      postalcode
      token
      paymentmethod
    }
  }
`;

class AccountMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      buttonDisabled: false,
      snackbar: false,
      redirect: false
    };
  }

  componentWillMount() {
    this.setState({
      redirect: false,
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSnackbarClick = () => {
    this.setState({
      snackbar: true
    });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackbar: false,
    });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  closeModal() {
    this.props.closeModal()
    this.setState({
      buttonDisabled: false
    });
  }

  setUserApp(user, isLoggedIn) {
    this.props.setUser(user, isLoggedIn)
  }

  getTime() {
    let t = new Date().getHours()

    if (t >= 0 & t < 6) {
      return "Goedenacht"
    } else if (t >= 6 && t < 12) {
      return "Goedemorgen"
    } else if (t >= 12 && t < 18) {
      return "Goedemiddag"
    } else {
      return "Goedenavond"
    }
  }

  render() {
    const emptyUser = {
      id: '',
      aanhef: '',
      name: '',
      surname: '',
      email: '',
      address: '',
      city: '',
      postalcode: '',
      cellphone: ''
    }

    return (
      <Menu
        pose={this.props.menu ? 'open' : 'closed'}
        className="dropdown"
      >
      {this.state.redirect ? (
        <Redirect to="/" push />
      ) : null}
      {this.props.loggedIn ? (
        <div className="dropdown-account">
          <p className="menu-title-greeting">{this.getTime()}</p>
          <p className="menu-title-account">{this.props.user.name}</p>
          <Link to={`/user/${this.props.user.name}/gegevens`} onClick={this.props.closeModal} className="menu-account-link">Mijn gegevens</Link>
          <Link to={`/user/${this.props.user.name}/kooplijst`} onClick={this.props.closeModal} className="menu-account-link">Mijn kooplijst</Link>
          <Link to={`/user/${this.props.user.name}/huurlijst`} onClick={this.props.closeModal} className="menu-account-link">Mijn huurlijst</Link>

          <Button
            color="primary"
            className="logout-button"
            variant="outlined"
            onClick={() => this.setUserApp(emptyUser, false)}
            disabled={this.state.buttonState}
          >
            Log uit
          </Button>
        </div>
      ) : (
        <div className="dropdown-login">
          <p className="menu-title">Account</p>
          <form className="dropdown-form">
            <TextField
              id="account-menu-input-email"
              className="login-input"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              autoFocus={this.props.menu}
              inputProps={{
                'aria-label': 'Email'
              }}
            />
            <FormControl className="login-input">
              <InputLabel htmlFor="adornment-password">Wachtwoord</InputLabel>
              <Input
                id="account-menu-adornment-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                autoComplete="current-password"
                onChange={this.handleChange('password')}
                inputProps={{
                  'aria-label': 'Wachtwoord'
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </form>
          <MuiThemeProvider theme={theme}>
            <Mutation
              mutation={LOGIN}
              ignoreResults={false}
              onCompleted={(data) => {
                this.props.closeModal()
                this.setUserApp(data.login, true)
                this.setState({
                  email: '',
                  password: '',
                  buttonDisabled: false
                })
                localStorage.setItem('AUTH_TOKEN', data.login.token)
                this.setState({
                  redirect: true
                })
              }}
              onError={(error) => {
                console.error(`Query failed: ${error}`)
                this.handleSnackbarClick()
                this.setState({
                  buttonDisabled: false
                });
              }}
            >
              {(login) => (
                <Button
                  color="primary"
                  className="login-button"
                  variant="contained"
                  disabled={this.state.buttonDisabled}
                  onClick={e => {
                    e.preventDefault();
                    // Set buttons to disabled
                    this.setState({
                      buttonDisabled: true,
                    });

                    // Check email and password
                    if(!(/\S+@\S+\.\S+/).test(this.state.email)) {
                      this.handleSnackbarClick()
                      this.setState({
                        buttonDisabled: false,
                      });
                      return
                    }

                    // Mutate
                    login({ variables: {
                      email: this.state.email.toLowerCase(),
                      password: this.state.password
                    }});
                  }}
                >
                  Inloggen
                </Button>
              )}
            </Mutation>
          </MuiThemeProvider>
          <div className="onboarding-container">
            <span>Nieuw bij ARTIC?</span>
            <Link to={"/registreren"} onClick={this.props.closeModal} className="onboarding-link">Maak een account aan</Link>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackbar}
            autoHideDuration={6000}
            onClose={this.handleSnackbarClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Het email en/of het wachtwoord is onjuist.<br/>Probeer het opnieuw.</span>}
          />
        </div>
      )}
      </Menu>
    );
  }
}

export default AccountMenu;
