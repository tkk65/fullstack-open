import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const SingleBlog = ({ handleLike, handleRemove, handleAddComment }) => {
  const id = useParams().id
  const blog = useSelector(state => state.blogs.find(blog => blog.id === id))
  const user = useSelector(state => state.user)
  if (!blog) {
    return null
  }

  const own = blog.user.username === user.username

  const addComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    handleAddComment(blog.id, comment)
    event.target.comment.value = ''
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <p><a href={blog.url}>{blog.url}</a></p>
      <p>{blog.likes} likes <Button variant="primary" onClick={() => handleLike(blog.id)}>Like</Button></p>
      <p>added by {blog.user.name}</p>
      {own && <p><Button variant="danger" onClick={() => handleRemove(blog.id)}>Remove</Button></p>}
      <h3>comments</h3>
      <Form onSubmit={addComment}>
        <Form.Group as={Row}>
          <Col sm="10">
            <Form.Control name="comment" />
          </Col>
          <Col>
            <Button variant="primary" type="submit">Add comment</Button>
          </Col>
        </Form.Group>
      </Form>
      <ListGroup>
        {blog.comments.map(comment => <ListGroup.Item key={comment}>{comment}</ListGroup.Item>)}
      </ListGroup>
    </div>
  )
}

export default SingleBlog