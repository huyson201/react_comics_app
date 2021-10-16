import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { BiBookReader } from "react-icons/bi";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { FaRegGrinStars } from "react-icons/fa";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import moment from "moment";
import { BsStar, BsStarFill } from "react-icons/bs";
// import Dialog from "react-bootstrap-dialog";

const DetailComic = () => {
  const history = useHistory();

  const { name } = useParams();
  const arrName = name.split("-")
  const id = arrName[arrName.length - 1]
  console.log(id)
  const [data, setData] = useState();
  const [checked, setChecked] = useState(false);
  // this.dialog.showAlert('Hello Dialog!')

  useEffect(() => {
    axiosClient
      .get("/comics/" + id)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleReadFirst = () => {
    history.push("/");
  };

  const handleReadLast = () => {
    history.push("/");
  };

  return (
    <div className="container-detail">
      {/* <Dialog ref={(el) => { this.dialog = el }} /> */}
      <div className="content">
        <h1 className="title_comic">{data ? data.comic_name : ""}</h1>
        <div className="head comic_bg">
          <div className="head_left">
            <img
              src={data ? data.comic_img : "#"}
              alt={data ? data.comic_name : ""}
            />
          </div>
          <div className="head_right">
            <div className="list_cate">
              <div className="type">Thể loại</div>
              <div className="item">
                {data
                  ? data.categories.map((e, i) => {
                      return (
                        <Link key={i} to={`/categories/${e.category_id}`}>
                          {e.category_name}
                        </Link>
                      );
                    })
                  : ""}
              </div>
            </div>
            <div className="status">
              <div className="type">Trạng thái</div>
              <div className="item">{data ? data.comic_status : ""}</div>
            </div>
            <div className="score">
              <div className="type">Điểm</div>
              <div className="item">9.2 - 90 lượt đánh giá </div>
            </div>
            <div className="update_time">
              <div className="type">Cập nhật</div>
              <div className="item">
                {data
                  ? updateDate(
                      data.chapters.sort((a, b) =>
                        b.chapter_id > a.chapter_id ? 1 : -1
                      )[0].updatedAt
                    )
                  : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="button comic_bg">
          <div className="head_left">
            <Link to="#" type="button" onClick={() => setChecked(!checked)}>
              {checked === true ? (
                <>
                  <MdBookmark className="icon" />
                  Bỏ theo dõi
                </>
              ) : (
                <>
                  <MdBookmarkBorder className="icon" />
                  Theo dõi
                </>
              )}
            </Link>
            <Link to="#" type="button" onClick={handleReadFirst}>
              <BiBookReader className="icon" /> Đọc từ đầu
            </Link>

            <Link to="#" type="button" onClick={handleReadLast}>
              <BiBookReader className="icon" /> Đọc chap mới nhất
            </Link>
          </div>
          <div className="head_right">
            <div className="rating">
              <BsStar className="icon_star" /> <BsStar className="icon_star" />{" "}
              <BsStar className="icon_star" /> <BsStar className="icon_star" />{" "}
              <BsStar className="icon_star" />{" "}
            </div>
          </div>
        </div>

        <div className="body">
          <div className="list_chap comic_bg">
            <div className="flex">
              <h2 className="heading">Danh sách chap</h2>
            </div>
            <div className="list_item_chap">
              {data
                ? data.chapters
                    .sort((a, b) => (b.chapter_id > a.chapter_id ? 1 : -1))
                    .map((e, i) => {
                      return (
                        <Link to="#" key={i} title={e.chapter_name}>
                          <span>{e.chapter_name}</span>
                          <span>{updateDate(e.updatedAt)}</span>
                        </Link>
                      );
                    })
                : ""}
            </div>
          </div>
          <div className="desc comic_bg">
            <h2 className="heading">Nội dung</h2>
            {data ? data.comic_desc : ""}
          </div>
        </div>

        <div className="footer">
          <div className="comment_fb comic_bg">COMMENT</div>
        </div>
      </div>
    </div>
  );
};

function updateDate(date) {
  moment.locale("vi");
  return moment(date).fromNow();
}

export default DetailComic;
