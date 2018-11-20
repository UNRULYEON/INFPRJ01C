import React, { Component } from 'react';
import './Registreren.css';
import { Mutation } from "react-apollo";
import { ApolloConsumer } from 'react-apollo';
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
import Radio from '@material-ui/core/Radio';
import FormHelperText from '@material-ui/core/FormHelperText';

//steppers
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import PageTitle from '../../components/pageLink/PageLink'

// Button Theme (style)
const theme = new createMuiTheme({
  palette: {
    primary: { main: '#43a047' },
    secondary: { main: '#ff0000' },
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

//query's
const SIGNUP = gql`
mutation Signup($name: String!, $surname: String!, $mail: String!, $password: String!, $aanhef: String, $adres: String, $housenumber: String, $city: String, $postalcode: String, $paymentmethod: String) {
  signup(name: $name, surname: $surname, mail: $mail, password: $password, aanhef: $aanhef, adres: $adres, housenumber: $housenumber, city: $city, postalcode: $postalcode, paymentmethod: $paymentmethod) 
  {
    id
    name
    surname
    email
    address
    housenumber
    city
    postalcode
    paymentmethod
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

class Registreren extends Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      name: '',
      surname: '',
      mail: '',
      password: '',
      passwordRepeat: '',
      showPassword: false,
      showPasswordRepeat: false,
      aanhef: 'Dhr.',
      adres: '',
      housenumber: '',
      city: '',
      postalcode: '',
      paymentmethod: 'not specified',

      emailFilledInCorrect: false,
      emailIsEmpty: true,
      passwordIsEmpty: true,
      passwordRepeatIsEmpty: true,
      nameIsEmpty: true,
      surnameIsEmpty: true,

      // these two witholds the error of the inputs: email and password when first opening the page
      baseInputEmail: true,
      baseInputPassword: true,
      baseInputPasswordRepeat: true,
      baseInputName: true,
      baseInputSurname: true,

      //snackbar to show the error pop-up
      snackbar: false,

      queryResult: false,

    }//end of state definitions
  }//end of constructor

  //methods
  //show the text in the stepper
  getSteps() {
    return ['Email en wachtwoord', 'Naam en adres', 'Betaalwijze toevoegen'];
  }

  //show the content per stepper case
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

  QueryExecutedSuccessfully() {
    this.setState({
      queryResult: true,
    })
    this.handleNext()
  }

  QueryExecutedWrong() {
    this.setState({
      queryResult: false,
    })
    this.handleNext()
  }

  handleNext = () => {
    if (this.state.activeStep === 0) {
      if (this.state.emailFilledInCorrect === true && this.state.emailIsEmpty === false && this.state.passwordIsEmpty === false && this.state.queryResult === false && this.state.passwordRepeat === this.state.password) {
        this.setState(state => ({
          activeStep: state.activeStep + 1,
          snackbar: false,
        }))
      }
      else {
        this.handleSnackbarClick()
      }
    }
    else if (this.state.activeStep === 1) {
      //check is the required inputs have been filled in correctly
      if (this.state.nameIsEmpty === false && this.state.surnameIsEmpty === false) {
        this.setState(state => ({
          activeStep: state.activeStep + 1,
          snackbar: false,
        }))
      }
      else {
        this.handleSnackbarClick()
      }
    }
    else if (this.state.activeStep === 2) {
      this.setState(state => ({
        activeStep: state.activeStep + 1,
      }))
    }
  }



  //decrement activeStep to switch content from any case
  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }))
  }

  handleSnackbarClick = () => {
    this.setState({
      snackbar: true,
    })
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackbar: false,
    })
  }

  //shows password as type string if called
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  handleClickShowPasswordRepeat = () => {
    this.setState(state => ({ showPasswordRepeat: !state.showPasswordRepeat }));
  }

  //handle change for radio buttons
  handleChangeRadio = event => {
    this.setState({
      aanhef: event.target.value
    });
  }



  //handles change of the MAIL state
  handleChangeEmail = name => event => {
    this.setState({
      [name]: event.target.value.trim(),//calling trim makes it so email input doesnt register the spacebar
    })
    this.checkMailInput()
  }

  //checks if the input of mail is correctly filled in. if it is, change the state of emailFilledInCorrect to true && calls handleMailError() at the end of the method
  checkMailInput() {
    this.setState({
      baseInputEmail: false
    })
    if ((/\S+@\S+\.\S+/).test(this.state.mail)) {
      this.setState({
        emailFilledInCorrect: true,
      })
    }
    else {
      this.setState({
        emailFilledInCorrect: false,
      })
    }
    if (this.state.mail === '') {
      this.setState({
        emailIsEmpty: true,
      })
    }
    else {
      this.setState({
        emailIsEmpty: false,
      })
    }
  }

  // returns error{true} if the mail input has been added incorrectly
  handleMailError() {
    if (this.state.emailFilledInCorrect === false | this.state.emailIsEmpty === true) {
      if (this.state.baseInputEmail === true) {
        return false
      }
      return true
    }
    else {
      return false
    }
  }



  //handles change of the PASSWORD state
  handleChangePassword = name => event => {
    this.setState({
      [name]: event.target.value.trim(),//calling trim makes it so password input doesnt register the spacebar
    })
    this.checkPasswordInput()
  }

  //returns passwordIsEmpty state
  checkPasswordInput() {
    this.setState({
      baseInputPassword: false
    })
    if (this.state.password === '') {
      this.setState({
        passwordIsEmpty: true
      })
    }
    else {
      this.setState({
        passwordIsEmpty: false
      })
    }
  }

  // returns error{true} if the password input hasn't been added
  handlePasswordError() {
    if (this.state.passwordIsEmpty === true) {
      if (this.state.baseInputPassword === true) {
        return false
      }
      return true
    }
    else {
      return false
    }
  }



  handleChangePasswordRepeat = name => event => {
    this.setState({
      [name]: event.target.value.trim(),//calling trim makes it so password input doesnt register the spacebar
    })
    this.checkPasswordRepeatInput()
  }

  checkPasswordRepeatInput() {
    this.setState({
      baseInputPasswordRepeat: false
    })
    if (this.state.passwordRepeat === '') {
      this.setState({
        passwordRepeatIsEmpty: true
      })
    }
    else {
      this.setState({
        passwordRepeatIsEmpty: false
      })
    }
  }

  handlePasswordRepeatError() {
    if (this.state.passwordRepeatIsEmpty === true) {
      if (this.state.baseInputPasswordRepeat === true) {
        return false
      }
      return true
    }
    else {
      return false
    }
  }



  //handle name changes
  handleChangeName = name => event => {
    this.setState({
      [name]: event.target.value.trim(),
    })
    this.checkNameInput()
  }

  // check if the input is not empty
  checkNameInput() {
    this.setState({
      baseInputName: false,
    })
    if (this.state.name === '') {
      this.setState({
        nameIsEmpty: true,
      })
    }
    else {
      this.setState({
        nameIsEmpty: false,
      })
    }
  }

  handleNameError() {
    if (this.state.nameIsEmpty === true) {
      if (this.state.baseInputName === true) {
        return false
      }
      return true
    }
    else {
      return false
    }
  }



  handleChangeSurname = name => event => {
    this.setState({
      [name]: event.target.value.trim(),
    })
    this.checkSurnameInput()
  }

  checkSurnameInput() {
    this.setState({
      baseInputSurname: false,
    })
    if (this.state.surname === '') {
      this.setState({
        surnameIsEmpty: true,
      })
    }
    else {
      this.setState({
        surnameIsEmpty: false,
      })
    }
  }

  handleSurnameError() {
    if (this.state.surnameIsEmpty === true) {
      if (this.state.baseInputSurname === true) {
        return false
      }
      return true
    }
  }



  toggleHelperTextEmail() {
    if (this.state.mail === '') {
      return 'Email is leeg'
    } else if (!this.state.emailFilledInCorrect) {
      return 'email is fout'
    }
  }

  toggleHelperTextName() {
    if (this.state.name === '') {
      return 'Naam is verplicht'
    }
  }

  toggleHelperTextSurname() {
    if (this.state.surname === '') {
      return 'Achternaam is verplicht'
    }
  }



  // ONCHANGE
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  showSnackBarMessage() {
    if (this.state.activeStep === 0) {
      if (this.state.mail === '') {
        return (<span id="message-id">Email en wachtwoord is leeg.<br />Vul iets in.</span>)
      }
      if (this.state.queryResult === true) {
        return (<span id="message-id">Email bestaat al.<br />Probeer een andere.</span>)
      }
      else if (this.state.passwordRepeat !== this.state.password) {
        return (<span id="message-id"> Wachtwoorden komen niet overeen. <br />Probeer het opnieuw.</span>)
      }
      else {
        return (<span id="message-id">Het email en/of het wachtwoord is onjuist.<br />Probeer het opnieuw.</span>)
      }
    }
    else if (this.state.activeStep === 1) {
      return (<span id="message-id">Naam en/of achternaam is onjuist.<br />Probeer het opnieuw.</span>)
    }
  }

  //case 0 showRegister
  showRegister() {
    return (
      <div id="showRegister">
        <div id="emailWachtwoordForm">
          <h1>Account</h1>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Email</InputLabel>
            <Input
              error={this.handleMailError()}
              name="mail"
              onChange={this.handleChangeEmail('mail')}
              onBlur={this.handleChangeEmail('mail')}
              value={this.state.mail}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperTextEmail()}
            </FormHelperText>
          </FormControl>
          <br></br>

          <FormControl className="login-input">
            <InputLabel htmlFor="adornment-password">Wachtwoord</InputLabel>
            <Input
              error={this.handlePasswordError()}
              name="password"
              type={this.state.showPassword ? 'text' : 'password'}
              onChange={this.handleChangePassword('password')}
              onBlur={this.handleChangePassword('password')}
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
          <br></br>

          <FormControl className="login-input">
            <InputLabel>Herhaal Wachtwoord</InputLabel>
            <Input
              error={this.handlePasswordRepeatError()}
              name="passwordRepeat"
              type={this.state.showPasswordRepeat ? 'text' : 'password'}
              onChange={this.handleChangePasswordRepeat('passwordRepeat')}
              onBlur={this.handleChangePasswordRepeat('passwordRepeat')}
              value={this.state.passwordRepeat}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={this.handleClickShowPasswordRepeat}>
                    {this.state.showPasswordRepeat ? <Visibility /> : <VisibilityOff />}
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

  //case 1 showNaamAdres
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

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Naam</InputLabel>
            <Input
              error={this.handleNameError()}
              name="name"
              onChange={this.handleChangeName('name')}
              onBlur={this.handleChangeName('name')}
              value={this.state.name}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperTextName()}
            </FormHelperText>
          </FormControl>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Achternaam</InputLabel>
            <Input
              error={this.handleSurnameError()}
              name="surname"
              onChange={this.handleChangeSurname('surname')}
              onBlur={this.handleChangeSurname('surname')}
              value={this.state.surname}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperTextSurname()}
            </FormHelperText>
          </FormControl>
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

  //case 2 showBetaalInfo
  showBetaalInfo() {
    return (
      <div id="showBetaalInfo">
        <h1>Betaalwijze toevoegen</h1>
        <p>Alvast de betaalmethode toevoegen?</p>
        <form>
          <select name="paymentmethod" ref="paymentmethod" onChange={e => this.onChange(e)} value={this.state.value}>
            <option value="not specified">geen betaalwijze</option>
            <option value="IDEAL">IDEAL</option>
            <option value="Achteraf">Achteraf betalen</option>
            <option value="Creditcard">Creditcard</option>
            <option value="Paypal">Paypal</option>
          </select>
        </form>
      </div>
    )
  }

  render() {
    const { activeStep } = this.state;
    return (

      <section className="section-container">

      
        {/* to not show the stepper at the beginning */}
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

        <PageTitle title={'Registreren'}center={true}></PageTitle>


        {activeStep === this.getSteps().length ?
          (
            <div>
              <PageTitle title={'Done!'}center={true}></PageTitle>
            {/* <div id="getStepsDone">{this.getStepContent(0)}</div>
            <div id="getStepsDone">{this.getStepContent(1)}</div>
            <div id="getStepsDone">{this.getStepContent(2)}</div> */}
            </div>
          )
          :
          <div>
            {/* show case content */}
            {this.getStepContent(activeStep)}

            <div id="buttonsBackNext">
              {/* show buttons */}
              <MuiThemeProvider theme={theme}>

                <Button
                  id="button"
                  className="login-button"
                  variant="outlined"
                  type="primary"
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                >
                  Terug
                  </Button>

                {activeStep !== 2 ?
                  <ApolloConsumer>

                    {client => (
                      <Button
                        id="button"
                        className="login-button"
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          const { data } = await client.query({
                            query: CHECK_USER,
                            variables: { mail: this.state.mail }
                          });
                          data.checkUser ? this.QueryExecutedSuccessfully() : this.QueryExecutedWrong()
                        }}
                      >
                        Next
                        </Button>
                    )}
                  </ApolloConsumer>
                  :
                  <Mutation mutation={SIGNUP}>
                    {(signup) => (
                      <Button
                        id="button"
                        className="login-button"
                        variant="contained"
                        type="primary"
                        color="primary"
                        onClick={
                          e => {

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
                                postalcode: this.state.postalcode,
                                paymentmethod: this.state.paymentmethod
                              }
                            });
                            this.handleNext()
                          }
                        }
                      >
                        Opslaan
                      </Button>
                    )}
                  </Mutation>

                }

              </MuiThemeProvider>
            </div>

          </div>
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
          message={this.showSnackBarMessage()}
        />

      </section>
    )//end of return
  }//end of render


}//end of class Registreren

export default Registreren;