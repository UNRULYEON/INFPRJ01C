import React, { Component } from 'react';
import './Tabs.css'

// Components
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class Tabbed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    }
  }

  render() {
    return (
      <Tabs
        defaultIndex={this.props.defaultIndex || 0}
      >
        <TabList className="tab-ul flex row-nowrap x-center">
          {this.state.data.map(d =>
            <Tab
              key={d.title}
              disabled={d.disabled}
              className="tab-li"
            >{d.title}</Tab>)}
        </TabList>
        {this.state.data.map(d => <TabPanel className="tab-panel" key={d.title}>{d.content}</TabPanel>)}
      </Tabs>
    );
  }
}

export default Tabbed;
