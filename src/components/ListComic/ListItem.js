import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import comicApi from '../../api/comicApi';
import { xoaDau } from '../../utilFunction';
import moment from "moment";
import { Link } from "react-router-dom";
import {
  deleteComic,
  deleteComicFollow,
} from "../../features/comics/followSlice";
import jwtDecode from "jwt-decode";
const ListItem = ({ other, index, item, isFollow }) => {
    const name = xoaDau(item["comic_name"]);
    const ourRequest = axios.CancelToken.source();
    const [newChapter, setNewChapter] = useState({});
    const [chapterName, setChapterName] = useState('');
    const { token } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const status = useSelector((state) => state.follows.status);
    const history = useHistory();
    //get chapters by id
    const getChaptersByID = async () => {
      try {
        const res = await comicApi.getComicByID(item["comic_id"], {
          cancelToken: ourRequest.token,
        });
        const data = res.data.data;
        const chapters = data["chapters"];
        setNewChapter(chapters[chapters.length - 1]);
        setChapterName(xoaDau(chapters[chapters.length - 1]['chapter_name']))
      } catch (error) {
        setNewChapter("NaN");
      }
    };
    useEffect(() => {
      //set New chapter
      try {
        if (other) {
          getChaptersByID();
        } else {
          setNewChapter(item["chapters"][0]);
          setChapterName(xoaDau(item["chapters"][0]['chapter_name']))
        }
      } catch (error) {}
      return () => {
        setNewChapter(null);
        setChapterName('')
        ourRequest.cancel();
      };
    }, [other]);
    const deleteFollowComic = () => {
      const user_id = jwtDecode(token).user_uuid;
      //delete in api
      dispatch(
        deleteComicFollow({
          user_id: user_id,
          comic_id: item["comic_id"],
          userToken: token,
        })
      );
      status == "success" && dispatch(deleteComic(index)); // delete in redux
    };
    return (
      <>
        <div className="list-comic-item">
          {isFollow && (
            <div onClick={deleteFollowComic} className="item-delete-btn">
              X
            </div>
          )}
          <div className="item-lastest-update">
            {moment(item["updatedAt"]).fromNow()}
          </div>
          <Link to={`/truyen-tranh/${name}-${item["comic_id"]}`}>
            <img
              className="item-img"
              src={item["comic_img"]}
              alt={item["comic_name"]}
            ></img>
          </Link>
          <div className="item-row">
            <Link
              to={`/${chapterName}/${
                newChapter['chapter_id']
              }/truyen-tranh/${name}-${item["comic_id"]}`}
              className="item-new-chapter"
            >
              {newChapter && newChapter["chapter_name"]}
            </Link>
            <div className="item-rate">5.0</div>
          </div>
          <Link to={`/truyen-tranh/${name}-${item["comic_id"]}`}>
            <div className="item-name">{item["comic_name"]}</div>
          </Link>
        </div>
      </>
    );
  };

export default ListItem
