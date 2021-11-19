import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLogged, isAdmin } = useSelector((state) => state.user);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLogged) {
          console.log(props);
          if (
            props.location.pathname === "/login" ||
            props.location.pathname === "/register"
          ) {
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
          } else {
            return <Component {...props} />;
          }
        } else {
          if (
            props.location.pathname === "/login" ||
            props.location.pathname === "/register"
          ) {
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
        }
      }}
    />
  );
};

export default ProtectedRoute;
