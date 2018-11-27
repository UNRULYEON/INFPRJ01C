import React, { Component } from 'react';
import './Header.css';

// Pose
import posed from 'react-pose';

// Material-UI
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle'

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


  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className="header-wrapper">
        <span className="header-title">ARCTIC - Admin panel</span>
        <div className="header-status-indicator" />
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
          <MenuItem onClick={this.handleClose}>Log uit</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default Header;