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
  const [activeComment, setActiveComment] = useState(0);
  const { userInfo, token } = useSelector((state) => state.user);

  useEffect(() => {
    const getComments = async () => {
      const res = await comicApi.getCommentsByComicID(comicId);
      console.log(res)
      if (res.data.data) {
        console.log(res)
        setComments(res.data.data.rows);
      }
    };
    getComments();
  }, [comicId]);

  const addComment = (text, parentId) => {
    comicApi
      .createComment(comicId, text, parentId, token)
      .then((res) => {
        if (res.data.data) {
          const data = res.data.data;
          data.subComments = [];
          data.user_info = {
            user_name: userInfo.user_name,
            user_image: userInfo.user_image,
            user_email: userInfo.user_email,
          };
          setComments([...comments, data]);
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

  // const addComment = (text, parentId, parentIndex) => {
  //   comicApi
  //     .createComment(comicId, text, parentId, token)
  //     .then((res) => {
  //       if (res.data.data) {
  //         const data = res.data.data;
  //         data.subComments = [];
  //         data.user_info = {
  //           user_name: userInfo.user_name,
  //           user_image: userInfo.user_image,
  //           user_email: userInfo.user_email,
  //         };
  //         console.log(data)
  //         if (parentId !== 0) {
  //           const newArr = updateCommentList(parentIndex, data);
  //           setComments(newArr);
  //         } else {
  //           setComments([...comments, data]);
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       dispatch(
  //         modalNotify({
  //           show: true,
  //           message: null,
  //           error: WARN_LOGIN,
  //         })
  //       );
  //     });
  // };

  // const updateCommentList = (parentIndex, data) => {
  //   const arr = [...comments];
  //   const parent = comments[parentIndex];
  //   parent.subComments = [data, ...parent.subComments]
  //   arr[parentIndex] = parent;
  //   return arr;
  // };

  return (
    <>
      <div className="content-comments">
        <CommentForm handleSubmit={(text) => addComment(text, 0)}></CommentForm>
        <div className="ul-content-comment">
          {comicId &&
            comments &&
            comments.map((e, index) => {
              return (
                <div key={index}>
                  <CommentItem
                    parentIndex={index}
                    addComment={addComment}
                    // subComments={e.subComments}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                    key={e.comment_id}
                    item={e}
                    comicId={comicId}
                  ></CommentItem>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
export default Comment;
