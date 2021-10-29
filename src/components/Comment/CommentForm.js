import React, { useEffect, useRef, useState } from "react";

const CommentForm = ({ username, handleSubmit }) => {
  const [text, setText] = useState("");
  const ref = useRef()
  const onSubmit = (e) => {
    e.preventDefault();
    setText(text)
    handleSubmit(text);
    setText("");
  };
  useEffect(() => {
   if(username){
    ref.current.value = `@${username} `
   }
  }, [])
  return (
    <>
      <form className="comment-form" onSubmit={onSubmit}>
        <textarea ref={ref}
          placeholder="Mời bạn thảo luận..."
          className="comment-form-textarea"
          onChange={(e) => setText(e.target.value)}
          value={text}
        ></textarea>
        <button className="comment-form-button">Gửi</button>
      </form>
    </>
  );
};

export default CommentForm;
