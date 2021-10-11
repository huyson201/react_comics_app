import React, { useEffect, useState } from "react";
import "./listComic.css";
import { BsStars } from "react-icons/bs";
import comicApi from "../../api/comicApi";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
const ListItem = ({ item }) => {
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
const ListComic = ({title,data}) => {


  return (
    <>
      <div className="list-title">
        <BsStars />{title}
      </div>
      <div className="list-comic">
        {data.map((e, i) => {
          return <ListItem key={i} item={e}></ListItem>;
        })}
      </div>
      {/* <Pagination
        activePage={activePage}
        itemClass="paginate-item"
        linkClass="page-link"
        itemsCountPerPage={filters.limit}
        totalItemsCount={20}
        pageRangeDisplayed={3}
        hideNavigation={true}
        firstPageText={"Đầu"}
        lastPageText={"Cuối"}
        onChange={(val) => handlePageChange(val)}
      /> */}
    </>
  );
};
export default ListComic;
