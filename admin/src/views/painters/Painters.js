import React, { Component } from 'react';
import './Painters.css';

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

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
// Img
import ImageOnLoad from 'react-image-onload'

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

const PAINTERS = gql`
  query paintersPAG($page: Int!, $amount: Int!){
    paintersAdmin(page: $page, amount: $amount){
      total
      painterpagination{
        id
        name
        nationality
        occupation
        dateofdeath
        city
        dateofbirth
        placeofdeath
        description
      }
    }
  }
`;

const GET_PAINTER_DETAILS = gql`
  query painter($id: String!){
    painterByID(id: $id){
      id
      name
      city
      dateofbirth
      dateofdeath
      placeofdeath
      occupation
      nationality
      description
    }
  }
`


const ADD_PAINTER = gql`
  mutation AddPainter(
    $name: String!
    $city: String!
    $dateBirth: String!
    $dateDeath: String!
    $placeDeath: String!
    $occupation: String!
    $nationality: String!
    $headerImage: String!
    $thumbnail: String!
    $description: String!){
      addPainter(
        name: $name
        city: $city
        dateBirth: $dateBirth
        dateDeath: $dateDeath
        placeDeath: $placeDeath
        occupation: $occupation
        nationality: $nationality
        headerImage: $headerImage
        thumbnail: $thumbnail
        description: $description
      )
  }
`;

const EDIT_PAINTER = gql`
  mutation AlterPainter(
    $id: Int!
    $name: String!
    $city: String!
    $dateBirth: String!
    $dateDeath: String!
    $placeDeath: String!
    $occupation: String!
    $nationality: String!
    $description: String!){
      alterPainter(
        id: $id
        name: $name
        city: $city
        dateBirth: $dateBirth
        dateDeath: $dateDeath
        placeDeath: $placeDeath
        occupation: $occupation
        nationality: $nationality
        description: $description
      )
  }
`;

const DELETE_PAINTER = gql `
  mutation DELETE_PAINTER($id: String!){
    deletePainter(id: $id)
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
  return ['Vul informatie in', 'Review schilder'];
}

function getStepContent(stepIndex, state, handleChange) {
  switch (stepIndex) {
    case 0:
      return (
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.nameError}>
              <InputLabel htmlFor="add-name">Naam</InputLabel>
              <Input id="add-name" value={state.name} onChange={handleChange('name')} />
              <FormHelperText id="add-name-error-text">{state.nameErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.nationalityErrorMsg}>
              <InputLabel htmlFor="add-nationality">Nationaliteit</InputLabel>
              <Input id="add-nationality" value={state.nationality} onChange={handleChange('nationality')} />
              <FormHelperText id="add-nationality-error-text">{state.nationalityErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.datebirthError}>
              <InputLabel htmlFor="add-datebirth">Jaar van geboorte</InputLabel>
              <Input id="add-datebirth" type="number" value={state.datebirth} onChange={handleChange('datebirth')} />
              <FormHelperText id="add-datebirth-error-text">{state.datebirthErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.cityError}>
              <InputLabel htmlFor="add-city">Stad van geboorte</InputLabel>
              <Input id="add-city" value={state.city} onChange={handleChange('city')} />
              <FormHelperText id="add-city-error-text">{state.cityErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.datedeathError}>
              <InputLabel htmlFor="add-datedeath">Jaar van overlijden</InputLabel>
              <Input id="add-datedeath" type="number" value={state.datedeath} onChange={handleChange('datedeath')} />
              <FormHelperText id="add-datedeath-error-text">{state.datedeathErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.placedeathError}>
              <InputLabel htmlFor="add-placedeath">Stad van overlijden</InputLabel>
              <Input id="add-placedeath" value={state.placedeath} onChange={handleChange('placedeath')} />
              <FormHelperText id="add-placedeath-error-text">{state.placedeathErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={state.descriptionError}>
              <InputLabel htmlFor="add-description">Beschrijving</InputLabel>
              <Input id="add-description" multiline value={state.description} onChange={handleChange('description')} />
              <FormHelperText id="add-description-error-text">{state.descriptionErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.headerimageError}>
              <InputLabel htmlFor="add-headerimage">Header image (link)</InputLabel>
              <Input id="add-headerimage" value={state.headerimage} onChange={handleChange('headerimage')} />
              <FormHelperText id="add-headerimage-error-text">{state.headerimageErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.thumbnailError}>
              <InputLabel htmlFor="add-thumbnail">Thumbnail (link)</InputLabel>
              <Input id="add-thumbnail" value={state.thumbnail} onChange={handleChange('thumbnail')} />
              <FormHelperText id="add-thumbnail-error-text">{state.thumbnailErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.occupationError}>
              <InputLabel htmlFor="add-occupation">Beroep</InputLabel>
              <Input id="add-occupation" multiline value={state.occupation} onChange={handleChange('occupation')} />
              <FormHelperText id="add-occupation-error-text">{state.occupationErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      )
    case 1:
      return (
        <Grid>
          <Grid container spacing={24}>
            <Grid item xs={12} className="add-painter-review-img-preview-container">
              <img src={state.headerimage} alt="Preview" className="add-painter-review-img-preview" />
              {/* <ImageOnLoad
                src={state.headerimage}
                alt="Preview"
                className="add-painter-review-img-preview"
              /> */}
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Naam</span>
              <span>{state.name}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Nationaliteit</span>
              <span>{state.nationality}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Jaar van geboorte</span>
              <span>{state.datebirth}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Stad van geboorte</span>
              <span>{state.city}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Jaar van overlijden</span>
              <span>{state.datedeath}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Stad van overlijden</span>
              <span>{state.placedeath}</span>
            </Grid>
            <Grid item xs={12} className="add-painting-review-container">
              <span>Beschrijving</span>
              <span>{state.description}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Beroep</span>
              <span>{state.occupation}</span>
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
      dialogEditPainter: false,
      painterID: '',
      dataHeaderImage: '',
      dataThumbnail: '',
      dataAmountWatched: '',
      addedData: false,
      name: '',
      nameError: false,
      nameErrorMsg: false,
      city: '',
      cityError: false,
      cityErrorMsg: false,
      datebirth: '',
      datebirthError: false,
      datebirthErrorMsg: false,
      datedeath: '',
      datedeathError: false,
      datedeathErrorMsg: false,
      placedeath: '',
      placedeathError: false,
      placedeathErrorMsg: false,
      occupation: '',
      occupationError: false,
      occupationErrorMsg: false,
      nationality: '',
      nationalityError: false,
      nationalityErrorMsg: false,
      headerimage: '',
      headerimageError: false,
      headerimageErrorMsg: false,
      thumbnail: '',
      thumbnailError: false,
      thumbnailErrorMsg: false,
      description: '',
      descriptionError: false,
      descriptionErrorMsg: false,
      rows: [],
      totalCount: 0,
      pageSize: 15,
      currentPage: 0,
      pageSizes: [15, 20, 25, 30],
      sorting: [{ columnName: 'id', direction: 'asc' }],
      tableColumnExtensions: [
        { columnName: 'id', width: 70 },
      ],
      hiddenColumnNames: ['releasedate', 'description'],
      page: 0,
      rowsPerPage: 10,
    }

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeSorting = sorting => this.setState({ sorting });
    this.hiddenColumnNamesChange = (hiddenColumnNames) => { this.setState({ hiddenColumnNames }); };
  }

  getEditStepContent(stepIndex, state, handleChange) {
    switch (stepIndex) {
      case 0:
        return (
          <Query
            query={GET_PAINTER_DETAILS}
            variables={{ id: state.painterID }}
            onCompleted={(data) => {
              if (this.state.addedData === false) {
                this.setState({
                  name: data.painterByID[0].name,
                  nationality: data.painterByID[0].nationality,
                  datebirth: data.painterByID[0].dateofbirth,
                  city: data.painterByID[0].city,
                  datedeath: data.painterByID[0].dateofdeath,
                  placedeath: data.painterByID[0].placeofdeath,
                  description: data.painterByID[0].description,
                  occupation: data.painterByID[0].occupation,
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
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.nameError}>
                      <InputLabel htmlFor="add-name">Naam</InputLabel>
                      <Input id="add-name" value={state.name} onChange={handleChange('name')} />
                      <FormHelperText id="add-name-error-text">{state.nameErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.nationalityErrorMsg}>
                      <InputLabel htmlFor="add-nationality">Nationaliteit</InputLabel>
                      <Input id="add-nationality" value={state.nationality} onChange={handleChange('nationality')} />
                      <FormHelperText id="add-nationality-error-text">{state.nationalityErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.datebirthError}>
                      <InputLabel htmlFor="add-datebirth">Jaar van geboorte</InputLabel>
                      <Input id="add-datebirth" type="number" value={state.datebirth} onChange={handleChange('datebirth')} />
                      <FormHelperText id="add-datebirth-error-text">{state.datebirthErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.cityError}>
                      <InputLabel htmlFor="add-city">Stad van geboorte</InputLabel>
                      <Input id="add-city" value={state.city} onChange={handleChange('city')} />
                      <FormHelperText id="add-city-error-text">{state.cityErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.datedeathError}>
                      <InputLabel htmlFor="add-datedeath">Jaar van overlijden</InputLabel>
                      <Input id="add-datedeath" type="number" value={state.datedeath} onChange={handleChange('datedeath')} />
                      <FormHelperText id="add-datedeath-error-text">{state.datedeathErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.placedeathError}>
                      <InputLabel htmlFor="add-placedeath">Stad van overlijden</InputLabel>
                      <Input id="add-placedeath" value={state.placedeath} onChange={handleChange('placedeath')} />
                      <FormHelperText id="add-placedeath-error-text">{state.placedeathErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={state.descriptionError}>
                      <InputLabel htmlFor="add-description">Beschrijving</InputLabel>
                      <Input id="add-description" multiline value={state.description} onChange={handleChange('description')} />
                      <FormHelperText id="add-description-error-text">{state.descriptionErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.occupationError}>
                      <InputLabel htmlFor="add-occupation">Beroep</InputLabel>
                      <Input id="add-occupation" multiline value={state.occupation} onChange={handleChange('occupation')} />
                      <FormHelperText id="add-occupation-error-text">{state.occupationErrorMsg}</FormHelperText>
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
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Naam</span>
                <span>{state.name}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Nationaliteit</span>
                <span>{state.nationality}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Jaar van geboorte</span>
                <span>{state.datebirth}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Stad van geboorte</span>
                <span>{state.city}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Jaar van overlijden</span>
                <span>{state.datedeath}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Stad van overlijden</span>
                <span>{state.placedeath}</span>
              </Grid>
              <Grid item xs={12} className="add-painting-review-container">
                <span>Beschrijving</span>
                <span>{state.description}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Beroep</span>
                <span>{state.occupation}</span>
              </Grid>
            </Grid>
          </Grid>
        )
      default:
        return 'Uknown stepIndex';
    }
  }


  changeCurrentPage(currentPage) {
    this.setState({
      loading: true,
      currentPage,
    });
  }


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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  // Handle input change
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });

    if (name === 'datebirth') {
      if (event.target.value > new Date().getFullYear()) {
        this.setState({
          datebirthError: true,
          datebirthErrorMsg: `Jaar van geboorte kan niet later dan ${new Date().getFullYear()} zijn`
        });
      } else {
        this.setState({
          datebirthError: false,
          datebirthErrorMsg: ``
        });
      }
    }

    if (name === 'datedeath') {
      if (event.target.value > new Date().getFullYear()) {
        this.setState({
          datedeathError: true,
          datedeathErrorMsg: `Jaar van overlijden kan niet later dan ${new Date().getFullYear()} zijn`
        });
      } else {
        this.setState({
          datedeathError: false,
          datedeathErrorMsg: ``
        });
      }
    }
  };

  // Handle dialog whnen opening
  handleClickOpen = () => {
    this.setState({
      dialogAddPainter: true
    });
  };

  // Handle dialog whnen opening
  handleClickOpenEdit = (id) => {
    this.setState({
      dialogEditPainter: true,
      painterID: id.toString(),
      addedData: false,
    });
  };

  // Handle next button for stepper and check if fields are empty before continuing
  handleNext = () => {
    if (this.state.activeStep === 0) {
      let next = true
      let items = [['name', this.state.name],
      ['city', this.state.city],
      ['datebirth', this.state.datebirth],
      ['datedeath', this.state.datedeath],
      ['placedeath', this.state.placedeath],
      ['occupation', this.state.occupation],
      ['nationality', this.state.nationality],
      ['headerimage', this.state.headerimage],
      ['thumbnail', this.state.thumbnail],
      ['description', this.state.description]]

      console.log(items)


      if (this.state.dialogAddPainter) {
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
      }


      if (next) {
        this.setState(state => ({ activeStep: state.activeStep + 1, }));
      }
    }
  };

  // Handle dialog when closing
  handleClose = () => {
    this.setState({ dialogAddPainter: false, dialogEditPainter: false, addedData: false, });
    this.emptyState()
  };

  emptyState() {
    this.setState({
      activeStep: 0,
      dialogAddPainter: false,
      dialogEditPainter: false,
      painterID: '',
      addedData: false,
      name: '',
      nameError: false,
      nameErrorMsg: false,
      city: '',
      cityError: false,
      cityErrorMsg: false,
      datebirth: '',
      datebirthError: false,
      datebirthErrorMsg: false,
      datedeath: '',
      datedeathError: false,
      datedeathErrorMsg: false,
      placedeath: '',
      placedeathError: false,
      placedeathErrorMsg: false,
      occupation: '',
      occupationError: false,
      occupationErrorMsg: false,
      nationality: '',
      nationalityError: false,
      nationalityErrorMsg: false,
      headerimage: '',
      headerimageError: false,
      headerimageErrorMsg: false,
      thumbnail: '',
      thumbnailError: false,
      thumbnailErrorMsg: false,
      description: '',
      descriptionError: false,
      descriptionErrorMsg: false,
    })
  }

  // Handle back button for stepper
  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
  };

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;
    const {
      pageSize, currentPage, pageSizes, sorting, tableColumnExtensions, hiddenColumnNames
    } = this.state;

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
          variables={{
            page: currentPage,
            amount: pageSize
          }}
          pollInterval={5000}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading... :)</p>;
            if (error) return <p>Error :(</p>;

            let columns = [
              { name: 'id', title: 'ID' },
              { name: 'name', title: 'Naam' },
              { name: 'occupation', title: 'Beroep' },
              { name: 'nationality', title: 'Nationaliteit' },
              { name: 'datebirth', title: 'Datum van geboorte' },
              { name: 'city', title: 'Stad van geboorte' },
              { name: 'datedeath', title: 'Datum van overlijden' },
              { name: 'placeofdeath', title: 'Stad van overlijden' },
              { name: 'description', title: 'Beschrijving' }
            ]

            let rows = []

            for (let i = 0; i < data.paintersAdmin.painterpagination.length; i++) {
              rows.push(
                {
                  id: data.paintersAdmin.painterpagination[i].id,
                  name: data.paintersAdmin.painterpagination[i].name,
                  occupation: data.paintersAdmin.painterpagination[i].occupation,
                  nationality: data.paintersAdmin.painterpagination[i].nationality,
                  datebirth: data.paintersAdmin.painterpagination[i].dateofbirth,
                  city: data.paintersAdmin.painterpagination[i].city,
                  datedeath: data.paintersAdmin.painterpagination[i].dateofdeath,
                  placeofdeath: data.paintersAdmin.painterpagination[i].placeofdeath,
                  description: data.paintersAdmin.painterpagination[i].description,
                }
              )
            }

            return (
              <Paper>
                <GridR
                  rows={rows}
                  columns={columns}
                >
                  <PagingState
                    currentPage={currentPage}
                    onCurrentPageChange={this.changeCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={this.changePageSize}
                  />
                  <CustomPaging
                    totalCount={data.paintersAdmin.total}
                  />
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
                  <TableColumnVisibility
                    hiddenColumnNames={hiddenColumnNames}
                    onHiddenColumnNamesChange={this.hiddenColumnNamesChange}
                  />
                  <Toolbar />
                  <ColumnChooser />
                  <PagingPanel
                    pageSizes={pageSizes}
                  />
                </GridR>
              </Paper>
            )
          }}
        </Query>

        {/* Dialog Add Painter */}
        <Dialog
          open={this.state.dialogAddPainter}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
        // scroll='scroll'
        >
          <DialogTitle id="form-dialog-title">Schilder toevoegen</DialogTitle>
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
            <DialogActions className="buttonsInDialog">
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
                            name: this.state.name,
                            city: this.state.city,
                            dateBirth: this.state.datebirth,
                            dateDeath: this.state.datedeath,
                            placeDeath: this.state.placedeath,
                            occupation: this.state.occupation,
                            nationality: this.state.nationality,
                            headerImage: this.state.headerimage,
                            thumbnail: this.state.thumbnail,
                            description: this.state.description,
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

        {/* Dialog Edit Painter */}
        <Dialog
          open={this.state.dialogEditPainter}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
        // scroll='scroll'
        >
          <DialogTitle id="form-dialog-title">Schilder aanpassen</DialogTitle>
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
                      mutation={DELETE_PAINTER}
                      onCompleted={(data) => {
                        console.log(`Mutation complete: ${data.deletePainter}`)
                        this.handleClose()
                        this.props.handleSnackbarOpen('DELETE_PAINTER_SUCCESS')
                      }}
                      onError={(err) => {
                        console.log(`Mutation failed: ${err}`)
                        this.props.handleSnackbarOpen('DELETE_PAINTER_ERROR')
                      }}
                    >
                      {(deletePainter) => (
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={e => {
                          e.preventDefault()

                          let vars = {
                            id: this.state.painterID,
                          }

                          console.log(vars)

                          deletePainter({ variables: vars })
                        }}
                      >
                        DELETE
                      </Button>
                      )}

                    </Mutation>
                  ) : null}
                </div>
              </MuiThemeProvider>
              
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
                  mutation={EDIT_PAINTER}
                  onCompleted={(data) => {
                    console.log(`Query complete: ${data.alterPainter}`)
                    this.handleClose()
                    this.setState({
                    })
                    this.props.handleSnackbarOpen('EDIT_PAINTER_SUCCESS')
                  }}
                  onError={(err) => {
                    console.log(`Query failed: ${err}`)
                    this.props.handleSnackbarOpen('EDIT_PAINTER_ERROR')
                  }}
                >
                  {(editPainter, { data }) => (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={e => {
                          e.preventDefault()

                          let vars = {
                            id: parseInt(this.state.painterID),
                            name: this.state.name,
                            city: this.state.city,
                            dateBirth: this.state.datebirth,
                            dateDeath: this.state.datedeath,
                            placeDeath: this.state.placedeath,
                            occupation: this.state.occupation,
                            nationality: this.state.nationality,
                            description: this.state.description,
                          }

                          console.log(vars)

                          editPainter({ variables: vars })
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