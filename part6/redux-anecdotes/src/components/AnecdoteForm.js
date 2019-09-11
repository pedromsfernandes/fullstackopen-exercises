import React from "react";
import { connect } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = ({ addAnecdote, setNotification }) => (
  <>
    <h2>create new</h2>
    <form
      onSubmit={e => {
        e.preventDefault();

        setNotification(`Added anecdote ${e.target.anecdote.value}`, 5);
        anecdoteService.createNew(e.target.anecdote.value);
        addAnecdote(e.target.anecdote.value);
      }}
    >
      <div>
        <input name="anecdote" />
      </div>
      <button>create</button>
    </form>
  </>
);

const mapDispatchToProps = {
  addAnecdote,
  setNotification
};

export default connect(
  null,
  mapDispatchToProps
)(AnecdoteForm);
