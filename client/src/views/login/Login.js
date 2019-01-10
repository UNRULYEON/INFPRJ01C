import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

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

import './Login.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

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

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
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

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      buttonState: false,
      snackbar: false,
    }
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

  setUserApp(user, isLoggedIn) {
    console.log(user)
    this.props.setUser(user, isLoggedIn)
  }

  // componentDidMount = () => {
  //   if (this.props.loggedIn) {
  //     console.log(`User is logged in, directing to account page`)
  //   }
  // }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Login" center={true}/>
        <div className="login-container">
          <form className="login-form">
            <TextField
              id="input-email"
              className="login-input"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              inputProps={{
                'aria-label': 'Email'
              }}
            />
            <FormControl className="login-input">
              <InputLabel htmlFor="adornment-password">Wachtwoord</InputLabel>
              <Input
                id="adornment-password"
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
                console.log(`Query completed: ${data.login}`)
                localStorage.setItem('AUTH_TOKEN', data.login.token)
                this.setUserApp(data.login, true)
                this.props.history.push("/")
              }}
              onError={(error) => {
                console.error(`Query failed: ${error}`)
                this.handleSnackbarClick()
                this.setState({
                  buttonState: false
                });
              }}
            >
              {(login) => (
                <Button
                  color="primary"
                  className="login-button"
                  variant="contained"
                  disabled={this.state.buttonState}
                  onClick={e => {
                    e.preventDefault();
                    // Set buttons to disabled
                    this.setState({
                      buttonState: true,
                    });

                    // Check email and password
                    if(!(/\S+@\S+\.\S+/).test(this.state.email)) {
                      this.handleSnackbarClick()
                      this.setState({
                        buttonState: false,
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

          <Link to={"/registreren"} className="onboarding-link-login">
            <Button
              color="primary"
              className="login-button"
              variant="outlined"
              disabled={this.state.buttonState}
            >
              Maak een account aan
            </Button>
          </Link>
          </MuiThemeProvider>
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
      </section>
    );
  }
}

export default Login;
