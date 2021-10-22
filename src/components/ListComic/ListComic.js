import React, { useState, useEffect } from "react";
import "./ListComic.css";
import { useHistory } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { Link } from "react-router-dom";
import { xoaDau } from "../../utilFunction";
import comicApi from "../../api/comicApi";
import axios from "axios";
import { useSelector } from "react-redux";
import { CATEGORY_COMIC_TITLE } from "../../constants";
const ListItem = ({ other, item }) => {
  const name = xoaDau(item["comic_name"]);
  const ourRequest = axios.CancelToken.source();
  const [newChapter, setNewChapter] = useState();
  const getChaptersByID = async () => {
    try {
      const res = await comicApi.getComicByID(item["comic_id"], {
        cancelToken: ourRequest.token,
      });
      const data = res.data.data;
      const chapters = data["chapters"];
      setNewChapter(chapters[chapters.length - 1]["chapter_name"]);
    } catch (error) {
      setNewChapter("NaN");
    }
  };
  useEffect(() => {
    try {
      if (other) {
        getChaptersByID();
      } else {
        setNewChapter(item["chapters"][0]["chapter_name"]);
      }
    } catch (error) {}
    return () => {
      ourRequest.cancel();
    };
  }, [other]);

  return (
    <>
      <div className="list-comic-item">
        <Link to={`/truyen-tranh/${name}-${item["comic_id"]}`}>
          <img
            className="item-img"
            src={item["comic_img"]}
            alt={item["comic_name"]}
          ></img>
          <div className="item-row">
            <div className="item-new-chapter">{newChapter}</div>
            <div className="item-rate">5.0</div>
          </div>
          <div className="item-name">{item["comic_name"]}</div>
        </Link>
      </div>
    </>
  );
};
const ListComic = ({ other, title, isFollow }) => {
  const comics = useSelector((state) => state.comics.comics);
  const category = useSelector((state) => state.comics.selectedCategory);
  const comics_follow = useSelector((state) => state.follows.comics);
  return (
    <>
      <div className="list-title">
        <BsStars />
        {category ? CATEGORY_COMIC_TITLE + category["category_name"] : title}
      </div>
      <div className="list-comic">
        {comics &&
          !isFollow &&
          comics.map((e, i) => {
            return <ListItem other={other} key={i} item={e}></ListItem>;
          })}
        {isFollow ?
          comics_follow.map((e, i) => {
            return <ListItem other={other} key={i} item={e}></ListItem>;
          }):null}
      </div>
    </>
  );
};
export default ListComic;
