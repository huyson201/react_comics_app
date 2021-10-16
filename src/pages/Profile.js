import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { ACTIONS } from "../context/Action";
import jwt_decode from "jwt-decode";
import { useUser } from "../context/UserProvider";
import axiosClient from "../api/axiosClient";
import Cookies from "js-cookie";

const Profile = () => {
  const history = useHistory();
  const { dispatch } = useUser();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("token_refreshToken");
    dispatch({ type: ACTIONS.TOKEN, payload: null });
    dispatch({
      type: ACTIONS.UPDATE,
      payload: false,
    });
    alert("logout thanh cong");
  };

  return (
    <>
      <div className="custom-row">
        <div className="container">
          <div className="row ">
            <div className="col-4">
              <h3 className="custom-h3">Tài khoản cá nhân</h3>
              <nav className="user-sidelink clearfix">
                <ul>
                  <li className="nav-li">
                    <Link to="">
                      <i className="fas fa-tachometer-alt"></i> Thông tin chung
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link to="/profile">
                      <i className="fas fa-info-circle"></i> Thông tin tài khoản
                    </Link >
                  </li>
                  <li className="nav-li">
                    <Link to="">
                      <i className="fas fa-book"></i> Truyện theo dõi
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link to="">
                      <i className="far fa-list-alt"></i> Truyện đã đăng
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link to="/changePassword">
                      <i className="fas fa-key"></i> Đổi mật khẩu
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link to="/" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-8 custom-form-text">
              <div className="info">
                {history.location.pathname === "/profile" ? (
                  <Info />
                ) : history.location.pathname === "/changePassword" ? (
                  <ChangePassword />
                ) : (
                  "djfkjsd"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Info = () => {
  const [user_name, setUserName] = useState();
  const [user_email, setEmail] = useState();
  const [user_uuid, setUserId] = useState(0);
  const { token, refreshToken } = useUser();
  const { dispatch } = useUser();
  useEffect(() => {
    const userToken = token ? jwt_decode(token) : null;
    if (userToken != null) {
      setUserName(userToken.user_name);
      setEmail(userToken.user_email);
      setUserId(userToken.user_uuid);
    }
  }, [token, refreshToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (token) {
        const res = await axiosClient.patch(
          "/users/" + user_uuid,
          {
            user_name: user_name,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (!res.data.error && refreshToken) {
          const resUpdate = await axiosClient.post("/refresh-token", {
            refreshToken: refreshToken,
          });
          dispatch({
            type: ACTIONS.TOKEN,
            payload: {
              token: resUpdate.data.token,
              refreshToken: refreshToken,
            },
          });
        }
        alert(res.data.msg);
      } else {
        alert("Vui lòng đăng nhập");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form className="form-profile" onSubmit={handleSubmit}>
      <h3>Thông tin tài khoản</h3>
      <FormGroup className="form-group">
        <FormLabel>Fullname </FormLabel>
        <Form.Control
          className="input-text"
          required
          type="text"
          value={user_name ? user_name : ""}
          onChange={(e) => setUserName(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="form-group">
        <FormLabel>Email </FormLabel>
        <Form.Control
          readOnly
          className="input-text"
          required
          type="email"
          value={user_email ? user_email : ""}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>

      <Button
        type="submit"
        className="btn btn-primary btn-block"
        variant="dark"
      >
        Cập nhật
      </Button>
    </Form>
  );
};

const ChangePassword = () => {
  const [user_password, setUserPassword] = useState();
  const [user_password_new, setUserPasswordNew] = useState();
  const [user_password_cfnew, setUserPasswordCfNew] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form className="form-profile" onSubmit={handleSubmit}>
      <h3>Đổi mật khẩu</h3>
      <FormGroup className="form-group">
        <FormLabel>Nhập mật khẩu cũ </FormLabel>
        <Form.Control
          className="input-text"
          required
          type="password"
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="form-group">
        <FormLabel>Nhập mật khẩu mới </FormLabel>
        <Form.Control
          className="input-text"
          required
          type="password"
          onChange={(e) => setUserPasswordNew(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="form-group">
        <FormLabel>Nhập lại mật khẩu mới </FormLabel>
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
        Đổi mật khẩu
      </Button>
    </Form>
  );
};

export default Profile;
