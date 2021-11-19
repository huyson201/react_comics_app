import React, { useState } from "react";
import {
  MdBookmark,
  MdLogout,
  MdAccountCircle,
  MdArrowDropDown,
  MdLogin,
  MdSpaceDashboard
} from "react-icons/md";
import { AiFillHeart, AiOutlineForm } from "react-icons/ai";

import { ImBooks, ImHistory } from "react-icons/im";
import { Collapse, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./header.css";
import { xoaDau } from "../../utilFunction";
import { useSelector } from "react-redux";

const Drawer = ({ show, handleClose, categories, handleLogout, setShow }) => {
  const [open, setOpen] = useState(false);
  const { userInfo, isAdmin } = useSelector((state) => state.user);
  return (
    <>
      <Offcanvas style={{ width: 300 }} show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Link
            to="/"
            onClick={() => {
              setShow(false);
            }}
            className="offcanvas-title h2"
          >
            L<AiFillHeart style={{ color: "red", marginTop: 3 }} />
            VE COMIC
          </Link>
        </Offcanvas.Header>
        <div className="divine"></div>
        {userInfo && (
          <>
            <div className="menu-account">
              <img
                src={
                  userInfo.user_image !== null
                    ? userInfo.user_image
                    : `https://ui-avatars.com/api/name=${userInfo.user_name}&background=random&rounded=true`
                }
              ></img>
              <span style={{ paddingLeft: 10, fontSize: 17 }}>
                {userInfo.user_name}
              </span>
            </div>
            <div className="divine"></div>
          </>
        )}

        <Offcanvas.Body style={{ display: "flex", flexDirection: "column" }}>
          {userInfo && (
            <Link
              to="/account"
              onClick={() => {
                setShow(false);
              }}
              className="menu-body-item"
            >
              <MdAccountCircle className="margin-right" /> Hồ sơ
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/dashboard"
              onClick={() => {
                setShow(false);
              }}
              className="menu-body-item"
            >
              <MdSpaceDashboard className="margin-right" /> Quản lí
            </Link>
          )}
          <div
            className="menu-body-item"
            onClick={() => {
              setOpen(!open);
              // setOpenNotification(false);
            }}
            aria-controls="collapse"
            aria-expanded={open}
          >
            <ImBooks className="margin-left" /> Thể loại
            <MdArrowDropDown />
          </div>
          <div>
            <Collapse in={open}>
              <div id="collapse">
                <div className="list-category">
                  {categories.map((item, i) => {
                    const name = xoaDau(item["category_name"]);
                    return (
                      <Link
                        to={`/the-loai/${name}/${item["category_id"]}/page/1`}
                        className="category-item"
                        key={i}
                      >
                        {item["category_name"]}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Collapse>
          </div>
          <Link
            to="/lich-su"
            onClick={() => {
              setShow(false);
            }}
            className="menu-body-item"
          >
            <ImHistory className="margin-right" /> Lịch sử
          </Link>
          <Link
            to="/truyen-theo-doi"
            onClick={() => {
              setShow(false);
            }}
            className="menu-body-item"
          >
            <MdBookmark className="margin-right" /> Theo dõi
          </Link>
          <div
            className="divine"
            style={{ marginTop: 10, marginBottom: 10 }}
          ></div>
          {userInfo ? (
            <div className="menu-body-item" onClick={handleLogout}>
              <MdLogout className="margin-right" /> Đăng xuất
            </div>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => {
                  setShow(false);
                }}
                className="menu-body-item"
              >
                <MdLogin className="margin-right" /> Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => {
                  setShow(false);
                }}
                className="menu-body-item"
              >
                <AiOutlineForm className="margin-right" /> Đăng kí
              </Link>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default Drawer;
