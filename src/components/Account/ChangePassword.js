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
import { login, logout } from "../../features/auth/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { modalNotify } from "../../features/modal/modalSlice";
import userApi from "../../api/userApi";
import { useHistory } from "react-router";
import Cookies from "js-cookie";

const ChangePassword = () => {
  const [old_password, setUserPassword] = useState();
  const [new_password, setUserPasswordNew] = useState();
  const [cfnew_password, setUserPasswordCfNew] = useState();
  const { token, refreshToken, userInfo } = useSelector((state) => state.user);
  const history = useHistory();
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
        notify(null, res.data.message)
      }
    } catch (error) {
      notify(error.response.data, null)
    }
  }
  //xử lý dữ liệu khi người dùng nhấn submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token && isJwtExpired(token) === false) {
      if (checkCfPw(new_password, cfnew_password) === false) {
        notify(CHECK_PW, null)
      } else {
        changePW()
      }
    } else {
      if (Cookies.get("refreshToken")) {
        await updateToken()
        changePW()
      } else {
        dispatch_redux(logout())
        notify(WARN_LOGIN, null)
      }
    }
  };
  console.log(userInfo);
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
