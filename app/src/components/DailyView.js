import React from 'react'
import {Typography, Grid, Box, Paper} from '@material-ui/core';
import {ResponsiveLine} from '@nivo/line'

function sumByDate(list) {
  const map = new Map();
  list.forEach((item) => {
    const key = item.date;
    const collection = map.get(key);
    map.set(key, item.amount + (
      collection
      ? collection
      : 0));
  });
  return map;
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function addMissingDays(data) {
  let firstDay = new Date(data[0].x);
  let lastDay = new Date(data[data.length - 1].x);
  const nDays = Math.round((lastDay - firstDay) / (24 * 60 * 60 * 1000));
  const dates = data.map(r => r.x);

  let newData = [];

  for (var i = 0; i < nDays; i++) {
    let day = firstDay.addDays(i).toISOString().slice(0, 10);
    const ind = dates.indexOf(day);
    if (ind === -1) {
      newData.push({x: day, y: 0});
    } else {
      newData.push(data[ind]);
    }
  }
  return newData;
}

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveBar = ({
  chartData/* see data tab */
}) => (<Box height="300px" width="100%">
  <ResponsiveLine data={[{
        id: 'Daily Spend',
        data: addMissingDays(chartData)
      }
    ]} colors={['#3f51b5']} enableArea={true} pointSize={5} enableCrosshair={false} margin={{
      bottom: 100, top: 10, left: 60, right: 5
    }} enableGridX={false} enableGridY={false} xScale={{
      type: 'time',
      format: '%Y-%m-%d',
      precision: 'day'
    }} yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }} xFormat="time:%Y-%m-%d" axisBottom={{
      format: '%b %d',
      tickValues: 'every 2 days',
      tickRotation: 60,
      legend: 'Date',
legendOffset: 66,
legendPosition: 'middle'
    }} pointBorderWidth={1} useMesh={true} enableSlices={false} axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '$ Daily Spend ',
            legendOffset: -50,
            legendPosition: 'middle'
        }}/>
</Box>)

export default class DailyView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: Array.from(sumByDate(props.transactions)).map(day => {
        return ({x: day[0], y: day[1]})
      }).reverse()
    };
  }

  render() {
    const {data: chartData} = this.state;

    if (!chartData) {
      return null;
    }

    console.log(chartData);

    return (<MyResponsiveBar chartData={chartData}/>);
  }
}
