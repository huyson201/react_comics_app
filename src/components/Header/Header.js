import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  MdHome,
  MdBookmark,
  MdPerson,
  MdFilterAlt,
} from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { ImBooks, ImHistory, ImSearch } from "react-icons/im";
import { Collapse } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "./header.css";
import jwt_decode from "jwt-decode";
import { xoaDau } from "../../utilFunction";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setUserInfo, setIsCheckUpdate } from "../../features/auth/userSlice";
import { LOGOUT_SUCCESS, WARN_LOGIN } from "../../constants";
import { getCategories } from "../../features/comics/categorySlice";
import { modalNotify } from "../../features/modal/modalSlice";

import userApi from "../../api/userApi";
import notifyApi from '../../api/notifyApi'
import { io } from 'socket.io-client'
import dotenv from 'dotenv'
import config from '../../config/config'
import { NOTIFY_STATUS } from '../../constants'
dotenv.config()


const calDate = (dateA, dateB) => {
  let dateResult
  const date1 = new Date(dateA);
  const date2 = new Date(dateB);
  const diffTime = Math.abs(date2 - date1);

  if ((dateResult = (diffTime / (1000 * 60 * 60 * 24))) >= 1) {
    return `${Math.ceil(dateResult)} ngày trước`
  }

  if ((dateResult = (diffTime / (1000 * 60 * 60))) >= 1) {
    return `${Math.ceil(dateResult)} giờ trước`
  }

  if ((dateResult = (diffTime / (1000 * 60))) >= 1) {
    return `${Math.ceil(dateResult)} phút trước`
  }

  dateResult = Math.ceil(diffTime / (1000))
  return `${dateResult} giây trước`
}

const Navbar = (props) => {
  const [open, setOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false)
  const [listNotifications, setListNotifications] = useState([])
  const status = useSelector((state) => state.comics.status);
  const statusFollows = useSelector((state) => state.follows.status);
  const token = useSelector((state) => state.user.token);
  const [stateOption, setStateOption] = useState(false);
  const dispatch_redux = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const { isLogged, isAdmin } = useSelector((state) => state.user);
  const [socketData, setSocketData] = useState()

  const notify = (error, message) => {
    dispatch_redux(
      modalNotify({
        show: true,
        message: message,
        error: error,
      })
    );
  };

  const handleClickNotifyLink = async (notify) => {
    notify.status = NOTIFY_STATUS.READ
    await notifyApi.update(notify.id, notify)
    return true
  }

  //effect follow
  useEffect(() => {
    if (status === "loading" || statusFollows === "loading") {
      setOpen(false);
    }
  }, [status, statusFollows]);

  // get notify
  useEffect(() => {
    if (token) {
      let decoded = jwt_decode(token)
        ; (async () => {
          let res = await notifyApi.get(decoded.user_uuid, token)
          setListNotifications([...res.data.data])
        })()
    }

  }, [token])
  // socket io processing
  useEffect(() => {

    const socket = io('http://localhost:3001/', {
      auth: {
        token: token
      }
    })

    socket.on("connect", () => {
      console.log('user_connected ' + socket.id);
    });

    socket.on('comment-notify', data => {
      setSocketData(data)
    })

    socket.on('disconnect', () => {
      console.log("user disconnected: ", socket.id)
    })


    return () => {
      socket.disconnect()
      socket.close()
    }


  }, [token])


  useEffect(() => {
    if (socketData) {
      setListNotifications([socketData, ...listNotifications])
    }
  }, [socketData])

  // update status after user clicked notify
  useEffect(() => {
    ; (async () => {
      if (token && openNotification) {
        for (let notify of listNotifications) {
          if (notify.status === NOTIFY_STATUS.NEW) {
            notify.status = NOTIFY_STATUS.CHECKED
            await notifyApi.update(notify.id, { ...notify, notifier_info: undefined })
          }
        }

        let decoded = jwt_decode(token)
        let res = await notifyApi.get(decoded.user_uuid, token)
        setListNotifications([...res.data.data])

      }
    })()
  }, [openNotification])

  useEffect(() => {
    const handleClickWindow = () => {
      setOpenNotification(false)
      setOpen(false)
    }
    window.onclick = handleClickWindow
  }, [])

  // generate notify items
  let notifications = useMemo(() => {
    if (!token) {
      return (
        <li className='notify-item empty'>
          Vui lòng đăng nhập để xem thông báo
        </li>
      )
    }

    if (listNotifications.length <= 0) {
      return (
        <li className='notify-item empty'>
          Nothing...
        </li>
      )
    }

    return listNotifications.map(el => {
      return (
        <li className='notify-item' key={el.id}>
          <Link className='notify-link' to={`/truyen-tranh/toan-cau-sup-do-1?comment=${el.comment_id}`} onClick={() => handleClickNotifyLink(el)}>
            <div className='notify-col'>
              <img className='notify-user-img' src={el.notifier_info.user_image ? el.notifier_info.user_image : `https://ui-avatars.com/api/name=${el.notifier_info.user_name}&background=random`} />
              <div className='notify-content'>{el.notification_message}</div>
              {(el.status !== NOTIFY_STATUS.READ) && <div className='dot'></div>}
            </div>
            <p className='notify-time'>{calDate(Date.now(), el.createdAt)}</p>
          </Link>
        </li>
      )
    })

  }, [listNotifications])

  // count new notify
  let countNotify = useMemo(() => {
    if (listNotifications.length <= 0) {
      return 0
    }
    return listNotifications.filter(el => {
      return el.status === NOTIFY_STATUS.NEW
    }).length
  }, [listNotifications])

  //xử lý data khi nhấn logout
  const handleLogout = async () => {
    try {
      const res = await userApi.logout(token)
      console.log(res.data);
      if (res.status === 204) {
        notify(null, LOGOUT_SUCCESS)
        Cookies.remove("refreshToken");
        dispatch_redux(logout());
      }
    } catch (error) {
      notify(error.response.data, null)
    }
  };

  //hiện thông báo khi không có user
  const handleClick = () => {
    if (!isLogged) {
      notify(WARN_LOGIN, null);
    }
  };
  //set show option when click nav item account
  const handleClickAccount = () => {
    setStateOption(!stateOption)
  }

  const handleClickNotify = async (e) => {
    e.stopPropagation()
    setOpenNotification(!openNotification)
    setOpen(false)
  }




  return (
    <>
      <nav className="nav-bar">
        <Link to="/" className="nav-item">
          <MdHome />
          Trang chủ
        </Link>
        <div
          className="nav-item"
          onClick={(e) => { e.stopPropagation(); setOpen(!open); setOpenNotification(false) }}
          aria-controls="categories-collapse"
          aria-expanded={open}
        >
          <ImBooks />
          Thể loại
        </div>
        <Link to="#" className="nav-item">
          <ImHistory /> Lịch sử
        </Link>
        <Link
          to={isLogged ? "/truyen-theo-doi" : "#"}
          onClick={handleClick}
          className="nav-item"
        >
          <MdBookmark />
          Theo dõi
        </Link>
        {/* notify */}
        <div className="nav-item" id="notify" onClick={handleClickNotify} >
          <span className='notify-title'>
            <FaBell />
            Thông báo
            {countNotify !== 0 && (<span className='notify-count'>{countNotify}</span>)}
          </span>
          <ul className={openNotification ? 'notify-list active' : 'notify-list'} >
            {notifications}
          </ul>
        </div>
        <div className="nav-item account" onClick={handleClickAccount}>
          <MdPerson />
          {props.username}
          {stateOption === true ? (
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
                  {isAdmin && (
                    <Link to="/dashboard" className="drop-down-item">
                      Quản lí
                    </Link>
                  )}
                  <Link to="/account" className="drop-down-item">
                    Thông tin cá nhân
                  </Link>
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="drop-down-item"
                  >
                    Đăng xuất
                  </Link>
                </>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>

      <Collapse in={open}>
        <div id="categories-collapse">
          <div className="list-category">
            {categories.map((item, i) => {
              const name = xoaDau(item["category_name"]);
              return (
                <Link
                  to={`/the-loai/${name}/${item["category_id"]}/page/1`}
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

const SearchForm = () => {
  const history = useHistory();
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  const categories = useSelector((state) => state.categories.categories);
  const [checkedState, setCheckedState] = useState([0]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setCheckedState(new Array(categories.length).fill(false));
  }, [categories.length]);
  //xử lý dữ liệu khi nhấn tìm kiếm
  const handleSubmit = (e) => {
    const keyUrl = xoaDau(key);
    e.preventDefault();
    history.push({
      pathname: "/tim-kiem/" + key + "/page/1",
    });
    setKey("");
  };
  //xử lý dữ liệu khi nhấn filter
  const handleSubmitFilter = (e) => {
    e.preventDefault();
    let arr = [];
    categories.map((item, i) => {
      if (checkedState[i] === true) {
        arr.push(item["category_id"]);
      }
    });
    history.push({
      pathname: "/tim-kiem-nang-cao",
      search: `the-loai=${arr}&tinh-trang=${status}&page=1`,
    });
  };
  //set check for checkbox category
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  return (
    <>
      <div className="search">
        <div
          className="search-filter"
          onClick={() => setOpen(!open)}
          aria-controls="filter-collapse"
          aria-expanded={open}
        >
          <MdFilterAlt />
        </div>
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
  const { userInfo } = useSelector((state) => state.user);
  const [username, setUsername] = useState("Tài khoản");
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch_redux(getCategories());
  }, [dispatch_redux]);

  useEffect(() => {
    userInfo ? setUsername(userInfo.user_name) : setUsername("Tài khoản");
  }, [userInfo]);

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
