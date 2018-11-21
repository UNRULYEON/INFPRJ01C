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
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
      paymentmethod: 'Geen betaalwijze',

      emailFilledInCorrect: false,
      emailIsEmpty: true,
      passwordIsEmpty: true,
      passwordRepeatIsEmpty: true,
      nameIsEmpty: true,
      surnameIsEmpty: true,
      adresIsEmpty: true,
      housenumberIsEmpty: true,
      postalcodeIsEmpty: true,
      cityIsEmpty: true,

      // these witholds the error of the inputs initially
      baseInputEmail: true,
      baseInputPassword: true,
      baseInputPasswordRepeat: true,
      baseInputName: true,
      baseInputSurname: true,
      baseInputAdres: true,
      baseInputHousenumber: true,
      baseInputPostalcode: true,
      baseInputCity: true,


      //snackbar to show the error pop-up
      snackbar: false,

      queryResult: false,

    }//end of state definitions
  }//end of constructor

  //methods
  //show the text in the stepper
  getSteps() {
    return ['Email en wachtwoord', 'Naam en adres', 'Betaalwijze toevoegen', 'Overzicht'];
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
      case 3:
        return this.showOverzicht();
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
      if (this.state.nameIsEmpty === false && this.state.surnameIsEmpty === false && this.state.adresIsEmpty === false && this.state.housenumberIsEmpty === false && this.state.postalcodeIsEmpty === false && this.state.cityIsEmpty === false) {
        this.setState(state => ({
          activeStep: state.activeStep + 1,
          snackbar: false,
        }))
      }
      else {
        this.handleSnackbarClick()
      }
    }
    else if (this.state.activeStep >= 2) {
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
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value.trim(),//calling trim makes it so email input doesnt register the spacebar
    })
    this.getHandleChange(name)
  }

  getHandleChange(state) {
    switch (state) {
      case 'mail':
        return this.checkMailInput();
      case 'password':
        return this.checkPasswordInput();
      case 'passwordRepeat':
        return this.checkPasswordRepeatInput();
      case 'name':
        return this.checkNameInput();
      case 'surname':
        return this.checkSurnameInput();
      case 'adres':
        return this.checkAdresInput();
      case 'housenumber':
        return this.checkHousenumberInput();
      case 'postalcode':
        return this.checkPostalcodeInput();
      case 'city':
        return this.checkCityInput();
      default:
        return 'bad handle change';
    }
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



  checkAdresInput() {
    this.setState({
      baseInputAdres: false,
    })
    if (this.state.adres === '') {
      this.setState({
        adresIsEmpty: true,
      })
    }
    else {
      this.setState({
        adresIsEmpty: false,
      })
    }
  }

  handleAdresError() {
    if (this.state.adresIsEmpty === true) {
      if (this.state.baseInputAdres === true) {
        return false
      }
      return true
    }
  }



  checkHousenumberInput() {
    this.setState({
      baseInputHousenumber: false,
    })
    if (this.state.housenumber === '') {
      this.setState({
        housenumberIsEmpty: true,
      })
    }
    else {
      this.setState({
        housenumberIsEmpty: false,
      })
    }
  }

  handleHousenumberError() {
    if (this.state.housenumberIsEmpty === true) {
      if (this.state.baseInputHousenumber === true) {
        return false
      }
      return true
    }
  }



  checkPostalcodeInput() {
    this.setState({
      baseInputPostalcode: false,
    })
    if (this.state.postalcode === '') {
      this.setState({
        postalcodeIsEmpty: true,
      })
    }
    else {
      this.setState({
        postalcodeIsEmpty: false,
      })
    }
  }

  handlePostalcodeError() {
    if (this.state.postalcodeIsEmpty === true) {
      if (this.state.baseInputPostalcode === true) {
        return false
      }
      return true
    }
  }



  checkCityInput() {
    this.setState({
      baseInputCity: false,
    })
    if (this.state.city === '') {
      this.setState({
        cityIsEmpty: true,
      })
    }
    else {
      this.setState({
        cityIsEmpty: false,
      })
    }
  }

  handleCityError() {
    if (this.state.cityIsEmpty === true) {
      if (this.state.baseInputCity === true) {
        return false
      }
      return true
    }
  }

  toggleHelperText(state) {
    switch (state) {
      case 'mail':
        if (this.state.mail === '') {
          return 'Email is leeg'
        } else if (!this.state.emailFilledInCorrect) {
          return 'Email is fout'
        } break;

      case 'name':
        if (this.state.name === '') {
          return 'Naam is verplicht'
        } break;
      case 'surname':
        if (this.state.surname === '') {
          return 'Achternaam is verplicht'
        } break;
      case 'adres':
        if (this.state.adres === '') {
          return 'Adres is verplicht'
        } break;
      case 'housenumber':
        if (this.state.housenumber === '') {
          return 'Huisnummer is verplicht'
        } break;
      case 'postalcode':
        if (this.state.postalcode === '') {
          return 'Postcode is verplicht'
        } break;
      case 'city':
        if (this.state.city === '') {
          return 'Stad is verplicht'
        } break;
      default:
        return 'how did it get here (default of togglehelpertext';
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
      return (<span id="message-id">Niet alles is ingevuld.<br /> Vul alles in en probeer het opnieuw.</span>)
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
              onChange={this.handleChange('mail')}
              onBlur={this.handleChange('mail')}
              value={this.state.mail}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText('mail')}
            </FormHelperText>
          </FormControl>
          <br></br>

          <FormControl className="login-input">
            <InputLabel htmlFor="adornment-password">Wachtwoord</InputLabel>
            <Input
              error={this.handlePasswordError()}
              name="password"
              type={this.state.showPassword ? 'text' : 'password'}
              onChange={this.handleChange('password')}
              onBlur={this.handleChange('password')}
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
              onChange={this.handleChange('passwordRepeat')}
              onBlur={this.handleChange('passwordRepeat')}
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
              onChange={this.handleChange('name')}
              onBlur={this.handleChange('name')}
              value={this.state.name}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText('name')}
            </FormHelperText>
          </FormControl>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Achternaam</InputLabel>
            <Input
              error={this.handleSurnameError()}
              name="surname"
              onChange={this.handleChange('surname')}
              onBlur={this.handleChange('surname')}
              value={this.state.surname}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText('surname')}
            </FormHelperText>
          </FormControl>
        </div>

        <div id="lijn"></div>

        <div id="adres">
          <h1 id="adresHeader">Adres</h1>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Straat</InputLabel>
            <Input
              error={this.handleAdresError()}
              name="adres"
              onChange={this.handleChange('adres')}
              onBlur={this.handleChange('adres')}
              value={this.state.adres}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText('adres')}
            </FormHelperText>
          </FormControl>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Huisnummer</InputLabel>
            <Input
              error={this.handleHousenumberError()}
              name="housenumber"
              onChange={this.handleChange('housenumber')}
              onBlur={this.handleChange('housenumber')}
              value={this.state.housenumber}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText('housenumber')}
            </FormHelperText>
          </FormControl>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Postcode</InputLabel>
            <Input
              error={this.handlePostalcodeError()}
              name="postalcode"
              onChange={this.handleChange('postalcode')}
              onBlur={this.handleChange('postalcode')}
              value={this.state.postalcode}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText('postalcode')}
            </FormHelperText>
          </FormControl>

          <FormControl aria-describedby="component-error-text">
            <InputLabel>Stad</InputLabel>
            <Input
              error={this.handleCityError()}
              name="city"
              onChange={this.handleChange('city')}
              onBlur={this.handleChange('city')}
              value={this.state.city}
            />
            <FormHelperText id="component-error-text">
              {this.toggleHelperText('city')}
            </FormHelperText>
          </FormControl>

        </div>

      </div>
    )
  }

  //case 2 showBetaalInfo
  showBetaalInfo() {
    return (
      <div id="showBetaalInfo">
        <p>Alvast de betaalmethode toevoegen?</p>
        <form>
          <select name="paymentmethod" ref="paymentmethod" onChange={e => this.onChange(e)} value={this.state.value}>
            <option value="Geen betaalwijze">geen betaalwijze</option>
            <option value="IDEAL">IDEAL</option>
            <option value="Achteraf">Achteraf betalen</option>
            <option value="Creditcard">Creditcard</option>
            <option value="Paypal">Paypal</option>
          </select>
        </form>
      </div>
    )
  }

  showOverzicht() {
    return (
      <div className="stepper-content-container">
        <form className="order-form-details">
          <div className="order-form-details-column" id="order-form-details-column-lables">
            <div className="order-form-details-row-label">
              <p>Aanhef</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Naam</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Email</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Straat en huisnummer</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Postcode</p>
            </div>
            <div className="order-form-details-row-label">
              <p>Stad</p>
            </div>
          </div>
          <div className="order-form-details-column">
            <div className="order-form-details-row-input">
              <div className="order-form-details-radio">
                <FormControl component="fieldset" className="order-form-details-radio">
                  <RadioGroup
                    className="order-form-details-radio"
                    aria-label="Aanhef"
                    name="aanhef"
                    value={this.state.aanhef}
                    readOnly={true}
                  >
                    <FormControlLabel value="Dhr." control={<Radio color="primary" />} label="Dhr." />
                    <FormControlLabel value="Mevr." control={<Radio color="primary" />} label="Mevr." />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="order-form-details-row-input">
              <TextField
                id="order-input-name"
                type="text"
                name="naam"
                placeholder="Naam"
                value={this.state.name}
                readOnly={true}
              />
              <div className="order-input-divider" />
              <TextField
                id="order-input-achternaam"
                type="text"
                name="achternaam"
                placeholder="Achternaam"
                value={this.state.surname}
                readOnly={true}
              />
            </div>
            <div className="order-form-details-row-input">
              <TextField
                id="order-input-email"
                label="Email"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                value={this.state.mail}
                readOnly={true} />
            </div>
            <div className="order-form-details-row-input">
              <TextField
                id="order-input-straat"
                type="text"
                name="straat"
                placeholder="Straat"
                value={this.state.adres}
                readOnly={true}
              />
              <div className="order-input-divider" />
              <TextField
                id="order-input-huisnummer"
                type="text"
                name="Huisnummer"
                placeholder="Huisnummer"
                value={this.state.housenumber}
                readOnly={true}
              />
            </div>
            <div className="order-form-details-row-input">
              <TextField
                id="order-input-postcode"
                type="text"
                name="Postcode"
                placeholder="Postcode"
                value={this.state.postalcode}
                readOnly={true}
              />
            </div>
            <div className="order-form-details-row-input">
              <TextField
                id="order-input-stad"
                type="text"
                name="Stad"
                placeholder="Stad"
                value={this.state.city}
                readOnly={true}
              />
            </div>
          </div>
        </form>
      </div>
    );
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

        {
          this.state.activeStep === 0 | this.state.activeStep === 1 ?
            <PageTitle title={'Registreren'} center={true}></PageTitle> :
            this.state.activeStep === 2 ?
              <PageTitle title={'Betaalwijze toevoegen?'} center={true}></PageTitle> :
              this.state.activeStep === 3 ?
                <PageTitle title={'Overzicht registratie formulier'} center={true}></PageTitle> :
                null
        }



        {activeStep === this.getSteps().length ?
          (
            <div>
              <PageTitle title={'Klaar!'} center={true}></PageTitle>
              <p id="showBetaalInfo">U kunt nu inloggen met: {this.state.mail}</p>
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

                {activeStep !== 3 ?
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