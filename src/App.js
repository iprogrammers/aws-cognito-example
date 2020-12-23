import React from 'react'
import { Account } from './components/Accounts'

import Login from './components/Login'

import Status from './components/Status'

import GetWeatherInfo from './components/GetWeatherInfo'

export default () => {
  return (
    <Account>
      <Status />
      <Login />
      <GetWeatherInfo/>
    </Account>
  )
}
