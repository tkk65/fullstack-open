import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountrySelector from './components/CountrySelector'
import CountryInfo from './components/CountryInfo'

const App = () => {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const handleSelection = (country) => setSelectedCountry(country)

  const filteredCountries = (filter === '') ? countries : countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))

  const matchingCountry = selectedCountry || (filteredCountries.length === 1 ? filteredCountries[0] : null)

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <CountrySelector countries={filteredCountries} handleSelection={handleSelection} />
      <CountryInfo country={matchingCountry} />
    </div>
  )
}

export default App
