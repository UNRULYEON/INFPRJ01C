import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import './Sidebar.css';

// Material-UI
import MenuList from '@material-ui/core/List';
import MenuItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import DashboardIcon from '@material-ui/icons/Dashboard';

class Sidebar extends Component {
  constructor(props) {
    super (props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="sidebar-container">
        <MenuList component="nav">
          <NavLink
            to="/dashboard"
            className="list-link"
          >
            <MenuItem button>
                <ListItemIcon
                  className='list-item-icon'
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  className='list-item-text'
                  primary="Dashboard"
                />
            </MenuItem>
          </NavLink>
          <NavLink
            to="/gebruikers"
            className="list-link"
          >
            <MenuItem button>
              <ListItemIcon
                className='list-item-icon'
              >
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText
                className='list-item-text'
                primary="Gebruikers"
              />
            </MenuItem>
          </NavLink>
          <NavLink
            to="/schilderijen"
            className="list-link"
          >
            <MenuItem button>
              <ListItemText
                className='list-item-text'
                primary="Schilderijen"
              />
            </MenuItem>
          </NavLink>
          <NavLink
            to="/schilders"
            className="list-link"
          >
            <MenuItem button>
              <ListItemText
                className='list-item-text'
                primary="Schilders"
              />
            </MenuItem>
          </NavLink>
          <NavLink
            to="/faq"
            className="list-link"
          >
            <MenuItem button>
              <ListItemText
                className='list-item-text'
                primary="FAQ"
              />
            </MenuItem>
          </NavLink>
        </MenuList>
      </div>
    );
  }
}

export default Sidebar;