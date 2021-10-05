import React, { Component, useState } from "react";
import { MdHome, MdBookmark, MdPerson, MdFilterAlt } from "react-icons/md";
import { ImBooks, ImHistory, ImSearch } from "react-icons/im";
import { Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./header.css";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="nav-bar">
        <Link to="/" className="nav-item">
          <MdHome />
          Trang chủ
        </Link>
        <a
          className="nav-item"
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          <ImBooks />
          Thể loại
        </a>
        <Link to="/history" className="nav-item">
          <ImHistory /> Lịch sử
        </Link>
        <Link to="/bookmark" className="nav-item">
          <MdBookmark />
          Theo dõi
        </Link>
        <Link to="/account" className="nav-item">
          <MdPerson />
          Tài khoản
        </Link>
      </nav>
      <Collapse in={open}>
        <div id="example-collapse-text">
          <div className="list-category">
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
            <a className="category-item">Hành động</a>
          </div>
        </div>
      </Collapse>
    </>
  );
};
const SearchForm = () => {
  return (
    <>
      <div className="search">
        <a className="search-filter">
          <MdFilterAlt />
        </a>
        <form className="form-search">
          <input
            className="input-search"
            type="text"
            placeholder="Nhập từ khoá..."
          ></input>
          <button className="btn-search" type="submit">
            <ImSearch />
          </button>
        </form>
      </div>
    </>
  );
};
export class Header extends Component {
  render() {
    return (
      <>
      <header>
        <Navbar />
        <SearchForm/>
        </header>
      </>
    );
  }
}

export default Header;
