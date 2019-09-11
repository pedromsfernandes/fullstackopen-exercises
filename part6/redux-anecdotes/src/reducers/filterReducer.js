const initialState = "";

export const setFilter = filter => ({
  type: "SET_FILTER",
  data: {
    filter
  }
});

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.data.filter.toLowerCase();
    default:
      return state;
  }
};

export default filterReducer;
