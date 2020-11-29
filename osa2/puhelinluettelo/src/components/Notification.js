import React from 'react'

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

export default Notification
