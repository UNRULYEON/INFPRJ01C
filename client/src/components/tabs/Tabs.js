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
              className="tab-li"
              disabled={d.disabled}
            >{d.title}</Tab>)}
        </TabList>
        {this.state.data.map(d => <TabPanel key={d.content}>{d.content}</TabPanel>)}
      </Tabs>
    );
  }
}

export default Tabbed;
