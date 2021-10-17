import React, { useState, useEffect } from "react";
import "./ListComic.css";
import { BsStars } from "react-icons/bs";
import { Link } from "react-router-dom";
import { xoaDau } from "../../utilFunction";
import comicApi from "../../api/comicApi";
import axios from "axios";
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
    if (other) {
      getChaptersByID();
    } else {
      setNewChapter(item["chapters"][0]["chapter_name"]);
    }
    return () => {
      ourRequest.cancel();
    };
  }, []);

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
const ListComic = ({ other, title, data }) => {
  return (
    <>
      <div className="list-title">
        <BsStars />
        {title}
      </div>
      <div className="list-comic">
        {data.map((e, i) => {
          return <ListItem other={other} key={i} item={e}></ListItem>;
        })}
      </div>
    </>
  );
};
export default ListComic;
