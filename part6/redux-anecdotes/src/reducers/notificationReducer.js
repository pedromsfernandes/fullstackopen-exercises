const initialState = "Set notifications here";

export const setNotification = (notification, duration) => async dispatch => {
  dispatch({
    type: "SET_NOTIFICATION",
    data: { notification }
  });

  setTimeout(() => {
    dispatch(clearNotification());
  }, duration * 1000);
};

export const clearNotification = () => ({
  type: "CLEAR_NOTIFICATION"
});

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.data.notification;
    case "CLEAR_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

export default notificationReducer;
