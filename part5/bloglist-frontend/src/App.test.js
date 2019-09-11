import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {
  render,
  waitForElement
} from '@testing-library/react'
import App from './App'
jest.mock('./hooks/index')

describe('<App />', () => {
  const user = {
    username: 'zephyrminas',
    token: '1231231214',
    name: 'Pedro Fernandes'
  }

  test('if no user logged, notes are not rendered', async () => {
    const component = render(<App />)
    component.rerender(<App />)

    await waitForElement(() => component.getByText('login'))

    expect(component.container).not.toHaveTextContent('Hello World')

    // expectations here
  })

  test('posts are rendered if logged in', async () => {
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

    const component = render(<App />)
    component.rerender(<App />)

    await waitForElement(() => component.getByText('blogs'))

    const blogs = component.container.querySelectorAll('.blog')
    expect(blogs.length).toBe(3)

    expect(component.container).toHaveTextContent('Linux')
  })
})
