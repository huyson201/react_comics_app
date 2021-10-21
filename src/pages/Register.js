import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import axiosClient from "../api/axiosClient";
import ModalNotify from "../components/Modal/ModalNotify";
import {
  CHECK_PW,
  FB_CF_PW,
  FB_EMAIL,
  FB_PW,
  FB_USERNAME,
  LABEL_CF_PW,
  LABEL_EMAIL,
  LABEL_FULLNAME,
  LABEL_PW,
  REGISTER_SUCCESS,
  TITLE_REGISTER,
  VALIDATE_PW,
} from "../constants";
import { useData } from "../context/Provider";
import { ACTIONS } from "../context/Action";

const Register = () => {
  const [user_name, setUserName] = useState();
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const [confirm_password, setCfPassword] = useState();
  const [user, setUser] = useState();
  const [validated, setValidated] = useState(false);
  const { dispatch, show, error, message } = useData();

  useEffect(() => {
    setUser({
      user_name: user_name,
      user_email: user_email,
      user_password: user_password,
      confirm_password: confirm_password,
    });
  }, [user_name, user_email, user_password, confirm_password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      event.preventDefault();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      if (user_password.length < 6) {
        dispatch({
          type: ACTIONS.MODAL_NOTIFY,
          payload: {
            show: true,
            message: null,
            error: VALIDATE_PW,
          },
        });
      } else if (checkCfPw(user_password, confirm_password) === false) {
        dispatch({
          type: ACTIONS.MODAL_NOTIFY,
          payload: {
            show: true,
            message: null,
            error: CHECK_PW,
          },
        });
      } else {
        const res = await axiosClient.post("/users", user);
        console.log(res.data);
        if (res.data.error || res.data.message) {
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: null,
              error: res.data.error ? res.data.error : res.data.message,
            },
          });
        } else {
          dispatch({
            type: ACTIONS.MODAL_NOTIFY,
            payload: {
              show: true,
              message: REGISTER_SUCCESS,
              error: null,
            },
          });
        }
      }
    }
  };

  return (
    <>
      <Form
        className="form"
        onSubmit={handleSubmit}
        noValidate
        validated={validated}
      >
        <h3>{TITLE_REGISTER}</h3>

        <FormGroup className="form-group">
          <FormLabel>{LABEL_FULLNAME}</FormLabel>
          <Form.Control
            required
            type="text"
            placeholder="Nhập fullname ..."
            onChange={(e) => setUserName(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {FB_USERNAME}
          </Form.Control.Feedback>
        </FormGroup>

        <FormGroup className="form-group">
          <FormLabel>{LABEL_EMAIL} </FormLabel>
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

        <FormGroup className="form-group">
          <FormLabel>{LABEL_CF_PW}</FormLabel>
          <Form.Control
            required
            type="password"
            placeholder="Nhập lại mật khẩu ..."
            onChange={(e) => setCfPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {FB_CF_PW}
          </Form.Control.Feedback>
        </FormGroup>

        <Button
          type="submit"
          className="btn btn-primary btn-block "
          variant="dark"
        >
          {TITLE_REGISTER}
        </Button>
        <Link to="/login" className="here">
          {" "}
          Nhấn vào đây để đăng nhập ngay !
        </Link>
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
export default Register;
