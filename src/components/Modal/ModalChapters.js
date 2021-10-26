import React from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiX, FiXCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { modalChapter } from "../../features/modal/modalSlice";
import { xoaDau } from "../../utilFunction";

const ModalChapters = (props) => {
  const { showChapter } = useSelector((state) => state.modal);
  const dispatch_redux = useDispatch();

  function splitString(string) {
    const arr = string.split(" ");
    return arr[arr.length - 1];
  }
  const handleClose = () => {
    dispatch_redux(
      modalChapter({
        showChapter: false,
      })
    );
  };

  return (
    <Modal show={showChapter} className="modal_chapters">
      <Modal.Header>
        <div>Danh sách chap</div>
        <div className="btn_close" onClick={handleClose}>
          <FiX />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="list_item_chap">
          {props.list
            ? props.list
                .sort((a, b) => (b.chapter_id > a.chapter_id ? 1 : -1))
                .map((e) => {
                  return (
                    <Link
                      to={`/${xoaDau(e.chapter_name)}/${
                        e.chapter_id
                      }/truyen-tranh/${props.name}`}
                      key={e.chapter_id}
                      className={`${
                        +props.id === +e.chapter_id ? "active" : ""
                      }`}
                      onClick={handleClose}
                    >
                      {splitString(e.chapter_name)}
                    </Link>
                  );
                })
            : ""}

          <Link to="#" className="readChap">
            77
          </Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
          <Link to="#">77</Link>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalChapters;
