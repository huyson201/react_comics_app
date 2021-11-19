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
import Sidebar from "./Sidebar";
import ComicList from "./Comics/ComicList";
import AddOrEditComic from "./Comics/AddOrEditComic";
import { GiHamburgerMenu } from "react-icons/gi";
const Dashboard = () => {
  const history = useHistory();
  const { number, comicId, numberPageChap, chapId } = useParams();
  const [toggled, setToggled] = useState(false);
  const handleToggleSidebar = (value) => {
    console.log(value)
    setToggled(value);
  };
  return (
    <>
      <div className="container_dashboard">
        <Sidebar
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
        ></Sidebar>
        <div className="dashboard-content">
          <div className="dashboard-nav-bar">
            <GiHamburgerMenu onClick={() => handleToggleSidebar(true)} />
          </div>
          <div className="main-content">
            {history.location.pathname ===
            `/comics/${comicId}/chaps/page/${numberPageChap}` ? (
              <ChapList page={numberPageChap} />
            ) : history.location.pathname === `/comic/${comicId}/chaps/add` ? (
              <AddChap />
            ) : history.location.pathname ===
              `/comics/${comicId}/chaps/${chapId}/update` ? (
              <UpdateChap id={chapId} />
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
