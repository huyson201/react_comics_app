import { isJwtExpired } from "jwt-check-expiration";
import React, { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import comicApi from "../api/comicApi";
import historyApi from "../api/historyApi";
import userApi from "../api/userApi";
import HistoryItem from "../components/History/HistoryItem";
import Loading from "../components/Loading/Loading";
import { EXPIRED } from "../constants";
import { login, logout } from "../features/auth/userSlice";

const History = () => {
  const histories = JSON.parse(localStorage.getItem("histories"));
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isLogged, token, userInfo, refreshToken } = useSelector(
    (state) => state.user
  );
  const getData = async (comicId, chapterId) => {
    const res = await comicApi.getComicByID(comicId);
    const data = res.data.data;
    const index = data.chapters.findIndex((x) => x.chapter_id === chapterId);
    setHistoryList((historyList) => [
      ...historyList,
      {
        comic_id: data.comic_id,
        comic_name: data.comic_name,
        comic_img: data.comic_img,
        chapter: data.chapters[index],
      },
    ]);
  };
  const getHistory = async (id, token) => {
    setLoading(true)
    const res = await historyApi.getHistoryListOfUser(id, token);
    const data = res.data.data.comics_history;
    setHistoryList(data);
    setLoading(false)
  };
  useEffect(async () => {
    if (!isLogged) {
      histories !== null &&
        histories.forEach((e) => {
          setLoading(true);
          getData(e.comic_id, e.chapters[e.chapters.length - 1]);
          setLoading(false);
        });
    } else {
      (await checkToken(token, refreshToken)) === null && resetDispatch();
      (await checkToken(token, refreshToken)) !== null &&
        getHistory(userInfo.user_uuid, await checkToken(token, refreshToken));
    }
    return () => {
      setLoading(false);
      setHistoryList([]);
    };
  }, [isLogged]);

  const checkToken = async (token, refreshToken) => {
    let temp = null;
    if (token && isJwtExpired(token) === false) {
      temp = token;
    } else {
      if (refreshToken && isJwtExpired(refreshToken) === false) {
        const resUpdate = await userApi.refreshToken(refreshToken);
        if (resUpdate.data && resUpdate.data.token) {
          temp = resUpdate.data.token;
          dispatch(
            login({
              token: resUpdate.data.token,
              refreshToken: refreshToken,
            })
          );
        }
      }
    }
    return temp;
  };

  //thông báo login khi refreshtoken hết hạn
  const resetDispatch = () => {
    dispatch(logout());
    if (!toast.isActive(EXPIRED)) {
      toast.warn(EXPIRED, { toastId: EXPIRED });
    }
  };

  return (
    <div>
      {loading && <Loading />}
      <div className="list-title">
        <BsStars /> Lịch sử đọc truyện
      </div>
      {historyList.length>0 &&!loading && (
        <div className="history-list">
          {historyList.map((e, i) => {
            return <HistoryItem key={i} item={e}></HistoryItem>;
          })}
        </div>
      )}
    </div>
  );
};

export default History;
