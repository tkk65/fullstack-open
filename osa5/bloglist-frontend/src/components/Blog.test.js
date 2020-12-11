import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let updateHandler

  beforeEach(() => {
    const user = {
      username: 'username'
    }
    const blog = {
      title: 'title',
      author: 'author',
      url: 'http://url.url',
      user: {
        username: 'username',
        name: 'name',
      },
      likes: 0
    }

    updateHandler = jest.fn()

    component = render(
      <Blog user={user} blog={blog} handleUpdate={updateHandler} handleDeletion={() => null} />
    )
  })

  test('renders initially only title and author', () => {
    const header = component.container.querySelector('.header')
    expect(header).toHaveTextContent(
      'title author'
    )
    const url = component.container.querySelector('.url')
    expect(url).toBeNull()
    const likes = component.container.querySelector('.likes')
    expect(likes).toBeNull()
  })

  test('renders title, author, url and likes when view button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const header = component.container.querySelector('.header')
    expect(header).toHaveTextContent('title author')
    const url = component.container.querySelector('.url')
    expect(url).toHaveTextContent('http://url.url')
    const likes = component.container.querySelector('.likes')
    expect(likes).toHaveTextContent('likes 0')
  })

  test('clicking the like button two times calls handleUpdate event handler two times', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(updateHandler.mock.calls).toHaveLength(2)
  })
})