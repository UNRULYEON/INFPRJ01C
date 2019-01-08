import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];



class Tables extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> Title </TableCell>
                <TableCell> {this.props.colomnName}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{this.props.title}</TableCell>
                  <TableCell component="th" scope="row">{this.props.body}</TableCell>
                </TableRow>

            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default Tables

