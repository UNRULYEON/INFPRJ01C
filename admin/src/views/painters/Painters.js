import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Painters.css';

import { Query } from "react-apollo";
import gql from "graphql-tag";

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

class Painters extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <section>
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
      </section>
    );
  }
}

export default Painters;