import React, { useEffect, useRef, useState } from "react";
import Pagination from "react-js-pagination";
import comicApi from "../api/comicApi";
import ListComic from "../components/ListComic/ListComic";
import { useHistory, matchPath } from "react-router-dom";
const Home = () => {
  const history = useHistory();
  // const ourRequest = axios.CancelToken.source();
  const key = history.location.keyword;
  const idCate = history.location.id;
  const pathName = history.location.pathname;
  const pathCate = matchPath(pathName, { path: "/the-loai/:name" });
  const [comicData, setcomicData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [title, setTitle] = useState("");
  const [other, setCheckOther] = useState(false);
  const [filters, setFilters] = useState({
    limit: 12,
    offset: 0,
  });
  const [filtersSearch, setFiltersSearch] = useState({
    limit: 12,
    offset: 0,
  });
  const [total, setTotal] = useState(0);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setFilters({
      ...filters,
      offset: filters.limit * (pageNumber - 1),
    });
  };

  const handleSearchPageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setFiltersSearch({
      ...filtersSearch,
      offset: filtersSearch.limit * (pageNumber - 1),
    });
  };
  const getComicsByCategory = async () => {
    try {
      const res = await comicApi.getComicsByCategory(idCate);
      const data = res.data.data[0];
      setTitle(`Truyện theo thể loại ${data["category_name"]}`);
      setcomicData(data["comics"]);
      // setTotal(data["comics"].length);
    } catch (error) {
      setcomicData([]);
      console.log(error);
    }
  };
  const getAllComics = async () => {
    try {
      const res = await comicApi.getAll(filters);
      const data = res.data.data;
      setTotal(data["count"]);
      setcomicData(data["rows"]);
      setTitle("Truyện mới cập nhật");
    } catch (error) {
      setcomicData([]);
      console.log(error);
    }
  };
  const getComicsByKeyword = async () => {
    try {
      const res = await comicApi.getComicsByKeyword(key, filtersSearch);
      const data = res.data.data;
      setTitle(`Tìm kiếm theo từ khoá ${key}`);
      setcomicData(data["rows"]);
      setTotal(data["count"]);
    } catch (error) {
      setcomicData([]);
      console.log(error);
    }
  };

  useEffect(() => {
    setActivePage(1);
    if (pathCate) {
      setCheckOther(true);
      getComicsByCategory();
    } else if (key) {
      setCheckOther(true);
      getComicsByKeyword();
    } else {
      setCheckOther(false);
      getAllComics();
    }
    return () => {
      setcomicData([]);
      // ourRequest.cancel();
    };
  }, [filters, pathName, key, filtersSearch]);
  return (
    <div>
      <ListComic title={title} other={other} data={comicData} />
      {!idCate ? (
        <Pagination
          activePage={activePage}
          itemClass="paginate-item"
          linkClass="page-link"
          itemsCountPerPage={filters.limit}
          totalItemsCount={total}
          pageRangeDisplayed={3}
          hideNavigation={true}
          firstPageText={"Đầu"}
          lastPageText={"Cuối"}
          onChange={
            key
              ? (val) => handleSearchPageChange(val)
              : (val) => handlePageChange(val)
          }
        />
      ) : null}
    </div>
  );
};

export default Home;
