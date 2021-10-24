import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ListComic from "../components/ListComic/ListComic";
import { FOLLOW_COMICS, LIMIT } from "../constants";
import jwt_decode from "jwt-decode";
import { getComicsFollow } from "../features/comics/followSlice";
import { removeComicList } from "../features/comics/comicSlice";
import Loading from "../components/Loading/Loading";
const Follow = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [other, setCheckOther] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const { token } = useSelector((state) => state.user);
  const status = useSelector((state) => state.follows.status);
  useEffect(() => {
    if (token) {
      setCheckOther(true);
      setTitle(FOLLOW_COMICS);
      setIsFollow(true);
      const user_id = jwt_decode(token).user_uuid;
      dispatch(getComicsFollow({ id: user_id, userToken: token }));
    }
    return () => {
      setIsFollow(false);
    };
  }, [token]);

  return (
    <div>
      {status == "loading" && <Loading />}
      {status == "success" && <ListComic title={title} other={other} isFollow={isFollow} />}
    </div>
  );
};

export default Follow;
