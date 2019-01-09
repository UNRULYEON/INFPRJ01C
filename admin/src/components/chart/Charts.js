import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';


class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // When calling the Charts component provide the following tags: chartData, showLine(true or false to show the bar), about and legendPosition
  render() {
    return (
      <div>
        {this.props.showLine ? (
          <LineChart width={600} height={300} data={this.props.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="aantal" stroke="white" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis stroke='white' dataKey="name" />
          <YAxis stroke='white' />
          <Tooltip wrapperStyle={{ width: 100, backgroundColor: 'white' }} />
        </LineChart>
        ): console.log('( ͡° ͜ʖ ͡°)')}
        

      </div>
    )
  }
}

export default Chart

