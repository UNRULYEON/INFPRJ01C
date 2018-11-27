import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Users.css';

class Users extends Component {
  constructor(props) {
    super (props);
    this.state = {
    }
  }

  render() {
    return (
      <section>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Voornaam</TableCell>
                <TableCell>Achternaam</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Adres</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell numeric>{row.calories}</TableCell>
                    <TableCell numeric>{row.fat}</TableCell>
                    <TableCell numeric>{row.carbs}</TableCell>
                    <TableCell numeric>{row.protein}</TableCell>
                  </TableRow>
                );
              })} */}
            </TableBody>
          </Table>
        </Paper>
      </section>
    );
  }
}

export default Users;