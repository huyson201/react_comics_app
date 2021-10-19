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

const DetailComic = () => {
  const history = useHistory();
  const { name } = useParams();
  const arrName = name.split("-");
  const id = arrName[arrName.length - 1];
  const [data, setData] = useState();
  const [checked, setChecked] = useState(false);

  const { dispatch, show, error, message} = useData();
  const { token, refreshToken } = useSelector((state) => state.user);
  const dispatch_redux = useDispatch();
  // const [show, setShow] = useState(false);
  // const [message, setMessage] = useState(null);
  // const [error, setError] = useState(null);

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

      // setError(WARN_LOGIN);
      // setShow(true);
    }
  };
  //func get comic
  const getComic = async () => {
    const res = await axiosClient.get("/comics/" + id);
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
        rate_star: starIndex + 1,
        comic_id: id,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (res.data.error) {
      dispatch({
        type: ACTIONS.MODAL_NOTIFY,
        payload: {
          show: true,
          message: null,
          error: WARN_LOGIN,
        },
      });

      // setError(WARN_LOGIN);
      // setShow(true);
    } else {
      dispatch({
        type: ACTIONS.MODAL_NOTIFY,
        payload: {
          show: true,
          message: RATE_SUCCESS,
          error: null,
        },
      });

      // setMessage("Cảm ơn bạn đã đánh giá !");
      // setShow(true);
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
      <ModalNotify show={show} error={error} message={message} name={name} />
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
              <Link to="#" type="button" onClick={() => setChecked(!checked)}>
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
                {arrStar.map((e, index) => (
                  <>
                    <Star
                      key={e}
                      index={index}
                      changeStarIndex={changeStarIndex}
                      style={starIndex >= index ? true : false}
                    />
                  </>
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
                      .sort((a, b) => (b.chapter_id > a.chapter_id ? 1 : -1))
                      .map((e, i) => {
                        return (
                          <Link
                            to={`/truyen-tranh/${name}-${e.chapter_id}/${id}`}
                            key={i}
                            title={e.chapter_name}
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
  );
};

//func calculate update date
function updateDate(date) {
  moment.locale("vi");
  return moment(date).fromNow();
}

export default DetailComic;
