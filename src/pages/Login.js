import React, { useEffect, useState } from "react";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { ACTIONS } from "../context/Action";
import { useUser } from "../context/UserProvider";

const Login = () => {
  const history = useHistory();
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const [checked, setChecked] = useState(false);
  const { dispatch } = useUser();

  function storageData(res, checkremember) {
    if (checkremember === true) {
      const token = {
        token: res.data.data.token,
        refreshToken: res.data.data.refreshToken,
      };
      localStorage.setItem("token_refreshToken", JSON.stringify(token));
    }
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (user_password.length < 6) {
        alert("Mật khẩu >= 6 ký tự");
      } else {
        const res = await axiosClient.post("/login", {
          user_email: user_email,
          user_password: user_password,
        });
        dispatch({
          type: ACTIONS.TOKEN,
          payload: {
            token: res.data.data.token,
            refreshToken: res.data.data.refreshToken,
          },
        });
        alert(res.data.msg);
        storageData(res, checked);
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
          label=" Remember me"
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
    </Form>
  );
};

export default Login;
