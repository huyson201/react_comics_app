import React, { Component } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
export class NavBar extends Component {
  render() {
    return (
      <>
        <div className="wrapper">
          <nav className="nav-bar">
            <a className="nav-item">Trang chủ</a>
            <a className="nav-item">Thể loại</a>
            <a className="nav-item">Lịch sử</a>
            <a className="nav-item">Theo dõi</a>
            <a className="nav-item">Tài khoản</a>
          </nav>
          <div className="search">
            <a className="search-filter"></a>
            <form className="form-search">
              <input
                className="input-search"
                type="text"
                placeholder="Nhập từ khoá..."
              ></input>
              <button type="submit">S</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default NavBar;
