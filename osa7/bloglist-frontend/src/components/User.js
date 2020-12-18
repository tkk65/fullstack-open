import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup'

const User = () => {
  const id = useParams().id
  const blogs = useSelector(state => state.blogs.filter(blog => blog.user.id === id))
  if (!blogs || blogs.length === 0) {
    return null
  }

  return (
    <div>
      <h2>{blogs[0].user.name}</h2>
      <h3>added blogs</h3>
      <ListGroup>
        {blogs.map(blog => <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>)}
      </ListGroup>
    </div>
  )
}

export default User