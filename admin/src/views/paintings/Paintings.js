import React, { Component } from 'react';
import './Paintings.css';

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
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
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

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
			title
			releasedate
			period
			description
			physicalmedium
			amountofpaintings
			principalmaker
			bigsrc
			src
			width
			height
			price
      painter
      principalmakersproductionplaces
		}
	}
`;

const PAINTINGS = gql`
  query paintingsPAG($page: Int!, $amount: Int!){
    paintingOrderedByPagination(page: $page, amount: $amount){
      total
      collection{
        title
        id_number
        principalmaker
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
    $rented: Boolean!,
    $painterId:Int!) {
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
      rented: $rented,
      painterId: $painterId)
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

function getStepsAanmaken() {
  return ['Vul informatie in', 'Review schilderij'];
}

// function getStepsAanpassen() {
//   return ['Vul informatie in', 'Review schilderij'];
// }

function getStepContent(stepIndex, state, handleChange, handeImage, handleChoosePainterDialog, handleChoosePainterDialogClose, handleChosenPainter) {
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
              <InputLabel htmlFor="add-price">Prijs (wordt berekend</InputLabel>
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Naam</TableCell>
                    </TableRow>
                  </TableHead>
                  <Query query={PAINTERS}>
                    {({ loading, error, data }) => {
                      if (loading) return "Loading...";
                      if (error) return `Error! ${error.message}`;

                      return (
                        <TableBody>
                          {data.paintersAll.map(row => {
                            return (
                              <TableRow
                                hover
                                onClick={() => {
                                  handleChosenPainter(row.name, row.id)
                                  handleChoosePainterDialogClose()
                                }}
                                tabIndex={-1}
                                key={row.id}
                              >
                                <TableCell component="th" scope="row">
                                  {row.name}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      );
                    }}
                  </Query>
                </Table>
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
class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { count, page, rowsPerPage } = this.props;

    return (
      <div className='footer-actions'>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="Eerste pagina"
        >
          <FirstPageIcon/>
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Vorige pagina"
        >
          <KeyboardArrowLeft/>
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Volgende pagina"
        >
          <KeyboardArrowRight/>
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Laatste pagina"
        >
          <LastPageIcon/>
        </IconButton>
      </div>
    );
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
      principalMaker: '',
      principalMakerID: 0,
      price: 0,
      rented: false,
      paintingID: '',
      dialogEditPainting: false,
      changeState: false,
      page: 0,
      rowsPerPage: 10
    }
  }

  queryInState(data) {
    console.log(data)
    this.setState({
      title: data,
    })
  }

  getEditStepContent(stepIndex, state, handleChange) {
    switch (stepIndex) {
      case 0:
        return (
          <Query
            query={GET_ART_DETAILS}
            variables={{ id: state.paintingID }}
            onCompleted={(data) => {
              if(this.state.title === ''){
                this.setState({
                  title: data.paintingByID[0].title,
                  releaseDate: data.paintingByID[0].releasedate,
                  period: data.paintingByID[0].period,
                  description: data.paintingByID[0].description,
                  physicalMedium: data.paintingByID[0].physicalmedium,
                  principalMakersProductionPlaces: data.paintingByID[0].principalmakersproductionplaces,
                })
              }
              
            }}
          >
            {({ loading, error, data }) => {
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
                      <Input id="add-amount" inputProps={{ readOnly: true, }} value={state.amount} />
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
                      <Input id="add-price" inputProps={{ readOnly: true, }} value={state.price} />
                      <FormHelperText id="add-price-error-text"></FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

              )
            }}
          </Query>
        );
      case 1:
        return (
          <Grid>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <Grid item xs={12}>
                  <span>Titel</span>
                  <span>{state.title}</span>
                </Grid>
                <Grid item xs={12} sm={6} className="add-painting-review-container">
                  <span>Gemaakt in (jaar)</span>
                  <span>{state.releaseDate}</span>
                </Grid>
                <Grid item xs={12} sm={6} className="add-painting-review-container">
                  <span>Periode (eeuw)</span>
                  <span>{state.period}</span>
                </Grid>
                <Grid item cs={12}>
                  <span>Schilder</span>
                  <span>{state.principalMaker}</span>
                </Grid>
                <Grid item xs={12} className="add-painting-review-container">
                  <span>Beschrijving</span>
                  <span>{state.description}</span>
                </Grid>

              </Grid>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={6} className="add-painting-review-container">
                  <span>Gemaakt op (materiaal)</span>
                  <span>{state.physicalMedium}</span>
                </Grid>
                <Grid item xs={12} sm={6} className="add-painting-review-container">
                  <span>Hoeveelheid</span>
                  <span>{state.amount}</span>
                </Grid>
                <Grid item xs={12} sm={6} className="add-painting-review-container">
                  <span>Gemaakt in (stad)</span>
                  <span>{state.principalMakersProductionPlaces}</span>
                </Grid>

                <Grid item cs={12}>
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
          </Grid>
        );
      default:
        return 'Unknown stepIndex';
    }
  }

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
      id: Math.floor((Math.random() * 10000000000000) + 1).toString()
    });
  };

  EditPaintingDialog = () => {
    console.log("EditPaintingDialog called")

  }

  handleChoosePainterDialog = () => {
    this.setState({
      dialogChoosePainter: true
    });
  }

  handleChoosePainterDialogClose = () => {
    this.setState({
      dialogChoosePainter: false
    });
  }

  handleChosenPainter = (painter, id) => {
    this.setState({
      principalMaker: painter,
      principalMakerID: id
    });
  }

  // Handle dialog when closing
  handleClose = () => {
    this.setState({ dialogAddPainting: false, dialogEditPainting: false });
    this.emptyState()
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
      // ['src', this.state.src],
      // ['bigsrc', this.state.bigsrc],
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
      width: '',
      height: '',
      principalMaker: '',
      principalMakerError: false,
      principalMakerErrorMsg: '',
      price: 0,
      activeStep: 0,
      changeState: true,
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
    const { rowsPerPage, page } = this.state;

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
            page: page,
            amount: rowsPerPage
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading... :)</p>;
            if (error) return <p>Error :(</p>;

            return (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Titel</TableCell>
                      <TableCell>Schilder</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.paintingOrderedByPagination.collection.map(row => {
                      return (
                        <TableRow
                          hover
                          onClick={() => {
                            this.handleAanpassenDialog(row.id_number)
                          }}
                          // onClick={() => {
                          //   console.log(`Clicked on ${row.id_number}`)
                          //   this.props.history.push(`/schilderij/${row.id_number}`)
                          // }}
                          tabIndex={-1}
                          key={row.id_number}
                        >
                          <TableCell component="th" scope="row">
                            {row.title}
                          </TableCell>
                          <TableCell>
                            {row.principalmaker}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow className='footer-row'>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        colSpan={5}
                        count={data.paintingOrderedByPagination.total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
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
                      <div>{getStepContent(activeStep, this.state, this.handleChange, this.handeImage, this.handleChoosePainterDialog, this.handleChoosePainterDialogClose, this.handleChosenPainter)}</div>
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
                            rented: this.state.rented
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
          <DialogActions>
            <Button onClick={this.handleClose}>Annuleren</Button>
            {activeStep === 1 ? (
              <div>
                <Button disabled={activeStep === 0} onClick={this.handleBack}>
                  Terug
                      </Button>
              </div>
            ) : null}
            {activeStep === 1 ? (
              <Button disabled>Opslaan</Button>
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