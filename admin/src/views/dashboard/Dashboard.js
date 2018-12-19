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
      showLine: false,
    } 
  }

  toggleBar(){
    this.state.showBar ? this.setState({showBar: false}) : this.setState({showBar: true})
  }

  toggleLine(){
    this.state.showLine ? this.setState({showLine: false}) : this.setState({showLine: true})
  }

  componentWillMount() {
    this.getChartData();
  }

  getChartData() {
    this.setState({
      chartData: {
        labels: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],

        datasets: [
          {
            label: 'Bezoekers',
            fill: false,
            pointHighlightFill: '#fff',
            data: [
              0,
              1,
              2,
              10,
              4,
              6,
              10
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

        <Button onClick={this.toggleLine.bind(this)}>show the line</Button>
        <div id="chart"><Charts chartData={this.state.chartData} showLine={this.state.showLine} about="Aantal bezoekers per dag" legendPosition="top" /></div>
      </section>
    );
  }
}

export default Dashboard;