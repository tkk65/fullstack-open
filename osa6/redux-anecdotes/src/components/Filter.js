import React from 'react'
import { connect } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) => {
    const filter = event.target.value
    props.setFilter(filter)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default connect(
  null,
  { setFilter }
)(Filter)



// useDispatch version

// import React from 'react'
// import { useDispatch } from 'react-redux'
// import { setFilter } from '../reducers/filterReducer'


// const Filter = () => {
//   const dispatch = useDispatch()

//   const handleChange = (event) => {
//     const filter = event.target.value
//     dispatch(setFilter(filter))
//   }
//   const style = {
//     marginBottom: 10
//   }

//   return (
//     <div style={style}>
//       filter <input onChange={handleChange} />
//     </div>
//   )
// }

// export default Filter