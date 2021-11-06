import React, { useEffect, useState } from "react";
// import "./dashboard.css";
import { useHistory, useParams } from "react-router";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import chapApi from "../../api/chapApi";
import { chapterSelectors, deleteChapter, getChapsByComicId, removeChapList } from "../../features/comics/chapterSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaList, FaTrashAlt } from "react-icons/fa";
import Table from "../Table/Table";
import Pagination from "react-js-pagination";
import { LIMIT } from "../../constants";
import Button from "@restart/ui/esm/Button";

const ChapList = (props) => {
  const { comicId } = useParams()
  const page = props.page
  const history = useHistory()
  const dispatch = useDispatch()
  const chapters = useSelector(chapterSelectors.selectAll);
  const { status, count } = useSelector(state => state.chapter);
  const { token } = useSelector(state => state.user);
  console.log(chapters);
  const handleClickAdd = () => {
    history.push(`/comic/${comicId}/chaps/add`);
  };
  const handleClickDetail = () => {
    console.log("click detail");
  };

  const handlePageChange = (pageNumber) => {
    history.push(`/comics/${comicId}/chaps/page/${pageNumber}`);
  };
  const handleDeleteChap = (e) => {
    e.preventDefault();
    console.log(e.currentTarget.value);
    dispatch(deleteChapter({ id: e.currentTarget.value, token: token }));
  };

  useEffect(() => {
    dispatch(getChapsByComicId(comicId));
    return (
      dispatch(removeChapList())
    )
  }, [page])

  const columns = [
    {
      Header: "ID",
      accessor: "chapter_id",
    },
    {
      Header: "CHAP_NAME",
      accessor: "chapter_name",
    },
    {
      Header: "AD_NAME",
      Cell: ({ cell }) => (
        <div>Kieu Oanh</div>
      )
    },
    {
      Header: "CREATED_AT",
      accessor: "createdAt",
    },
    {
      Header: "Action",
      sort: false,
      Cell: ({ cell }) => (
        <div>
          <Link
            style={{ marginRight: 10 }}
            to={`/comics/${comicId}/chaps/${cell.row.values.chapter_id}/update`}
          >
            <FaEdit style={{ color: "black" }}></FaEdit>
          </Link>
          <button
            onClick={handleDeleteChap}
            value={cell.row.values.chapter_id}
            style={{ marginRight: 10, background: "none" }}
          >
            <FaTrashAlt style={{ color: "red" }}></FaTrashAlt>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {!chapters ? (
        <Loading />
      ) : (
        <div>
          {status === "success" && (
            <>
              <h3>Comic name ({`${count}`} chap)</h3>
              <Button onClick={handleClickAdd} style={{ borderRadius: 5, backgroundColor: "#40c057", padding: 7, color: "white", float: "right", marginBottom: 10, marginRight: 10 }}>Thêm chương</Button>
              <Table data={chapters && chapters} columns={columns}></Table>
            </>
          )}
          {status === "success" && count > LIMIT && (
            <Pagination
              activePage={page && +page}
              itemClass="paginate-item"
              linkClass="page-link"
              itemsCountPerPage={LIMIT}
              totalItemsCount={count >= 0 ? count : 0}
              pageRangeDisplayed={3}
              hideNavigation={true}
              firstPageText={"Đầu"}
              lastPageText={"Cuối"}
              onChange={(val) => handlePageChange(val)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ChapList;
