import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { BiBookReader } from "react-icons/bi";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { Link } from "react-router-dom";
import moment from "moment";
import { isJwtExpired } from "jwt-check-expiration";
import {
  COMMENT,
  FOLLOW,
  LABEL_CONTENT,
  LABEL_LIST_CHAPTER,
  LOADING,
  RATE_SUCCESS,
  READ_FIRST,
  READ_LAST,
  SCORE,
  STATUS,
  UNFOLLOW,
  UPDATE,
  UPDATE_SUCCESS,
  WARN_LOGIN,
} from "../constants";
import Star from "../components/Rate/Star";
import ModalNotify from "../components/Modal/ModalNotify";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../features/auth/userSlice";
import { xoaDau } from "../utilFunction";
import comicApi from "../api/comicApi";
import rateApi from "../api/rateApi";
import Loading from "../components/Loading/Loading";
import { deleteComicFollow, followComic } from "../features/comics/followSlice";
import followApi from "../api/followApi";
import jwtDecode from "jwt-decode";
import { Spinner } from "react-bootstrap";
import { modalNotify } from "../features/modal/modalSlice";
import Comment from "../components/Comment/Comment";
import userApi from "../api/userApi";
import { calRate, getRateByUserId, setRate } from "../features/comics/rateSlice";

const DetailComic = () => {
  const history = useHistory();
  const { name } = useParams();
  const arrName = name.split("-");
  const id = arrName[arrName.length - 1];
  const [data, setData] = useState();
  const [checked, setChecked] = useState(false);
  const { status } = useSelector((state) => state.follows);
  const { token, refreshToken, isLogged, userInfo } = useSelector((state) => state.user);
  const { show, error, message } = useSelector((state) => state.modal);
  const { perRate, count, rateState } = useSelector((state) => state.rate);
  const dispatch = useDispatch();
  // rating
  let arrStar = [1, 2, 3, 4, 5];
  arrStar.length = 5;
  const [starIndex, setStarIndex] = useState();
  const notify = (error, message) => {
    dispatch(
      modalNotify({
        show: true,
        message: message,
        error: error,
      })
    );
  };
  //kiểm tra click star
  const changeStarIndex = (index) => {
    if (token && isJwtExpired(token) === false) {
      setStarIndex(index);
    } else {
      notify(WARN_LOGIN, null);
      dispatch(logout());
    }
  };
  //func get comic
  const getComic = async () => {
    try {
      const res = await comicApi.getComicByID(id);
      if (res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      if (error.response.data) {
        notify(error.response.data, null);
      }
      else {
        notify(error.message, null);
      }
    }
  };
  // func rate
  const rate = async (id, token, starIndex) => {
    if (rateState) {
      try {
        const resUpdate = await rateApi.updateRateComic(rateState.rate_id, starIndex, token, rateState.user_uuid)
        if (resUpdate.data.data) {
          dispatch(getRateByUserId({ userId: userInfo.user_uuid, comicId: id }))
          notify(null, UPDATE_SUCCESS)
        }
      } catch (error) {
        console.log(error.response.data);
      }
    } else {
      try {
        const res = await rateApi.rateComic(id, token, starIndex);
        if (res.data.data) {
          dispatch(getRateByUserId({ userId: userInfo.user_uuid, comicId: id }))
          notify(null, RATE_SUCCESS);
        }
      } catch (error) {
        notify(error.response.data, null);
      }
    }
  };
  //tính phần điểm rate
  const calculatePercentRate = async () => {
    try {
      const res = await rateApi.getSumRate(id);
      if (res.data.data) {
        let per = (res.data.data.sum_rate / (res.data.data.count * 5)) * 10;
        dispatch(
          calRate({
            perRate: per,
            count: res.data.data.count,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  //refresh token
  const updateToken = async () => {
    try {
      const resUpdate = await userApi.refreshToken(refreshToken)
      if (resUpdate.data && resUpdate.data.token) {
        dispatch(
          login({
            token: resUpdate.data.token,
            refreshToken: refreshToken,
          })
        );
        dispatch(getRateByUserId({ userId: userInfo.user_uuid, comicId: id }))
        rate(id, token, starIndex)
        notify(null, RATE_SUCCESS)

      }
    } catch (error) {
      console.log(error);
      notify(error.response.data, null)
    }
  };
  //effect rate
  useEffect(() => {
    //get comic
    getComic();
    //rating
    if (starIndex) {
      if (token && isJwtExpired(token) === false && userInfo) {
        dispatch(getRateByUserId({ userId: userInfo.user_uuid, comicId: id }))
        rate(id, token, starIndex);
      } else if (refreshToken && isJwtExpired(refreshToken) === false && userInfo) {
        updateToken()
      } else {
        notify(WARN_LOGIN, null)
      }
    } else {
      if (token && isJwtExpired(token) === false && userInfo) {
        dispatch(getRateByUserId({ userId: userInfo.user_uuid, comicId: id }))
      } else if (refreshToken && isJwtExpired(refreshToken) === false && userInfo) {
        updateToken()
      } else {
        dispatch(setRate(null))
      }
    }
    calculatePercentRate();
    window.scrollTo(0, 0);
  }, [token, starIndex, isLogged]);
  //func read first chapter
  const handleReadLast = () => {
    const chapter = data.chapters[0];
    history.push(
      `/${xoaDau(chapter.chapter_name)}/${chapter.chapter_id
      }/truyen-tranh/${name}`
    );
  };
  //func read last chapter
  const handleReadFirst = () => {
    const chapter = data.chapters[data.chapters.length - 1];
    history.push(
      `/${xoaDau(chapter.chapter_name)}/${chapter.chapter_id
      }/truyen-tranh/${name}`
    );
  };
  //effect follow
  useEffect(() => {
    //check status follow
    if (isLogged && token) {
      const findFollow = async () => {
        const user_id = jwtDecode(token).user_uuid;
        const res = await followApi.getFollow(user_id, id);
        if (res.data.data.count > 0) {
          setChecked(true);
        }
      };
      findFollow();
    } else {
    }
  }, [isLogged]);
  //follow
  const handleFollow = () => {
    if (!isLogged) {
      dispatch(
        modalNotify({
          show: true,
          message: null,
          error: WARN_LOGIN,
        })
      );
    } else {
      if (checked && token) {
        // delete follow comic
        const user_id = jwtDecode(token).user_uuid;
        dispatch(
          deleteComicFollow({
            user_id: user_id,
            comic_id: id,
            userToken: token,
          })
        );
        setChecked(!checked);
      } else if (!checked && token) {
        // follow comic
        dispatch(followComic({ id: id, userToken: token }));
        setChecked(!checked);
      }
    }
  };

  return (
    <>
      {data == null ? (
        <Loading />
      ) : (
        <>
          <ModalNotify
            show={show}
            error={error}
            message={message}
            name={name}
          />
          <div className="container-detail">
            <div className="content">
              <h1 className="title_comic">{data ? data.comic_name : ""}</h1>
              <div className="head comic_bg">
                <div className="head_left">
                  <img
                    src={data ? data.comic_img : "#"}
                    alt={data ? data.comic_name : ""}
                  />
                </div>
                <div className="head_right">
                  <div className="list_cate">
                    <div className="type">Thể loại</div>
                    <div className="item">
                      {data
                        ? data.categories.map((e, i) => {
                          return (
                            <Link
                              key={i}
                              to={`/the-loai/${xoaDau(e.category_name)}/${e.category_id
                                }/page/1`}
                            >
                              {e.category_name}
                            </Link>
                          );
                        })
                        : ""}
                    </div>
                  </div>
                  <div className="status">
                    <div className="type">{STATUS}</div>
                    <div className="item">{data ? data.comic_status : ""}</div>
                  </div>
                  <div className="score">
                    <div className="type">{SCORE}</div>
                    <div className="item">{`${perRate} - ${count} lượt đánh giá`}</div>
                  </div>
                  <div className="update_time">
                    <div className="type">{UPDATE}</div>
                    <div className="item">
                      {data && data.chapters.length > 0
                        ? updateDate(
                          data.chapters.sort((a, b) =>
                            b.chapter_id > a.chapter_id ? 1 : -1
                          )[0].updatedAt
                        )
                        : "Đang cập nhật"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="button comic_bg">
                <div className="head_left">
                  <Link to="#" type="button" onClick={handleFollow}>
                    {status === "loading" && (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {" " + LOADING}
                      </>
                    )}
                    {status !== "loading" && checked === true && (
                      <>
                        <MdBookmark className="icon" />
                        {UNFOLLOW}
                      </>
                    )}
                    {status !== "loading" && checked === false && (
                      <>
                        <MdBookmarkBorder className="icon" />
                        {FOLLOW}
                      </>
                    )}
                  </Link>
                  <Link to="#" type="button" onClick={handleReadFirst}>
                    <BiBookReader className="icon" /> {READ_FIRST}
                  </Link>

                  <Link to="#" type="button" onClick={handleReadLast}>
                    <BiBookReader className="icon" /> {READ_LAST}
                  </Link>
                </div>
                <div className="head_right">
                  <div className="rating">
                    {arrStar.map((e, i) => (
                      <div key={i}>
                        <Star
                          key={i}
                          index={i}
                          changeStarIndex={changeStarIndex}
                          style={
                            (starIndex >= i && starIndex != null) ||
                              rateState && +rateState.rate_star - 1 >= i
                              ? true
                              : false
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="body">
                <div className="list_chap comic_bg">
                  <div className="flex">
                    <h2 className="heading">{LABEL_LIST_CHAPTER}</h2>
                  </div>
                  <div className="list_item_chap">
                    {/* Truyền id chapter và list chapter */}
                    {data
                      ? data.chapters
                        .sort((a, b) =>
                          b.chapter_id > a.chapter_id ? 1 : -1
                        )
                        .map((e, i) => {
                          return (
                            <Link
                              to={`/${xoaDau(e.chapter_name)}/${e.chapter_id
                                }/truyen-tranh/${name}`}
                              key={i}
                            >
                              <span>{e.chapter_name}</span>
                              <span>{updateDate(e.updatedAt)}</span>
                            </Link>
                          );
                        })
                      : ""}
                  </div>
                </div>
                <div className="desc comic_bg">
                  <h2 className="heading">{LABEL_CONTENT}</h2>
                  {data ? data.comic_desc : ""}
                </div>
              </div>

              <div className="footer">
                <div className="comment-box-title">{COMMENT}</div>
                <Comment comicId={id}></Comment>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

//func calculate update date
function updateDate(date) {
  return moment(date).fromNow();
}

export default DetailComic;
