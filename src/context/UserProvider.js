import { useReducer, useEffect, createContext, useContext } from "react";
import reducer from "./Reducer";

export const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const initialState = { token: null };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token } = state;

  const value = {
    dispatch,
    token,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserProvider;
