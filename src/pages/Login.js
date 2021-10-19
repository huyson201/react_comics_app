import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { ACTIONS } from "../context/Action";
import { useData } from "../context/Provider";
import Cookies from "js-cookie";
import ModalNotify from "../components/Modal/ModalNotify";
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

const Login = () => {
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const [checked, setChecked] = useState(false);
  const { dispatch, show, error, message } = useData();
  const dispatch_redux = useDispatch();

  function storageData(res) {
    Cookies.set("refreshToken", res.data.data.refreshToken, {
      expires: 7,
    });
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (user_password.length < 6) {
        dispatch({
          type: ACTIONS.MODAL_NOTIFY,
          payload: {
            show: true,
            message: null,
            error: VALIDATE_PW,
          },
        });
      } else {
        //POST data to login
        const res = await axiosClient.post("/login", {
          user_email: user_email,
          user_password: user_password,
        });

        //set show modal
        if (res.data.error || res.data.message) {
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: null,
              error: res.data.error ? res.data.error : res.data.message,
            },
          });
          // setShow(true);
          // res.data.error
          //   ? setError(res.data.error)
          //   : setError(res.data.message);
        } else {
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: LOGIN_SUCCESS,
              error: null,
            },
          });

          dispatch_redux(
            login({
              token: res.data.data.token,
              refreshToken: res.data.data.refreshToken,
            })
          );
          //remember me
          if (checked === true) {
            storageData(res);
          }

          dispatch(
            login({
              token: res.data.data.token,
              refreshToken: res.data.data.refreshToken,
            })
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ModalNotify show={show} error={error} message={message} />

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
            <a href="#">{LABEL_FORGOT}</a>
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
