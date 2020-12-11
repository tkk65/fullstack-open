import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ user, blog, handleUpdate, handleDeletion }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)

  const handleLikeClick = () => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    handleUpdate(blog.id, newBlog)
  }

  const handleRemoveClick = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDeletion(blog.id)
    }
  }

  const simpleView = () => (
    <div style={blogStyle}>
      <p>
        <span className="header">{blog.title} {blog.author}</span>
        <button className="view-button" onClick={() => setShowDetails(true)}>view</button>
      </p>
    </div>
  )

  const detailView = () => (
    <div style={blogStyle}>
      <p>
        <span className="header">{blog.title} {blog.author}</span>
        <button onClick={() => setShowDetails(false)}>hide</button>
      </p>
      <p><span className="url">{blog.url}</span></p>
      <p>
        <span className="likes">likes {blog.likes}</span>
        <button className="like-button" onClick={handleLikeClick}>like</button>
      </p>
      <p>{blog.user.name}</p>
      {(user.username === blog.user.username) && <p><button className="remove-button" onClick={handleRemoveClick}>remove</button></p>}
    </div>
  )

  return (
    <>
      { showDetails ? detailView() : simpleView()}
    </>
  )
}

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDeletion: PropTypes.func.isRequired,
}

export default Blog
