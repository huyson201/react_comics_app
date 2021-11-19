import React, { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import comicApi from "../api/comicApi";
import HistoryItem from "../components/History/HistoryItem";
import Loading from "../components/Loading/Loading";

const History = () => {
  const histories = JSON.parse(localStorage.getItem("histories"));
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
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

    histories !== null &&
      histories.forEach((e) => {
        setLoading(true);
        getData(e.comic_id, e.chapter_id);
        setLoading(false);
      });
    return () => {
      setLoading(false);
      setHistoryList([]);
    };
  }, []);
  
  return (
    <div>
      {loading && <Loading />}
      <div className="list-title">
        <BsStars /> Lịch sử đọc truyện
      </div>
      {!loading && (
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
