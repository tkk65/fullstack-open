import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Weather from './Weather'

const CountryInfo = ({ country }) => {
  const apiKey = process.env.REACT_APP_APIKEY
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country === null || apiKey === undefined) { return }
    axios
      .get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: `${country.capital},,${country.alpha3Code}`,
            units: 'metric',
            appid: apiKey
          }
        }
      )
      .then(result => setWeather(result.data))
      .catch(error => setWeather(null))
  }, [country, apiKey])

  if (country === null) {
    return null;
  }

  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      { country.languages.map(language => <p key={language.name}>{language.name}</p>)}
      <div>
        <img src={country.flag} alt="country flag" width="150" />
      </div>
      <h3>weather in {country.capital}</h3>
      <Weather weather={weather} />
    </div>
  )
}

export default CountryInfo
