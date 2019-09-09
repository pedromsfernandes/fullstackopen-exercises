import React, { useState, useEffect } from "react";
import uuid from "uuid";
import {
  getAllPersons,
  createPerson,
  deletePerson,
  updatePerson
} from "./services/persons";

const Notification = ({ message, type }) =>
  message && <div className={["notification", type].join(" ")}>{message}</div>;

const Filter = ({ filterText, setFilterText }) => (
  <p>
    filter shown with{" "}
    <input value={filterText} onChange={e => setFilterText(e.target.value)} />
  </p>
);

const PersonForm = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  addNewContact
}) => (
  <form onSubmit={addNewContact}>
    <div>
      name: <input value={newName} onChange={e => setNewName(e.target.value)} />
    </div>
    <div>
      number:{" "}
      <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
    </div>

    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, filterText, onPersonDelete }) => (
  <ul style={{ listStyle: "none", marginLeft: "0", paddingLeft: "0" }}>
    {persons
      .filter(person =>
        person.name.toLowerCase().includes(filterText.toLowerCase())
      )
      .map(person => (
        <li key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => onPersonDelete(person)}>delete</button>
        </li>
      ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getAllPersons().then(persons => setPersons(persons));
  }, []);

  const addNotification = (message, type) => {
    const newNotification = {
      id: uuid.v4(),
      message,
      type
    };

    setNotifications(notifications.concat(newNotification));
    setTimeout(() => {
      setNotifications(notifications =>
        notifications.filter(
          notification => notification.id !== newNotification.id
        )
      );
    }, 5000);
  };

  const addNewContact = e => {
    e.preventDefault();

    if (!newName || !newNumber) {
      alert("Fill all fields before submitting!");
      return;
    }

    const person = persons.find(person => person.name === newName);

    const confirmMessage = `${newName} is already added to the phone book, replace the old number with a new one?`;

    if (person !== undefined && window.confirm(confirmMessage)) {
      updatePerson(person.id, { name: newName, number: newNumber })
        .then(updatedPerson => {
          setPersons(
            persons.map(person =>
              person.id === updatedPerson.id ? updatedPerson : person
            )
          );

          addNotification(`Updated ${updatedPerson.name}`, "warning");
        })
        .catch(error => addNotification(error.response.data.error, "error"));
    } else if (person === undefined) {
      createPerson({ name: newName, number: newNumber })
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          addNotification(`Added ${newPerson.name}`, "success");
        })
        .catch(error => addNotification(error.response.data.error, "error"));
    }
  };

  const handlePersonDelete = personToDelete => {
    if (window.confirm(`Delete ${personToDelete.name}?`))
      deletePerson(personToDelete.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== personToDelete.id));
          addNotification(`Deleted ${personToDelete.name}`, "error");
        })
        .catch(error => addNotification(error.response.data.error, "error"));
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
          />
        ))}
      </div>

      <Filter filterText={filterText} setFilterText={setFilterText} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        addNewContact={addNewContact}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterText={filterText}
        onPersonDelete={handlePersonDelete}
      />
    </div>
  );
};

export default App;
