import React from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useData } from "../../context/Provider";

const Star = (props) => {
  const { dispatch } = useData();

  const changeStar = (e) => {
    props.changeStarIndex(e.target.value);
    dispatch({
      type: "CHECK",
      payload: {
        check: true,
      },
    });
  };
  return (
    <label className="star">
      <input
        type="radio"
        name="rating"
        value={props.index}
        className="stars_radio-input"
        onClick={changeStar}
      />
      {props.style === true ? (
        <BsStarFill className="icon_star" />
      ) : (
        <BsStar className="icon_star" />
      )}
    </label>
  );
};

export default Star;
