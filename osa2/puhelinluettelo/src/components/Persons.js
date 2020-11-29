import React from 'react'

const Persons = ({ persons, handleDeletion }) => {
  return (
    <>
      {persons.map(person =>
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDeletion(person)}>delete</button>
        </p>
      )}
    </>
  )
}

export default Persons
