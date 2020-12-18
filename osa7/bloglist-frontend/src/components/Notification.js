import React from 'react'

import Alert from 'react-bootstrap/Alert'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const variant = notification.type === 'success' ? 'success' : 'danger'
  return (
    <Alert variant={variant} className="mb-2">
      {notification.message}
    </Alert>
  )
}

export default Notification