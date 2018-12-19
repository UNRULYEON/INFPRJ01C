import React, { Component } from 'react';
import './Dashboard.css';
import Charts from '../../components/chart/Charts.js'
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import color from '@material-ui/core/colors/green';

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
            backgroundColor:[
              'red',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ]
          }
        ],
      }
    });
  }

  render() {
    return (
      <section>
        <Button onClick={this.toggleBar.bind(this)}>Balk voorbeeld</Button>
        <div id="chart"><Charts chartData={this.state.chartData} showBar={this.state.showBar} about="Aantal bezoekers per dag" legendPosition="top" /></div>

        <Button onClick={this.toggleLine.bind(this)}>Lijn voorbeeld</Button>
        <div id="chart"><Charts chartData={this.state.chartData} showLine={this.state.showLine} about="Aantal bezoekers per dag" legendPosition="top" /></div>
      </section>
    );
  }
}

export default Dashboard;