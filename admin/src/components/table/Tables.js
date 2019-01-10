import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// export default function Tables(props){
//   return(
//     <div>
//         <Paper>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell> Title </TableCell>
//                 <TableCell> basic </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {
//                 props.data.map(rows=>(
//                   <TableRow>
//                     <TableCell component="th" scope="row">{rows.title}</TableCell>
//                     <TableCell component="th" scope="row">{rows.body}</TableCell>
//                   </TableRow>
//                 ))
//               }
//             </TableBody>
//           </Table>
//         </Paper>
//       </div>
//   )
// }

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
                <TableCell> {this.props.title} </TableCell>
                <TableCell> {this.props.painter} </TableCell>
                <TableCell> {this.props.colomnName}</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.props.data.map(row => (
                  <TableRow>
                    {this.props.renderRow(row).map(q => <TableCell>{q}</TableCell>)}
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

export default Tables

