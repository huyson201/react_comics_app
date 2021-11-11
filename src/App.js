// import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Comment from "./components/Comment/Comment";
import Footer from "./components/Footer/Footer";
import DetailComic from "./pages/DetailComic";
import DetailChapter from "./pages/DetailChapter";
import "moment/min/locales";
import ModalNotify from "./components/Modal/ModalNotify";
import Follow from "./pages/Follow";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import "moment/locale/vi";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { Fragment, useEffect, useState } from "react";
import Dashboard from "./components/Admin/Dashboard";
import { login, logout, setIsAdmin, setUserInfo } from "./features/auth/userSlice";
import ChapList from "./components/Admin/ChapList";
import Sidebar from "./components/Admin/Sidebar";


function App() {
  const { token, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [socketIo, setSocketIo] = useState(false)

  const getToken = () => {
    if (Cookies.get("refreshToken") && jwtDecode(Cookies.get("refreshToken"))) {
      refreshTokenCookie(Cookies.get("refreshToken"))
    }
  }

  //lấy thông tin user sau khi xử lý refresh token cookie
  const refreshTokenCookie = async (cookie) => {
    try {
      const res = await userApi.refreshToken(cookie);
      if (res.data.token) {
        const userFromToken = jwtDecode(res.data.token)
        dispatch(
          login({
            token: res.data.token,
            refreshToken: cookie,
          })
        );
        dispatchUser(userFromToken.user_uuid, res.data.token)
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Lưu redux user info
  const dispatchUser = async (id, token) => {
    try {
      const getInfo = await userApi.getUserById(id, token)
      if (getInfo.data.data) {
        dispatch(setUserInfo(getInfo.data.data))
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    if (token) {
      const user = jwtDecode(token);

      if (user && user.user_role != null) {
        if (user.user_role === "user") {
          setState(0);
        } else {
          setState(1);
        }
      }
    }
  }, [token]);



  return (
    <>
      <Router>
        <Switch>
          {/* Admin */}
          <Route path="/dashboard" component={Dashboard}></Route>
          <Route exact path="/comics/page/:number" component={Dashboard}></Route>
          <Route exact path="/comics/add" component={Dashboard}></Route>
          <Route exact path="/comics/edit/:comicId" component={Dashboard}></Route>
          <Route exact path="/comics/:comicId" component={Dashboard}></Route>
          <Route exact path="/comics/:comicId/chaps/page/:numberPageChap" component={Dashboard}></Route>
          <Route exact path="/comic/:comicId/chaps/add" component={Dashboard}></Route>
          <Route
            exact
            path="/comics/:comicId/chaps/:chapId/update"
            component={Dashboard}
          ></Route>

          {/* Client */}
          <Fragment>
            <div className="wrapper">
              <ModalNotify />
              <Header />
              <Route exact path="/" component={Home}></Route>
              <Route
                exact
                path="/truyen-moi-cap-nhat/page/:number"
                component={Home}
              ></Route>
              <Route
                path="/tim-kiem/:keyword/page/:number"
                component={Home}
              ></Route>
              <Route path="/tim-kiem-nang-cao" component={Home}></Route>
              <Route
                path="/the-loai/:name/:id/page/:number"
                component={Home}
              ></Route>
              <Route path="/truyen-theo-doi" component={Follow}></Route>
              <Route path="/truyen-tranh/:name" component={DetailComic}></Route>
              <Route
                path="/:chapter/:id/truyen-tranh/:name"
                component={DetailChapter}
              ></Route>

              <Route path="/register" component={Register}></Route>
              <Route path="/account" component={Account}></Route>
              <Route path="/profile" component={Account}></Route>
              <Route path="/changePassword" component={Account}></Route>
              <Route path="/follows" component={Account}></Route>
              <Route path="/forgot-password" component={ForgotPassword}></Route>
              <Route
                path="/reset-password/:token"
                component={ResetPassword}
              ></Route>
              <Route path="/login" component={Login}></Route>

              <Footer />
            </div>
          </Fragment>
          <Route path="*" component={() => "404 NOT FOUND"}></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
