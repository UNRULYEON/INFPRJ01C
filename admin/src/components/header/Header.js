import React, { Component } from 'react';
import './Header.css';

// Apollo
import gql from "graphql-tag";
import { Query } from "react-apollo";

// Material-UI
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle'

const STATUS = gql`
{
  status
}
`

class Header extends Component {
  constructor(props) {
    super (props);
    this.state = {
      anchorEl: null,
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  setUserApp = () => {
    let user = {
      id: '',
      aanhef: '',
      name: '',
      surname: '',
      email: '',
      admin: false
    }
    this.props.setUser(user, false)
    this.handleClose()
    window.location.reload()
  }

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className="header-wrapper">
        <span className="header-title">ARTIC - Admin panel</span>
        <Query
          query={STATUS}
          pollInterval={300}
        >
          {({ loading, error, data }) => {
            return (
              <div className={
                loading ? 'header-status-indicator' : error ? 'header-status-indicator-red' : data.status === 200 ? 'header-status-indicator-green' : null
              } />
            );
          }}
        </Query>
        <IconButton
          className="header-icon"
          onClick={this.handleClick}
        >
          <AccountCircle/>
        </IconButton>
        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.setUserApp}>Log uit</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default Header;