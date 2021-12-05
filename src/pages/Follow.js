import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ListComic from "../components/ListComic/ListComic";
import { EXPIRED, FOLLOW_COMICS } from "../constants";
import jwt_decode from "jwt-decode";
import {
  getComicsFollow,
  removeFollowComic,
} from "../features/comics/followSlice";
import Loading from "../components/Loading/Loading";
import { removeComicList } from "../features/comics/comicSlice";
import { login, logout } from "../features/auth/userSlice";
import { toast } from "react-toastify";
import { isJwtExpired } from "jwt-check-expiration";
import userApi from "../api/userApi";
const Follow = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [other, setCheckOther] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const { token, refreshToken } = useSelector((state) => state.user);
  const { status, comics } = useSelector((state) => state.follows);
  useEffect(async () => {
    (await checkToken(token, refreshToken)) === null && resetDispatch();
    if (token && (await checkToken(token, refreshToken)) !== null) {
      setCheckOther(true);
      setTitle(FOLLOW_COMICS);
      const user_id = jwt_decode(token).user_uuid;
      console.log(user_id);
      dispatch(
        getComicsFollow({
          id: user_id,
          userToken: await checkToken(token, refreshToken),
        })
      );
    }
    return () => {
      dispatch(removeComicList());
      dispatch(removeFollowComic());
    };
  }, [token]);

  const checkToken = async (token, refreshToken) => {
    let temp = null;
    if (token && isJwtExpired(token) === false) {
      temp = token;
    } else {
      if (refreshToken && isJwtExpired(refreshToken) === false) {
        const resUpdate = await userApi.refreshToken(refreshToken);
        if (resUpdate.data && resUpdate.data.token) {
          temp = resUpdate.data.token;
          dispatch(
            login({
              token: resUpdate.data.token,
              refreshToken: refreshToken,
            })
          );
        }
      }
    }
    return temp;
  };

  //thông báo login khi refreshtoken hết hạn
  const resetDispatch = () => {
    dispatch(logout());
    if (!toast.isActive(EXPIRED)) {
      toast.warn(EXPIRED, { toastId: EXPIRED });
    }
  };
  return (
    <div>
      {status === "loading" && <Loading />}
      {status === "success" && (
        <ListComic
          comics={comics}
          title={title}
          other={other}
          isFollow={true}
        />
      )}
    </div>
  );
};

export default Follow;
