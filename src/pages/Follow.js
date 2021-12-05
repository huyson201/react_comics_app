import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ListComic from "../components/ListComic/ListComic";
import { FOLLOW_COMICS} from "../constants";
import jwt_decode from "jwt-decode";
import { getComicsFollow, removeFollowComic } from "../features/comics/followSlice";
import Loading from "../components/Loading/Loading";
import { removeComicList } from "../features/comics/comicSlice";
const Follow = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [other, setCheckOther] = useState(false);
  const { token } = useSelector((state) => state.user);
  const {status,comics} = useSelector((state) => state.follows);
  useEffect(() => {
    if (token) {
      setCheckOther(true);
      setTitle(FOLLOW_COMICS);
      const user_id = jwt_decode(token).user_uuid;
      console.log(user_id)
      dispatch(getComicsFollow({ id: user_id, userToken: token }));
    }
    return () => {
      dispatch(removeComicList())
      dispatch(removeFollowComic())
    };
  }, [token]);

  return (
    <div>
      {status === "loading" && <Loading />}
      {status === "success" && <ListComic comics={comics} title={title} other={other} isFollow={true} />}
    </div>
  );
};

export default Follow;
