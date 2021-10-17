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
const SearchForm = ({}) => {
  const [categories, setCategories] = useState([]);
  const history = useHistory();
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  const [checkedState, setCheckedState] = useState([0]);
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
  useEffect(() => {
    const getAllCategories = () => {
      comicApi
        .getAllCategories()
        .then((response) => {
          setCategories(response.data.data);
          setCheckedState(new Array(response.data.data.length).fill(false));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllCategories();
  }, []);
  const [status, setStatus] = useState("");
  const handleSubmitFilter = (e) => {
    e.preventDefault();
    let arr = [];
    categories.map((item, i) => {
      if (checkedState[i] == true) {
        arr.push(item["category_id"]);
      }
    });
    console.log(status);
    console.log(arr);
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
  const { token, update } = useUser();
  const [categories, setCategories] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  useEffect(() => {
    const getAllCategories = () => {
      comicApi
        .getAllCategories()
        .then((response) => {
          setCategories(response.data.data);
          setCheckedState(new Array(response.data.data.length).fill(false));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllCategories();
  }, []);
  console.log(checkedState);

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
      // if(isJwtExpired(token)===true){

      // }

      userToken = token ? jwt_decode(token) : null;
      // console.log("isExpired is:", token ? isJwtExpired(token) : "hihi");
    }
    userToken ? setUsername(userToken.user_name) : setUsername("Tài khoản");
  }, [token]);
  return (
    <>
      <header>
        <Navbar username={username} categories={categories} />
        <SearchForm checkedState={checkedState} categories={categories} />
      </header>
    </>
  );
};

export default Header;
