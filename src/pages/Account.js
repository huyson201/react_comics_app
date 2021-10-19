import React from "react";
import { useHistory, Link } from "react-router-dom";
import { ACTIONS } from "../context/Action";
import { useData } from "../context/Provider";
import Cookies from "js-cookie";
import ModalNotify from "../components/Modal/ModalNotify";
import { LOGOUT_SUCCESS } from "../constants";
import Profile from "../components/Account/Profile";
import ChangePassword from "../components/Account/ChangePassword";

const Account = () => {
  const history = useHistory();
  const { dispatch, show, error, message } = useData();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("token_refreshToken");
    dispatch({ type: ACTIONS.TOKEN, payload: null });
    dispatch({
      type: ACTIONS.MODAL_NOTIFY,
      payload: {
        show: true,
        message: LOGOUT_SUCCESS,
        error: null,
      },
    });
  };

  return (
    <>
      <ModalNotify show={show} error={error} message={message} />
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
                    </Link>
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
                  <Profile />
                ) : history.location.pathname === "/changePassword" ? (
                  <ChangePassword />
                ) : (
                  "Chưa xử lý"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Account;