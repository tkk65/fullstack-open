import React from 'react'
import { connect } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const handleVote = (anecdote) => {
    props.vote(anecdote)
    props.setNotification(`you voted '${anecdote.content}'`, 5000)
  }

  const sortedAnecdotes = [...props.anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.filter === '' ?
      state.anecdotes :
      state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
  }
}

export default connect(
  mapStateToProps,
  { vote, setNotification }
)(AnecdoteList)



// useDispatch, useSelector version

// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { vote } from '../reducers/anecdoteReducer'
// import { setNotification } from '../reducers/notificationReducer'

// const AnecdoteList = () => {
//   const dispatch = useDispatch()
//   const anecdotes = useSelector(state =>
//     state.filter === '' ?
//       state.anecdotes :
//       state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
//   )

//   const handleVote = (anecdote) => {
//     dispatch(vote(anecdote))
//     dispatch(setNotification(`you voted '${anecdote.content}'`, 5000))
//   }

//   const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

//   return (
//     <div>
//       {sortedAnecdotes.map(anecdote =>
//         <div key={anecdote.id}>
//           <div>
//             {anecdote.content}
//           </div>
//           <div>
//             has {anecdote.votes}
//             <button onClick={() => handleVote(anecdote)}>vote</button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AnecdoteList
