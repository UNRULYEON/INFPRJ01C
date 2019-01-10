import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import './Favorite.css'

// MaterialUI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';

// GraphQL
import { ApolloConsumer } from 'react-apollo';
import { Query } from "react-apollo";
import gql from "graphql-tag";

// Components
import PageTitle from '../../components/pageLink/PageLink'

// Icons
import logo from '../../icons/logo.svg';

const GET_FAVORITES = gql`
query WishlistSelect($userId: Int!) {
  wishlistSelect(userId: $userId){
    id
    gebruikerid
    timestamp
    items
  }
}
`

const themeRed = new createMuiTheme({
  palette: {
    primary: {
      main: '#F44336'
    }
  }
});

const themeGreen = new createMuiTheme({
  palette: {
    primary: {
      main: '#43a047'
    },
    secondary: {
      main: '#000000'
    }
  }
});

class Favorite extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetching: false,
      syncButtonText: 'Synchroniseer'
    }
  }

  componentDidMount = () => {
    if (this.props.loggedIn) {
      console.log(`User is logged in, should check with database...`)
    }
  }

  updateFavorite = (item, type) => {
    switch (type) {
      case 'REMOVE_FROM_FAV':
        this.props.updateFavorite(item, type)
        break;
      case 'ADD_TO_CART':
        this.props.setCart(item, type)
        this.props.updateFavorite(item, 'REMOVE_FROM_FAV')
        break;
    }
  }

  onFavoritesFetched = (data) => {
    console.log(data)
    if (data.wishlistSelect.length > 0) {
      if (new Date(this.props.favorite.timestamp) > new Date(data.wishlistSelect[0].timestamp)) {
        console.log(new Date(this.props.favorite.timestamp))
        console.log(new Date(data.wishlistSelect[0].timestamp))
        console.log(`Local data is newer than db`)
      } else {
        console.log(new Date(this.props.favorite.timestamp))
        console.log(new Date(data.wishlistSelect[0].timestamp))
        console.log(`Local data is older than db`)
        this.props.updateFavorite(data.wishlistSelect[0].items)
      }
    } else {
      console.log(`db has no data, pushing local fav`)
    }
    this.setState({
      isFetching: false,
      syncButtonText: 'Synchroniseer'
    })
  }

  render() {
    return (
      <section className="section-container">
        <PageTitle title="Favorietenlijst"/>
        <div className="fav-container">
        {this.props.loggedIn ? null : (
          <div className="fav-onboarding-container">
            <div className="fav-onboarding-promo-container">
						  <img src={logo} alt="Logo" height="150" />
            </div>
            <div className="fav-onboarding-details-container">
              <span>Heb overal toegang tot je favorietenlijst met een account</span>
              <div className="fav-onboarding-links">
                <Link to={`/login`}>
                  <Button variant="outlined" color="primary">
                    Log in
                  </Button>
                </Link>
                of
                <Link to={`/registreren`}>
                  <Button variant="outlined" color="primary">
                    Maak nu een account aan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
          {this.props.favorite.items.length > 0 ? (
            <div className="fav-item-container">
              {this.props.favorite.items.map((item) =>
                <Link to={`/schilderij/${item.id}`} key={item.id}>
                  <div className="fav-item">
                    <div className="fav-item-image-container">
                      <img src={item.src} alt="Artwork" className="fav-item-image" />
                    </div>
                    <div className="fav-item-details-container">
                      <p>{item.title}</p>
                      <p>{item.principalmaker}</p>
                    </div>
                    <div className="fav-item-action-container">
                    <MuiThemeProvider theme={themeRed}>
                      <Tooltip title="Verwijder uit je favorietenlijst" enterDelay={500} leaveDelay={200}>
                        <IconButton
                          color="primary"
                          aria-label="Verwijder uit je favorietenlijst"
                          onClick={(e) => {
                            e.preventDefault()
                            this.updateFavorite(item, 'REMOVE_FROM_FAV')
                          }}
                          style={{ marginRight: '10px' }}
                          >
                          <Icon>
                            delete
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </MuiThemeProvider>
                    <MuiThemeProvider theme={themeGreen}>
                      {/* <Hidden smDown>
                        <Button
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                          variant="outlined"
                          color="primary"
                        >
                          Voeg toe aan je lijst
                          <Icon style={{ marginLeft: '5px' }}>
                            playlist_add
                          </Icon>
                        </Button>
                      </Hidden> */}
                      {/* <Hidden only={['md', 'lg', 'xl']}> */}
                        <Tooltip title="Voeg toe aan je favorietenlijst" enterDelay={500} leaveDelay={200}>
                          <IconButton
                            color="primary"
                            aria-label="Voeg toe aan je favorietenlijst"
                            onClick={(e) => {
                              e.preventDefault()
                              this.updateFavorite(item, 'ADD_TO_CART')
                            }}
                            >
                            <Icon>
                              playlist_add
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      {/* </Hidden> */}
                    </MuiThemeProvider>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="fav-empty-state">
              <span>Je favorietenlijst is leeg</span>
              <Link to={`/schilderijen`}>
                <Button variant="outlined" color="primary">
                  Bekijk onze collectie
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default Favorite;
