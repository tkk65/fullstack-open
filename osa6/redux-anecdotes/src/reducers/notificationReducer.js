const setAction = (notification) => {
  return {
    type: 'SET_NOTIFICATION',
    notification
  }
}

const clearAction = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

let timeoutId = undefined

export const setNotification = (notification, timeout) => {
  return dispatch => {
    if (typeof timeoutId === 'number') {
      window.clearTimeout(timeoutId)
    }
    dispatch(setAction(notification))
    timeoutId = setTimeout(() => {
      dispatch(clearAction())
      timeoutId = undefined
    }, timeout)
  }
}

const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export default reducer