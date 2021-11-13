import React, { useState, useEffect } from "react";
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
const ListComic = ({ keyword, filter, comics, other, title, isFollow }) => {
  const category = useSelector((state) => state.comics.selectedCategory);
  const comics_follow = useSelector((state) => state.follows.comics);
  console.log(comics_follow);
  console.log(isFollow);
  return (
    <>
      <div className="list-title">
        <BsStars />
        {isFollow 
          ? FOLLOW_COMICS
          : category
          ? CATEGORY_COMIC_TITLE + category["category_name"]
          : keyword
          ? SEARCH_BY_KEY_COMIC_TITLE + keyword
          : Object.keys(filter).length > 0
          ? FILTER_COMIC_TITLE
          : NEW_COMIC_TITLE}
      </div>
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
        {/* {isFollow
          ? comics_follow.map((e, i) => {
              return (
                <ListItem
                  index={i}
                  other={other}
                  key={i}
                  isFollow={isFollow}
                  item={e}
                ></ListItem>
              );
            })
          : null} */}
      </div>
    </>
  );
};
export default ListComic;
