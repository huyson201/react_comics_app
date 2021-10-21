import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import ListComic from "../components/ListComic/ListComic";
import { useHistory, matchPath, useParams } from "react-router-dom";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import {
  getComics,
  getComicsByCategory,
  getComicsByKey,
  setOffSet,
} from "../features/comics/comicSlice";
import {
  CATEGORY_COMIC_TITLE,
  LIMIT,
  NEW_COMIC_TITLE,
  SEARCH_BY_KEY_COMIC_TITLE,
} from "../constants";
const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const total = useSelector((state) => state.comics.count);
  const selectedCategory = useSelector(
    (state) => state.comics.selectedCategory
  );
  const { name } = useParams();
  const params = queryString.parse(history.location.search);
  const key = history.location.keyword;
  const idCate = history.location.id;
  const pathName = history.location.pathname;
  const [activePage, setActivePage] = useState(1);
  const [title, setTitle] = useState("");
  const [other, setCheckOther] = useState(false);
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    
  };
  useEffect(() => {
    dispatch(setOffSet((activePage - 1) * 6));
  }, [activePage]);
  
  const paginateDispatch = async (action) => {
    try {
     await action;
    } catch (error) {
      dispatch(setOffSet(0));
    }
  };
  useEffect(() => {
    setActivePage(1);
  }, [pathName]);
  useEffect(() => {
    if (idCate) {
      setCheckOther(true);
      setTitle(CATEGORY_COMIC_TITLE);
      paginateDispatch(dispatch(getComicsByCategory(idCate)));
    } else if (key) {
      setCheckOther(true);
      setTitle(SEARCH_BY_KEY_COMIC_TITLE + key);
      paginateDispatch(dispatch(getComicsByKey(key)));
    } 
    else {
      setCheckOther(false);
      setTitle(NEW_COMIC_TITLE);
      paginateDispatch(dispatch(getComics()));
    }
  }, [activePage, idCate, key, pathName]);
  return (
    <div>
      <ListComic title={title} other={other} />
      {total >= LIMIT && (
        <Pagination
          activePage={activePage}
          itemClass="paginate-item"
          linkClass="page-link"
          itemsCountPerPage={LIMIT}
          totalItemsCount={total >= 0 ? total : 0}
          pageRangeDisplayed={3}
          hideNavigation={true}
          firstPageText={"Đầu"}
          lastPageText={"Cuối"}
          onChange={(val) => handlePageChange(val)}
        />
      )}
    </div>
  );
};

export default Home;
