import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import ListComic from "../components/ListComic/ListComic";
import { useHistory, useParams } from "react-router-dom";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";

import {
  CATEGORY_COMIC_TITLE,
  FILTER_COMIC_TITLE,
  LIMIT,
  NEW_COMIC_TITLE,
  SEARCH_BY_KEY_COMIC_TITLE,
} from "../constants";
import Loading from "../components/Loading/Loading";
import Carousel from "../components/Slider/Carousel";
import comicApi from "../api/comicApi";
import historyApi from "../api/historyApi";
const Home = () => {
  const history = useHistory();
  const params = queryString.parse(history.location.search);
  const { id, number, keyword, name } = useParams();
  const pathName = history.location.pathname;
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const handlePageChange = (pageNumber) => {
    if (pathName === "/") {
      history.push("/truyen-moi-cap-nhat/page/" + pageNumber);
    } else if (keyword) {
      history.push(`/tim-kiem/${keyword}/page/${pageNumber}`);
    } else if (id) {
      history.push(`/the-loai/${name}/${id}/page/` + pageNumber);
    } else if (Object.keys(params).length !== 0) {
      history.push(
        `/tim-kiem-nang-cao?the-loai=${params["the-loai"]}&tinh-trang=${params["tinh-trang"]}&page=` +
          pageNumber
      );
    } else {
      history.push("/truyen-moi-cap-nhat/page/" + pageNumber);
    }
  };
  const getComics = async () => {
    try {
      setLoading(true);
      let offset = pathName === "/" ? 0 : (+number - 1) * LIMIT;
      const res = await comicApi.getAll(offset);
      setData(res.data.data.rows);
      setTotal(res.data.data.count);
      setLoading(false);
    } catch (error) {}
  };
  const getComicsByCategory = async () => {
    try {
      setLoading(true);
      let offset = (+number - 1) * LIMIT;
      const res = await comicApi.getComicsByCategory(id, offset);
      setTitle(
        CATEGORY_COMIC_TITLE + " " + res.data.data.rows[0].category_name
      );
      setData(res.data.data.rows[0].comics);
      setTotal(res.data.data.count);
      setLoading(false);
    } catch (error) {}
  };

  const getComicsByKey = async () => {
    try {
      setLoading(true);
      let offset = (+number - 1) * LIMIT;
      const res = await comicApi.getComicsByKeyword(keyword, offset);
      setData(res.data.data.rows);
      setTotal(res.data.data.count);
      setLoading(false);
    } catch (error) {}
  };
  const getComicsByFilter = async () => {
    try {
      setLoading(true);
      let offset = (+params.page - 1) * LIMIT;
      const res = await comicApi.getComicByFilters(
        params["the-loai"],
        params["tinh-trang"] === "Tất cả" ? "" : params["tinh-trang"],
        offset,
        params["sap-xep"]
      );
      setData(res.data.rows);
      setTotal(res.data.count);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    if (id) {
      // comics by category
      getComicsByCategory();
    } else if (keyword) {
      // search by key
      setTitle(SEARCH_BY_KEY_COMIC_TITLE + keyword);
      getComicsByKey();
    } else if (Object.keys(params).length !== 0) {
      // search by filter
      setTitle(FILTER_COMIC_TITLE);
      getComicsByFilter();
    } else {
      // get comics
      setTitle(NEW_COMIC_TITLE);
      getComics();
    }
    return () => {
      setLoading(false);
      setData([]);
      setTotal(0);
      setTitle("");
    };
  }, [
    number,
    id,
    keyword,
    params.page,
    params["the-loai"],
    params["tinh-trang"],
    params["sap-xep"],
  ]);
  const { isLogged, token } = useSelector((state) => state.user);
  const createHistory = async (comicId, id) => {
    await historyApi.createHistory(comicId, id, token);
  };
  useEffect(() => {
    let histories = JSON.parse(localStorage.getItem("histories"));
    if (histories !== null && isLogged) {
      for (let index = 0; index < histories.length; index++) {
        const e = histories[index];
        createHistory(e.comic_id, e.chapters.toString());
      }
      localStorage.removeItem("histories");
    }
  }, [isLogged]);
  return (
    <div>
      {loading && <Loading />}
      {pathName === "/" && <Carousel></Carousel>}
      {data.length > 0 && !loading && (
        <ListComic
          id={id}
          comics={data}
          keyword={keyword}
          filter={params}
          title={title}
        />
      )}
      {total >= LIMIT && data && (
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
