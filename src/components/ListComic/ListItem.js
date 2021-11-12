import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import comicApi from "../../api/comicApi";
import { xoaDau } from "../../utilFunction";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  deleteComic,
  deleteComicFollow,
} from "../../features/comics/followSlice";
import { UPDATING } from "../../constants";
import jwtDecode from "jwt-decode";
import rateApi from "../../api/rateApi";
import { setStatus, setLoaded } from "../../features/comics/comicSlice";
const ListItem = ({ other, index, item, isFollow }) => {
  const name = xoaDau(item["comic_name"]);
  const ourRequest = axios.CancelToken.source();
  const [newChapter, setNewChapter] = useState({});
  const [chapterName, setChapterName] = useState("");
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const statusFollow = useSelector((state) => state.follows.status);
  const { comics, status } = useSelector((state) => state.comics);
  const [rate, setRate] = useState("");
  //get chapters by id
  useEffect(() => {
    //set New chapter
    try {
      if (other) {
        const getChaptersByID = async () => {
          try {
            const res = rateApi.getSumRate(item.comic_id);
            const res2 = comicApi.getComicByID(item["comic_id"], {
              cancelToken: ourRequest.token,
            });
            Promise.all([res, res2]).then((val) => {
              const per =
                (val[0].data.data.sum_rate / (val[0].data.data.count * 5)) * 10;
              setRate(per + "");
              const data = val[1].data.data;
              const chapters = data["chapters"];
              if (chapters.length > 0) {
                setNewChapter(chapters[chapters.length - 1]);
                setChapterName(
                  xoaDau(chapters[chapters.length - 1]["chapter_name"])
                );
              } else {
                setNewChapter("Đang cập nhật");
              }
            });
          } catch (error) {
            setNewChapter("NaN");
          }
        };
        getChaptersByID();
      } else {
        rateApi.getSumRate(item.comic_id).then((res) => {
          if (res.data.data) {
            let per = Math.round(
              (res.data.data.sum_rate / (res.data.data.count * 5)) * 10
            );
            setRate(per + "");
          }
        });
        setNewChapter(item["chapters"][0]);
        setChapterName(xoaDau(item["chapters"][0]["chapter_name"]));
      }
    } catch (error) {}
    return () => {
      setRate("");
      setNewChapter(null);
      setChapterName("");
      ourRequest.cancel();
    };
  }, [other]);
  const deleteFollowComic = () => {
    const user_id = jwtDecode(token).user_uuid;
    //delete in api
    dispatch(
      deleteComicFollow({
        user_id: user_id,
        comic_id: item["comic_id"],
        userToken: token,
      })
    );
    statusFollow === "success" && dispatch(deleteComic(index)); // delete in redux
  };
  return (
    <>
      <div className="list-comic-item">
        {isFollow && (
          <div onClick={deleteFollowComic} className="item-delete-btn">
            X
          </div>
        )}
        <div className="item-lastest-update">
          {moment(item["updatedAt"]).fromNow()}
        </div>
        <Link to={`/truyen-tranh/${name}-${item["comic_id"]}`}>
          <img
            className="item-img"
            src={item["comic_img"]}
            alt={item["comic_name"]}
          ></img>
        </Link>
        <div className="item-row">
          {chapterName != null && newChapter != null ? (
            <Link
              to={`/${chapterName}/${newChapter["chapter_id"]}/truyen-tranh/${name}-${item["comic_id"]}`}
              className="item-new-chapter"
            >
              {newChapter && newChapter["chapter_name"]}
            </Link>
          ) : (
            <Link to="#" className="item-new-chapter">
              {UPDATING}
            </Link>
          )}

          <div className="item-rate">{rate}</div>
        </div>
        <Link to={`/truyen-tranh/${name}-${item["comic_id"]}`}>
          <div className="item-name">{item["comic_name"]}</div>
        </Link>
      </div>
    </>
  );
};

export default ListItem;
