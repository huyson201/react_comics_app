import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router,Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <div className="wrapper">
      <Router>
        <Header></Header>
        <Route exact path="/" component={Home}></Route>
        <Route path="/account" component={Login}></Route>
        <Route path="/bookmark" component={Register}></Route>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
