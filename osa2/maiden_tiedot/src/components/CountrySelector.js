import React from 'react'

const CountrySelector = ({ countries, handleSelection }) => {
  const count = countries.length
  if (count > 10) {
    return (<p>Too many matches, specify another filter</p>)
  } else if (count > 1) {
    return (
      <>
        { countries.map(country => {
          return (<p key={country.name}>{country.name} <button onClick={() => handleSelection(country)}>show</button></p>)
        })}
      </>
    )
  } else if (count === 1) {
    return null
  } else
    return (<p>no matches</p>)
}

export default CountrySelector
