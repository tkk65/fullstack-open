const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const getToken = async () => {
  const login = await api
    .post('/api/login')
    .send({ username: 'user', password: '1234' })

  return login.body.token
}

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('1234', 10)
    const userObject = {
      username: 'user',
      name: 'user',
      passwordHash
    }
    const user = new User(userObject)
    await user.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain(helper.initialBlogs[0].title)
  })

  test('property "id" is defined', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const token = await getToken()
      const newBlog = {
        title: 'Test blog 3',
        author: 'Test author 3',
        url: 'http://test3.blog.com',
        likes: 30
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)


      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain(newBlog.title)
    })

    test('use default value for property "likes" if it is not given', async () => {
      const token = await getToken()
      const newBlog = {
        title: 'Test blog 3',
        author: 'Test author 3',
        url: 'http://test3.blog.com'
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
      expect(response.body.likes).toBe(0)
    })

    test('fails with status code 400 if "title" is not given', async () => {
      const token = await getToken()
      const newBlog = {
        author: 'Test author 3',
        url: 'http://test3.blog.com',
        likes: 30
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with status code 400 if "url" is not given', async () => {
      const token = await getToken()
      const newBlog = {
        title: 'Test blog 3',
        author: 'Test author 3',
        likes: 30
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with statuscode 401 if token is missing', async () => {
      const newBlog = {
        title: 'Test blog 3',
        author: 'Test author 3',
        url: 'http://test3.blog.com',
        likes: 30
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)


      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('changing a specific blog', () => {

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const originalBlog = blogsAtStart[0]

      const changedBlog = {
        title: 'Changed blog',
        author: 'Changed author',
        url: 'http://changed.blog.com',
        likes: 100
      }

      await api
        .put(`/api/blogs/${originalBlog.id}`)
        .send(changedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const returnedBlog = blogsAtEnd.find(blog => blog.id === originalBlog.id)
      expect(returnedBlog).toEqual({ ...changedBlog, id: originalBlog.id })
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      const changedBlog = {
        title: 'Changed blog',
        author: 'Changed author',
        url: 'http://changed.blog.com',
        likes: 100
      }

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(changedBlog)
        .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '0'

      const changedBlog = {
        title: 'Changed blog',
        author: 'Changed author',
        url: 'http://changed.blog.com',
        likes: 100
      }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(changedBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id and token are valid', async () => {
      const token = await getToken()
      const newBlog = {
        title: 'Test blog 3',
        author: 'Test author 3',
        url: 'http://test3.blog.com',
        likes: 30
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).not.toContain(newBlog.title)
    })

    test('fails with status code 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'User 1',
      password: '1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('it is not possible to create users with same username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'User',
      password: '1234',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toMatch('User validation failed:')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('username is mandatory', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'User',
      password: '123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toMatch('User validation failed:')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('username must be at least 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'u1',
      name: 'User',
      password: '123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toMatch('User validation failed:')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('password is mandatory', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'user',
      name: 'User',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toMatch('User validation failed:')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('password must be at least 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'user',
      name: 'User',
      password: '12',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toMatch('User validation failed:')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('users are returned correctly', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0].username).toEqual('root')
    expect(response.body[0].name).toEqual('Root')
    expect(response.body[0].passwordHash).toBeUndefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
