import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLogged, isAdmin } = useSelector((state) => state.user);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLogged && isAdmin) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            ></Redirect>
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
