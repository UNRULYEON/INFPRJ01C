import React, { Component } from 'react';
import './Paintings.css';

// Material-UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Apollo
import { Query } from "react-apollo";
import gql from "graphql-tag";

const PAINTINGS = gql`
  query Collection{
    collection{
      id_number
      title
      principalmaker
    }
  }
`;

class Paintings extends Component {
  constructor(props) {
    super (props);
    this.state = {
    }
  }

  render() {
    return (
      <section>
        <Query
          query={PAINTINGS}
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
                    {data.collection.map(row => {
                      return (
                        <TableRow key={row.id_number}>
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
                </Table>
              </Paper>
            )
          }}
        </Query>
      </section>
    );
  }
}

export default Paintings;