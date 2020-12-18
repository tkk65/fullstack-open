import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ListGroup from 'react-bootstrap/ListGroup'

const Blog = ({ blog }) => {

  return (
    <ListGroup.Item className='blog'>
      <Link to={`/blogs/${blog.id}`}><i>{blog.title}</i> by {blog.author}</Link>
    </ListGroup.Item>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}

export default Blog