import React from 'react'
import Axios, { AxiosResponse } from 'axios'
import { Launch } from '../Types'
import LaunchesList from './LaunchesList';


type ServerResponse = Launch[]

interface LaunchesLoaderState {
  status: 'loading' | 'error' | 'done'
  payload?: Launch[]
}

export default class LaunchesLoader extends React.Component<{}, LaunchesLoaderState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      status: 'loading'
    }
  }

  updateContent(launches: Launch[]) {
    this.setState({ status: 'done', payload: launches })
  }

  makeRequest() {
    this.setState({ status: 'loading' })
    const self = this
    Axios.get('launches.json').then((response: AxiosResponse<ServerResponse>) => {
      self.updateContent(response.data)
    }).catch(error => {
      self.setState({ status: 'error' })
    })
  }

  componentDidMount() {
    this.makeRequest()
  }

  render() {
    return (
      this.state.payload ?
        <LaunchesList launches={this.state.payload} />
      :
        this.state.status === 'loading' ?
          <div className='loading'>Загрузка...</div>
        :
          <div className='error'>
            Загрузка не удалась.&nbsp;
            <a href='#' onClick={e => {
              e.preventDefault()
              this.makeRequest()
            }}>Повторить попытку</a>
          </div>
    )
  }
}