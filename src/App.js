// import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Footer from "./components/Footer/Footer";
import DetailComic from "./pages/DetailComic";
import DetailChapter from "./pages/DetailChapter";
import "moment/min/locales";
import Follow from "./pages/Follow";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import "moment/locale/vi";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { Fragment, useEffect, useState } from "react";
import Dashboard from "./components/Admin/Dashboard";
import { login, setIsAdmin, setUserInfo } from "./features/auth/userSlice";
import userApi from "./api/userApi";
import Cookies from "js-cookie";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import History from "./pages/History";
import Loading from "./components/Loading/Loading";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const history = useHistory()
  const { token, isLogged } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    if (Cookies.get("refreshToken") && jwtDecode(Cookies.get("refreshToken"))) {
      refreshTokenCookie(Cookies.get("refreshToken"));
    }
  };

  //lấy thông tin user sau khi xử lý refresh token cookie
  const refreshTokenCookie = async (cookie) => {
    try {
      const res = await userApi.refreshToken(cookie);
      if (res.data.token) {
        const userFromToken = jwtDecode(res.data.token);
        dispatch(
          login({
            token: res.data.token,
            refreshToken: cookie,
          })
        );
        dispatchUser(userFromToken.user_uuid, res.data.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Lưu redux user info
  const dispatchUser = async (id, token) => {
    try {
      const getInfo = await userApi.getUserById(id, token);
      if (getInfo.data.data) {
        dispatch(setUserInfo(getInfo.data.data));
        if (getInfo.data.data.user_role === "admin") {
          dispatch(setIsAdmin(true));
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    getToken();
  }, []);
  useEffect(() => {
    if (token && isLogged) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [token,isLogged]);

  return (
    <>
      {loading  ? (
        <Loading />
      ) : (
        <>
          <div>
            <ToastContainer
              theme="light"
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover>

            </ToastContainer>
          </div>
          <Router>
            <Switch>
              {/* Admin */}
              <ProtectedRouteAdmin
                path="/dashboard"
                component={Dashboard}
              ></ProtectedRouteAdmin>
              <ProtectedRouteAdmin
                exact
                path="/comics/page/:number"
                component={Dashboard}
              ></ProtectedRouteAdmin>
              <ProtectedRouteAdmin
                exact
                path="/comics/add"
                component={Dashboard}
              ></ProtectedRouteAdmin>
              <ProtectedRouteAdmin
                exact
                path="/comics/edit/:comicId"
                component={Dashboard}
              ></ProtectedRouteAdmin>
              <ProtectedRouteAdmin
                exact
                path="/comics/:comicId"
                component={Dashboard}
              ></ProtectedRouteAdmin>
              <ProtectedRouteAdmin
                exact
                path="/comics/:comicId/chaps/page/:numberPageChap"
                component={Dashboard}
              ></ProtectedRouteAdmin>
              <ProtectedRouteAdmin
                exact
                path="/comic/:comicId/chaps/add"
                component={Dashboard}
              ></ProtectedRouteAdmin>
              <ProtectedRouteAdmin
                exact
                path="/comics/:comicId/chaps/:chapId/update"
                component={Dashboard}
              ></ProtectedRouteAdmin>

              {/* Client */}
              <Fragment>
                {/* <Route path="/permission" component={() => }></Route> */}
                <div className="wrapper">
                  <Header />
                  <Route exact path="/" component={Home}></Route>
                  <Route exact path="/lich-su" component={History}></Route>
                  <Route
                    exact
                    path="/truyen-moi-cap-nhat/page/:number"
                    component={Home}
                  ></Route>
                  <Route
                    path="/tim-kiem/:keyword/page/:number"
                    component={Home}
                  ></Route>
                  <Route exact path="/tim-kiem-nang-cao" component={Home}></Route>
                  <Route
                    path="/the-loai/:name/:id/page/:number"
                    component={Home}
                  ></Route>
                  <ProtectedRoute path="/truyen-theo-doi" component={Follow}></ProtectedRoute>
                  <Route
                    path="/truyen-tranh/:name"
                    component={DetailComic}
                  ></Route>
                  <Route
                    path="/:chapter/:id/truyen-tranh/:name"
                    component={DetailChapter}
                  ></Route>

                  <ProtectedRoute
                    path="/account"
                    component={Account}
                  ></ProtectedRoute>
                  <ProtectedRoute
                    path="/profile"
                    component={Account}
                  ></ProtectedRoute>
                  <ProtectedRoute
                    path="/changePassword"
                    component={Account}
                  ></ProtectedRoute>
                  <Route path="/follows" component={Account}></Route>
                  <Route
                    path="/forgot-password"
                    component={ForgotPassword}
                  ></Route>
                  <Route
                    path="/reset-password/:token"
                    component={ResetPassword}
                  ></Route>
                  <ProtectedRoute path="/register" component={Register}></ProtectedRoute>
                  <ProtectedRoute path="/login" component={Login}></ProtectedRoute>
                  <Footer />
                </div>
              </Fragment>
            </Switch>
          </Router>
        </>
      )}
    </>
  );
}

export default App;
