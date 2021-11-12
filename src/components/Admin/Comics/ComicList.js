import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { COMIC_NAME, LIMIT } from "../../../constants";
import { FaList, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  comicSelectors,
  deleteComic,
  getComics,
  removeComicList,
  removeSelectedComic,
  setOffSet,
} from "../../../features/comics/comicSlice";
import { Link } from "react-router-dom";
import Table from "../../Table/Table";
import { xoaDau } from "../../../utilFunction";
import ModalAlert from "../../Modal/ModalAlert";
import Loading from "../../Loading/Loading";
const ComicList = ({ page }) => {
  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const total = useSelector((state) => state.comics.count);
  const token = useSelector((state) => state.user.token);
  const { status } = useSelector((state) => state.comics);
  const comics = useSelector(comicSelectors.selectAll);
  const handlePageChange = (pageNumber) => {
    history.push("/comics/page/" + pageNumber);
  };
  const handleShow = (e) => {
    setId(e.currentTarget.value);
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handleDeleteComic = () => {
    dispatch(deleteComic({ id: id, token: token }));
    setShow(false);
  };
  useEffect(() => {
    dispatch(setOffSet((+page - 1) * LIMIT));
    dispatch(getComics());
    return () => {
      // dispatch(removeComicList());
      dispatch(removeSelectedComic());
    };
  }, [page]);
  const columns = [
    {
      Header: "ID",
      accessor: "comic_id",
    },
    {
      Header: COMIC_NAME,
      accessor: "comic_name",
      Cell: ({ cell }) => (
        <div>
          <Link
            className="column-comic-name"
            to={`/truyen-tranh/${xoaDau(cell.row.values.comic_name)}-${
              cell.row.values.comic_id
            }`}
          >
            {cell.row.values.comic_name}
          </Link>
        </div>
      ),
    },
    {
      Header: "Action",
      sort: false,
      Cell: ({ cell }) => (
        <div>
          <Link
            style={{ marginRight: 10 }}
            to={`/comics/${cell.row.values.comic_id}/chaps/page/1`}
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
            onClick={handleShow}
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
      <ModalAlert
        checkShow={show}
        handleClose={handleClose}
        handleSubmit={handleDeleteComic}
      ></ModalAlert>
      {status === "loading" && <Loading></Loading>}
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
