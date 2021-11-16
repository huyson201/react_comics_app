/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useMemo } from "react";
import CommentForm from "./CommentForm";
import moment from "moment";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import SubComment from './SubComment'

const CommentItem = ({
  parentIndex,
  addComment,
  parentId = null,
  item,
  activeComment,
  // subComments,
  setActiveComment,
  reply,
  comicId
}) => {
  const replyId = parentId ? parentId : item.comment_id;

  const isReplying = activeComment === item.comment_id;

  const token = useSelector((state) => state.user.token);


  const date = moment(item.createdAt).format("L LTS");


  // const [replies, setReplies] = useState([]);

  // useEffect(() => {
  //   if (subComments !== undefined) {
  //     let newSubCmt = [...subComments]
  //     if (newSubCmt.length > 3) newSubCmt.length = 3
  //     setReplies(newSubCmt);
  //   }
  // }, [subComments]);


  const handleClickReply = () => {
    setActiveComment(item.comment_id);
  };


  let currentUserUid = useMemo(() => {
    let decode = jwtDecode(token)
    return decode.user_uuid
  }, [token])

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
            {currentUserUid === item.user_uuid && (<span>{"<You>"}</span>)}
            <span>{date}</span>
          </div>
          <span className="summary-content-li-content-commnet">
            {`${item.comment_content}`}
          </span>
          {(!reply || reply === false) &&
            (<div id={item.comment_id} onClick={handleClickReply} className="reply-btn">
              Trả lời
            </div>)
          }
        </div>
      </li>

      <SubComment
        parentIndex={parentIndex}
        addComment={addComment}
        subComments={item.subComments}
        setActiveComment={setActiveComment}
        isReplying={isReplying}
        replyId={replyId}
        userName={item.user_info.user_name}
        comicId={comicId}
      />


      {/* <div className="sub-comment">
        {isReplying && (
          <CommentForm
            username={item.user_info.user_name}
            handleSubmit={(text) => {
              addComment(text, replyId, parentIndex)
              setActiveComment(-1)
            }}
          ></CommentForm>
        )}
        {replies &&
          replies.map((e, index) => {
            return (
              <div key={index} style={{ padding: 0 }}>
                <CommentItem
                  parentIndex={parentIndex}
                  parentId={item.comment_id}
                  addComment={addComment}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  key={e.comment_id}
                  item={e}
                  reply={true}
                ></CommentItem>
              </div>
            );
          })}
      </div> */}
    </>
  );
};

export default CommentItem;
