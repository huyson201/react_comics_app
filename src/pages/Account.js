import React from "react";
import { useHistory, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { LOGOUT_SUCCESS } from "../constants";
import Profile from "../components/Account/Profile";
import ChangePassword from "../components/Account/ChangePassword";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/userSlice";
import userApi from "../api/userApi";
import Follow from "./Follow";
import { toast } from 'react-toastify';

const Account = () => {
  const history = useHistory();
  const token = useSelector(state => state.user.token)
  const dispatch_redux = useDispatch();

  const notify = (error, message, warn) => {
    if (error !== null) {
      if (!toast.isActive(error)) {
        toast.error(error, { toastId: error })
      }
    } else if (message !== null) {
      if (!toast.isActive(message)) {
        toast.success(message, { toastId: message })
      }
    } else {
      if (!toast.isActive(warn)) {
        toast.warn(warn, { toastId: warn })
      }
    }
  }

  const handleLogout = async () => {
    try {
      const res = await userApi.logout(token)
      // console.log(res.data);
      if (res.status === 204) {
        notify(null, LOGOUT_SUCCESS, null)
        Cookies.remove("refreshToken");
        dispatch_redux(logout());
      }
    } catch (error) {
      notify(error.response.data, null, null)
    }
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
                    <Link to="/profile">
                      <i className="fas fa-info-circle"></i> Thông tin tài khoản
                    </Link>
                  </li>
                  <li className="nav-li">
                    <Link to="/truyen-theo-doi">
                      <i className="fas fa-book"></i> Truyện theo dõi
                    </Link>
                  </li>
                  {/* <li className="nav-li">
                    <Link to="">
                      <i className="far fa-list-alt"></i> Truyện đã đăng
                    </Link>
                  </li> */}
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
                ) : ""}
              </div>
            </div>
          </div>
        </div>
        {/* {history.location.pathname === "/follows" ? (
          <Follow />) : ""} */}
      </div>
    </>
  );
};
export default Account;
