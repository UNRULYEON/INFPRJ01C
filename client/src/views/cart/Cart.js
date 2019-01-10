import React, { Component } from 'react';
import {
	Link
} from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Currency from 'react-currency-formatter';
import './Cart.css'

// Material-UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

//Date picker
import DateFnsUtils from '@date-io/date-fns';
import Moment from 'react-moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import nlLocale from 'date-fns/locale/nl';

// Components
import PageTitle from '../../components/pageLink/PageLink'

// Luxon
import DateTime from 'luxon/src/datetime.js'
import LuxonUtils from '@date-io/luxon';

// Material-UI theme for button
const theme = new createMuiTheme({
	palette: {
		primary: {
			main: '#43a047'
		},
	},
	typography: {
		useNextVariants: true,
	},
	overrides: {
		MuiButton: { // Name of the component ⚛️ / style sheet
			root: { // Name of the rule
				color: 'white', // Some CSS
			},
		},
	},
});

const themeRed = new createMuiTheme({
  palette: {
    primary: {
      main: '#FF3D00'
    }
  }
});

const themePink = new createMuiTheme({
  palette: {
    primary: {
      main: '#F06292'
    }
  }
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};

const grid = 6;

const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	borderRadius: 2,
	padding: grid * 2,
	margin: `${grid}px`,
	border: '2px solid rgb(245, 245, 245)',
	background: 'white',
	boxShadow: isDragging ? `0px 5px 15px 0px rgba(50, 50, 50, 0.15)` : `none`,
	transition: '.2s all ease-in-out',

	// styles we need to apply on draggables
	...draggableStyle
});

const getListStyle = isDraggingOver => ({
	// background: isDraggingOver ? 'lightblue' : 'lightgrey',
	border: '1px solid #eeeeee',
	minHeight: '100px',
	borderRadius: 2,
	padding: grid,
	transition: 'height .2s ease-in-out'
});


class Cart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cart: this.props.cart.items,
			order: this.props.order.items,
			rental: this.props.rental.items,
			buttonDisabledState: true,
			showPlaceholder: true
		}
	}

	id2List = {
		cart: 'cart',
		order: 'order',
		rental: 'rental'
	};

	getList = id => this.state[this.id2List[id]];

	componentDidMount = () => {
		this.props.order.items.length >= 1 || this.props.rental.items.length >= 1 ? this.setState({ buttonDisabledState: false }) : this.setState({ buttonDisabledState: true })
		// this.getRentalPrice()
	}

	onDragEnd = (result) => {
		const { source, destination } = result;
		this.setState({ showPlaceholder: false })
		// dropped outside the list
		if (!destination) {
			return;
		}

		if (source.droppableId === destination.droppableId) {
			const cart = reorder(
				this.getList(source.droppableId),
				source.index,
				destination.index
			);

			let state = { cart };

			if (source.droppableId === 'order') {
				state = { order: cart };
			} else if (source.droppableId === 'rental') {
				state = { rental: cart };
			}

			this.setState(state);
		} else {
			const result = move(
				this.getList(source.droppableId),
				this.getList(destination.droppableId),
				source,
				destination
			);

			if (result.cart && result.order) {
				this.props.updateCart(result.cart)
				this.props.updateOrder(result.order)

				if (result.order.length >= 1 || this.state.rental.length >= 1) {
					this.setState({ buttonDisabledState: false })
				} else {
					this.setState({ buttonDisabledState: true })
				}

				this.setState({
					cart: result.cart,
					order: result.order,
				});
			} else if (result.cart && result.rental) {
				this.props.updateCart(result.cart)
				this.props.updateRental(result.rental)

				if (result.rental.length >= 1 || this.state.order.length >= 1) {
					this.setState({ buttonDisabledState: false })
				} else {
					this.setState({ buttonDisabledState: true })
				}

				this.setState({
					cart: result.cart,
					rental: result.rental
				});
			} else if (result.order && result.rental) {
				this.props.updateOrder(result.order)
				this.props.updateRental(result.rental)

				if (result.order.length >= 1 || result.rental.length >= 1) {
					this.setState({ buttonDisabledState: false })
				} else {
					this.setState({ buttonDisabledState: true })
				}

				this.setState({
					order: result.order,
					rental: result.rental
				});
			}
		}
	};

	removeFromList(list, id, type, ADD_TO_FAV) {
		switch (type) {
			case 'CART':
				let newArrCart = []
				for (let i = 0; i < this.state.cart.length; i++) {
					if (this.state.cart[i].id === id) {
						console.log(`Item to remove: ${this.state.cart[i]}`)
						if (ADD_TO_FAV) {
							console.log(`Item is being removed to it can be added to the favorites list`)
							this.props.updateFavorite(this.state.cart[i], 'ADD_TO_FAV_FROM_LIST')
						}
					} else {
						console.log(`pushing to cart: ${this.state.cart[i]}`)
						newArrCart.push(this.state.cart[i])
					}
				}
				console.log(newArrCart)
				this.props.updateCart(newArrCart)
				this.setState({
					cart: newArrCart
				});
				break;
			case 'ORDER':
				let newArrOrder = []
				for (let i = 0; i < this.state.order.length; i++) {
					if (this.state.order[i].id === id) {
						console.log(`Item to remove: ${this.state.order[i]}`)
						if (ADD_TO_FAV) {
							console.log(`Item is being removed to it can be added to the favorites list`)
							this.props.updateFavorite(this.state.order[i], 'ADD_TO_FAV_FROM_LIST')
						}
					} else {
						console.log(`pushing to cart: ${this.state.order[i]}`)
						newArrOrder.push(this.state.order[i])
					}
				}
				console.log(newArrOrder)
				this.props.updateOrder(newArrOrder)
				this.setState({
					order: newArrOrder
				});
				break;
			case 'RENTAL':
				let newArrRental = []
				for (let i = 0; i < this.state.rental.length; i++) {
					if (this.state.rental[i].id === id) {
						console.log(`Item to remove: ${this.state.rental[i]}`)
						if (ADD_TO_FAV) {
							console.log(`Item is being removed to it can be added to the favorites list`)
							this.props.updateFavorite(this.state.rental[i], 'ADD_TO_FAV_FROM_LIST')
						}
					} else {
						console.log(`pushing to cart: ${this.state.rental[i]}`)
						newArrRental.push(this.state.rental[i])
					}
				}
				console.log(newArrRental)
				this.props.updateRental(newArrRental)
				this.setState({
					rental: newArrRental
				});
				break;
			default:
				break;
		}
	}

	handleDateChange = (date, id, type) => {
		let newArr = []
		for (let i = 0; i < this.state.rental.length; i++) {
			if (this.state.rental[i].id === id) {
				let newItem = this.state.rental[i]
				console.log(`Item start date: ${newItem.startDate}`)
				console.log(`Item end date: ${newItem.endDate}`)
				console.log(`Date provided: ${date}`)
				console.log(newItem)

				let one_day = 1000 * 60 * 60 * 24
				let startDate = newItem.startDate.getTime();
				let endDate = newItem.endDate.getTime();
				let dateProv = date.getTime();

				switch (type) {
					case 'startDate':
						let diff_ms_start = endDate - dateProv
						let diff_start = Math.round(diff_ms_start/one_day)
						console.log(`Diff when start is changed: ${diff_start} days`)
						newItem.startDate = date
						newItem.days = diff_start
						newItem.priceWithDays = newItem.price * diff_start
						break;
					case 'endDate':
						let diff_ms_end = dateProv - startDate
						let diff_end = Math.round(diff_ms_end/one_day)
						console.log(`Diff when end is changed: ${diff_end} days`)
						newItem.endDate = date
						newItem.days = diff_end
						newItem.priceWithDays = newItem.price * diff_end
						break;
					default:
						break;
				}
				console.log(`pushing:`)
				newArr.push(newItem)
			} else {
				console.log(`pushing:`)
				console.log(this.state.rental[i])
				newArr.push(this.state.rental[i])
			}
		}
		this.props.updateRental(newArr)
		this.setState({
			rental: newArr
		});
	}

	openPicker = (e) => {
		switch (e) {
			case 'start':
				this.pickerStartDate.open(e);
				break;
			case 'end':
				this.pickerEndDate.open(e);
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<section className="section-container">
				<PageTitle title="Mijn lijst" />
				<DragDropContext onDragEnd={this.onDragEnd}>
					<h3>Mijn lijst</h3>

					<Droppable droppableId="cart" className="droppable-component">
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}>
								{this.state.cart.map((item, index) => (
									<Draggable
										placeholder="empty!"
										key={item.id}
										draggableId={item.id}
										index={index}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className="draggable-component"
												style={getItemStyle(
													snapshot.isDragging,
													provided.draggableProps.style
												)}>
												<div className="draggable-container">
													<div className="draggable-image-container">
														<img src={item.src} alt="Artwork" className="draggable-image" />
													</div>
													<div className="draggable-details">
														<Link to={`/schilderij/${item.id}`}>
															<span className="draggable-details-title">{item.title}</span>
														</Link>
														<span className="draggable-details-maker">{item.principalmaker}</span>
													</div>
													<div className="draggable-action">
														<MuiThemeProvider theme={themePink}>
															<Tooltip title="Verplaats naar je favorietenlijst" enterDelay={500} leaveDelay={200}>
																<IconButton
																	color="primary"
																	aria-label="Verplaats naar je favorietenlijst"
																	onClick={(e) => {
																		e.preventDefault()
																		this.removeFromList(this.state.cart, item.id, 'CART', true)
																	}}
																	style={{ marginRight: '10px' }}
																	>
																	<Icon>
																		favorite
																	</Icon>
																</IconButton>
															</Tooltip>
														</MuiThemeProvider>
														<MuiThemeProvider theme={themeRed}>
															<Tooltip title="Verwijder het item uit je lijst" enterDelay={500} leaveDelay={200}>
																<IconButton
																	color="primary"
																	aria-label="Verwijder het item uit je lijst"
																	onClick={(e) => {
																		e.preventDefault()
																		this.removeFromList(this.state.cart, item.id, 'CART')
																	}}
																	style={{ marginRight: '10px' }}
																	>
																	<Icon>
																		delete
																	</Icon>
																</IconButton>
															</Tooltip>
														</MuiThemeProvider>
													</div>
													<div className="draggable-price">
														<Currency
															quantity={item.price * item.amount}
															symbol="€ "
															decimal=","
															group="."
														/>
													</div>
												</div>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
					<h3>Kooplijst</h3>
					<Droppable droppableId="order">
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}>
								{this.state.order.map((item, index) => (
									<Draggable
										key={item.id}
										draggableId={item.id}
										index={index}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className="draggable-component"
												style={getItemStyle(
													snapshot.isDragging,
													provided.draggableProps.style
												)}>
												<div className="draggable-container">
													<div className="draggable-image-container">
														<img src={item.src} alt="Artwork" className="draggable-image" />
													</div>
													<div className="draggable-details">
														<Link to={`/schilderij/${item.id}`}>
															<span className="draggable-details-title">{item.title}</span>
														</Link>
														<span className="draggable-details-maker">{item.principalmaker}</span>
													</div>
													<div className="draggable-action">
														<MuiThemeProvider theme={themePink}>
															<Tooltip title="Verplaats naar je favorietenlijst" enterDelay={500} leaveDelay={200}>
																<IconButton
																	color="primary"
																	aria-label="Verplaats naar je favorietenlijst"
																	onClick={(e) => {
																		e.preventDefault()
																		this.removeFromList(this.state.cart, item.id, 'ORDER', true)
																	}}
																	style={{ marginRight: '10px' }}
																	>
																	<Icon>
																		favorite
																	</Icon>
																</IconButton>
															</Tooltip>
														</MuiThemeProvider>
														<MuiThemeProvider theme={themeRed}>
															<Tooltip title="Verwijder het item uit je kooplijst" enterDelay={500} leaveDelay={200}>
																<IconButton
																	color="primary"
																	aria-label="Verwijder het item uit je kooplijst"
																	onClick={(e) => {
																		e.preventDefault()
																		this.removeFromList(this.state.cart, item.id, 'ORDER')
																	}}
																	style={{ marginRight: '10px' }}
																	>
																	<Icon>
																		delete
																	</Icon>
																</IconButton>
															</Tooltip>
														</MuiThemeProvider>
													</div>
													<div className="draggable-price">
														<Currency
															quantity={item.price * item.amount}
															symbol="€ "
															decimal=","
															group="."
														/>
													</div>
												</div>
											</div>
										)}
									</Draggable>
								))}

								{provided.placeholder}
							</div>
						)}
					</Droppable>
					<div className="cart-shipping">
						<div>Verzendkosten</div>
						<div className="cart-shipping-price">Gratis</div>
					</div>
					<div className="cart-total">
						<div>Totaal bestellijst</div>
						<div className="cart-shipping-price">
							<Currency
								quantity={this.props.order.total}
								symbol="€ "
								decimal=","
								group="."
							/>
						</div>
					</div>
					<h3>Huurlijst</h3>
					<Droppable droppableId="rental">
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}>
								{this.state.rental.map((item, index) => (
									<Draggable
										key={item.id}
										draggableId={item.id}
										index={index}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className="draggable-component"
												style={getItemStyle(
													snapshot.isDragging,
													provided.draggableProps.style
												)}>
												<div className="draggable-container">
													<div className="draggable-image-container">
														<img src={item.src} alt="Artwork" className="draggable-image" />
													</div>
													<div className="draggable-details">
														<Link to={`/schilderij/${item.id}`}>
															<span className="draggable-details-title">{item.title}</span>
														</Link>
														<span className="draggable-details-maker">{item.principalmaker}</span>
													</div>
													<div className="draggable-action">
														<div className="draggable-action-date">
															<MuiPickersUtilsProvider
																utils={DateFnsUtils}
																locale={nlLocale}
															>
																<div>
																	<span style={{ minWidth: '40px' }}>
																		Van:
																	</span>
																	<Tooltip title="Wijzig start-datum" enterDelay={500} leaveDelay={200}>
																		<Button onClick={() => { this.openPicker('start') }}>
																			<Moment
																				format="DD-MM-YYYY"
																				date={item.startDate}
																			/>
																		</Button>
																	</Tooltip>
																	<div className="picker">
      															<MuiPickersUtilsProvider utils={DateFnsUtils}>
																			<DatePicker
																				label="Startdatum"
																				todayLabel="Vandaag"
																				cancelLabel="Annuleren"
																				format="dd-MM-yyyy"
																				maxDate={item.endDate}
																				disablePast
																				showTodayButton
																				maxDateMessage="Date must be less than today"
																				value={item.startDate}
																				onChange={(date) => {
																					this.handleDateChange(date, item.id, 'startDate')
																				}}
																				ref={node => {
																					this.pickerStartDate = node;
																				}}
																			/>
																		</MuiPickersUtilsProvider>
																	</div>
																</div>
																<div>
																	<span style={{ minWidth: '40px' }}>
																		Tot:
																	</span>
																	<Tooltip title="Wijzig eind-datum" enterDelay={500} leaveDelay={200}>
																		<Button onClick={() => { this.openPicker('end') }}>
																			<Moment
																				format="DD-MM-YYYY"
																				date={item.endDate}
																			/>
																		</Button>
																	</Tooltip>
																	<div className="picker">
      															<MuiPickersUtilsProvider utils={DateFnsUtils}>
																			<DatePicker
																				label="Einddatum"
																				todayLabel="Vandaag"
																				cancelLabel="Annuleren"
																				format="dd-MM-yyyy"
																				minDate={item.startDate}
																				disablePast
																				showTodayButton
																				maxDateMessage="Date must be less than today"
																				value={item.endDate}
																				onChange={(date) => {
																					this.handleDateChange(date, item.id, 'endDate')
																				}}
																				ref={node => {
																					this.pickerEndDate = node;
																				}}
																			/>
																		</MuiPickersUtilsProvider>
																	</div>
																</div>
															</MuiPickersUtilsProvider>
														</div>
														<MuiThemeProvider theme={themePink}>
															<Tooltip title="Verplaats naar je favorietenlijst" enterDelay={500} leaveDelay={200}>
																<IconButton
																	color="primary"
																	aria-label="Verplaats naar je favorietenlijst"
																	onClick={(e) => {
																		e.preventDefault()
																		this.removeFromList(this.state.cart, item.id, 'RENTAL', true)
																	}}
																	style={{ marginRight: '10px' }}
																	>
																	<Icon>
																		favorite
																	</Icon>
																</IconButton>
															</Tooltip>
														</MuiThemeProvider>
														<MuiThemeProvider theme={themeRed}>
															<Tooltip title="Verwijder het item uit je huurlijst" enterDelay={500} leaveDelay={200}>
																<IconButton
																	color="primary"
																	aria-label="Verwijder het item uit je huurlijst"
																	onClick={(e) => {
																		e.preventDefault()
																		this.removeFromList(this.state.cart, item.id, 'RENTAL')
																	}}
																	style={{ marginRight: '10px' }}
																	>
																	<Icon>
																		delete
																	</Icon>
																</IconButton>
															</Tooltip>
														</MuiThemeProvider>
													</div>
													<div className="draggable-price">
														<Currency
															quantity={(item.priceWithDays * item.amount) / 20}
															symbol="€ "
															decimal=","
															group="."
														/>
														&nbsp;/ dag
																				</div>
												</div>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
					<div className="cart-shipping">
						<div>Verzendkosten</div>
						<div className="cart-shipping-price">Gratis</div>
					</div>
					<div className="cart-total">
						<div>Totaal huurlijst</div>
						<div className="cart-shipping-price">
							<Currency
								quantity={this.props.rental.total}
								symbol="€ "
								decimal=","
								group="."
							/>
						</div>
					</div>
				</DragDropContext>
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
				<div className="cart-button-next">
					<MuiThemeProvider theme={theme}>
						{this.props.loggedIn ? (
							<Link to={"/order"} className="cart-button-continue">
								<Button
									color="primary"
									variant="contained"
									disabled={this.state.buttonDisabledState}
								>
									Doorgaan
					</Button>
							</Link>
						) : (
								<Link to={"/login-redirect"} className="cart-button-continue">
									<Button
										color="primary"
										variant="contained"
										disabled={this.state.buttonDisabledState}
									>
										Doorgaan
					</Button>
								</Link>
							)}
					</MuiThemeProvider>
				</div>
			</section>
		);
	}
}

export default Cart;
