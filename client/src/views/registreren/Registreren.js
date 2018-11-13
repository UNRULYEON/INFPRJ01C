import React, { Component } from 'react';
import './Registreren.css';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

// // Components
// import PageTitle from '../../components/pageLink/PageLink';

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

// Pose Animation
import posed from "react-pose";

// animation const
const FirstStepContainer = posed.div({
  open: {
    x: '0%',
    transition: {
      x: {
        type: 'tween',
        ease: 'easeIn',
        duration: '400'
      }
    }
  },
  closed: {
    x: '100%',
    transition: {
      x: {
        type: 'tween',
        ease: 'easeIn',
        duration: '500'
      }
    }
  }
});


// theme const
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


// Query const
const SIGNUP = gql`
mutation Signup($name: String!, $surname: String!, $mail: String!, $password: String!, $aanhef: String!, $adres: String!, $city: String, $postalcode: String!) {
  signup(name: $name, surname: $surname, mail: $mail, password: $password, aanhef: $aanhef, adres: $adres, city: $city, postalcode: $postalcode) {
    id
    name
    surname
    email
    address
    city
    postalcode
    password
    aanhef
    token
  }
}
  `;


// Constructor
class Registreren extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      surname: '',
      mail: '',
      password: '',
      aanhef: 'Dhr',
      adres: '',
      city: '',
      postalcode: '',

      isHidden: false,
      isHidden2: true,
      isHidden3: false,
      toggle: false,

      buttonState: false,
      snackbar: false,
      showPassword: false
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden,
      isHidden2: !this.state.isHidden2,
      toggle: !this.state.toggle
    });
  }

  toggleHiddenAgain() {
    this.setState({
      isHidden2: !this.state.isHidden2,
      isHidden3: !this.state.isHidden3,
      toggle: !this.state.toggle
    });
    console.log(this.state);
  }

  // snackbar methods
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

  // adds input to state
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  //return html objects
  render() {
    return (

      <section className="section-container">

        {!this.state.isHidden && (<div id="een">
          <div id="for" className="dropdown-form">

            <h1>Account</h1>
            <TextField
              name="mail"
              label="Email"
              onChange={this.handleChange('mail')}
              value={this.state.mail}
            />

            <FormControl className="login-input">
              <InputLabel htmlFor="adornment-password">Wachtwoord</InputLabel>
              <Input
                name="password"
                type={this.state.showPassword ? 'text' : 'password'}
                onChange={this.handleChange('password')}
                value={this.state.password}

                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={this.handleClickShowPassword}>
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }

              />
            </FormControl>

            <MuiThemeProvider theme={theme}>
              <Button
                color="primary"
                className="login-button"
                variant="contained"
                disabled={this.state.buttonState}
                onClick={e => {
                  this.setState({
                    buttonState: true,
                  });

                  if (!(/\S+@\S+\.\S+/).test(this.state.mail)) {
                    this.handleSnackbarClick()
                    this.setState({
                      buttonState: false,
                    });
                    return
                  }
                  //go to next step here
                  this.toggleHidden()
                }}
              >
                Doorgaan
              </Button>
            </MuiThemeProvider>


            {//temporary button to skip entering data
            }
            <button
              onClick={this.toggleHidden.bind(this)}
              className="dropdown-button"
              id="button"
              type="primary">Doorgaan
            </button>

          </div>


          <div id="Waarom">
            <h1>Waarom een account?</h1>
            <p className="details-info">Beheer al je bestellingen en retouren op een plek</p>
            <p className="details-info">Bestel sneller met je bewaarde gegevens</p>
            <p className="details-info">Je winkelmandje altijd en overal opgeslagen</p>
          </div>

        </div>)}


        <FirstStepContainer pose={this.state.toggle ? 'open' : 'closed'}>
          {!this.state.isHidden2 && (<div id="twee">

            <div id="stappen">
              <p id="uno"><b>1</b></p>
              <h3 id="unoText">Email en wachtwoord</h3>
              <p id="dos"><b>2</b></p>
              <h3 id="dosText">Naam en adres</h3>
              <p id="tres"><b>3</b></p>
              <h3 id="tresText">Betaalwijze</h3>
            </div>


            <div id="naam" className="dropdown-form">
              <h1>Naam</h1>

              <p>Aanhef</p>
              <p><input type="radio" name="aanhef" value={this.state.aanhef} onChange={e => this.onChange(e)} />Dhr.</p>
              <p><input type="radio" name="aanhef" value={this.state.aanhef} onChange={e => this.onChange(e)} />Mevr.</p>


              <TextField
                name="name"
                label="Naam"
                onChange={e => this.onChange(e)}
                value={this.state.name}
              />


              <TextField
                name="surname"
                label="Achternaam"
                onChange={e => this.onChange(e)}
                value={this.state.surname}
              />
            </div>

            <div id="adres" className="dropdown-form">
              <h1>Adres</h1>

              <TextField
                name="adres"
                label="Adres"
                onChange={e => this.onChange(e)}
                value={this.state.adres}
              />

              <TextField
                name="Huisnummer"
                label="Huisnummer"
              />

              <TextField
                name="postalcode"
                label="Postcode"
                onChange={e => this.onChange(e)}
                value={this.state.postalcode}
              />

              <TextField
                name="city"
                label="Stad"
                onChange={e => this.onChange(e)}
                value={this.state.city}
              />

            </div>


            <MuiThemeProvider theme={theme}>
              <Button
                id="button"
                className="login-button"
                variant="contained"
                type="primary"
                color="default"
                onClick={this.toggleHidden.bind(this)}
              >

                Terug
              </Button>

              <Button
                id="button"
                className="login-button"
                variant="contained"
                type="primary"
                color="primary"
                onClick={this.toggleHiddenAgain.bind(this)}
              >
                Doorgaan
              </Button>
            </MuiThemeProvider>

          </div>)}
        </FirstStepContainer>


        <FirstStepContainer pose={!this.state.toggle ? 'open' : 'closed'}>
          {this.state.isHidden3 && (<div id="drie">

            <div id="stappen">
              <p id="uno"><b>1</b></p>
              <h3 id="unoText">Email en wachtwoord</h3>
              <p id="dosTwee"><b>2</b></p>
              <h3 id="dosText">Naam en adres</h3>
              <p id="tres"><b>3</b></p>
              <h3 id="tresText">Betaalwijze</h3>
            </div>

            <div id="betalen">
              <h1>Betaalwijze</h1>
              <p>Betaalmethode</p>
              <form>
                <select name="Betaalmethode">
                  <option value="IDEAL">IDEAL</option>
                  <option value="Achteraf">Achteraf betalen</option>
                  <option value="Creditcard">Creditcard</option>
                  <option value="Paypal">Paypal</option>
                </select>
              </form>
            </div>

            
            <MuiThemeProvider theme={theme}>
              <Button 
                id="button"                
                className="login-button" 
                variant="contained"                 
                type="primary"
                color="default"
                onClick={this.toggleHiddenAgain.bind(this)} 
              >
                Terug
              </Button>

              <Mutation mutation={SIGNUP}>
                {(signup, { data }) => (
                  <Button
                    id="button"
                    className="login-button"
                    variant="contained"
                    type="primary"
                    color="primary"
                    onClick={
                      e => {
                        this.setState({
                          buttonState: true,
                        });

                        //Mutate
                        e.preventDefault();
                        signup({
                          variables: {
                            name: this.state.name,
                            surname: this.state.surname,
                            mail: this.state.mail.toLowerCase(),
                            password: this.state.password,
                            aanhef: this.state.aanhef,
                            adres: this.state.adres,
                            city: this.state.city,
                            postalcode: this.state.postalcode
                          }
                        });

                      }
                    }
                  >
                    registreren
                  </Button>
                )}
              </Mutation>
            </MuiThemeProvider>

          </div>)}
        </FirstStepContainer>

        {//Snackbar is for the error message when the input email and/or password is invalid        
        }           
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
          message={<span id="message-id">Het email en/of het wachtwoord is onjuist ingevuld.<br />Probeer het opnieuw.</span>}
        />

      </section >

    );
  }
}

export default Registreren;
