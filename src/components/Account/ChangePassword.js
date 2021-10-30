import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { isJwtExpired } from "jwt-check-expiration";
import {
  CHECK_PW,
  LABEL_CF_NEW_PW,
  LABEL_NEW_PW,
  LABEL_OLD_PW,
  TITLE_CHANGE_PW,
  WARN_LOGIN,
} from "../../constants";
import { isCheck } from "../../features/auth/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { modalNotify } from "../../features/modal/modalSlice";
import userApi from "../../api/userApi";

const ChangePassword = () => {
  const [old_password, setUserPassword] = useState();
  const [new_password, setUserPasswordNew] = useState();
  const [cfnew_password, setUserPasswordCfNew] = useState();
  const { token } = useSelector((state) => state.user);
  const dispatch_redux = useDispatch();

  const notify = (error, message) => {
    dispatch_redux(
      modalNotify({
        show: true,
        message: message,
        error: error,
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token && isJwtExpired(token) === false) {
      if (checkCfPw(new_password, cfnew_password) === false) {
        notify(CHECK_PW, null)
      } else {
        try {
          const res = await userApi.changePassword(old_password, new_password, token);
          if (res.data.data) {
            notify(null, res.data.message)
          }
        } catch (error) {
          notify(error.response.data, null)
        }
      }
    } else {
      dispatch_redux(isCheck(true));
      notify(WARN_LOGIN, null)
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
