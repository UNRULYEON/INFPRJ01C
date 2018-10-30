import React, { Component } from 'react';

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import './Login.css'

// Components
import PageTitle from '../../components/pageLink/PageLink'

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  updateState(type, evt) {
    switch(type) {
      case 'email':
        this.setState({
          email: evt.target.value
        })
        break;
      case 'password':
        this.setState({
          password: evt.target.value
        })
        break;
    }
  }

  signIn () {
    console.log('Email: ' + this.state.email)
    console.log('Password: ' + this.state.password)
  }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Login" center={true}/>
        <div className="login-container">
          <form className="login-form">
            <input placeholder="Email" type="email" value={this.state.email} onChange={this.updateState.bind(this, 'email')}></input>
            <input placeholder="Wachtwoord" type="password" value={this.state.password}  onChange={this.updateState.bind(this, 'password')}></input>
          </form>
          <button
            className="dropdown-button-login"
            onClick={this.signIn}
          >Inloggen</button>
          <button className="dropdown-button-create-account">Maak een account aan</button>
        </div>
      </section>
    );
  }
}

export default Login;
