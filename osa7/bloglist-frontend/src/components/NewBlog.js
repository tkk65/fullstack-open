import React, { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const NewBlog = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = (event) => {
    event.preventDefault()

    props.createBlog({
      title, author, url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <Form onSubmit={handleNewBlog} className="mb-2">
        <Form.Group as={Row}>
          <Form.Label column sm="2">Author</Form.Label>
          <Col sm="10">
            <Form.Control id='author' value={author} onChange={({ target }) => setAuthor(target.value)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">Title</Form.Label>
          <Col sm="10">
            <Form.Control id='title' value={title} onChange={({ target }) => setTitle(target.value)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">Url</Form.Label>
          <Col sm="10">
            <Form.Control id='url' value={url} onChange={({ target }) => setUrl(target.value)} />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">Create</Button>
      </Form>
    </div>
  )
}

export default NewBlog