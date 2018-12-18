import React, { Component } from 'react';
import './Dashboard.css';
import Charts from '../../components/chart/Charts.js'
import Button from '@material-ui/core/Button';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      showBar: false,
    } 
  }

  toggleBar(){
    this.state.showBar ? this.setState({showBar: false}) : this.setState({showBar: true})
  }

  componentWillMount() {
    this.getChartData();
  }

  getChartData() {
    this.setState({
      chartData: {
        labels: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'],

        datasets: [
          {
            label: 'Bezoekers',
            fill: false,
            pointHighlightFill: '#fff',
            data: [
              617594,
              181045,
              153060,
              106519,
              105162,
              95072
            ],
          }
        ],
      }
    });
  }

  render() {
    return (
      <section>
        <Button onClick={this.toggleBar.bind(this)}>show the bar</Button>
        <div id="chart"><Charts chartData={this.state.chartData} showBar={this.state.showBar} about="Aantal bezoekers per dag" legendPosition="top" /></div>
      </section>
    );
  }
}

export default Dashboard;