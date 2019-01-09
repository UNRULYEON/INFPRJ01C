import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import './ListAccordion.css'

// GraphQL
import { Query } from "react-apollo";
import gql from "graphql-tag";

// Accordion
import { Accordion, AccordionItem } from 'react-sanfona';

// Luxon
import { DateTime } from "luxon";

// Currency
import Currency from 'react-currency-formatter';

const GET_PAINTING_DETAILS = gql`
  query Painting($id: String!){
    paintingByID(id: $id){
      title
      src
      price
      principalmaker
      id_number
    }
  }
`;

const Title = (props) => {
  let date = DateTime.fromISO(props.purchasedate)
  if (date.isvalid) {
    date = DateTime.fromISO(props.purchasedate).setLocale('nl').toFormat('EEEE d MMMM y')
  } else {
    date = DateTime.fromFormat(props.purchasedate, 'yyyy-M-dd').setLocale('nl').toFormat('EEEE d MMMM y')
  }
  return date.toString()
}

class ListAccordion extends Component {
  constructor(props){
    super(props);
    this.state = {
      total: 0
    }
  }

  componentDidMount = () => {
    console.log(this.props.data)
  }

  SetTotal = (price) => {
    console.log(price)
    this.setState((prevState, price) => ({
      total: prevState.total + price
    }))
  }

  render() {

    return (
      <div>
        <Accordion allowMultiple>
          {this.props.data.map(order => {
            return (
              <AccordionItem
                title={Title(order)}
                key={order.id}>
                <div>
                  {order.items.map((item, key) => {
                    return (
                      <Query
                        query={GET_PAINTING_DETAILS}
                        variables={{ id: item.items.toString() }}
                        key={key}
                      >
                        {({ loading, error, data, total }) => {
                          if (loading) return <p>Loading... :)</p>
                          if (error) return <p>error :(</p>

                          return (
                            <div className="draggable-container list-acc-painting-container">
                              <div className="draggable-image-container">
                                <img src={data.paintingByID[0].src} alt="Artwork" className="draggable-image" />
                              </div>
                              <div className="draggable-details">
                                <Link to={`/schilderij/${data.paintingByID[0].id_number.toString()}`}>
                                  <span className="draggable-details-title">{data.paintingByID[0].title}</span>
                                </Link>
                                <span className="draggable-details-maker">{data.paintingByID[0].principalmaker}</span>
                              </div>
													    <div className="draggable-action"></div>
                              <div className="draggable-price">
                                <Currency
                                  quantity={data.paintingByID[0].price}
                                  symbol="€ "
                                  decimal=","
                                  group="."
                                />
                              </div>
                            </div>
                          )
                        }}
                      </Query>
                    )
                  })}
                  <p className="list-acc-total">
                    Totaal:
                    <Currency
                      className="list-acc-total"
                      quantity={order.total}
                      symbol="€ "
                      decimal=","
                      group="."
                    />
                  </p>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }
}

export default ListAccordion;
