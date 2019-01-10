import React, { Component } from 'react';
import {
    Redirect
} from 'react-router-dom';
import Currency from 'react-currency-formatter';
import './Order.css'

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// Components
import PageTitle from '../../components/pageLink/PageLink'
import CartList from './../../components/cartlist/CartList'

// Apollo
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from 'react-adopt'


import { OrderQueryComposer } from '../../components/orderQueryComposer/orderQueryComposer'

const Composed = adopt({
  container: <OrderQueryComposer />
})

const styles = theme => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  typography: {
    useNextVariants: true,
  },
});

const theme = new createMuiTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
    secondary: {
      main: '#000000'
    }
  }
});


function getSteps() {
  return ['Koop- en huurlijst', 'Gegevens', 'Betaalwijze', 'Overzicht', 'Betaald'];
}
class Order extends Component {
  constructor(props){
    super(props);
    this.state = {
      buttonDisabled: true,
      cart: this.props.cart.items,
      order: this.props.order.items,
      rental: this.props.rental.items,
      activeStep: this.setActiveStep(),
      id: this.props.user.id,
      email: this.props.user.email,
      emailError: false,
      emailHelperText: '',
      aanhef: this.props.user.aanhef,
      naam: this.props.user.name,
      achternaam: this.props.user.surname,
      straat: this.props.user.address,
      huisnummer: this.props.user.housenumber,
      postcode: this.props.user.postalcode,
      stad: this.props.user.city,
      betaalwijze: this.props.user.paymentmethod,
      redirect: false
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });

    if (this.state.aanhef.length &&
        this.state.naam.length &&
        this.state.achternaam.length &&
        this.state.email.length &&
        this.state.straat.length &&
        this.state.huisnummer.length &&
        this.state.postcode.length &&
        this.state.stad.length) {
      this.setState({
        buttonDisabled: false
      })
    } else {
      this.setState({
        buttonDisabled: true
      })
    }

  };

  setActiveStep = () => {
    if (this.props.loggedIn) {
      return 3
    } else {
      return 1
    }
  }

  componentDidMount = () => {
    if (this.props.loggedIn) {
      this.setState({
        buttonDisabled: false
      })
    }
  }

  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="stepper-content-container">
            <p className="cart-type-title">Bestellijst</p>
            {this.props.order.items.length ? (
              <CartList
                list={this.props.order}
                closeModal={this.props.closeModal}
                />
            ) : (
              <p className="cart-no-items">Je hebt niks in je bestelllijst!</p>
            )}
            <p className="cart-type-title">Huurlijst</p>
            {this.props.rental.items.length ? (
              <CartList
                list={this.props.rental}
                closeModal={this.props.closeModal}
                />
            ) : (
              <p className="cart-no-items">Je hebt niks in je huurlijst!</p>
            )}
            <div className="cart-total-container">
              <div>Totaal:</div>
              <div className="cart-shipping-price">
                <Currency
                  quantity={this.props.order.total + this.props.rental.total}
                  symbol="€ "
                  decimal=","
                  group="."
                />
              </div>
            </div>
          </div>
        );
      case 1:
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
                      onChange={this.handleChange('aanhef')}
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
                  value={this.state.naam}
                  onChange={this.handleChange('naam')}
                  onBlur={this.handleChange ('naam')}
                />
                <div className="order-input-divider" />
                <TextField
                  id="order-input-achternaam"
                  type="text"
                  name="achternaam"
                  placeholder="Achternaam"
                  value={this.state.achternaam}
                  onChange={this.handleChange('achternaam')}
                  onBlur={this.handleChange ('achternaam')}
                />
              </div>
              <div className="order-form-details-row-input">
                <FormControl error={this.state.emailError}>
                  <Input
                    id="order-input-email"
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                    onBlur={this.handleChange ('email')}
                    inputProps={{
                      'aria-label': 'Email'
                    }} />
                  <FormHelperText id="component-error-text">{ this.state.emailHelperText }</FormHelperText>
                </FormControl>
              </div>
              <div className="order-form-details-row-input">
                <TextField
                  id="order-input-straat"
                  type="text"
                  name="straat"
                  placeholder="Straat"
                  value={this.state.straat}
                  onChange={this.handleChange('straat')}
                  onBlur={this.handleChange ('straat')}
                />
                <div className="order-input-divider" />
                <TextField
                  id="order-input-huisnummer"
                  type="text"
                  name="Huisnummer"
                  placeholder="Huisnummer"
                  value={this.state.huisnummer}
                  onChange={this.handleChange('huisnummer')}
                  onBlur={this.handleChange ('huisnummer')}
                />
              </div>
              <div className="order-form-details-row-input">
                <TextField
                  id="order-input-postcode"
                  type="text"
                  name="Postcode"
                  placeholder="Postcode"
                  value={this.state.postcode}
                  onChange={this.handleChange('postcode')}
                  onBlur={this.handleChange ('postcode')}
                />
              </div>
              <div className="order-form-details-row-input">
                <TextField
                  id="order-input-stad"
                  type="text"
                  name="Stad"
                  placeholder="Stad"
                  value={this.state.stad}
                  onChange={this.handleChange('stad')}
                  onBlur={this.handleChange ('stad')}
                />
              </div>
            </div>
          </form>
        </div>
      );
      case 2:
      return (
        <div className="stepper-content-container">
          <form className="order-form-details">
            <div className="order-form-details-column" id="order-form-details-column-lables">
              <div className="order-form-details-row-label">
                <p>Betaalwijze</p>
              </div>
            </div>
            <div className="order-form-details-column">
              <div className="order-form-details-row-input">
                <FormControl>
                  <Select
                    color="primary"
                    displayEmpty
                    value={this.state.betaalwijze}
                    onChange={this.handleChange('betaalwijze')}
                  >
                    <MenuItem value="" disabled>
                      Betaalwijze
                    </MenuItem>
                    <MenuItem value={'iDeal'}>iDeal</MenuItem>
                    <MenuItem value={'Creditcard'}>Creditcard</MenuItem>
                    <MenuItem value={'Paypal'}>Paypal</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </form>
        </div>
      );
      case 3:
      return (
        <div className="stepper-content-container">
          <div className="order-form-details">
            <div className="order-form-details-column">
              {/* Gegevens user */}
              <span className="order-ov-span">Gegevens</span>
              <div className="order-ov-details">
                {this.state.aanhef}&nbsp;
                {this.state.naam}&nbsp;
                {this.state.achternaam}
              </div>
              <div className="order-ov-details">
                {this.state.straat}&nbsp;
                {this.state.huisnummer}
              </div>
              <div className="order-ov-details">
                {this.state.postcode}&nbsp;
                {this.state.stad}
              </div>
            </div>
            <div className="order-form-details-column">
              {/* Betaalwijze */}
              <span className="order-ov-span">Betaalwijze</span>
              <div className="order-ov-details">
                {this.state.betaalwijze}
              </div>
            </div>
          </div>
          {this.state.order.length ? (
            <p className="order-ov-title">Kooplijst</p>
          ) : null}
          {this.state.order.map((item) => (
            <div key={item.id}>
              <div className="order-item-wrapper">
                <div className="order-item-details">
                  <p className="order-item-title">
                    { item.title }
                  </p>
                </div>
                <div className="order-item-price">
                  <p>
                    <Currency
                      quantity={item.price * item.amount}
                      symbol="€ "
                      decimal=","
                      group="."
                    />
                  </p>
                </div>
              </div>
            </div>
          ))}
          {this.state.order.length ? (
            <div className="order-ov-divider"></div>
          ) : null}
          {this.state.rental.length ? (
            <p className="order-ov-title">Huurlijst</p>
          ) : null}
          {this.state.rental.map((item) => (
            <div key={item.id}>
              <div className="order-item-wrapper">
                <div className="order-item-details">
                  <p className="order-item-title">
                    { item.title }
                  </p>
                </div>
                <div className="order-item-price">
                  <p>
                    <Currency
                      quantity={item.priceWithDays / 20}
                      symbol="€ "
                      decimal=","
                      group="."
                    />
                  </p>
                </div>
              </div>
              <div className="cart-item-divider"></div>
            </div>
          ))}
        </div>
      );
      case 4:
      return (
        <div className="stepper-content-container">
          <h3 className="order-payment-successfull">Betaling successvol!</h3>
        </div>
      );
      default:
        return 'Uknown stepIndex';
    }
  }

  handleNext = () => {
    if (this.state.activeStep + 1 === 0) {
      this.setState(state => ({
        buttonDisabled: false
      }));
    } else if (this.state.activeStep + 1 === 1) {
      if (this.state.aanhef.length &&
        this.state.naam.length &&
        this.state.achternaam.length &&
        this.state.email.length &&
        this.state.straat.length &&
        this.state.huisnummer.length &&
        this.state.postcode.length &&
        this.state.stad.length) {
        this.setState({
          buttonDisabled: false
        })
      } else {
        this.setState({
          buttonDisabled: true
        })
      }
    } else if (this.state.activeStep + 1 === 2) {
      if (this.state.betaalwijze.length) {
        this.setState({
          buttonDisabled: false
        })
      } else {
        this.setState({
          buttonDisabled: true
        })
      }
    }

    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    if (this.state.activeStep - 1 === 0) {
      this.setState(state => ({
        // buttonDisabled: false
        redirect: true
      }));
    }

    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
      <section className="section-container">
      {this.state.redirect ? (
        <Redirect to="/mijnlijst" push />
      ) : null}
        <PageTitle title="Bestellen"/>
        <div className="stepper-container">
          <Stepper activeStep={activeStep} alternativeLabel className="stepper">
            {steps.map(label => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>
        <div>
          {this.state.activeStep === steps.length ? (
            <div>
              {/* Betaalt! component */}
            </div>
          ) : (
            <div>
              <div className={classes.instructions}>{this.getStepContent(activeStep)}</div>
              <div className="order-action-container">
                <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
                  {activeStep === 0 | activeStep === 4 ? null : (
                    <Button
                      variant="outlined"
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.backButton}
                      >
                      Terug
                    </Button>
                  )}
                  {activeStep === 3 | activeStep === 4 ? null : (
                    <MuiThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color='secondary'
                        onClick={this.handleNext}
                        disabled={this.state.buttonDisabled}>
                          Volgende
                      </Button>
                    </MuiThemeProvider>
                  )}
                  {activeStep === 3 ? (
                    <MuiThemeProvider theme={theme}>
                    <Composed>
                      {({ container: { insertOrder, insertRental } }) => {
                        const insertOrderQ = async () => {
                          let items = []
                          let total = 0
                          for (let i = 0; i < this.state.order.length; i++) {
                            items.push({"foreignkey": parseInt(this.state.order[i].id)})
                            total = total + this.state.order[i].price
                          }
                          await insertOrder.mutation({
                            variables: {
                              buyerId: parseInt(this.state.id),
                              items: items,
                              date: new Date(),
                              total: total
                            }
                          })
                          let i = []
                          this.props.updateOrder(i)
                        }

                        const insertRentalQ = async () => {
                          let items = []
                          let total = 0
                          for (let i = 0; i < this.state.rental.length; i++) {
                            items.push(
                              {
                                "foreignkey": parseInt(this.state.rental[i].id),
                                "startDate": this.state.rental[i].startDate,
                                "stopDate": this.state.rental[i].endDate
                              }
                            )
                            total = total + this.state.rental[i].price
                          }
                          await insertRental.mutation({
                            variables: {
                              buyerId: parseInt(this.state.id),
                              items: items,
                              date: new Date(),
                              total: total
                            }
                          })
                          let i = []
                          this.props.updateRental(i)
                        }

                        return (
                          <Button
                            variant="contained"
                            color='primary'
                            onClick={() => {
                              insertOrderQ()
                              insertRentalQ()
                              this.setState({
                                activeStep: this.state.activeStep + 1
                              })
                            }}
                          >
                            Betalen
                          </Button>
                        )

                      }}
                    </Composed>
                    </MuiThemeProvider>
                  ) : null}
                  {/* {activeStep === 4 ? (
                    <Button
                      variant="contained"
                      color='primary'
                    >
                      Verder winkelen
                    </Button>
                  ) : null} */}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default withStyles(styles)(Order);
