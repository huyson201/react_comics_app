import { useReducer, createContext, useContext } from "react";
import reducer from "./Reducer";

export const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const initialState = { token: null, update: false, refreshToken: null };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token, refreshToken, update } = state;

  const value = {
    dispatch,
    token,
    update,
    refreshToken,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserProvider;
