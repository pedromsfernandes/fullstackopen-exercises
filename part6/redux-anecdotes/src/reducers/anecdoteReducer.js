import anecdoteService from "../services/anecdotes";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."
];

export const vote = anecdote => async dispatch => {
  await anecdoteService.vote(anecdote);

  dispatch({
    type: "VOTE",
    data: {
      id: anecdote.id
    }
  });
};

export const addAnecdote = anecdote => async dispatch => {
  const newAnecdote = await anecdoteService.createNew(anecdote);
  dispatch({
    type: "ADD",
    data: newAnecdote
  });
};

export const initializeAnecdotes = () => async dispatch => {
  const anecdotes = await anecdoteService.getAll();
  console.log(anecdotes);
  dispatch({ type: "INIT_ANECDOTES", data: anecdotes });
};

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  };
};

const initialState = anecdotesAtStart.map(asObject);

const reducer = (state = initialState, action) => {
  console.log("state now: ", state);
  console.log("action", action);

  switch (action.type) {
    case "INIT_ANECDOTES":
      return action.data;
    case "VOTE":
      return state
        .map(anecdote =>
          anecdote.id === action.data.id
            ? {
                ...anecdote,
                votes: anecdote.votes + 1
              }
            : anecdote
        )
        .sort((lhs, rhs) => rhs.votes - lhs.votes);
    case "ADD":
      return [...state, action.data].sort((lhs, rhs) => rhs.votes - lhs.votes);
    default:
      return state.sort((lhs, rhs) => rhs.votes - lhs.votes);
  }
};

export default reducer;
