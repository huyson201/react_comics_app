import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, FormLabel, FormGroup, Button } from "react-bootstrap";
import { ACTIONS } from "../context/Action";
import { useUser } from "../context/UserProvider";

const Profile = () => {
  const history = useHistory();
  const { dispatch } = useUser();
  const handleLogout = () => {
    localStorage.removeItem("token_refreshToken");
    localStorage.removeItem("token");
    dispatch({ type: ACTIONS.TOKEN, payload: null });
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
                    <Link>
                      <i className="fas fa-tachometer-alt"></i> Thông tin chung
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link to="/profile">
                      <i className="fas fa-info-circle"></i> Thông tin tài khoản
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link>
                      <i className="fas fa-book"></i> Truyện theo dõi
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link>
                      <i className="far fa-list-alt"></i> Truyện đã đăng
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link>
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
                {history.location.pathname === "/follow" ? <Info /> : "djfkjsd"}
                {console.log(history.location)}
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Form className="form-profile" onSubmit={handleSubmit}>
      <h3>Thông tin tài khoản</h3>
      <FormGroup className="form-group">
        <FormLabel>Fullname</FormLabel>
        <Form.Control
          required
          type="text"
          value="kieu oanh ne"
          onChange={(e) => setUserName(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="form-group">
        <FormLabel>Email </FormLabel>
        <Form.Control
          required
          type="email"
          value="oanhhihih@gmail.com"
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

export default Profile;
