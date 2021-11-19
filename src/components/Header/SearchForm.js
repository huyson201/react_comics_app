import React, { useState, useEffect } from "react";
import { MdFilterAlt } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import { Collapse } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./header.css";
import { xoaDau } from "../../utilFunction";
import { useSelector } from "react-redux";

const SearchForm = () => {
  const history = useHistory();
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  const categories = useSelector((state) => state.categories.categories);
  const [checkedState, setCheckedState] = useState([0]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setCheckedState(new Array(categories.length).fill(false));
  }, [categories.length]);
  //xử lý dữ liệu khi nhấn tìm kiếm
  const handleSubmit = (e) => {
    const keyUrl = xoaDau(key);
    e.preventDefault();
    history.push({
      pathname: "/tim-kiem/" + key + "/page/1",
    });
    setKey("");
  };
  //xử lý dữ liệu khi nhấn filter
  const handleSubmitFilter = (e) => {
    e.preventDefault();
    let arr = [];
    categories.map((item, i) => {
      if (checkedState[i] === true) {
        arr.push(item["category_id"]);
      }
    });
    history.push({
      pathname: "/tim-kiem-nang-cao",
      search: `the-loai=${arr}&tinh-trang=${status}&page=1`,
    });
  };
  //set check for checkbox category
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  return (
    <>
      <div className="search">
        <div
          className="search-filter"
          onClick={() => setOpen(!open)}
          aria-controls="filter-collapse"
          aria-expanded={open}
        >
          <MdFilterAlt />
        </div>
        <form onSubmit={handleSubmit} className="form-search">
          <input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
            className="input-search"
            type="text"
            placeholder="Nhập từ khoá..."
          ></input>
          <button className="btn-search" type="submit">
            <ImSearch />
          </button>
        </form>
      </div>
      <Collapse in={open}>
        <div id="filter-collapse">
          <div className="filter-form">
            <div className="filter-category">Thể loại</div>
            <form onSubmit={handleSubmitFilter}>
              <div className="check-box-form">
                {categories.map((item, i) => {
                  return (
                    <label key={item["category_id"]} className="checkbox-item">
                      <input
                        onChange={() => handleOnChange(i)}
                        checked={!!checkedState[i]}
                        id={item["category_id"]}
                        name={item["category_name"]}
                        type="checkbox"
                      />
                      <span className="checkmark"></span>
                      <div>{item["category_name"]}</div>
                    </label>
                  );
                })}
              </div>
              <div className="filter-status">Trình trạng</div>
              <div className="status-form">
                <select
                  value={status}
                  className="select-status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đang tiến hành">Đang tiến hành</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                </select>
              </div>
              <div className="btn-wrap">
                <button>Lọc ngay</button>
              </div>
            </form>
          </div>
        </div>
      </Collapse>
    </>
  );
};
export default SearchForm;
