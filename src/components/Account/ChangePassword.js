import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { isJwtExpired } from "jwt-check-expiration";
import {
  CHECK_PW,
  EXPIRED,
  LABEL_CF_NEW_PW,
  LABEL_NEW_PW,
  LABEL_OLD_PW,
  TITLE_CHANGE_PW,
} from "../../constants";
import { login, logout } from "../../features/auth/userSlice";
import { useDispatch, useSelector } from "react-redux";
import userApi from "../../api/userApi";
import { useHistory } from "react-router";
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [old_password, setUserPassword] = useState();
  const [new_password, setUserPasswordNew] = useState();
  const [cfnew_password, setUserPasswordCfNew] = useState();
  const { token, refreshToken, userInfo } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch_redux = useDispatch();

  const notify = (error, message, warn) => {
    if (error !== null) {
      if (!toast.isActive(error)) {
        toast.error(error, { toastId: error })
      }
    } else if (message !== null) {
      if (!toast.isActive(message)) {
        toast.success(message, { toastId: message })
      }
    } else {
      if (!toast.isActive(warn)) {
        toast.warn(warn, { toastId: warn })
      }
    }
  }
  //refresh token
  const updateToken = async () => {
    try {
      const resUpdate = await userApi.refreshToken(refreshToken)
      if (resUpdate.data && resUpdate.data.token) {
        dispatch_redux(
          login({
            token: resUpdate.data.token,
            refreshToken: refreshToken,
          })
        );
      }
    } catch (error) {
      console.log(error.response.data);
      // notify(error.response.data, null)
    }
  };
  //update
  const changePW = async () => {
    try {
      const res = await userApi.changePassword(old_password, new_password, token);
      if (res.data.data) {
        notify(null, res.data.message,null)
      }
    } catch (error) {
      notify(error.response.data, null,null)
    }
  }
  //xử lý dữ liệu khi người dùng nhấn submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkCfPw(new_password, cfnew_password) === true) {
      if (token && isJwtExpired(token) === false) {
        changePW()
      } else {
        if (refreshToken && isJwtExpired(refreshToken) === false) {
          await updateToken()
          changePW()
        } else {
          dispatch_redux(logout())
          notify(null, null,EXPIRED)
        }
      }
    } else {
      notify(CHECK_PW, null,null)
    }
  };

  return (
    <>
      {userInfo !== null ?
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
        : history.push("/login")}

    </>
  );
};

const checkCfPw = (pw, cfpw) => {
  let check = false;
  if (cfpw === pw && pw.length >= 6) {
    check = true;
  }
  return check;
}

export default ChangePassword;
