import React from "react";
import { connect } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = ({ anecdotesToShow, vote, setNotification }) => (
  <>
    {anecdotesToShow.map(anecdote => (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button
            onClick={() => {
              vote(anecdote);

              setNotification(`you voted ${anecdote.content}`, 5);
            }}
          >
            vote
          </button>
        </div>
      </div>
    ))}
  </>
);

const mapStateToProps = ({ anecdotes, filter }) => ({
  anecdotesToShow: anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter)
  )
});

const mapDispatchToProps = {
  vote,
  setNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);
