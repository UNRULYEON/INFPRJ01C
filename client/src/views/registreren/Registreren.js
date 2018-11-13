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
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

// Pose Animation
import posed from "react-pose";

//steppers
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { RadioGroup } from '@material-ui/core';

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

const styles = {
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
};

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
    TextField: {
      width: 200,
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
      aanhef: 'Dhr.',
      adres: '',
      city: '',
      postalcode: '',

      isHidden: false,
      isHidden2: true,
      isHidden3: false,
      toggle: false,

      buttonState: false,
      snackbar: false,
      showPassword: false,

      activeStep: 0,
      buttonText: 'Next',
      buttonNext: true,
    };
  }

  //stepper get methods
  getSteps() {
    return ['Email en wachtwoord', 'Naam en adres', 'Betaalwijze'];
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        console.log("show register")
        return this.showRegister();
      case 1:
        console.log("Show naam en adres")
        return this.showNaamAdres();
      case 2:
        console.log("show betaalinfo")
        return this.showBetaalInfo();
      default:
        return 'Uknown stepIndex';
    }
  }

  //stepper methods
  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      name: '',
      surname: '',
      mail: '',
      password: '',
      aanhef: 'Dhr.',
      adres: '',
      city: '',
      postalcode: '',
    });
  };

  //handle change for radio button
  handleChangeRadio = event => {
    this.setState({
      aanhef: event.target.value
    });
    console.log("state changed")
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




  //method shows case 0 of stepper
  showRegister() {
    return (
      <div id="showRegister">
        <div id="emailWachtwoordForm">

          <h1>Account</h1>
          <TextField
            name="mail"
            label="Email"
            onChange={this.handleChange('mail')}
            value={this.state.mail}
          />
          <br></br>

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
        </div>

        <div id="lijn"></div>

        <div id="Waarom">
          <h1>Waarom een account?</h1>
          <p className="details-info">Beheer al je bestellingen en retouren op een plek</p>
          <p className="details-info">Bestel sneller met je bewaarde gegevens</p>
          <p className="details-info">Je winkelmandje altijd en overal opgeslagen</p>
        </div>
      </div>
    )
  }

  //Shows case 1 of stepper
  showNaamAdres() {
    return (
      <div id="showNaamAdres">
        <div id="naam" >
          <h1>Naam</h1>

          <p>Aanhef</p>
              Dhr.
              <Radio
                color="primary"
                value="Dhr."
                checked={this.state.aanhef === 'Dhr.'}
                onChange={this.handleChangeRadio}
              />
              Mevr.
              <Radio
                color="primary"
                value="Mevr."
                checked={this.state.aanhef === 'Mevr.'}
                onChange={this.handleChangeRadio}
              />


          <TextField id="textFieldName"
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

        <div id="lijn"></div>

        <div id="adres">
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

      </div>
    )
  }

  //method that shows case 2 of stepper
  showBetaalInfo() {
    return (
        <div id="showBetaalInfo">
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
    )
  }


  //return html objects
  render() {
    const { activeStep } = this.state;
    return (

      <section className="section-container">
        <Stepper activeStep={activeStep} alternativeLabel>
          {this.getSteps().map(label => {
            return (
              <Step key={label}>
                <StepLabel>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>


        <div>
          {activeStep === this.getSteps().length ? (
            <div id="getStepsDone">
              Done!
              <Button
              // TODO: edit this to insta login with the given info instead of resetting the register page
                onClick={this.handleReset}
              >
                Opnieuw registreren
              </Button>
            </div>
          )
            //else
            : (
              <div>
                {this.getStepContent(activeStep)}
                <div id="buttonsBackNext">
                  <MuiThemeProvider theme={theme}>
                    <Button
                      id="button"
                      className="login-button"
                      variant="contained"
                      type="primary"
                      color="default"
                      disabled={activeStep === 0}
                      onClick={e => {
                        this.handleBack()
                      }}
                    >
                      Terug
                    </Button>

                    {/* display button 'Next'  */}
                    {activeStep != 2 ?
                      <Button
                        id="button"
                        color="primary"
                        className="login-button"
                        variant="contained"
                        onClick={e => {
                          this.setState({
                            buttonState: true,
                          });

                          if (!(/\S+@\S+\.\S+/).test(this.state.mail)) {
                            this.handleSnackbarClick()
                            return
                          }
                          //go to next step here
                          this.handleNext()
                          console.log(this.state)
                        }}
                      >
                        Next
                      </Button>

                      :
                      // Display button 'Registreren'
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
                                this.handleNext()
                              }
                            }
                          >
                            registreren
                          </Button>
                        )}
                      </Mutation>}
                  </MuiThemeProvider>
                </div>
              </div>
            )}
        </div>




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
