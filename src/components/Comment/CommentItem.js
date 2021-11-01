/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import moment from "moment";
const CommentItem = ({
  parentIndex,
  addComment,
  parentId = null,
  item,
  activeComment,
  subComments,
  setActiveComment,
}) => {
  const [replies, setReplies] = useState([]);
  useEffect(() => {
    if (subComments !== undefined) {
      setReplies(subComments);
    }
  }, [subComments]);
  const date = moment(item.createdAt).format("L LTS");
  const onReply = () => {
    setActiveComment(item.comment_id);
  };
  const replyId = parentId ? parentId : item.comment_id;
  const isReplying = activeComment === item.comment_id;
  return (
    <>
      <li className="item-comment">
        <div className="image-li-content-comment">
          <img
            className="img-comment"
            src={`https://ui-avatars.com/api/name=${item.user_info.user_name}&background=random`}
          ></img>
          <span className="role-user-comment bg-user-type-1">Thành viên</span>
        </div>
        <div className="content-li-content-commnet">
          <div className="h3-span-content-li-content-commnet">
            <h3>{item.user_info.user_name}</h3>
            <span>{date}</span>
          </div>
          <span className="summary-content-li-content-commnet">
            {`${item.comment_content}`}
          </span>
          <div id={item.comment_id} onClick={onReply} className="reply-btn">
            Trả lời
          </div>
        </div>
      </li>
      <div className="sub-comment">
        {isReplying && (
          <CommentForm
            username={item.user_info.user_name}
            handleSubmit={(text) => addComment(text, replyId, parentIndex)}
          ></CommentForm>
        )}
        {replies &&
          replies.map((e, index) => {
            return (
              <ul key={index} style={{ padding: 0 }}>
                <CommentItem
                  parentIndex={parentIndex}
                  parentId={item.comment_id}
                  addComment={addComment}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  key={e.comment_id}
                  item={e}
                ></CommentItem>
              </ul>
            );
          })}
      </div>
    </>
  );
};

export default CommentItem;
