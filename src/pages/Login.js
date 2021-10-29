import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Cookies from "js-cookie";
import {
  FB_EMAIL,
  FB_PW,
  LABEL_EMAIL,
  LABEL_FORGOT,
  LABEL_PW,
  LABEL_REMEMBER,
  LOGIN_SUCCESS,
  TITLE_LOGIN,
  VALIDATE_PW,
} from "../constants";
import { login } from "../features/auth/userSlice";
import { useDispatch } from "react-redux";
import { modalNotify } from "../features/modal/modalSlice";

const Login = () => {
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const [checked, setChecked] = useState(false);
  const dispatch_redux = useDispatch();

  function storageData(res) {
    Cookies.set("refreshToken", res.data.data.refreshToken, {
      expires: 7,
    });
  }

  const notify = (error, message) => {
    dispatch_redux(
      modalNotify({
        show: true,
        message: message,
        error: error,
      })
    );
  };


  function dispatchData(res, checked) {
    //set show modal
    if (res.data.error || res.data.message) {
      notify(res.data.error ? res.data.error : res.data.message, null)
    } else {
      notify(null, LOGIN_SUCCESS)
      dispatch_redux(
        login({
          token: res.data.data.token,
          refreshToken: res.data.data.refreshToken,
        })
      );
      console.log(res.data.data.token);
      if (checked === true) {
        storageData(res);
      }
    }
  }

  async function flogin() {
    if (checked == false) {
      if (Cookies.get("refreshToken")) {
        refreshCookie(Cookies.get("refreshToken"));
      } else {
        loginNormal();
      }
    } else {
      loginNormal();
    }
  }

  async function loginNormal() {
    try {
      //POST data to login
      const res = await axiosClient.post("/login", {
        user_email: user_email,
        user_password: user_password,
      });
      dispatchData(res, checked);
    } catch (error) {
      console.log(error);
    }

  }

  async function refreshCookie(cookie) {
    const res = await axiosClient.post("/refresh-token", {
      refreshToken: cookie,
    });
    dispatchData(res, checked);
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (user_password.length < 6) {
        notify(VALIDATE_PW, null)
      } else {
        flogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form className="form" onSubmit={handleSubmit}>
        <h3>{TITLE_LOGIN}</h3>

        <FormGroup className="form-group">
          <FormLabel>{LABEL_EMAIL}</FormLabel>
          <Form.Control
            required
            type="email"
            placeholder="Nhập email ..."
            onChange={(e) => setEmail(e.target.value)}
          />

          <Form.Control.Feedback type="invalid">
            {FB_EMAIL}
          </Form.Control.Feedback>
        </FormGroup>

        <FormGroup className="form-group">
          <FormLabel>{LABEL_PW}</FormLabel>
          <Form.Control
            required
            type="password"
            placeholder="Nhập mật khẩu ..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">{FB_PW}</Form.Control.Feedback>
        </FormGroup>

        <div className="flex-remember">
          <Form.Check
            type="checkbox"
            label={LABEL_REMEMBER}
            checked={checked}
            onChange={() => setChecked(!checked)}
          />

          <p className="forgot-password text-right">
            <Link to="/forgot-password" className="here">
              {LABEL_FORGOT}
            </Link>
          </p>
        </div>

        <Button
          type="submit"
          className="btn btn-primary btn-block"
          variant="dark"
        >
          {TITLE_LOGIN}
        </Button>

        <p className="text-right">
          Bạn chưa có tài khoản?
          {/*  */}
          <Link to="/register" className="here">
            {" "}
            Nhấn vào đây để đăng ký
          </Link>
        </p>
      </Form>
    </>
  );
};

export default Login;
