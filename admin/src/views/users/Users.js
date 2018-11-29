import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Users.css';

//Edit icon
import Edit from '../../icons/Edit.svg';

//Linking to userdetail page
import {Link} from 'react-router-dom';

//other route imports (testing)
import {Route} from 'react-router';
import  { Redirect } from 'react-router-dom'
import {BrowserRouter} from 'react-router';

// Apollo
import { Query } from "react-apollo";
import gql from "graphql-tag";


const USERS = gql`
  query users{
    selectsallusers{
      id
      name
      surname
      mail
      adres
    }
  }
`;

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: 404
    }
  }

  gotolink(id){
    return "/gebruiker/" + id;
  }

  

  render() {
    return (
      <section>
        <Query
          query={USERS}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading... :)</p>;
            if (error) return <p>Error :(</p>;

            return (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                    <TableCell></TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Voornaam</TableCell>
                      <TableCell>Achternaam</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Adres</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.selectsallusers.map(row => {
                      return (
                        <TableRow key={row.id} hover onClick={() => {
                          console.log(`clicked on ${row.id}`)
                          this.props.history.push('/gebruiker/' + row.id)
                        }}>
                          <TableCell>
                            <Link to={this.gotolink(row.id)}><img src={Edit} alt="Edit" /></Link>
                          </TableCell>
                          <TableCell >
                            {row.id}
                          </TableCell>
                          <TableCell>
                            {row.name}
                          </TableCell>
                          <TableCell>
                            {row.surname}
                          </TableCell>
                          <TableCell>
                            {row.mail}
                          </TableCell>
                          <TableCell>
                            {row.adres}
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

// <img src={Edit} alt="Edit" />
// <Link to={this.gotolink(row.id)}/>

export default Users;