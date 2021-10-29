import React, { useEffect, useState } from "react";
import comicApi from "../../api/comicApi";
import "./comment.css";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useSelector } from "react-redux";
const Comment = ({ comicId }) => {
  const [comments, setComments] = useState([]);
  const [activeComment, setActiveComment] = useState(1);
  const token = useSelector((state) => state.user.token);
  const getComments = async () => {
    const res = await comicApi.getCommentsByComicID(comicId);
    if (res.data.data) {
      console.log(res.data.data.comments);
      setComments(res.data.data.comments);
    }
  };
  useEffect(() => {
    getComments();
  }, []);
  const addComment = (text, parentId, parentIndex) => {
    comicApi.createComment(comicId, text, parentId, token).then((res) => {
      if (res.data.data) {
        const data = res.data.data;
        data.subComments = [];
        if (parentId != 0) {
          const newArr = updateCommentList(parentIndex,data)
          setComments(newArr);
        } else {
          setComments([...comments, data]);
        }
      }
    });
  };
  const updateCommentList = (parentIndex,data) => {
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
