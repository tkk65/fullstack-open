const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Test blog 1',
    author: 'Test author 1',
    url: 'http://test1.blog.com',
    likes: 10
  },
  {
    title: 'Test blog 2',
    author: 'Test author 2',
    url: 'http://test2.blog.com',
    likes: 20
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temp blog',
    author: 'Temp author',
    url: 'http://temp.blog.com',
    likes: 100
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}

