import React from "react";
import { Link } from "react-router-dom";
import { xoaDau } from "../../utilFunction";
import "./history.css";
const HistoryItem = ({ item }) => {
  return (
    <div className="history-item">
      <Link
        to={`/${xoaDau(item.chapter.chapter_name)}/${
          item.chapter.chapter_id
        }/truyen-tranh/${xoaDau(item.comic_name)}-${item.comic_id}`}
        className="history-item-content"
      >
        <div>
          <img src={item.comic_img}></img>
        </div>
        <div>
          <div className="history-item-name">{item.comic_name}</div>
          <div className="history-chapter-item">
            Đã đọc tới {item.chapter.chapter_name}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HistoryItem;
