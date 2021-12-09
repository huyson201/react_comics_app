import React, { useState } from "react";
import { Form, FormLabel, FormGroup, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FB_EMAIL,
  FB_PW,
  LABEL_EMAIL,
  LABEL_FORGOT,
  LABEL_PW,
  LOGIN_SUCCESS,
  TITLE_LOGIN,
  VALIDATE_PW,
} from "../constants";
import {
  login,
  setIsAdmin,
  setUserInfo,
} from "../features/auth/userSlice";
import { useDispatch } from "react-redux";
import userApi from "../api/userApi";
import jwtDecode from "jwt-decode";
import { toast } from 'react-toastify';
import { useHistory } from "react-router";
const Login = () => {
  const [user_email, setEmail] = useState();
  const [user_password, setPassword] = useState();
  const history = useHistory()
  const dispatch_redux = useDispatch();
  const [loading, setloading] = useState(false);

  const notify = (error, message, warn) => {
    if (error !== null) {
      if (!toast.isActive(error)) {
        toast.error(error, { toastId: error })
      }
    } else if (message !== null) {
      if (!toast.isActive(message)) {
        toast.success(message, { toastId: message })
        history.push("/")
      }

    } else {
      if (!toast.isActive(warn)) {
        toast.warn(warn, { toastId: warn })
      }
    }
  }
  //lưu data(token refreshtoken userInfo)
  const dispatchData = async (res) => {
    //set show modal
    if (res.data.data && res.data.data.token) {
      const token = res.data.data.token;
      const userId = jwtDecode(token);
      console.log(userId);
      if (userId.user_role === 'admin') {
        dispatch_redux(setIsAdmin(true));
      }
      dispatch_redux(
        login({
          token: token,
          refreshToken: res.data.data.refreshToken,
        })
      );
      userId
        ? dispatchUser(userId.user_uuid, token)
        : console.log("Chưa lưu được dữ liệu user");
    }
  };
  //Lưu redux user info
  const dispatchUser = async (id, token) => {
    try {
      const getInfo = await userApi.getUserById(id, token);
      if (getInfo.data.data) {
        notify(null, LOGIN_SUCCESS, null);
        dispatch_redux(setUserInfo(getInfo.data.data));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  //login không remember
  const loginNormal = async () => {
    try {
      //POST data to login
      const res = await userApi.login(user_email, user_password);
      if (res.data.data && res.data.data.token) {
        dispatchData(res);
        Cookies.set("refreshToken", res.data.data.refreshToken, {
          expires: 7,
        });
      }
    } catch (error) {
      if (error.response) {
        notify(error.response.data, null, null);
      }
    }
  };
  //login khi nhấn đăng nhập
  const handleSubmit = async (event) => {
    event.preventDefault();
    setloading(true)
    if (user_password.length < 6) {
      notify(VALIDATE_PW, null, null);
      setloading(false)
    } else {
      loginNormal();
      setloading(false)
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
          <p className="forgot-password text-right">
            <Link to="/forgot-password" className="here">
              {LABEL_FORGOT}
            </Link>
          </p>
        </div>

        <Button type="submit" className="btn-primary" variant="dark">
        {loading === true ? <Spinner animation="border" /> : TITLE_LOGIN}
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
