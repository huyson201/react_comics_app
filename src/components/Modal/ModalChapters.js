import React from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { modalChapter } from "../../features/modal/modalSlice";
import { xoaDau } from "../../utilFunction";
import { chapterSelectors } from "../../features/comics/chapterSlice";

const ModalChapters = (props) => {
  const { showChapter } = useSelector((state) => state.modal);
  const chapter = useSelector(chapterSelectors.selectAll);
  const dispatch_redux = useDispatch();
  let temp = chapter !== null ? [...chapter] : null;
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
    <Modal show={showChapter} dialogClassName="modal_chapters">
      <Modal.Header>
        <div>Danh sách chap</div>
        <div className="btn_close" onClick={handleClose}>
          <FiX />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="list_item_chap">
          {temp !== null
            ? temp
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
          {/* 
          <Link to="#" className="readChap">
            77
          </Link>
          <Link to="#">77</Link> */}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalChapters;
