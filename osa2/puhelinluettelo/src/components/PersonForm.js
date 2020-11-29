import React from 'react'

const PersonForm = (props) => {
  return (
    <form onSubmit={props.handleFormSubmit}>
      <div>
        name: <input value={props.name} onChange={props.handleNameChange} />
      </div>
      <div>
        number: <input value={props.number} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
