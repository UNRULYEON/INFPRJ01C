import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

