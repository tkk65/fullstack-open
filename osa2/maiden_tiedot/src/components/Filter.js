import React from 'react'

const Filter = (props) => {
  return (<p>find countries <input value={props.filter} onChange={props.handleFilterChange} /></p>)
}

export default Filter
