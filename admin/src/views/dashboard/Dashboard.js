import React, { Component } from 'react';
import './Dashboard.css';
import Charts from '../../components/chart/Charts.js'
import Tables from '../../components/table/Tables.js'
import Grid from '@material-ui/core/Grid';
// Apollo
import { Query } from "react-apollo";
import gql from "graphql-tag";


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
      amountofpaintings
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

const amountRented = gql`
  query amountRentedPaintings{
    amountRentedPaintings
  }
`;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <section className="dashboardSection">
        <Grid container>
          <Grid item xs id="meestBekeken">
            <Query query={populair} pollInterval={5000}>
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;

                const rowData = (row) => [row.title, row.principalmaker, row.amountwatched]

                return (
                  <div>
                    <Charts data={data.popularpaintings} title="title" amountwatched="amountwatched" />

                    Top 5 meest bekeken schilderijen
                    <Tables data={data.popularpaintings} renderRow={rowData} title="Title" painter="Schilder" colomnName="Aantal" />
                  </div>
                )
              }}
            </Query>
          </Grid>

          <Grid item xs id="meestVerkocht">

            <Query query={bestSold} pollInterval={5000}>
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error</p>;

                const rowData = (row) => [row.title, row.principalmaker, (100 - row.amountofpaintings)]

                return (
                  <div>
                    Top 5 meest verkochte artikelen
                    <Tables data={data.bestsellingpaintings} renderRow={rowData} title="Title" painter="Schilder" colomnName="Aantal" />
                  </div>
                )
              }}
            </Query>

          </Grid>

          <Grid container id="minstBekekenEnVerkocht">

            <Grid item xs id="minstBekeken">
              <Query query={unpopulair} pollInterval={5000}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <p>Error</p>;

                  const rowData = (row) => [row.title, row.principalmaker, row.amountwatched]

                  return (
                    <div>
                      Top 5 minst bekeken schilderijen
                    <Tables data={data.unpopularpaintings} renderRow={rowData} title="Title" painter="Schilder" colomnName="Aantal" />
                    </div>
                  )
                }}
              </Query>
            </Grid>

            <Grid item xs={1} />

            <Grid item xs id="minstVerkocht">
              <Query query={leastSold} pollInterval={5000}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <p>Error</p>;

                  const rowData = (row) => [row.title, row.principalmaker, (100 - row.amountofpaintings)]

                  return (
                    <div>
                      Top 5 minst verkochte schilderijen
                    <Tables data={data.leastsellingpaintings} renderRow={rowData} title="Title" painter="Schilder" colomnName="Aantal" />
                    </div>
                  )
                }}
              </Query>

            </Grid>
          </Grid>

          <Grid container id="aantalGebruikersEnVerhuurd">

            <Grid item xs id="aantalGebruikers">
              <Query query={aantalGebruikers} variables={{ amount: 1, page: 1 }}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <p>Error</p>;
                  return (
                    <div>Totaal aantal gebruikers: {data.selectAllUsers.total}</div>
                  )
                }}
              </Query>
            </Grid>

            <Grid item xs id="aantalVerhuurd">
              <Query query={amountRented} pollInterval={5000}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Loading...</p>
                  if (error) return <p>Error</p>
                  return (
                    <div>Aantal verhuurde schilderijen momenteel: {data.amountRentedPaintings}</div>
                  )
                }}
              </Query>
            </Grid>
          </Grid>
        </Grid>
      </section >
    );
  }
}



export default Dashboard;