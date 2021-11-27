import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Loading from "../../Loading/Loading";
import { Link } from "react-router-dom";
import {
  chapterSelectors,
  deleteAllChapter,
  deleteChapter,
  getChapsByComicId,
  removeChapList,
  setCheckAll,
} from "../../../features/comics/chapterSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Table from "../../Table/Table";
import Pagination from "react-js-pagination";
import { LIMIT } from "../../../constants";
import Button from "@restart/ui/esm/Button";
import {
  comicSelectors,
  getComicByID,
  removeSelectedComic,
} from "../../../features/comics/comicSlice";
import ModalAlert from "../../Modal/ModalAlert";
import { xoaDau } from "../../../utilFunction";

const ChapList = (props) => {
  const { comicId } = useParams();
  const [id, setId] = useState();
  const page = props.page;
  const history = useHistory();
  const dispatch = useDispatch();
  const chapters = useSelector(chapterSelectors.selectAll);
  const { status, count, checkAll } = useSelector((state) => state.chapter);
  const { token } = useSelector((state) => state.user);
  const selectedComic = useSelector((state) => state.comics.selectedComic);
  // console.log(selectedComic);
  const [show, setShow] = useState(false);
  const [arrId, setArrId] = useState([]);
  useEffect(() => {
    if (chapters.length > 0 && checkAll === true) {
      let arr = [];
      chapters.forEach((el) => {
        arr.push(el.chapter_id);
      });
      setArrId([...arr]);
    }
  }, [checkAll]);
  console.log(arrId);

  const handleClickAdd = () => {
    history.push(`/comic/${comicId}/chaps/add`);
  };
  const handleClickDetail = () => {
    console.log("click detail");
  };

  const handlePageChange = (pageNumber) => {
    history.push(`/comics/${comicId}/chaps/page/${pageNumber}`);
  };
  //Show alert
  const handleShow = (e) => {
    setId(e.currentTarget.value);
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handleDeleteChap = () => {
    if (checkAll === true && arrId.length > 0) {
      dispatch(deleteAllChapter({ listId: arrId, token: token }));
      dispatch(setCheckAll(false));
    } else {
      dispatch(deleteChapter({ id: id, token: token }));
    }

    setShow(false);
  };

  const handleClickDeleteAll = () => {
    setShow(true);
  };
  useEffect(() => {
    dispatch(getComicByID(comicId));
    dispatch(getChapsByComicId(comicId));
    return () => {
      dispatch(removeChapList());
      dispatch(removeSelectedComic());
    };
  }, [page, count]);

  const columns = [
    {
      Header: "ID",
      accessor: "chapter_id",
    },
    {
      Header: "CHAP_NAME",
      accessor: "chapter_name",
      Cell: ({ cell }) => (
        <div>
          <Link
            className="column-comic-name"
            to={`/${xoaDau(cell.row.values.chapter_name)}/${
              cell.row.values.chapter_id
            }/truyen-tranh/${
              selectedComic ? xoaDau(selectedComic.comic_name) : ""
            }-${comicId}`}
          >
            {cell.row.values.chapter_name}
          </Link>
        </div>
      ),
    },
    // {
    //   Header: "AD_NAME",
    //   Cell: ({ cell }) => <div>Kieu Oanh</div>,
    // },
    {
      Header: "CREATED_AT",
      accessor: "createdAt",
      Cell: ({ cell }) => <div>{cell.row.values.createdAt.split("T")[0]}</div>,
      // accessor: "createdAt",
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
            onClick={handleShow}
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
      {!chapters || status === "loading" ? (
        <Loading />
      ) : (
        <div>
          <ModalAlert
            checkShow={show}
            handleClose={handleClose}
            handleSubmit={handleDeleteChap}
          ></ModalAlert>
          {status === "success" && (
            <>
              <h3>
                {selectedComic && selectedComic.comic_name} ({`${count}`} chap)
              </h3>
              {checkAll === true && (
                <Button
                  onClick={handleClickDeleteAll}
                  style={{
                    borderRadius: 5,
                    backgroundColor: "red",
                    padding: 7,
                    color: "white",
                    // float: "right",
                    marginBottom: 10,
                    marginRight: 10,
                  }}
                >
                  Xóa tất cả chương
                </Button>
              )}
              <Button
                onClick={handleClickAdd}
                style={{
                  borderRadius: 5,
                  backgroundColor: "#40c057",
                  padding: 7,
                  color: "white",
                  float: "right",
                  marginBottom: 10,
                  marginRight: 10,
                }}
              >
                Thêm chương
              </Button>
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
