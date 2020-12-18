import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Table from 'react-bootstrap/Table'

const UserList = () => {
  const blogs = useSelector(state => state.blogs)

  if (!blogs || blogs.length === 0) {
    return null
  }

  const blogsByUsers = blogs.reduce((map, blog) => {
    const key = blog.user.name
    map.has(key) ? map.get(key).push(blog) : map.set(key, [blog])
    return map
  }, new Map())

  return (
    <div>
      <h2>Users</h2>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th><strong>blogs created</strong></th>
          </tr>
        </thead>
        <tbody>
          {Array.from(blogsByUsers.entries()).map(([user, blogs]) =>
            <tr key={user}>
              <td><Link to={`/users/${blogs[0].user.id}`}>{user}</Link></td>
              <td>{blogs.length}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default UserList