import React, { Component } from 'react';
import './Users.css';

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import Tooltip from '@material-ui/core/Tooltip';

// Apollo
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

//Edit icon
import Edit from '../../icons/Edit.svg';

//Linking to userdetail page
import {Link} from 'react-router-dom';

const ALL_USERS = gql`
  query AllUsers{
    selectAllUsers{
      id
      name
      surname
      mail
      adres
    }
  }
`

const ADD_USER = gql`
  mutation AddUser(
    $name: String!
    $surname: String!
    $mail: String!
    $password: String!
    $aanhef: String!
    $adres: String
    $city: String
    $postalcode: String
    $housenumber: String
    $paymentmethod: String){
    addUser(
      name: $name
      surname: $surname
      mail: $mail
      password: $password
      aanhef: $aanhef
      adres: $adres
      city: $city
      postalcode: $postalcode
      housenumber: $housenumber
      paymentmethod: $paymentmethod)
  }
`

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#FFFFFF'
    },
    type: 'dark'
  },
  typography: {
    useNextVariants: true,
  }
});

function getSteps() {
  return ['Vul informatie in', 'Review gebruiker'];
}

function getStepContent(stepIndex, state, handleChange) {
  switch (stepIndex) {
    case 0:
      return (
        <Grid container spacing={24}>
          <Grid item xs={12} sm={2}>
            <FormControl component="fieldset" className="order-form-details-radio">
              <RadioGroup
                className="order-form-details-radio"
                aria-label="Aanhef"
                name="aanhef"
                value={state.aanhef}
                onChange={handleChange('aanhef')}
              >
                <FormControlLabel value="Dhr." control={<Radio color="primary" />} label="Dhr." />
                <FormControlLabel value="Mevr." control={<Radio color="primary" />} label="Mevr." />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth error={state.nameError}>
              <InputLabel htmlFor="add-name">Naam</InputLabel>
              <Input id="add-name" value={state.name} onChange={handleChange('name')} />
              <FormHelperText id="add-name-error-text">{state.nameErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth error={state.surnameError}>
              <InputLabel htmlFor="add-surname">Achternaam</InputLabel>
              <Input id="add-surname" value={state.surname} onChange={handleChange('surname')} />
              <FormHelperText id="add-surname-error-text">{state.surnameErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.mailError}>
              <InputLabel htmlFor="add-mail">E-mail</InputLabel>
              <Input id="add-mail" type="mail" value={state.mail} onChange={handleChange('mail')} />
              <FormHelperText id="add-mail-error-text">{state.mailErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.passwordError}>
              <InputLabel htmlFor="add-password">Wachtwoord</InputLabel>
              <Input id="add-password" value={state.password} onChange={handleChange('password')} />
              <FormHelperText id="add-password-error-text">{state.passwordErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.adresError}>
              <InputLabel htmlFor="add-adres">Adres</InputLabel>
              <Input id="add-adres" value={state.adres} onChange={handleChange('adres')} />
              <FormHelperText id="add-adres-error-text">{state.adresErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.housenumberError}>
              <InputLabel htmlFor="add-housenumber">Huisnummer</InputLabel>
              <Input id="add-housenumber" value={state.housenumber} onChange={handleChange('housenumber')} />
              <FormHelperText id="add-housenumber-error-text">{state.housenumberErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.postalcodeError}>
              <InputLabel htmlFor="add-postalcode">Postcode</InputLabel>
              <Input id="add-postalcode" value={state.postalcode} onChange={handleChange('postalcode')} />
              <FormHelperText id="add-postalcode-error-text">{state.postalcodeErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.cityError}>
              <InputLabel htmlFor="add-city">Stad</InputLabel>
              <Input id="add-city" value={state.city} onChange={handleChange('city')} />
              <FormHelperText id="add-city-error-text">{state.cityErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.paymentmethodError}>
              <InputLabel htmlFor="add-paymentmethod">Betaalwijze</InputLabel>
              <Input id="add-paymentmethod" value={state.paymentmethod} onChange={handleChange('paymentmethod')} />
              <FormHelperText id="add-paymentmethod-error-text">{state.paymentmethodErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.admin}
                    onChange={handleChange('admin')}
                    value="admin"
                  />
                }
                label="Admin"
              />
            </FormGroup>
          </Grid>
        </Grid>
      )
    case 1:
      return (
        <Grid>
          <Grid container spacing={24}>
            <Grid item xs={12} className="add-user-review-container">
              <span className="add-user-name-surname">{state.aanhef} {state.name} {state.surname}</span>
              <span className="add-user-role">{state.admin ? 'Admin' : 'Gebruiker'}</span>
            </Grid>
            <Grid item xs={3} className="add-user-review-container">
              <span className="add-user-column-left">Mail</span>
            </Grid>
            <Grid item xs={7} className="add-user-review-container">
              <span className="add-user-column-right">{state.mail}</span>
            </Grid>
            <Grid item xs={12} className="add-user-review-container-divider" />
            <Grid item xs={3} className="add-user-review-container">
              <span className="add-user-column-left">Wachtwoord</span>
            </Grid>
            <Grid item xs={7} className="add-user-review-container">
              <span className="add-user-column-right">{state.password}</span>
            </Grid>
            <Grid item xs={12} className="add-user-review-container-divider" />
            <Grid item xs={3} className="add-user-review-container">
              <span className="add-user-column-left">Adres</span>
            </Grid>
            <Grid item xs={7} className="add-user-review-container">
              <span className="add-user-column-right">{state.adres} {state.housenumber}</span>
            </Grid>
            <Grid item xs={3} className="add-user-review-container"></Grid>
            <Grid item xs={7} className="add-user-review-container" style={{padding: '0 12px 12px 12px'}}>
              <span className="add-user-column-right">{state.postalcode} {state.city}</span>
            </Grid>
            <Grid item xs={12} className="add-user-review-container-divider" />
            <Grid item xs={3} className="add-user-review-container">
              <span className="add-user-column-left">Betaalwijze</span>
            </Grid>
            <Grid item xs={7} className="add-user-review-container">
              <span className="add-user-column-right">{state.paymentmethod}</span>
            </Grid>
          </Grid>
        </Grid>
      )
    default:
      return 'Uknown stepIndex';
  }
}

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      dialogAddUser: false,
      aanhef: 'Dhr.',
      name: '',
      nameError: false,
      nameErrorMsg: '',
      surname: '',
      surnameError: false,
      surnameErrorMsg: '',
      mail: '',
      mailError: false,
      mailErrorMsg: '',
      password: '',
      passwordError: false,
      passwordErrorMsg: '',
      adres: '',
      adresError: false,
      adresErrorMsg: '',
      housenumber: '',
      housenumberError: false,
      housenumberErrorMsg: '',
      postalcode: '',
      postalcodeError: false,
      postalcodeErrorMsg: '',
      city: '',
      cityError: '',
      cityErrorMsg: false,
      paymentmethod: '',
      paymentmethodError: false,
      paymentmethodErrorMsg: '',
      admin: false,
      ID: 404
    }
  }

  gotolink(id) {
    return "/gebruiker/" + id;
  }

  // Handle input change
  handleChange = name => event => {
    if (name === 'admin') {
      this.setState({
        [name]: event.target.checked,
      });
    } else {
      this.setState({
        [name]: event.target.value,
      });
    }
  };

  // Handle dialog whnen opening
  handleClickOpen = () => {
    this.setState({
      dialogAddUser: true,
      id: Math.floor((Math.random() * 10000000000000) + 1).toString()
    });
  };

  // Handle dialog when closing
  handleClose = () => {
    this.setState({ dialogAddUser: false });
  };

  // Handle next button for stepper and check if fields are empty before continuing
  handleNext = () => {
    if (this.state.activeStep === 0) {
      let next = true
      let items = [ ['name', this.state.name],
                    ['surname', this.state.surname],
                    ['mail', this.state.mail],
                    ['password', this.state.password],
                    ['adres', this.state.adres],
                    ['housenumber', this.state.housenumber],
                    ['postalcode', this.state.postalcode],
                    ['city', this.state.city],
                    ['paymentmethod', this.state.paymentmethod]]

      console.log(items)

      for (let i = 0; i < items.length; i++) {
        console.log(`item: ${items[i][0]} - value: ${items[i][1]}`)
        if (!items[i][1]) {
          next = false
          console.error(`item: ${items[i][0]} is empty`)
          let err = items[i][0] + "Error"
          let errMsg = err + "Msg"
          this.setState(state => ({
            [err]: true,
            [errMsg]: 'Dit veld is verplicht'
          }));
        } else {
          let err = items[i][0] + "Error"
          let errMsg = err + "Msg"
          this.setState(state => ({
            [err]: false,
            [errMsg]: ''
          }));
        }
      }

      if (next) {
        this.setState(state => ({ activeStep: state.activeStep + 1, }));
      }
    }
  }

  // Handle back button for stepper
  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
  };

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <section>
        <div className="section-actions">
          <h2>Acties</h2>
          <Button
            variant="contained"
            onClick={this.handleClickOpen}
          >
            Gebruiker toevoegen
          </Button>
        </div>
        <Query
          query={ALL_USERS}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading... :)</p>;
            if (error) return <p>Error :(</p>;

            return (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Voornaam</TableCell>
                      <TableCell>Achternaam</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Adres</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.selectAllUsers.map(row => {
                      return (
                        <TableRow key={row.id} hover onClick={() => {
                          console.log(`clicked on ${row.id}`)
                          this.props.history.push('/gebruiker/' + row.id)
                        }}>
                          <Tooltip title="Aanpassen" placement="right">
                            <TableCell>
                              <Link to={this.gotolink(row.id)}><img src={Edit} alt="Edit" /></Link>
                            </TableCell>
                          </Tooltip>
                          <TableCell >
                            {row.id}
                          </TableCell>
                          <TableCell>
                            {row.name}
                          </TableCell>
                          <TableCell>
                            {row.surname}
                          </TableCell>
                          <TableCell>
                            {row.mail}
                          </TableCell>
                          <TableCell>
                            {row.adres}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            )
          }}
        </Query>
        <Dialog
          open={this.state.dialogAddUser}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
        // scroll='scroll'
        >
          <DialogTitle id="form-dialog-title">Gebruiker toevoegen</DialogTitle>
          <MuiThemeProvider theme={theme}>
            <DialogContent
              className="dialog-add-painting"
            >
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(label => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <div>
                {this.state.activeStep === steps.length ? (
                  <div>
                    <div>All steps completed</div>
                    <Button onClick={this.handleReset}>Reset</Button>
                  </div>
                ) : (
                    <div>
                      <div>{getStepContent(activeStep, this.state, this.handleChange)}</div>
                    </div>
                  )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>
                Annuleren
              </Button>
              {activeStep === 1 ? (
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                  >
                    Terug
                  </Button>
                </div>
              ) : null}
              {activeStep === 1 ? (
                <Mutation
                  mutation={ADD_USER}
                  onCompleted={(data) => {
                    console.log(`Query complete: ${data.addProduct}`)
                    this.handleClose()
                    this.setState({

                    })
                    this.props.handleSnackbarOpen('ADD_USER_SUCCESS')
                  }}
                  onError={(err) => {
                    console.log(`Query failed: ${err}`)
                    this.props.handleSnackbarOpen('ADD_USER_ERROR')
                  }}
                >
                  {(addUser, { data }) => (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={e => {
                          e.preventDefault()
                        }}>
                        Opslaan
                    </Button>
                    </div>
                  )}
                </Mutation>
              ) : (
                  <Button variant="contained" color="primary" onClick={this.handleNext}>
                    Volgende
              </Button>)}
            </DialogActions>
          </MuiThemeProvider>
        </Dialog>
      </section>
    );
  }
}

// <img src={Edit} alt="Edit" />
// <Link to={this.gotolink(row.id)}/>

export default Users;