import React, { useState, useEffect } from "react";
import "./ListComic.css";
import { BsStars } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  CATEGORY_COMIC_TITLE,
  FILTER_COMIC_TITLE,
  NEW_COMIC_TITLE,
  SEARCH_BY_KEY_COMIC_TITLE,
} from "../../constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListItem from "./ListItem";
import { comicSelectors } from "../../features/comics/comicSlice";

const ListComic = ({ keyword, filter, comics, other, title, isFollow }) => {
  const category = useSelector((state) => state.comics.selectedCategory);
  const comics_follow = useSelector((state) => state.follows.comics);
  // const comics = useSelector(comicSelectors.selectAll);
  return (
    <>
      <div className="list-title">
        <BsStars />
        {/* {"HIHI"} */}
        {category
          ? CATEGORY_COMIC_TITLE + category["category_name"]
          : keyword
          ? SEARCH_BY_KEY_COMIC_TITLE + keyword
          : Object.keys(filter).length > 0
          ? FILTER_COMIC_TITLE
          : NEW_COMIC_TITLE}
      </div>
      <div className="list-comic">
        {comics &&
          !isFollow &&
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
        {isFollow
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
          : null}
      </div>
    </>
  );
};
export default ListComic;
