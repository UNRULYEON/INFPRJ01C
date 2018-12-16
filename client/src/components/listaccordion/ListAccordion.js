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

const GET_PAINTING_DETAILS = gql`
  query Painting($id: String!){
    paintingByID(id: $id){
      title
    }
  }
`;

class ListAccordion extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount = () => {
    
  }

  render() {
    return (
      <div>
        {this.props.data.map((order, key) => {
            <Query
              query={GET_PAINTING_DETAILS}
              variables={{ id: order.items.toString() }}
              key={order.id}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading... :)</p>;
                if (error) return <p>Error :(</p>;

                console.log(data)

                return (
                  <Accordion allowMultiple>
                    <AccordionItem
                      title={data.paintingByID[0].title}
                      key={data.paintingByID[0].id_number}>
                      <div>
                        test
                      </div>
                    </AccordionItem>
                  </Accordion>
                )
              }}
            </Query>
        })}
        <Accordion allowMultiple>
          <AccordionItem
            title={this.props.data[0].status}
            key={this.props.data[0].buyerid}>
            <div>
              test
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

export default ListAccordion;
