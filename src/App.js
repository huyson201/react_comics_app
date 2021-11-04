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
import { setIsAdmin } from "./features/auth/userSlice";
import ChapList from "./components/Admin/ChapList";
import Sidebar from "./components/Admin/Sidebar";
function App() {
  const [state, setState] = useState();
  const { token, refreshToken, isAdmin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
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
          <Route exact path="/comics/:comicId" component={Dashboard}></Route>
          <Route exact path="/comics/:comicId/chaps" component={Dashboard}></Route>
          <Route exact path="/comic/chaps/add" component={Dashboard}></Route>
          <Route
            exact
            path="/comic/chaps/:id/update"
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
              <Route path="/login" component={Login}></Route>
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
