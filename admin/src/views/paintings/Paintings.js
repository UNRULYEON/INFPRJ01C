import React, { Component } from 'react';
import './Paintings.css';

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

// Apollo
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

// Img
import ImageOnLoad from 'react-image-onload'

// Currency
import Currency from 'react-currency-formatter';

const GET_ART_DETAILS = gql`
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

const PAINTINGS = gql`
  query Paintings_pagination($page: Int!){
    paintingOrderedByPagination(page: $page){
      total
      collection {
        id_number
        title
        principalmaker
        price
        releasedate
        period
        physicalmedium
        amountofpaintings
        principalmakersproductionplaces
      }
    }
  }
`;

const PAINTERS = gql`
  query PaintersAll {
    paintersAll{
      name
      id
    }
  }
`

const ADD_PAINTING = gql`
  mutation AddPainting(
    $id: String!,
    $title: String!,
    $releasedate: Int!,
    $period: Int!,
    $description: String!,
    $physicalmedium: String!,
    $amountofpaintings: Int!,
    $src: String!,
    $bigsrc: String!,
    $prodplace: String!,
    $width: Int!,
    $height: Int!,
    $principalmaker: String!,
    $price: Int!,
    $rented: Boolean!
    $painterId: Int!) {
    addProduct(
      id: $id,
      title: $title,
      releasedate: $releasedate,
      period:$period,
      description: $description,,
      physicalmedium: $physicalmedium,
      amountofpaintings: $amountofpaintings,
      src: $src,
      bigsrc: $bigsrc,
      prodplace: $prodplace,
      width: $width,
      height: $height,
      principalmaker: $principalmaker,
      price: $price,
      rented: $rented
      painterId: $painterId)
  }
`;

const EDIT_PAINTING = gql`
  mutation EditPainting(
    $id: String!,
    $id_number: Int!,
    $title: String!,
    $releasedate: Int!,
    $period: Int!,
    $description: String!,
    $physicalmedium: String!,
    $amountofpaintings: Int,
    $src: String!,
    $bigsrc: String!,
    $prodplace: String!,
    $width: Int!,
    $height: Int!,
    $principalmaker: String!,
    $price: Int!,
    $rented: Boolean,
    $amountwatched: Int!) {
      alterProduct(
      id_number: $id_number,
      id: $id,
      title: $title,
      releasedate: $releasedate,
      period:$period,
      description: $description,
      physicalmedium: $physicalmedium,
      amountofpaintings: $amountofpaintings,
      src: $src,
      bigsrc: $bigsrc,
      prodplace: $prodplace,
      width: $width,
      height: $height,
      principalmaker: $principalmaker,
      price: $price,
      rented: $rented,
      amountwatched: $amountwatched)
  }
`;

const DELETE_PAINTING = gql`
  mutation PRODUCT($id: Int!){
    deleteProduct(id: $id)
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

function getStepsAanmaken() {
  return ['Vul informatie in', 'Review schilderij'];
}

// function getStepsAanpassen() {
//   return ['Vul informatie in', 'Review schilderij'];
// }

function getStepContent(stepIndex, state, handleChange, handeImage, handleChoosePainterDialog, handleChoosePainterDialogClose, TableRowChoosePainter) {
  switch (stepIndex) {
    case 0:
      return (
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.titleError}>
              <InputLabel htmlFor="add-title">Titel</InputLabel>
              <Input id="add-title" value={state.title} onChange={handleChange('title')} />
              <FormHelperText id="add-title-error-text">{state.titleErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: 'flex',
              flexFlow: 'column nowrap',
              justifyContent: 'center'
            }}
            onClick={handleChoosePainterDialog}
          >
            <Button variant="outlined" fullWidth>
              {state.principalMaker.length > 0 ? state.principalMaker : 'Kies een schilder'}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.releaseDateError}>
              <InputLabel htmlFor="add-release-date">Gemaakt in (jaar)</InputLabel>
              <Input id="add-release-date" type="number" value={state.releaseDate} onChange={handleChange('releaseDate')} />
              <FormHelperText id="add-release-date-error-text">{state.releaseDateErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.periodError}>
              <InputLabel htmlFor="add-periode">Periode (eeuw)</InputLabel>
              <Input id="add-periode" type="number" value={state.periode} onChange={handleChange('period')} />
              <FormHelperText id="add-periode-error-text">{state.periodErrorMsg}</FormHelperText>
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
            <FormControl fullWidth error={state.physicalMediumError}>
              <InputLabel htmlFor="add-physical-medium">Gemaakt op (materiaal)</InputLabel>
              <Input id="add-physical-medium" value={state.physicalMedium} onChange={handleChange('physicalMedium')} />
              <FormHelperText id="add-physical-medium-error-text">{state.physicalMediumErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="add-amount">Hoeveelheid (staat vast)</InputLabel>
              <Input id="add-amount" inputProps={{ readOnly: true, }} value={state.amount} />
              <FormHelperText id="add-amount-error-text"></FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.srcError}>
              <InputLabel htmlFor="add-src">Kleine thumbnail (link)</InputLabel>
              <Input id="add-src" value={state.src} onChange={handleChange('src')} />
              <FormHelperText id="add-src-error-text">{state.srcErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.bigsrcError}>
              <InputLabel htmlFor="add-big-src">Grote thumbnail (link)</InputLabel>
              <Input id="add-big-src" value={state.bigsrc} onChange={handleChange('bigsrc')} />
              <FormHelperText id="add-big-src-error-text">{state.bigsrcErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={state.principalMakersProductionPlacesError}>
              <InputLabel htmlFor="add-production-places">Gemaakt in (stad)</InputLabel>
              <Input id="add-production-places" value={state.principalMakersProductionPlaces} onChange={handleChange('principalMakersProductionPlaces')} />
              <FormHelperText id="add-production-places-error-text">{state.principalMakersProductionPlacesErrorMsg}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="add-price">Prijs (wordt berekend)</InputLabel>
              <Input id="add-price" inputProps={{ readOnly: true, }} value={state.price} />
              <FormHelperText id="add-price-error-text"></FormHelperText>
            </FormControl>
          </Grid>
          <Dialog
            open={state.dialogChoosePainter}
            onClose={handleChoosePainterDialogClose}
            disableBackdropClick
            disableEscapeKeyDown
          // scroll='scroll'
          >
            <DialogTitle id="form-dialog-title">Kies een schilder</DialogTitle>
            <MuiThemeProvider theme={theme}>
              <DialogContent>
                <Query query={PAINTERS} pollInterval={5000}>
                  {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;

                    let columns = [
                      { name: 'id', title: 'ID' },
                      { name: 'name', title: 'Naam' }
                    ]

                    let rows = []

                    for (let i = 0; i < data.paintersAll.length; i++) {
                      rows.push(
                        { id: data.paintersAll[i].id, name: data.paintersAll[i].name }
                      )
                    }
                    return (
                      <GridR
                        rows={rows}
                        columns={columns}
                      >
                        <SearchState defaultValue="" />
                        <IntegratedFiltering />
                        <Table rowComponent={TableRowChoosePainter} />
                        <TableHeaderRow />
                        <Toolbar />
                        <SearchPanel />
                      </GridR>
                    );
                  }}
                </Query>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    handleChoosePainterDialogClose()
                  }}
                >
                  Annuleren
                </Button>
              </DialogActions>
            </MuiThemeProvider>
          </Dialog>
        </Grid>
      )
    case 1:
      return (
        <Grid>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6} className="add-painting-review-img-preview-container">
              {/* <img src={state.src} alt="Preview" className="add-painting-review-img-preview"/> */}
              <ImageOnLoad
                onLoad={({ width, height }) => {
                  console.log(`${width}x${height}`)
                  handeImage(width, height)
                }}
                src={state.bigsrc}
                alt="Preview"
                className="add-painting-review-img-preview"
              />
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-details-preview">
              <Grid item xs={12} className="add-painting-review-container">
                <span>Titel</span>
                <span>{state.title}</span>
              </Grid>
              <Grid item xs={12} className="add-painting-review-container">
                <span>Schilder</span>
                <span>{state.principalMaker}</span>
              </Grid>
              <Grid item xs={12} className="add-painting-review-container">
                <span>Prijs</span>
                <Currency
                  quantity={state.price}
                  symbol="€ "
                  decimal=","
                  group="."
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs={12} className="add-painting-review-container">
              <span>Beschrijving</span>
              <span>{state.description}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Gemaakt in (jaar)</span>
              <span>{state.releaseDate}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Periode (eeuw)</span>
              <span>{state.period}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Gemaakt op (materiaal)</span>
              <span>{state.physicalMedium}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Gemaakt in (stad)</span>
              <span>{state.principalMakersProductionPlaces}</span>
            </Grid>
            <Grid item xs={12} sm={6} className="add-painting-review-container">
              <span>Hoeveelheid</span>
              <span>{state.amount}</span>
            </Grid>
          </Grid>
        </Grid>
      );
    default:
      return 'Uknown stepIndex';
  }
}

class Paintings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      dialogAddPainting: false,
      dialogChoosePainter: false,
      id: 0,
      id_number: 0,
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
      amount: 1,
      src: '',
      srcError: false,
      srcErrorMsg: '',
      srcExists: false,
      bigsrc: '',
      bigsrcError: false,
      bigsrcErrorMsg: '',
      bigsrcExists: false,
      principalMakersProductionPlaces: '',
      principalMakersProductionPlacesError: false,
      principalMakersProductionPlacesErrorMsg: '',
      width: 0,
      height: 0,
      productWidth: 0,
      productHeight: 0,
      principalMaker: '',
      principalMakerID: 0,
      price: 0,
      rented: false,
      paintingID: '',
      dialogEditPainting: false,
      amountwatched: 0,
      changeState: false,
      rows: [],
      totalCount: 0,
      pageSize: 15,
      currentPage: 0,
      pageSizes: [15, 20, 25, 30],
      sorting: [{ columnName: 'id', direction: 'asc' }],
      tableColumnExtensions: [
        { columnName: 'id', width: 70 },
      ],
      hiddenColumnNames: [''],
      page: 0,
      rowsPerPage: 10,
      addedData: false,
      inputChanged: false,
    }

    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeSorting = sorting => this.setState({ sorting });
    this.hiddenColumnNamesChange = (hiddenColumnNames) => { this.setState({ hiddenColumnNames }); };
  }

  checkRented() {
    if (this.state.rented == null) {
      this.setState({
        rented: false,
      })
    }
    console.log(this.state.productHeight)
  }

  getEditStepContent(stepIndex, state, handleChange) {
    switch (stepIndex) {
      case 0:
        return (
          <Query
            query={GET_ART_DETAILS}
            variables={{ id: state.paintingID }}
            onCompleted={(data) => {
              if (this.state.addedData === false) {
                this.setState({
                  id: data.paintingByID[0].id,
                  id_number: data.paintingByID[0].id_number,
                  title: data.paintingByID[0].title,
                  releaseDate: data.paintingByID[0].releasedate,
                  period: data.paintingByID[0].period,
                  description: data.paintingByID[0].description,
                  physicalMedium: data.paintingByID[0].physicalmedium,
                  amount: data.paintingByID[0].amountofpaintings,
                  src: data.paintingByID[0].src,
                  bigsrc: data.paintingByID[0].bigsrc,
                  principalMakersProductionPlaces: data.paintingByID[0].principalmakersproductionplaces,
                  productWidth: data.paintingByID[0].width,
                  productHeight: data.paintingByID[0].height,
                  principalMaker: data.paintingByID[0].principalmaker,
                  price: data.paintingByID[0].price,
                  rented: data.paintingByID[0].rented,
                  amountwatched: data.paintingByID[0].amountwatched,
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
                    <FormControl fullWidth>
                      <InputLabel>ID</InputLabel>
                      <Input disabled={true} value={state.paintingID} onChange={handleChange('title')} />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{
                      display: 'flex',
                      flexFlow: 'column nowrap',
                      justifyContent: 'center'
                    }}
                    onClick={this.handleChoosePainterDialog}
                  >
                    <Button variant="outlined" fullWidth>
                      {state.principalMaker.length > 0 ? state.principalMaker : 'Kies een schilder'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="add-title">Titel</InputLabel>
                      <Input value={state.title} onChange={handleChange('title')} />
                      <FormHelperText>{state.titleErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.releaseDateError}>
                      <InputLabel htmlFor="add-release-date">Gemaakt in (jaar)</InputLabel>
                      <Input id="add-release-date" type="number" value={state.releaseDate} onChange={handleChange('releaseDate')} />
                      <FormHelperText id="add-release-date-error-text">{state.releaseDateErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.periodError}>
                      <InputLabel htmlFor="add-periode">Periode (eeuw)</InputLabel>
                      <Input id="add-periode" type="number" value={state.period} onChange={handleChange('period')} />
                      <FormHelperText id="add-periode-error-text">{state.periodErrorMsg}</FormHelperText>
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
                    <FormControl fullWidth error={state.physicalMediumError}>
                      <InputLabel htmlFor="add-physical-medium">Gemaakt op (materiaal)</InputLabel>
                      <Input id="add-physical-medium" value={state.physicalMedium} onChange={handleChange('physicalMedium')} />
                      <FormHelperText id="add-physical-medium-error-text">{state.physicalMediumErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="add-amount">Hoeveelheid (staat vast)</InputLabel>
                      <Input id="add-amount" disabled={true} value={state.amount} />
                      <FormHelperText id="add-amount-error-text"></FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={state.principalMakersProductionPlacesError}>
                      <InputLabel htmlFor="add-production-places">Gemaakt in (stad)</InputLabel>
                      <Input id="add-production-places" value={state.principalMakersProductionPlaces} onChange={handleChange('principalMakersProductionPlaces')} />
                      <FormHelperText id="add-production-places-error-text">{state.principalMakersProductionPlacesErrorMsg}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="add-price">Prijs (wordt berekend</InputLabel>
                      <Input id="add-price" disabled={true} value={state.price} />
                      <FormHelperText id="add-price-error-text"></FormHelperText>
                    </FormControl>
                  </Grid>

                  <Dialog
                    open={this.state.dialogChoosePainter}
                    onClose={this.handleChoosePainterDialogClose}
                    disableBackdropClick
                    disableEscapeKeyDown
                  // scroll='scroll'
                  >
                    <DialogTitle id="form-dialog-title">Kies een schilder</DialogTitle>
                    <MuiThemeProvider theme={theme}>
                      <DialogContent>
                        <Query query={PAINTERS}>
                          {({ loading, error, data }) => {
                            if (loading) return "Loading...";
                            if (error) return `Error! ${error.message}`;

                            let columns = [
                              { name: 'id', title: 'ID' },
                              { name: 'name', title: 'Naam' }
                            ]

                            let rows = []

                            for (let i = 0; i < data.paintersAll.length; i++) {
                              rows.push(
                                { id: data.paintersAll[i].id, name: data.paintersAll[i].name }
                              )
                            }
                            return (
                              <GridR
                                rows={rows}
                                columns={columns}
                              >
                                <SearchState defaultValue="" />
                                <IntegratedFiltering />
                                <Table rowComponent={this.TableRowChoosePainter} />
                                <TableHeaderRow />
                                <Toolbar />
                                <SearchPanel />
                              </GridR>
                            );
                          }}
                        </Query>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => {
                            this.handleChoosePainterDialogClose()
                          }}
                        >
                          Annuleren
                        </Button>
                      </DialogActions>
                    </MuiThemeProvider>
                  </Dialog>
                </Grid>
              )
            }}
          </Query>
        );
      case 1:
        return (
          <Grid>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6} className="add-painting-review-details-preview">
                <Grid item xs={12} className="add-painting-review-container">
                  <span>Titel</span>
                  <span>{state.title}</span>
                </Grid>
                <Grid item xs={12} className="add-painting-review-container">
                  <span>Schilder</span>
                  <span>{state.principalMaker}</span>
                </Grid>
                <Grid item xs={12} className="add-painting-review-container">
                  <span>Prijs</span>
                  <Currency
                    quantity={state.price}
                    symbol="€ "
                    decimal=","
                    group="."
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={24}>
              <Grid item xs={12} className="add-painting-review-container">
                <span>Beschrijving</span>
                <span>{state.description}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Gemaakt in (jaar)</span>
                <span>{state.releaseDate}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Periode (eeuw)</span>
                <span>{state.period}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Gemaakt op (materiaal)</span>
                <span>{state.physicalMedium}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Gemaakt in (stad)</span>
                <span>{state.principalMakersProductionPlaces}</span>
              </Grid>
              <Grid item xs={12} sm={6} className="add-painting-review-container">
                <span>Hoeveelheid</span>
                <span>{state.amount}</span>
              </Grid>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown stepIndex';
    }
  }

  changeCurrentPage(currentPage) {
    this.setState({
      loading: true,
      currentPage,
    });
  }

  // Handle input change
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      inputChanged: true,
    });

    if (name === 'releaseDate') {
      if (!event.target.value) {
        this.setState({
          price: 0,
        });
      } else if (event.target.value > new Date().getFullYear()) {
        console.log(`invalid input`)
        this.setState({
          price: 0,
          releaseDateError: true,
          releaseDateErrorMsg: `Productiejaar kan niet later dan ${new Date().getFullYear()} zijn`
        });
      } else {
        this.setState({
          price: (3000 - event.target.value) * 327,
          releaseDateError: false,
          releaseDateErrorMsg: ''
        });
      }
    }
  };

  // Handle dialog whnen opening
  handleAanmakenDialog = () => {
    this.setState({
      dialogAddPainting: true,
      id: Math.floor((Math.random() * 10000000000000) + 1).toString()
    });
  };

  handleAanpassenDialog = (paintingID) => {
    this.setState({
      paintingID: paintingID.toString(),
      dialogEditPainting: true,
      addedData: false,
      id: Math.floor((Math.random() * 10000000000000) + 1).toString()
    });
  };

  TableRow = ({ row, ...restProps }) => (
    <Table.Row
      {...restProps}
      // eslint-disable-next-line no-alert
      onClick={() => this.handleAanpassenDialog(row.id)}
      style={{
        cursor: 'pointer'
      }}
    />
  )

  handleChoosePainterDialog = () => {
    this.setState({
      dialogChoosePainter: true
    });
  }

  TableRowChoosePainter = ({ row, ...restProps }) => (
    <Table.Row
      {...restProps}
      // eslint-disable-next-line no-alert
      onClick={() => {
        console.log(row)
        this.handleChosenPainter(row)
      }}
      style={{
        cursor: 'pointer'
      }}
    />
  )

  handleChoosePainterDialogClose = () => {
    this.setState({
      dialogChoosePainter: false
    });
  }

  handleChosenPainter = (row) => {
    this.setState({
      principalMaker: row.name,
      principalMakerID: row.id,
      dialogChoosePainter: false
    });
  }

  // Handle dialog when closing
  handleClose = () => {
    this.setState({
      dialogAddPainting: false,
      dialogEditPainting: false,
      id: 0,
      id_number: 0,
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
      src: '',
      srcError: false,
      srcErrorMsg: '',
      srcExists: false,
      bigsrc: '',
      bigsrcError: false,
      bigsrcErrorMsg: '',
      bigsrcExists: false,
      principalMakersProductionPlaces: '',
      principalMakersProductionPlacesError: false,
      principalMakersProductionPlacesErrorMsg: '',
      width: 0,
      height: 0,
      productWidth: 0,
      productHeight: 0,
      principalMaker: '',
      principalMakerError: false,
      principalMakerErrorMsg: '',
      price: 0,
      activeStep: 0,
      changeState: true,
    });
    // this.emptyState()
  };

  // Handle next button for stepper and check if fields are empty before continuing
  handleNext = () => {
    if (this.state.activeStep === 0) {
      let next = true
      let items = [['title', this.state.title],
      ['releaseDate', this.state.releaseDate],
      ['period', this.state.period],
      ['description', this.state.description],
      ['physicalMedium', this.state.physicalMedium],
      ['src', this.state.src],
      ['bigsrc', this.state.bigsrc],
      ['principalMakersProductionPlaces', this.state.principalMakersProductionPlaces]]

      console.log(items)

      for (let i = 0; i < items.length; i++) {
        console.log(`item: ${items[i][0]} - value: ${items[i][1]}`)
        if (!items[i][1]) {
          next = false
          console.error(`item: ${items[i][0]} is empty`)
          if (items[1][1] > new Date().getFullYear()) {
            return
          }
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

  // Handle back button for stepper
  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
  };

  handeImage = (w, h) => {
    this.setState(state => ({ width: w }));
    this.setState(state => ({ height: h }));
  }

  emptyState() {
    this.setState({
      id: 0,
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
      src: '',
      srcError: false,
      srcErrorMsg: '',
      srcExists: false,
      bigsrc: '',
      bigsrcError: false,
      bigsrcErrorMsg: '',
      bigsrcExists: false,
      principalMakersProductionPlaces: '',
      principalMakersProductionPlacesError: false,
      principalMakersProductionPlacesErrorMsg: '',
      width: 0,
      height: 0,
      productWidth: 0,
      productHeight: 0,
      principalMaker: '',
      principalMakerError: false,
      principalMakerErrorMsg: '',
      price: 0,
      activeStep: 0,
      changeState: true,
      inputChanged: false,
    });
    console.log("State is empty");
  }

  getMakerLink(paintingID, maker) {
    if (maker !== "anoniem") {
      return (
        maker
      )
    } else {
      return (
        "Anoniem"
      )
    }
  }

  render() {
    const steps = getStepsAanmaken();
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
            onClick={this.handleAanmakenDialog}
          >
            Schilderij toevoegen
          </Button>
        </div>


        {/* SHOW PAINTINGS TABLE */}
        <Query
          query={PAINTINGS}
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
              { name: 'title', title: 'Titel' },
              { name: 'principalmaker', title: 'Schilder' },
              { name: 'price', title: 'Prijs' },
              { name: 'releasedate', title: 'Datum van uitgave' },
              { name: 'period', title: 'Eeuw van uitgave' },
              { name: 'physicalmedium', title: 'Materiaal' },
              { name: 'amountofpaintings', title: 'Voorraad' },
              { name: 'principalmakersproductionplaces', title: 'Stad van productie' },
            ]

            let rows = []

            for (let i = 0; i < data.paintingOrderedByPagination.collection.length; i++) {
              rows.push(
                {
                  id: data.paintingOrderedByPagination.collection[i].id_number,
                  title: data.paintingOrderedByPagination.collection[i].title,
                  principalmaker: data.paintingOrderedByPagination.collection[i].principalmaker,
                  price: data.paintingOrderedByPagination.collection[i].price,
                  releasedate: data.paintingOrderedByPagination.collection[i].releasedate,
                  period: data.paintingOrderedByPagination.collection[i].period,
                  physicalmedium: data.paintingOrderedByPagination.collection[i].physicalmedium,
                  amountofpaintings: data.paintingOrderedByPagination.collection[i].amountofpaintings,
                  principalmakersproductionplaces: data.paintingOrderedByPagination.collection[i].principalmakersproductionplaces,
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
                    totalCount={data.paintingOrderedByPagination.total}
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

        {/* Dialog Add (only shown when pressed on 'Schilderij toevoegen' button) */}
        <Dialog
          open={this.state.dialogAddPainting}
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
                      <div>{getStepContent(activeStep, this.state, this.handleChange, this.handeImage, this.handleChoosePainterDialog, this.handleChoosePainterDialogClose, this.TableRowChoosePainter)}</div>
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
                  mutation={ADD_PAINTING}
                  onCompleted={(data) => {
                    console.log(`Query complete: ${data.addProduct}`)
                    this.handleClose()
                    this.emptyState()
                    this.props.handleSnackbarOpen('ADD_PAINTING_SUCCESS')
                  }}
                  onError={(err) => {
                    console.log(`Query failed: ${err}`)
                    this.props.handleSnackbarOpen('ADD_PAINTING_ERROR')
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
                            id: this.state.id,
                            title: this.state.title,
                            releasedate: parseInt(this.state.releaseDate),
                            period: parseInt(this.state.period),
                            description: this.state.description,
                            physicalmedium: this.state.physicalMedium,
                            amountofpaintings: this.state.amount,
                            src: this.state.src,
                            bigsrc: this.state.bigsrc,
                            prodplace: this.state.principalMakersProductionPlaces,
                            width: this.state.width,
                            height: this.state.height,
                            principalmaker: this.state.principalMaker,
                            price: this.state.price,
                            rented: this.state.rented,
                            painterId: this.state.principalMakerID
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


        {/* Dialog Edit (only shown when pressed on a table row item) */}
        <Dialog
          open={this.state.dialogEditPainting}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle id="form-dialog-title">Schilderij aanpassen</DialogTitle>


          <DialogContent className="dialog-add-painting">

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => {
                return (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                );
              })}
            </Stepper>

            {/* Show step content */}
            {this.state.activeStep === steps.length ? (
              <div>
                <div>All steps completed</div>
                <Button onClick={this.handleClose}>Reset</Button>
              </div>
            ) : (
                <div>
                  {this.getEditStepContent(activeStep, this.state, this.handleChange)}
                </div>
              )}

          </DialogContent>
          <DialogActions className="buttonsInDialog">
            <MuiThemeProvider theme={themeDeleteButton}>
              <div className="dialog-action-delete">
                {activeStep === 0 ? (
                  <Mutation
                    mutation={DELETE_PAINTING}
                    onCompleted={(data) => {
                      console.log(`Mutation complete: ${data.deleteProduct}`)
                      this.handleClose()
                      this.props.handleSnackbarOpen('DELETE_PAINTING_SUCCESS')
                    }}
                    onError={(err) => {
                      console.log(`Mutation failed: ${err}`)
                      this.props.handleSnackbarOpen('DELETE_PAINTING_ERROR')
                    }}
                  >
                    {(deletePainting) => (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={e => {
                          e.preventDefault()

                          let vars = {
                            id: this.state.paintingID,
                          }

                          console.log(vars)

                          deletePainting({ variables: vars })
                        }}
                      >
                        DELETE
                      </Button>
                    )}

                  </Mutation>

                ) : null}</div>
            </MuiThemeProvider>
            <div className="dialog-action-others"><Button onClick={this.handleClose}>Annuleren</Button></div>
            {activeStep === 1 ? (
              <div>
                <Button disabled={activeStep === 0} onClick={this.handleBack}>
                  Terug
                </Button>
              </div>
            ) : null}
            {activeStep === 1 ? (
              <Mutation
                mutation={EDIT_PAINTING}
                onCompleted={(data) => {
                  console.log(`Query complete: ${data.editProduct}`)
                  this.handleClose()
                  this.emptyState()
                  this.props.handleSnackbarOpen('EDIT_PAINTING_SUCCESS')
                }}
                onError={(err) => {
                  console.log(`Query failed: ${err}`)
                  this.handleClose()
                  this.emptyState()
                  window.location.reload();
                  this.props.handleSnackbarOpen('EDIT_PAINTING_SUCCESS')
                }}
              >
                {(editPainting, { data }) => (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={e => {
                        e.preventDefault()
                        this.checkRented()
                        let vars = {
                          id: this.state.id,
                          id_number: this.state.id_number,
                          title: this.state.title,
                          releasedate: parseInt(this.state.releaseDate),
                          period: parseInt(this.state.period),
                          description: this.state.description,
                          physicalmedium: this.state.physicalMedium,
                          amountofpaintings: this.state.amount,
                          src: this.state.src,
                          bigsrc: this.state.bigsrc,
                          prodplace: this.state.principalMakersProductionPlaces,
                          width: this.state.productWidth,
                          height: this.state.productHeight,
                          principalmaker: this.state.principalMaker,
                          price: this.state.price,
                          rented: false,
                          amountwatched: this.state.amountwatched
                        }

                        console.log(vars)

                        editPainting({ variables: vars })
                      }}>
                      Opslaan
                </Button>
                  </div>
                )}
              </Mutation>
            ) : (
                <Button variant="contained" color="primary" onClick={this.handleNext}>
                  Volgende
                    </Button>
              )}
          </DialogActions>
        </Dialog>
      </section>
    );
  }
}

export default Paintings;