import React, { useEffect } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { COMIC_NAME, LIMIT } from "../../../constants";
import { FaList, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  comicSelectors,
  deleteComic,
  getComics,
  setOffSet,
} from "../../../features/comics/comicSlice";
import { Link } from "react-router-dom";
import Table from "../../Table/Table";
const ComicList = ({ page }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const total = useSelector((state) => state.comics.count);
  const token = useSelector((state) => state.user.token);
  console.log(token);
  const { status } = useSelector((state) => state.comics);
  const comics = useSelector(comicSelectors.selectAll);
  const handlePageChange = (pageNumber) => {
    history.push("/comics/page/" + pageNumber);
  };
  const handleDeleteComic = (e) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    dispatch(deleteComic({ id: e.currentTarget.value, token: token }));
  };
  useEffect(() => {
    dispatch(setOffSet((+page - 1) * LIMIT));
    dispatch(getComics());
  }, [dispatch, page]);
  const columns = [
    {
      Header: "ID",
      accessor: "comic_id",
    },
    {
      Header: COMIC_NAME,
      accessor: "comic_name",
    },
    {
      Header: "Action",
      sort: false,
      Cell: ({ cell }) => (
        <div>
          <Link
            style={{ marginRight: 10 }}
            to={`/comics/${cell.row.values.comic_id}/chaps`}
          >
            <FaList style={{ color: "black" }}></FaList>
          </Link>
          <Link
            style={{ marginRight: 10 }}
            to={`/comics/edit/${cell.row.values.comic_id}`}
          >
            <FaEdit style={{ color: "black" }}></FaEdit>
          </Link>
          <button
            onClick={handleDeleteComic}
            value={cell.row.values.comic_id}
            style={{ marginRight: 10, background: "none" }}
          >
            <FaTrashAlt style={{ color: "red" }}></FaTrashAlt>
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      {status === "success" && (
        <Table data={comics && comics} columns={columns}></Table>
      )}
      {status === "success" && (
        <Pagination
          activePage={page && +page}
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

export default ComicList;
