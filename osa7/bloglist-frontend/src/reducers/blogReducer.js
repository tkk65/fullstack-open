import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'NEW_BLOG':
      return [...state, action.data]
    case 'UPDATE_BLOG':
      return state.map(blog => blog.id !== action.data.id ? blog : { ...blog, likes: action.data.likes + 1 })
    case 'REMOVE_BLOG':
      return state.filter(blog => blog.id !== action.data.id)
    case 'ADD_COMMENT':
      return state.map(blog => blog.id !== action.data.id ? blog : { ...blog, comments: blog.comments.concat(action.data.comment) })
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = newBlog => {
  return {
    type: 'NEW_BLOG',
    data: newBlog
  }
}

export const updateBlog = updatedBlog => {
  return {
    type: 'UPDATE_BLOG',
    data: updatedBlog
  }
}

export const removeBlog = id => {
  return {
    type: 'REMOVE_BLOG',
    data: { id }
  }
}

export const addComment = (id, comment) => {
  return {
    type: 'ADD_COMMENT',
    data: { id, comment }
  }
}

export default blogReducer