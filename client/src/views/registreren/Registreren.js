import React, { Component } from 'react';
import './Registreren.css';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Radio from '@material-ui/core/Radio';
import FormHelperText from '@material-ui/core/FormHelperText';

//steppers
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

// theme const
const theme = new createMuiTheme({
  palette: {
    primary: { main: '#43a047' },
    secondary: { main: '#000' },
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      root: { color: 'white' },
    },
    TextField: { width: 200, },
  },
});

// Query const
const SIGNUP = gql`
mutation Signup($name: String!, $surname: String!, $mail: String!, $password: String!, $aanhef: String, $adres: String, $housenumber: String, $city: String, $postalcode: String) {
  signup(name: $name, surname: $surname, mail: $mail, password: $password, aanhef: $aanhef, adres: $adres, housenumber: $housenumber, city: $city, postalcode: $postalcode) 
  {
    id
    name
    surname
    email
    address
    housenumber
    city
    postalcode
    password
    aanhef
    token
  }
}
  `;

const CHECK_USER = gql`
  query checkUser($mail: String!){
    checkUser(mail: $mail)
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
      housenumber: '',
      city: '',
      postalcode: '',

      showPassword: false,

      activeStep: 0,

      emailBestaat: false,
      emailIsCorrect: true,

      //checkUser becomes true when the button Next is pressed
      //when checkUser becomes true <Query> gets executed this calls the function handleNextNotInDB
      checkUser: false,

      //userChecked becomes true after handleNextNotInDB is called
      //when userChecked equals true AND emailIsCorrect equals true callEmailCheck() is called
      userChecked: false, 
    }
  }

  //stepper get methods
  getSteps() {
    return ['Email en wachtwoord', 'Naam en adres', 'Betaalwijze'];
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return this.showRegister();
      case 1:
        return this.showNaamAdres();
      case 2:
        return this.showBetaalInfo();
      default:
        return 'Uknown stepIndex';
    }
  }

  //stepper methods
  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }))
    console.log(`the stepper incremented ` + this.state.activeStep)
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }))
  };

  //handle change for radio button
  handleChangeRadio = event => {
    this.setState({
      aanhef: event.target.value
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      emailIsCorrect: false,
    })
    if (!(/\S+@\S+\.\S+/).test(this.state.mail) | this.state.mail === '') {
      this.setState({
        emailIsCorrect: false
      })

    }
    else {
      this.setState({
        emailIsCorrect: true
      })

    }
  }

  checkUserFunc() {
    if (this.state.activeStep === 0) {
      this.setState({
        checkUser: true,
      })
    }
    else {
      this.setState({
        checkUser: false,
      })
    }
  }

  callBackStepOne() {    
    this.handleBack()
    this.restoreStateWhenBack()
  }

  restoreStateWhenBack() {
    if (this.state.activeStep === 0) {
      this.setState({
        // checkUser: false,
        userChecked: false,
        emailIsCorrect: true,
        emailBestaat: false,
      })
    }
  }

  //function is called when <Query> returns onCompleted succesfully
  //if emailIsCorrect equals true callEmailCheck() is
  handleNextNotInDB() {
      this.setState({
        // user has been checked
        userChecked: true,
        //checkUser to false to prevent infinite loop
        checkUser: false,
      })
      if (this.state.emailIsCorrect === true) {
        // this.setState({ checkUser: false })
        this.handleNext()
      }

  }

  //shows password as type string if called
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  // adds input to state
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  toggleHelperText() {
    if (!this.state.emailIsCorrect) {
      return 'email is fout'
    } else if (this.state.emailBestaat) {
      return 'email bestaat al'
    } else if (this.state.mail === '') {
      return 'email is leeg'
    }
  }


  //calls handleNext() if userChecked is true
  callEmailCheck() {
    this.setState({
      checkUser: true
    })
    if (this.state.mail === '') {
      this.setState({ emailIsCorrect: false, })
    }
    else if (this.state.userChecked && this.state.emailIsCorrect === true) {
      this.handleNext()
      // this.checkUserFunc()
    }
  }

  showRegister() {
    return (
      <div id="showRegister">
        <div id="emailWachtwoordForm">
          <h1>Account</h1>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Email</InputLabel>
            <Input
              error={this.state.emailBestaat | !this.state.emailIsCorrect ? true : false}
              name="mail"
              label="Email"
              onChange={this.handleChange('mail')}
              value={this.state.mail}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText()}
            </FormHelperText>
          </FormControl>
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

  //SHows case 1 of stepper
  showNaamAdres() {
    return (
      <div id="showNaamAdres">
        <div id="naam">
          <h1>Naam</h1>
          <p>Aanhef</p>
          <div id="aanhef">
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
          </div>

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

        <div id="lijn"></div>

        <div id="adres">
          <h1 id="adresHeader">Adres</h1>

          <TextField
            name="adres"
            label="Straat"
            onChange={e => this.onChange(e)}
            value={this.state.adres}
          />

          <TextField
            name="housenumber"
            label="Huisnummer"
            onChange={e => this.onChange(e)}
            value={this.state.housenumber}
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

  // method that shows case 2 of stepper
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

  // return html objects
  render() {
    const { activeStep } = this.state;
    return (
      <section className="section-container">

        {/* to not show the stepper at the beginning */}
        {activeStep !== 0 ?

          // the stepper
          <Stepper activeStep={activeStep} alternativeLabel>
            {this.getSteps().map(label => {
              return (
                <Step key={label}>
                  <StepLabel>
                    {label}
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
          : null
        }

        {this.state.checkUser === true && this.state.activeStep === 0 ? (
          <Query
            query={CHECK_USER}
            variables={{ mail: this.state.mail }}
            onCompleted={(data) => {
              {
                {
                  data.checkUser ? console.log(`already exists`) : this.handleNextNotInDB()
                }
              }
            }}
            onError={(err) => {
              console.log(`Query failed: ${err}`)
            }}
          >
            {() => {
              return (
                <div></div>
              );
            }}
          </Query>
        ) : null}

        <div>
          {activeStep === this.getSteps().length ?
            (
              <div id="getStepsDone">Done!</div>
            )
            :
            (
              <div>
                {this.getStepContent(activeStep)}
                <div id="buttonsBackNext">
                  <MuiThemeProvider theme={theme}>
                    {/* to no show back button at the beginning */}
                    {activeStep !== 0 ?

                      // button to go back
                      <Button
                        id="button"
                        className="login-button"
                        variant="outlined"
                        type="primary"
                        color="secondary"
                        disabled={activeStep === 0}
                        onClick={e => {
                          this.callBackStepOne()
                        }}
                      >
                        Terug
                      </Button>
                      : null
                    }

                    {activeStep !== 2 ?
                      //next knop
                      <Button
                        id="button"
                        color="primary"
                        className="login-button"
                        variant="contained"
                        onClick={e => {
                          {
                            this.callEmailCheck()
                          }
                        }}
                      >
                        Next
                      </Button>

                      //Registreren knop
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
                                    housenumber: this.state.housenumber,
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
                      </Mutation>
                    }
                  </MuiThemeProvider>
                </div>
              </div>
            )
          }
        </div>

      </section>

    )
  }

}

export default Registreren;
