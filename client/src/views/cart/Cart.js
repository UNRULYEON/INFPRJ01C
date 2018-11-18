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

//Date picker
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { TimePicker } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import { DateTimePicker } from 'material-ui-pickers';

// Components
import PageTitle from '../../components/pageLink/PageLink'

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
  constructor(props){
    super(props);
    this.state = {
			cart: this.props.cart.items,
			order: this.props.order.items,
			rental: this.props.rental.items,
			buttonDisabledState: true
    }
	}

	id2List = {
			cart: 'cart',
			order: 'order',
			rental: 'rental'
	};

	getList = id => this.state[this.id2List[id]];

	componentDidMount = () => {
		!this.props.cart.items.length ? this.setState({buttonDisabledState: false}) : this.setState({buttonDisabledState: true})
	}

	onDragEnd = (result) => {
			const { source, destination } = result;

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

					if (result.cart) {
						if (!result.cart.length) {
							this.setState({buttonDisabledState: false})
						} else {
							this.setState({buttonDisabledState: true})
						}
					}

					if (result.cart && result.order) {
						this.props.updateCart(result.cart)
						this.props.updateOrder(result.order)

						this.setState({
							cart: result.cart,
							order: result.order,
						});
					} else if (result.cart && result.rental) {
						this.props.updateCart(result.cart)
						this.props.updateRental(result.rental)

						this.setState({
							cart: result.cart,
							rental: result.rental
						});
					} else if (result.order && result.rental) {
						this.props.updateOrder(result.order)
						this.props.updateRental(result.rental)

						this.setState({
							order: result.order,
							rental: result.rental
						});
					}
				}
	};

	removeFromList(list) {
		console.log('Removing from list')
		console.log(list)
	}

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Winkelwagen"/>
				<DragDropContext onDragEnd={this.onDragEnd}>
					<h3>Winkelwagen</h3>
					<Droppable droppableId="cart" className="droppable-component">
							{(provided, snapshot) => (
									<div
											ref={provided.innerRef}
											style={getListStyle(snapshot.isDraggingOver)}>
											{this.state.cart.map((item, index) => (
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
																						<span className="draggable-details-title">{ item.title }</span>
																					</Link>
																					<span className="draggable-details-maker">{ item.principalmaker }</span>
																				</div>
																				<div className="draggable-action">
																					<IconButton
																						color="primary"
																						aria-label="Delete"
																						// onClick={this.removeFromList(this.state.cart)}
																					>
																						<DeleteIcon />
																					</IconButton>
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
					<h3>Bestellijst</h3>
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
																						<span className="draggable-details-title">{ item.title }</span>
																					</Link>																					<span className="draggable-details-maker">{ item.principalmaker }</span>
																				</div>
																				<div className="draggable-action">
																					<IconButton
																						color="primary"
																						aria-label="Delete"
																						// onClick={this.removeFromList(this.state.order)}
																					>
																						<DeleteIcon />
																					</IconButton>
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
																						<span className="draggable-details-title">{ item.title }</span>
																					</Link>																					<span className="draggable-details-maker">{ item.principalmaker }</span>
																				</div>
																				<div className="draggable-action">
																					<IconButton
																						color="primary"
																						aria-label="Delete"
																						// onClick={this.removeFromList(this.state.rental)}
																					>
																						<DeleteIcon />
																					</IconButton>
																				</div>
																				<div className="draggable-price">
																					<Currency
																						quantity={`${(item.price * item.amount) / 20}`}
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
				<Link to={"/"} className="onboarding-link-login">
					<Button
						color="primary"
						variant="contained"
						disabled={this.state.buttonDisabledState}
					>
						Doorgaan
					</Button>
				</Link>
			</MuiThemeProvider>
			</div>
      </section>
    );
  }
}

export default Cart;
