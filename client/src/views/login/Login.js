import React, { Component } from 'react';

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { BrowserRouter as Router } from 'react-router-dom'

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

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Login" center={true}/>
        <div className="login-container">
          <form className="login-form">
            <input placeholder="Email" type="email" value={this.state.email} onChange={this.updateState.bind(this, 'email')}></input>
            <input placeholder="Wachtwoord" type="password" value={this.state.password}  onChange={this.updateState.bind(this, 'password')}></input>
          </form>
          <Mutation
            mutation={LOGIN}
            ignoreResults={false}
            onCompleted={(data) => {
              console.log(`Query completed: ${data.login}`)
              localStorage.setItem('AUTH_TOKEN', data.login)
              this.props.history.push("/")
            }}
            onError={(error) => {
              console.log(error)
            }}
          >
            {(login) => (
              <button
                className="dropdown-button-login"
                onClick={e => {
                  e.preventDefault();
                  login({ variables: {
                    email: this.state.email,
                    password: this.state.password
                   }});
                }}
              >Inloggen</button>
            )}
          </Mutation>
          <button className="dropdown-button-create-account">Maak een account aan</button>
        </div>
      </section>
    );
  }
}

export default Login;
