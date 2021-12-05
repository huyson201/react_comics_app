import React, { useState, useEffect, useMemo } from "react";
import "./ListComic.css";
import { BsStars } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  CATEGORY_COMIC_TITLE,
  FILTER_COMIC_TITLE,
  FOLLOW_COMICS,
  NEW_COMIC_TITLE,
  SEARCH_BY_KEY_COMIC_TITLE,
} from "../../constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListItem from "./ListItem";
const ListComic = ({comics, other, title, isFollow}) => {
  const category = useSelector((state) => state.comics.selectedCategory);
  let setTitle = useMemo(() => {
    if (title !== "") {
      return (
        <div className="list-title">
          <BsStars />
          {title}
          {/* {isFollow 
          ? FOLLOW_COMICS
          : id
          ? title
          : keyword
          ? SEARCH_BY_KEY_COMIC_TITLE + keyword
          : Object.keys(filter).length > 0
          ? FILTER_COMIC_TITLE
          : NEW_COMIC_TITLE} */}
        </div>
      );
    }
  }, [title]);
  return (
    <>
      {setTitle}
      <div className="list-comic">
        {comics &&
          comics.map((e, i) => {
            return (
              <ListItem
                index={i}
                other={other}
                key={i}
                isFollow={isFollow}
                item={e}
              ></ListItem>
            );
          })}
      </div>
    </>
  );
};
export default ListComic;
