import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog/>', () => {
  let component
  const mockLikeHandler = jest.fn()
  const mockRemoveHandler = jest.fn()

  const blog = {
    title: 'Hello World',
    author: 'Dennis Ritchie',
    likes: 23,
    url: 'www.google.com',
    user: {
      username: 'zephyrminas',
      name: 'Pedro Fernandes'
    }
  }

  beforeEach(() => {
    component = render(
      <Blog blog={blog} onLike={mockLikeHandler} onRemove={mockRemoveHandler} />
    )
  })

  test('only name and author are shown by default', () => {
    expect(component.container).toHaveTextContent(
      `${blog.title} ${blog.author}`
    )

    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(`${blog.likes} likes`)
    expect(component.container).not.toHaveTextContent(
      `added by ${blog.user.name}`
    )
  })

  test('all info becomes visible after click', () => {
    const def = component.container.querySelector('.default')
    fireEvent.click(def)

    expect(component.container).toHaveTextContent(blog.url)
    expect(component.container).toHaveTextContent(`${blog.likes} likes`)
    expect(component.container).toHaveTextContent(
      `added by ${blog.user.name}`
    )
  })
})
