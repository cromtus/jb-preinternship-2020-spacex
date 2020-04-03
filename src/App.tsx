import React from 'react'
import LaunchesLoader from './components/LaunchesLoader';


export default function App() {
  return (
    <div className="container">
      <div className='wrapper'>
        <div className='header'>
          Все запуски SpaceX<br />в 2020 году
        </div>
        <LaunchesLoader />
      </div>
    </div>
  )
}