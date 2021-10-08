import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/api/login", {
      user_email: user_email,
      user_password: user_password,
    }).then((res) => {
      console.log(res.data.data);
      console.log(res.data.data.user);
    });
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
          label=" Remember me"
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
        <Link to="/bookmark" className="here">
          {" "}
          Nhấn vào đây để đăng ký
        </Link>
      </p>
    </Form>
  );
};

export default Login;
