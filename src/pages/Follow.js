import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import ListComic from "../components/ListComic/ListComic";
import { LIMIT } from "../constants";

const Follow = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [activePage, setActivePage] = useState(1);
    const [title, setTitle] = useState("");
    const [other, setCheckOther] = useState(false);
     
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  useEffect(() => {
    dispatch()
  }, []);

  useEffect(() => {
    setActivePage(1);
  }, []);

  return (
    <div>
      <ListComic title={title} other={other} />
        <Pagination
          activePage={activePage}
          itemClass="paginate-item"
          linkClass="page-link"
          itemsCountPerPage={LIMIT}
        //   totalItemsCount={total >= 0 ? total : 0}
          pageRangeDisplayed={3}
          hideNavigation={true}
          firstPageText={"Đầu"}
          lastPageText={"Cuối"}
          onChange={(val) => handlePageChange(val)}
        />
    </div>
  );
};

export default Follow;
