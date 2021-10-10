import React, { Component, useState, useEffect, useCallback } from "react";
import { MdHome, MdBookmark, MdPerson, MdFilterAlt } from "react-icons/md";
import { ImBooks, ImHistory, ImSearch } from "react-icons/im";
import { Collapse, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./header.css";
import jwt_decode from "jwt-decode";
import { useUser } from "../../context/UserProvider";

import comicApi from "../../api/comicApi";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getAllCategories = () => {
      comicApi
        .getAllCategories()
        .then((response) => {
          setCategories(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllCategories();
  }, []);
  return (
    <>
      <nav className="nav-bar">
        <Link to="/" className="nav-item">
          <MdHome />
          Trang chủ
        </Link>
        <Link
          to=""
          className="nav-item"
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          <ImBooks />
          Thể loại
        </a>
        <Link to="/account" className="nav-item">
          <ImHistory /> Lịch sử
        </Link>
        <Link to="/register" className="nav-item">
          <MdBookmark />
          Theo dõi
        </Link>
        <Link to="/login" className="nav-item">
          <MdPerson />
          {props.username}
        </Link>
        
        <div className="nav-item account">
          <Link to="/account" className="">
            <MdPerson />
            Tài khoản
          </Link>
          <div className="drop-down">
              <Link to="" className="drop-down-item">
                Login
              </Link>
              <Link to="" className="drop-down-item">
                Sign in
              </Link>
              <Link to="" className="drop-down-item">
                Login
              </Link>
            </div>
        </div>
      </nav>

      <Collapse in={open}>
        <div id="example-collapse-text">
          <div className="list-category">
            {categories.map((item) => {
              return (
                <>
                  <Link
                    to={`/categories/${item["category_id"]}/comics`}
                    className="category-item"
                  >
                    {item["category_name"]}
                  </Link>
                </>
              );
            })}
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

const Header = () => {
  const { token } = useUser();
  const [username, setUsername] = useState();
  useEffect(() => {
    // const tokenDataRemember = JSON.parse(
    //   localStorage.getItem("token_refreshToken")
    // );
    // const token = token;
    const userToken = token ? jwt_decode(token) : null;
    console.log(userToken);
    setUsername(userToken ? userToken.user_name : "Tài khoản");
    // if (tokenDataRemember != null) {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer" + tokenDataRemember.token,
    //     },
    //   };
  }, [token]);

  return (
    <>
      <header>
        <Navbar username={username} />
        <SearchForm />
      </header>
    </>
  );
};

export default Header;