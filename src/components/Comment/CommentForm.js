import React, { useState } from "react";

const CommentForm = ({ handleSubmit }) => {
  const [text, setText] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(text);
    setText("");
  };
  return (
    <>
      <form className="comment-form" onSubmit={onSubmit}>
        <textarea
          placeholder="Mời bạn thảo luận..."
          className="comment-form-textarea"
          onChange={(e) => setText(e.target.value)}
          value={text}
        ></textarea>
        <button className="comment-form-button">Send</button>
      </form>
    </>
  );
};

export default CommentForm;
