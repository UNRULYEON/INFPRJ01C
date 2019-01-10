import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


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
        <LineChart width={1000} height={300} data={this.props.data} margin={{ top: 5, right: 30, bottom: 5, left: 50 }}>        
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis stroke='white' dataKey={this.props.title} />
          <YAxis stroke='white' />
          <Tooltip wrapperStyle={{ backgroundColor: 'white', color: 'black' }} />
          <Legend />
          <Line type="monotone" name="Aantal" dataKey={this.props.amountwatched} stroke="black" />
        </LineChart>
      </div>
    )
  }
}

export default Chart

