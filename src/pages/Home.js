import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import ListComic from "../components/ListComic/ListComic";
import { useHistory, useParams } from "react-router-dom";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import {
  getComics,
  getComicsByCategory,
  getComicsByFilters,
  getComicsByKey,
  removeComicList,
  setOffSet,
} from "../features/comics/comicSlice";
import {
  FILTER_COMIC_TITLE,
  LIMIT,
  NEW_COMIC_TITLE,
  SEARCH_BY_KEY_COMIC_TITLE,
} from "../constants";
import Loading from "../components/Loading/Loading";
import Carousel from "../components/Slider/Carousel";

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const total = useSelector((state) => state.comics.count);
  const status = useSelector((state) => state.comics.status);
  const params = queryString.parse(history.location.search);
  const { id, number, keyword, name } = useParams();
  const pathName = history.location.pathname;
  const [title, setTitle] = useState("");
  const [other, setCheckOther] = useState(false);
  const handlePageChange = (pageNumber) => {
    if (pathName == "/") {
      history.push("/truyen-moi-cap-nhat/page/" + pageNumber);
    } else if (keyword) {
      history.push(`/tim-kiem/${keyword}/page/${pageNumber}`);
    } else if (id) {
      history.push(`/the-loai/${name}/${id}/page/` + pageNumber);
    } else if (Object.keys(params).length != 0) {
      history.push(
        `/tim-kiem-nang-cao?the-loai=${params["the-loai"]}&tinh-trang=${params["tinh-trang"]}&page=` +
          pageNumber
      );
    } else {
      history.push("/truyen-moi-cap-nhat/page/" + pageNumber);
    }
  };

  useEffect(() => {
    if (number) {
      dispatch(setOffSet((+number - 1) * LIMIT));
    } else if (Object.keys(params).length != 0) {
      dispatch(setOffSet((+params.page - 1) * LIMIT));
    } else {
      dispatch(setOffSet(0));
    }
  }, [number, params.page, Object.keys(params).length != 0]);

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
    } else if (keyword) {
      // searck by key
      setCheckOther(true);
      status == "success" && setTitle(SEARCH_BY_KEY_COMIC_TITLE + keyword);
      doAction(dispatch(getComicsByKey(keyword)));
    } else if (Object.keys(params).length != 0) {
      // search by filter
      setCheckOther(true);
      status == "success" && setTitle(FILTER_COMIC_TITLE);
      doAction(
        dispatch(
          getComicsByFilters({
            categories: params["the-loai"],
            status:
              params["tinh-trang"] == "Tất cả" ? "" : params["tinh-trang"],
          })
        )
      );
    } else {
      // get comics
      setCheckOther(false);
      setTitle(NEW_COMIC_TITLE);
      doAction(dispatch(getComics()));
    }
    return () => {
      dispatch(removeComicList());
    };
  }, [
    number,
    id,
    keyword,
    params["the-loai"],
    params["tinh-trang"],
    params.page,
  ]);
  return (
    <div>
      {status == "loading" && <Loading />}
      {pathName == "/" && <Carousel></Carousel>}
      {status == "success" && <ListComic title={title} other={other} />}
      {total >= LIMIT && status == "success" && (
        <Pagination
          activePage={
            number && !params.page
              ? +number
              : +params.page || (!number && !params.page && 1)
          }
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
