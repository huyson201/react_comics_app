import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useHistory } from "react-router";
import comicApi from "../../api/comicApi";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

const ChapList = (props) => {
  const [checkAll, setCheckAll] = useState(false);
  const [check, setCheck] = useState();
  const [chapters, setChapters] = useState();
  const history = useHistory();
  const getChapList = async () => {
    try {
      const res = await comicApi.getComicByID(props.comicId);
      if (res.data.data) {
        setChapters(res.data.data.chapters);
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getChapList();
  }, []);

  console.log(chapters);

  const handleClickAdd = () => {
    history.push("/comic/chaps/add");
  };
  const handleClickDetail = () => {
    console.log("click detail");
  };
  return (
    <>
      {!chapters ? (
        <Loading />
      ) : (
        <>
          <div className="heading">
            <div>Comic name (2)</div>
            <div className="button_add" onClick={handleClickAdd}>
              <i className="fas fa-plus-circle"></i>
              <span>Thêm chương</span>
            </div>
          </div>

          <div className="chap_list">
            <ul>
              <li className="head_chap_list">
                <div>
                  <input type="checkbox" />
                  <span>Chapter name</span>
                </div>
                <div>
                  <span>Admin name</span>
                  <span>Create date</span>
                </div>
              </li>

              {chapters
                .sort((a, b) => (b.chapter_id > a.chapter_id ? 1 : -1))
                .map((e, i) => {
                  return (
                    <li key={i} className="body_chap_list">
                      <input type="checkbox" />
                      <div key={i} className="content">
                        <div>
                          <span>{e.chapter_name}</span>
                        </div>
                        <div>
                          <span>luu thi kieu oanh</span>
                          <span>{e.createdAt.split("T")[0]}</span>
                          <i
                            className="fas fa-edit"
                            onClick={() => {
                              history.push(
                                `/comic/chaps/${e.chapter_id}/update`
                              );
                            }}
                          ></i>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default ChapList;
