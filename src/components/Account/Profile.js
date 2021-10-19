import React, { useEffect, useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { isJwtExpired } from "jwt-check-expiration";
import axiosClient from "../../api/axiosClient";
import { useData } from "../../context/Provider";
import { ACTIONS } from "../../context/Action";
import ModalNotify from "../Modal/ModalNotify";
import {
  BUTTON_UPDATE,
  LABEL_EMAIL,
  LABEL_FULLNAME,
  TITLE_ACCOUNT,
  WARN_LOGIN,
} from "../../constants";

const Profile = () => {
  const [user_name, setUserName] = useState();
  const [user_email, setEmail] = useState();
  const { dispatch, show, error, message, token, refreshToken } = useData();

  useEffect(() => {
    const userToken = token ? jwt_decode(token) : null;
    if (userToken != null) {
      setUserName(userToken.user_name);
      setEmail(userToken.user_email);
    }
  }, [token, refreshToken]);

  const updateToken = async () => {
    const resUpdate = await axiosClient.post("/refresh-token", {
      refreshToken: refreshToken,
    });
    dispatch({
      type: ACTIONS.TOKEN,
      payload: {
        token: resUpdate.data.token,
        refreshToken: refreshToken,
      },
    });
  };

  const resetDispatch = () => {
    dispatch({
      type: ACTIONS.TOKEN,
      payload: null,
    });

    dispatch({
      type: ACTIONS.MODAL_NOTIFY,
      payload: {
        show: true,
        message: null,
        error: WARN_LOGIN,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (token && isJwtExpired(token) === false) {
        // console.log(isJwtExpired(token));
        const res = await axiosClient.patch(
          "/users/",
          {
            user_name: user_name,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (res.data.error || res.data.message) {
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: null,
              error: res.data.error ? res.data.error : res.data.message,
            },
          });
        } else if (refreshToken && isJwtExpired(refreshToken) === false) {
          updateToken();
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: res.data.msg,
              error: null,
            },
          });
        } else {
          resetDispatch();
        }
      } else {
        resetDispatch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {" "}
      <ModalNotify show={show} error={error} message={message} />
      <Form className="form-profile" onSubmit={handleSubmit}>
        <h3>{TITLE_ACCOUNT}</h3>
        <FormGroup className="form-group">
          <FormLabel>{LABEL_FULLNAME}</FormLabel>
          <Form.Control
            className="input-text"
            required
            type="text"
            value={user_name ? user_name : ""}
            onChange={(e) => setUserName(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form-group">
          <FormLabel>{LABEL_EMAIL} </FormLabel>
          <Form.Control
            readOnly
            className="input-text"
            required
            type="email"
            value={user_email ? user_email : ""}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>

        <Button
          type="submit"
          className="btn btn-primary btn-block"
          variant="dark"
        >
          {BUTTON_UPDATE}
        </Button>
      </Form>
    </>
  );
};

export default Profile;