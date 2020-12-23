import React, { useState, useContext, useEffect } from 'react'
import rp from 'request-promise'

import { AccountContext } from './Accounts'

export default () => {
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState(false);

  const { getSession } = useContext(AccountContext)

  useEffect(() => {
    getSession()
      .then(session => {
        console.log('Session:', session);
        setStatus(true);
      })
  }, []);

  const callWeatherAPI = () => {
    getSession().then(async ({ headers }) => {
      console.log('headers ', headers);
      const url =
        '<<API GATEWAY ENDPOINT URL - GET METHOD>> '

      console.log(headers)

      const response = await rp(url, { headers })

      setResponse(response)
    })
  }

  return (
    <div>
      {status ? (
        <div>
          <br />
          <button onClick={callWeatherAPI}>Get Weather Info</button>
          {response ? (
            <div>Response from API: {response}</div>
          ) : ''}
        </div>
      ) : ''}
    </div>
  )
}
