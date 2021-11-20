import React from "react";
import { Link } from "react-router-dom";
import { xoaDau } from "../../utilFunction";
import "./history.css";
const HistoryItem = ({ item }) => {
  return (
    <div className="history-item">
      <Link
        to={
          !item.histories
            ? `/${xoaDau(item.chapter.chapter_name)}/${
                item.chapter.chapter_id
              }/truyen-tranh/${xoaDau(item.comic_name)}-${item.comic_id}`
            : `/${xoaDau(item.histories.reading_chapter_name)}/${
                item.histories.chapters[item.histories.chapters.length - 1]
              }/truyen-tranh/${xoaDau(item.comic_name)}-${item.comic_id}`
        }
        className="history-item-content"
      >
        <div>
          <img src={item.comic_img}></img>
        </div>
        <div>
          <div className="history-item-name">{item.comic_name}</div>
          <div className="history-chapter-item">
            Đang đọc tới{" "}
            {!item.histories
              ? item.chapter.chapter_name
              : item.histories.reading_chapter_name}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HistoryItem;
