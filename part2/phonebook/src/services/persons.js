import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAllPersons = () => axios.get(baseUrl).then(res => res.data);

const createPerson = newPerson =>
  axios.post(baseUrl, newPerson).then(res => res.data);

const deletePerson = personId => axios.delete(`${baseUrl}/${personId}`);

const updatePerson = (id, person) =>
  axios.put(`${baseUrl}/${id}`, person).then(res => res.data);

export { getAllPersons, createPerson, deletePerson, updatePerson };
