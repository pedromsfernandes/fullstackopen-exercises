import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

describe('<SimpleBlog/>', () => {
  let component
  const mockHandler = jest.fn()
  let blog = {
    title: 'Hello World',
    author: 'Dennis Ritchie',
    likes: 23
  }

  beforeEach(() => {
    component = render(<SimpleBlog blog={blog} onClick={mockHandler} />)
  })

  test('renders title, author and likes', () => {
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)

    expect(component.container).toHaveTextContent(
      `blog has ${blog.likes} likes`
    )
  })

  test('click handler is called twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls.length).toBe(2)
  })
})
