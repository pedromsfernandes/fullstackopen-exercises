import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import Togglable from './components/Togglable'
import { useField, useResource } from './hooks'

const LoginForm = ({ onSubmit }) => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const handleSubmit = e => {
    e.preventDefault()

    if (onSubmit(username.value, password.value) === true) {
      resetUsername()
      resetPassword()
    }
  }

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">username</label>
          <input id="username" {...username} />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input id="password" {...password} />
        </div>
        <input type="submit" value="login" />
      </form>
    </>
  )
}

const Blogs = ({ blogs, onLike, onRemove, loggedUser }) => (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {blogs.map(blog => (
      <li key={blog.id}>
        <Blog
          blog={blog}
          loggedUser={loggedUser}
          onLike={() => onLike(blog)}
          onRemove={() => onRemove(blog)}
        />
      </li>
    ))}
  </ul>
)

const AddBlog = ({ onSubmit }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('url')

  const handleSubmit = e => {
    e.preventDefault()

    if (onSubmit(title.value, author.value, url.value) === true) {
      resetTitle()
      resetAuthor()
      resetUrl()
    }
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">title</label>
          <input id="title" {...title} required />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input id="author" {...author} />
        </div>
        <div>
          <label htmlFor="url">url</label>
          <input id="url" {...url} required />
        </div>
        <input type="submit" value="create" />
      </form>
    </>
  )
}

const Notification = ({ message, type }) => {
  let color = 'green'
  if (type === 'warning') color = 'yellow'
  else if (type === 'error') color = 'red'

  return (
    <div
      style={{
        border: '2px green solid',
        borderColor: color,
        color,
        backgroundColor: '#ddd',
        padding: '1rem'
      }}
    >
      {message}
    </div>
  )
}

const App = () => {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [blogs, blogsService] = useResource('/api/blogs')

  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleAddBlog = async (title, author, url) => {
    try {
      const newBlog = await blogsService.create({ title, author, url }, user.token)

      setNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      return true
    } catch (e) {
      setNotification({
        message: 'invalid blog fields',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      return false
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)

      return true
    } catch (exception) {
      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return false
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const addLike = async likedBlog => {
    await blogsService.update(likedBlog, { likes: likedBlog.likes + 1 }, user.token)
  }

  const removeBlog = async blogToRemove => {
    try {
      await blogsService.remove(blogToRemove, user.token)
    } catch (e) {
      setNotification({
        message: 'Can\'t remove other people\'s blogs!',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div className="App">
      <h1>blogs</h1>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {!user ? (
        <LoginForm onSubmit={handleLogin} />
      ) : (
        <>
          <p>
            {user.name} logged in <button onClick={logout}>logout</button>
          </p>
          <Togglable buttonLabel="new note">
            <AddBlog onSubmit={handleAddBlog} />
          </Togglable>
          <Blogs
            blogs={blogs.sort((lhs, rhs) => rhs.likes - lhs.likes)}
            loggedUser={user}
            onLike={addLike}
            onRemove={removeBlog}
          />
        </>
      )}
    </div>
  )
}

export default App
