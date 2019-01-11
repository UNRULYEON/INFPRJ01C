import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import './Details.css'

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Components
import PageTitle from '../../components/pageLink/PageLink'

// Apollo
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const EDIT_USER = gql`
  mutation alterUserClient(
    $id: Int!,
    $name: String!
    $surname: String!
    $mail: String!
    $password: String!
    $aanhef: String!
    $adres: String!
    $city: String!
    $postalcode: String!
    $housenumber: String!
    $paymentmethod: String!){
    alterUserClient(
      id: $id
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
`;

const GET_USER_DETAILS = gql`
	query Painting($id: String!){
		paintingByID(id: $id){
      id
      id_number
			title
			releasedate
			period
			description
			physicalmedium
			amountofpaintings
      principalmaker
			bigsrc
			src
			price
      painter
      principalmakersproductionplaces
      width
      height
      amountwatched
      rented
		}
	}
`;

class Details extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      aanhef: this.props.user.aanhef,
      name: this.props.user.name,
      nameError: false,
      nameErrorMsg: '',
      surname: this.props.user.surname,
      surnameError: false,
      surnameErrorMsg: '',
      mail: this.props.user.email,
      mailError: false,
      mailErrorMsg: '',
      password: '',
      passwordError: false,
      passwordErrorMsg: '',
      adres: this.props.user.address,
      adresError: false,
      adresErrorMsg: '',
      housenumber: this.props.user.housenumber,
      housenumberError: false,
      housenumberErrorMsg: '',
      postalcode: this.props.user.postalcode,
      postalcodeError: false,
      postalcodeErrorMsg: '',
      city: this.props.user.city,
      cityError: false,
      cityErrorMsg: '',
      paymentmethod: this.props.user.paymentmethod,
      paymentmethodError: false,
      paymentmethodErrorMsg: '',
    }
  }

  setUserApp(user, isLoggedIn) {
    this.props.setUser(user, isLoggedIn)
    this.setState({
      redirect: true
    })
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

  render() {
    return (
      <section className="section-container">
      <div className="details-container-list">
        {/* <Query
          query={GET_USER_DETAILS}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading... :)</p>;
            if (error) return <p>Error :(</p>;

            return (
              <div></div>
            )
          }}
        </Query> */}
        <aside className="details-container-aside">
          <Link to={`/user/${this.props.user.name}/gegevens`} className="details-aside-link">Mijn gegevens</Link>
          <Link to={`/user/${this.props.user.name}/kooplijst`} className="details-aside-link">Mijn kooplijst</Link>
          <Link to={`/user/${this.props.user.name}/huurlijst`} className="details-aside-link">Mijn huurlijst</Link>
          <Link to={`/faq`} className="details-aside-link">FAQ</Link>
        </aside>
        <div style={{ width: '100%' }}>
          <PageTitle title="Gegevens"/>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={2}>
              <FormControl component="fieldset" className="order-form-details-radio">
                <RadioGroup
                  className="order-form-details-radio"
                  aria-label="Aanhef"
                  name="aanhef"
                  value={this.state.aanhef}
                  onChange={this.handleChange('aanhef')}
                >
                  <FormControlLabel value="Dhr." control={<Radio color="primary" />} label="Dhr." />
                  <FormControlLabel value="Mevr." control={<Radio color="primary" />} label="Mevr." />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth error={this.state.nameError}>
                <InputLabel htmlFor="add-name">Naam</InputLabel>
                <Input id="add-name" value={this.state.name} onChange={this.handleChange('name')} />
                <FormHelperText id="add-name-error-text">{this.state.nameErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth error={this.state.surnameError}>
                <InputLabel htmlFor="add-surname">Achternaam</InputLabel>
                <Input id="add-surname" value={this.state.surname} onChange={this.handleChange('surname')} />
                <FormHelperText id="add-surname-error-text">{this.state.surnameErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={this.state.mailError}>
                <InputLabel htmlFor="add-mail">E-mail</InputLabel>
                <Input id="add-mail" type="mail" value={this.state.mail} onChange={this.handleChange('mail')} />
                <FormHelperText id="add-mail-error-text">{this.state.mailErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={this.state.passwordError}>
                <InputLabel htmlFor="add-password">Wachtwoord</InputLabel>
                <Input id="add-password" value={this.state.password} onChange={this.handleChange('password')} />
                <FormHelperText id="add-password-error-text">{this.state.passwordErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={this.state.adresError}>
                <InputLabel htmlFor="add-adres">Adres</InputLabel>
                <Input id="add-adres" value={this.state.adres} onChange={this.handleChange('adres')} />
                <FormHelperText id="add-adres-error-text">{this.state.adresErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={this.state.housenumberError}>
                <InputLabel htmlFor="add-housenumber">Huisnummer</InputLabel>
                <Input id="add-housenumber" value={this.state.housenumber} onChange={this.handleChange('housenumber')} />
                <FormHelperText id="add-housenumber-error-text">{this.state.housenumberErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={this.state.postalcodeError}>
                <InputLabel htmlFor="add-postalcode">Postcode</InputLabel>
                <Input id="add-postalcode" value={this.state.postalcode} onChange={this.handleChange('postalcode')} />
                <FormHelperText id="add-postalcode-error-text">{this.state.postalcodeErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={this.state.cityError}>
                <InputLabel htmlFor="add-city">Stad</InputLabel>
                <Input id="add-city" value={this.state.city} onChange={this.handleChange('city')} />
                <FormHelperText id="add-city-error-text">{this.state.cityErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={this.state.paymentmethodError}>
                <InputLabel htmlFor="name-paymentmethod">Betaalwijze</InputLabel>
                <Select
                  value={this.state.paymentmethod}
                  onChange={this.handleChange('paymentmethod')}
                  name="Betaalwijze"
                  renderValue={value => `${value}`}
                  input={<Input id="name-paymentmethod" />}
                >
                  <MenuItem value="">
                    <em>Geen</em>
                  </MenuItem>
                  <MenuItem value="iDeal">iDeal</MenuItem>
                  <MenuItem value="Creditcard">Creditcard</MenuItem>
                  <MenuItem value="Paypal">Paypal</MenuItem>
                </Select>
                <FormHelperText>{this.state.paymentmethodErrorMsg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
            <Mutation
                  mutation={EDIT_USER}
                  onCompleted={(data) => {
                    console.log(`Query complete: ${data}`)
                    let user = {
                      id: this.props.user.id,
                      name: this.state.name,
                      surname: this.state.surname,
                      aanhef: this.state.aanhef,
                      email: this.state.mail,
                      address: this.state.adres,
                      housenumber: this.state.housenumber,
                      postalcode: this.state.postalcode,
                      city: this.state.city,
                      paymentmethod: this.state.paymentmethod,
                    }
                    console.log(`QUERY COMPLETED`)
                    console.log(user)
                    this.props.setUser(user, true)
                    this.props.handleSnackbar('EDIT_USER_SUCCESS')
                  }}
                  onError={(err) => {
                    console.log(`Query failed: ${err}`)
                    this.props.handleSnackbar('EDIT_USER_ERROR')
                  }}
                >
                  {(alterUser) => (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                          onClick={e => {
                            e.preventDefault()

                            let commitChanges = true
                            let items = [['name', this.state.name],
                            ['surname', this.state.surname],
                            ['mail', this.state.mail],
                            ['adres', this.state.adres],
                            ['housenumber', this.state.housenumber],
                            ['postalcode', this.state.postalcode],
                            ['city', this.state.city],
                            ['paymentmethod', this.state.paymentmethod]]

                            for (let i = 0; i < items.length; i++) {
                              console.log(`item: ${items[i][0]} - value: ${items[i][1]}`)
                              if (!items[i][1]) {
                                commitChanges = false
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

                            if (!(/\S+@\S+\.\S+/).test(this.state.mail)) {
                              commitChanges = false
                              this.setState(state => ({
                                mailError: true,
                                mailErrorMsg: 'Dit is geen geldig email-adres'
                              }));
                              return
                            }

                            if (commitChanges) {
                              let variables = {
                                id: this.props.user.id,
                                name: this.state.name,
                                surname: this.state.surname,
                                aanhef: this.state.aanhef,
                                mail: this.state.mail,
                                password: this.state.password,
                                adres: this.state.adres,
                                housenumber: this.state.housenumber,
                                postalcode: this.state.postalcode,
                                city: this.state.city,
                                paymentmethod: this.state.paymentmethod
                              }
                              console.log(variables)
                              alterUser({ variables: variables })
                            }
                          }}>
                          Opslaan
                        </Button>
                    </div>
                  )}
                </Mutation>
            </Grid>
          </Grid>
        </div>
      </div>
      </section>
    );
  }
}

export default Details;
