import React, { useEffect, useState } from "react";
import comicApi from "../../api/comicApi";
import "./comment.css";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { modalNotify } from "../../features/modal/modalSlice";
import { WARN_LOGIN } from "../../constants";
const Comment = ({ comicId }) => {
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [activeComment, setActiveComment] = useState(1);
  const token = useSelector((state) => state.user.token);
  const getComments = async () => {
    const res = await comicApi.getCommentsByComicID(comicId);
    if (res.data.data) {
      setComments(res.data.data);
    }
  };
  useEffect(() => {
    getComments();
  }, []);
  const addComment = (text, parentId, parentIndex) => {
    comicApi
      .createComment(comicId, text, parentId, token)
      .then((res) => {
        const userInfo = jwtDecode(token);
        if (res.data.data) {
          const data = res.data.data;
          data.subComments = [];
          data.user_info = {
            user_name: userInfo.user_name,
            user_image: userInfo.user_image,
            user_email: userInfo.user_email,
          };
          if (parentId != 0) {
            const newArr = updateCommentList(parentIndex, data);
            setComments(newArr);
          } else {
            setComments([...comments, data]);
          }
        }
      })
      .catch((err) => {
        dispatch(
          modalNotify({
            show: true,
            message: null,
            error: WARN_LOGIN,
          })
        );
      });
  };
  const updateCommentList = (parentIndex, data) => {
    const arr = [...comments];
    const parent = comments[parentIndex];
    const parentSub = parent.subComments;
    parentSub.push(data);
    arr[parentIndex] = parent;
    return arr;
  };
  return (
    <>
      <div className="content-comments">
        <CommentForm handleSubmit={(text) => addComment(text, 0)}></CommentForm>
        <ul className="ul-content-comment">
          {comicId &&
            comments &&
            comments.map((e, index) => {
              return (
                <div key={index}>
                  <CommentItem
                    parentIndex={index}
                    addComment={addComment}
                    subComments={e.subComments}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                    key={e.comment_id}
                    item={e}
                  ></CommentItem>
                </div>
              );
            })}
        </ul>
      </div>
    </>
  );
};
export default Comment;
