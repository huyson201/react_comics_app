import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { isJwtExpired } from "jwt-check-expiration";
import axiosClient from "../../api/axiosClient";
import { useData } from "../../context/Provider";
import { ACTIONS } from "../../context/Action";
import ModalNotify from "../Modal/ModalNotify";
import { CHECK_PW, LABEL_CF_NEW_PW, LABEL_NEW_PW, LABEL_OLD_PW, TITLE_CHANGE_PW, WARN_LOGIN } from "../../constants";

const ChangePassword = () => {
  const [old_password, setUserPassword] = useState();
  const [new_password, setUserPasswordNew] = useState();
  const [cfnew_password, setUserPasswordCfNew] = useState();
  const { dispatch, show, error, message, token } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (token && isJwtExpired(token) === false) {
        if (checkCfPw(new_password, cfnew_password) === false) {
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: null,
              error: CHECK_PW,
            },
          });
        } else {
          const res = await axiosClient.patch(
            "/users/change-password",
            {
              old_password: old_password,
              new_password: new_password,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          if (res.data.error) {
            dispatch({
              type: ACTIONS.MODAL_NOTIFY,
              payload: {
                show: true,
                message: null,
                error: res.data.error,
              },
            });
          }
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: res.data.msg,
              error: null,
            },
          });
        }
      } else {
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
        <h3>{TITLE_CHANGE_PW}</h3>
        <FormGroup className="form-group">
          <FormLabel>{LABEL_OLD_PW}</FormLabel>
          <Form.Control
            className="input-text"
            required
            type="password"
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form-group">
          <FormLabel>{LABEL_NEW_PW}</FormLabel>
          <Form.Control
            className="input-text"
            required
            type="password"
            onChange={(e) => setUserPasswordNew(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="form-group">
          <FormLabel>{LABEL_CF_NEW_PW}</FormLabel>
          <Form.Control
            className="input-text"
            required
            type="password"
            onChange={(e) => setUserPasswordCfNew(e.target.value)}
          />
        </FormGroup>

        <Button
          type="submit"
          className="btn btn-primary btn-block"
          variant="dark"
        >
          {TITLE_CHANGE_PW}
        </Button>
      </Form>
    </>
  );
};

function checkCfPw(pw, cfpw) {
  let check = false;
  if (cfpw === pw && pw.length >= 6) {
    check = true;
  }
  return check;
}

export default ChangePassword;