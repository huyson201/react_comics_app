// import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Footer from "./components/Footer/Footer";
import UserProvider from "./context/UserProvider";
import DetailComic from "./pages/DetailComic";
import "moment/min/locales";

function App() {
  return (
    <div className="wrapper">
      <UserProvider>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/tim-kiem" component={Home}></Route>
            <Route path="/the-loai/:name" component={Home}></Route>
            <Route path="/truyen-tranh/:name" component={DetailComic}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/account" component={Profile}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/changePassword" component={Profile}></Route>
            {/* <Route path="/comics/:id" component={DetailComic}></Route> */}
            <Route path="*" component={() => "404 NOT FOUND"}></Route>
          </Switch>
          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
