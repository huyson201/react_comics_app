import { useReducer, createContext, useContext } from "react";
import reducer from "./Reducer";

export const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

const Provider = ({ children }) => {
  const initialState = {
    token: null,
    refreshToken: null,
    show: false,
    error: null,
    message: null,
    check: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token, refreshToken, update, show, error, message, check } = state;

  const value = {
    dispatch,
    token,
    update,
    refreshToken,
    show,
    error,
    message,
    check,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
export default Provider;
