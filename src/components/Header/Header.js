import React, { useState, useEffect } from "react";
import { MdHome, MdBookmark, MdPerson, MdFilterAlt } from "react-icons/md";
import { ImBooks, ImHistory, ImSearch } from "react-icons/im";
import { Collapse } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./header.css";
import jwt_decode from "jwt-decode";
import { useUser } from "../../context/UserProvider";
import comicApi from "../../api/comicApi";
import { xoaDau } from "../../utilFunction";
const Navbar = (props) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const history = useHistory();
  const { dispatch } = useUser();

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

  const handleLogout = () => {
    localStorage.removeItem("token_refreshToken");
    dispatch({ type: "TOKEN", payload: null });
    history.push("/");
    // alert("logout thanh cong");
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
          aria-controls="example-collapse-text"
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
                  Login
                </Link>
                <Link to="/register" className="drop-down-item">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/account" className="drop-down-item">
                  Thông tin cá nhân
                </Link>
                <Link
                  to="/logout"
                  onClick={handleLogout}
                  className="drop-down-item"
                >
                  Log out
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Collapse in={open}>
        <div id="example-collapse-text">
          <div className="list-category">
            {categories.map((item, i) => {
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
const SearchForm = () => {
  const history = useHistory();
  console.log(history.location);
  const [key, setKey] = useState("");
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
        <a className="search-filter">
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
      {/* <div>
        <div>Thể loại</div>
        <form>


        </form>
      </div> */}
    </>
  );
};

const Header = () => {
  const { token, update } = useUser();

  const [username, setUsername] = useState("Tài khoản");
  useEffect(() => {
    const userToken = token ? jwt_decode(token) : null;
    if (userToken) {
      if (update) {
        setUsername(update);
      } else {
        setUsername(userToken.user_name);
      }
    }
  }, [token, update]);

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
