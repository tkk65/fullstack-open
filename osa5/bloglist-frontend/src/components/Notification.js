import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const className = (notification.mode === 'error') ? 'error-notification' : 'notification'

  return (
    <div className={className}>
      {notification.message}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.object
}

export default Notification
