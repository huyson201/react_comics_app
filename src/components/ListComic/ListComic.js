import React from "react";
import "./ListComic.css";
import { BsStars } from "react-icons/bs";
const ListItem = () => {
  return (
    <>
      <div className="list-comic-item">
        <a href="/">
          <div className="item-lastest-update">5 giờ trước</div>
          <img
            className="item-img"
            src="https://wcomic.site/upload/poster/comicid-4386.jpg"
          ></img>
          <div className="item-row">
            <div className="item-new-chapter">Chap 50</div>
            <div className="item-rate">5.0</div>
          </div>
          <div className="item-name">Minh nhật chi kiếp</div>
        </a>
      </div>
    </>
  );
};
const ListComic = () => {
  return (
    <>
      <div className="list-title">
        <BsStars />
        Truyện mới cập nhật
      </div>
      <div className="list-comic">
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
      </div>
    </>
  );
};
export default ListComic;
