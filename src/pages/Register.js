import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";

const Register = () => {
  const [user_name, setUserName] = useState();
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const [cf_password, setCfPassword] = useState();
  const [user, setUser] = useState();

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setUser({
      user_name: user_name,
      user_email: user_email,
      user_password: user_password,
    });
  }, [user_name, user_email, user_password, cf_password]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form.checkValidity());
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity() === true) {
      if (checkCfPw(user_password, cf_password) === false) {
        alert("Please check password !");
      } else {
        Axios.post("http://localhost:3001/api/users", user).then((res) => {
          if (res.data.error != null && res.data.error != "") {
            alert(res.data.error);
          }
          console.log(res.data.data);
        });
      }
    }
  };
  return (
    <Form
      className="form"
      onSubmit={handleSubmit}
      noValidate
      validated={validated}
    >
      <h3>Đăng ký</h3>

      <FormGroup className="form-group">
        <FormLabel>Fullname</FormLabel>
        <Form.Control
          required
          type="text"
          placeholder="Nhập fullname ..."
          onChange={(e) => setUserName(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Vui lòng nhập username !
        </Form.Control.Feedback>
      </FormGroup>

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

      <FormGroup className="form-group">
        <FormLabel>Nhập lại mật khẩu</FormLabel>
        <Form.Control
          required
          type="password"
          placeholder="Nhập lại mật khẩu ..."
          onChange={(e) => setCfPassword(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Vui lòng nhập lại mật khẩu !
        </Form.Control.Feedback>
      </FormGroup>

      <Button
        type="submit"
        className="btn btn-primary btn-block "
        variant="dark"
      >
        Đăng ký
      </Button>
      <Link to="/account" className="here">
        {" "}
        Nhấn vào đây để đăng nhập ngay !
      </Link>
    </Form>
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
