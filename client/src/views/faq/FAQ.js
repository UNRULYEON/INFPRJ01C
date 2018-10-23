import React, { Component } from 'react';

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Accordion, AccordionItem } from 'react-sanfona';
import './FAQ.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'


const GET_FAQ = gql`
  {
    faq{
      id
      title
      body
    }
  }
`;


class FAQ extends Component {
  render() {
    return (
      <section className="section-container">
        <PageTitle title="FAQ"/>
        <Query
          query={GET_FAQ}
          pollInterval={1000}
          >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <Accordion allowMultiple>
                {data.faq.map(item => {
                  return (
                    <AccordionItem
                      title={item.title}
                      key={item.id}>
                      <div key={item.id}>
                        {item.body}
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )
          }}
        </Query>
      </section>
    );
  }
}

export default FAQ;
