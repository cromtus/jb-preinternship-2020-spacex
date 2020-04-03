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
        {this.props.launches.map((launch, key) =>
          <LaunchItem key={key} data={launch} now={this.state.now} />
        )}
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
      <div style={{ marginBottom: 20 }}>
        <div>Где: {data.location}</div>
        <div>Миссия: {data.mission}</div>
        <div>На чём: {data.vehicle}</div>
        <Timer now={now} till={data.launch} />
      </div>
    )
  }
}