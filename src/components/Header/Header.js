import React, { useState, useEffect } from "react";
import {
  MdHome,
  MdBookmark,
  MdPerson,
  MdFilterAlt,
  MdTrendingUp,
} from "react-icons/md";
import { ImBooks, ImHistory, ImSearch } from "react-icons/im";
import { Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./header.css";
import jwt_decode from "jwt-decode";
import { useUser } from "../../context/UserProvider";
import comicApi from "../../api/comicApi";
import { xoaDau } from "../../utilFunction";
import { ACTIONS } from "../../context/Action";
import Cookies from "js-cookie";
import axiosClient from "../../api/axiosClient";

const Navbar = (props) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { dispatch } = useUser();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    dispatch({ type: ACTIONS.TOKEN, payload: null });
    dispatch({
      type: ACTIONS.UPDATE,
      payload: false,
    });
    alert("logout thanh cong");
  };

  return (
    <>
      <nav className="nav-bar">
        <Link to="/" className="nav-item">
          <MdHome />
          Trang chủ
        </Link>
        <div
          className="nav-item"
          onClick={() => setOpen(!open)}
          aria-controls="categories-collapse"
          aria-expanded={open}
        >
          <ImBooks />
          Thể loại
        </div>
        <Link to="/history" className="nav-item">
          <ImHistory /> Lịch sử
        </Link>
        <Link to="/follow" className="nav-item">
          <MdBookmark />
          Theo dõi
        </Link>

        <div className="nav-item account">
          {/* <Link to="#"> */}
          <MdPerson />
          {props.username}
          {/* </Link> */}
          <div className="drop-down">
            {props.username === "Tài khoản" ? (
              <>
                <Link to="/login" className="drop-down-item">
                  Đăng nhập
                </Link>
                <Link to="/register" className="drop-down-item">
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                <Link to="/account" className="drop-down-item">
                  Thông tin cá nhân
                </Link>
                <Link to="/" onClick={handleLogout} className="drop-down-item">
                  Đăng xuất
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Collapse in={open}>
        <div id="categories-collapse">
          <div className="list-category">
            {props.categories.map((item, i) => {
              const name = xoaDau(item["category_name"]);
              const linkTo = {
                pathname: `/the-loai/${name}`,
                id: item["category_id"],
                category_name: item["category_name"],
              };
              return (
                <Link to={linkTo} className="category-item" key={i}>
                  {item["category_name"]}
                </Link>
              );
            })}
          </div>
        </div>
      </Collapse>
    </>
  );
};
const SearchForm = ({ categories }) => {
  const history = useHistory();
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  const handleSubmit = (e) => {
    const keyUrl = xoaDau(key);
    e.preventDefault();
    history.push({
      pathname: "/tim-kiem",
      search: `keyword=${keyUrl}`,
      keyword: key,
    });
    setKey("");
  };
  return (
    <>
      <div className="search">
        <a
          className="search-filter"
          onClick={() => setOpen(!open)}
          aria-controls="filter-collapse"
          aria-expanded={open}
        >
          <MdFilterAlt />
        </a>
        <form onSubmit={handleSubmit} className="form-search">
          <input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
            className="input-search"
            type="text"
            placeholder="Nhập từ khoá..."
          ></input>
          <button className="btn-search" type="submit">
            <ImSearch />
          </button>
        </form>
      </div>
      <Collapse in={open}>
        <div id="filter-collapse">
          <div className="filter-form">
            <div className="filter-category">Thể loại</div>
            <form>
              <div className="check-box-form">
                {categories.map((item, i) => {
                  return (
                    <label key={item['category_id']} className="checkbox-item">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      <div>{item["category_name"]}</div>
                    </label>
                  );
                })}
              </div>
              <div className="filter-status">Trình trạng</div>
              <div className="status-form">
                <select className="select-status">
                  <option value="0">Bỏ trống</option>
                  <option value="1">Đang tiến hành</option>
                  <option value="2">Đã hoàn thành</option>
                </select>
              </div>
              <div className="btn-wrap"><button>Lọc ngay</button></div>
         
            </form>
          </div>
        </div>
      </Collapse>
    </>
  );
};

const Header = () => {
  const { token, update } = useUser();
  const [categories, setCategories] = useState([]);
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
  const [username, setUsername] = useState("Tài khoản");
  const { dispatch } = useUser();

  useEffect(() => {
    let localToken = null;
    let userToken = null;

    if (Cookies.get("refreshToken")) {
      axiosClient
        .post("/refresh-token", {
          refreshToken: Cookies.get("refreshToken"),
        })
        .then((res) => {
          localToken = res.data.token;
          dispatch({
            type: ACTIONS.TOKEN,
            payload: {
              token: localToken,
              refreshToken: Cookies.get("refreshToken"),
            },
          });
        });
    }

    if (localToken) {
      userToken = jwt_decode(localToken);
    } else {
      userToken = token ? jwt_decode(token) : null;
    }
    userToken ? setUsername(userToken.user_name) : setUsername("Tài khoản");
  }, [token]);
  return (
    <>
      <header>
        <Navbar username={username} categories={categories} />
        <SearchForm categories={categories} />
      </header>
    </>
  );
};

export default Header;
