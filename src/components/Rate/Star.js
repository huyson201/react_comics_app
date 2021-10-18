import React from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import axiosClient from "../../api/axiosClient";

const Star = (props) => {
  const changeStar = async (e) => {
    props.changeStarIndex(e.target.value);
    console.log(e.target.value);
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
