import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import ListComic from "../components/ListComic/ListComic";
import { useHistory,useParams } from "react-router-dom";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import {
  getComics,
  getComicsByCategory,
  getComicsByFilters,
  getComicsByKey,
  setOffSet,
} from "../features/comics/comicSlice";
import {
  FILTER_COMIC_TITLE,
  LIMIT,
  NEW_COMIC_TITLE,
  SEARCH_BY_KEY_COMIC_TITLE,
} from "../constants";
import Loading from "../components/Loading/Loading";
const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const total = useSelector((state) => state.comics.count);
  const status = useSelector((state) => state.comics.status);
  const params = queryString.parse(history.location.search);
  const {id} = useParams();
  const key = history.location.keyword;
  const pathName = history.location.pathname;
  const [activePage, setActivePage] = useState(1);
  const [title, setTitle] = useState("");
  const [other, setCheckOther] = useState(false);
  
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  useEffect(() => {
    dispatch(setOffSet((activePage - 1) * LIMIT));
  }, [activePage]);

  useEffect(() => {
    setActivePage(1);
  }, [pathName]);

  const doAction = async (action) => {
    try {
      await action;
    } catch (error) {
      dispatch(setOffSet(0));
    }
  };
  useEffect(() => {
    if (id) {
      // comics by category
      setCheckOther(true);
      doAction(dispatch(getComicsByCategory(id)));
    } else if (key) {
      // searck by key
      setCheckOther(true);
      status == "success" && setTitle(SEARCH_BY_KEY_COMIC_TITLE + key);
      doAction(dispatch(getComicsByKey(key)));
    } else if (Object.keys(params).length != 0) {
      // search by filter
      setCheckOther(true);
      status == "success" && setTitle(FILTER_COMIC_TITLE);
      doAction(
        dispatch(
          getComicsByFilters({
            categories: params["the-loai"],
            status: params["tinh-trang"],
          })
        )
      );
    } else {
      // get comics
      setCheckOther(false);
      setTitle(NEW_COMIC_TITLE);
      doAction(dispatch(getComics()));
    }
  }, [activePage, id, key, params["the-loai"], params["tinh-trang"]]);
  return (
    <div>
      {status == "loading" && <Loading />}
      {status == "success" && <ListComic title={title} other={other} />}
      {total >= LIMIT && status == "success" &&(
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
