const initialState = {
  users: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case "ACTIONS":
      return {
        ...state,
      };
    default:
      return state;
  }
};
