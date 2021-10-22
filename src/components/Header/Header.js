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
import { Link, useHistory } from "react-router-dom";
import "./header.css";
import jwt_decode from "jwt-decode";
import { useData } from "../../context/Provider";
import comicApi from "../../api/comicApi";
import { xoaDau } from "../../utilFunction";
import { ACTIONS } from "../../context/Action";
import Cookies from "js-cookie";
import axiosClient from "../../api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../features/auth/userSlice";
import ModalNotify from "../Modal/ModalNotify";
import { LOGIN_SUCCESS, LOGOUT_SUCCESS, WARN_LOGIN } from "../../constants";
import { getCategories } from "../../features/comics/categorySlice";
import { isJwtExpired } from "jwt-check-expiration";
const Navbar = (props) => {
  const [open, setOpen] = useState(false);
  const status = useSelector((state) => state.comics.status);
  useEffect(() => {
    if (status == "loading") {
      setOpen(false);
    }
  }, [status]);
  const dispatch_redux = useDispatch();
  const handleLogout = () => {
    dispatch({
      type: ACTIONS.MODAL_NOTIFY,
      payload: {
        show: true,
        message: LOGOUT_SUCCESS,
        error: null,
      },
    });
    Cookies.remove("refreshToken");
    dispatch_redux(logout());
  };
  const { dispatch, show, error, message } = useData();
  const categories = useSelector((state) => state.categories.categories);
  const isLogged = useSelector((state) => state.user.isLogged);
  console.log(isLogged);
  const handleClick = () => {
    if (!isLogged) {
      console.log(isLogged);
      dispatch({
        type: ACTIONS.MODAL_NOTIFY,
        payload: {
          show: true,
          message: null,
          error: WARN_LOGIN,
        },
      });
    }
  };

  return (
    <>
      <ModalNotify
        show={show}
        error={error}
        message={message ? message : null}
      />
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
        <Link to="#"  className="nav-item">
          <ImHistory /> Lịch sử
        </Link>
        <Link to={isLogged? "/truyen-theo-doi":"#"} onClick={handleClick} className="nav-item">
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
            {categories.map((item, i) => {
              const name = xoaDau(item["category_name"]);
              return (
                <Link
                  to={`/the-loai/${name}/${item["category_id"]}`}
                  className="category-item"
                  key={i}
                >
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
const SearchForm = ({}) => {
  const history = useHistory();
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  const categories = useSelector((state) => state.categories.categories);
  const [checkedState, setCheckedState] = useState([0]);
  useEffect(() => {
    setCheckedState(new Array(categories.length).fill(false));
  }, [categories.length]);
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

  const [status, setStatus] = useState("");
  const handleSubmitFilter = (e) => {
    e.preventDefault();
    let arr = [];
    categories.map((item, i) => {
      if (checkedState[i] == true) {
        arr.push(item["category_id"]);
      }
    });
    history.push({
      pathname: "/tim-kiem-nang-cao",
      search: `the-loai=${arr}&tinh-trang=${status}`,
    });
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
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
            <form onSubmit={handleSubmitFilter}>
              <div className="check-box-form">
                {categories.map((item, i) => {
                  return (
                    <label key={item["category_id"]} className="checkbox-item">
                      <input
                        onChange={() => handleOnChange(i)}
                        checked={!!checkedState[i]}
                        id={item["category_id"]}
                        name={item["category_name"]}
                        type="checkbox"
                      />
                      <span className="checkmark"></span>
                      <div>{item["category_name"]}</div>
                    </label>
                  );
                })}
              </div>
              <div className="filter-status">Trình trạng</div>
              <div className="status-form">
                <select
                  value={status}
                  className="select-status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đang tiến hành">Đang tiến hành</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                </select>
              </div>
              <div className="btn-wrap">
                <button>Lọc ngay</button>
              </div>
            </form>
          </div>
        </div>
      </Collapse>
    </>
  );
};

const Header = () => {
  const dispatch_redux = useDispatch();
  const token = useSelector((state) => state.user.token);
  const [categories, setCategories] = useState([]);
  const isLogged = useSelector((state) => state.user.isLogged);
  useEffect(() => {
    dispatch_redux(getCategories());
  }, [dispatch_redux]);

  const [username, setUsername] = useState("Tài khoản");

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
          dispatch_redux(
            login({
              token: localToken,
              refreshToken: Cookies.get("refreshToken"),
            })
          );
        });
    }

    if (localToken) {
      userToken = jwt_decode(localToken);
    } else {
      userToken = token ? jwt_decode(token) : null;
    }
    userToken ? setUsername(userToken.user_name) : setUsername("Tài khoản");
    // console.log(userToken);
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
