import React, { Component } from 'react';
import {
    Link,
    Redirect
} from 'react-router-dom';
import './Account.css'

// Material-UI
import Button from '@material-ui/core/Button';

// Components
import PageTitle from '../../components/pageLink/PageLink'

class Account extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false
    }
  }

  getTime() {
    let t = new Date().getHours()

    if (t >= 0 & t < 6) {
      return "Goedenavond"
    } else if (t >= 6 && t < 12) {
      return "Goedemorgen"
    } else if (t >= 12 && t < 18) {
      return "Goedemiddag"
    } else {
      return "Goedenavond"
    }
  }

  setUserApp(user, isLoggedIn) {
    this.props.setUser(user, isLoggedIn)
    this.setState({
      redirect: true
    })
  }

  render() {
    const emptyUser = {
      id: '',
      aanhef: '',
      name: '',
      surname: '',
      email: '',
      address: '',
      city: '',
      postalcode: '',
      cellphone: ''
    }

    return (
      <section className="section-container">
        {this.state.redirect ? (
          <Redirect to="/login" push />
        ) : null}
        <PageTitle title="Account"/>
        <p className="account-title-greeting">{this.getTime()}</p>
        <p className="account-title-account">{this.props.user.name}</p>
        <div className="account-list">
          <Link to={`/user/${this.props.user.name}/gegevens`} className="account-account-link">Mijn gegevens</Link>
          <Link to={`/user/${this.props.user.name}/bestellijst`} className="account-account-link">Mijn bestellijst</Link>
          <Link to={`/user/${this.props.user.name}/huurlijst`} className="account-account-link">Mijn huurlijst</Link>
        </div>
        <Button
          color="primary"
          className="logout-button"
          variant="outlined"
          onClick={() => this.setUserApp(emptyUser, false)}
          disabled={this.state.buttonState}
        >
          Log uit
        </Button>
      </section>
    );
  }
}

export default Account;
