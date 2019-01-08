import React, { Component } from 'react';
import './Dashboard.css';
import Charts from '../../components/chart/Charts.js'
import Tables from '../../components/table/Tables.js'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';
// Apollo
import { Query } from "react-apollo";
import gql from "graphql-tag";


const data = [
  { name: 'Maandag', aantal: 4000, pv: 2400, amt: 2400 },
  { name: 'Dinsdag', aantal: 3000, pv: 1398, amt: 2210 },
  { name: 'Woensdag', aantal: 2000, pv: 9800, amt: 2290 },
  { name: 'Donderdag', aantal: 2780, pv: 3908, amt: 2000 },
  { name: 'Vrijdag', aantal: 1890, pv: 4800, amt: 2181 },
  { name: 'Zaterdag', aantal: 2390, pv: 3800, amt: 2500 },
  { name: 'Zondag', aantal: 3490, pv: 4300, amt: 2100 },
];



const aantalGebruikers = gql`
  query gebruiker($amount: Int!, $page: Int!){
    selectAllUsers(amount: $amount, page: $page){
      total
    }
  }
`;

const bestSold = gql`
  query thebest{
    bestsellingpaintings{
      id
      title
      amountwatched
    }
  }
`;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLine: false,
      aantalGebruikers: 0,
      gebruikersGeteld: false,
      rows: [],
    }
  }

  toggleShowLine() {
    this.state.showLine ? this.setState({ showLine: false }) : this.setState({ showLine: true })
  }

  render() {
    return (
      <section className="dashboardSection">
        <Grid container id="aantalGebruikers">
          <Grid item xs={5}>

            <Button onClick={this.toggleShowLine.bind(this)}>Line Example</Button>
            <Charts showLine={this.state.showLine} data={data} />

          </Grid>

          <Grid item xs={5}>

            <Query
              query={aantalGebruikers}
              variables={{ amount: 1, page: 1 }}
              onCompleted={(data) => {
                if (this.state.gebruikersGeteld === false) {
                  this.setState({
                    aantalGebruikers: data.selectAllUsers.total,
                    gebruikersGeteld: true,
                  })
                }
              }}
            >
              {({ loading, error }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;
                return (
                  <div>Aantal gebruikers: {this.state.aantalGebruikers}</div>
                )
              }}
            </Query>

          </Grid>

          <Grid item xs={6}>
            <Tables colomnName='meest bekeken' />

          </Grid>
          <Grid item xs={6} id="meestVerkocht">

            <Query
              query={bestSold}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;

                let rows = []

                for (let i = 0; i < data.bestsellingpaintings.length; i++) {
                  console.log(data.bestsellingpaintings[i])
                  rows.push(
                    {
                      title: data.bestsellingpaintings[i].title,
                      body: data.bestsellingpaintings[i].amountwatched
                    }
                  )
                }



                return (
                  <div>
                    <Paper>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell> Title </TableCell>
                            <TableCell> meest verkocht</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            rows.map(row => (
                              <TableRow>
                                <TableCell component="th" scope="row">{row.title}</TableCell>
                                <TableCell component="th" scope="row">{row.body}</TableCell>
                              </TableRow>
                            ))
                          }

                        </TableBody>
                      </Table>
                    </Paper>
                  </div>
                )
                //   <Tables colomnName={'meest verkocht'} data={data}  />
                //   {console.log(data.bestsellingpaintings[0].amountwatched)}
                //   {console.log(data)}
              }}

            </Query>

          </Grid>

          <Grid item xs={8} id="minstBekeken">
            <Tables colomnName='minst bekeken' />

          </Grid>

          <Grid item xs={8} id="minstVerkocht">
            <Tables colomnName='minst verkocht' />

          </Grid>

        </Grid>
      </section >
    );
  }
}



export default Dashboard;