import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const ProtectedRouteAdmin = ({ component: Component, ...rest }) => {
  const { isLogged, isAdmin } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLogged) {
          if (isAdmin) {
            return <Component {...props} />;
          } else {
            toast.error("Bạn không có quyền truy cập !")
            return (
              <>
                <Redirect
                  to={{
                    pathname: "/",
                    state: {
                      from: props.location,
                    },
                  }}
                ></Redirect>
              </>
            );
          }
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

export default ProtectedRouteAdmin;
