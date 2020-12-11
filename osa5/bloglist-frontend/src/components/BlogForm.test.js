import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  let submitHandler

  beforeEach(() => {
    submitHandler = jest.fn()

    component = render(
      <BlogForm handleSubmit={submitHandler} />
    )
  })

  test('calls onSubmit event handler with correct values when submitted', () => {
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'title' }
    })
    fireEvent.change(author, {
      target: { value: 'author' }
    })
    fireEvent.change(url, {
      target: { value: 'http://url.url' }
    })
    fireEvent.submit(form)

    expect(submitHandler.mock.calls).toHaveLength(1)
    expect(submitHandler.mock.calls[0][0].title).toBe('title')
    expect(submitHandler.mock.calls[0][0].author).toBe('author')
    expect(submitHandler.mock.calls[0][0].url).toBe('http://url.url')
  })
})
