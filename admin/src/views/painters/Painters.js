import React, { Component } from 'react';
import './Painters.css';

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

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

const PAINTERS = gql`
  query collectionPainters{
    painters{
      id
      name
      city
      dateofbirth
      dateofdeath
      occupation
      nationality
    }
  }
`;

const ADD_PAINTER = gql`
  query collectionPainters{
    painters{
      id
      name
      city
      dateofbirth
      dateofdeath
      occupation
      nationality
    }
  }
`;

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
  return ['Vul informatie in', 'Review schilder'];
}

function getStepContent(stepIndex, state, handleChange) {
  switch (stepIndex) {
    case 0:
      return (

        <Grid container spacing={24}>
          <Grid item xs={12}>
            <FormControl fullWidth error={state.questionError}>
              <InputLabel htmlFor="add-question">Vraag</InputLabel>
              <Input id="add-question" multiline value={state.question} onChange={handleChange('question')} />
              <FormHelperText id="add-question-error-text">{state.questionErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={state.answerError}>
              <InputLabel htmlFor="add-answer">Antwoord</InputLabel>
              <Input id="add-answer" multiline value={state.answer} onChange={handleChange('answer')} />
              <FormHelperText id="add-answer-error-text">{state.answerErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      )
    case 1:
      return (
        <Grid>
          <Grid container spacing={24}>
            <Grid item xs={12} className="add-painting-review-container">
              <span>Vraag</span>
              <span>{state.question}</span>
            </Grid>
            <Grid item xs={12} className="add-painting-review-container">
              <span>Antwoord</span>
              <span>{state.answer}</span>
            </Grid>
          </Grid>
        </Grid>
      )
    default:
      return 'Uknown stepIndex';
  }
}

class Painters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      dialogAddPainter: false,
      title: '',
      titleError: false,
      titleErrorMsg: '',
      releaseDate: '',
      releaseDateError: false,
      releaseDateErrorMsg: '',
      period: '',
      periodError: false,
      periodErrorMsg: '',
      description: '',
      descriptionError: false,
      descriptionErrorMsg: '',
      physicalMedium: '',
      physicalMediumError: false,
      physicalMediumErrorMsg: '',
      amountOfMedium: 1,
      src: '',
      srcError: false,
      srcErrorMsg: '',
      bigsrc: '',
      bigsrcError: false,
      bigsrcErrorMsg: '',
      plaqueDescriptionDutch: '',
      plaqueDescriptionDutchError: false,
      plaqueDescriptionDutchErrorMsg: '',
      principalMakersProductionPlaces: '',
      principalMakersProductionPlacesError: false,
      principalMakersProductionPlacesErrorMsg: '',
      width: '',
      widthError: false,
      widthErrorMsg: '',
      height: '',
      heightError: false,
      heightErrorMsg: '',
      principalMaker: '',
      principalMakerError: false,
      principalMakerErrorMsg: '',
      price: 0,
    }
  }

  // Handle input change
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  // Handle dialog whnen opening
  handleClickOpen = () => {
    this.setState({
      dialogAddPainter: true
    });
  };

  // Handle next button for stepper and check if fields are empty before continuing
  handleNext = () => {
    this.setState(state => ({ activeStep: state.activeStep + 1, }));
    if (!this.state.activeStep === 0) {
      let next = true
      let items = [ ['question', this.state.question],
                    ['answer', this.state.answer]]

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
  };

  // Handle dialog when closing
  handleClose = () => {
    this.setState({ dialogAddPainter: false });
  };

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
            Schilder toevoegen
          </Button>
        </div>
        <Query
          query={PAINTERS}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading... :)</p>;
            if (error) return <p>Error :(</p>;

            return (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Naam</TableCell>
                      <TableCell>Stad</TableCell>
                      <TableCell>Geboortedatum</TableCell>
                      <TableCell>Datum van overlijden</TableCell>
                      <TableCell>Beroep</TableCell>
                      <TableCell>Nationaliteit</TableCell>
                      {/* <TableCell>Beschrijving</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.painters.map(row => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell>
                            {row.city}
                          </TableCell>
                          <TableCell>
                            {row.dateofbirth}
                          </TableCell>
                          <TableCell>
                            {row.dateofdeath}
                          </TableCell>
                          <TableCell>
                            {row.occupation}
                          </TableCell>
                          <TableCell>
                            {row.nationality}
                          </TableCell>
                          {/* find a way to wrap the description text */}
                          {/* <TableCell >
                            {row.description}
                          </TableCell> */}
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
          open={this.state.dialogAddPainter}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
          // scroll='scroll'
        >
          <DialogTitle id="form-dialog-title">Schilderij toevoegen</DialogTitle>
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
                      <div>{getStepContent(activeStep, this.state, this.handleChange, this.handeImage)}</div>
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
                mutation={ADD_PAINTER}
                onCompleted={(data) => {
                  console.log(`Query complete: ${data.addProduct}`)
                  this.handleClose()
                  this.setState({
                  })
                  this.props.handleSnackbarOpen('ADD_PAINTER_SUCCESS')
                }}
                onError={(err) => {
                  console.log(`Query failed: ${err}`)
                  this.props.handleSnackbarOpen('ADD_PAINTER_ERROR')
                }}
              >
                {(addPainting, { data }) => (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={e => {
                        e.preventDefault()

                        let vars = {
                        }

                        console.log(vars)

                        addPainting({ variables: vars })
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

export default Painters;