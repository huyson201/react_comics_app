import React, { useEffect, useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { ACTIONS } from "../context/Action";
import { useUser } from "../context/UserProvider";
import Cookies from "js-cookie";
import ModalNotify from "../components/Modal/ModalNotify";

const Login = () => {
  const history = useHistory();
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const [checked, setChecked] = useState(false);
  const { dispatch } = useUser();

  // const [show, setShow] = useState(false);

  // const open = () => {
  //   setShow((prev) => !prev);
  // };

  function storageData(res) {
    Cookies.set("refreshToken", res.data.data.refreshToken, {
      expires: 7,
    });
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (user_password.length < 6) {
        alert("Mật khẩu >= 6 ký tự");
      } else {
        //POST data to login
        const res = await axiosClient.post("/login", {
          user_email: user_email,
          user_password: user_password,
        });
        //dispatch token data
        dispatch({
          type: ACTIONS.TOKEN,
          payload: {
            token: res.data.data.token,
            refreshToken: res.data.data.refreshToken,
          },
        });
        //remember me
        if (checked === true) {
          storageData(res);
        }
        // open();
        alert(res.data.msg);
        history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form className="form" onSubmit={handleSubmit}>
      <h3>Đăng nhập</h3>

      <FormGroup className="form-group">
        <FormLabel>Email </FormLabel>
        <Form.Control
          required
          type="email"
          placeholder="Nhập email ..."
          onChange={(e) => setEmail(e.target.value)}
        />

        <Form.Control.Feedback type="invalid">
          Vui lòng nhập email !
        </Form.Control.Feedback>
      </FormGroup>

      <FormGroup className="form-group">
        <FormLabel>Mật khẩu</FormLabel>
        <Form.Control
          required
          type="password"
          placeholder="Nhập mật khẩu ..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Vui lòng nhập mật khẩu !
        </Form.Control.Feedback>
      </FormGroup>

      <div className="flex-remember">
        <Form.Check
          type="checkbox"
          label=" Nhớ phiên đăng nhập"
          checked={checked}
          onChange={() => setChecked(!checked)}
          // feedback="You must agree before sign in."
          // feedbackType="invalid"
        />

        <p className="forgot-password text-right">
          <a href="#">Quên mật khẩu ?</a>
        </p>
      </div>

      <Button
        type="submit"
        className="btn btn-primary btn-block"
        variant="dark"
      >
        Đăng nhập
      </Button>

      <p className="text-right">
        Bạn chưa có tài khoản?
        {/*  */}
        <Link to="/register" className="here">
          {" "}
          Nhấn vào đây để đăng ký
        </Link>
      </p>

      {/* <ModalNotify show={show} setShow={setShow} /> */}
    </Form>
  );
};

export default Login;
