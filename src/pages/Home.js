import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import comicApi from "../api/comicApi";
import ListComic from "../components/ListComic/ListComic";
import { useParams } from "react-router-dom";
const Home = () => {
  const { id, keyword } = useParams();
  const [comicData, setcomicData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [title, setTitle] = useState("");
  const [filters, setFilters] = useState({
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
  useEffect(() => {
    if (id) {
      const getComicsByCategory = async () => {
        try {
          const res = await comicApi.getComicsByCategory(id);
          const data = res.data.data[0];
          setTitle(`Truyện theo thể loại ${data["category_name"]}`);
          setcomicData(data["comics"]);
          setTotal(data.length);
        } catch (error) {
          console.log(error);
        }
      };
      getComicsByCategory();
    } else if (keyword) {
      const getComicsByKeyword = async () => {
        try {
          const res = await comicApi.getComicsByKeyword(keyword);
          const data = res.data.data;
          setTitle(`Tìm kiếm theo từ khoá ${keyword}`);
          setcomicData(data);
          console.log(data.length);
          setTotal(data.length);
        } catch (error) {
          console.log(error);
        }
      };
      getComicsByKeyword();
    } else {
      const getAllComics = async () => {
        try {
          const res = await comicApi.getAll(filters);
          const data = res.data.data;
          setTotal(data["count"]);
          setcomicData(data["rows"]);
          setTitle("Truyện mới cập nhật");
        } catch (error) {
          console.log(error);
        }
      };
      getAllComics();
    }
  }, [filters, id, keyword]);
  return (
    <div>
      <ListComic title={title} data={comicData} />
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
        onChange={(val) => handlePageChange(val)}
      />
    </div>
  );
};

export default Home;
