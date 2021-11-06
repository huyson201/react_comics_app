import React, { StrictMode, useEffect, useState } from "react";
// import "./dashboard.css";
import {
  Nav,
  Navbar,
  Container,
  NavDropdown,
  Breadcrumb,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import AddChap from "./AddChap";
import ChapList from "./ChapList";
import UpdateChap from "./UpdateChap";
import comicApi from "../../api/comicApi";
import Sidebar from "./Sidebar";
import ComicList from "./Comics/ComicList";
import AddOrEditComic from "./Comics/AddOrEditComic";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import userApi from "../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { isCheck, login, setUserInfo } from "../../features/auth/userSlice";
import { removeSelectedComic } from "../../features/comics/comicSlice";
const Dashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const { number, comicId, numberPageChap, chapId } = useParams();


  const { userInfo, isLogged } = useSelector((state) => state.user);

  const dispatchUser = async (id, token) => {
    try {
      const getInfo = await userApi.getUserById(id, token);
      if (getInfo.data.data) {
        dispatch(setUserInfo(getInfo.data.data));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  //lấy thông tin user sau khi xử lý refresh token cookie
  const refreshTokenCookie = async (cookie) => {
    try {
      const res = await userApi.refreshToken(cookie);
      if (res.data.token) {
        const userFromToken = jwt_decode(res.data.token);
        dispatch(
          login({
            token: res.data.token,
            refreshToken: cookie,
          })
        );
        dispatchUser(userFromToken.user_uuid, res.data.token);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    if (userInfo === null) {
      if (Cookies.get("refreshToken")) {
        refreshTokenCookie(Cookies.get("refreshToken"));
      }
    }
  }, [isLogged]);

  useEffect(() => {
    dispatch(removeSelectedComic());
  }, [history.location]);
  return (
    <>
      <div className="container_dashboard">
        <Sidebar></Sidebar>
        <div className="main-content">
          {history.location.pathname === `/comics/${comicId}/chaps/page/${numberPageChap}` ? (
            <ChapList page={numberPageChap} />
          ) : history.location.pathname === `/comic/${comicId}/chaps/add` ? (
            <AddChap />
          ) : history.location.pathname === `/comics/${comicId}/chaps/${chapId}/update` ? (
            <UpdateChap />
          ) : number ? (
            <ComicList page={number} />
          ) : history.location.pathname === `/comics/add` ? (
            <AddOrEditComic />
          ) : history.location.pathname === `/comics/edit/${comicId}` ? (
            <AddOrEditComic id={comicId} />
          ) : (
            ""
          )}
        </div>
      </div>

      {/* <div className="container_dashboard">
                <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Doctruyen.phake</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav>
                                <Nav.Link href="#deets">Danh sách tryện</Nav.Link>
                                <Nav.Link eventKey={2} href="/comic/chaps">Danh sách chương</Nav.Link>
                                <Nav.Link eventKey={3} href="#memes">
                                    <i className="fas fa-user-circle"><span>Kieu Oanh</span></i>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Breadcrumb>
                    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
                        Truyện đã đăng
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >Tên truyện</Breadcrumb.Item>
                    <Breadcrumb.Item >Danh sách chap</Breadcrumb.Item>
                </Breadcrumb>
                {history.location.pathname === "/comic/chaps" ? <ChapList chapters={chapters} /> : history.location.pathname == "/comic/chaps/add" ? <AddChap /> : history.location.pathname == `/comic/chaps/${id}/update` ? <UpdateChap /> : ""}

            </div> */}
    </>
  );
};

export default Dashboard;
