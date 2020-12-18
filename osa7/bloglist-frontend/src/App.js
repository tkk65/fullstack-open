import React, { useState, useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

import {
  setNotification
} from './reducers/notificationReducer'
import {
  setUser
} from './reducers/userReducer'
import {
  initializeBlogs,
  createBlog as createBlogAction,
  updateBlog as updateBlogAction,
  removeBlog as removeBlogAction,
  addComment as addCommentAction
} from './reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import UserList from './components/UserList'
import User from './components/User'
import SingleBlog from './components/SingleBlog'
import NavigationMenu from './components/NavigationMenu'
import blogService from './services/blogs'
import loginService from './services/login'
import storage from './utils/storage'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = React.createRef()

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)

  const history = useHistory()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const user = storage.loadUser()
    dispatch(setUser(user))
  }, [dispatch])

  const notifyWith = (message, type = 'success') => {
    dispatch(setNotification({
      message, type
    }))
    setTimeout(() => {
      dispatch(setNotification(null))
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      setUsername('')
      setPassword('')
      dispatch(setUser(user))
      notifyWith(`${user.name} welcome back!`)
      storage.saveUser(user)
    } catch (exception) {
      notifyWith('wrong username/password', 'error')
    }
  }

  const createBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      blogFormRef.current.toggleVisibility()
      dispatch(createBlogAction(newBlog))
      notifyWith(`a new blog '${newBlog.title}' by ${newBlog.author} added!`)
    } catch (exception) {
      notifyWith(exception.response.data.error, 'error')
    }
  }

  const handleLike = async (id) => {
    const blogToLike = blogs.find(b => b.id === id)
    const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1, user: blogToLike.user.id }
    await blogService.update(likedBlog)
    dispatch(updateBlogAction(blogToLike))
  }

  const handleRemove = async (id) => {
    const blogToRemove = blogs.find(b => b.id === id)
    const ok = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)
    if (ok) {
      await blogService.remove(id)
      dispatch(removeBlogAction(id))
      history.push('/')
    }
  }

  const handleLogout = () => {
    dispatch(setUser(null))
    storage.logoutUser()
  }

  const handleAddComment = async (id, comment) => {
    await blogService.addComment(id, comment)
    dispatch(addCommentAction(id, comment))
  }

  if (!user) {
    return (
      <Container>
        <h2>Login to application</h2>
        <Notification notification={notification} />

        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control id='username' value={username} onChange={({ target }) => setUsername(target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control id='password' type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">Login</Button>
        </Form>
      </Container>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <Container>
      <NavigationMenu handleLogout={handleLogout} />
      <Notification notification={notification} />

      <Switch>

        <Route path="/users/:id">
          <User />
        </Route>

        <Route path="/users">
          <UserList />
        </Route>

        <Route path="/blogs/:id">
          <SingleBlog
            handleLike={handleLike}
            handleRemove={handleRemove}
            handleAddComment={handleAddComment}
          />
        </Route>

        <Route path="/">
          <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
            <NewBlog createBlog={createBlog} />
          </Togglable>
          <ListGroup>
            {blogs.sort(byLikes).map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
              />
            )}
          </ListGroup>
        </Route>

      </Switch>
    </Container>
  )
}

export default App