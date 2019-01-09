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
  query bestSold{
    bestsellingpaintings{
      id
      title
      principalmaker
      amountofpaintings
    }
  }
`;

const populair = gql`
  query popularpaintings{
    popularpaintings{
      id
      title
      principalmaker
      amountwatched
    }
  }
`;

const leastSold = gql`
  query leastsellingpaintings{
    leastsellingpaintings{
      id
      title
      principalmaker
      amountofpaintings
    }
  }
`;

const unpopulair = gql`
  query unpopularpaintings{
    unpopularpaintings{
      id
      title
      principalmaker
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
          {/* <Grid item xs={5} container={false}>

            <Button onClick={this.toggleShowLine.bind(this)}>Line Example</Button>
            <Charts showLine={this.state.showLine} data={data} />

          </Grid> */}




          <Grid item xs id="meestBekeken">
            <Query
              query={populair}
              pollInterval={5000}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;

                let rows = []

                for (let i = 0; i < data.popularpaintings.length; i++) {
                  rows.push(
                    {
                      title: data.popularpaintings[i].title,
                      painter: data.popularpaintings[i].principalmaker,
                      body: data.popularpaintings[i].amountwatched
                    }
                  )
                }

                return (
                  <div>
                    top 5 meest bekeken schilderijen
                    <Paper>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell> Title </TableCell>
                            <TableCell> Schilder </TableCell>
                            <TableCell> Aantal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            rows.map(row => (
                              <TableRow>
                                <TableCell component="th" scope="row">{row.title}</TableCell>
                                <TableCell component="th" scope="row">{row.painter}</TableCell>
                                <TableCell component="th" scope="row">{row.body}</TableCell>
                              </TableRow>
                            ))
                          }

                        </TableBody>
                      </Table>
                    </Paper>
                  </div>
                )
              }}
            </Query>

          </Grid>

          <Grid item xs={1} />

          <Grid item xs id="meestVerkocht">

            <Query
              query={bestSold}
              pollInterval={5000}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;

                let rows = []

                for (let i = 0; i < data.bestsellingpaintings.length; i++) {
                  rows.push(
                    {
                      title: data.bestsellingpaintings[i].title,
                      painter: data.bestsellingpaintings[i].principalmaker,
                      body: data.bestsellingpaintings[i].amountofpaintings
                    }
                  )
                }

                return (
                  // <div>
                  // {
                  //   rows.map(row=>(
                  //     <Tables colomnName='Meest verkocht' title={row.title} body={row.body} rows={rows}/>
                  //   ))
                  // }
                  // <Tables colomnName='Meest verkocht' rows={rows} {rows.map(row=>(

                  //   ))}>

                  // </Tables>
                  // </div>

                  <div>
                    Top 5 meest verkochte artikelen
                    <Paper>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell> Title </TableCell>
                            <TableCell> Schilder </TableCell>
                            <TableCell> Aantal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            rows.map(row => (
                              <TableRow>
                                <TableCell component="th" scope="row">{row.title}</TableCell>
                                <TableCell component="th" scope="row">{row.painter}</TableCell>
                                <TableCell component="th" scope="row">{100 - row.body}</TableCell>
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


          </Grid>
          <Grid container>    

          <Grid item xs id="minstBekeken">
            <Query
              query={unpopulair}
              pollInterval={5000}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;

                let rows = []

                for (let i = 0; i < data.unpopularpaintings.length; i++) {
                  rows.push(
                    {
                      title: data.unpopularpaintings[i].title,
                      body: data.unpopularpaintings[i].amountwatched
                    }
                  )
                }

                return (
                  <div>
                    Top 5 minst bekeken schilderijen
                    <Paper>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell> Title </TableCell>
                            <TableCell> Aantal </TableCell>
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
              }}
            </Query>

          </Grid>

          <Grid item xs={1} />

          <Grid item xs id="minstVerkocht">
            <Query
              query={leastSold}
              pollInterval={5000}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;

                let rows = []

                for (let i = 0; i < data.leastsellingpaintings.length; i++) {
                  rows.push(
                    {
                      title: data.leastsellingpaintings[i].title,
                      body: data.leastsellingpaintings[i].amountofpaintings
                    }
                  )
                }

                return (
                  <div>
                    Top 5 minst verkochte schilderijen
                    <Paper>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell> Title </TableCell>
                            <TableCell> Aantal </TableCell>
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
              }}
            </Query>

          </Grid>


          <Grid item xs={8}>

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

        </Grid>
      </section >
    );
  }
}



export default Dashboard;