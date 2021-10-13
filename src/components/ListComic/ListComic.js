import React from "react";
import "./listComic.css";
import { BsStars } from "react-icons/bs";
import { Link } from "react-router-dom";
const ListItem = ({ item }) => {
  return (
    <>
      <div className="list-comic-item">
        <Link to={"/comics/" + item["comic_id"]}>
          <img
            className="item-img"
            src={item["comic_img"]}
            alt={item["comic_name"]}
          ></img>
          <div className="item-row">
            <div className="item-new-chapter">Chap 50</div>
            <div className="item-rate">5.0</div>
          </div>
          <div className="item-name">{item["comic_name"]}</div>
        </Link>
      </div>
    </>
  );
};
const ListComic = ({ title, data }) => {
  return (
    <>
      <div className="list-title">
        <BsStars />
        {title}
      </div>
      <div className="list-comic">
        {data.map((e, i) => {
          return <ListItem key={i} item={e}></ListItem>;
        })}
      </div>
    </>
  );
};
export default ListComic;
