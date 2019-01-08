import React, { Component } from 'react';
import './FAQ.css';

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

// Apollo
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

// React Grid
import {
  PagingState,
  CustomPaging,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid as GridR,
  Table,
  TableHeaderRow,
  PagingPanel,
  ColumnChooser,
  TableColumnVisibility,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';

const FAQS = gql`
  query FAQ{
    faq{
      id
      title
      body
    }
  }
`;

const GET_FAQ_DETAILS = gql`
  query FAQ($id: Int!){
    faqId(id: $id){
      id
      title
      body
    }
  }
`;

const ADD_FAQ = gql`
mutation FAQ(
  $question: String!, 
  $answer: String!){
  faqCreate(
    question: $question,
    answer: $answer
  )
}
`;

const EDIT_FAQ = gql`
mutation FAQ(
  $id: Int!, 
  $question: String!, 
  $answer: String!){
  faqUpdate(
    id: $id, 
    question: $question, 
    answer: $answer)
}
`;

const DELETE_FAQ = gql`
  mutation FAQ($id: Int!){
    faqDelete(id: $id)
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

const themeDeleteButton = new createMuiTheme({
  palette: {
    primary: {
      main: '#D32F2F'
    },
    type: 'dark'
  },
  typography: {
    useNextVariants: true,
  }
});

function getSteps() {
  return ['Vul informatie in', 'Review FAQ'];
}

class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqId: 0,
      activeStep: 0,
      dialogAddFAQ: false,
      dialogEditFAQ: false,
      question: '',
      questionError: false,
      questionErrorMsg: '',
      answer: '',
      answerError: false,
      answerErrorMsg: '',
      addedData: false,
      toggleDelete: false,
      sorting: [{ columnName: 'id', direction: 'asc' }],
      tableColumnExtensions: [
        { columnName: 'id', width: 70 },
      ],
    }

    this.changeSorting = sorting => this.setState({ sorting });
  }

  getStepContent(stepIndex, state, handleChange) {
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

  getEditStepContent(stepIndex, state, handleChange) {
    switch (stepIndex) {
      case 0:
        return (
          <Query
            query={GET_FAQ_DETAILS}
            variables={{ id: state.faqId }}
            onCompleted={(data) => {
              if (this.state.addedData === false) {
                this.setState({
                  question: data.faqId.title,
                  answer: data.faqId.body,
                  addedData: true,
                })
              }
            }}
          >
            {({ loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error</p>;
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
            }}
          </Query>

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

  // Handle input change
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  // Handle dialog whnen opening
  handleClickOpenAdd = () => {
    this.setState({
      dialogAddFAQ: true,
      dialogEditFAQ: false,
      question: '',
      answer: '',
      addedData: false,
    });
  };

  // Handle dialog whnen opening
  handleClickOpenEdit = (faqId) => {
    this.setState({
      dialogEditFAQ: true,
      faqId: faqId,
      addedData: false,
    });
  };

  TableRow = ({ row, ...restProps }) => (
    <Table.Row
      {...restProps}
      // eslint-disable-next-line no-alert
      onClick={() => this.handleClickOpenEdit(row.id)}
      style={{
        cursor: 'pointer'
      }}
    />
  )

  // Handle next button for stepper and check if fields are empty before continuing
  handleNext = () => {
    if (this.state.activeStep === 0) {
      let next = true
      let items = [['question', this.state.question],
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
    this.setState({ dialogAddFAQ: false, dialogEditFAQ: false, question: '', answer: '', addedData: false, });
    // this.emptyState()
  };

  // Handle back button for stepper
  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
  };

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;
    const {
      sorting, tableColumnExtensions
    } = this.state;

    return (
      <section>
        <div className="section-actions">
          <h2>Acties</h2>
          <Button
            variant="contained"
            onClick={this.handleClickOpenAdd}
          >
            FAQ toevoegen
          </Button>
        </div>

        {/* Query Show all FAQ's */}
        <Query
          query={FAQS}
          pollInterval={5000}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading... :)</p>;
            if (error) return <p>Error :(</p>;

            let columns = [
              { name: 'id', title: 'ID' },
              { name: 'title', title: 'Vraag' },
              { name: 'body', title: 'Antwoord' }
            ]

            let rows = []

            for (let i = 0; i < data.faq.length; i++) {
              rows.push(
                {
                  id: data.faq[i].id,
                  title: data.faq[i].title,
                  body: data.faq[i].body,
                }
              )
            }

            return (
              <Paper>
                <GridR
                  rows={rows}
                  columns={columns}
                >
                  <SortingState
                    sorting={sorting}
                    onSortingChange={this.changeSorting}
                  />
                  <IntegratedSorting />
                  <Table
                    rowComponent={this.TableRow}
                    columnExtensions={tableColumnExtensions}
                  />
                  <TableHeaderRow showSortingControls />
                  <Toolbar />
                </GridR>
              </Paper>
            )
          }}
        </Query>
        {/* Dialog Add FAQ */}
        <Dialog
          open={this.state.dialogAddFAQ}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
        // scroll='scroll'
        >
          <DialogTitle id="form-dialog-title">FAQ toevoegen</DialogTitle>
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
                      <div>{this.getStepContent(activeStep, this.state, this.handleChange, this.handeImage)}</div>
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
                  mutation={ADD_FAQ}
                  onCompleted={(data) => {
                    console.log(`Query complete: ${data.faqCreate}`)
                    this.handleClose()
                    // window.location.reload();
                    this.setState({
                      activeStep: 0,
                    })
                    this.props.handleSnackbarOpen('ADD_FAQ_SUCCESS')
                  }}
                  onError={(err) => {
                    console.log(`Query failed: ${err}`)
                    this.props.handleSnackbarOpen('ADD_FAQ_ERROR')
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
                            question: this.state.question,
                            answer: this.state.answer,
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


        {/* Dialog Edit FAQ */}
        <Dialog
          open={this.state.dialogEditFAQ}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle id="form-dialog-title">Schilderij aanpassen</DialogTitle>
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
                      <div>{this.getEditStepContent(activeStep, this.state, this.handleChange)}</div>
                    </div>
                  )}
              </div>
            </DialogContent>
            <DialogActions className="buttonsInDialog">
              <MuiThemeProvider theme={themeDeleteButton}>
                <div className="dialog-action-delete">
                  {activeStep === 0 ? (
                    <Mutation
                      mutation={DELETE_FAQ}
                      onCompleted={(data) => {
                        console.log(`Mutation complete: ${data.faqDelete}`)
                        this.handleClose()
                        this.setState({
                          activeStep: 0,
                        })
                        // window.location.reload();
                        this.props.handleSnackbarOpen('DELETE_FAQ_SUCCESS')
                      }}
                      onError={(err) => {
                        console.log(`Mutation failed: ${err}`)
                        this.props.handleSnackbarOpen('DELETE_FAQ_ERROR')
                      }}
                    >
                      {(deletePainting) => (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={e => {
                            e.preventDefault()

                            let vars = {
                              id: this.state.faqId,
                            }

                            console.log(vars)

                            deletePainting({ variables: vars })
                          }}
                        >
                          DELETE
                        </Button>
                      )}
                    </Mutation>

                  ) : null}
                </div>
              </MuiThemeProvider>
              <div className="dialog-action-others">
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
                  <div>

                    <Mutation
                      mutation={EDIT_FAQ}
                      onCompleted={(data) => {
                        console.log(`Query complete: ${data.faqUpdate}`)
                        this.handleClose()
                        // window.location.reload();
                        this.props.handleSnackbarOpen('EDIT_FAQ_SUCCESS')
                        this.setState({
                          activeStep: 0
                        })
                      }}
                      onError={(err) => {
                        console.log(`Query failed: ${err}`)
                        this.props.handleSnackbarOpen('EDIT_FAQ_ERROR')
                      }}
                    >
                      {(editPainting, { data }) => (
                        <div>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={e => {
                              e.preventDefault()

                              let vars = {
                                id: this.state.faqId,
                                question: this.state.question,
                                answer: this.state.answer
                              }

                              console.log(vars)

                              editPainting({ variables: vars })
                            }}
                          >
                            Opslaan
                          </Button>
                        </div>
                      )}
                    </Mutation>
                  </div>
                ) : (
                    <div>
                      <Button variant="contained" color="primary" onClick={this.handleNext}>
                        Volgende
              </Button></div>)}
              </div>
            </DialogActions>
          </MuiThemeProvider>
        </Dialog>

      </section>
    );
  }
}

export default FAQ;