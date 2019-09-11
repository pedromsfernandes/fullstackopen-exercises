import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = type => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useResource = baseUrl => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(baseUrl)
      const response = await request.data
      setResources(response)
    }
    fetchData()
  }, [baseUrl])

  const create = async (newObject, token) => {
    const config = {
      headers: { Authorization: formatToken(token) }
    }

    const response = await axios.post(baseUrl, newObject, config)
    const newResource = await response.data
    setResources(resources => [...resources, newResource])

    return newResource
  }

  const update = async (resource, fields, token) => {
    const config = {
      headers: { Authorization: formatToken(token) }
    }

    await axios.put(`${baseUrl}/${resource.id}`, fields, config)

    const index = resources.findIndex(blog => blog.id === resource.id)
    let resourceToUpdate = resources[index]
    resourceToUpdate = { ...resourceToUpdate, ...fields }

    setResources(Object.assign([...resources], { [index]: resourceToUpdate }))
  }

  const remove = async (resource, token) => {
    const config = {
      headers: { Authorization: formatToken(token) }
    }

    await axios.delete(`${baseUrl}/${resource.id}`, config)

    setResources(resources.filter(blog => blog.id !== resource.id))
  }

  const formatToken = token =>
    `bearer ${token}`


  const service = {
    create,
    update,
    remove
  }

  return [resources, service]
}
