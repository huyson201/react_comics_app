import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { BiBookReader } from "react-icons/bi";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import moment from "moment";
import { isJwtExpired } from "jwt-check-expiration";
import {
  COMMENT,
  FOLLOW,
  LABEL_CONTENT,
  LABEL_LIST_CHAPTER,
  RATE,
  RATE_SUCCESS,
  READ_FIRST,
  READ_LAST,
  SCORE,
  STATUS,
  UNFOLLOW,
  UPDATE,
  WARN_LOGIN,
} from "../constants";
import Star from "../components/Rate/Star";
import { useData } from "../context/Provider";
import ModalNotify from "../components/Modal/ModalNotify";
import { ACTIONS } from "../context/Action";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/userSlice";
import { xoaDau } from "../utilFunction";
import comicApi from "../api/comicApi";
import Loading from "../components/Loading/Loading";

const DetailComic = () => {
  const history = useHistory();
  const { name } = useParams();
  const arrName = name.split("-");
  const id = arrName[arrName.length - 1];
  const [data, setData] = useState();
  const [checked, setChecked] = useState(false);

  const { dispatch, show, error, message } = useData();
  const { token, refreshToken } = useSelector((state) => state.user);
  const dispatch_redux = useDispatch();
  // rating
  let arrStar = [1, 2, 3, 4, 5];
  arrStar.length = 5;
  const [starIndex, setStarIndex] = useState();

  const changeStarIndex = (index) => {
    if (token && isJwtExpired(token) === false) {
      setStarIndex(index);
    } else {
      dispatch({
        type: ACTIONS.MODAL_NOTIFY,
        payload: {
          show: true,
          message: null,
          error: WARN_LOGIN,
        },
      });
      dispatch_redux(logout());
    }
  };
  //func get comic
  const getComic = async () => {
    const res = await comicApi.getComicByID(id);
    if (res.data.error) {
      console.log(res.data.error);
    } else {
      setData(res.data.data);
    }
  };
  // func rate
  const rate = async () => {
    const res = await axiosClient.post(
      "/rates",
      {
        rate_star: +starIndex + 1,
        comic_id: id,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log(+starIndex + 1);
    if (res.data.error) {
      dispatch({
        type: ACTIONS.MODAL_NOTIFY,
        payload: {
          show: true,
          message: null,
          error: WARN_LOGIN,
        },
      });
    } else {
      dispatch({
        type: ACTIONS.MODAL_NOTIFY,
        payload: {
          show: true,
          message: RATE_SUCCESS,
          error: null,
        },
      });
    }
  };

  useEffect(() => {
    //get comic
    getComic();
    //rating
    if (starIndex) {
      if (token && isJwtExpired(token) === false) {
        rate();
      }
    }
    window.scrollTo(0, 0);
  }, [id, starIndex]);

  //func read first chapter
  const handleReadFirst = () => {
    history.push("/");
  };

  //func read last chapter
  const handleReadLast = () => {
    history.push("/");
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
                              <Link key={i} to={`/categories/${e.category_id}`}>
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
                    <div className="item">{RATE}</div>
                  </div>
                  <div className="update_time">
                    <div className="type">{UPDATE}</div>
                    <div className="item">
                      {data
                        ? updateDate(
                            data.chapters.sort((a, b) =>
                              b.chapter_id > a.chapter_id ? 1 : -1
                            )[0].updatedAt
                          )
                        : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="button comic_bg">
                <div className="head_left">
                  <Link
                    to="#"
                    type="button"
                    onClick={() => setChecked(!checked)}
                  >
                    {checked === true ? (
                      <>
                        <MdBookmark className="icon" />
                        {UNFOLLOW}
                      </>
                    ) : (
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
                      <span key={i}>
                        <Star
                          key={i}
                          index={i}
                          changeStarIndex={changeStarIndex}
                          style={starIndex >= i ? true : false}
                        />
                      </span>
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
                                to={`/${xoaDau(e.chapter_name)}/${
                                  e.chapter_id
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
                <div className="comment_fb comic_bg">{COMMENT}</div>
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
  moment.locale("vi");
  return moment(date).fromNow();
}

export default DetailComic;
