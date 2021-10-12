import { ACTIONS } from "./Action";

const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOKEN:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    case ACTIONS.UPDATE:
      return {
        ...state,
        update: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
