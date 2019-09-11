const blogs = [
  {
    id: '5a451df7571c224a31b5c8ce',
    title: 'C Programming Language',
    author: 'Dennis Ritchie',
    url: 'www.google.com',
    user: {
      _id: '5a437a9e514ab7f168ddf138',
      username: 'zephyrminas',
      name: 'Pedro Fernandes'
    }
  },
  {
    id: '5a451e21e0b8b04a45638211',
    title: 'Linux',
    author: 'Linus Torvalds',
    url: 'www.google.com',
    user: {
      _id: '5a437a9e514ab7f168ddf138',
      username: 'zephyrminas',
      name: 'Pedro Fernandes'
    }
  },
  {
    id: '5a451e30b5ffd44a58fa79ab',
    title: 'React',
    author: 'Dan Abramov',
    url: 'www.reactjs.org',
    user: {
      _id: '5a437a9e514ab7f168ddf138',
      username: 'zephyrminas',
      name: 'Pedro Fernandes'
    }
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

const setToken = () => null

export default { getAll, setToken }
