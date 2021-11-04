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
const Sidebar = () => {
  return (
    <>
      <ProSidebar breakPoint="md">
        <SidebarHeader>
          <div className="header-text-sidebar">love comic</div>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            <MenuItem icon={<FaHeart />}>
              Dashboard
              <Link to="/dashboard" />
            </MenuItem>
            <MenuItem icon={<FaPlusCircle />}>
              Thêm mới truyện
              <Link to="/comics/add" />
            </MenuItem>
            <MenuItem icon={<FaBook />}>
              Quản lí truyện
              <Link to="/comics/page/1" />
            </MenuItem>
          </Menu>
        </SidebarContent>
        <SidebarFooter>Hihi</SidebarFooter>
      </ProSidebar>
    </>
  );
};

export default Sidebar;
