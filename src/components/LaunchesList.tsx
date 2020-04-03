import React from 'react'
import { Launch, Timestamp } from '../Types'
import Timer from './Timer'


function now(): Timestamp {
  return new Date().getTime()
}

interface LaunchesListProps {
  launches: Launch[]
}

interface LaunchesListState {
  now: Timestamp
  interval?: number
}

export default class LaunchesList extends React.Component<LaunchesListProps, LaunchesListState> {
  constructor(props: LaunchesListProps) {
    super(props)
    this.state = { now: now() }
  }

  componentDidMount() {
    const self = this
    this.setState({ interval: setInterval(function() {
      self.setState({ now: now() })
    }, 1000) })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  render() {
    return (
      <div>
        <div className='launches-list'>
          {this.props.launches.map((launch, key) =>
            <LaunchItem key={key} data={launch} now={this.state.now} />
          )}
        </div>
        {this.props.launches.length > 0 &&
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src='img/starman.jpg' width={300} />
          </div>
        }
      </div>
    )
  }
}

interface LaunchItemProps {
  data: Launch
  now: Timestamp
}

class LaunchItem extends React.Component<LaunchItemProps, {}> {
  constructor(props: LaunchItemProps) {
    super(props)
  }

  render() {
    const { data, now } = this.props
    return (
      <div className='launch'>
        <div className='launch-header'>
          <Timer now={now} till={data.launch} />
          <div className='mission'>Миссия <b>{data.mission}</b></div>
        </div>
        <div className='launch-details'>
          <div className='icon-text' title='Носитель'>
            <img src='img/rocket.svg' /><span>{data.vehicle}</span>
          </div>
          <div className='icon-text' title='Полигон'>
            <img src='img/location.svg' /><span>{data.location}</span>
          </div>
        </div>
      </div>
    )
  }
}