// import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Footer from "./components/Footer/Footer";
import DetailComic from "./pages/DetailComic";
import DetailChapter from "./pages/DetailChapter";
import "moment/min/locales";
import Provider from "./context/Provider";

function App() {
  return (
    <div className="wrapper">
      <Provider>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/tim-kiem" component={Home}></Route>
            <Route path="/tim-kiem-nang-cao" component={Home}></Route>
            <Route exact path="/the-loai/:name" component={Home}></Route>
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
            <Route path="*" component={() => "404 NOT FOUND"}></Route>
          </Switch>
          <Footer />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
