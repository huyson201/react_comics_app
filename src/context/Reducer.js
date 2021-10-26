import { ACTIONS } from "./Action";

const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOKEN:
      if (action.payload) {
        return {
          ...state,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
        };
      }
      return {
        ...state,
        token: null,
        refreshToken: null,
      };
    case ACTIONS.CHECK:
      return {
        ...state,
        update: action.payload,
      };
    case ACTIONS.MODAL_NOTIFY:
      if (action.payload) {
        return {
          ...state,
          show: action.payload.show,
          error: action.payload.error,
          message: action.payload.message,
        };
      }
      return {
        ...state,
        show: false,
        error: null,
        message: null,
      };
    case ACTIONS.MODAL_CHAP:
      if (action.payload) {
        return {
          ...state,
          showChapter: action.payload.showChapter,
        };
      }
      return {
        ...state,
        showChapter: false,
      };

    default:
      return state;
  }
};

export default reducers;
