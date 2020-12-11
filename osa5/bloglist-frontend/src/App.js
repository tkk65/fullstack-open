import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message) => {
    const newNotification = { message, mode: 'normal' }
    setNotification(newNotification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const showErrorNotification = (message) => {
    const newNotification = { message, mode: 'error' }
    setNotification(newNotification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showErrorNotification('wrong username or password')
    }
  }

  const createBlog = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (exception) {
      showErrorNotification(exception.response.data.error)
    } finally {
      setBlogFormVisible(false)
    }
  }

  const updateBlog = async (id, blog) => {
    try {
      const returnedBlog = await blogService.update(id, blog)
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : { ...blog, likes: returnedBlog.likes }))
      showNotification(`blog ${returnedBlog.title} by ${returnedBlog.author} changed`)
    } catch (exception) {
      showErrorNotification(exception.response.data.error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('blog deleted')
    } catch (exception) {
      showErrorNotification(exception.response.data.error)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification notification={notification} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in
        <button onClick={() => window.localStorage.removeItem('loggedBlogappUser')}>logout</button>
      </p>
      <div style={hideWhenVisible}>
        <button id="new-blog-button" onClick={() => setBlogFormVisible(true)}>new blog</button>
      </div>
      <div style={showWhenVisible}>
        <BlogForm handleSubmit={createBlog} />
        <button onClick={() => setBlogFormVisible(false)}>cancel</button>
      </div>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} handleUpdate={updateBlog} handleDeletion={deleteBlog} />
      )}
    </div>
  )
}

export default App