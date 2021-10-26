import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { isJwtExpired } from "jwt-check-expiration";
import axiosClient from "../../api/axiosClient";
import {
  CHECK_PW,
  LABEL_CF_NEW_PW,
  LABEL_NEW_PW,
  LABEL_OLD_PW,
  TITLE_CHANGE_PW,
  WARN_LOGIN,
} from "../../constants";
import { isCheck, logout } from "../../features/auth/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { modalNotify } from "../../features/modal/modalSlice";

const ChangePassword = () => {
  const [old_password, setUserPassword] = useState();
  const [new_password, setUserPasswordNew] = useState();
  const [cfnew_password, setUserPasswordCfNew] = useState();
  const { token, refreshToken } = useSelector((state) => state.user);
  const dispatch_redux = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (token && isJwtExpired(token) === false) {
        if (checkCfPw(new_password, cfnew_password) === false) {
          dispatch_redux(
            modalNotify({
              show: true,
              message: null,
              error: CHECK_PW,
            })
          );
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
          if (res.data.error || res.data.err) {
            console.log(res.data.err);
            dispatch_redux(
              modalNotify({
                show: true,
                message: null,
                error: res.data.error ? res.data.error : res.data.err,
              })
            );
          } else {
            dispatch_redux(
              modalNotify({
                show: true,
                message: res.data.msg,
                error: null,
              })
            );
          }
        }
      } else {
        dispatch_redux(isCheck(true));
        dispatch_redux(
          modalNotify({
            show: true,
            message: null,
            error: WARN_LOGIN,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
