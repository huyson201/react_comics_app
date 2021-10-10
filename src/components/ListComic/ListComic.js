import React, { useEffect, useState } from "react";
import "./listComic.css";
import { BsStars } from "react-icons/bs";
import comicApi from "../../api/comicApi";
import { Link, useLocation } from "react-router-dom";
const ListItem = ({ item }) => {
  console.log(item);
  //   const location = useLocation();
  // console.log(location.pathname);
  return (
    <>
      <div className="list-comic-item">
        <Link to={"/comics/" + item["comic_id"]}>
          {/* <div className="item-lastest-update">5 giờ trước</div> */}
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
const ListComic = () => {
  const [comicData, setcomicData] = useState([]);
  useEffect(() => {
    const getAllComics = () => {
      comicApi
        .getAll()
        .then((response) => {
          setcomicData(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllComics();
  }, []);
  return (
    <>
      <div className="list-title">
        <BsStars />
        Truyện mới cập nhật
      </div>
      <div className="list-comic">
        {comicData.map((e, i) => {
          return <ListItem key={i} item={e}></ListItem>;
        })}
      </div>
    </>
  );
};
export default ListComic;
