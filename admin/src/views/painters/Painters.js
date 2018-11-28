import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Painters.css';

class Painters extends Component {
  constructor(props) {
    super (props);
    this.state = {
      dialogAddUser: false,
      title: '',
      titleError: false,
      titleErrorMsg: '',
      releaseDate: '',
      releaseDateError: false,
      releaseDateErrorMsg: '',
      period: '',
      periodError: false,
      periodErrorMsg: '',
      description: '',
      descriptionError: false,
      descriptionErrorMsg: '',
      physicalMedium: '',
      physicalMediumError: false,
      physicalMediumErrorMsg: '',
      amountOfMedium: 1,
      src: '',
      srcError: false,
      srcErrorMsg: '',
      bigsrc: '',
      bigsrcError: false,
      bigsrcErrorMsg: '',
      plaqueDescriptionDutch: '',
      plaqueDescriptionDutchError: false,
      plaqueDescriptionDutchErrorMsg: '',
      principalMakersProductionPlaces: '',
      principalMakersProductionPlacesError: false,
      principalMakersProductionPlacesErrorMsg: '',
      width: '',
      widthError: false,
      widthErrorMsg: '',
      height: '',
      heightError: false,
      heightErrorMsg: '',
      principalMaker: '',
      principalMakerError: false,
      principalMakerErrorMsg: '',
      price: 0,
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
                <TableCell>Schilderijen</TableCell>
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

export default Painters;