import React from 'react'

const Weather = ({ weather }) => {
  if (weather === null) {
    return (<div>Weather data is not available. Have you provided your custom API key as environment variable REACT_APP_APIKEY?</div>)
  }

  return (
    <div>
      <p>temperature: {weather.main.temp} ℃</p>
      <p>wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
