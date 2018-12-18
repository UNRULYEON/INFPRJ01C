import React, { Component } from 'react';
import './Dashboard.css';
import Charts from '../../components/chart/Charts.js'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {}
    }
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
        <div id="chart"><Charts chartData={this.state.chartData} about="Aantal bezoekers per dag" legendPosition="top" /></div>

      </section>
    );
  }
}

export default Dashboard;