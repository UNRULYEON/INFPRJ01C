import React, { Component } from 'react';
import { Bar, Line, Radar, Doughnut, Pie, Polar, Bubble, Scatter } from 'react-chartjs-2';

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: props.chartData,
    }
  }

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: 'right',
    about: 'about?'
  }

  // When calling the Charts component provide the following tags: chartData, showBar(true or false to show the bar), about and legendPosition
  render() {
    return (
      <div>
        {/* Bar */}
        {this.props.showBar ? (<Bar
          data={this.state.chartData}
          options={{
            title: {
              display: this.props.displayTitle,
              text: this.props.about,
              fontSize: 25
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition
            }
          }}
        />) : console.log('( ͡° ͜ʖ ͡°)')}


        {/* Line */}
        {this.props.showLine ? (<Line
          data={this.state.chartData}
          options={{
            title: {
              display: this.props.displayTitle,
              text: this.props.about,
              fontSize: 25
            },
            legend: {
              display: this.props.displayLegend,
              position: this.props.legendPosition
            }
          }}
        />) : console.log('( ͡° ͜ʖ ͡°)')}
      </div>
    )
  }
}

export default Chart

