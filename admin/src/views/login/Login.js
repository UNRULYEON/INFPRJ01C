import React, { Component } from 'react';
import './Login.css';

// Apollo
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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

// Icons
import logo from '../../icons/logo.svg';

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#FFFFFF'
    },
    secondary: {
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
      admin
      token
    }
  }
`;

class Login extends Component {
  constructor(props) {
    super (props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      buttonState: false,
      snackbar: false,
    }
  }

  componentWillMount() {
    // Check if user data is present as a cookie
    if (localStorage.getItem('ADMIN_USER')) {
      this.props.history.push(`/dashboard`)
      window.location.reload()
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
    this.props.setUser(user, isLoggedIn)
  }

  render() {
    return (
      <div className="login-container">
        <Paper elevation={1} className="login-wrapper">
          <img src={logo} alt="Logo" height="100" className="login-logo" />
          <h1>ARTIC</h1>
          <MuiThemeProvider theme={theme}>
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
            <Mutation
              mutation={LOGIN}
              ignoreResults={false}
              onCompleted={(data) => {
                localStorage.setItem('ADMIN_AUTH_TOKEN', data.login.token)
                this.setUserApp(data.login, true)
                this.props.history.push(`/dashboard`)
                window.location.reload()
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
                  color="secondary"
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
          </MuiThemeProvider>
        </Paper>
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
    );
  }
}

export default Login;