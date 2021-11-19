import React from "react";
import { FaHeart, FaPlusCircle, FaBook } from "react-icons/fa";
import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
const Sidebar = ({ toggled, handleToggleSidebar }) => {
  return (
    <>
      <ProSidebar
        breakPoint="md"
        toggled={toggled}
        onToggle={handleToggleSidebar}
      >
        <SidebarHeader style={{padding:24}}>
          <Link to="/" className="header-text-sidebar">
           l<FaHeart style={{ color: "red" }} />ve comic
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            <MenuItem
              icon={<FaHeart />}
              onClick={() => handleToggleSidebar(false)}
            >
              Dashboard
              <Link to="/dashboard" />
            </MenuItem>
            <MenuItem
              icon={<FaPlusCircle />}
              onClick={() => handleToggleSidebar(false)}
            >
              Thêm mới truyện
              <Link to="/comics/add" />
            </MenuItem>
            <MenuItem
              icon={<FaBook />}
              onClick={() => handleToggleSidebar(false)}
            >
              Quản lí truyện
              <Link to="/comics/page/1" />
            </MenuItem>
          </Menu>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </ProSidebar>
    </>
  );
};

export default Sidebar;
