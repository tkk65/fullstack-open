import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(persons => setPersons(persons))
  }, [])

  const showNotification = (message) => {
    const newNotification = { message, mode: 'normal' }
    setNotification(newNotification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const showErrorNotification = (message) => {
    const newNotification = { message, mode: 'error' }
    setNotification(newNotification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const handleFormSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            showNotification(`Changed ${returnedPerson.name}`)
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== existingPerson.id))
            showErrorNotification(`${changedPerson.name} was already deleted from server`)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showNotification(`Added ${returnedPerson.name}`)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const handleDeletion = (unwantedPerson) => {
    if (window.confirm(`Delete ${unwantedPerson.name}?`)) {
      personService
        .remove(unwantedPerson.id)
        .then(_ => {
          setPersons(persons.filter(person => person.id !== unwantedPerson.id))
          showNotification(`Deleted ${unwantedPerson.name}`)
        })
    }
  }

  const personsToShow = (filter === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        handleFormSubmit={handleFormSubmit}
        name={newName}
        handleNameChange={handleNameChange}
        number={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDeletion={handleDeletion} />
    </div>
  )
}

export default App
