import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import comicApi from "../api/comicApi";
import ListComic from "../components/ListComic/ListComic";
import { useHistory, useParams } from "react-router";
const Home = () => {
  const { id } = useParams();
  const history = useHistory();
  console.log(history);
  let string = history.location.pathname;
  console.log(history.location.pathname);
  const [comicData, setcomicData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [title, setTitle] = useState("");
  const [filters, setFilters] = useState({
    limit: 10,
    offset: 0,
  });
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setFilters({
      ...filters,
      offset: filters.limit * (pageNumber - 1),
    });
  };
  useEffect(() => {
    if (string === "/") {
      const getAllComics = () => {
        comicApi
          .getAll(filters)
          .then((res) => {
            setcomicData(res.data.data);
            setTitle("Truyện mới cập nhật");
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getAllComics();
    } else {
      const getComicsByCategory = () => {
        comicApi
          .getComicsByCategory(id, filters)
          .then((res) => {
            const data = res.data.data[0];
            setTitle(`Truyện theo thể loại ${data["category_name"]}`);
            setcomicData(data["comics"]);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getComicsByCategory();
    }
  }, [filters, string]);

  return (
    <div>
      <ListComic title={title} data={comicData} />
      <Pagination
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
      />
    </div>
  );
};

export default Home;
