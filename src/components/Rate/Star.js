import React from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { checkRate } from "../../features/modal/modalSlice";

const Star = (props) => {
const dispatch_redux=useDispatch()
  const changeStar = (e) => {
    props.changeStarIndex(e.target.value);
    dispatch_redux(checkRate(true))
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
